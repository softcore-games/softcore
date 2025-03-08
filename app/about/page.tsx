import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">About SoftCORE</h1>

        <div className="space-y-12">
          <section className="p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="leading-relaxed">
              SoftCORE represents the future of interactive storytelling,
              combining cutting-edge AI technology with blockchain innovation.
              Built for the Core DAO Hackathon, our platform offers a unique
              blend of romantic visual novel gameplay and NFT collecting,
              creating an immersive experience where every choice matters and
              every special moment can be owned forever.
            </p>
          </section>

          <section className="p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">
              Technology & Innovation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">AI Integration</h3>
                <p>
                  Powered by advanced AI models, our characters and storylines
                  adapt to your choices, creating unique and engaging narratives
                  that feel personal and meaningful.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Blockchain Technology
                </h3>
                <p>
                  Built on Core DAO, our NFT system allows players to truly own
                  their favorite story moments, with all transactions secured by
                  blockchain technology.
                </p>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Game Features</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li>
                Unique AI-generated characters with distinct personalities
              </li>
              <li>Dynamic storylines that adapt to your choices</li>
              <li>10 engaging scenes per chapter</li>
              <li>NFT minting system for collecting special moments</li>
              <li>Innovative stamina-based gameplay system</li>
              <li>Secure wallet integration for NFT transactions</li>
            </ul>
          </section>

          <section className="p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Core DAO Hackathon</h2>
            <p className="leading-relaxed">
              SoftCORE is proudly developed as part of the Core DAO Hackathon,
              showcasing the potential of blockchain technology in gaming. Our
              project demonstrates how Web3 technologies can enhance traditional
              gaming experiences, creating new possibilities for ownership and
              interaction in the gaming space.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
