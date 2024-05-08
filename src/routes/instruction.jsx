// import React from "react";

import "../App.css";
import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioStreamer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [socket, setSocket] = useState(null);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = new WebSocket('ws://localhost:8000');
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Setup the Wavesurfer instance
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        progressColor: 'purple',
        height: 100,
        barWidth: 2
      });
    }

    return () => wavesurfer.current && wavesurfer.current.destroy();
  }, []);

  const startRecording = () => {
    setMetronomeActive(true);
    let count = 0;
    const metronomeInterval = setInterval(() => {
      console.log('Tick'); // Simulate metronome tick
      count++;
      if (count >= 4) {
        clearInterval(metronomeInterval);
        setMetronomeActive(false);
        setIsRecording(true);

        // Start visualizing the audio
        if (wavesurfer.current) {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
              wavesurfer.current.loadMediaElement(stream);
              wavesurfer.current.play();
            });
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (isRecording) {
      // Implement your existing recording logic here
    }
  }, [isRecording]);

  return (
    <div>
      <h1>Real-time Audio Streamer with Metronome</h1>
      <button onClick={startRecording} disabled={metronomeActive || isRecording}>
        {metronomeActive ? 'Metronome Active' : (isRecording ? 'Stop Recording' : 'Start Recording')}
      </button>
      <div id="waveform" ref={waveformRef}></div>
      <p>Status: {isRecording ? 'Recording' : (metronomeActive ? 'Waiting: Metronome active' : 'Not Recording')}</p>
    </div>
  );
};

export default AudioStreamer;
