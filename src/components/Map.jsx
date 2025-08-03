import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";

import {
  useEffect,
  useState,
} from "react";

import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";

import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] =
    useState([40, 0]);

  const {
    isLoading: isLoadingposition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] =
    useUrlPosition();

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([
          geolocationPosition.lat,
          geolocationPosition.lng,
        ]);
    },
    [geolocationPosition]
  );

  useEffect(
    function () {
      if (mapLat && mapLng)
        setMapPosition([
          mapLat,
          mapLng,
        ]);
    },
    [mapLat, mapLng]
  );

  return (
    <div
      className={styles.mapContainer}
    >
      {!geolocationPosition && (
        <Button
          type="position"
          onClick={getPosition}
        >
          {isLoadingposition
            ? "loading..."
            : "use your position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[
              city.position.lat,
              city.position.lng,
            ]}
            key={city.id}
          >
            <Popup>
              <span>
                {city.emoji}
                {city.cityName}
              </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter
          position={mapPosition}
        />
        <DetectForm />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectForm() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) =>
      navigate(
        `form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`
      ),
  });
}

export default Map;
