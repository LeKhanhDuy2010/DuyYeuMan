import BoyAvatar from '../img/avatar/Boy.jpg';
import GirlAvatar from '../img/avatar/Girl.jpg';
import DefaultBg from '../img/bg/bg.jpg';

import React, { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { AppSettings, Memory } from '../types';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Music, Music2, Heart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [days, setDays] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    // Sync Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AppSettings;
        setSettings(data);
        if (data.loveStartDate) {
          setDays(differenceInDays(new Date(), parseISO(data.loveStartDate)));
        }
      }
    });

    // Sync Memories
    const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
    const unsubMemories = onSnapshot(q, (querySnapshot) => {
      const items: Memory[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Memory);
      });
      setMemories(items);
    });

    return () => {
      unsubSettings();
      unsubMemories();
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Auto-play blocked"));
    }
    setIsPlaying(!isPlaying);
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-rose-400"
        >
          <Heart className="w-12 h-12 fill-current" />
        </motion.div>
      </div>
    );
  }
  const handleImgError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallback: string
  ) => {
    const target = e.currentTarget;
    if (target.src !== fallback) {
      target.src = fallback;
    }
  };
  
  const safeImage = (url?: string) => {
    if (!url) return DefaultBg;
    if (url.includes('photos.app.goo.gl')) return DefaultBg;
    return url;
  };
  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Background Image Layer */}
      <div
  className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-20"
  style={{
    backgroundImage: `url(${settings.bgImage || DefaultBg})`
  }}
/>


      {/* Music Player */}
      {settings.bgMusic && (
        <div className="fixed bottom-6 right-6 z-50">
          <audio ref={audioRef} src={settings.bgMusic} loop />
          <button 
            onClick={toggleMusic}
            className={`p-4 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
              isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/80 text-rose-500'
            }`}
          >
            {isPlaying ? <Music2 className="w-6 h-6" /> : <Music className="w-6 h-6" />}
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center mb-16 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-4 sm:gap-12"
        >
          <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden">
            <img
  src={settings.avatar1 || BoyAvatar}
  alt="Avatar 1"
  className="w-full h-full object-cover cursor-pointer"
  onClick={() => setPreviewImage(BoyAvatar)}
  onError={(e) => handleImgError(e, BoyAvatar)}
/>

            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
          </div>

          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-rose-500"
          >
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 fill-current" />
          </motion.div>

          <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden">
            <img
  src={settings.avatar2 || GirlAvatar}
  alt="Avatar 2"
  className="w-full h-full object-cover cursor-pointer"
  onClick={() => setPreviewImage(GirlAvatar)}
  onError={(e) => handleImgError(e, GirlAvatar)}
/>

            </div>
            <div className="absolute -bottom-2 -left-2 bg-white rounded-full p-2 shadow-md">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h2 className="text-xl sm:text-2xl font-light text-rose-400 tracking-widest uppercase">We've been in love for</h2>
          <div className="flex items-center justify-center space-x-4">
             <span className="text-6xl sm:text-8xl font-serif-elegant font-bold text-rose-600 tabular-nums">{days}</span>
             <span className="text-3xl sm:text-4xl font-romantic text-rose-500">Days</span>
          </div>
          <p className="text-rose-300 italic font-light">Since {settings.loveStartDate ? format(parseISO(settings.loveStartDate), 'MMMM do, yyyy') : '...'}</p>
        </motion.div>
      </section>

      {/* Memories Section */}
      <section className="space-y-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-[1px] flex-grow bg-rose-200"></div>
          <h3 className="font-romantic text-3xl text-rose-500">Our Memories</h3>
          <div className="h-[1px] flex-grow bg-rose-200"></div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <AnimatePresence>
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-lg border border-rose-50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <img
  src={memory.imageUrl || DefaultBg}
  alt={memory.title}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  onError={(e) => handleImgError(e, DefaultBg)}
/>

                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-500 flex items-center shadow-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    {memory.createdAt ? format(memory.createdAt.toDate(), 'MMM dd, yyyy') : 'Just now'}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{memory.title}</h4>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{memory.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {memories.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-rose-100">
              <p className="text-rose-300 font-light italic">No memories captured yet. Time to make some!</p>
            </div>
          )}
          <AnimatePresence>
  {previewImage && (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setPreviewImage(null)}
    >
      <motion.img
        src={previewImage}
        alt="Preview"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl border-4 border-white"
        onClick={(e) => e.stopPropagation()} // ❗ tránh click ảnh bị đóng
      />
    </motion.div>
  )}
</AnimatePresence>

        </div>
      </section>
    </div>
  );
};

export default Home;
