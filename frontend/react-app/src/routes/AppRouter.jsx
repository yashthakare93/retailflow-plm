import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } 
            />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter;