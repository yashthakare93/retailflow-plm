import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const DashboardPage = () => {
    // This component acts as the entry point to the authenticated part of the app.
    // The actual content (Products, Analytics, etc.) is managed by the DashboardLayout.
    return (
        <DashboardLayout />
    );
};

export default DashboardPage;