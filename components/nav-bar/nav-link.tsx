import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, children }: NavLinkProps) => (
  <Link
    href={href}
    className="text-white text-lg hover:text-pink-400 transition-colors"
  >
    {children}
  </Link>
);