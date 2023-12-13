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
import { CloseIcon } from "@chakra-ui/icons";

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
import keypointsKoreaName from "./keypoints_korea_name.json";

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
  const critical_point = 40;
  const webcamRef = useRef(null); // webcam
  const canvasRef = useRef(null); // canvas
  const navigate = useNavigate(); // page간 이동

  const [poses, setPoses] = useState(null); // 감지된 포즈 상태
  const [poseAccuracy, setPoseAccuracy] = useState(0); // 포즈 정확도를 위한 상태 변수

  const [currentStep, setCurrentStep] = useState(0); // 현재 단계
  const [isProcessing, setIsProcessing] = useState(true); // 단계 진행 가능 여부

  const thresholdByClass = [0.3, 0.38, 0.32]; // 각 클레스 별 임계값
  const stepsData = duringExerciseData.step; // 단계별 데이터
  const keypointsKoreaNames = keypointsKoreaName.ko_name; // keypoints의 한국 이름

  const getKeypointName = (id) => {
    return keypointsKoreaNames[id].ko_name || "알 수 없음";
  };

  // 뒤로 가기 함수
  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

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

      // 마지막 스텝까지 오면 종료
      if (currentStep === stepsData.length - 1) navigate("/");

      // 필요한 keypoints가 모두 감지되었는지 확인
      const now_pose = poses; // poses 데이터 저장
      const undetectedKeypoints = step.need_to_know_keypoints
        .filter((keypointIndex) => {
          const keypoint =
            poses && poses.length > 0
              ? poses[0].keypoints[keypointIndex]
              : null;
          return !keypoint || keypoint.score <= 0.4;
        })
        .map(getKeypointName);

      if (now_pose === null) {
        // 전혀 사람이 보이지 않거나 카메라가 사람 일부분도 찾지 못할 때.
        await speakText(duringExerciseData.cannot_recognize[2].recognize);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setIsProcessing(false);
        return;
      } else if (undetectedKeypoints.length > 0) {
        // 감지되지 않은 keypoints에 대한 음성 메시지
        const message = `보이지 않는 부위가 있습니다: ${undetectedKeypoints.join(
          ", "
        )}입니다. 다시 조정 바랍니다.`;
        await speakText(message);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setIsProcessing(false);
        return;
      }

      // 모델 사용 여부
      if (step.use_model) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const imageSrc = captureImage(webcamRef);
        const response = await sendImageToServer(imageSrc);
        // console.log(
        //   step.class,
        //   response.predicted_class,
        //   response.acc_arr[step.class],
        //   thresholdByClass[step.class]
        // );
        if (
          step.class !== response.predicted_class &&
          response.acc_arr[step.class] < thresholdByClass[step.class]
        ) {
          // 예측한 class가 다르고, 실제로 일정 임계값 보다 정확도가 작다면 틀린 자세로 인정
          await speakText(duringExerciseData.check[0].recognize);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          setIsProcessing(false);
          return;
        } else {
          // 자세가 옳바를 때
          await speakText(duringExerciseData.check[1].recognize);
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
    setTimeout(() => processPoseDetection(net), 3000);
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
        speakText(duringExerciseData.today_mission[0].recognize);
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
      if (window.speechSynthesis) {
        // 현재 재생 중인 음성이 있으면 중단
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  return (
    <SimpleGrid columns={3} spacing={10}>
      <Box>
        <CloseIcon
          onClick={handleGoBack}
          position="absolute"
          left="10px"
          top="10px"
          boxSize={40}
        />
        <Text
          color={poseAccuracy > critical_point ? "#008000" : "#800080"}
          fontSize="50px"
        >
          인식 {poseAccuracy > critical_point ? "좋음" : "나쁨"}
        </Text>
        <CircularProgress
          value={poseAccuracy}
          color={poseAccuracy > critical_point ? "#008000" : "#800080"}
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
        <Text color="black" fontSize="40px">
          현재 {currentStep}번 단계 입니다.
        </Text>
        <CircularProgress
          value={(currentStep / (stepsData.length - 2)) * 100}
          color="#008000"
          size="400px"
        >
          <CircularProgressLabel>
            {currentStep.toFixed(0)} / {stepsData.length - 2}
          </CircularProgressLabel>
        </CircularProgress>
      </Box>
    </SimpleGrid>
  );
}

export default Exercise;
