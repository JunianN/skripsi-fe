'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwt from 'jsonwebtoken'

const secret = '4e9560ede7b8efc3204a2def4ec110f5660175acdbe1efdc5289a83a881bbf577594589f58e8a53b1753fafd75285f4994205d2d924f760c075b3c985f42b99e85612ba22493f6457987d85d7c22bdcd15a561914e4063fbf41ab3b35a2c3cab1187a5a5c13f4088a5719238aca5537fc23b003832872149cea6d7cd6b6eeb1aa958318cb7874189b3903ba3a2f52a5de55c9ee2329218efb0d28366d66c74211d8f9b02e40b672654d668619855936d0d825690d80fdbceded860af0aeda9d0193adecc06db34ec26ae7d292f93edba1434e767aa66c16355252b41bc1f6f276c578e6e8c2ec0cbb4f81f939ee0374af185ce63de1ce9576a99b5170f2c07d2'

type AuthContextType = {
    user: { username: string, userRole: string } | null;
    isLoggedIn: boolean;
    login: (token: string, userData: { username: string, userRole: string }) => void;
    logout: () => void;
    payload: string | jwt.JwtPayload;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ username: string, userRole: string } | null>(null);
    const [payload, setPayload] = useState<string | jwt.JwtPayload>('');

    useEffect(() => {
        // Attempt to retrieve stored user data
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const userDetails = JSON.parse(userInfo);
            setUser(userDetails);
            setIsLoggedIn(true);
        }
    }, []);

    const login = (token: string, userData: { username: string, userRole: string }) => {
        const decode = jwt.verify(token, secret)
        setPayload(decode)
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
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, payload }}>
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
