// import React from "react";

import "../App.css";
import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import sheetImagePath from "./sheet-image-path.json";
const sheetImagesPath = sheetImagePath.images; // keypoints의 한국 이름

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggle} style={{ marginBottom: '5px', cursor: 'pointer' }}>
        {title}
      </button>
      {isOpen && (
        <div style={{ margin: '5px 0' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const SheetMusicSelector = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    setImages(sheetImagesPath)
  })

  // Handle image selection
  const handleSelection = (filename) => {
    import(`../src/sheet/${filename}`)
      .then(image => setSelectedImage(image.default))
      .catch(error => console.error('Error loading image:', error));
  };

  return (
    <div>
      <h1>Select Sheet Music</h1>
      <Collapsible title="View Sheet Music List">
        <ul>
          {images.map((filename, index) => (
            <li key={index} style={{ cursor: 'pointer', listStyleType: 'none' }} onClick={() => handleSelection(filename)}>
              {filename.split('.')[0]}
            </li>
          ))}
        </ul>
      </Collapsible>
      {selectedImage && (
        <div>
          <img src={selectedImage} alt="Selected Sheet Music" style={{ width: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};



const AudioStreamer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const mediaStream = useRef(null); // Hold the media stream

  useEffect(() => {
    // Setup the Wavesurfer instance
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        progressColor: 'purple',
        height: 100,
        barWidth: 2,
        responsive: true,
        backend: 'MediaElement'
      });
    }
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaStream.current = stream; // Store the stream globally
        if (wavesurfer.current) {
          const audioContext = new AudioContext();
          const mediaStreamSource = audioContext.createMediaStreamSource(stream);
          const mediaElement = document.createElement('audio');
          mediaElement.srcObject = stream;
          mediaElement.addEventListener('loadedmetadata', () => {
            mediaElement.play();
          });
          wavesurfer.current.load(mediaElement);
        }
      })
      .catch(err => {
        console.error("Error accessing the microphone:", err);
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (wavesurfer.current) {
      wavesurfer.current.stop();
    }
    if (mediaStream.current) {
      const tracks = mediaStream.current.getTracks(); // Get all tracks from the stream
      tracks.forEach(track => track.stop()); // Stop each track
      mediaStream.current = null; // Clear the stored stream
    }
  };

  return (
    <div>
      <h1>Real-time Audio Visualizer</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div id="waveform" ref={waveformRef} style={{ width: '100%', height: '100px', border: '1px solid black' }}></div>
      <p>Status: {isRecording ? 'Recording' : 'Not Recording'}</p>
      <SheetMusicSelector />
    </div>

  );
};

export default AudioStreamer;
