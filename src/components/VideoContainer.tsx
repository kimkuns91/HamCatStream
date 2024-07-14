"use client";

import { Content, Episode } from "@prisma/client";

import Player from "video.js/dist/types/player";
import VideoPlayer from "./VideoPlayer";

interface VideoContainerProps {
  video: Content | Episode;
  nextVideo?: string | null;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ video, nextVideo }) => {
  const videoJsOptions = {
    autoplay: true,
    controls: false,
    responsive: true,
    // fluid: true,
    fill: true,
    sources: [
      {
        src: video.videoUrl!,
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player: Player) => {
    console.log("Player is ready: ", player);
  };

  return (
    <VideoPlayer
      title={video.title}
      nextVideo={nextVideo}
      options={videoJsOptions}
      onReady={handlePlayerReady}
    />
  );
};

export default VideoContainer;
