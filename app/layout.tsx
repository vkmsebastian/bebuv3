'use client';

import { Fredericka_the_Great, Alumni_Sans_Pinstripe } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import { usePathname } from 'next/navigation';

const fredericka = Fredericka_the_Great({
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
});

const alumniSans = Alumni_Sans_Pinstripe({
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
});

const links = [
    { href: '/', title: 'Home' },
    { href: '/player', title: 'Player' },
    { href: '/photos', title: 'Photos' },
    { href: '/about', title: 'About' },
];

function NavLink({ title, href }: { title: string; href: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} className={`${isActive ? 'text-blue-600 font-bold' : ''} hover:text-blue-300`}>
            {title}
        </Link>
    );
}

function Navigation() {
    return (
        <div className="border-b border-gray-600 flex sm:flex-row flex-col sm:justify-between sm:py-3 ">
            <div className="flex flex-row items-center justify-center px-3 my-3 sm:my-0">
                <p className={`${fredericka.className} text-6xl px-5`}>VS||JS</p>
                <p className={`${alumniSans.className} text-2xl`}>Year 3</p>
            </div>
            <div className="sm:w-1/3 flex sm:justify-between">
                <div className={`${fredericka.className} flex flex-auto justify-evenly items-center`}>
                    {links.map((link) => (
                        <NavLink key={link.href} {...link} />
                    ))}
                </div>
                <div className="flex items-center px-2">
                    <Image src="/images/cat.png" width={50} height={50} alt="logo" />
                </div>
            </div>
        </div>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Navigation />
                {children}
            </body>
        </html>
    );
}
