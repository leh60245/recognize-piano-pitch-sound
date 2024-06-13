import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import { Box, Button, Center, Image, Text, Flex } from '@chakra-ui/react';

const notes = [
  { beat: 1, note: '파', pitch: 'F4', x: 228, y: 137 },
  { beat: 1, note: '솔', pitch: 'G4', x: 302, y: 130 },
  { beat: 1, note: '라', pitch: 'A4', x: 377, y: 124 },
  { beat: 1, note: '파', pitch: 'F4', x: 452, y: 137 },
  { beat: 1, note: '파', pitch: 'F4', x: 545, y: 137 },
  { beat: 1, note: '솔', pitch: 'G4', x: 619, y: 130 },
  { beat: 1, note: '라', pitch: 'A4', x: 694, y: 124 },
  { beat: 1, note: '파', pitch: 'F4', x: 768, y: 137 },
  { beat: 1, note: '라', pitch: 'A4', x: 861, y: 124 },
  { beat: 1, note: '시플랫', pitch: 'A#4', x: 936, y: 117 },
  { beat: 2, note: '도', pitch: 'C5', x: 1009, y: 110 },
  { beat: 1, note: '라', pitch: 'A4', x: 1141, y: 124 },
  { beat: 1, note: '시플랫', pitch: 'A#4', x: 1215, y: 117 },
  { beat: 2, note: '도', pitch: 'C5', x: 1289, y: 110 },
];

const AudioStreamer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [backendNote, setBackendNote] = useState(null); // 백엔드에서 받은 note 정보를 저장
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const audioContext = useRef(null);
  const scriptProcessor = useRef(null);
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState('');
  const canvasRef = useRef(null);
  const ws = useRef(null);
  const incorrectNotes = useRef([]);

  useEffect(() => {
    if (location.state?.selectedSheetMusic) {
      import(`../src/sheet/${location.state.selectedSheetMusic}`)
        .then(image => setSelectedImage(image.default))
        .catch(error => console.error('이미지 로드 중 오류:', error));
    }
  }, [location.state]);

  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        progressColor: 'purple',
        height: 100,
        barWidth: 2,
        responsive: true,
        backend: 'WebAudio',
      });
    }
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
      stopRecording();
    };
  }, []);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000');
    ws.current.onopen = () => {
      console.log('WebSocket 연결 성공');
    };
    ws.current.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };
    ws.current.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    ws.current.onmessage = (event) => {
      const message = event.data;
      console.log('Received from backend:', message);
      setBackendNote(message);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const startCountdown = (resume = false) => {
    setIsCountingDown(true);
    setCountdown(4);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          resume ? resumeRecording() : beginRecording();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginRecording = async () => {
    setIsRecording(true);
    setIsPaused(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.current.createMediaStreamSource(stream);
      scriptProcessor.current = audioContext.current.createScriptProcessor(1024, 1, 1);

      scriptProcessor.current.onaudioprocess = (event) => {
        const audioData = event.inputBuffer.getChannelData(0);
        if (wavesurfer.current) {
          const buffer = audioContext.current.createBuffer(1, audioData.length, audioContext.current.sampleRate);
          buffer.copyToChannel(audioData, 0);
          wavesurfer.current.loadDecodedBuffer(buffer);
        }
        sendAudioData(audioData);
      };

      source.connect(scriptProcessor.current);
      scriptProcessor.current.connect(audioContext.current.destination);
    } catch (err) {
      console.error("마이크 접근 오류:", err);
      setIsRecording(false);
    }
  };

  const sendAudioData = (audioData) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && audioData.length > 0) {
      const float32Buffer = new Float32Array(audioData);
      ws.current.send(float32Buffer.buffer);
    }
  };

  const pauseRecording = () => {
    setIsPaused(true);
    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
    }
  };

  const resumeRecording = () => {
    setIsPaused(false);
    if (scriptProcessor.current) {
      const stream = audioContext.current.createMediaStreamSource(stream);
      stream.connect(scriptProcessor.current);
      scriptProcessor.current.connect(audioContext.current.destination);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setCurrentNoteIndex(0);
    incorrectNotes.current = [];
    clearCanvas();
    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
    }
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
    if (ws.current) {
      ws.current.close();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const drawNote = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const note = notes[currentNoteIndex];

      if (backendNote && backendNote !== note.pitch) {
        incorrectNotes.current.push(note);
      }

      clearCanvas();
      incorrectNotes.current.forEach(note => {
        ctx.beginPath();
        ctx.arc(note.x, note.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(note.x, note.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = 'blue';
      ctx.fill();
    }
  };

  useEffect(() => {
    if (isRecording && !isPaused && currentNoteIndex < notes.length) {
      drawNote();
      const timeout = setTimeout(() => {
        const nextIndex = (currentNoteIndex + 1) % notes.length;
        setCurrentNoteIndex(nextIndex);
        if (nextIndex === 0) {
          incorrectNotes.current = [];
          clearCanvas();
        }
        setBackendNote(null); // Reset backendNote for the next note
      }, notes[currentNoteIndex].beat * 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentNoteIndex, isRecording, isPaused, backendNote]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [location]);

  return (
    <Center flexDirection="column">
      <Text fontSize="2xl">실시간 오디오 시각화</Text>
      <Flex my={4}>
        {!isRecording && !isCountingDown && !isPaused && (
          <Button onClick={() => startCountdown(false)} mx={2}>녹음 시작</Button>
        )}
        {isRecording && !isPaused && (
          <Button onClick={pauseRecording} mx={2}>녹음 일시정지</Button>
        )}
        {isPaused && (
          <Button onClick={resumeRecording} mx={2}>녹음 재개</Button>
        )}
        {(isRecording || isPaused) && (
          <Button onClick={stopRecording} mx={2}>녹음 중지</Button>
        )}
      </Flex>
      {isCountingDown && (
        <Text fontSize="4xl" my={4}>{countdown}</Text>
      )}
      <Box id="waveform" ref={waveformRef} w="100%" h="100px" border="1px solid black" />
      <Text>상태: {isCountingDown ? '카운트다운 중' : isRecording ? '녹음 중' : isPaused ? '일시정지됨' : '녹음 안 함'}</Text>
      
      {selectedImage && (
        <Box position="relative" w="100%" display="flex" justifyContent="center">
          <Image src={selectedImage} alt="선택된 악보" style={{ maxWidth: '100%', height: 'auto' }} />
          <canvas ref={canvasRef} width="1500" height="250" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
        </Box>
      )}
      <Box mt={4}>
        <Text fontSize="xl">현재 인식된 음: {backendNote || '없음'}</Text>
      </Box>
    </Center>
  );
};

export default AudioStreamer;
