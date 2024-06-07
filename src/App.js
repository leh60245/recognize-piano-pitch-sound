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
  VStack,
  Center,
} from "@chakra-ui/react";

// Routes

import Setting from "./routes/setting";
import Instruction from "./routes/instruction";
import SheetMusicSelectorPage from './routes/SheetMusicSelectorPage';
import AudioStreamer from './routes/AudioStreamer';
import SuiSou from './routes/SuiSou';

// img
import exerciseImg from "./src/stretching-exercises.png";
import settingImg from "./src/settings.png";
import instruction from "./src/guidebook.png";
import logoImg from "./src/BPL.png"
import SuiSouImg from "./src/suisou.png"
import sheetmenuIcon from "./src/sheetmenuIcon.png"

import "./App.css";

function Home({ props }) {
  const [hover, setHover] = useState("");

  const menuList = [
    {
       id: "sheetMusicSelectorPage",
       link: "/sheetMusicSelectorPage",
          img: sheetmenuIcon,
       icorn: "_Icon_instruction",
       text: "악보 연습",
      },
    {
       id: "Suisou",
       link: "/Suisou",
        img: SuiSouImg,
       icorn: "_Icon_setting",
       text: "오늘의 추천 악보",
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
      text: "설정",
    },
  ];


  const linkMenuList = menuList.map((menu) => (
    <Link
      key={menu.id}
      to={menu.link}
      style={{ textDecoration: "none" }}
    >
          <Box maxW='sm' borderWidth="10px" borderRadius='lg' border='1px' borderColor='gray.200' >
        <Card maxW={{ base: "100%", sm: "100px" }}>
          <CardHeader>
            <Image w="50%" h="100%" id="image" src={menu.img} />
          </CardHeader>
          <CardBody>
            <Text fontSize="50px">{menu.text}</Text>
          </CardBody>
        </Card>
      </Box>
    </Link>
  ));

  useEffect(() => {
    console.log(hover);
  }, [hover]);


    return (
        <VStack>
            <Image
                w="50%"
                objectFit='cover'
                src={logoImg}
                alt='Dan Abramov'
            />
    <Center>
      <HStack>{linkMenuList}</HStack>
            </Center>
            </VStack>
  );
}

function App() {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    
    { path: "/setting", element: <Setting /> },
    { path: "/instruction", element: <Instruction /> },
    { path: "/sheetMusicSelectorPage", element: <SheetMusicSelectorPage /> },
    { path: "/audiostreamer", element: <AudioStreamer /> },
    { path: "/SuiSou", element: <SuiSou /> },
  ]);

  return <div className="App">{routes}</div>;
}

export default App;
