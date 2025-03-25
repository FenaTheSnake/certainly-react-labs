
import React from 'react';
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, createTheme } from "@mui/material";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "./ParallaxContainer.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

const { increment, decrement } = counterSlice.actions;
const store = configureStore({ reducer: { counter: counterSlice.reducer } });

const Counter = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <Button variant="contained" onClick={() => dispatch(increment())}>Increment</Button>
      <Button variant="contained" onClick={() => dispatch(decrement())}>Decrement</Button>
    </div>
  );
};

export const Lab2 = ({ direction }) => (
  <Provider store={store}>
    <Box sx={{
      position: 'relative',
      top: '0%',
      left: '0%',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%'}}>
          <ParallaxContainer direction={direction}  animation={bgAnimVariants}>
            <img src='/bg2.png' style={{width:'100vw'}}></img>
          </ParallaxContainer>
        </Box>
  
        <Box sx={{position:'absolute', width: '100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center"}}>
          <ParallaxContainer direction={direction}  animation={pageAnimVariants}>
            <h1>Кнопки</h1>
            <Button>Давай, нажми меня</Button>
            <Counter></Counter>
          </ParallaxContainer>
        </Box>
    </Box>
  </Provider>
  );