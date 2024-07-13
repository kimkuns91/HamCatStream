"use client";

import "video.js/dist/video-js.css";
import "@videojs/themes/dist/fantasy/index.css";

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
} from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { mutedState, volumeState } from "@/lib/state/modalAtom";

import { IoIosArrowRoundBack } from "react-icons/io";
import type VideoJsPlayer from "video.js/dist/types/player";
import { useRecoilState } from "recoil";
import videojs from "video.js";

interface VideoPlayerProps {
  options: {
    autoplay?: boolean;
    controls?: boolean;
    responsive?: boolean;
    fluid?: boolean;
    sources?: {
      src: string;
      type: string;
    }[];
  };
  onReady?: (player: VideoJsPlayer) => void;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  options,
  onReady,
  title,
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
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoElement.classList.add("custom-video-js"); // Custom class for styling
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
          videojs.log("player is ready");
          if (onReady) {
            onReady(player);
          }
        }
      ));

      // 이벤트 리스너를 추가하여 재생 상태를 업데이트합니다.
      player.on("play", () => setIsPlaying(true));
      player.on("pause", () => setIsPlaying(false));
      player.on("volumechange", () => {
        const muted = player.muted();
        const volume = player.volume();
        if (muted !== undefined) {
          setIsMuted(muted);
        }
        if (volume !== undefined) {
          setVolume(volume || 0);
        }
      });
      player.on("timeupdate", () => {
        const currentTime = player.currentTime();
        const duration = player.duration();
        if (currentTime !== undefined && duration && duration > 0) {
          setProgress((currentTime / duration) * 100);
        }
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

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen min-h-screen max-h-screen bg-black text-2xl"
    >
      {/* 상단 컨트롤 바 */}
      <div
        className={`control-bar top-control-bar ${
          showControls ? "visible-control-bar" : "hidden-control-bar"
        }`}
      >
        {/* 상단 뒤로가기 버튼 */}
        <button
          className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200"
          onClick={() => window.history.back()}
        >
          <IoIosArrowRoundBack className="text-7xl font-bold" />
        </button>
      </div>
      {/* 영상 영역 */}
      <div
        data-vjs-player
        className="w-full max-h-screen flex items-center justify-center cursor-pointer relative"
        onClick={handlePlayPause}
      >
        <div
          ref={videoRef}
          className="w-full max-h-screen max-w-[1920px] mx-auto"
        />
      </div>

      {/* 하단 컨트롤 바 */}
      <div
        className={`control-bar bottom-control-bar ${
          showControls ? "visible-control-bar" : "hidden-control-bar"
        }`}
      >
        {/* 진행률 표시 바 */}
        <div className="w-full h-2 bg-gray-700 mb-8">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            {isPlaying ? (
              <button
                className="text-white"
                onClick={() => playerRef.current?.pause()}
              >
                <FaPause />
              </button>
            ) : (
              <button
                className="text-white"
                onClick={() => playerRef.current?.play()}
              >
                <FaPlay />
              </button>
            )}
            <button
              className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200"
              onClick={() => handleSkip(-10)}
            >
              <FaBackward />
            </button>
            <button
              className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200"
              onClick={() => handleSkip(10)}
            >
              <FaForward />
            </button>
            <div className="relative flex items-center gap-6">
              <button
                className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200"
                onClick={handleMuteToggle}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
          <div className="text-white font-bold">{title}</div>
          <div className="flex items-center gap-6">
            <button className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200">
              <FaStepForward />
            </button>
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
              onClick={handleFullscreenToggle}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
