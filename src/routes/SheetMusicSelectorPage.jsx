import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Heading, Center, VStack, Image,Card,
    CardHeader, Text,
    CardBody, } from '@chakra-ui/react';
import maru from "./menuTestImg/1.gif";
import meari from "./menuTestImg/2.gif";
import donghwa from "./menuTestImg/3.gif";
import frere from "./menuTestImg/frere.gif";
import frere2 from "./menuTestImg/frere.png";

const SheetMusicSelectorPage = () => {
    const [userInput, setUserInput] = useState('');
    const navigate = useNavigate();

    const suisouList = [
        {
            id: "frere",
            link: "frere.gif",
            suisouImg: frere,
            icon: "_Icon_instruction",
            text: "Frere Jaques",
        },
        {
            id: "maru",
            link: "1.gif",
            suisouImg: maru,
            icon: "_Icon_instruction",
            text: "Maruchi Aruchi",
        },
        {
            id: "meari",
            link: "2.gif",
            suisouImg: meari,
            icon: "_Icon_setting",
            text: "Meari",
        },
        {
            id: "donghwa",
            link: "3.gif",
            suisouImg: donghwa,
            icon: "_Icon_setting",
            text: "Donghwa",
        },
        {
            id: "frere2",
            link: "프래르자크_2.gif",
            suisouImg: frere2,
            icon: "_Icon_instruction",
            text: "Frere Jaques 2",
        },
    ];

    const searched = suisouList.filter((item) =>
        item.text.toLowerCase().includes(userInput)
    );

    const getValue = (e) => {
        setUserInput(e.target.value.toLowerCase())
    };

    const handleSelection = (filename) => {
        navigate('/audiostreamer', { state: { selectedSheetMusic: filename } });
    };

    return (
        <VStack>
            <Center>
                <Box>
                    <Heading>Select Sheet Music</Heading>
                </Box>
            </Center>
            <input onChange={getValue} placeholder="Search..." />
            {searched.map((item) => (
                <SuisouCard key={item.id} {...item} handleSelection={handleSelection} />
            ))}
        </VStack>
    );
};

const SuisouCard = ({ id, text, suisouImg, link, handleSelection }) => {
    return (
        <Box maxW='500px' onClick={() => handleSelection(link)} >
            <Card borderWidth="7px" borderRadius='25px' >
                <CardHeader display="flex" justifyContent="center" alignItems="center">

                    <Image w="60%" h="100%" id="image" src={suisouImg} style={{ margin: "20px auto 0" }} />

                </CardHeader>
                <CardBody>
                    <Text fontSize="50px">{text}</Text>
                </CardBody>
            </Card>
        </Box>
    );
};

export default SheetMusicSelectorPage;
