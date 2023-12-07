import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import {
  CircularProgress,
  CircularProgressLabel,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";

// tf
import * as poseDetection from '@tensorflow-models/pose-detection';

// Utils
import { getSpeech } from "../utils/getSpeech";

// CSS
import "../App.css";

// fastApi
// import fastapi from "./lib/api";

function Exercise({ props }) {
  const webcamRef = useRef(null);
  const [value, setValue] = useState("안녕하세요");

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
  };

  // 이미지 출력 결과 받기
  // const [imgResult, setimgResult] = useState([]);

  // useEffect(() => {
  //   fastapi("get", "/api/question/list", {}, (json) => {
  //     setimgResult(json);
  //   });
  // }, []);

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
    <SimpleGrid columns={3} spacing={10}>
      <Box>
        <CircularProgress value={40} color="green" size='400px'>
          <CircularProgressLabel>40%</CircularProgressLabel>
        </CircularProgress>
      </Box>
      <Box>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button onClick={capture}>캡쳐</button>
      </Box>
      <Box>
        <div className="box">
          <input onChange={handleInput} value={value} />
          <button onClick={handleButton}>음성 변환</button>
        </div>
      </Box>
    </SimpleGrid>
  );
}

export default Exercise;
