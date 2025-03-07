# Softcore NFT Smart Contract Builder

A smart contract system for minting story-based NFTs on Core DAO, built for the Core DAO Hackathon. This project is part of the SoftCORE game platform, enabling players to mint their favorite story scenes as NFTs.

## Deployment Information

- **Deploying Account**: `0x3632971f783809Eb79FE94E08C97A8d0b0B32824`
- **Contract Address**: `0x8c27BECce0570fD6B1069292846BE787fC2aC857`

## Features

### Core Smart Contract Functions

#### Scene NFT Minting

- `mintSceneNFT(string memory tokenURI)`: Mints a new NFT representing a story scene
- `getScenesByOwner(address owner)`: Retrieves all scenes owned by a specific address
- `tokenURI(uint256 tokenId)`: Gets the metadata URI for a specific token

#### Access Control

- `pause()`: Pauses contract operations in emergency situations
- `unpause()`: Resumes contract operations
- `setMintPrice(uint256 newPrice)`: Updates the minting price (admin only)

#### Metadata Management

- `setBaseURI(string memory newBaseURI)`: Updates the base URI for token metadata
- `updateTokenURI(uint256 tokenId, string memory newURI)`: Updates metadata for existing token

## Technical Details

### Built With

- Hardhat
- OpenZeppelin Contracts
- Core DAO Network

### Contract Standards

- ERC-721 for NFT functionality
- Pausable for emergency stops
- Ownable for access control

## Core DAO Integration

This project is specifically built for the Core DAO ecosystem, leveraging its:

- High performance and low gas fees
- EVM compatibility
- Sustainable consensus mechanism

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
# Add your private key and Core DAO RPC URL
```

3. Deploy contract:

```bash
npx hardhat run scripts/deploy.ts --network core
```

4. Verify contract:

```bash
npx hardhat verify --network core [CONTRACT_ADDRESS]
```

## Testing

Run the test suite:

```bash
npx hardhat test
```

## Security Features

- Pausable functionality for emergency stops
- Access control for admin functions
- Reentrancy protection
- Integer overflow protection

## Contributing

This project is part of the Core DAO Hackathon. Contributions are welcome through:

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT

## Acknowledgments

Built for the Core DAO Hackathon. Special thanks to:

- Core DAO team for the platform and support
- OpenZeppelin for secure contract templates
- Hardhat development environment

## Contact

For questions about the smart contract implementation, reach out to the development team or create an issue in this repository.
