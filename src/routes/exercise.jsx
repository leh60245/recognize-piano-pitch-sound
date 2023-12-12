import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

import {
  CircularProgress,
  CircularProgressLabel,
  SimpleGrid,
  Box,
  Text,
} from "@chakra-ui/react";

// tf
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

// Utils
import { speakText } from "../utils/getSpeech";

// CSS
import "../App.css";

// Data
// import beforeExerciseData from "./before_exercise.json";
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

function Exercise({ props }) {
  const critical_point = 50;
  const webcamRef = useRef(null); // webcam
  const canvasRef = useRef(null); // canvas
  const navigate = useNavigate();

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
      console.log(stepsData.length);
      // 마지막 스텝까지 오면 종료
      if (currentStep === stepsData.length - 1) navigate("/");

      // 필요한 keypoints가 모두 감지되었는지 확인
      const now_pose = poses; // poses 데이터 저장
      const allKeyPointsDetected =
        now_pose !== null && now_pose.length > 0 && now_pose[0] !== undefined
          ? step.need_to_know_keypoints.every((keypointIndex) => {
              const keypoint = now_pose[0].keypoints[keypointIndex];
              return keypoint && keypoint.score > 0.4;
            })
          : false;

      if (now_pose === null) {
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
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const imageSrc = captureImage(webcamRef);
        const response = await sendImageToServer(imageSrc);
        if (step.class !== response.predict_class) {
          // 자세가 틀렸을 때
          await speakText(duringExerciseData.check[0]);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          setIsProcessing(false);
          return;
        } else {
          // 자세가 옳바를 때
          await speakText(duringExerciseData.check[1]);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
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
      console.log("movenet의 정확도", accuracy);
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

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 호출되는 정리 함수
    return () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        // 현재 재생 중인 음성이 있으면 중단
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  return (
    <SimpleGrid columns={3} spacing={10}>
      <Box>
        <Text
          color={poseAccuracy > { critical_point } ? "green" : "red"}
          fontSize="50px"
        >
          인식 {poseAccuracy > { critical_point } ? "좋음" : "나쁨"}
        </Text>
        <CircularProgress
          value={poseAccuracy}
          color={poseAccuracy > { critical_point } ? "green" : "red"}
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
