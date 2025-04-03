'use client';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Love_Light, Alumni_Sans_Pinstripe, Fredericka_the_Great } from 'next/font/google';

import './globals.css';

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

const mainTitle = Love_Light({
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

const titleText = process.env.NEXT_PUBLIC_TITLE_TEXT;

function NavLink({ title, href }: { title: string; href: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} className={`${isActive ? 'font-bold text-lg' : ''} hover:text-blue-300`}>
            {title}
        </Link>
    );
}
console.log(process.env.SPOTIFY_CLIENT_ID)

function Navigation() {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialMode = storedTheme ? storedTheme === 'dark' : systemDark;

        setIsDarkMode(initialMode);
        document.documentElement.classList.toggle('dark', initialMode);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    return (
        <div className="border-b border-gray-600 flex sm:flex-row flex-col sm:justify-between sm:py-3 sm:px-5">
            <div className="flex flex-row items-center justify-center px-3 my-3 sm:my-0">
                <p className={`${mainTitle.className} text-6xl`}>{titleText}</p>
                <p className={`${alumniSans.className} text-2xl ps-4`}>Year 3</p>
            </div>
            <div className="sm:w-1/3 flex sm:justify-between">
                <div className={`${fredericka.className} flex flex-auto justify-evenly items-center`}>
                    {links.map((link) => (
                        <NavLink key={link.href} {...link} />
                    ))}
                </div>
                <div className="flex items-center px- w-[60px]">
                    <button onClick={toggleDarkMode}>
                        <Image
                            src={`/images/${isDarkMode ? 'dark-mode' : 'light-mode'}.png`}
                            width={60}
                            height={60}
                            alt="logo"
                            onLoad={() => setIsImageLoaded(true)}
                            className={`${isImageLoaded ? '' : 'img-spinner'}`}
                        />
                    </button>
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
            <body className="bg-white dark:bg-black dark:text-white antialiased">
                <Navigation />
                {children}
            </body>
        </html>
    );
}
