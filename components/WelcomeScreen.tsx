import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Header } from "./Header";
import { Sparkles, Heart, Users, Shield, Gamepad, Star } from "lucide-react";

export const WelcomeScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-love-50 to-love-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="container mx-auto px-4 pt-20 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-love-800 dark:text-love-200">
              Where Fantasy Meets
              <br />
              <span className="text-love-600 dark:text-love-400">Desire</span>
            </h1>

            <p className="text-xl md:text-2xl text-love-700 dark:text-love-300 max-w-2xl mx-auto">
              "We create intimate stories that unfold with you, using AI to
              craft a unique erotic experience that's yours alone."
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center space-y-6 pt-8"
            >
              <Button
                onClick={onStart}
                className="bg-love-600 hover:bg-love-700 text-white dark:bg-love-500 dark:hover:bg-love-600 px-8 py-6 text-lg md:text-xl rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Begin Your Journey
              </Button>

              <p className="text-love-600 dark:text-love-400 text-sm">
                Your perfect fantasy awaits
              </p>
            </motion.div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-20"
          >
            {/* About Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-display font-bold text-love-800 dark:text-love-200 mb-6">
                About SoftCORE Games
              </h2>
              <p className="text-lg text-love-700 dark:text-love-300 leading-relaxed">
                We provide a revolutionary solution to loneliness and isolation
                during intimate moments, utilizing AI technology to create and
                explore unlimited moments with your fantasy. Our platform allows
                users to experience intimate connections with their desired
                partner in a safe, private, and deeply immersive environment.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Interactive Storytelling",
                  description:
                    "Craft your own unique narrative with branching paths and meaningful choices",
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: "Scene Creation",
                  description:
                    "Design and customize intimate scenes tailored to your desires",
                },
                {
                  icon: <Star className="w-6 h-6" />,
                  title: "NFT Integration",
                  description:
                    "Mint and own your special moments as unique digital assets",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-sm shadow-xl"
                >
                  <div className="text-love-600 dark:text-love-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-love-800 dark:text-love-200 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-love-600 dark:text-love-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-love-600 dark:text-love-400" />
                  <h3 className="text-2xl font-display font-bold text-love-800 dark:text-love-200">
                    Safe & Private
                  </h3>
                </div>
                <p className="text-love-600 dark:text-love-300">
                  Experience intimate connections in a secure and private
                  environment, protected by blockchain technology.
                </p>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-love-600 dark:text-love-400" />
                  <h3 className="text-2xl font-display font-bold text-love-800 dark:text-love-200">
                    Community Driven
                  </h3>
                </div>
                <p className="text-love-600 dark:text-love-300">
                  Join a vibrant community of like-minded individuals sharing
                  experiences and creating together.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-center py-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-love-800 dark:text-love-200 mb-6">
                Ready to Start Your Journey?
              </h2>
              <Button
                onClick={onStart}
                className="bg-love-600 hover:bg-love-700 text-white dark:bg-love-500 dark:hover:bg-love-600 px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Gamepad className="w-5 h-5 mr-2" />
                Launch Experience
              </Button>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};
