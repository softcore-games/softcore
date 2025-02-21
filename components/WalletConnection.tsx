import { useWallet } from "@/contexts/WalletContext";
import { NetworkSwitch } from "./wallet/NetworkSwitch";
import { WalletBalance } from "./wallet/WalletBalance";
import { WalletDropdown } from "./wallet/WalletDropdown";
import { ConnectWallet } from "./wallet/ConnectWallet";

export function WalletConnection() {
  const { address } = useWallet();

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      <NetworkSwitch />

      {address ? (
        <div className="flex items-center gap-2">
          <WalletBalance />
          <WalletDropdown formatAddress={formatAddress} />
        </div>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
}
