'use client';

import styles from '../styles/RoleStyles.module.css';
import { useAuth } from '../contexts/AuthContext';

export default function BackgroundWrapper({ children }) {
  const { payload } = useAuth();

  const getBackgroundClass = () => {
    if (!payload) return '';

    switch (payload?.userRole) {
      case 'admin':
        return styles.adminBackground;
      case 'translator':
        return styles.translatorBackground;
      default:
        return '';
    }
  };

  return (
    <div className={`${getBackgroundClass()} ${styles.fullHeight}`}>
      {children}
    </div>
  );
}
