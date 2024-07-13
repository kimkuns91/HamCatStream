"use client";

import { contentState, modalState } from "@/lib/state/modalAtom";

import { Content } from "@prisma/client";
import Image from "next/image";
import { useRecoilState } from "recoil";

interface ThumbnailProps {
  content: Content;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ content }) => {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(contentState);
  console.log('showModal :', showModal);
  console.log('currentMovie :', currentMovie);
  return (
    <div
      className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105"
      onClick={() => {
        setCurrentMovie(content);
        setShowModal(true);
      }}
    >
      <Image
        src={content.posterUrl || "/images/noPoster.webp"}
        className="rounded-sm object-cover md:rounded"
        layout="fill"
        alt=""
      />
    </div>
  );
};

export default Thumbnail;
