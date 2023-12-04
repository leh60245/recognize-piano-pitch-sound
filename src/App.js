import { useEffect, useState } from "react";
import { useRoutes, useNavigate, Link } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Avatar,
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Divider,
  ButtonGroup,
  SimpleGrid,
} from "@chakra-ui/react";

// Routes
import Exercise from "./routes/exercise";
// import Detail from "./routes/detail";

// fastapi
import fastapi from "./lib/api";

import "./App.css";

function Home({ props }) {
  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    >
      <Link to="/exercise" style={{ textDecoration: "none" }}>
        <Card>
          <CardHeader>
            <Heading size="md"> _Icon_exercise </Heading>
          </CardHeader>
          <CardBody>
            <Text>오늘의 운동 시작</Text>
          </CardBody>
        </Card>
      </Link>
      <Link to="/setting" style={{ textDecoration: "none" }}>
        <Card>
          <CardHeader>
            <Heading size="md"> _Icon_setting </Heading>
          </CardHeader>
          <CardBody>
            <Text>개인 설정</Text>
          </CardBody>
        </Card>
      </Link>
      <Link to="/instruction" style={{ textDecoration: "none" }}>
        <Card>
          <CardHeader>
            <Heading size="md"> _Icon_instruction </Heading>
          </CardHeader>
          <CardBody>
            <Text>사용 설명서</Text>
          </CardBody>
        </Card>
      </Link>
    </SimpleGrid>
  );
}

function App() {
  const [question_list, setQuestionList] = useState([]);

  useEffect(() => {
    fastapi("get", "/api/question/list", {}, (json) => {
      setQuestionList(json);
    });
  }, []);

  const routes = useRoutes([
    { path: "/", element: <Home props={question_list} /> },
    { path: "/exercise", element: <Exercise /> },
  ]);

  return <div className="App">{routes}</div>;
}

export default App;
