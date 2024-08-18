'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/navigation';

const secret = process.env.NEXT_PUBLIC_SECRET_KEY;

type AuthContextType = {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
    payload: string | jwt.JwtPayload;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [payload, setPayload] = useState<string | jwt.JwtPayload>('');

    useEffect(() => {
        // Attempt to retrieve stored user data
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = jwt.verify(token, secret);
                setPayload(payload);
                setIsLoggedIn(true);
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    console.error('Token expired. Please log in again.');

                    localStorage.removeItem('token');

                    router.push('/login')
                } else {
                    // Handle other errors (e.g., invalid token)
                    console.error('Invalid token.');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
        }
    }, [router]);

    const login = (token: string) => {
        const payload = jwt.verify(token, secret)
        setPayload(payload)
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setPayload('')
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, payload }}>
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
