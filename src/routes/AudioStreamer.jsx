import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import { Box, Button, Center, Image, Text, Flex } from '@chakra-ui/react';

const AudioStreamer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const mediaStream = useRef(null);
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState('');

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

  const startRecording = () => {
    setIsCountingDown(true);
    setCountdown(4);

    const countdownInterval = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          beginRecording();
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const beginRecording = () => {
    setIsRecording(true);
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
      })
      .catch(err => {
        console.error("Error accessing the microphone:", err);
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (wavesurfer.current) {
      wavesurfer.current.empty();
    }
    if (mediaStream.current) {
      const tracks = mediaStream.current.getTracks();
      tracks.forEach(track => track.stop());
      mediaStream.current = null;
    }
  };

  return (
    <Center flexDirection="column">
      <Text fontSize="2xl">Real-time Audio Visualizer</Text>
      <Button onClick={isRecording ? stopRecording : startRecording} my={4}>
        {isRecording ? 'Stop Recording' : (isCountingDown ? 'Recording in...' : 'Start Recording')}
      </Button>
      {isCountingDown && (
        <Text fontSize="4xl" my={4}>{countdown}</Text>
      )}
      <Box id="waveform" ref={waveformRef} w="100%" h="100px" border="1px solid black" />
      <Text>Status: {isRecording ? 'Recording' : 'Not Recording'}</Text>
      {selectedImage && (
        <Flex w="100%" justifyContent="flex-end" overflow="hidden">
          <Box w="80%" maxW="100%">
            <Image src={selectedImage} alt="Selected Sheet Music" w="100%" h="auto" />
          </Box>
        </Flex>
      )}
    </Center>
  );
};

export default AudioStreamer;
