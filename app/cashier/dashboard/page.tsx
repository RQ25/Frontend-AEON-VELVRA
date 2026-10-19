'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { 
  FaClipboardList, 
  FaStar, 
  FaBars, 
  FaTimes, 
  FaUserCircle, 
  FaHome, 
  FaShoppingBag,
  FaSignOutAlt
} from 'react-icons/fa';
import { FaBellConcierge, FaClockRotateLeft } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from "@/global";
import { GetCookie, removeCookie } from "@/lib/client-cookie";
import { get } from "@/lib/api-bridge";

export const dynamic = "force-dynamic";

const getMenuCount = async () => {
  try {
    const TOKEN = GetCookie("token") ?? "";
    const url = `${BASE_API_URL}/menu`;
    const { data } = await get(url, TOKEN);
    if (data?.status && Array.isArray(data.data)) {
      return data.data.length;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return 0;
  }
};

const getFavoriteMenuCount = async () => {
  try {
    const TOKEN = GetCookie("token") ?? "";
    const url = `${BASE_API_URL}/menu?favorite=true`;
    const { data } = await get(url, TOKEN);
    if (data?.status && Array.isArray(data.data)) {
      return data.data.length;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching favorite menu data:', error);
    return 0;
  }
};

const DashboardContent = () => {
  const router = useRouter();
  const [menuCount, setMenuCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Kasir");

  useEffect(() => {
    const fetchCounts = async () => {
      const [mCount, fCount] = await Promise.all([
        getMenuCount(),
        getFavoriteMenuCount()
      ]);
      setMenuCount(mCount);
      setFavCount(fCount);
    };

    const nameFromCookie = GetCookie("name");
    if (nameFromCookie) {
      setUserName(nameFromCookie);
    }

    fetchCounts();
  }, []);

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("id");
    removeCookie("name");
    removeCookie("role");
    
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col text-white font-sans overflow-x-hidden">
      
      {/* 1. BACKGROUND GAMBAR UTAMA FULL SCREEN */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/image/login2.jpg" 
          alt="AEON VELVRA Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0812]/90 via-black/70 to-[#08050c]/90" />
      </div>

      {/* 2. OVERLAY BLUR DI BELAKANG SIDEBAR KETIKA TERBUKA */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* 3. SIDEBAR / DRAWER MENU */}
      <aside 
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] backdrop-blur-2xl bg-black/80 border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Sidebar & Tombol Close */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <Image alt="AEON VELVRA Logo" width={36} height={36} src="/image/logowht.png" className="h-auto" />
              <div>
                <h2 className="font-bold text-lg text-white leading-tight">AEON VELVRA</h2>
                <p className="text-[11px] text-slate-400">Restaurant System</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl mb-6">
            <FaUserCircle className="text-orange-400 text-2xl" />
            <div>
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-[10px] text-orange-400 font-medium uppercase tracking-wider">Kasir Active</p>
            </div>
          </div>

          {/* Navigasi Links */}
          <nav className="space-y-2">
            <Link 
              href="/cashier/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-orange-500/20 border border-orange-500/30 rounded-xl transition"
            >
              <FaHome className="text-orange-400 text-lg" />
              <span>Dashboard</span>
            </Link>

            <Link 
              href="/cashier/menu"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition"
            >
              <FaClipboardList className="text-slate-400 text-lg" />
              <span>Menu</span>
            </Link>

            <Link 
              href="/cashier/menufavorit"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition"
            >
              <FaStar className="text-slate-400 text-lg" />
              <span>Menu Favorite</span>
            </Link>

            <Link 
              href="/cashier/orderfood"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition"
            >
              <FaShoppingBag className="text-slate-400 text-lg" />
              <span>Pesan Makanan</span>
            </Link>

            <Link 
              href="/cashier/history"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition"
            >
              <FaClockRotateLeft className="text-slate-400 text-lg" />
              <span>History Pemesanan</span>
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar & Tombol Log Out */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition cursor-pointer group"
          >
            <FaSignOutAlt className="text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Log Out</span>
          </button>

          <div className="text-center text-xs text-slate-500">
            © 2026 AEON VELVRA
          </div>
        </div>
      </aside>

      {/* 4. KONTEN UTAMA PAGE */}
      <div className="relative z-10 flex-grow flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        
        {/* Header Topbar dengan Tombol Toggle Menu/Logo */}
        <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition cursor-pointer group"
              title="Buka Menu Navigasi"
            >
              <FaBars className="text-orange-400 text-lg group-hover:scale-110 transition" />
              <Image alt="AEON VELVRA Logo" width={32} height={32} src="/image/logowht.png" className="h-auto" />
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-orange-400 uppercase">
                AEON VELVRA
              </h1>
              <p className="text-xs text-slate-400">Cashier Operational Portal</p>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Overview
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">Ringkasan aktivitas dan menu kasir</p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Image src="/image/logowht.png" width={24} height={24} alt="Profile" className="rounded-full" />
                <span className="text-xs font-semibold text-orange-400 tracking-wide uppercase">Cashier Area</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition group">
                <div className="p-3 mr-4 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl group-hover:scale-105 transition">
                  <FaClipboardList size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Total Menu</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{menuCount}</p>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition group">
                <div className="p-3 mr-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl group-hover:scale-105 transition">
                  <FaStar size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Favourite Menu</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{favCount}</p>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition group">
                <div className="p-3 mr-4 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl group-hover:scale-105 transition">
                  <FaBellConcierge size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Active Orders</p>
                  <p className="text-2xl font-bold text-white mt-0.5">0</p>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition group">
                <div className="p-3 mr-4 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl group-hover:scale-105 transition">
                  <FaClockRotateLeft size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">History</p>
                  <p className="text-2xl font-bold text-white mt-0.5">0</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider text-center mb-6">
                Quick Navigation
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
                <Link 
                  href="/cashier/menu" 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-orange-500 hover:text-slate-950 text-white border border-white/10 hover:border-orange-500 rounded-xl font-medium text-sm transition duration-200 shadow-md group"
                >
                  <FaClipboardList className="text-orange-400 group-hover:text-slate-950 transition" />
                  <span>Menu</span>
                </Link>

                <Link 
                  href="/cashier/menufavorit" 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-orange-500 hover:text-slate-950 text-white border border-white/10 hover:border-orange-500 rounded-xl font-medium text-sm transition duration-200 shadow-md group"
                >
                  <FaStar className="text-orange-400 group-hover:text-slate-950 transition" />
                  <span>Favourite</span>
                </Link>

                <Link 
                  href="/cashier/orderfood" 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-orange-500 hover:text-slate-950 text-white border border-white/10 hover:border-orange-500 rounded-xl font-medium text-sm transition duration-200 shadow-md group"
                >
                  <FaBellConcierge className="text-orange-400 group-hover:text-slate-950 transition" />
                  <span>Order Food</span>
                </Link>

                <Link 
                  href="/cashier/history" 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-orange-500 hover:text-slate-950 text-white border border-white/10 hover:border-orange-500 rounded-xl font-medium text-sm transition duration-200 shadow-md group"
                >
                  <FaClockRotateLeft className="text-orange-400 group-hover:text-slate-950 transition" />
                  <span>History</span>
                </Link>
              </div>
            </div>

          </div>
        </main>

        <footer className="mt-auto pt-8 text-center text-xs text-slate-500">
          © 2026 AEON VELVRA. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}