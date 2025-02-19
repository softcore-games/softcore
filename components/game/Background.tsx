import Image from "next/image";

interface BackgroundProps {
  imageUrl: string | null;
  fallback?: string | null;
}

export function Background({ imageUrl, fallback }: BackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      {imageUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={`${fallback || "scene"} background`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={100}
            onError={(e) => {
              console.error("Failed to load background image:", e);
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = `/backgrounds/${fallback || "classroom"}.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ) : (
        <div className="w-full h-full bg-gray-900 transition-colors duration-500" />
      )}
    </div>
  );
}
