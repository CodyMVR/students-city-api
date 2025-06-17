import React, { useState } from 'react';
import {
  IonPage, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonToast
} from '@ionic/react';
import { addPlace } from '../services/api';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AddPlacePage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adresse, setAdresse] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [toast, setToast] = useState<string>();
  const history = useHistory();

  const handleAdd = async () => {
    try {
      const latNum = parseFloat(latitude);
      const lngNum = parseFloat(longitude);

      await addPlace(name, description, adresse, latNum, lngNum);
      setToast('Lieu ajouté ✔️');
      setTimeout(() => history.replace('/places'), 1000);
    } catch (e: any) {
      setToast(e.response?.data?.message || e.message);
    }
  };

  return (
    <IonPage>
      <Navbar title="Accueil" />

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nom</IonLabel>
          <IonInput value={name} onIonChange={e => setName(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonInput value={description} onIonChange={e => setDescription(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Adresse</IonLabel>
          <IonInput value={adresse} onIonChange={e => setAdresse(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Latitude</IonLabel>
          <IonInput
            type="number"
            value={latitude}
            placeholder="Ex : 48.8566"
            onIonChange={e => setLatitude(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Longitude</IonLabel>
          <IonInput
            type="number"
            value={longitude}
            placeholder="Ex : 2.3522"
            onIonChange={e => setLongitude(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="block" onClick={handleAdd}>Ajouter</IonButton>

        <IonToast
          isOpen={!!toast}
          message={toast!}
          duration={2000}
          onDidDismiss={() => setToast(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddPlacePage;
