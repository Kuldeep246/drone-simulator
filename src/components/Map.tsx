import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface MapProps {
  waypoints: Array<{latitude: number; longitude: number; cityName: string}>;
  currentPosition: [number, number] | null;
  isPlaying: boolean;
}

const DroneMarker = ({ position }: { position: [number, number] }) => {
  return (
    <Marker 
      position={position}
      icon={new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })}
    />
  );
};

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

export const Map = ({ waypoints, currentPosition }: MapProps) => {
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (currentPosition) {
      setCenter(currentPosition);
    } else if (waypoints.length > 0) {
      setCenter([waypoints[0].latitude, waypoints[0].longitude]);
    }
  }, [currentPosition, waypoints]);

  const pathPositions = waypoints.map(wp => [wp.latitude, wp.longitude] as [number, number]);

  return (
    <div className="w-full mx-2 h-screen rounded-md overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater center={center} />
        
        {pathPositions.length > 1 && (
          <Polyline 
            positions={pathPositions}
            color="#3B82F6"
            weight={3}
            opacity={0.7}
            dashArray={[5, 5]}
          />
        )}

        {waypoints.map((waypoint, idx) => (
          <Marker
            key={idx}
            position={[waypoint.latitude, waypoint.longitude]}
            icon={new Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })}
          />
        ))}

        {currentPosition && (
          <DroneMarker position={currentPosition} />
        )}
      </MapContainer>
    </div>
  );
};