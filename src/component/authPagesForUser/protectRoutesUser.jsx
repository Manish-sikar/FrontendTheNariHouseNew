import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthUser } from './contexUser';
 ; // Adjust the path as needed

const ProtectedRouteUser = ({ children }) => {
    const { isAuthenticatedUser } = useAuthUser();

    return isAuthenticatedUser ? children : <Navigate to="/login-User" />;
};

export default ProtectedRouteUser;
