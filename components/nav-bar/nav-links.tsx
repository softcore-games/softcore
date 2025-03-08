import { NavLink } from "./nav-link";

interface NavLinksProps {
  isLoggedIn: boolean;
  stamina?: number;
  className?: string;
}

export const NavLinks = ({
  isLoggedIn,
  stamina,
  className = "",
}: NavLinksProps) => (
  <div className={`space-x-14 z-10 ${className}`}>
    {/* {isLoggedIn && (
      <a className="text-white text-lg hover:text-pink-400 transition-colors">
        <span className="font-bold">{stamina}</span> NFT Gallery
      </a>
    )} */}
    <NavLink href="/nft-gallery">NFT Gallery</NavLink>
    <NavLink href="#">FAQ</NavLink>
    <NavLink href="#">{isLoggedIn ? "ABOUT" : "About"}</NavLink>
    <NavLink href="/contact">{isLoggedIn ? "CONTACT" : "Contact"}</NavLink>
  </div>
);
