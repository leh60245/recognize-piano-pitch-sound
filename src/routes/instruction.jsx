import React, { useState, useEffect, useRef } from "react";
import * as mobilenet from '@tensorflow-models/mobilenet'

import "../App.css";

function useGetImgUrl() {
  const imgUrl = "https://picsum.photos/v2/list?limit=500";
  const [imgList, setImgList] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  useEffect(() => {
    fetch(imgUrl)
      .then((res) => res.json())
      .then((res) => {
        setImgList(res);
        // console.log(res)
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    if (imgList.length === 0) return;
    getImgUrl();
  }, [imgList]);
  function getImgUrl() {
    if (imgList.length === 0) return "";
    imgList.sort(() => 0.5 - Math.random());
    setCurrentImageUrl(
      `https://picsum.photos/id/${imgList[0].id}/${window.innerWidth}/${
        window.innerHeight - 150
      }`
    );
  }
  return [currentImageUrl, getImgUrl];
}

function ImageClassifier({ net }) {
  const [imgUrl, getImgUrl] = useGetImgUrl();
  const imgRef = useRef();
  const [results, setResults] = useState([]);
  useEffect(() => {
    if (!imgUrl || !net) return;
    imgRef.current.onload = () => {
      net.classify(imgRef.current).then((results) => setResults(results));
    };
  }, [imgUrl, net]);
  return (
    <div>
      <img src={imgUrl} ref={imgRef} crossorigin="anonymous" />
      <br />
      {results.length > 0 && (
        <>
          <p>Detected: {results[0].className}</p>
          <p>Probability: {(results[0].probability * 100).toFixed(2) + "%"}</p>
        </>
      )}
      <button onClick={getImgUrl}>New Photo</button>
    </div>
  );
}

function Instruction({ props }) {
  const [isLoading, setIsLoading] = useState(true);
  const netRef = useRef(null);
  useEffect(() => {
    mobilenet.load().then((net) => {
      // console.log('Model loaded to memory!')
      netRef.current = net;
      setIsLoading(false);
    });
  }, []);
  return (
    <div>

      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <ImageClassifier net={netRef.current} />
      )}
    </div>
  );
}

export default Instruction;
