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
    const response = await fetch("http://localhost:8000/uploadfile/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_str: imageSrc }),
    });
    // 서버로부터 응답 처리
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
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
// 카메라에 각 keypoint가 들어와 있는지 확인하는 용도입니다.
const calculatePoseAccuracy = (poses) => {
  if (poses && poses.length > 0) {
    const scores = poses[0].keypoints.map((kp) => kp.score);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  return 0;
};

// text 길이만큼 음성 알림을 하며 대기합니다.
const speakText = async (text) => {
  getSpeech(text);
  const delay = text.length * 100;
  await new Promise((resolve) => setTimeout(resolve, delay));
};

function Exercise({ props }) {
  const webcamRef = useRef(null); // webcam
  const canvasRef = useRef(null); // canvas

  const [poses, setPoses] = useState(null); // 감지된 포즈 상태
  const [poseAccuracy, setPoseAccuracy] = useState(0); // 포즈 정확도를 위한 상태 변수

  const [currentStep, setCurrentStep] = useState(0); // 현재 단계
  const [isProcessing, setIsProcessing] = useState(true); // 단계 진행 가능 여부
  const stepsData = duringExerciseData.step; // 단계별 데이터

  // load movenet
  const runPosenet = async () => {
    await tf.ready();
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    const net = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    console.log("comlpet to load movenet");
    return net;
  };

  // 현재 step의 처리를 수행하는 함수
  const processCurrentStep = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const step = stepsData[currentStep];
    if (step) {
      // 음성 알림을 합니다.
      await speakText(step.recognize);
      // 5초 대기
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 필요한 keypoints가 모두 감지되었는지 확인
      const allKeyPointsDetected =
        poses !== null
          ? step.need_to_know_keypoints.every(
              (keypointIndex) => poses[0].keypoints[keypointIndex].score > 0.4
            )
          : false;

      if (poses === null) {
        // 전혀 사람이 보이지 않거나 카메라가 사람 일부분도 찾지 못할 때.
        await speakText(duringExerciseData.cannot_recognize[2].recognize);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setIsProcessing(false);
        return;
      } else if (!allKeyPointsDetected) {
        // 필요한 keypoints가 감지되지 않은 경우 처리 로직
        await speakText(duringExerciseData.cannot_recognize[1].recognize);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setIsProcessing(false);
        return;
      }

      // 모델 사용 여부
      if (step.use_model) {
        const imageSrc = captureImage(webcamRef);
        const response = await sendImageToServer(imageSrc);
        // console.log(response);
      } else {
      }

      setCurrentStep((current) => current + 1);
    }
    setIsProcessing(false);
  };

  // 포즈 감지 및 처리 로직
  const processPoseDetection = async (net) => {
    const detectedPoses = await detectPose(net, webcamRef); // 감지합니다.

    if (detectedPoses) {
      setPoses(detectedPoses);
      const accuracy = calculatePoseAccuracy(detectedPoses);
      setPoseAccuracy(accuracy * 100);
      console.log(accuracy);
    } 

    // 함수 실행이 완료된 후 일정 시간(1초 = 1000) 후에 다시 호출
    setTimeout(() => processPoseDetection(net), 4000);
  };

  // useEffect 내부
  useEffect(() => {
    if (!isProcessing) {
      processCurrentStep();
    }
  }, [currentStep, isProcessing]);
  useEffect(() => {
    let isMounted = true;
    runPosenet().then((net) => {
      if (isMounted) {
        processPoseDetection(net); // 첫 번째 호출
        setIsProcessing(false);
      }
    });
    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 상태 업데이트
    };
  }, []);

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
            transform: "scaleX(-1)", // 좌우 반전 적용
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
