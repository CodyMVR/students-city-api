import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonToast, IonSpinner
} from '@ionic/react';
import { fetchPendingUsers, approveUser, deleteUser, UserItem } from '../services/api';
import Navbar from '../components/Navbar';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers]   = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const pending = await fetchPendingUsers();
      setUsers(pending);
    } catch (e: any) {
      setToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (u: UserItem) => {
    try {
      await approveUser(u.id);
      setToast('Utilisateur validé ✅');
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch (e: any) {
      setToast(e.message);
    }
  };

  const handleDelete = async (u: UserItem) => {
    try {
      await deleteUser(u.id);
      setToast('Utilisateur rejeté et supprimé ✅');
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch (e: any) {
      setToast(e.message);
    }
  };

  return (
    <IonPage>
      <Navbar title="Accueil" />
      <IonContent className="ion-padding">
        {loading && <IonSpinner />}
        <IonList>
          {users.map(u => (
            <IonItem key={u.id}>
              <IonLabel>
                <h2>{u.pseudo}</h2>
                <p>{u.email}</p>
              </IonLabel>
              <IonButton color="success" onClick={() => handleApprove(u)}>✅</IonButton>
              <IonButton color="danger"  onClick={() => handleDelete(u)}>❌</IonButton>
            </IonItem>
          ))}
          {!loading && users.length === 0 && <p>Aucun utilisateur en attente.</p>}
        </IonList>
        <IonToast
          isOpen={!!toast}
          message={toast || ''}
          duration={3000}
          onDidDismiss={() => setToast(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminUsersPage;
