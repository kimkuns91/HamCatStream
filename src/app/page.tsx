import Banner from "@/components/Banner";
import Contents from "@/components/Contents";
import Row from "@/components/Row";
import { getContents } from "@/lib/fetch";

export default async function Page() {
  const contents = await getContents();
  return (
    <div className="size-full min-h-screen">
      <Banner contents={contents} />

      <section className="container md:space-y-24 md:mt-20">
        <Row title="Trending Now" contents={contents} />
        <Row title="Top Rated" contents={contents} />
        <Row title="Action Thrillers" contents={contents} />
        {/* My List Component */}
        <Row title="Comedies" contents={contents} />
        <Row title="Scary Movies" contents={contents} />
        <Row title="Romance Movies" contents={contents} />
        <Row title="Documentaries" contents={contents} />
      </section>
    </div>
  );
}
