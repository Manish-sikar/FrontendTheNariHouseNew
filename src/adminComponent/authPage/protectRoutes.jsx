import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contex'; // Adjust the path as needed

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
