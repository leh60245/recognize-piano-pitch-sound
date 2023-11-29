import { useRef, useEffect, useState} from "react";
import { useRoutes } from "react-router-dom";

// Routes
import Home from "./routes/home";
// import Detail from "./routes/detail";

// Webcam
import Webcam from "react-webcam";

// fastapi
import fastapi from "./lib/api";

import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const [question_list, setQuestionList] = useState([]);

  useEffect(() => {
    fastapi("get", "/api/question/list", {}, (json) => {
      setQuestionList(json);
    });
  }, []);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // 캡쳐된 이미지를 사용하거나 저장할 수 있습니다.
    console.log(imageSrc);
  };



  const routes = useRoutes([{ path: "/", element: <Home props={question_list}/> }]);
  return (
    <div className="App">
      {routes}

      {/* <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>캡쳐</button> */}
    </div>
  );
}

export default App;
