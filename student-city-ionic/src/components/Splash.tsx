// src/components/Splash.tsx
import React, { useEffect } from 'react';
import { IonSpinner } from '@ionic/react';
import './Splash.css';

interface SplashProps {
  duration?: number;      
  onFinish: () => void;
}

const Splash: React.FC<SplashProps> = ({ duration = 2000, onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div className="app-splash">
      <img src="/resources/splash.png" alt="Logo" className="splash-logo" />
      <IonSpinner name="crescent" />
    </div>
  );
};

export default Splash;
