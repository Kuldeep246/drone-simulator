import './App.css'
import { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { Controls } from './components/Controls';
import { WaypointInput } from './components/WaypointInput';
import { Waypoint, DronePathData, SimulationState } from './types/index';

function App() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [simulation, setSimulation] = useState<SimulationState>({
    isPlaying: false,
    speed: 1,
    progress: 0,
  });

  const handleAddWaypoint = (waypoint: Waypoint) => {
    setWaypoints([...waypoints, waypoint]);
  };
  const handleDeleteWaypoint = (indexToDelete: number) => {
    setWaypoints(waypoints.filter((_, index) => index !== indexToDelete));
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const data: DronePathData = JSON.parse(text);
      setWaypoints(data.waypoints);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Invalid file format. Please upload a valid JSON file.');
    }
  };

  const interpolatePosition = (progress: number): [number, number] => {
    if (waypoints.length === 0) {
      return [0, 0];
    }

    if (waypoints.length === 1) {
      return [waypoints[0].latitude, waypoints[0].longitude];
    }

    const totalSegments = waypoints.length - 1;
    const segmentProgress = (progress / 100) * totalSegments;
    const currentSegment = Math.min(Math.floor(segmentProgress), totalSegments - 1);

    if (currentSegment >= totalSegments) {
      return [waypoints[totalSegments].latitude, waypoints[totalSegments].longitude];
    }

    const segmentFraction = segmentProgress - currentSegment;
    const start = waypoints[currentSegment];
    const end = waypoints[currentSegment + 1];

    const lat = start.latitude + (end.latitude - start.latitude) * segmentFraction;
    const lng = start.longitude + (end.longitude - start.longitude) * segmentFraction;

    return [lat, lng];
  };

  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp: number;

    const animate = (timestamp: number) => {
      if (!simulation.isPlaying) return;
      if (!lastTimestamp) lastTimestamp = timestamp;

      const delta = timestamp - lastTimestamp;
      const progressIncrement = (delta / 1000) * simulation.speed;

      setSimulation((prev) => ({
        ...prev,
        progress: Math.min(100, prev.progress + progressIncrement),
      }));

      lastTimestamp = timestamp;
      animationFrame = requestAnimationFrame(animate);
    };

    if (simulation.isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [simulation.isPlaying, simulation.speed]);

  useEffect(() => {
    if (waypoints.length > 0) {
      setCurrentPosition(interpolatePosition(simulation.progress));
    } else {
      setCurrentPosition(null);
    }
  }, [simulation.progress, waypoints]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="bg-slate-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Drone Flight Simulator</h1>
      </div>
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className=' py-3 shadow mx-3 my-4'>
          <Controls
            isPlaying={simulation.isPlaying}
            speed={simulation.speed}
            progress={simulation.progress}
            onPlay={() => setSimulation(prev => ({ ...prev, isPlaying: true }))}
            onPause={() => setSimulation(prev => ({ ...prev, isPlaying: false }))}
            onReset={() => setSimulation({ isPlaying: false, speed: 1, progress: 0 })}
            onSpeedChange={(speed) => setSimulation(prev => ({ ...prev, speed }))}
            onProgressChange={(progress) => setSimulation(prev => ({ ...prev, progress }))}
            onFileUpload={handleFileUpload}
          />

          <WaypointInput onAddWaypoint={handleAddWaypoint} />

          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Waypoints</h2>
            <div className="space-y-2">
              {waypoints.map((waypoint, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">{waypoint.cityName}</span>
                  <span className="text-gray-600">
                    ({waypoint.latitude.toFixed(4)}, {waypoint.longitude.toFixed(4)})
                  </span>
                  <button
                    onClick={() => handleDeleteWaypoint(index)}
                    className="ml-4 px-2 py-1 text-red-500 border border-red-500 rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Map
          waypoints={waypoints}
          currentPosition={currentPosition}
          isPlaying={simulation.isPlaying}
        />
      </div>
    </div>
  );
}

export default App;