import NFTGallery from "@/components/nft-gallery";

export default function NFTGalleryPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My NFT Collection</h1>
      <NFTGallery />
    </div>
  );
}
