// apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (builder) => ({

    login: builder.mutation({
        query: (credentials) => ({
            url: 'login',
            method: 'POST',
            body: credentials,
            headers: { 'Content-Type': 'application/json' },
        }),
        transformResponse: (response) => {
            if (response.success) {
                localStorage.setItem('user', JSON.stringify(response.user));
                return response.user;
            }
            throw new Error('Login failed');
        },
    }),

    register: builder.mutation({
        query: (userData) => ({
            url: 'register',
            method: 'POST',
            body: userData,
            headers: { 'Content-Type': 'application/json' },
        }),
        transformResponse: (response) => {
            if (response.success) {
                localStorage.setItem('user', JSON.stringify(response.user));
                return response.user;
            }
            throw new Error('Register failed');
        },
    }),

    logout: builder.mutation({
        query: () => ({
            url: 'logout',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }),
    }),

    feedbacks: builder.mutation({
        query: () => ({
            url: 'feedbacks',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }),
    }),

    users: builder.mutation({
        query: () => ({
            url: 'users',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }),
    }),

  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useFeedbacksMutation, useUsersMutation } = api;