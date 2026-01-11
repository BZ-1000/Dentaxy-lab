import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    accuracy: null,
    error: null,
    isLoading: false,
    hasPermission: null,
  });

  // Request geolocation permission and get coordinates
  const requestLocation = useCallback(async (): Promise<{
    success: boolean;
    lat?: number;
    lng?: number;
    city?: string;
    country?: string;
    error?: string;
  }> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const error = 'Tu navegador no soporta geolocalización';
      setState((prev) => ({ ...prev, isLoading: false, error, hasPermission: false }));
      return { success: false, error };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Try to get city and country from reverse geocoding
          let city: string | undefined;
          let country: string | undefined;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            city = data.address?.city || data.address?.town || data.address?.municipality;
            country = data.address?.country;
          } catch (e) {
            console.warn('Reverse geocoding failed:', e);
          }

          setState({
            latitude,
            longitude,
            city: city || null,
            country: country || null,
            accuracy,
            error: null,
            isLoading: false,
            hasPermission: true,
          });

          resolve({
            success: true,
            lat: latitude,
            lng: longitude,
            city,
            country,
          });
        },
        (error) => {
          let errorMessage = 'Error al obtener ubicación';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado';
              break;
          }

          setState({
            latitude: null,
            longitude: null,
            city: null,
            country: null,
            accuracy: null,
            error: errorMessage,
            isLoading: false,
            hasPermission: error.code === error.PERMISSION_DENIED ? false : null,
          });

          resolve({ success: false, error: errorMessage });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  return {
    ...state,
    requestLocation,
  };
}
