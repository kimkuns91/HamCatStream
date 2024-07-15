'use client';

import { contentState, modalState } from '@/lib/state/modalAtom';
import { useEffect, useState } from 'react';
import { FaInfoCircle, FaPlay } from 'react-icons/fa';

import { Content } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { Button } from './ui/button';

interface BannerProps {
  contents: Content[];
}

const Banner: React.FC<BannerProps> = ({ contents }) => {
  const [content, setContent] = useState<Content | null>(null);
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(contentState);

  const navigate = useRouter();

  useEffect(() => {
    setContent(contents[Math.floor(Math.random() * contents.length)]);
  }, [contents]);

  return (
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[50vh] lg:justify-end lg:pb-12">
      <div className="absolute top-0 left-0 -z-10 h-[40vh] lg:h-[65vh] w-full">
        {content?.backdropUrl && (
          <Image
            src={content.backdropUrl}
            fill 
            objectFit="cover"
            alt="{movie?.title || movie?.name || movie?.original_name}"
            priority
          />
        )}
      </div>
      <div className="banner-overlay h-screen lg:h-[80vh]" />

      <div className="container flex flex-col space-y-8">
        {content?.titleImageUrl ? (
          <Image
            src={content?.titleImageUrl}
            width={500}
            height={300}
            className='w-1/2 lg:w-5/12'
            alt={content?.title}
          />
        ) : (
          <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl">
            {content?.title}
          </h1>
        )}

        <p className="hidden md:block max-w-xs text-sm text-shadow-md md:max-w-lg md:text-lg lg:max-w-2xl lg:text-xl">
          {content?.description}
        </p>

        <div className="flex space-x-3">
          <Button
            onClick={() => {
              if (content?.videoUrl) {
                navigate.push(`/watch/${content.id}`);
              } else {
              }
            }}
            className="bg-white text-black py-7 px-8 flex gap-4 hover:opacity-80 hover:bg-[#e6e6e6] transition-opacity ease-in-out"
          >
            <FaPlay className="h-4 w-4 md:h-7 md:w-7" />
            <p className="text-lg font-bold">재생</p>
          </Button>
          <Button
            className="bg-[gray]/70 py-7 px-8 flex gap-4"
            onClick={() => {
              setCurrentMovie(content);
              setShowModal(true);
            }}
          >
            <p className="text-lg font-bold">상세정보</p>
            <FaInfoCircle className="h-5 w-5 md:h-8 md:w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
