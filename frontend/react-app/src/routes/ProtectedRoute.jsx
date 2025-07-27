import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // User not authenticated, redirect to the landing page
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;