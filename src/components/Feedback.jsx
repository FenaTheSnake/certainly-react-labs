
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
import DeleteIcon from "@mui/icons-material/Delete";
import { updateAbout } from "../slices/authSlice.js";
import { useLoginState } from "../contexts/AuthContext.jsx";

export const Feedback = ({ direction }) => {
    const { user } = useLoginState();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:4000/feedbacks")
          .then((res) => res.json())
          .then((data) => setReviews(data))
          .catch((err) => console.error("Ошибка загрузки отзывов:", err));
      }, []);

      const handlePrevReview = () => {
        setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
      };
    
      const handleNextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      };

    const onSubmit = async (data) => {
        const newFeedback = {
          author: user.email,
          content: data.feedback,
        };
    
        try {
          const res = await fetch("http://localhost:4000/feedbacks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFeedback),
          });
    
          if (res.ok) {
            const added = await res.json();
            setReviews((prev) => [...prev, added.feedback]);
            reset();
          } else {
            console.error("Ошибка при отправке отзыва");
          }
        } catch (err) {
          console.error("Ошибка сети при отправке:", err);
        }
      };
    
    
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
                                    <Avatar>{reviews[currentIndex].author?.charAt(0).toUpperCase()}</Avatar>
                                    <Typography variant="h6" component="div">
                                        {reviews[currentIndex].author}
                                    </Typography>
                                    {/* <IconButton
                                        color="error"
                                        onClick={async () => {
                                        const toDelete = reviews[currentIndex];
                                        if (window.confirm("Удалить отзыв?")) {
                                            try {
                                            const res = await fetch(`http://localhost:4000/feedbacks/${toDelete.id}`, {
                                                method: "DELETE",
                                            });

                                            if (res.ok) {
                                                setReviews(prev => {
                                                const updated = prev.filter(f => f.id !== toDelete.id);
                                                // Скорректируем индекс
                                                const nextIndex = Math.max(0, currentIndex - (currentIndex === updated.length ? 1 : 0));
                                                setCurrentIndex(nextIndex);
                                                return updated;
                                                });
                                            } else {
                                                console.error("Ошибка удаления отзыва");
                                            }
                                            } catch (err) {
                                            console.error("Сетевая ошибка при удалении отзыва:", err);
                                            }
                                        }
                                        }}
                                    >
                                    <DeleteIcon />
                                    </IconButton> */}
                                </Stack>
                                <Typography sx={{ mt: 1.5 }} variant="body2">
                                    {reviews[currentIndex].content}
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