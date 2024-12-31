'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './Navbar.module.css';
import LanguageIcon from '@mui/icons-material/Language';
import { navbarTranslations } from '../translations/navbarTranslations';
import { config } from '@/config/config';

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, logout, payload } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [notifications, setNotifications] = useState([]);
  const [countNotif, setCountNotif] = useState(0);
  const [notifAnchorEl, setNotifAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [error, setError] = useState('');
  const { language, toggleLanguage } = useLanguage();
  const t = navbarTranslations[language];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/notifications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const notifs = response.data;
        setNotifications(notifs);
        const count = notifs.filter((notif) => notif.Read === false).length;
        setCountNotif(count);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(
            `Error fetching notifications: ${error.response.data.error}`
          );
        } else {
          setError('An unexpected error occurred while fetching notifications');
        }
      }
    };

    fetchNotifications();
  }, [isLoggedIn]);

  const handleMarkAsRead = async () => {
    try {
      await axios.post(
        `${config.apiBaseUrl}/api/notifications/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNotifications(
        notifications.map((notification) => ({ ...notification, Read: true }))
      );
      setCountNotif(0);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          `Error marking notifications as read: ${error.response.data.error}`
        );
      } else {
        setError(
          'An unexpected error occurred while marking notifications as read'
        );
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
    logout();
    handleProfileMenuClose();
    router.push('/login');
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
  };

  return (
    <AppBar position="static">
      <Toolbar className={styles.navbar}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Lekamantra
        </Typography>
        {isLoggedIn && (
          <div className={styles.navLinks}>
            <Button color="inherit" onClick={() => handleNavigation('/')}>
              {t.home}
            </Button>
            <Button
              color="inherit"
              onClick={() =>
                handleNavigation(
                  payload?.userRole === 'admin'
                    ? '/admin/documents'
                    : payload?.userRole === 'translator'
                    ? '/translators/documents'
                    : '/documents'
                )
              }
            >
              {t.documents}
            </Button>
            {/* <Button color="inherit" onClick={() => handleNavigation('/about')}>
              {t.about}
            </Button> */}
            {payload?.userRole === 'admin' ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/admin/mails')}
                >
                  {t.mails}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/admin/translators')}
                >
                  {t.translators}
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => handleNavigation('/contact')}
              >
                {t.contact}
              </Button>
            )}
            <IconButton
              color="inherit"
              onClick={handleLanguageToggle}
              sx={{ ml: 1 }}
            >
              <LanguageIcon />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {language === 'en' ? 'EN' : 'ID'}
              </Typography>
            </IconButton>
            <Button
              id="notif-button"
              aria-controls={open ? 'notif-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleNotif}
              sx={{ p: 0 }}
              color="inherit"
            >
              <Badge badgeContent={countNotif} color="secondary">
                <NotificationsIcon />
              </Badge>
            </Button>
            <Menu
              id="notif-menu"
              anchorEl={notifAnchorEl}
              open={open}
              onClose={handleNotifClose}
              MenuListProps={{
                'aria-labelledby': 'notif-button',
              }}
            >
              <List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ mr: 2 }}
                    onClick={handleMarkAsRead}
                  >
                    {t.markAllAsRead}
                  </Button>
                </Box>
                <Divider variant="middle" />
                {notifications.length === 0 && (
                  <Alert severity="info">{t.noNotifications}</Alert>
                )}
                {notifications.length > 0 &&
                  notifications?.map((notif) => (
                    <ListItem
                      key={notif.ID}
                      sx={{
                        ':hover': { bgcolor: '#D6D6D6' },
                        bgcolor: notif.Read ? 'background.default' : '#E0E0E0',
                      }}
                    >
                      <ListItemText
                        sx={{ cursor: 'pointer' }}
                        onClick={() =>
                          handleNavigation(
                            payload?.userRole === 'translator'
                              ? `/translators/documents/${notif.DocumentID}`
                              : payload?.userRole === 'admin'
                              ? `/admin/documents/${notif.DocumentID}`
                              : `/documents/${notif.DocumentID}`
                          )
                        }
                        primary={notif.Message}
                        secondary={new Date(notif.CreatedAt).toLocaleString()}
                      />
                    </ListItem>
                  ))}
              </List>
            </Menu>
          </div>
        )}
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
              <Avatar src={payload ? payload.email[0] : '?'} />
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              keepMounted
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                {payload?.username}
              </MenuItem>
              <MenuItem onClick={handleLogout}>{t.logout}</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            {/* <Button color="inherit" onClick={() => handleNavigation('/about')}>
              {t.aboutUs}
            </Button> */}
            <Button
              sx={{ mx: 1 }}
              color="inherit"
              onClick={() => handleNavigation('/contact')}
            >
              {t.contactUs}
            </Button>
            <IconButton
              color="inherit"
              onClick={handleLanguageToggle}
              sx={{ ml: 1 }}
            >
              <LanguageIcon />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {language === 'en' ? 'EN' : 'ID'}
              </Typography>
            </IconButton>
            <Button
              variant="outlined"
              color="inherit"
              sx={{
                '&:hover': {
                  bgcolor: 'white',
                  color: 'black',
                },
                mx: 1,
              }}
              onClick={() => handleNavigation('/login')}
            >
              {t.login}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              sx={{
                '&:hover': {
                  bgcolor: 'white',
                  color: 'black',
                },
              }}
              onClick={() => handleNavigation('/register')}
            >
              {t.register}
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
          <MenuItem onClick={() => handleNavigation('/')}>{t.home}</MenuItem>
          {/* <MenuItem onClick={() => handleNavigation('/about')}>
            {t.about}
          </MenuItem> */}
          <MenuItem onClick={() => handleNavigation('/contact')}>
            {t.contact}
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/dashboard')}>
            {t.dashboard}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
