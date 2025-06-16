import React from 'react';
import {
  IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonSegment, IonSegmentButton
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

interface NavbarProps { title: string; }

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const history = useHistory();
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const onTabChange = (e: CustomEvent) => {
    const value = e.detail.value as string;
    history.push(value);
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonSegment value={location.pathname} onIonChange={onTabChange}>
          <IonSegmentButton value="/home">
            Home
          </IonSegmentButton>
          <IonSegmentButton value="/places">
            Places
          </IonSegmentButton>
          {isAdmin && (
            <>
              <IonSegmentButton value="/admin-places">
                Admin Places
              </IonSegmentButton>
              <IonSegmentButton value="/admin-users">
                Admin Users
              </IonSegmentButton>
            </>
          )}
        </IonSegment>

        <IonButtons slot="end">
          <IonButton onClick={() => { logout(); history.push('/login'); }}>
            Déconnexion
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Navbar;
