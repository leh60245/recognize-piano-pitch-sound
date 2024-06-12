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
import dialOnline1 from "../src/Dial/Online_1.png"
import dialOnline2 from "../src/Dial/Online_2.png"
import dialOnline3 from "../src/Dial/Online_3.png"
import dialOnline4 from "../src/Dial/Online_4.png"
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
    const [progressBarLeft, setProgressBarLeft] = useState(0);//재생바 왼쪽오른쪽
    const [progressBarTop, setProgressBarTop] = useState(0); //재생바 위아래
    const [dialimageSrc, setdialimageSrc] = useState('/images/Online_0.png');


    function frzqDial(suisouTime) {
        var suiKatSou = 1;
        if (suisouTime > 3.7) { suiKatSou = parseInt((suisouTime - 3.7) / (0.2)) % 4; }
        else {
            suiKatSou = 0;
        }
        console.log(suiKatSou);
        return ('/images/Online_' + suiKatSou + '.png');
    }

    function frzqXY(suisouTime) {
        var suiKatSou = 0;
        if (suisouTime < 3.5) {
            suiKatSou = 100;
        }
        else if (suisouTime < 5.8) {
            suiKatSou = 148+((suisouTime-3.5)/(5.8-3.5))*(545-228);
        }
        else if (suisouTime < 8.6) {
            suiKatSou =  (465 )+ ((suisouTime - 5.8) / (8.6 - 5.8)) * (861 - 545);
        }
        else if (suisouTime < 10.7) {
            suiKatSou =  (781 )+ ((suisouTime - 8.6) / (10.7 - 8.6)) * (1141 - 861);
        }
        else if (suisouTime < 13.3) {
            suiKatSou = (1061) + ((suisouTime - 10.7) / (5.8 - 3.5)) * (1141 - 861);
        }




        else {
            suiKatSou = -500 + suisouTime;
        }
        return suiKatSou;
    }


    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(audioRef.current.currentTime * 1000); // 밀리초 단위로 변환

            //const progressBarLeft = (audioRef.current.currentTime * 1000 / audioRef.current.duration) * 2 - 600; // 재생 시간에 따라 위치계산: 높이의 경우 0,260
            const progressBarLeft = frzqXY(audioRef.current.currentTime);
            setProgressBarLeft(progressBarLeft);

            setdialimageSrc(frzqDial(audioRef.current.currentTime));

            if (audioRef.current.currentTime > 13.3) {
                setProgressBarTop(260);
            }
            else {
                setProgressBarTop(0);
            }


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
                   src={dialimageSrc}
                   alt='SuiSou'
               />
               <VStack>
                   <div class="item-box">
                       <div class="image">
                           <img src={sheet1} alt='SuiSou1'/> 
                               </div>
                       <div class="bar" style={{ left: progressBarLeft + 'px', top: progressBarTop + 'px'}} >
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
