"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginDialog } from "@/components/LoginDialog";
import { AgeVerificationDialog } from "@/components/AgeVerificationDialog";
import { Play, Heart, Sparkles, Star, MessageCircle } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { motion } from "framer-motion";
import Image from "next/image";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    // Check age verification cookie
    const isAgeVerified = Cookies.get("age_verified") === "true";
    setShowAgeVerification(!isAgeVerified);
  }, []);

  const handleStartClick = () => {
    if (isAuthenticated) {
      router.push("/game");
    } else {
      setShowLoginDialog(true);
    }
  };

  const handleAgeVerified = () => {
    setShowAgeVerification(false);
  };

  const features = [
    {
      icon: <Heart className="w-6 h-6 text-pink-400" />,
      title: "Intimate Connections",
      description:
        "Experience deep, meaningful relationships that evolve based on your choices and desires",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "AI-Powered Stories",
      description:
        "Every moment is uniquely crafted for you, creating a truly personal experience",
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      title: "Fantasy Fulfillment",
      description:
        "Explore your deepest desires in a safe, private, and immersive environment",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
      title: "Natural Dialogue",
      description:
        "Engage in authentic conversations that feel real and meaningful",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-purple-500/10" />
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <h1 className="text-6xl font-bold">
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Your Perfect Fantasy
              </span>
              <br />
              Awaits
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience intimate connections and unforgettable moments in a
              world crafted just for you. Let AI create your perfect fantasy.
            </p>

            <div className="flex justify-center gap-4">
              <GradientButton size="lg" onClick={handleStartClick}>
                <Play className="w-6 h-6 mr-2" />
                Begin Your Journey
              </GradientButton>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      {/* Features Section */}
      <section className="py-24 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Experience the Difference
            </h2>
            <p className="text-gray-300">
              Where AI meets intimacy, creating moments that feel real
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700 hover:border-pink-500/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Characters Preview */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Meet Your Dream Companions
            </h2>
            <p className="text-gray-300">
              Discover unique personalities who adapt to your desires
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src="https://cdn.night-api.com/api/images/nsfw/hentai/vG2Xhuq1b3cDQ91McHNFwwQ90qodup.png"
                  alt="Mei"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold mb-2">Mei</h3>
                <p className="text-gray-300">
                  Sweet and caring, she`ll make every moment special
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src="https://cdn.night-api.com/api/images/nsfw/hentai/EHsrDIJzoqRc3kwDEh6LPHHhOgA95Z.png"
                  alt="Lily & Daisy"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold mb-2">Lily & Daisy</h3>
                <p className="text-gray-300">
                  Playful and passionate, she knows how to make you smile
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={() => {
          setIsAuthenticated(true);
          setShowLoginDialog(false);
          router.push("/game");
        }}
      />

      <AgeVerificationDialog
        open={showAgeVerification}
        onVerify={handleAgeVerified}
      />
    </main>
  );
}
