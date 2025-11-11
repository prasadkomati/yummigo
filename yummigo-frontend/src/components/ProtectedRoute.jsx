// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ roles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(auth.user.role)) return <Navigate to="/" replace />;
    return <Outlet />;
};

export default ProtectedRoute;
