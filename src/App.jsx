// src/App.jsx
import React, {createContext, useContext, useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, CssBaseline, ThemeProvider as MUIThemeProvider, createTheme, Drawer, TextField, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import "./index.css";
import "./App.css";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { DirectionProvider, useDirection } from "./contexts/DirectionContext.jsx";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "./components/ParallaxContainer.jsx";
import { Lab2 } from "./components/Lab2.jsx";
import { WASMTest } from "./components/WASM.jsx";
import { Feedback } from "./components/Feedback.jsx";
import { Profile } from "./components/Profile.jsx";
import { AdminPanel } from "./components/AdminPanel.jsx";

import { NavBar } from "./components/NavBar.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

import authReducer from "./slices/authSlice.js"; // проверь путь

import store from "./store.js"; 

//const store = configureStore({ reducer: { auth: authReducer } });

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

        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'10%', top: '20%', zIndex: 2}}>
          <ParallaxContainer direction={direction} animation={bgAnimVariants}>
            <img src='/moon.png'></img>
          </ParallaxContainer>
        </Box>

        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 0}}>
          <ParallaxContainer direction={direction} animation={bgAnimVariants2}>
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
  const pages = [ {path: '/', c: Home}, 
                  {path: '/lab2', c: Lab2}, 
                  {path: '/wasm', c: WASMTest}, 
                  {path: '/feedback', c: Feedback}, 
                  {path: '/profile', c: Profile}, 
                  {path: '/adminpanel', c: AdminPanel}, 
  ]

  const { direction } = useDirection();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {pages.map(function(item, i){
          return <Route path={item.path} element={React.createElement(item.c, {direction: direction})} />
        })}

      </Routes>
    </AnimatePresence>
  );
};

const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

const App = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Router>
      <DirectionProvider>
          <NavBar toggleThemeFunction={toggleTheme} />
          <Box sx={{ mt: 0, width: "100%" }}>
            <AnimatedRoutes />
          </Box>
      </DirectionProvider>
    </Router>
  );
};

const Root = () => (
  <Provider store={store}>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </Provider>
);

export default Root;
