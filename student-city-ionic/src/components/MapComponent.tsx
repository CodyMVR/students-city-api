import React, { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow
} from '@react-google-maps/api';
import { IonSpinner, IonToast } from '@ionic/react';
import { getToken } from '../services/auth';

interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  averageRating: number;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapComponent: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string>('');

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCZCQD6hAxDjbtYMi6EFjJvqcSycoVUT_w'
  });

  const onLoad = useCallback((map: google.maps.Map) => {
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => setError('Impossible de récupérer la position GPS')
    );
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/places', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Non autorisé');
        const data: any[] = await res.json();

        const parsed: Place[] = data
          .map(p => ({
            id: p.id,
            name: p.name,
            latitude: Number(p.latitude),
            longitude: Number(p.longitude),
            averageRating: Number(p.averageRating) || 0
          }))
          .filter(p => !isNaN(p.latitude) && !isNaN(p.longitude));

        setPlaces(parsed);
      } catch {
        setError('Erreur lors du chargement des établissements');
      }
    })();
  }, []);

  if (loadError) {
    return <div>Erreur de chargement de la carte</div>;
  }
  if (!isLoaded || position === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}>
        <IonSpinner name="crescent" />
      </div>
    );
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={14}
        onLoad={onLoad}
      >
        <Marker
          position={position}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
          }}
        />

        {places.map(place => (
          <Marker
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            onClick={() => setSelected(place)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.latitude, lng: selected.longitude }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h2>{selected.name}</h2>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <IonToast
        isOpen={error !== ''}
        message={error}
        onDidDismiss={() => setError('')}
        duration={2000}
      />
    </>
  );
};

export default React.memo(MapComponent);