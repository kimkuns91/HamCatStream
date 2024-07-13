import Content from "@/components/Content";
import { getContent } from "@/lib/fetch";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    contentId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const content = await getContent(params.contentId);
  
  if (!content) return redirect("/");

  return <Content content={content} />;
}
