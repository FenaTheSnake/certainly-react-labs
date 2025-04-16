
import React, {createContext, useCallback, useContext, useState, useEffect} from "react";
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, TextField, createTheme, Stack, Avatar, Typography } from "@mui/material";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "./ParallaxContainer.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { updateAbout } from "../slices/authSlice";
import { useLoginState } from "../contexts/AuthContext.jsx";


export const Profile = ({ direction }) => {
    const { user } = useLoginState();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [aboutText, setAboutText] = useState("Загрузка...");
    const [email, setEmail] = useState(null);
    const dispatch = useDispatch();

    const onSubmit = useCallback((data) => {
        if (!user?.email) return;

        dispatch(updateAbout({ email: user.email, about: data.feedback }))
            .unwrap()
            .then((updatedUser) => {
            console.log("Обновлено:", updatedUser);
            })
            .catch((error) => {
            console.error("Ошибка:", error);
            });
    }, [dispatch, user]);

    useEffect(() => {
        if (aboutText) {
          setValue("feedback", aboutText);
        }
      }, [aboutText, setValue]);

      useEffect(() => {
        if (!user?.email) {
          setAboutText("Email не найден");
          return;
        }
    
        const fetchAbout = async () => {
          try {
            const res = await fetch(`http://localhost:4000/user/${user.email}`);
            const data = await res.json();
    
            if (data.success) {
              setAboutText(data.user.about || "");
            } else {
              setAboutText("Ошибка загрузки");
            }
          } catch (error) {
            console.error("Ошибка запроса:", error);
            setAboutText("Ошибка запроса");
          }
        };
    
        fetchAbout();
      }, [user]);

    return (
    <Box sx={{
        position: 'relative',
        top: '0%',
        left: '0%',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    }}>

        <Box sx={{position:'absolute', width: '100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center", zIndex: 5}}>
            <ParallaxContainer direction={direction}  animation={pageAnimVariants}>

            <h1>Профиль</h1>
            <Box sx={{display:'flex', width: '100%', zIndex: 6, justifyContent: 'center', alignItems: 'center', textAlign: "center"}}>
                <Stack direction="row" spacing={2}>
                    <Avatar>{user.email.charAt(0).toUpperCase()}</Avatar>
                    <Typography variant="h6" component="div">
                        {user.email}
                    </Typography>
                </Stack>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{display:'flex', marginX: '20%', width: '60%', zIndex: 6}}>
                    <TextField
                    id="standard-multiline-static"
                    label="О себе"
                    multiline
                    fullWidth
                    inputRef={register("feedback", { 
                        required: "Введите больше текста", 
                        minLength: { value: 5, message: "Побольше букв" } 
                    }).ref}
                    {...register("feedback")}
                    rows={8}
                    variant="filled"
                    error={!!errors.feedback}
                    />
                </Box>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>Изменить</Button>


            </form>

            </ParallaxContainer>
        </Box>
    </Box>
    );
}