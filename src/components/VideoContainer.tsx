"use client";

import { Content, Episode } from "@prisma/client";

import Player from "video.js/dist/types/player";
import VideoPlayer from "./VideoPlayer";

interface VideoContainerProps {
  video: Content | Episode;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ video }) => {
  const videoJsOptions = {
    autoplay: true,
    controls: false,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: video.url,
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
      options={videoJsOptions}
      onReady={handlePlayerReady}
    />
  );
};

export default VideoContainer;
