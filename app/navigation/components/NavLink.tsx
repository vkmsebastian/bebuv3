"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  title,
  href,
}: Readonly<{ title: string; href: string }>) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`${isActive ? "font-bold text-lg" : ""} hover:text-blue-300`}>
      {title}
    </Link>
  );
}
