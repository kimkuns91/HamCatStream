import Banner from '@/components/Banner';
import Row from '@/components/Row';
import TodayTop10Videos from '@/components/Top10Videos';
import { getContents } from '@/lib/fetch';

export default async function Page() {
  const contents = await getContents();

  return (
    <div className="size-full min-h-screen">
      <Banner contents={contents} />

      <section className="container space-y-6 md:space-y-24 md:mt-20">
        <TodayTop10Videos contents={contents} />
        <Row title="지금 뜨는 컨텐츠" contents={contents} />
        <Row title="최고 평점" contents={contents} />
        <Row title="액션 스릴러" contents={contents} />
        {/* My List Component */}
        <Row title="코미디" contents={contents} />
        <Row title="무서운 영화" contents={contents} />
        <Row title="로맨스 영화" contents={contents} />
        <Row title="다큐멘터리" contents={contents} />
      </section>
    </div>
  );
}
