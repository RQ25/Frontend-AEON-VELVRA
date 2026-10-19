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
  FaSignOutAlt,
  FaSearch
} from 'react-icons/fa';
import { FaClockRotateLeft } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { GetCookie, removeCookie } from "@/lib/client-cookie";
import { get } from "@/lib/api-bridge";
import { IMenu } from "@/app/types";

const getFavoriteMenu = async (search: string = ""): Promise<IMenu[]> => {
  try {
    const TOKEN = GetCookie("token") ?? "";
    const url = `${BASE_API_URL}/menu?favorite=true&search=${encodeURIComponent(search)}`;
    const { data } = await get(url, TOKEN);
    if (data?.status && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching favorite menu:', error);
    return [];
  }
};

const MenuFavoritePage = () => {
  const router = useRouter();
  const [favoriteList, setFavoriteList] = useState<IMenu[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Kasir");
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async (searchQuery: string = "") => {
    setIsLoading(true);
    const data = await getFavoriteMenu(searchQuery);
    setFavoriteList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const nameFromCookie = GetCookie("name");
    if (nameFromCookie) {
      setUserName(nameFromCookie);
    }
    fetchFavorites();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFavorites(searchTerm);
  };

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

      {/* 2. OVERLAY BLUR DI BELAKANG SIDEBAR */}
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
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition"
            >
              <FaHome className="text-slate-400 text-lg" />
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
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-orange-500/20 border border-orange-500/30 rounded-xl transition"
            >
              <FaStar className="text-orange-400 text-lg" />
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

        {/* Footer Sidebar & Log Out */}
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
        
        {/* Header Topbar */}
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
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                  <FaStar className="text-orange-400" /> Menu Favorite
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Daftar menu terfavorit pelanggan AEON VELVRA
                </p>
              </div>

              {/* Form Pencarian */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
                <div className="relative w-full">
                  <input 
                    type="text"
                    placeholder="Cari menu favorit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 pl-10"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                </div>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold rounded-xl text-sm transition"
                >
                  Cari
                </button>
              </form>
            </div>

            {/* List Menu Favorit */}
            {isLoading ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                Memuat menu favorit...
              </div>
            ) : favoriteList.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-slate-400">
                Tidak ada menu favorit yang ditemukan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteList.map((item: any, index: number) => (
                  <div 
                    key={item.id || item.id_menu || `fav-${index}`}
                    className="bg-white/5 border border-white/10 hover:border-orange-500/40 rounded-xl p-4 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4 bg-black/40">
                        <Image 
                          src={`${BASE_IMAGE_MENU}/${item.picture}`}
                          alt={item.name || "Menu"}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                          unoptimized
                        />
                        <span className="absolute top-2 right-2 bg-orange-500/90 text-slate-950 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                          <FaStar size={10} /> Favorit
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                      <span className="text-orange-400 font-extrabold text-base">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0
                        }).format(item.price || 0)}
                      </span>
                      <Link 
                        href="/cashier/orderfood"
                        className="px-3 py-1.5 bg-white/10 hover:bg-orange-500 hover:text-slate-950 text-white border border-white/10 rounded-lg text-xs font-medium transition"
                      >
                        Pesan
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>

        <footer className="mt-auto pt-8 text-center text-xs text-slate-500">
          © 2026 AEON VELVRA. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8">Loading...</div>}>
      <MenuFavoritePage />
    </Suspense>
  );
}