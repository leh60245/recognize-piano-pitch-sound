import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

// Utils
import { getSpeech } from "../utils/getSpeech";

import "../App.css";

function Exercise({ props }) {
  const webcamRef = useRef(null);
  const [value, setValue] = useState("안녕하세요");

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // 캡쳐된 이미지를 사용하거나 저장할 수 있습니다.
    console.log(imageSrc);
  };

  //음성 변환 목소리 preload
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const handleInput = (e) => {
    const { value } = e.target;
    setValue(value);
  };

  const handleButton = () => {
    getSpeech(value);
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>캡쳐</button>
      <div className="box">
        <input onChange={handleInput} value={value} />
        <button onClick={handleButton}>음성 변환</button>
      </div>
    </div>
  );
}

export default Exercise;
