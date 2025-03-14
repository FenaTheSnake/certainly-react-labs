import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export const FullScreenAnimatedContainer = ({ children }) => {
    return (
      <Box
        sx={{
          position: 'relative',   // для абсолютного позиционирования детей
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',     // скрывает элементы, выходящие за пределы экрана
        }}
      >
        {React.Children.map(children, (child, index) => (
            {child}
        ))}
      </Box>
    );
  };
  
  //export default FullScreenAnimatedContainer;