import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Waypoint } from '../types/index';

interface WaypointInputProps {
  onAddWaypoint: (waypoint: Waypoint) => void;
}

export const WaypointInput = ({ onAddWaypoint }: WaypointInputProps) => {
  const [waypoint, setWaypoint] = useState<Waypoint>({
    latitude: 0,
    longitude: 0,
    cityName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeCity = async (cityName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      } else {
        throw new Error('City not found');
      }
    } catch (err) {
      throw new Error('Failed to geocode city');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let finalWaypoint = { ...waypoint };
      if (waypoint.cityName && (waypoint.latitude === 0 || waypoint.longitude === 0)) {
        const coords = await geocodeCity(waypoint.cityName);
        finalWaypoint = {
          ...finalWaypoint,
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
      }
      onAddWaypoint(finalWaypoint);
      setWaypoint({ latitude: 0, longitude: 0, cityName: '' });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6  w-full  mx-auto space-y-4 ">
      <h2 className="text-lg font-semibold text-gray-800">Add Waypoint</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={waypoint.latitude}
            onChange={(e) => setWaypoint({ ...waypoint, latitude: Number(e.target.value) })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={waypoint.longitude}
            onChange={(e) => setWaypoint({ ...waypoint, longitude: Number(e.target.value) })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
          <input
            type="text"
            value={waypoint.cityName}
            onChange={(e) => setWaypoint({ ...waypoint, cityName: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-white font-medium transition ${isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
        <span>{isLoading ? 'Loading...' : 'Add Waypoint'}</span>
      </button>
    </form>
  );
};
