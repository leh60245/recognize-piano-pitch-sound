import { useEffect, useState } from "react";
import { useRoutes, Link } from "react-router-dom";
import {
  Text,
  Card,
  CardHeader,
  CardBody,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";

// Routes
import Exercise from "./routes/exercise";
import Setting from "./routes/setting";
import Instruction from "./routes/instruction";

// Utils
import { getSpeech } from "./utils/getSpeech";

// fastapi
// import fastapi from "./lib/api";

import "./App.css";

function Home({ props }) {
  const [hover, setHover] = useState("");
  const menuList = [
    {
      id: "exercise",
      link: "/exercise",
      icorn: "_Icon_exercise",
      text: "오늘의 운동 시작",
    },
    {
      id: "setting",
      link: "/setting",
      icorn: "_Icon_setting",
      text: "개인 설정",
    },
    {
      id: "instruction",
      link: "/instruction",
      icorn: "_Icon_instruction",
      text: "사용 설명서",
    },
  ];
  const linkMenuList = menuList.map((menu) => (
    <Link to={menu.link} style={{ textDecoration: "none" }} onFocus={() => setHover(menu.text)} onBlur={() => setHover('')} >
      <Card onMouseEnter={() => setHover(menu.text)} onBlur={() => setHover('')} >
        <CardHeader>
          <Heading size="md"> {menu.icorn} </Heading>
        </CardHeader>
        <CardBody>
          <Text>{menu.text}</Text>
        </CardBody>
      </Card>
    </Link>
  ));

  useEffect(() => {
    getSpeech(hover);
    console.log(hover);
  }, [hover]);

  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    >
      {linkMenuList}
    </SimpleGrid>
  );
}

function App() {
  // const [question_list, setQuestionList] = useState([]);

  // useEffect(() => {
  //   fastapi("get", "/api/question/list", {}, (json) => {
  //     setQuestionList(json);
  //   });
  // }, []);

  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/exercise", element: <Exercise /> },
    { path: "/setting", element: <Setting /> },
    { path: "/instruction", element: <Instruction /> },
  ]);

  return <div className="App">{routes}</div>;
}

export default App;
