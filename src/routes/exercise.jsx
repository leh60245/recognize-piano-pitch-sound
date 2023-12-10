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

// Data
import beforeExerciseData from "./before_exercise.json";
import duringExerciseData from "./during_exercise.json";

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

// 포즈 감지 함수
const detectPose = async (net, webcamRef) => {
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4
  ) {
    const video = webcamRef.current.video;
    const poses = await net.estimatePoses(video);
    return poses;
  }
  return null;
};

// 이미지 캡처 함수
const captureImage = (webcamRef) => {
  return webcamRef.current ? webcamRef.current.getScreenshot() : null;
};

// 포즈 정확도 계산 함수
const calculatePoseAccuracy = (poses) => {
  if (poses && poses.length > 0) {
    const scores = poses[0].keypoints.map((kp) => kp.score);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  return 0;
};

const needAIModel = async (imageSrc, step) => {
  // 비동기 작업
  const response = await sendImageToServer(imageSrc);
  // 결과 처리
  // step의 wait_time만큼 대기
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response); // wait_time 후에 Promise 해결
    }, step.wait_time * 1000); // wait_time이 초 단위라고 가정
  });
};

// needAlternativeMethod 함수 - AI 모델이 필요 없을 때 사용
const needAlternativeMethod = (step) => {
  // 다른 처리 로직
  console.log("Alternative method for step", step.id);
  // Promise 반환을 위한 예시 (실제 구현에 따라 다를 수 있음)
  return new Promise((resolve) => {
    // 처리 로직
    resolve();
  });
};

function Exercise({ props }) {
  const webcamRef = useRef(null); // webcam
  const canvasRef = useRef(null); // canvas
  const [poseAccuracy, setPoseAccuracy] = useState(0); // 포즈 정확도를 위한 상태 변수

  const [currentStep, setCurrentStep] = useState(0); // 현재 단계
  const [isProcessing, setIsProcessing] = useState(false);
  const stepsData = duringExerciseData.step; // 단계별 데이터

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

  // useEffect 내부
  useEffect(() => {

    // 현재 step의 처리
    processCurrentStep();
  }, [currentStep]);

  useEffect(() => {
    let isMounted = true;

    runPosenet().then((net) => {
      if (isMounted) {
        processPoseDetection(net); // 첫 번째 호출
      }
    });

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 상태 업데이트
    };
  }, []);

  // 현재 step의 처리를 수행하는 함수
  const processCurrentStep = async () => {
    const step = stepsData[currentStep];
    if (step && !isProcessing) {
      setIsProcessing(true);

      const imageSrc = captureImage(webcamRef);
      const promise = step.use_model
        ? needAIModel(imageSrc, step)
        : needAlternativeMethod(step);
      await promise;
      console.log(currentStep);
      console.log(promise);
      setIsProcessing(false);

      // 다음 단계로 진행
      if (currentStep < stepsData.length - 1) {
        setCurrentStep((current) => current + 1);
      }
    }
  };

  // 포즈 감지 및 처리 로직
  const processPoseDetection = async (net) => {
    const poses = await detectPose(net, webcamRef);
    if (poses) {
      const accuracy = calculatePoseAccuracy(poses);
      setPoseAccuracy(accuracy * 100);
    }

    // 함수 실행이 완료된 후 일정 시간(1초 = 1000) 후에 다시 호출
    setTimeout(() => processPoseDetection(net), 10000);
  };

  return (
    <SimpleGrid columns={3} spacing={10}>
      <Box>
        <CircularProgress
          value={poseAccuracy}
          color={poseAccuracy > 20 ? "green" : "red"}
          size="400px"
        >
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
      </Box>
      <Box>
        <div className="box"></div>
      </Box>
    </SimpleGrid>
  );
}

export default Exercise;
