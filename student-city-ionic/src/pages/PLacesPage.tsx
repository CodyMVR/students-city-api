import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonSpinner, IonSearchbar
} from '@ionic/react';
import { fetchPlaces } from '../services/api';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Place {
  id: number;
  name: string;
  description: string;
  address: string;
}

const PlacesPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPlaces();
      setPlaces(data);
      setFilteredPlaces(data);
    } catch (e) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const filtered = places.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term)
      );
      setFilteredPlaces(filtered);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchTerm, places]);

  return (
    <IonPage>
      <Navbar title="Accueil" />
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={() => history.push('/places/add')}>
          + Ajouter un lieu
        </IonButton>

        <IonSearchbar
          value={searchTerm}
          debounce={150}
          onIonChange={e => {
            const val = e.detail.value ?? '';
            setSearchTerm(val);
          }}
          placeholder="Rechercher un lieu..."
        />

        {loading ? (
          <IonSpinner style={{ margin: '2rem auto', display: 'block' }} />
        ) : (
          <IonList>
            {filteredPlaces.map(p => (
              <IonItem key={p.id}>
                <IonLabel>
                  <h2>{p.name}</h2>
                  <p>{p.description}</p>
                  <small>{p.address}</small>
                </IonLabel>
              </IonItem>
            ))}
            {filteredPlaces.length === 0 && <p>Aucun lieu trouvé.</p>}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PlacesPage;
