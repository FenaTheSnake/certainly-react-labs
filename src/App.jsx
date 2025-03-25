// src/App.jsx
import React, {createContext, useContext, useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, CssBaseline, ThemeProvider as MUIThemeProvider, createTheme, Drawer, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import "./index.css";
import "./App.css";

import { DirectionProvider, useDirection } from "./DirectionContext.jsx";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "./ParallaxContainer.jsx";
import { Lab2 } from "./Lab2.jsx";
import { WASMTest } from "./WASM.jsx";

const AuthForm = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    onClose();
  };
  
  return (
    <Box sx={{ p: 3, width: 300 }}>
      <Typography variant="h6" gutterBottom>Вход / Регистрация</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        inputRef={register("email", { 
          required: "Введите email", 
          pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Некорректный email" } 
        }).ref}
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Пароль"
        type="password"
        fullWidth
        margin="normal"
        inputRef={register("password", { 
          required: "Введите пароль", 
          minLength: { value: 6, message: "Минимум 6 символов" } 
        }).ref}
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Отправить</Button>
      </form>
    </Box>
  );
};

const NavBar = ({toggleThemeFunction}) => {
  const { handleNavigation } = useDirection();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button color="inherit" onClick={toggleThemeFunction}>Тема</Button>
        <Button color="inherit" component={Link} to="/" onClick={() => handleNavigation("/")}>Главная</Button>
        <Button color="inherit" component={Link} to="/lab2" onClick={() => handleNavigation("/lab2")}>Кнопки</Button>
        <Button color="inherit" onClick={() => window.location.href = "/lab3"}>wasm</Button>
        <Button color="inherit" onClick={() => setDrawerOpen(true)}>Войти</Button>
      </Toolbar>
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <AuthForm onClose={() => setDrawerOpen(false)} />
      </Drawer>
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

  const { direction } = useDirection();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home direction={direction} />} />
        <Route path="/lab2" element={<Lab2 direction={direction} />} />
        <Route path="/lab3" element={<WASMTest direction={direction} />} />
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
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default Root;
