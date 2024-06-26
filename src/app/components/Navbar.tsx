'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const router = useRouter();
    const { user, isLoggedIn, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    const handleNavigation = (path: string) => {
        handleClose();
        router.push(path);
    };

    const handleLogout = () => {
        // Logic for logging out
        logout()
        handleProfileMenuClose();
        router.push('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar className={styles.navbar}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Translation App
                </Typography>
                {
                    isLoggedIn && (
                        <div className={styles.navLinks}>
                            <Button color="inherit" onClick={() => handleNavigation('/')}>
                                Home
                            </Button>
                            <Button color="inherit" onClick={() => handleNavigation('/about')}>
                                About
                            </Button>
                            <Button color="inherit" onClick={() => handleNavigation('/contact')}>
                                Contact
                            </Button>
                            <Button color="inherit" onClick={() => handleNavigation('/dashboard')}>
                                Dashboard
                            </Button>
                        </div>
                    )
                }
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                    className={styles.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                {isLoggedIn ? (
                    <>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="profile"
                            onClick={handleProfileMenu}
                        >
                            <Avatar src={user ? user.username[0] : '?'} />
                        </IconButton>
                        <Menu
                            anchorEl={profileAnchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(profileAnchorEl)}
                            onClose={handleProfileMenuClose}
                        >
                            <MenuItem onClick={handleProfileMenuClose}>{user?.username}</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button color="inherit" onClick={() => handleNavigation('/login')}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={() => handleNavigation('/register')}>
                            Register
                        </Button>
                    </>
                )}
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => handleNavigation('/')}>Home</MenuItem>
                    <MenuItem onClick={() => handleNavigation('/about')}>About</MenuItem>
                    <MenuItem onClick={() => handleNavigation('/contact')}>Contact</MenuItem>
                    <MenuItem onClick={() => handleNavigation('/dashboard')}>Dashboard</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
