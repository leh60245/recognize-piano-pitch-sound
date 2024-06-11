import React, { useState, useEffect, useRef } from 'react';

const AudioStreamer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [noteStatus, setNoteStatus] = useState(null); // 추가: 음표 상태를 저장
  const mediaStream = useRef(null);
  const webSocket = useRef(null);
  const mediaRecorder = useRef(null);

  useEffect(() => {
    webSocket.current = new WebSocket('ws://localhost:8000/ws/voice/');

    webSocket.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    webSocket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    webSocket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    webSocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNoteStatus(data.isCorrect ? 'Correct' : 'Incorrect');
      if (data.isCorrect) {
        // 다음 음표로 이동하는 로직을 여기에 추가
      } else {
        startRecording(); // 다시 소리를 인식하도록 재시작
      }
    };

    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, []);

  const sendAudioData = (data) => {
    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(data);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaStream.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            sendAudioData(event.data);
          }
        };

        mediaRecorder.current.start(100); // Collect 100ms chunks of audio
      })
      .catch(err => {
        console.error("Error accessing the microphone:", err);
        setIsRecording(false);
      });
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      const tracks = mediaStream.current.getTracks();
      tracks.forEach(track => track.stop());
      mediaStream.current = null;
    }
  };

  return (
    <div>
      <h1>Real-time Audio Streamer</h1>
      {!isRecording && <button onClick={startRecording}>Start Recording</button>}
      {isRecording && !isPaused && <button onClick={pauseRecording}>Pause Recording</button>}
      {isPaused && <button onClick={resumeRecording}>Resume Recording</button>}
      {isRecording && <button onClick={stopRecording}>Stop Recording</button>}
      <p>Status: {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Not Recording'}</p>
      <p>Note Status: {noteStatus}</p>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src="path/to/your/sheet_music_image.png"
          alt="Sheet Music"
          style={{ width: '80%' }}
        />
      </div>
    </div>
  );
};

export default AudioStreamer;
