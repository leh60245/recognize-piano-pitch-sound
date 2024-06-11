import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Text, Box, List, ListItem, Heading, Center,HStack,
    VStack,Stack,Image } from '@chakra-ui/react';
import sheetImagePath from './sheet-image-path.json';
import sheet1 from "../src/FZ1.png";
import sheet2 from "../src/FZ2.png";
import barimg from "../src/bar.png";
import dialTest from "../src/Dial/Online_0.png"
//import { atom, useRecoilState, RecoilRoot } from 'recoil';
import song from '../src/Frere Jacques.mp3';
import "./testTypeSuiSou0.css"





const sheetImagesPath = sheetImagePath.images;


//const playState = atom < Boolean > ({
//    key: 'playState',
//    default: false,
//});

//function AudioPlayer() {
//   const myRef = useRef < HTMLAudioElement > (null);
//    const [play, setPlay] = useRecoilState(playState);
    // 재생
    //const start = () => {
      //  if (myRef.current) {
        //    myRef.current.play()
        //}
        //setPlay(true);
    //};
    // 일시 정지
    //const stop = () => {
      //  if (myRef.current) {
        //    myRef.current.pause()
        //}
        //setPlay(false);
    //};

    //useEffect(() => {
      //  if (!myRef.current) return;
        //if (play) {
          //  myRef.current.play();
        //} else myRef.current.pause();
    //}, [play]);

    //return (
      //  <>
        //    <h1>AudioPlayer</h1>
          //  <audio ref={myRef} src={song} controls loop></audio>
            //<br />
            //<br />
            //{play ?
                // 일시정지 버튼
             //   (<button onClick={stop}>
               //     일시정지
                //</button>) :
                // 재생 버튼
                //(<button onClick={start}>
                  //  재생
                //</button>)
            //}
        //</>
    //)
//}

function TestComponent({count}) {
    return count>=10    ? <div>0:{count}</div> : <div>0:0{count}    </div>;
}



function SuiSou () {
  //const [images, setImages] = useState([]);
  //const navigate = useNavigate();

  //useEffect(() => {
  //  setImages(sheetImagesPath);
  //}, []);

  //const handleSelection = (filename) => {
  //  navigate('/audiostreamer', { state: { selectedSheetMusic: filename } });
  //};
   //const myRef = useRef < HTMLAudioElement > (null);
   //const [play, setPlay] = useRecoilState(playState);
    //const TestObj = 10;
    const [TestObj,setObj] = useState(0);
    const onClickPlay = () => {
        setObj(TestObj + 1);
    };
    const onClickStop = () => {
        setObj(0);
    };
    //오디오 재생 구현부
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [progressBarLeft, setProgressBarLeft] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(audioRef.current.currentTime * 1000); // 밀리초 단위로 변환

            const progressBarLeft = (audioRef.current.currentTime * 1000 / audioRef.current.duration) * 2- 600; // 재생 시간에 따라 위치계산
            setProgressBarLeft(progressBarLeft);
        };

        



        audioRef.current.addEventListener('timeupdate', updateTime);

        return () => {
            audioRef.current.removeEventListener('timeupdate', updateTime);
        };
    }, []);


   return (
        <Stack spacing={3}>
           <Text fontSize='50px' as='b'>Frere Jaques</Text>
           <Center>
               <audio ref={audioRef} controls>
                   <source src={song} type="audio/mp3" />
               </audio>
            



           </Center>
           <p>Current Time: {currentTime} milliseconds</p>

           <Center>
           <TestComponent count={TestObj} />
           <div style={{display:'flex'}}>
            <button onClick={onClickPlay}>Play</button>
                   <button onClick={onClickPlay}>Pause</button>
                   <button onClick={onClickStop }>Stop</button>
               </div>
               </Center>
           <HStack>
               <Image
                   w="20%"
                   objectFit='cover'
                   src={dialTest}
                   alt='SuiSou'
               />
               <VStack>
                   <div class="item-box">
                       <div class="image">
                           <img src={sheet1} alt='SuiSou1'/> 
                               </div>
                       <div class="bar" style={{ left: progressBarLeft + 'px' }} >
                           <img src={barimg} alt='SuiSou1' />
                           </div>
                       </div>
                    <Image
                    w="100%"
                    objectFit='cover'
                   src={sheet2}
                   alt='SuiSou2'
                />
               </VStack>
               </HStack>
            
        </Stack>
        
  );
};

export default SuiSou;
