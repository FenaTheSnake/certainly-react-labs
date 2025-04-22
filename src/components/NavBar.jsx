import React, {createContext, useContext, useState, useEffect} from "react";
import { DirectionProvider, useDirection } from "../contexts/DirectionContext.jsx";
import { AppBar, Toolbar, Button, CircularProgress, Box, CssBaseline, ThemeProvider as MUIThemeProvider, createTheme, Drawer, TextField, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLoginState } from "../contexts/AuthContext.jsx";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useForm } from "react-hook-form";
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '../slices/apiSlice';



const AuthForm = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {isAuthenticated, setLoginState} = useLoginState();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();
    const dispatch = useDispatch();

    const onSubmit = async (data, event) => {
        console.log("Form Data:", data);

        const action = event?.nativeEvent?.submitter?.value;

        if(action === "login") {
            await login(data).unwrap().then((payload) => {
              console.log("success ", payload);
              setLoginState(true, payload);
            }).catch((error) => {
              console.log("error ", error);
            });
        } else if (action === "register") {
            await registerUser(data).unwrap().then((payload) => {
              console.log("success ", payload);
              setLoginState(true, payload);
            }).catch((error) => {
              console.log("error ", error);
            });
        }
    };
  
    useEffect(() => {
      if (isAuthenticated) {
        onClose?.(); // Call onClose if defined
      }
    }, [isAuthenticated, onClose]);
    
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
          <Button type="submit" name="action" value="login" variant="contained" fullWidth sx={{ mt: 2 }}>Войти</Button>
          <Button type="submit" name="action" value="register" variant="contained" fullWidth sx={{ mt: 2 }}>Регистрация</Button>
        </form>

        {((isLoginLoading || isRegisterLoading) && 
          <Box sx={{p: 3}}>
            <CircularProgress/>
          </Box>
        )}
      </Box>
    );
  };
  
  export const NavBar = ({toggleThemeFunction}) => {
    const { handleNavigation } = useDirection();
    const {isAuthenticated, setLoginState, user} = useLoginState();
    const [logout, { isLogoutLoading }] = useLogoutMutation();
    const [isDrawerOpen, setDrawerOpen] = useState(!isAuthenticated);
    const dispatch = useDispatch();
  
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleLogout = async () => {
      // dispatch(logout()).then(() => {
      //   setLoginState(false);
      //   console.log("login state = false");
      // });
      // setAnchorEl(null);
      // setDrawerOpen(true);

      await logout().unwrap().then((payload) => {
        setLoginState(false);
        console.log("login state = false");
        setAnchorEl(null);
        setDrawerOpen(true);
      }).catch((error) => {
        console.log("error ", error);
      });
    };
  
    return (
      <Box sx={{flexGrow:1}}>
        <AppBar position="fixed" color="primary">
          <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
  
            <Button color="inherit" onClick={toggleThemeFunction}>Тема</Button>
            <Button color="inherit" component={Link} to="/" onClick={() => handleNavigation("/")}>Главная</Button>
            <Button color="inherit" component={Link} to="/lab2" onClick={() => handleNavigation("/lab2")}>Кнопки</Button>
            <Button color="inherit" onClick={() => window.location.href = "/wasm"}>wasm</Button>
            <Button color="inherit" component={Link} to="/feedback" onClick={() => handleNavigation("/feedback")}>Обратная связь</Button>
            {(isAuthenticated && (
                <Button color="inherit" component={Link} to="/profile" onClick={() => handleNavigation("/profile")}>Профиль</Button>
            ) || (
                <Button color="inherit" onClick={() => setDrawerOpen(true)}>Профиль</Button>
            )
            )}
            <Box sx={{flexGrow:1}}>
                {(user?.role === "admin" && (
                    <Button color="inherit" component={Link} to="/adminpanel" onClick={() => handleNavigation("/adminpanel")}>Админ панель</Button>
                )
                )}
            </Box>
  
            {(isAuthenticated && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
  
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                </Menu>
              </div>
              )
              ||
              (<Button color="inherit" onClick={() => setDrawerOpen(true)}>Войти</Button>))
            }
  
          </Toolbar>
  
          <Drawer anchor="right" open={isDrawerOpen} onClose={() => {if(isAuthenticated) setDrawerOpen(false)}}>
            <AuthForm onClose={() => {
                if(isAuthenticated) setDrawerOpen(false);
            }} />
          </Drawer>
  
        </AppBar>
      </Box>
    );
  };