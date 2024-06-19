import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import { Box, Button, Center, Image, Text, Flex } from '@chakra-ui/react';

const notes = [
  { beat: 1, note: '파', pitch: 'F3', x: 228, y: 137 },
  { beat: 1, note: '솔', pitch: 'G3', x: 302, y: 130 },
  { beat: 1, note: '라', pitch: 'A3', x: 377, y: 124 },
  { beat: 1, note: '파', pitch: 'F3', x: 452, y: 137 },
  { beat: 1, note: '파', pitch: 'F3', x: 545, y: 137 },
  { beat: 1, note: '솔', pitch: 'G3', x: 619, y: 130 },
  { beat: 1, note: '라', pitch: 'A3', x: 694, y: 124 },
  { beat: 1, note: '파', pitch: 'F3', x: 768, y: 137 },
  { beat: 1, note: '라', pitch: 'A3', x: 861, y: 124 },
  { beat: 1, note: '시플랫', pitch: 'A#3', x: 936, y: 117 },
  { beat: 2, note: '도', pitch: 'C4', x: 1009, y: 110 },
  { beat: 1, note: '라', pitch: 'A3', x: 1141, y: 124 },
  { beat: 1, note: '시플랫', pitch: 'A#3', x: 1215, y: 117 },
  { beat: 2, note: '도', pitch: 'C4', x: 1289, y: 110 },
];

const AudioStreamer = () => {
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태
  const [isPaused, setIsPaused] = useState(false); // 일시정지 상태
  const [isCountingDown, setIsCountingDown] = useState(false); // 카운트다운 상태
  const [countdown, setCountdown] = useState(4); // 카운트다운 타이머
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0); // 현재 노트 인덱스
  const [backendNote, setBackendNote] = useState(null); // 백엔드에서 받은 노트 정보
  const [incorrectMessage, setIncorrectMessage] = useState(''); // 잘못된 노트에 대한 메시지
  const [showRepeatPrompt, setShowRepeatPrompt] = useState(false); // 반복 메시지 표시 상태
  const [incorrectNotes, setIncorrectNotes] = useState({}); // 잘못된 노트 저장
  const waveformRef = useRef(null); // WaveSurfer 참조
  const wavesurfer = useRef(null); // WaveSurfer 인스턴스
  const audioContext = useRef(null); // AudioContext 인스턴스
  const scriptProcessor = useRef(null); // ScriptProcessorNode 인스턴스
  const location = useLocation(); // 현재 위치
  const [selectedImage, setSelectedImage] = useState(''); // 선택된 악보 이미지
  const canvasRef = useRef(null); // 캔버스 참조
  const ws = useRef(null); // WebSocket 참조
  const isWaiting = useRef(false); // 0.5초 대기 상태
  const isSoundDetected = useRef(false); // 소리 인식 상태

  // 선택된 악보 이미지를 설정
  useEffect(() => {
    if (location.state?.selectedSheetMusic) {
      import(`../src/sheet/${location.state.selectedSheetMusic}`)
        .then(image => setSelectedImage(image.default))
        .catch(error => console.error('이미지 로드 중 오류:', error));
    }
  }, [location.state]);

  // WaveSurfer 초기화 및 정리
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

  // WebSocket 연결 초기화 및 정리
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
      if (message) {
        setBackendNote(message);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // 카운트다운 시작
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

  // 녹음 시작
  const beginRecording = async () => {
    setIsRecording(true);
    setIsPaused(false);
    setShowRepeatPrompt(false); // 숨기기
    setIncorrectNotes({}); // 잘못된 노트 초기화

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.current.createMediaStreamSource(stream);
      scriptProcessor.current = audioContext.current.createScriptProcessor(1024, 1, 1);

      scriptProcessor.current.onaudioprocess = (event) => {
        const audioData = event.inputBuffer.getChannelData(0);
        detectSound(audioData); // 소리 인식 함수 호출
        if (wavesurfer.current) {
          const buffer = audioContext.current.createBuffer(1, audioData.length, audioContext.current.sampleRate);
          buffer.copyToChannel(audioData, 0);
          wavesurfer.current.loadDecodedBuffer(buffer);
        }
        if (!showRepeatPrompt) {
          sendAudioData(audioData);
        }
      };

      source.connect(scriptProcessor.current);
      scriptProcessor.current.connect(audioContext.current.destination);
    } catch (err) {
      console.error("마이크 접근 오류:", err);
      setIsRecording(false);
    }
  };

  // 소리 인식 함수
  const detectSound = (audioData) => {
    const threshold = 0.01; // 소리 인식 임계값
    isSoundDetected.current = audioData.some(sample => Math.abs(sample) > threshold);
  };

  // 오디오 데이터 전송
  const sendAudioData = (audioData) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && audioData.length > 0 && !isWaiting.current && isSoundDetected.current && !showRepeatPrompt) {
      const float32Buffer = new Float32Array(audioData);
      ws.current.send(float32Buffer.buffer);
    }
  };

  // 녹음 일시정지
  const pauseRecording = () => {
    setIsPaused(true);
    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
    }
  };

  // 녹음 재개
  const resumeRecording = () => {
    setIsPaused(false);
    if (scriptProcessor.current) {
      const stream = audioContext.current.createMediaStreamSource(stream);
      stream.connect(scriptProcessor.current);
      scriptProcessor.current.connect(audioContext.current.destination);
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setCurrentNoteIndex(0);
    clearCanvas();
    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
    }
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
  };

  // 캔버스 비우기
  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // 노트 비교 함수
  const compareNotes = (backendNote, note) => {
    return backendNote && note && backendNote[0] === note[0];
  };

  // 노트 그리기
  const drawNote = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const note = notes[currentNoteIndex];

      clearCanvas();

      if (backendNote !== null) {
        ctx.beginPath();
        ctx.arc(note.x, note.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = compareNotes(backendNote, note.pitch) ? 'blue' : 'red';
        ctx.fill();
      }

      if (compareNotes(backendNote, note.pitch)) {
        const nextNote = notes[(currentNoteIndex + 1) % notes.length];
        isWaiting.current = true; // 대기 상태 설정
        setTimeout(() => {
          if (currentNoteIndex + 1 === notes.length) {
            setShowRepeatPrompt(true); // 마지막 노트에 도달했을 때 메시지 표시
            setIsRecording(false); // 소리 인식 중지

            // 잘못된 노트에 빨간 반투명 상자 그리기
            Object.values(incorrectNotes).forEach(note => {
              ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // 빨간색 불투명도
              ctx.fillRect(note.x - 15, note.y - 15, 30, 30);
            });
          } else {
            setCurrentNoteIndex((currentNoteIndex + 1) % notes.length);
            setIncorrectMessage('');
            ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; // 파란색 불투명도
            ctx.fillRect(nextNote.x - 15, nextNote.y - 15, 30, 30); // 반투명 사각형 그리기
          }
          isWaiting.current = false; // 대기 상태 해제
        }, 500); // 0.5초 후 다음 노트로 이동
      } else if (backendNote !== null) {
        setIncorrectNotes(prevNotes => {
          const newNotes = { ...prevNotes };
          const noteKey = `${note.note}_${note.x}_${note.y}`;
          if (newNotes[noteKey]) {
            newNotes[noteKey].count += 1;
            newNotes[noteKey].index = currentNoteIndex;
          } else {
            newNotes[noteKey] = { ...note, count: 1, index: currentNoteIndex };
          }
          return newNotes;
        });
        setIncorrectMessage(`올바르지 않은 음: ${backendNote}`);
      }
    }
  };

  // 반복 기능 핸들러
  const handleRepeat = () => {
    clearCanvas(); // 캔버스 비우기
    setIncorrectMessage('');
    setCurrentNoteIndex(0);
    setBackendNote(null); // 현재 노트 초기화
    setShowRepeatPrompt(false);
    setIsCountingDown(true);
    setCountdown(4);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          beginRecording();
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 녹음 상태에 따라 노트 그리기
  useEffect(() => {
    if (isRecording && !isPaused) {
      drawNote();
    }
  }, [backendNote, isRecording, isPaused]);

  // 컴포넌트 언마운트 시 녹음 중지
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
        <Text fontSize="xl" color="red">{incorrectMessage}</Text>
      </Box>
      {showRepeatPrompt && (
        <Box mt={4}>
          <Text fontSize="xl">모든 노트를 연주했습니다. 다시 반복하시겠습니까?</Text>
          <Text fontSize="lg" color="red">틀린 노트:</Text>
          {Object.values(incorrectNotes).map(note => (
            <Text key={note.index} color="red">{`위치: ${note.index}, 노트: ${note.note}, 틀린 횟수: ${note.count}`}</Text>
          ))}
          <Button onClick={handleRepeat} mt={2}>다시 시작</Button>
        </Box>
      )}
    </Center>
  );
};

export default AudioStreamer;
