import React, { useState } from "react";
import { CirclePicker } from "react-color";
import { useNavigate } from "react-router-dom";

import { Heading, Container } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// CSS
import "../App.css";

//Editor: 신성호(CheshireZzz)
//Edit Date/Time: 12/12/2023 04:03:24 UTC+9

// 배경을 변경해주는 Color Picker
const Setting = () => {
  const [color, setColor] = useState("#000");
  const navigate = useNavigate(); // page간 이동

  // 뒤로 가기 함수
  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleChangeComplete = (color) => {
    setColor(color.hex);

    document.body.style.backgroundColor = color.hex;
  };

  // CirclePicker 사용한 이유: 해당 라이브러리에서 사이즈 변경 가능한 유일한 Color Picker였음
  return (
    <Container>
      <CloseIcon
        onClick={handleGoBack}
        position="absolute"
        left="10px"
        top="10px"
        boxSize={40}
      />
      <Heading as="h1" size="7xl">
        배경 화면 색상 변경
      </Heading>
      <CirclePicker
        width="100%"
        circleSize={250}
        colors={[
          "#B80000",
          "#DB3E00",
          "#FCCB00",
          "#008B02",
          "#006B76",
          "#1273DE",
          "#004DCF",
          "#5300EB",
          "#EB9694",
          "#FAD0C3",
          "#FEF3BD",
          "#C1E1C5",
          "#BEDADC",
          "#C4DEF6",
          "#BED3F3",
          "#D4C4FB",
          "#000000",
          "#FFFFFF",
        ]}
        color={color}
        onChangeComplete={handleChangeComplete}
      />
    </Container>
  );
};

export default Setting;
