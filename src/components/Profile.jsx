
import React, {createContext, useCallback, useContext, useState, useEffect} from "react";
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, TextField, createTheme } from "@mui/material";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2 } from "../ParallaxContainer.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { updateAbout } from "../slices/authSlice";


export const Profile = ({ direction }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [aboutText, setAboutText] = useState("Загрузка...");
    const [email, setEmail] = useState(null);
    const dispatch = useDispatch();

    const onSubmit = useCallback((data) => {
        dispatch(updateAbout({ email: localStorage.getItem("email"), about: data.feedback }))
        .unwrap()
        .then((user) => {
            console.log("Обновлено:", user);
        })
        .catch((error) => {
            console.error("Ошибка:", error);
        });
    }, []);

    useEffect(() => {
        if (aboutText) {
          setValue("feedback", aboutText);
        }
      }, [aboutText, setValue]);

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
        setEmail(storedEmail);
        } else {
        setAboutText("Email не найден");
        }
    }, []);

    useEffect(() => {
        if (!email) return;

        const fetchAbout = async () => {
        try {
            const res = await fetch(`http://localhost:4000/user/${email}`);
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
    }, [email]);

    return (
    <Box sx={{
        position: 'relative',
        top: '0%',
        left: '0%',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    }}>
        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 2}}>
            <ParallaxContainer direction={direction}  animation={bgAnimVariants2}>
            <motion.div animate={{x: '-800px', transition:{duration:10.0, ease:"linear", repeat: Infinity, repeatType: "loop"}}}>
                <div className="full-width-tiling-buttons"></div>
            </motion.div>
            </ParallaxContainer>
        </Box>
        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 2}}>
            <ParallaxContainer direction={direction}  animation={bgAnimVariants2}>
            <img src='/welcome-stanley.png' style={{width:'100vw', opacity:'1%'}}></img>
            </ParallaxContainer>
        </Box>

        <Box sx={{position:'absolute', width: '100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center", zIndex: 5}}>
            <ParallaxContainer direction={direction}  animation={pageAnimVariants}>

            <h1>Профиль</h1>

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