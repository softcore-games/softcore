import React from "react";

const FAQPage = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h1>

        <div className="space-y-8">
          <div className="p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">What is SoftCORE?</h3>
            <p>
              SoftCORE is an AI-powered dating simulation game built on the Core
              DAO blockchain. Players can interact with unique AI characters,
              experience dynamic storylines, and collect their favorite moments
              as NFTs.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">
              How do I start playing?
            </h3>
            <p>
              Simply create an account, choose your favorite AI-generated
              character, and begin your romantic journey. You get 3 free
              interactions per session to explore the story.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">What are Scene NFTs?</h3>
            <p>
              Special moments in your story can be minted as NFTs on the Core
              DAO blockchain. These NFTs are unique digital collectibles that
              you can own, trade, or showcase in your gallery.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">
              Do I need a crypto wallet?
            </h3>
            <p>
              A crypto wallet is only required if you want to mint and collect
              Scene NFTs. You can play the game and experience the story without
              connecting a wallet.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">
              How does the stamina system work?
            </h3>
            <p>
              Each player receives 3 stamina points per session. One point is
              used for each interaction with your character. Stamina refreshes
              periodically, allowing you to continue your story.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">
              Are the characters AI-generated?
            </h3>
            <p>
              Yes! Each character is uniquely generated using advanced AI
              technology, ensuring every player gets a personalized experience
              with distinct personalities and storylines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
