'use client';

import React, { useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import { Content } from '@prisma/client';
import RankIcon from './RankIcon';
import ThumbnailPoster from './ThumbnailPoster';

interface TodayTop10VideosProps {
  contents: Content[];
}

const TodayTop10Videos: React.FC<TodayTop10VideosProps> = ({ contents }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // contents 배열을 4배로 늘림
  const extendedContents = Array.from({ length: 4 }, () => contents)
    .flat()
    .slice(0, 10);
  return (
    <div className="space-y-4 md:space-y-2">
      <h2 className="cursor-pointer text-lg font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        오늘의 햄캣 Top 10
      </h2>
      <div className="group relative md:-ml-2">
        <FaArrowLeft
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />

        <div
          ref={rowRef}
          className="flex items-center space-x-2 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2"
        >
          {extendedContents.map((content, index) => (
            <div key={content.id} className="flex items-end space-x-0.5 md:space-x-2">
              <RankIcon rank={index + 1} />
              <ThumbnailPoster content={content} />
            </div>
          ))}

          <FaArrowRight
            className={`absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100`}
            onClick={() => handleClick('right')}
          />
        </div>
      </div>
    </div>
  );
};

export default TodayTop10Videos;
