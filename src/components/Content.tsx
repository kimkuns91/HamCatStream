"use client";

import { Content as ContentType, Episode } from "@prisma/client";

import { useRouter } from "next/navigation";

interface ExtendedContentType extends ContentType {
  episodes?: Episode[];
}

interface ContentProps {
  content: ExtendedContentType;
}

const Content: React.FC<ContentProps> = ({ content }) => {
  const navigate = useRouter();
  if (content.type === "SERIES" && content.episodes) {
    // 에피소드를 episode 필드 기준으로 정렬
    const sortedEpisodes = content.episodes.sort(
      (a, b) => a.episode - b.episode
    );

    return (
      <div>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        {sortedEpisodes.map((episode) => (
          <div
            key={episode.id}
            onClick={() => {
              navigate.push("/watch/" + episode.id);
            }}
            className="mb-4 cursor-pointer"
          >
            <h3 className="text-xl mb-1">{episode.title}</h3>

            <p className="mt-1">{episode.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
    </div>
  );
};

export default Content;
