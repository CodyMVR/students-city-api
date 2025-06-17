import React from 'react';
import Navbar from '../components/Navbar';
import { IonContent, IonPage } from '@ionic/react';
import MapComponent from '../components/MapComponent';

const Home: React.FC = () => {
  return (
    <IonPage>
      <Navbar title="Accueil" />
      <IonContent fullscreen>
        <div style={{ width: '100%', height: '100%' }}>
          <MapComponent />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
