import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItem, Heading, Center } from '@chakra-ui/react';
import sheetImagePath from './sheet-image-path.json';
const sheetImagesPath = sheetImagePath.images;

const SheetMusicSelectorPage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setImages(sheetImagesPath);
  }, []);

  const handleSelection = (filename) => {
    navigate('/audiostreamer', { state: { selectedSheetMusic: filename } });
  };

  return (
    <Center>
      <Box>
        <Heading>Select Sheet Music</Heading>
        <List spacing={3}>
          {images.map((filename, index) => (
            <ListItem
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelection(filename)}
            >
              {filename.split('.')[0]}
            </ListItem>
          ))}
        </List>
      </Box>
    </Center>
  );
};

export default SheetMusicSelectorPage;
