'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CircleUser, Menu, Package2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const shouldHideHeader = pathname.startsWith('/watch') || pathname === '/intro';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (shouldHideHeader) {
    return null;
  }

  return (
    <header
      className={cn(
        'sticky z-20 top-0 py-6 text-white transition-colors duration-300 header',
        isScrolled ? 'header-background' : 'header-background-out'
      )}
    >
      <div className="w-full container flex items-center justify-between gap-4">
        <Link href="/" className="hidden md:flex items-center mr-6">
          <div className="relative w-[70px] h-[60px] lg:w-[125px] lg:h-[100px] transition-all ease-in-out hover:opacity-80">
            <Image
              src={'/images/LogoBasic.png'}
              alt="Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </Link>
        <nav className="hidden flex-col gap-6 text-lg font-medium xl:flex xl:flex-row lg:items-center lg:gap-6">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            홈
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            시리즈
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            영화
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            NEW! 요즘 대세 콘텐츠
          </Link>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            내가 찜한 리스트
          </Link>
        </nav>

        <Sheet>
          <div className='flex items-center space-x-4'>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden bg-primary/20 border-none"
              >
                <Menu className="h-10 w-10 text-white font-bold" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <Link href="/" className="flex md:hidden items-center mr-6">
              <div className="relative w-[60px] h-[50px] transition-all ease-in-out hover:opacity-80">
                <Image
                  src={'/images/LogoBasic.png'}
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
            </Link>
          </div>
          <SheetContent side="left" className='bg-primary border-gray-700'>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link href="#" className="hover:text-foreground">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="text-primary absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="제목, 사람, 장르"
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:flex">
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
