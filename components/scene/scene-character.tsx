import React from "react";
import Image from "next/image";

interface SceneCharacterProps {
  imageUrl?: string;
}

export default function SceneCharacter({ imageUrl }: SceneCharacterProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[120px] sm:w-[150px] md:w-[300px] h-[180px] sm:h-[220px] md:h-[350px] rounded-l-lg relative shadow-md flex">
        <div className="absolute inset-0 rounded-l-lg overflow-hidden">
          <Image
            src={imageUrl || "/images/girl.jpg"}
            alt="Character"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="w-4 sm:w-6 md:w-8 bg-[#fefe57] h-full absolute right-0 flex flex-col items-center pt-2 z-10">
          <div className="text-xs sm:text-sm md:text-lg text-black mb-2">★</div>
          <div className="text-xs sm:text-sm md:text-lg text-black mb-2">★</div>
        </div>
      </div>
    </div>
  );
}
