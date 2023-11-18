import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // 캡쳐된 이미지를 사용하거나 저장할 수 있습니다.
    console.log(imageSrc);
  };

  useEffect(() => {
    // API 호출
    fetch("http://127.0.0.1:8000/hello")
      .then((response) => response.json())
      .then((json) => {
        setMessage(json.message); // 상태 업데이트
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // 빈 배열을 전달하여 한 번만 호출되도록 설정

  return (
    <div className="App">
      {/* <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>캡쳐</button> */}
      <h1>{message}</h1>
    </div>
  );
}

export default App;
