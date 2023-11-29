import React from "react";

import { Link } from 'react-router-dom';

import "../App.css";

function Home({props}) {

  return (
    <>
      {props.map((elem) => {
        return (
          <div key={elem.id}>
            <li>{elem.id}. {elem.subject}</li>
            <Link to="/">link</Link>
          </div>
        );
      })}
    </>
  );
}

export default Home;
