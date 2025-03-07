import { FaDiscord, FaXTwitter } from "react-icons/fa6";

interface SocialIconsProps {
  className?: string;
}

export const SocialIcons = ({ className = "" }: SocialIconsProps) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
      <FaDiscord className="text-white text-3xl bg-black p-1 rounded-full" />
    </a>
    <a href="https://x.com" target="_blank" rel="noopener noreferrer">
      <FaXTwitter className="text-white text-3xl bg-black p-1 rounded-full" />
    </a>
  </div>
);