
import React, { useCallback, useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, createTheme, TextField, Avatar, Stack } from "@mui/material";
import { ParallaxContainer, pageAnimVariants, bgAnimVariants, bgAnimVariants2, bgAnimVariants3 } from "./ParallaxContainer.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useForm } from "react-hook-form";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion, AnimatePresence } from "framer-motion";

export const Feedback = ({ direction }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [
            { nickname: 'User1', comment: 'Отличный сервис!' },
            { nickname: 'User2', comment: 'Очень понравилось, рекомендую!' }
        ];
        setReviews(storedReviews);
    }, []);

    const handleNextReview = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };
    const handlePrevReview = () => {
        setCurrentIndex((prevIndex) => {
            let ind = (prevIndex - 1) % reviews.length;
            if(ind < 0) ind = reviews.length + ind;
            return ind;
        });
    };

    const onSubmit = useCallback((data) => {
        console.log("Форма отправлена:", data);

        const reviews = JSON.parse(localStorage.getItem('reviews')) || [
            { nickname: 'User1', comment: 'Отличный сервис!' },
            { nickname: 'User2', comment: 'Очень понравилось, рекомендую!' }
        ];
        reviews.push({nickname: 'Me', comment: data.feedback});

        setReviews(reviews);
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }, []);
    
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
                <div className="full-width-tiling-emojis"></div>
            </motion.div>
            </ParallaxContainer>
        </Box>
        
        {/* <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 2}}>
            <ParallaxContainer direction={direction}  animation={bgAnimVariants2}>
            <img src='/feedback-bg/people.png' style={{width:'100vw'}}></img>
            </ParallaxContainer>
        </Box>
        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 3}}>
            <ParallaxContainer direction={direction}  animation={bgAnimVariants3}>
            <img src='/feedback-bg/bubbles.png' style={{width:'100vw'}}></img>
            </ParallaxContainer>
        </Box>
        <Box sx={{position:'absolute', width:'100%', height:'100%', left:'0%', zIndex: 4}}>
            <ParallaxContainer direction={direction}  animation={bgAnimVariants}>
            <img src='/feedback-bg/nine.png' style={{width:'100vw'}}></img>
            </ParallaxContainer>
        </Box> */}
   
        <Box sx={{position:'absolute', width: '100%', height:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center", zIndex:5}}>
            <ParallaxContainer direction={direction}  animation={pageAnimVariants}>

                <h1>Обратная связь</h1>
        
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{display:'flex', marginX: '20%', width: '60%', zIndex: 6}}>
                        <TextField
                        id="standard-multiline-static"
                        label="Введите ваши жалобы..."
                        multiline
                        fullWidth
                        inputRef={register("feedback", { 
                            required: "Введите что-нибудь, а", 
                            minLength: { value: 20, message: "Побольше букв" } 
                        }).ref}
                        {...register("feedback")}
                        rows={8}
                        variant="filled"
                        error={!!errors.feedback}
                        />
                    </Box>
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Отправить</Button>


                </form>

                <Box sx={{display:'inline-block', marginX: '0%', width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: "center", justifyItems: 'center', alignContent: 'center'}}>

                    {reviews.length > 0 && (
                        <Card sx={{ marginX: '25%', width: '50%', marginY: 2, textAlign: 'left' }}>
                            <CardContent>
                                <Stack direction="row" spacing={2}>
                                    <Avatar>{reviews[currentIndex].nickname.charAt(0).toUpperCase()}</Avatar>
                                    <Typography variant="h6" component="div">
                                        {reviews[currentIndex].nickname}
                                    </Typography>
                                </Stack>
                                <Typography sx={{ mt: 1.5 }} variant="body2">
                                    {reviews[currentIndex].comment}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                    
                    <Stack direction="row" spacing={2}>
                        <IconButton onClick={handlePrevReview}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                        <IconButton onClick={handleNextReview}>
                            <ArrowForwardIcon></ArrowForwardIcon>
                        </IconButton>
                    </Stack>

                    {/* <Button variant="contained" onClick={handleNextReview} sx={{ mt: 2 }}>
                        Следующий отзыв
                    </Button> */}
                </Box>

            </ParallaxContainer>
        </Box>
    </Box>

)};