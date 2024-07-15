"use client";

import { contentState, modalState } from "@/lib/state/modalAtom";

import { Content } from "@prisma/client";
import Image from "next/image";
import { useRecoilState } from "recoil";

interface ThumbnailPosterProps {
  content: Content;
}

const ThumbnailPoster: React.FC<ThumbnailPosterProps> = ({ content }) => {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(contentState);

  return (
    <div
      className="relative cursor-pointer transition duration-200 ease-out hover:scale-105"
      style={{ width: '140px', height: '210px' }}
      onClick={() => {
        setCurrentMovie(content);
        setShowModal(true);
      }}
    >
      <Image
        src={content.posterUrl || "/images/noPoster.webp"}
        className="rounded-sm object-cover md:rounded"
        layout="fill"
        alt={content.title || "Movie Poster"}
      />
    </div>
  );
};

export default ThumbnailPoster;
