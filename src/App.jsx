import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Music, Download, Share2, Gift, Star, Heart, Volume2, VolumeX, Copy, Check } from 'lucide-react';

const App = () => {
  const [entered, setEntered] = useState(false);
  const [userName, setUserName] = useState('');
  const [showWishCard, setShowWishCard] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [confetti, setConfetti] = useState([]);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // Countdown to 20223 (or show celebration if past)
  useEffect(() => {
    const targetDate = new Date('20223-01-01T00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate confetti
  const generateConfetti = () => {
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      color: ['#FFD700', '#FF1493', '#00CED1', '#FF69B4', '#FFA500'][Math.floor(Math.random() * 5)]
    }));
    setConfetti(newConfetti);
  };

  // AI-generated wishes
  const wishes = [
    "May 20223 bring you endless joy, prosperity, and unforgettable moments! ✨",
    "Wishing you a year filled with love, laughter, and incredible adventures! 🎉",
    "Here's to new beginnings, amazing opportunities, and dreams coming true in 20223! 🌟",
    "May this year be your best chapter yet - filled with success and happiness! 🎊",
    "Cheers to 365 new days of possibilities, magic, and wonderful memories! 🥂",
    "Wishing you health, wealth, and all the happiness your heart can hold! 💫",
    "May 20223 sparkle with moments of love, laughter, and goodwill! ✨"
  ];

  const [currentWish] = useState(wishes[Math.floor(Math.random() * wishes.length)]);

  // Download wish card as image
  const downloadCard = () => {
    if (cardRef.current) {
      // Create a canvas to draw the card
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 1000;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#7c3aed');
      gradient.addColorStop(0.5, '#ec4899');
      gradient.addColorStop(1, '#fbbf24');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some decorative stars
      ctx.fillStyle = '#ffd700';
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 3 + 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner card background
      ctx.fillStyle = 'rgba(79, 70, 229, 0.95)';
      ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 30);
      ctx.fill();

      // Title
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Happy New Year', canvas.width / 2, 150);
      
      ctx.fillStyle = '#ff1493';
      ctx.font = 'bold 90px Arial';
      ctx.fillText('20223', canvas.width / 2, 250);

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.fillText(userName, canvas.width / 2, 350);

      // Wish text with word wrapping
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      
      const maxWidth = canvas.width - 120;
      const words = currentWish.split(' ');
      let line = '';
      let y = 480;
      const lineHeight = 40;

      words.forEach((word, index) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && index > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, canvas.width / 2, y);

      // Decorative elements
      ctx.fillStyle = '#fbbf24';
      ctx.font = '40px Arial';
      ctx.fillText('✨ 🎉 ✨', canvas.width / 2, 750);

      // Footer
      ctx.fillStyle = '#d1d5db';
      ctx.font = '20px Arial';
      ctx.fillText('Made with ❤️ by Divyesh Moraniya', canvas.width / 2, 880);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userName}-NewYear-20223-Wish.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  // Copy wish to clipboard
  const copyWish = () => {
    const text = `🎉 Happy New Year 20223! 🎊\n\n${currentWish}\n\n- ${userName}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnter = () => {
    generateConfetti();
    setEntered(true);
  };

  // Firework component
  const Firework = ({ delay }) => (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-yellow-400"
      initial={{ scale: 0, x: 0, y: 0 }}
      animate={{
        scale: [0, 1, 0],
        x: [0, Math.random() * 200 - 100],
        y: [0, -Math.random() * 200 - 100],
        opacity: [1, 1, 0]
      }}
      transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 3 }}
    />
  );

  // Floating balloon
  const Balloon = ({ delay, x }) => (
    <motion.div
      className="absolute text-4xl"
      initial={{ y: '100vh', x }}
      animate={{ y: '-20vh' }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'linear' }}
    >
      🎈
    </motion.div>
  );

  // Star component
  const FloatingStar = ({ delay, x, y }) => (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        scale: [1, 1.5, 1],
        rotate: [0, 180, 360],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ duration: 3, delay, repeat: Infinity }}
    >
      <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
    </motion.div>
  );

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950">
      {/* Animated background stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingStar 
          key={i} 
          delay={i * 0.2} 
          x={Math.random() * 100} 
          y={Math.random() * 100} 
        />
      ))}

      <AnimatePresence mode="wait">
        {!entered ? (
          // Landing Screen
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4"
          >
            {/* Fireworks background */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <Firework key={i} delay={i * 0.3} />
              ))}
            </div>

            {/* Main content */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center z-10"
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255,215,0,0.5)',
                    '0 0 40px rgba(255,215,0,0.8)',
                    '0 0 20px rgba(255,215,0,0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Welcome 20223
              </motion.h1>

              {/* Countdown */}
              <div className="flex gap-4 justify-center mb-12 flex-wrap">
                {Object.entries(countdown).map(([unit, value]) => (
                  <motion.div
                    key={unit}
                    className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20 min-w-[80px]"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-yellow-300">
                      {value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-300 uppercase">{unit}</div>
                  </motion.div>
                ))}
              </div>

              {/* Enter button */}
              <motion.button
                onClick={handleEnter}
                className="relative group px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full text-white font-bold text-xl shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,215,0,0.5)',
                    '0 0 40px rgba(255,215,0,0.8)',
                    '0 0 20px rgba(255,215,0,0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  🎉 Enter Celebration
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-400"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </motion.div>

            {/* Floating year in background */}
            <motion.div
              className="absolute bottom-10 right-10 text-9xl font-bold text-white/5"
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              20223
            </motion.div>
          </motion.div>
        ) : (
          // Main Celebration Page
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 min-h-screen p-4 md:p-8"
          >
            {/* Confetti */}
            <AnimatePresence>
              {confetti.map((c) => (
                <motion.div
                  key={c.id}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ 
                    left: `${c.x}%`,
                    backgroundColor: c.color,
                    top: '-20px'
                  }}
                  initial={{ y: -20, rotate: 0 }}
                  animate={{ y: '100vh', rotate: 360 }}
                  transition={{ duration: c.duration, delay: c.delay }}
                  exit={{ opacity: 0 }}
                />
              ))}
            </AnimatePresence>

            {/* Floating balloons */}
            {Array.from({ length: 5 }).map((_, i) => (
              <Balloon key={i} delay={i * 1.5} x={i * 20} />
            ))}

            {/* Music toggle */}
            <motion.button
              onClick={() => setMusicPlaying(!musicPlaying)}
              className="fixed top-6 right-6 z-50 backdrop-blur-lg bg-white/10 p-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {musicPlaying ? (
                <Volume2 className="w-6 h-6 text-yellow-300" />
              ) : (
                <VolumeX className="w-6 h-6 text-gray-300" />
              )}
            </motion.button>

            <div className="max-w-6xl mx-auto">
              {/* Main headline */}
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="text-center mb-12"
              >
                <motion.h1
                  className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{
                    background: 'linear-gradient(90deg, #FFD700, #FF1493, #00CED1, #FFD700)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Happy New Year
                </motion.h1>
                <motion.div
                  className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  20223
                </motion.div>
              </motion.div>

              {/* AI Wish Message */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 mb-8 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <h2 className="text-2xl font-bold text-white">Your AI-Generated Wish</h2>
                </div>
                <motion.p
                  className="text-lg md:text-xl text-gray-100 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentWish}
                </motion.p>
              </motion.div>

              {/* Interactive Name Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 mb-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-6 h-6 text-pink-400" />
                  <h2 className="text-2xl font-bold text-white">Personalize Your Celebration</h2>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:border-yellow-400 transition-colors text-lg"
                  />
                  
                  {userName && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <motion.h3
                        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Happy New Year, {userName}! 🎊
                      </motion.h3>

                      <div className="flex gap-4 justify-center flex-wrap">
                        <motion.button
                          onClick={() => setShowWishCard(true)}
                          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-2xl transition-shadow"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Generate Your Wish Card ✨
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Wish Card Modal */}
              <AnimatePresence>
                {showWishCard && userName && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowWishCard(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.8, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.8, y: 50 }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 rounded-3xl p-1 max-w-lg w-full"
                    >
                      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 text-center" ref={cardRef}>
                        <div className="absolute top-0 left-0 right-0 flex justify-center -mt-8">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          >
                            <Sparkles className="w-16 h-16 text-yellow-300" />
                          </motion.div>
                        </div>

                        <motion.h3 
                          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 mt-8 mb-2"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Happy New Year
                        </motion.h3>
                        
                        <motion.div 
                          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                        >
                          20223
                        </motion.div>

                        <motion.h4 
                          className="text-3xl font-bold text-white mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          🎊 {userName} 🎊
                        </motion.h4>
                        
                        <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-lg border-2 border-yellow-300/30">
                          <motion.p 
                            className="text-xl text-white leading-relaxed mb-4 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {currentWish}
                          </motion.p>
                          <div className="flex items-center justify-center gap-3 text-yellow-300 mt-6">
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Star className="w-6 h-6 fill-current" />
                            </motion.div>
                            <span className="text-sm font-semibold">Made especially for you</span>
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 15, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Star className="w-6 h-6 fill-current" />
                            </motion.div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <motion.button
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={downloadCard}
                          >
                            <Download className="w-5 h-5" />
                            Download
                          </motion.button>

                          <motion.button
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl text-white font-semibold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyWish}
                          >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? 'Copied!' : 'Copy'}
                          </motion.button>
                          
                          <motion.button
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white font-semibold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const text = `🎉 Happy New Year 20223! 🎊\n\n${currentWish}\n\n- ${userName}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                          >
                            <Share2 className="w-5 h-5" />
                            WhatsApp
                          </motion.button>

                          <motion.button
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white font-semibold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={downloadCard}
                          >
                            <Download className="w-5 h-5" />
                            Instagram
                          </motion.button>
                        </div>

                        <motion.button
                          onClick={() => setShowWishCard(false)}
                          className="mt-4 px-6 py-2 bg-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          Close ✕
                        </motion.button>

                        <p className="text-xs text-gray-400 mt-4">
                          Made with ❤️ by Divyesh Moraniya
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fun Facts Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid md:grid-cols-3 gap-6 mb-8"
              >
                {[
                  { icon: '🎯', title: 'New Goals', text: '365 opportunities' },
                  { icon: '✨', title: 'Fresh Start', text: 'New beginnings' },
                  { icon: '🌟', title: 'Make Wishes', text: 'Dreams come true' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center"
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center py-8"
              >
                <motion.p
                  className="text-white/80 text-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Made with ❤️ by <span className="font-bold text-yellow-300">Divyesh Moraniya</span>
                </motion.p>
              </motion.footer>
            </div>

            {/* Floating 20223 in background */}
            <motion.div
              className="fixed bottom-0 right-0 text-[200px] font-bold text-white/5 pointer-events-none"
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              20223
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
