import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonToast, IonList
} from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import React, { useState } from 'react';
import { register } from '../services/api'; 

interface FormData {
  email: string;
  pseudo: string;
  password: string;
  passwordConfirm: string;
}

const RegisterPage: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.passwordConfirm) {
      setToastMsg("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await register(data.email, data.pseudo, data.password);
      setToastMsg("Inscription réussie ! Veuillez attendre la validation.");
    } catch (err: any) {
      console.error(err);
      setToastMsg(err.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inscription</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email requis",
                pattern: { value: /\S+@\S+\.\S+/, message: "Email invalide" }
              }}
              render={({ field }) => (
                <IonItem>
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput {...field} type="email" clearInput />
                </IonItem>
              )}
            />
            {errors.email && <p className="ion-text-start ion-color-danger">{errors.email.message}</p>}

            <Controller
              name="pseudo"
              control={control}
              defaultValue=""
              rules={{ required: "Pseudo requis", minLength: { value: 3, message: "Au moins 3 caractères" } }}
              render={({ field }) => (
                <IonItem>
                  <IonLabel position="stacked">Pseudo</IonLabel>
                  <IonInput {...field} type="text" clearInput />
                </IonItem>
              )}
            />
            {errors.pseudo && <p className="ion-text-start ion-color-danger">{errors.pseudo.message}</p>}

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: "Mot de passe requis", minLength: { value: 6, message: "Au moins 6 caractères" } }}
              render={({ field }) => (
                <IonItem>
                  <IonLabel position="stacked">Mot de passe</IonLabel>
                  <IonInput {...field} type="password" clearInput />
                </IonItem>
              )}
            />
            {errors.password && <p className="ion-text-start ion-color-danger">{errors.password.message}</p>}

            <Controller
              name="passwordConfirm"
              control={control}
              defaultValue=""
              rules={{ required: "Confirmation requise" }}
              render={({ field }) => (
                <IonItem>
                  <IonLabel position="stacked">Confirmation</IonLabel>
                  <IonInput {...field} type="password" clearInput />
                </IonItem>
              )}
            />
            {errors.passwordConfirm && <p className="ion-text-start ion-color-danger">{errors.passwordConfirm.message}</p>}
          </IonList>

          <IonButton expand="block" type="submit">S’inscrire</IonButton>
        </form>

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg || ''}
          duration={3000}
          onDidDismiss={() => setToastMsg(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
