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
  const mediaRecorder = useRef(null);
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
    if (ws.current) {
      ws.current.onmessage = (event) => {
        const message = event.data;
        if (message.startsWith("Recognized notes:")) {
          const notesData = message.replace("Recognized notes:", "").trim();
          const correctedData = notesData.replace(/'/g, '"'); // Replace single quotes with double quotes
          try {
            const parsedData = JSON.parse(correctedData);
            if (parsedData.length > 0) {
              const [note, pitch] = parsedData[0];
              setBackendPitch({ note, pitch });
            }
          } catch (error) {
            console.error('데이터 파싱 오류:', error);
          }
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

  const createWavHeader = (buffer, dataSize) => {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    /* RIFF identifier */
    view.setUint32(0, 1380533830, false);
    /* file length */
    view.setUint32(4, 36 + dataSize, true);
    /* RIFF type */
    view.setUint32(8, 1463899717, false);
    /* format chunk identifier */
    view.setUint32(12, 1718449184, false);
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, 44100, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, 44100 * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    view.setUint32(36, 1684108385, false);
    /* data chunk length */
    view.setUint32(40, dataSize, true);

    const combined = new Uint8Array(header.byteLength + buffer.byteLength);
    combined.set(new Uint8Array(header), 0);
    combined.set(new Uint8Array(buffer), header.byteLength);
    return combined;
  };

  const beginRecording = async () => {
    setIsRecording(true);
    setIsPaused(false);

    // WebSocket 연결 설정
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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.current.readyState === WebSocket.OPEN) {
          event.data.arrayBuffer().then(buffer => {
            const wavBuffer = createWavHeader(buffer, event.data.size);
            ws.current.send(wavBuffer);
          });
        }
      };

      mediaRecorder.current.start(100); // Send data every 100ms
    } catch (err) {
      console.error("마이크 접근 오류:", err);
      setIsRecording(false);
    }
  };

  const pauseRecording = () => {
    setIsPaused(true);
    if (mediaRecorder.current) {
      mediaRecorder.current.pause();
    }
  };

  const resumeRecording = () => {
    setIsPaused(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.resume();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current = null;
    }
    if (ws.current) {
      ws.current.close();
    }
  };

  const drawNote = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const note = notes[currentNoteIndex];

      if (backendPitch && backendPitch.note !== note.pitch) {
        incorrectNotes.current.push(note);
      }

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      // Draw all incorrect notes in red
      incorrectNotes.current.forEach(note => {
        ctx.beginPath();
        ctx.arc(note.x, note.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
      // Draw the current note in blue
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
