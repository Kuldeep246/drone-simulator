export interface Waypoint {
    latitude: number;
    longitude: number;
    cityName: string;
  }
  
  export interface DronePathData {
    droneName: string;
    waypoints: Waypoint[];
  }
  
  export interface SimulationState {
    isPlaying: boolean;
    speed: number;
    progress: number;
  }