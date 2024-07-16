import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="w-full h-screen">
      <div className="absolute top-0 left-0 -z-10 h-[40vh] lg:h-[65vh] w-full">
        <Image
          src={'/images/introBg.jpg'}
          fill
          objectFit="cover"
          alt="{movie?.title || movie?.name || movie?.original_name}"
          priority
        />
      </div>
      <div className="banner-overlay h-screen lg:h-[80vh]" />
      <div className="container flex items-center justify-between py-4">
        <div className="relative w-[70px] h-[60px] lg:w-[125px] lg:h-[100px] transition-all ease-in-out hover:opacity-80">
          <Image
            src={'/images/LogoBasic.png'}
            alt="Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <Link href="/login" className="bg-red-600 px-4 py-1 rounded-lg">
          로그인
        </Link>
      </div>
      <div className="container h-1/3 md:h-1/2 flex flex-col items-center justify-center space-y-4 md:space-y-8">
        <h2 className="text-2xl font-bold md:text-5xl">
          영화, 시리즈 등을 무제한으로
        </h2>
        <h3 className="text-base md:text-2xl">
          어디서나 자유롭게 시청하세요. 해지는 언제든 가능합니다.
        </h3>
        <p className="hidden md:block text-sm font-light text-center md:text-xl">
          시청할 준비가 되셨나요? 멤버십을 등록하거나 재시작하려면 이메일 주소를
          입력하세요.
        </p>
        <div>
          <input type="text" />
          <button>시작하기</button>
        </div>
      </div>
    </div>
  );
}
