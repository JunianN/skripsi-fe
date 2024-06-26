'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
    user: { username: string } | null;
    isLoggedIn: boolean;
    login: (token: string, userData: { username: string }) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ username: string } | null>(null);

    useEffect(() => {
        // Attempt to retrieve stored user data
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const userDetails = JSON.parse(userInfo);
            setUser(userDetails);
            setIsLoggedIn(true);
        }
    }, []);

    const login = (token: string, userData: { username: string }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
