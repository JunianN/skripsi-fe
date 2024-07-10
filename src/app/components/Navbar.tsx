'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, Box, List, ListItem, ListItemText, Alert, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const router = useRouter();
    const { user, isLoggedIn, logout, payload } = useAuth();
    console.log("🚀 ~ Navbar ~ payload:", payload)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState([]);
    const [countNotif, setCountNotif] = useState(0);
    const [notifAnchorEl, setNotifAnchorEl] = React.useState<null | HTMLElement>(null);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const notifs = response.data
                setNotifications(notifs);
                const count = notifs.filter(notif => notif.Read === false).length;
                setCountNotif(count)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(`Error fetching notifications: ${error.response.data.error}`);
                } else {
                    setError('An unexpected error occurred while fetching notifications');
                }
            }
        };

        fetchNotifications();
    }, []);

    const handleMarkAsRead = async () => {
        try {
            await axios.post('http://127.0.0.1:3001/api/notifications/read', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNotifications(notifications.map(notification => ({ ...notification, Read: true })));
            setCountNotif(0)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(`Error marking notifications as read: ${error.response.data.error}`);
            } else {
                setError('An unexpected error occurred while marking notifications as read');
            }
        }
    };

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
        handleNotifClose();
        router.push(path);
    };

    const open = Boolean(notifAnchorEl);

    const handleNotif = (event: React.MouseEvent<HTMLButtonElement>) => {
        setNotifAnchorEl(event.currentTarget);
    };

    const handleNotifClose = () => {
        setNotifAnchorEl(null);
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
                            <Button color="inherit" onClick={() => handleNavigation(user?.userRole === 'admin' ? '/admin/documents' : user?.userRole === 'translator' ? '/translators/documents' : '/documents')}>
                                Documents
                            </Button>
                            <Button color="inherit" onClick={() => handleNavigation('/about')}>
                                About
                            </Button>
                            {user?.userRole === 'admin' ? (
                                <Button color="inherit" onClick={() => handleNavigation('/admin/mails')}>Mails</Button>
                            ) : (
                                <Button color="inherit" onClick={() => handleNavigation('/contact')}>
                                    Contact
                                </Button>
                            )}
                            <Button
                                id='notif-button'
                                aria-controls={open ? 'notif-menu' : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleNotif}
                                sx={{ p: 0 }}
                                color="inherit"
                            >
                                <Badge badgeContent={countNotif} color='secondary'>
                                    <NotificationsIcon />
                                </Badge>
                            </Button>
                            <Menu
                                id='notif-menu'
                                anchorEl={notifAnchorEl}
                                open={open}
                                onClose={handleNotifClose}
                                MenuListProps={{
                                    "aria-labelledby": 'notif-button'
                                }}
                            >
                                <List>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <Typography sx={{ mr: 3, cursor:'pointer', ':hover': { textDecoration:'underline'} }} variant='subtitle1' >Mark all as read</Typography> */}
                                        <Button variant='text' size='small' sx={{ mr: 2 }} onClick={handleMarkAsRead}>Mark all as read</Button>
                                    </Box>
                                    <Divider variant='middle' />
                                    {notifications.length === 0 && (
                                        <Alert severity="info">No notifications</Alert>
                                    )}
                                    {notifications.length > 0 && notifications?.map((notif) => (
                                        <ListItem key={notif.ID} sx={{ ':hover': { bgcolor: '#D6D6D6' }, bgcolor: notif.Read ? 'background.default' : '#E0E0E0' }}>
                                            <ListItemText sx={{ cursor: 'pointer' }} onClick={() => handleNavigation(user?.userRole === 'translator' ? `/translators/documents/${notif.DocumentID}` : user?.userRole ==='admin' ? `/admin/documents/${notif.DocumentID}` : `/documents/${notif.DocumentID}`)} primary={notif.Message} secondary={new Date(notif.CreatedAt).toLocaleString()} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Menu>
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
                            keepMounted
                            open={Boolean(profileAnchorEl)}
                            onClose={handleProfileMenuClose}
                        >
                            <MenuItem onClick={handleProfileMenuClose}>{user?.username}</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button sx={{mx:1}} color="inherit" onClick={() => handleNavigation('/contact')}>
                            Contact Us
                        </Button>
                        <Button variant="outlined"
                            color="inherit"
                            sx={{
                                '&:hover': {
                                    bgcolor: 'white', 
                                    color: 'black',
                                },
                                mx:1
                            }} onClick={() => handleNavigation('/login')}>
                            Login
                        </Button>
                        <Button variant="outlined"
                            color="inherit"
                            sx={{
                                '&:hover': {
                                    bgcolor: 'white', 
                                    color: 'black',
                                },
                            }} onClick={() => handleNavigation('/register')}>
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
