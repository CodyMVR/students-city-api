// src/pages/AdminPlacesPage.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonToast, IonSpinner, IonListHeader
} from '@ionic/react';
import { fetchPendingPlaces, approvePlace, revokePlace, PlaceItem } from '../services/api';
import Navbar from '../components/Navbar';

const AdminPlacesPage: React.FC = () => {
  const [places, setPlaces]     = useState<PlaceItem[]>([]);
  const [loading, setLoading]   = useState<boolean>(true);
  const [toast, setToast]       = useState<string|null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const pending = await fetchPendingPlaces();
      setPlaces(pending);
    } catch (e: any) {
      setToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (p: PlaceItem) => {
    try {
      await approvePlace(p.id);
      setToast('Lieu validé ✅');
      setPlaces(prev => prev.filter(x => x.id !== p.id));
    } catch (e: any) {
      setToast(e.message);
    }
  };

  const handleRevoke = async (p: PlaceItem) => {
    try {
      await revokePlace(p.id);
      setToast('Lieu remis en attente ✅');
      setPlaces(prev => prev.filter(x => x.id !== p.id));
    } catch (e: any) {
      setToast(e.message);
    }
  };

  return (
    <IonPage>
      <Navbar title="Accueil" />
      <IonContent className="ion-padding">
        <IonListHeader>Établissements en attente</IonListHeader>
        {loading && <IonSpinner style={{ margin: '2rem auto', display: 'block' }} />}
        <IonList>
          {places.map(p => (
            <IonItem key={p.id}>
              <IonLabel>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <small>{p.adresse}</small>
              </IonLabel>
              <IonButton color="success" onClick={() => handleApprove(p)}>✅</IonButton>
              <IonButton color="warning" onClick={() => handleRevoke(p)}>🔄</IonButton>
            </IonItem>
          ))}
          {!loading && places.length === 0 && <p>Aucun lieu en attente.</p>}
        </IonList>
        <IonToast
          isOpen={!!toast}
          message={toast||''}
          duration={3000}
          onDidDismiss={() => setToast(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminPlacesPage;
