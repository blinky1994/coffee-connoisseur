import { useState } from "react";

const useTrackLocation = () => {
    const [locationErrorMsg, setLocationErrorMsg] = useState('');
    const [latLong, setLatLong] = useState('');
    const [isFindingLocation, setIsFindingLocation] = useState(false);

    const success = (position) => {
        setIsFindingLocation(false);
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLatLong(`${latitude},${longitude}`);
        setLocationErrorMsg('');
    }

    const error = () => {
        setIsFindingLocation(false);
        setLocationErrorMsg('Unable to retrieve your location');
    }

    const handleTrackLocation = () => {
        setIsFindingLocation(true);
        if (!navigator.geolocation) {
            setLocationErrorMsg('Geolocation is not supported by your browser');
          } else {
            // status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(success, error);
          }
    }

    return {
        latLong,
        handleTrackLocation,
        locationErrorMsg,
        isFindingLocation
    };
}

export default useTrackLocation;