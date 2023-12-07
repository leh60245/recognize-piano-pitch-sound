import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import {
  CircularProgress,
  CircularProgressLabel,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";

// tf
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

// Utils
import { getSpeech } from "../utils/getSpeech";

// CSS
import "../App.css";

// fastApi
// import fastapi from "./lib/api";

function Exercise({ props }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [value, setValue] = useState("안녕하세요");
  

  // load posenet
  const runPosenet = async () => {
    await tf.ready();
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const net = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    // 계속 감지
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // 비디오 속성 가져오기.
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // 비디오 넓이 지정
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // 디텍션 시작
      const poses = await net.estimatePoses(video);
      console.log(poses);
    }
  };

  runPosenet();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
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
    <SimpleGrid columns={3} spacing={10}>
      <Box>
        <CircularProgress value={40} color="green" size="400px">
          <CircularProgressLabel>40%</CircularProgressLabel>
        </CircularProgress>
      </Box>
      <Box>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          screenshotFormat="image/jpeg"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
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

// 이미지 출력 결과 받기
// const [imgResult, setimgResult] = useState([]);

// useEffect(() => {
//   fastapi("get", "/api/question/list", {}, (json) => {
//     setimgResult(json);
//   });
// }, []);
