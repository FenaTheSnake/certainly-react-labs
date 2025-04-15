import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useLoginState } from "../states/useLoginState";

// Async login
export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
    //const {isAuthenticated, setLoginState} = useLoginState();

    const response = await fetch("http://localhost:4000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message);
    }

    localStorage.setItem("email", credentials.email);
    return true;
});

export const registerUser = createAsyncThunk("auth/register", async (credentials, thunkAPI) => {
  //const {isAuthenticated, setLoginState} = useLoginState();

  const response = await fetch("http://localhost:4000/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(credentials),
  });

  if (!response.ok) {
      const error = await response.json();
      return thunkAPI.rejectWithValue(error.message);
  }

  return true;
});

export const updateAbout = createAsyncThunk(
  "user/updateAbout",
  async ({ email, about }, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:4000/user/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about }),
      });

      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message);
      }

      const data = await response.json();
      return data.user; // можно вернуть обновлённого пользователя
    } catch (error) {
      return thunkAPI.rejectWithValue("Ошибка соединения с сервером");
    }
  }
);

// Async logout
export const logout = createAsyncThunk("auth/logout", async () => {
    console.log("logout");
    await fetch("http://localhost:4000/logout", { method: "POST" });

    return false;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: localStorage.getItem("auth") === "true",
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export default authSlice.reducer;
