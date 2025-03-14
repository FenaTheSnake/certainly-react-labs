
import React from 'react';
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, createTheme } from "@mui/material";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "./ParallaxContainer.jsx";

export const Lab3 = ({ direction }) => (
    <Box sx={{
      position: 'relative',
      top: '0%',
      left: '0%',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%'}}>
          <ParallaxContainer direction={direction} animation={bgAnimVariants}>
            <img src='/bgtest.png'></img>
          </ParallaxContainer>
        </Box>
  
        <Box sx={{position:'absolute', width: '100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center"}}>
          <ParallaxContainer direction={direction} animation={pageAnimVariants}>
            <h1>Лабораторная работа 3</h1>
            <p>ммэээ</p>
          </ParallaxContainer>
        </Box>
    </Box>
  );