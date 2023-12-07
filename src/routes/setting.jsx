import React from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

import "../App.css";

function Setting({ props }) {
  let net;
  const camera = React.useRef();
  const figures = React.useRef();
  const webcamElement = camera.current;

  const run = async () => {
    net = await mobilenet.load();

    const webcam = await tf.data.webcam(webcamElement, {
      resizeWidth: 224,
      resizeHeight: 224,
    }); // 이미지 데이터의 크기 지정

    while (true) {
      const img = await webcam.capture(); // 이미지를 나타내는 텐서를 반환.
      const result = await net.classify(img); // 모델 추정 결과


      if (figures.current) {
        figures.current.innerText = `prediction : ${result[0].className} \n probability: ${result[0].probability}`;
      }

      img.dispose();

      await tf.nextFrame();
    }
  };
  React.useEffect(() => {
    run();
  }, []);

  return (
    <>
      <div ref={figures}></div>
      <video
        autoPlay={true}
        playsInline={true}
        muted={true}
        ref={camera}
        width="500"
        height="500"
      />
    </>
  );
}

export default Setting;
