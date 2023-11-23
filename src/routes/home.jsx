import React, { useEffect, useState } from "react";

import "../App.css";

function Home() {
  const [question_list, setQuestionList] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/question/list")
      .then((response) => {
        response.json().then((json) => {
          setQuestionList(json);
        });
      })
      .catch((error) => {
        console.error("Error fetching question data:", error);
      });
  }, []);

  return (
    <>
      {question_list.map((elem, index) => {
        return (
          <div key={index}>
            <h2>{elem.subject}</h2>
          </div>
        );
      })}
    </>
  );
}

export default Home;