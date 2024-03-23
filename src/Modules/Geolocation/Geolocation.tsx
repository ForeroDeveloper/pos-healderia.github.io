import React, { useState } from 'react';

export const Geolocation: React.FC = () => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setError(null); // Clear any previous errors
          },
          (err) => {
            setError(err.message);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };
  
    const handleRetry = () => {
      setLatitude(null); // Reset latitude and longitude
      setLongitude(null);
      getLocation(); // Request geolocation again
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Geolocation</h1>
        {error && (
          <div className="mb-4">
            <p className="text-red-500">{error}</p>
            <button
              className="text-blue-500 underline mt-2"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        )}
        {latitude !== null && longitude !== null && (
          <div>
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
          </div>
        )}
        {!error && (latitude === null || longitude === null) && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={getLocation}
          >
            Get Location
          </button>
        )}
      </div>
    );
};

