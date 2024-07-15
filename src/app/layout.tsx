import './globals.css';

import Header from '@/components/Header';
import ModalComponent from '@/components/ModalComponent';
import RecoilRootWrapper from '@/components/RecoilWrapper';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Head from 'next/head';

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '400', '700', '900'],
  variable: '--noto_sans_kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HamCat Stream',
  description: '최고의 스트리밍 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body
        className={cn(
          'custom-scrollbar',
          'bg-background text-foreground antialiased',
          noto_sans_kr.variable
        )}
      >
        <RecoilRootWrapper>
          <div className="flex min-h-screen w-full flex-col">
            <Header />
            {children}
            <ModalComponent />
          </div>
        </RecoilRootWrapper>
      </body>
    </html>
  );
}
