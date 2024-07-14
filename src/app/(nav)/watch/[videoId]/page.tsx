import VideoContainer from '@/components/VideoContainer';
import { getVideo } from '@/lib/fetch';

interface PageProps {
  params: {
    videoId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const videoData = await getVideo(params.videoId);

  if (!videoData) return null;

  return (
    <VideoContainer
      video={videoData.video}
      nextVideo={videoData.nextEpisode?.id}
    />
  );
}
