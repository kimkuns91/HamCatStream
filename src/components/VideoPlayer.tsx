'use client';

import '@videojs/themes/dist/fantasy/index.css';
import 'video.js/dist/video-js.css';

import { mutedState, volumeState } from '@/lib/state/modalAtom';
import React, { useEffect, useRef, useState } from 'react';

import { useRecoilState } from 'recoil';
import videojs from 'video.js';
import type VideoJsPlayer from 'video.js/dist/types/player';
import BottomControlBar from './BottomControlBar';
import TopControlBar from './TopControlBar';

interface VideoPlayerProps {
  options: {
    autoplay?: boolean;
    controls?: boolean;
    responsive?: boolean;
    fluid?: boolean;
    fill?: boolean;
    sources?: {
      src: string;
      type: string;
    }[];
  };
  onReady?: (player: VideoJsPlayer) => void;
  title?: string;
  nextVideo?: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  options,
  onReady,
  title,
  nextVideo
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useRecoilState(volumeState);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useRecoilState(mutedState);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [aspectRatio, setAspectRatio] = useState('16 / 9');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoElement.classList.add('custom-video-js'); // Custom class for styling
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const player = (playerRef.current = videojs(
        videoElement,
        {
          ...options,
          controls: false, // Disable default controls
        },
        () => {
          videojs.log('player is ready');
          if (onReady) {
            onReady(player);
          }
        }
      ));

      // 이벤트 리스너를 추가하여 재생 상태를 업데이트합니다.
      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));
      player.on('volumechange', () => {
        const muted = player.muted();
        const volume = player.volume();
        if (muted !== undefined) {
          setIsMuted(muted);
        }
        if (volume !== undefined) {
          setVolume(volume || 0);
        }
      });
      player.on('timeupdate', () => {
        const currentTime = player.currentTime();
        const duration = player.duration();
        if (currentTime !== undefined && duration && duration > 0) {
          setCurrentTime(currentTime);
          setDuration(duration);
          setProgress((currentTime / duration) * 100);
        }
      });
      player.on('loadedmetadata', () => {
        const videoWidth = player.videoWidth();
        const videoHeight = player.videoHeight();
        setAspectRatio(`${videoWidth} / ${videoHeight}`);
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay || false);
      player.src(options.sources || []);
    }
  }, [options, onReady, setIsMuted, setVolume]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.volume(volume);
      player.muted(isMuted);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 1000);
    };

    const handleMouseMove = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSkip = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      if (currentTime !== undefined) {
        playerRef.current.currentTime(currentTime + seconds);
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.volume(newVolume);
      if (newVolume > 0) {
        playerRef.current.muted(false);
        setIsMuted(false);
      } else {
        playerRef.current.muted(true);
        setIsMuted(true);
      }
    }
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      if (playerRef.current.muted()) {
        playerRef.current.muted(false);
        setIsMuted(false);
      } else {
        playerRef.current.muted(true);
        setIsMuted(true);
      }
    }
  };

  const handleFullscreenToggle = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (playerRef.current) {
      const newProgress = Number(event.target.value);
      const newTime = (newProgress / 100) * duration;
      playerRef.current.currentTime(newTime);
      setProgress(newProgress);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleSkip(10);
      } else if (event.key === 'ArrowLeft') {
        handleSkip(-10);
      } else if (event.key === ' ') {
        event.preventDefault(); // 스크롤 방지
        handlePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen min-h-screen max-h-screen bg-black text-sm md:text-2xl focus:outline-none"
    >
      <TopControlBar
        showControls={showControls}
        onBack={() => window.history.back()}
      />
      <div
        data-vjs-player
        className="w-full h-full flex items-center justify-center cursor-pointer relative focus:outline-none"
        onClick={handlePlayPause}
        style={{ maxHeight: '100vh', overflow: 'hidden' }}
      >
        <div
          ref={videoRef}
          className="w-full mx-auto"
          style={{
            aspectRatio,
            objectFit: 'contain',
            maxHeight: '100%',
          }}
        />
      </div>
      <BottomControlBar
        showControls={showControls}
        isPlaying={isPlaying}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        volume={volume}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        title={title || ''}
        nextVideo={nextVideo}
        onPlayPause={handlePlayPause}
        onSkip={handleSkip}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onFullscreenToggle={handleFullscreenToggle}
        onProgressChange={handleProgressChange}
      />
    </div>
  );
};

export default VideoPlayer;
