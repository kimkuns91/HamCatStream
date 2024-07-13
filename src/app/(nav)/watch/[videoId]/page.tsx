import { getContent, getVideo } from "@/lib/fetch";

import Content from "@/components/Content";
import VideoContainer from "@/components/VideoContainer";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    videoId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const video = await getVideo(params.videoId);

  if (!video) return null;

  return <VideoContainer video={video} />;
}
