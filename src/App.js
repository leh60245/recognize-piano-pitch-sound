import logo from "./logo.svg";
import React, { useRef } from "react";
import Webcam from "react-webcam";

import "./App.css";

function App() {
  const webcamRef = React.useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // 캡쳐된 이미지를 사용하거나 저장할 수 있습니다.
    console.log(imageSrc);
  };
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>캡쳐</button>
    </div>
  );
}

export default App;
