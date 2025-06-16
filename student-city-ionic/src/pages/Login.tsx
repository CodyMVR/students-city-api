import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonText, IonLoading
} from '@ionic/react';
import { login } from '../services/api';
import { setToken } from '../services/auth';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const { token } = await login(email, password);
      setToken(token);
      history.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Connexion</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="email"
            autocomplete="email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Mot de passe</IonLabel>
          <IonInput
            type="password"
            autocomplete="current-password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            required
          />
        </IonItem>

        {error && (
          <IonText color="danger" className="ion-padding-top">
            {error}
          </IonText>
        )}

        <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
          Se connecter
        </IonButton>

        <IonLoading isOpen={loading} message="Connexion…" />
      </IonContent>
    </IonPage>
  );
};

export default Login;
