// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchAuthenticated } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State to hold the user object { username, roles, ... } and temporarily the rawPassword
    const [user, setUser] = useState(() => {
        try {
            const storedUser = sessionStorage.getItem('user');
            const storedRawPassword = sessionStorage.getItem('rawPassword');
            if (storedUser && storedRawPassword) {
                const parsedUser = JSON.parse(storedUser);
                if (!parsedUser.roles) {
                    parsedUser.roles = [];
                }
                return { ...parsedUser, rawPassword: storedRawPassword };
            }
        } catch (error) {
            console.error('Failed to parse user from sessionStorage on init:', error);
        }
        return null;
    });

    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        try {
            if (user && user.username && user.rawPassword) {
                const { rawPassword, ...userToStore } = user;
                sessionStorage.setItem('user', JSON.stringify(userToStore));
                sessionStorage.setItem('rawPassword', rawPassword);
            } else {
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('rawPassword');
            }
        } catch (error) {
            console.error('Failed to save to sessionStorage:', error);
        }
    }, [user]);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.clear();
        console.log('Logged out');
        setIsLoadingAuth(false);
    }, []);

    // Fetches full user details from the backend
    const fetchUserDetails = useCallback(async (username, password) => {
        if (!username || !password) {
            console.warn('fetchUserDetails called without credentials. Logging out.');
            logout();
            return null;
        }
        setIsLoadingAuth(true);

        try {
            const base64Credentials = btoa(`${username}:${password}`);
            const headers = { Authorization: `Basic ${base64Credentials}` };

            const response = await fetchAuthenticated(
                '/auth/users/me', 'GET', headers
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }
            
            // ✅ FIX: Since the backend sends a plain text string, we get the response as text.
            const responseText = await response.text();
            
            // Manually parse the username and roles from the string
            const usernameMatch = responseText.match(/Authenticated user: (\w+)/);
            const rolesMatch = responseText.match(/with roles: \[(.*?)\]/);

            if (usernameMatch && rolesMatch) {
                const parsedUsername = usernameMatch[1];
                const rolesString = rolesMatch[1];
                const parsedRoles = rolesString ? rolesString.split(',').map(role => role.trim()) : [];

                const userData = { username: parsedUsername, roles: parsedRoles };

                setUser({
                    ...userData,
                    rawPassword: password
                });
                console.log('Successfully parsed user details from string:', userData);
                return userData;
            } else {
                // This will run if the string format changes or is unexpected.
                console.error("Could not parse user details from server response:", responseText);
                throw new Error("Received an unparseable user details string from the server.");
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            logout();
            return null;
        } finally {
            setIsLoadingAuth(false);
        }
    }, [logout]);

    // Login function
    const login = useCallback(async (username, password) => {
        setIsLoadingAuth(true);
        try {
            const base64Credentials = btoa(`${username}:${password}`);
            const headers = { Authorization: `Basic ${base64Credentials}` };
            
            const response = await fetchAuthenticated(
                '/auth/login', 'POST', headers, { username, password }
            );

            if (response.ok) {
                await fetchUserDetails(username, password);
                console.log('Backend login successful, fetching user details...');
                return true;
            } else {
                const errorDetail = await response.text();
                throw new Error(`Login failed: ${errorDetail || 'Invalid credentials'}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            logout();
            throw error;
        }
    }, [fetchUserDetails, logout]);

    // This effect runs once on mount to re-validate the session
    useEffect(() => {
        const revalidateSession = () => {
            if (user && user.username && user.rawPassword) {
                console.log("Re-validating session for user:", user.username);
                fetchUserDetails(user.username, user.rawPassword);
            } else {
                setIsLoadingAuth(false);
                setUser(null);
            }
        };
        revalidateSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoadingAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
