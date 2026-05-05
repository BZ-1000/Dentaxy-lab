import { useState, useCallback, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean | null;
  permissionState: PermissionState | null;
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
    permissionState: null,
  });

  // Check permission state on mount and when it changes
  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.permissions) return;
      
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setState((prev) => ({ 
          ...prev, 
          permissionState: result.state,
          hasPermission: result.state === 'granted' ? true : result.state === 'denied' ? false : null
        }));
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setState((prev) => ({ 
            ...prev, 
            permissionState: result.state,
            hasPermission: result.state === 'granted' ? true : result.state === 'denied' ? false : null
          }));
        });
      } catch (e) {
        console.warn('Permission API not available:', e);
      }
    };

    checkPermission();
  }, []);

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
      // Use shorter timeout and no cache to force fresh permission prompt
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Try to get city and country from reverse geocoding
          let city: string | undefined;
          let country: string | undefined;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
              { 
                headers: { 
                  'Accept-Language': 'es',
                  'User-Agent': 'Dentaxy/1.0 (https://dentaxy.com)'
                }
              }
            );
            const data = await response.json();
            city = data.address?.city || data.address?.town || data.address?.municipality || data.address?.village;
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
            permissionState: 'granted',
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
          let permissionDenied = false;
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado. Habilita el permiso en la configuración de tu navegador y recarga la página.';
              permissionDenied = true;
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible. Verifica que tu GPS esté activo.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado. Intenta de nuevo.';
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
            hasPermission: permissionDenied ? false : null,
            permissionState: permissionDenied ? 'denied' : null,
          });

          resolve({ success: false, error: errorMessage });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0, // Force fresh location, no cache
        }
      );
    });
  }, []);

  return {
    ...state,
    requestLocation,
  };
}
