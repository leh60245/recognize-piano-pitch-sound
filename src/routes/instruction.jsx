// import React from "react";

import "../App.css";
import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import React, { useState, useEffect } from 'react';

const SheetMusicSelector = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  // Fetch image list from JSON file
  useEffect(() => {
    fetch('./sheet-image-path.json')  // Adjust the path as necessary
      .then(response => response.json())
      .then(data => setImages(data.images))
      .catch(error => console.error('Error loading image list:', error));
  }, []);

  // Handle image selection
  const handleSelection = (filename) => {
    import(`./sheet/${filename}`)
      .then(image => setSelectedImage(image.default))
      .catch(error => console.error('Error loading image:', error));
  };

  return (
    <div>
      <h1>Select Sheet Music</h1>
      {images.length > 0 ? (
        <ul>
          {images.map((filename, index) => (
            <li key={index} style={{ cursor: 'pointer' }} onClick={() => handleSelection(filename)}>
              {filename.split('.')[0]}  {/* Display name without file extension */}
            </li>
          ))}
        </ul>
      ) : <p>Loading images...</p>}
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
    </div>
  );
};

export default AudioStreamer;
