// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, createTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";
import "./App.css";

import { DirectionProvider, useDirection } from "./DirectionContext.jsx";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "./ParallaxContainer.jsx";
import { Lab2 } from "./Lab2.jsx";
import { Lab3 } from "./Lab3.jsx";

const NavBar = () => {
  const { handleNavigation } = useDirection();

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button color="inherit" component={Link} to="/" onClick={() => handleNavigation("/")}>Главная</Button>
        <Button color="inherit" component={Link} to="/lab2" onClick={() => handleNavigation("/lab2")}>Лабораторная 2</Button>
        <Button color="inherit" component={Link} to="/lab3" onClick={() => handleNavigation("/lab3")}>Лабораторная 3</Button>
      </Toolbar>
    </AppBar>
  );
};

const Home = ({ direction }) => {
  return (
    <Box sx={{
      position: 'relative',
      top: '0%',
      left: '0%',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
        {/* <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 1}}>
          <ParallaxContainer direction={direction} animation={bgAnimVariants2}>
            <motion.div>
              <img src='/squares1.png' style={{width:'100vw'}}></img>
            </motion.div>
          </ParallaxContainer>
        </Box>

        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 2}}>
          <ParallaxContainer direction={direction} animation={bgAnimVariants}>
            <img src='/squares2.png' style={{width:'100vw'}}></img>
          </ParallaxContainer>
        </Box> */}

        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'10%', top: '20%', zIndex: 2}}>
          <ParallaxContainer direction={direction} animation={bgAnimVariants2}>
            <img src='/moon.png'></img>
          </ParallaxContainer>
        </Box>

        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 0}}>
          <ParallaxContainer direction={direction} animation={bgAnimVariants}>
            <motion.div initial={{"--mask-pos": "0px 100%"}} animate={{"--mask-pos": "1920px 100%"}} transition={{duration:30, ease:"linear", repeat: Infinity, repeatType: "loop"}}>
              <div className="bottom-panel">
                <motion.div animate={{x: '-16px', transition:{duration:0.5, ease:"linear", repeat: Infinity, repeatType: "loop"}}}>
                    <div className="full-width-tiling"></div>
                </motion.div>
              </div>
            </motion.div>
          </ParallaxContainer>
        </Box>
        
        {/* animate={{x: -100, transition:{duration:1, ease:"linear", repeat: Infinity, repeatType: "loop"}}} */}
  
        <Box sx={{position:'absolute', width: '100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center"}}>
          <ParallaxContainer direction={direction} animation={pageAnimVariants}>
            <h1>Главная</h1>
            <p>Тут еще ничего нет...</p>
          </ParallaxContainer>
        </Box>
    </Box>
  );
}

const AnimatedRoutes = () => {
  const location = useLocation();

  const { direction } = useDirection();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home direction={direction} />} />
        <Route path="/lab2" element={<Lab2 direction={direction} />} />
        <Route path="/lab3" element={<Lab3 direction={direction} />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <Router>
      <DirectionProvider>
        <ThemeProvider theme={theme}>
          <NavBar />
          <Box sx={{ mt: 0, width: "100%" }}>
            <AnimatedRoutes />
          </Box>
        </ThemeProvider>
      </DirectionProvider>
    </Router>
  );
};

export default App;
