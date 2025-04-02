import { Play, Pause, RotateCcw, Upload } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  speed: number;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onProgressChange: (progress: number) => void;
  onFileUpload: (file: File) => void;
}

export const Controls = ({
  isPlaying,
  speed,
  progress,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onProgressChange,
  onFileUpload,
}: ControlsProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="bg-white p-6 space-y-6 rounded-lg shadow-md">
      <div className="flex space-x-4">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex items-center justify-center w-3/4 py-2 bg-black text-white rounded-md transition hover:opacity-80"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span className="ml-2 font-semibold text-lg">
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center px-6 py-2 bg-red-500 text-white rounded-md transition hover:bg-red-600"
        >
          <RotateCcw size={20} />
          <span className="ml-2 font-semibold text-lg">Reset</span>
        </button>
      </div>

      <label className="flex items-center justify-center space-x-3 px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer transition hover:bg-green-700">
        <Upload size={20} />
        <span className="font-semibold text-lg">Upload JSON</span>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Speed</span>
          <span className="text-lg font-semibold">{speed}x</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer accent-black"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Progress</span>
          <span className="text-lg font-semibold">{progress}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => onProgressChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer accent-black"
        />
      </div>
    </div>
  );
};
