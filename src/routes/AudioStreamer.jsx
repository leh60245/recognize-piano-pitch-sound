import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import { Box, Button, Center, Image, Text, Flex } from '@chakra-ui/react';

const AudioStreamer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const mediaStream = useRef(null);
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState('');
  const slideBarRef = useRef(null);
  const sliderIntervalRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.selectedSheetMusic) {
      import(`../src/sheet/${location.state.selectedSheetMusic}`)
        .then(image => setSelectedImage(image.default))
        .catch(error => console.error('Error loading image:', error));
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
        backend: 'WebAudio', // Use WebAudio backend for real-time streaming
      });
    }
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const startCountdown = (resume = false) => {
    setIsCountingDown(true);
    setCountdown(1);

    const countdownInterval = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          if (resume) {
            beginRecording(currentTime);
          } else {
            beginRecording();
          }
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const beginRecording = (resumeTime = 0) => {
    setIsRecording(true);
    setIsPaused(false);
    setSliderPosition((resumeTime / 30) * 100); // Set initial position based on resume time
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaStream.current = stream;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);

        // Create a MediaElementAudioSourceNode to connect the media stream to WaveSurfer
        const mediaElement = document.createElement('audio');
        mediaElement.srcObject = stream;
        mediaElement.play();

        // Load the media element into WaveSurfer
        wavesurfer.current.load(mediaElement);

        // Start the slider animation
        const duration = 30; // Duration of the song in seconds, you can adjust this
        const intervalTime = 1000 / 60; // 60 fps
        let currentTimeLocal = resumeTime;
        sliderIntervalRef.current = setInterval(() => {
          if (!isPaused) {
            currentTimeLocal += intervalTime / 1000;
            setCurrentTime(currentTimeLocal);
            let position = (currentTimeLocal / duration) * 100;
            if (position >= 100) {
              position = 0;
              currentTimeLocal = 0;
            }
            setSliderPosition(position);
          }
        }, intervalTime);
      })
      .catch(err => {
        console.error("Error accessing the microphone:", err);
        setIsRecording(false);
      });
  };

  const pauseRecording = () => {
    setIsPaused(true);
    setIsRecording(false);
    if (wavesurfer.current) {
      wavesurfer.current.pause();
    }
    if (sliderIntervalRef.current) {
      clearInterval(sliderIntervalRef.current);
    }
    if (mediaStream.current) {
      const tracks = mediaStream.current.getTracks();
      tracks.forEach(track => track.stop());
      mediaStream.current = null;
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setCurrentTime(0);
    if (wavesurfer.current) {
      wavesurfer.current.stop();
    }
    if (mediaStream.current) {
      const tracks = mediaStream.current.getTracks();
      tracks.forEach(track => track.stop());
      mediaStream.current = null;
    }
    if (sliderIntervalRef.current) {
      clearInterval(sliderIntervalRef.current);
    }
    setSliderPosition(0);
  };

  return (
    <Center flexDirection="column">
      <Text fontSize="2xl">Real-time Audio Visualizer</Text>
      <Flex my={4}>
        {!isRecording && !isCountingDown && !isPaused && (
          <Button onClick={() => startCountdown(false)} mx={2}>Start Recording</Button>
        )}
        {isRecording && !isPaused && (
          <Button onClick={pauseRecording} mx={2}>Pause Recording</Button>
        )}
        {!isRecording && !isCountingDown && isPaused && (
          <Button onClick={() => startCountdown(true)} mx={2}>Resume Recording</Button>
        )}
        {(isRecording || isPaused) && (
          <Button onClick={stopRecording} mx={2}>Stop Recording</Button>
        )}
      </Flex>
      {isCountingDown && (
        <Text fontSize="4xl" my={4}>{countdown}</Text>
      )}
      <Box id="waveform" ref={waveformRef} w="100%" h="100px" border="1px solid black" />
      <Text>Status: {isCountingDown ? 'Counting Down' : isRecording ? 'Recording' : isPaused ? 'Paused' : 'Not Recording'}</Text>
      <Link to="/select-sheet-music">
        <Button my={4}>Select Sheet Music</Button>
      </Link>
      {selectedImage && (
        <Box position="relative" w="100%" overflow="hidden">
          <Image src={selectedImage} alt="Selected Sheet Music" w="100%" h="auto" />
          {(isRecording || isPaused) && (
            <Box
              ref={slideBarRef}
              position="absolute"
              top="0"
              bottom="0"
              width="2px"
              bg="red"
              style={{ left: `${sliderPosition}%` }}
            />
          )}
        </Box>
      )}
    </Center>
  );
};

export default AudioStreamer;
