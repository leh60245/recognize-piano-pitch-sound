import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const [question_list, setQuestionList] = useState([]);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // 캡쳐된 이미지를 사용하거나 저장할 수 있습니다.
    console.log(imageSrc);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/question/list')
      .then((response) => { response.json()
        .then((json) => {
          setQuestionList(json);
        })
      })
      .catch((error) => {
        console.error("Error fetching question data:", error)
      });
  }, []);


  return (
    <div className="App">
      {question_list.map((elem, index) => {
        return (
          <div key={index}>
            <h2>{elem.subject}</h2>
          </div>
        );
      })}
      {/* <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>캡쳐</button> */}
    </div>
  );
}

export default App;
