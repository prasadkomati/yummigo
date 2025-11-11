// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user')),
    });

    useEffect(() => {
        if (auth.token && auth.user) {
            localStorage.setItem('token', auth.token);
            localStorage.setItem('user', JSON.stringify(auth.user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [auth]);

    const register = (data) => API.post('/api/auth/register', data).then((res) => res.data);

    const login = (data) => API.post('/api/auth/login', data).then((res) => res.data);

    const logout = () => {
        setAuth({ token: null, user: null });
        localStorage.clear();
    };

    const handleLogin = (token, user) => {
        setAuth({ token, user });
    };

    return (
        <AuthContext.Provider value={{ auth, register, login, logout, handleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
