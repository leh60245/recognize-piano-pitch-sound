import { useEffect, useState } from "react";
import { useRoutes, Link } from "react-router-dom";
import {
  Image,
  Box,
  Text,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Center,
} from "@chakra-ui/react";

// Routes
import Exercise from "./routes/exercise";
import Setting from "./routes/setting";
import Instruction from "./routes/instruction";

// Utils
import { getSpeech } from "./utils/getSpeech";

// img
import exerciseImg from "./src/stretching-exercises.png";
import settingImg from "./src/settings.png";
import instruction from "./src/guidebook.png";

import "./App.css";

function Home({ props }) {
  const [hover, setHover] = useState("");

  const menuList = [
    {
      id: "exercise",
      link: "/exercise",
      img: exerciseImg,
      icorn: "_Icon_exercise",
      text: "오늘의 운동 시작",
    },
    {
      id: "setting",
      link: "/setting",
      img: settingImg,
      icorn: "_Icon_setting",
      text: "개인 설정",
    },
    {
      id: "instruction",
      link: "/instruction",
      img: instruction,
      icorn: "_Icon_instruction",
      text: "사용 설명서",
    },
  ];
  const linkMenuList = menuList.map((menu) => (
    <Link
      key={menu.id}
      to={menu.link}
      style={{ textDecoration: "none" }}
      onFocus={() => setHover(menu.text)}
      onBlur={() => setHover("")}
    >
      <Box w="100%" h="100%" border="20px" backgroundColor="#009E73">
        <Card
          onMouseEnter={() => setHover(menu.text)}
          onBlur={() => setHover("")}
          maxW={{ base: "100%", sm: "200px" }}
        >
          <CardHeader>
            <Image w="100%" h="100%" id="image" src={menu.img} />
          </CardHeader>
          <CardBody>
            <Text fontSize="50px">{menu.text}</Text>
          </CardBody>
        </Card>
      </Box>
    </Link>
  ));

  // 텍스트가 변경되면 읽어줍니다.
  useEffect(() => {
    getSpeech(hover);
    console.log(hover);
  }, [hover]);

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 호출되는 정리 함수
    return () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        // 현재 재생 중인 음성이 있으면 중단
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <Center>
      <HStack>{linkMenuList}</HStack>
    </Center>
  );
}

function App() {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/exercise", element: <Exercise /> },
    { path: "/setting", element: <Setting /> },
    { path: "/instruction", element: <Instruction /> },
  ]);

  return <div className="App">{routes}</div>;
}

export default App;
