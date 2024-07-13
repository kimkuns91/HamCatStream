"use client";

import { Content } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ContentsProps {
  contents: Content[];
}

const Contents: React.FC<ContentsProps> = ({ contents }) => {
  const navigate = useRouter();
  return (
    <div className="w-full min-h-screen">
      {contents.map((content) => (
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate.push(`/contents/${content.id}`);
          }}
          key={content.id}
        >
          <h1>{content.title}</h1>
        </div>
      ))}
    </div>
  );
};

export default Contents;
