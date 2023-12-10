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

// 이미지를 서버에 전송하는 함수
const sendImageToServer = async (imageSrc) => {
  try {
    // console.log(imageSrc);
    // console.log(typeof imageSrc);
    const response = await fetch("http://localhost:8000/uploadfile/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_str: imageSrc }),
    });
    // 서버로부터 응답 처리
    const data = await response.json();
    // console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

// 운동 전 함수

function Exercise({ props }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [value, setValue] = useState("안녕하세요");
  const [accrue, setAccrue] = useState(0);
  // 포즈 정확도를 위한 상태 변수
  const [poseAccuracy, setPoseAccuracy] = useState(0);

  // load posenet
  const runPosenet = async () => {
    await tf.ready();
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    const net = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    return net;
  };

  useEffect(() => {
    let isMounted = true;

    runPosenet().then((net) => {
      if (isMounted) {
        detect(net); // 첫 번째 호출
      }
    });

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 상태 업데이트
    };
  }, []);

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
      const imageSrc = webcamRef.current.getScreenshot();
      // 비디오 넓이 지정
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // 디텍션 시작
      const poses = await net.estimatePoses(video);
      if (poses.length > 0) {
        // 각 키포인트 점수의 평균을 계산하여 정확도 계산
        const scores = poses[0].keypoints.map((kp) => kp.score);
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        // 정확도를 퍼센트로 변환 (0에서 100 사이)
        setPoseAccuracy(averageScore * 100);
      }

      // 이미지 보내기
      sendImageToServer(imageSrc);

      // detect 함수가 완료된 후, 1초(1000ms) 후에 다시 호출
      setTimeout(() => detect(net), 5000);
    }
  };

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
        <CircularProgress value={poseAccuracy} color={poseAccuracy > 20 ? "green" : "red"} size="400px">
          <CircularProgressLabel>
            {poseAccuracy.toFixed(0)}%
          </CircularProgressLabel>
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
