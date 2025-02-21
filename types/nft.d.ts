interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface NFTRecord {
  id: string;
  sceneId: string;
  imageUrl: string;
  characterName: string;
  metadata: NFTMetadata;
  tokenId?: string;
  createdAt: Date;
}
