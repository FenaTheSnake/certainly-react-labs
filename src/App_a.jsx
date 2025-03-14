// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, createTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {FullScreenAnimatedContainer} from "./FullScreenAnimatedContainer.jsx";
import "./index.css";



const App = () => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <Box sx={{
      position: 'relative',
      top: '0%',
      left: '0%',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'-10%'}}>
          <motion.div animate={{x: '10%', transition:{duration:3}}}>
            <img src='/bgtest.png'></img>
          </motion.div>
        </Box>
        <motion.div animate={{x: '10%', transition:{duration:3}}}>
          <h1>Лабораторная работа 2</h1>
          <p>Тут кнопка будээ</p>
        </motion.div>
    </Box>
)};

export default App;
