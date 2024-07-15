// BottomControlBar.tsx

import {
  FaBackward,
  FaClosedCaptioning,
  FaCompress,
  FaExpand,
  FaForward,
  FaList,
  FaPause,
  FaPlay,
  FaStepForward,
  FaTachometerAlt,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

import { formatTime } from '@/lib/formatTime';
import { useRouter } from 'next/navigation';
import React from 'react';

interface BottomControlBarProps {
  showControls: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  volume: number;
  progress: number;
  currentTime: number;
  duration: number;
  title: string;
  nextVideo?: string | null;
  onPlayPause: () => void;
  onSkip: (seconds: number) => void;
  onVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onProgressChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BottomControlBar: React.FC<BottomControlBarProps> = ({
  showControls,
  isPlaying,
  isMuted,
  isFullscreen,
  volume,
  progress,
  currentTime,
  duration,
  title,
  nextVideo,
  onPlayPause,
  onSkip,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onProgressChange,
}) => {
  const navigate = useRouter();
  return (
    <div
      className={`control-bar bottom-0 px-8 md:px-12 py-8 ${
        showControls ? 'visible-control-bar' : 'hidden-control-bar'
      }`}
    >
      <div className="w-full flex items-center gap-4 mb-8">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={onProgressChange}
          className="flex-1 h-2 bg-gray-700 cursor-pointer rounded-md focus:outline-none"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${progress}%, #374151 ${progress}%)`,
          }}
        />
        <div className="text-sm text-white">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="w-full flex flex-col gap-8 md:gap-0 md:flex-row justify-between items-center">
        <div className="flex-1 flex items-center justify-start gap-8">
          {isPlaying ? (
            <button className="text-white" onClick={onPlayPause}>
              <FaPause />
            </button>
          ) : (
            <button className="text-white" onClick={onPlayPause}>
              <FaPlay />
            </button>
          )}
          <button
            className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200"
            onClick={() => onSkip(-10)}
          >
            <FaBackward />
          </button>
          <button
            className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200"
            onClick={() => onSkip(10)}
          >
            <FaForward />
          </button>
          <div className="relative flex items-center gap-6">
            <button
              className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200"
              onClick={onMuteToggle}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="w-24 cursor-pointer focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 hidden md:flex items-center justify-center text-white font-bold text-2xl">
          <p>{title}</p>
        </div>
        <div className="flex-1 flex items-center justify-end gap-6">
          {
            nextVideo && (
              <button
              onClick={() => {
                navigate.push(`/watch/${nextVideo}`);
              }} 
              className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200">
                <FaStepForward />
              </button>
            )
          }
          <button className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200">
            <FaList />
          </button>
          <button className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200">
            <FaClosedCaptioning />
          </button>
          <button className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200">
            <FaTachometerAlt />
          </button>
          <button
            className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200"
            onClick={onFullscreenToggle}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomControlBar;
