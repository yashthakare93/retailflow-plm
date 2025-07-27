import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

import ProductsSection from '../components/dashboard/ProductsSection';
import CreateProductSection from '../components/dashboard/CreateProductSection';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import Alert from '../components/common/Alert';
import AppNavbar from '../components/common/AppNavbar'; // This is now the only navbar needed

const DashboardLayout = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('products');
    const [alert, setAlert] = useState(null);

    const hasRole = useCallback((roleName) => {
        return user?.roles?.includes(roleName);
    }, [user]);

    const handleSetAlert = useCallback((newAlert) => setAlert(newAlert), []);
    const handleCloseAlert = useCallback(() => setAlert(null), []);

    const renderSection = () => {
        // ... (renderSection logic remains the same)
        switch (activeSection) {
            case 'products':
                return <ProductsSection setAlert={handleSetAlert} />;
            case 'create':
                return (hasRole('ROLE_ADMIN') || hasRole('ROLE_DESIGNER')) ?
                    <CreateProductSection setAlert={handleSetAlert} onProductCreated={() => setActiveSection('products')} /> :
                    <div className="p-4 text-center text-red-600">Access Denied.</div>;
            case 'analytics':
                return (hasRole('ROLE_ADMIN') || hasRole('ROLE_APPROVER')) ?
                    <AnalyticsSection setAlert={handleSetAlert} /> :
                    <div className="p-4 text-center text-red-600">Access Denied.</div>;
            default:
                return <ProductsSection setAlert={handleSetAlert} />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Pass dashboard-related props directly to AppNavbar */}
            <AppNavbar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                hasRole={hasRole}
            />
            <div className="container mx-auto p-4">
                <Alert message={alert?.message} type={alert?.type} onClose={handleCloseAlert} />
                
                {/* Main Content */}
                <div>{renderSection()}</div>
            </div>
        </div>
    );
};

export default DashboardLayout;