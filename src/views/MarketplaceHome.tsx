"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useRef, useState, useMemo } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../components/Button';
import { Search, MapPin, Users, Calendar, DollarSign, Star, ArrowRight, Heart, CheckCircle2, TrendingUp, Sparkles, Navigation, Award, Smartphone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const featuredVenues = [
  { id: 1, name: 'The Grand Plaza', type: 'Hotel & Resort', location: 'Downtown, New York', rating: 4.9, reviews: 128, capacity: '50-500', price: '$5,000', image: 'https://picsum.photos/seed/venue1/800/600' },
  { id: 2, name: 'Crystal Banquets', type: 'Banquet Hall', location: 'Beverly Hills, CA', rating: 4.8, reviews: 96, capacity: '100-800', price: '$3,500', image: 'https://picsum.photos/seed/venue2/800/600' },
  { id: 3, name: 'Sunset Gardens', type: 'Outdoor Venue', location: 'Miami Beach, FL', rating: 4.7, reviews: 84, capacity: '50-300', price: '$2,800', image: 'https://picsum.photos/seed/venue3/800/600' },
  { id: 4, name: 'The Glasshouse', type: 'Modern Space', location: 'Chicago, IL', rating: 4.9, reviews: 156, capacity: '20-200', price: '$4,200', image: 'https://picsum.photos/seed/venue4/800/600' },
];

const categories = [
  { name: 'Wedding Venues', image: 'https://picsum.photos/seed/cat1/400/300' },
  { name: 'Corporate Events', image: 'https://picsum.photos/seed/cat2/400/300' },
  { name: 'Birthday Parties', image: 'https://picsum.photos/seed/cat3/400/300' },
  { name: 'Private Celebrations', image: 'https://picsum.photos/seed/cat4/400/300' },
];

const trendingCities = [
  { name: 'New York', count: '1,200+ venues', image: 'https://picsum.photos/seed/ny/600/800' },
  { name: 'Los Angeles', count: '850+ venues', image: 'https://picsum.photos/seed/la/600/800' },
  { name: 'Chicago', count: '600+ venues', image: 'https://picsum.photos/seed/chi/600/800' },
  { name: 'Miami', count: '450+ venues', image: 'https://picsum.photos/seed/mia/600/800' },
];

export function MarketplaceHome() {
  const heroRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [locationDetail, setLocationDetail] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const confettiParticles = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      colorClass: ['bg-party-pink', 'bg-party-purple', 'bg-party-blue', 'bg-white'][i % 4],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.3,
      shadowColor: ['#ec4899', '#a855f7', '#3b82f6', '#ffffff'][i % 4]
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
    const ctx = gsap.context(() => {
      gsap.from('.hero-element', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.from(searchRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      });

      gsap.to('.confetti', {
        y: 'random(-30, 30)',
        x: 'random(-30, 30)',
        rotation: 'random(-90, 90)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/search');
  };

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationText(value);

    // Check if it's a 6 digit pincode
    if (/^\d{6}$/.test(value)) {
      setIsFetchingLocation(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setLocationDetail(`${postOffice.Name}, ${postOffice.District}`);
        } else {
          setLocationDetail("Invalid Pincode");
        }
      } catch (error) {
        setLocationDetail("");
      } finally {
        setIsFetchingLocation(false);
      }
    } else {
      setLocationDetail("");
    }
  };

  return (
    <div className="min-h-screen bg-party-light font-sans text-party-dark">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-bold text-gradient">PartyDial</Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <Link href="/search" className="hover:text-party-purple transition-colors">Venues</Link>
            <Link href="/vendors" className="hover:text-party-purple transition-colors">For Vendors</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/post-requirement">
              <Button variant="outline" className="hidden md:flex bg-white">Post Requirement</Button>
            </Link>
            <Link href="/vendor">
              <Button variant="gradient">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 px-6 overflow-hidden bg-[#030014]">
        {/* Animated Background Grid & Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/noise2/1000/1000')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-party-purple/30 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-party-blue/20 rounded-full blur-[130px]"
          />
        </div>

        {/* Floating Star/Confetti Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {mounted && confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className={`confetti absolute w-1.5 h-1.5 rounded-full ${particle.colorClass}`}
              style={{
                top: particle.top,
                left: particle.left,
                opacity: particle.opacity,
                boxShadow: `0 0 10px ${particle.shadowColor}`
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-white/90 mb-8 uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:bg-white/10 transition-colors">
              <span className="w-2 h-2 rounded-full bg-party-pink mr-3 animate-pulse" />
              Revolutionizing Event Booking
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-display font-bold text-white tracking-tight mb-8 leading-[1.1] drop-shadow-2xl">
              Don't just host an event. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-party-purple to-party-pink">Create an Experience.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
              Discover and instantly book the world's most spectacular spaces. From breathtaking rooftop lounges to historic waterfront mansions.
            </p>
          </motion.div>

          {/* Premium Glassmorphism Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-[#111116]/80 backdrop-blur-2xl p-2 md:p-3 rounded-3xl md:rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 max-w-5xl mx-auto"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">

              <div className="flex-[1.5] w-full relative group hover:bg-white/5 rounded-2xl md:rounded-full transition-colors px-6 py-3 cursor-pointer">
                <div className="flex justify-between items-center mb-1 w-full relative h-[18px]">
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer w-fit">Location</label>
                  {isFetchingLocation ? (
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap animate-pulse absolute right-0">Searching...</span>
                  ) : locationDetail ? (
                    <span className={`text-[10px] font-bold whitespace-nowrap px-2 py-0.5 rounded-md bg-white/10 absolute right-0 ${locationDetail === 'Invalid Pincode' ? 'text-red-400' : 'text-party-pink'}`}>
                      {locationDetail}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-party-pink mr-3 hidden sm:block opacity-80" />
                  <div className="w-full relative flex items-center pr-2">
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 263139) or City"
                      value={locationText}
                      onChange={handleLocationChange}
                      className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none text-base md:text-lg truncate font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full relative group hover:bg-white/5 rounded-2xl md:rounded-full transition-colors px-6 py-3 cursor-pointer">
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 cursor-pointer w-fit">Event Type</label>
                <div className="flex items-center">
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-party-purple mr-3 hidden sm:block opacity-80" />
                  <select className="w-full bg-transparent text-white [&>option]:text-gray-900 placeholder-gray-600 focus:outline-none outline-none appearance-none cursor-pointer text-base md:text-lg font-medium">
                    <option value="" className="text-gray-500">Any Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate</option>
                    <option value="party">Party / Social</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 w-full relative group hover:bg-white/5 rounded-2xl md:rounded-full transition-colors px-6 py-3 cursor-pointer">
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 cursor-pointer w-fit">Capacity</label>
                <div className="flex items-center">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-party-blue mr-3 hidden sm:block opacity-80" />
                  <select className="w-full bg-transparent text-white [&>option]:text-gray-900 placeholder-gray-600 focus:outline-none outline-none appearance-none cursor-pointer text-base md:text-lg font-medium">
                    <option value="" className="text-gray-500">Any Size</option>
                    <option value="50">1-50 guests</option>
                    <option value="100">50-100 guests</option>
                    <option value="500">100-500 guests</option>
                    <option value="1000">500+ guests</option>
                  </select>
                </div>
              </div>

              <div className="p-2 w-full md:w-auto">
                <Button variant="gradient" size="lg" className="w-full md:w-auto h-14 md:h-[60px] rounded-xl md:rounded-full px-10 text-lg font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all transform hover:scale-105">
                  Search
                </Button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500"
          >
            <span>Top Categories:</span>
            <div className="flex gap-4 flex-wrap justify-center font-medium">
              <span className="hover:text-party-pink cursor-pointer transition-colors">Weddings</span>
              <span className="w-1 h-1 rounded-full bg-gray-600 self-center" />
              <span className="hover:text-party-purple cursor-pointer transition-colors">Corporate Retreats</span>
              <span className="w-1 h-1 rounded-full bg-gray-600 self-center" />
              <span className="hover:text-party-blue cursor-pointer transition-colors">Yacht Charters</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Categories Section */}
      <section className="py-24 md:py-32 relative bg-white">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-party-purple/5 border border-party-purple/10 text-xs font-bold text-party-purple uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Curated Collections
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight text-[#0A0A0F]">
                Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-party-pink to-party-purple">Event Type</span>
              </h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                Find venues perfectly tailored for your celebration. From intimate garden parties to massive corporate galas, we have the ideal space.
              </p>
            </div>
            <Link href="/search" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-md text-[#0A0A0F] font-semibold transition-all">
              Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, i) => (
              <Link href="/search" key={i} className="group relative rounded-[2rem] overflow-hidden aspect-[3/4] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 translate-y-0 md:hover:-translate-y-2 ring-1 ring-black/5">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="transform transition-transform duration-500 md:translate-y-4 group-hover:translate-y-0">
                    <h3 className="text-white font-display font-bold text-3xl mb-3">{category.name}</h3>
                    <div className="flex items-center text-party-pink font-semibold md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      Explore Venues <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-12 border-b border-gray-200 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-8 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-party-pink/10 flex items-center justify-center">
                <Users className="text-party-pink w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">2M+</div>
                <div className="text-sm text-gray-500 font-medium">Happy Guests</div>
              </div>
            </motion.div>
            <div className="hidden lg:block w-px h-12 bg-gray-200" />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-party-blue/10 flex items-center justify-center">
                <Award className="text-party-blue w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">15,000+</div>
                <div className="text-sm text-gray-500 font-medium">Verified Venues</div>
              </div>
            </motion.div>
            <div className="hidden lg:block w-px h-12 bg-gray-200" />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-party-purple/10 flex items-center justify-center">
                <Star className="text-party-purple w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">4.9/5</div>
                <div className="text-sm text-gray-500 font-medium">Average Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Cities */}
      <section className="py-24 bg-party-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold mb-2">Explore Trending Cities</h2>
            <p className="text-gray-600">Discover the hottest venues in top destinations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[500px]">
            {trendingCities.map((city, idx) => (
              <motion.div
                key={city.name}
                whileHover={{ scale: 0.98 }}
                className={`relative rounded-3xl overflow-hidden group cursor-pointer ${idx === 0 ? 'md:col-span-4' :
                  idx === 1 ? 'md:col-span-8' :
                    idx === 2 ? 'md:col-span-7' : 'md:col-span-5'
                  }`}
              >
                <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-party-dark/90 via-party-dark/20 to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium inline-flex items-center mb-3">
                    <Navigation className="w-3 h-3 mr-1" /> Trending
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white mb-1 group-hover:text-party-pink transition-colors">{city.name}</h3>
                  <p className="text-white/80">{city.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-24 bg-party-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Featured Venues</h2>
              <p className="text-gray-600">Top-rated venues highly recommended by our users.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVenues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={venue.image} alt={venue.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-party-pink hover:text-white transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-party-dark">
                    {venue.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-party-dark line-clamp-1">{venue.name}</h3>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-xs font-bold text-yellow-700">{venue.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" /> {venue.location}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg">
                      <Users className="w-4 h-4 mr-1.5 text-party-purple" /> {venue.capacity}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg">
                      <DollarSign className="w-4 h-4 mr-1 text-party-blue" /> From {venue.price}
                    </div>
                  </div>
                  <Link href={`/venue/${venue.id}`}>
                    <Button variant="outline" className="w-full group-hover:bg-party-dark group-hover:text-white transition-colors">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 bg-[#0A0A0F] text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-party-purple/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-party-pink/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-party-blue via-party-purple to-party-pink">PartyDial?</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
              We provide an unparalleled booking experience that saves you time, money, and hassle while guaranteeing the perfect venue for your event.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle2 className="w-8 h-8 text-party-pink" />,
                title: "Verified Venues Only",
                desc: "Every venue on our platform undergoes a rigorous 50-point inspection process to ensure quality, safety, and reliability."
              },
              {
                icon: <DollarSign className="w-8 h-8 text-party-purple" />,
                title: "Lowest Price Guarantee",
                desc: "Book with confidence knowing you are getting the absolute best rate. Find it cheaper elsewhere, and we'll match it."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-party-blue" />,
                title: "Instant Booking",
                desc: "No more waiting days for an email reply. View live availability calendars and secure your venue instantly."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold font-display mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Parallax/Sticky Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="sticky top-32">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Booking your dream venue is <span className="text-gradient">simple</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-md">
                We've revolutionized how events are planned. Skip the endless phone calls and back-and-forth emails.
              </p>
              <Button variant="gradient" size="lg" className="rounded-full">Get Started Now</Button>
            </div>

            <div className="space-y-12">
              {[
                { step: '1', title: 'Tell us your vision', desc: 'Enter your event details, guest count, and preferred location. Our smart algorithm handles the rest.' },
                { step: '2', title: 'Get matched & receive quotes', desc: 'Venues that perfectly match your criteria will send you customized proposals and pricing directly.' },
                { step: '3', title: 'Compare & visit', desc: 'Review all quotes in one dashboard, message venue managers, and schedule site walkthroughs.' },
                { step: '4', title: 'Book securely', desc: 'Finalize your contract and make secure payments directly through the PartyDial platform.' },
              ].map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={item.step}
                  className="flex gap-6 p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center font-display text-2xl font-bold text-party-purple group-hover:bg-gradient-party group-hover:text-white transition-colors flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Promo */}
      <section className="py-0 bg-party-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/pattern/800/400')] opacity-10 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="py-24 relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-medium text-sm mb-6 border border-white/20">
                <Smartphone className="w-4 h-4 mr-2" /> New Mobile App
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                Plan events from <br />anywhere.
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-md">
                Download the PartyDial app to chat with venues on the go, review quotes, and keep your entire event organized in your pocket.
              </p>
              <div className="flex gap-4">
                <button className="bg-party-dark text-white px-6 py-3 rounded-xl hover:bg-black transition-colors flex items-center gap-3">
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400">Download on the</div>
                    <div className="text-lg font-bold">App Store</div>
                  </div>
                </button>
                <button className="bg-party-dark text-white px-6 py-3 rounded-xl hover:bg-black transition-colors flex items-center gap-3">
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400">GET IT ON</div>
                    <div className="text-lg font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="hidden md:block relative h-[600px]">
              <motion.div
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="absolute bottom-0 right-10 w-80 h-[500px] bg-white rounded-t-[3rem] shadow-2xl border-[8px] border-party-dark overflow-hidden z-20"
              >
                <img src="https://picsum.photos/seed/app/400/800" alt="App interface" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ y: 200 }}
                whileInView={{ y: 50 }}
                transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
                className="absolute bottom-0 right-40 w-72 h-[450px] bg-white rounded-t-[3rem] shadow-2xl border-[8px] border-gray-100 overflow-hidden z-10 opacity-60"
              >
                <img src="https://picsum.photos/seed/app2/400/800" alt="App interface secondary" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Post Requirement CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="bg-gradient-party rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-party-purple/20">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Can't find what you're looking for?</h2>
              <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">Post your event requirements and let the best venues in your city contact you with custom quotes.</p>
              <Link href="/post-requirement">
                <Button variant="outline" size="lg" className="bg-white text-party-dark border-none hover:bg-gray-50 hover:text-party-purple">
                  Post Event Requirement <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-party-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-party-pink to-party-blue mb-6">PartyDial</div>
            <p className="text-gray-400 max-w-sm mb-6">The premier marketplace for finding and booking the perfect event venues.</p>
            <div className="flex space-x-4">
              {/* Social icons would go here */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-party-purple transition-colors cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-party-purple transition-colors cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-party-purple transition-colors cursor-pointer"></div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">For Users</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/search" className="hover:text-white transition-colors">Search Venues</Link></li>
              <li><Link href="/post-requirement" className="hover:text-white transition-colors">Post Requirement</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">For Vendors</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/vendors" className="hover:text-white transition-colors">List Your Venue</Link></li>
              <li><Link href="/vendor" className="hover:text-white transition-colors">Vendor Login</Link></li>
              <li><Link href="/mobile-app" className="hover:text-white transition-colors">Vendor Mobile App</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} PartyDial. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
