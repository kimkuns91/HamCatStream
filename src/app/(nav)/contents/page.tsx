import Contents from "@/components/Contents";
import { getContents } from "@/lib/fetch";

export default async function Page() {
  const contents = await getContents();
  
  return <Contents contents={contents} />;
}
