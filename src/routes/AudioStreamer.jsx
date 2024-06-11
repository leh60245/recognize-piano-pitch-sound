import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  { beat: 1, note: '시플랫', pitch: 'Bb4', x: 936, y: 117 },
  { beat: 2, note: '도', pitch: 'C5', x: 1009, y: 110 },
  { beat: 1, note: '라', pitch: 'A4', x: 1141, y: 124 },
  { beat: 1, note: '시플랫', pitch: 'Bb4', x: 1215, y: 117 },
  { beat: 2, note: '도', pitch: 'C5', x: 1289, y: 110 },
];

const AudioStreamer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [backendPitch, setBackendPitch] = useState(null); // 백엔드에서 받은 pitch 정보를 저장
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const mediaStream = useRef(null);
  const audioContext = useRef(null);
  const scriptProcessor = useRef(null);
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState('');
  const canvasRef = useRef(null);
  const ws = useRef(null);

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
    if (ws.current) {
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.pitch) {
          setBackendPitch(data.pitch);
        }
      };
    }
  }, [ws.current]);

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

  const sendAudioData = (audioData) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && audioData.length > 0) {
      const audioBlob = new Blob(audioData, { type: 'audio/wav' });
      ws.current.send(audioBlob);
    }
  };

  const createAudioBuffer = async (audioData) => {
    const buffer = audioContext.current.createBuffer(1, audioData.length, audioContext.current.sampleRate);
    buffer.copyToChannel(audioData, 0);
    return buffer;
  };

  const processAudioData = async (event) => {
    const audioData = event.inputBuffer.getChannelData(0);
    sendAudioData(audioData); // 실시간으로 오디오 데이터를 전송
    if (wavesurfer.current) {
      const buffer = await createAudioBuffer(audioData);
      wavesurfer.current.loadDecodedBuffer(buffer);
    }
  };

  const beginRecording = () => {
    setIsRecording(true);
    setIsPaused(false);

    // WebSocket 연결 설정
    ws.current = new WebSocket('http://127.0.0.1:5000/');
    ws.current.onopen = () => {
      console.log('WebSocket 연결 성공');
    };
    ws.current.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };
    ws.current.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaStream.current = stream;
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.current.createMediaStreamSource(stream);
        scriptProcessor.current = audioContext.current.createScriptProcessor(2048, 1, 1);

        scriptProcessor.current.onaudioprocess = processAudioData;

        source.connect(scriptProcessor.current);
        scriptProcessor.current.connect(audioContext.current.destination);
      })
      .catch(err => {
        console.error("마이크 접근 오류:", err);
        setIsRecording(false);
      });
  };

  const pauseRecording = () => {
    setIsPaused(true);
    scriptProcessor.current?.disconnect();
  };

  const resumeRecording = () => {
    setIsPaused(false);
    const source = audioContext.current.createMediaStreamSource(mediaStream.current);
    source.connect(scriptProcessor.current);
    scriptProcessor.current.connect(audioContext.current.destination);
    scriptProcessor.current.onaudioprocess = processAudioData;
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
    }
    if (audioContext.current && audioContext.current.state !== 'closed') {
      audioContext.current.close().catch(error => console.error('AudioContext 닫기 오류:', error));
    }
    if (ws.current) {
      ws.current.close();
    }
  };

  const drawNote = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const note = notes[currentNoteIndex];

      if (backendPitch && backendPitch !== note.pitch) {
        ctx.beginPath();
        ctx.arc(note.x, note.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    }
  };

  useEffect(() => {
    if (isRecording && !isPaused && currentNoteIndex < notes.length) {
      drawNote();
      const timeout = setTimeout(() => {
        setCurrentNoteIndex(prevIndex => (prevIndex + 1) % notes.length);
      }, notes[currentNoteIndex].beat * 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentNoteIndex, isRecording, isPaused, backendPitch]);

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
        {!isRecording && !isCountingDown && isPaused && (
          <Button onClick={() => startCountdown(true)} mx={2}>녹음 재개</Button>
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
    </Center>
  );
};

export default AudioStreamer;
