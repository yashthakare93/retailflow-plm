import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';

const LogoIcon = () => (<svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>);
const UserAvatar = ({ user }) => (<div className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-500 text-white text-sm font-bold ring-2 ring-offset-2 ring-indigo-200">{user.username.charAt(0).toUpperCase()}</div>);
const DashboardNavLink = ({ isActive, onClick, children }) => (<button onClick={onClick} className={`relative px-1 py-2 text-sm font-semibold transition-colors duration-200 ease-in-out  ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}>{children}{isActive && (<motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" layoutId="underline" initial={false} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />)}</button>);

const AppNavbar = ({ onLoginClick, activeSection, setActiveSection, hasRole }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        setIsLoggingOut(false);
        setIsLogoutModalOpen(false);
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const dashboardNavItems = [
        { id: 'products', label: 'Products', roles: ['any'] },
        { id: 'create', label: 'Create Product', roles: ['ROLE_ADMIN', 'ROLE_DESIGNER'] },
        { id: 'analytics', label: 'Analytics', roles: ['ROLE_ADMIN', 'ROLE_APPROVER'] },
    ];
    const isDashboardItemVisible = (item) => { if (!hasRole) return false; if (item.roles.includes('any')) return true; return item.roles.some(role => hasRole(role)); };
    const handleDashboardNavClick = (sectionId) => { setActiveSection(sectionId); setIsMobileMenuOpen(false); };

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
                            <LogoIcon />
                            <span className="text-2xl font-bold text-gray-800 tracking-tight">RetailFlow</span>
                        </Link>
                        {user && hasRole && (<div className="hidden lg:flex lg:gap-x-6"> {dashboardNavItems.map(item => isDashboardItemVisible(item) && (<DashboardNavLink key={item.id} isActive={activeSection === item.id} onClick={() => handleDashboardNavClick(item.id)}>{item.label}</DashboardNavLink>))}</div>)}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="relative">
                                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-3 rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none">
                                        <UserAvatar user={user} />
                                        <span className="hidden sm:inline text-sm font-medium text-gray-700 hover:text-gray-900">Hi, {user.username}</span>
                                    </button>
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 py-1 z-50">
                                                <button onClick={() => setIsLogoutModalOpen(true)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                    Sign out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button onClick={onLoginClick} className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
                            )}
                            <div className="lg:hidden">
                                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"><span className="sr-only">Open main menu</span><svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg></button>
                            </div>
                        </div>
                    </div>
                </div>
                <AnimatePresence>
                    {isMobileMenuOpen && user && hasRole && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-gray-200">
                            <div className="pt-2 pb-3 space-y-1 px-2">{dashboardNavItems.map(item => isDashboardItemVisible(item) && (<button onClick={() => handleDashboardNavClick(item.id)} key={item.id} className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${activeSection === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>{item.label}</button>))}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <ConfirmationModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout} isConfirming={isLoggingOut} title="Confirm Logout">Are you sure you want to sign out of your account?</ConfirmationModal>
        </>
    );
};
export default AppNavbar;