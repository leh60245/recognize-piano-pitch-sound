import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import Home from "./routes/home"

import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const [question_list, setQuestionList] = useState([]);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // 캡쳐된 이미지를 사용하거나 저장할 수 있습니다.
    console.log(imageSrc);
  };

  return (
    <div className="App">
      { Home() }
      {/* <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>캡쳐</button> */}
    </div>
  );
}

export default App;
