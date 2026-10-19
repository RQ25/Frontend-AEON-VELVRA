'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaShoppingBag, FaPlus, FaMinus, FaUtensils, FaCheck, 
  FaHome, FaBookOpen, FaFire, FaClock, FaShieldAlt 
} from 'react-icons/fa';
import { BASE_API_URL, BASE_IMAGE_MENU } from '@/global';

interface MenuItem {
  id?: number;
  id_menu?: number;
  menuId?: number;
  name: string;
  price: number;
  category: string;
  picture: string;
  description: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  note: string;
  cartId: number;
}

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'MENU'>('HOME');
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('QRIS');
  const [loading, setLoading] = useState<boolean>(false);

  // State Modal Custom Success
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<{ customer: string; total: number } | null>(null);

  // Helper untuk mendapatkan ID menu yang konsisten
  const getItemId = (item: MenuItem): number => {
    return item.id ?? item.id_menu ?? item.menuId ?? 0;
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/menu`);
        const data = await res.json();
        if (data?.status && Array.isArray(data.data)) {
          setMenus(data.data);
        } else if (Array.isArray(data)) {
          setMenus(data);
        }
      } catch (err) {
        console.error('Gagal memuat menu:', err);
      }
    };
    fetchMenus();
  }, []);

  const addToCart = (item: MenuItem) => {
    const targetId = getItemId(item);
    setCart((prev) => {
      const existing = prev.find((c) => c.cartId === targetId);
      if (existing) {
        return prev.map((c) =>
          c.cartId === targetId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, cartId: targetId, quantity: 1, note: '' }];
    });
  };

  const updateQuantity = (cartId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const updateNote = (cartId: number, note: string) => {
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, note } : item))
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName || !tableNumber) {
      alert('Harap isi Nama Pemesan dan Nomor Meja!');
      return;
    }
    if (cart.length === 0) {
      alert('Keranjang pesanan masih kosong!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer: customerName,
        table_number: String(tableNumber),
        payment_method: paymentMethod || 'QRIS',
        status: 'NEW',
        orderlists: cart.map((item) => ({
          menuId: Number(item.cartId),
          quantity: Number(item.quantity),
          note: item.note ? item.note : '',
        })),
      };

      const res = await fetch(`${BASE_API_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.status) {
        setLastOrderDetails({
          customer: customerName,
          total: totalPrice,
        });
        setShowSuccessModal(true);
      } else {
        alert(data?.message || 'Gagal membuat pesanan');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi server');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter((m) => {
    if (selectedCategory === 'ALL') return true;
    return m.category?.toUpperCase() === selectedCategory.toUpperCase();
  });

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      
      {/* 🟢 TOP NAVIGATION BAR (RESPONSIVE DECK & MOBILE) */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border border-white/10 p-4 sm:p-6 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xl">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-extrabold text-lg shrink-0">
              AV
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wider text-white">AEON VELVRA</h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Culinary Experience</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <nav className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer w-1/2 sm:w-auto ${
              activeTab === 'HOME'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaHome /> Beranda
          </button>
          <button
            onClick={() => setActiveTab('MENU')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer relative w-1/2 sm:w-auto ${
              activeTab === 'MENU'
                ? 'bg-orange-500 text-black font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaBookOpen /> Pesan Menu
            {totalCartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-extrabold animate-pulse">
                {totalCartCount}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* 🟢 TAB CONTENT 1: HOME LANDING PAGE */}
      {activeTab === 'HOME' && (
        <div className="space-y-8 sm:space-y-12 animate-fadeIn">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-orange-950/40 via-black/50 to-black/80 border border-white/10 rounded-3xl p-6 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
                <FaFire size={12} /> Cita Rasa Eksklusif & Modern
              </span>
              <h2 className="text-2xl sm:text-5xl font-extrabold text-white leading-tight">
                Nikmati Sajian Istimewa di <span className="text-orange-400">AEON VELVRA</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pesan hidangan penutup, makanan utama, dan minuman menyegarkan secara cepat dan praktis langsung dari meja kamu melalui layanan self-service kami.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
                <button
                  onClick={() => setActiveTab('MENU')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs rounded-xl uppercase tracking-wider transition cursor-pointer shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <FaUtensils /> Jelajahi Menu Sekarang
                </button>
              </div>
            </div>

            {/* Graphic Card */}
            <div className="w-full md:w-80 h-64 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3 backdrop-blur-md">
              <div className="w-20 h-20 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center text-orange-400 text-3xl">
                <FaUtensils />
              </div>
              <h3 className="font-bold text-white text-sm">Pemesanan Tanpa Antre</h3>
              <p className="text-xs text-slate-400">Pilih menu, masukkan nomor meja, dan pesananmu langsung diproses oleh tim dapur kami.</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2 backdrop-blur-xl">
              <FaClock className="text-orange-400 text-2xl mb-2" />
              <h4 className="font-bold text-white text-sm">Layanan Cepat</h4>
              <p className="text-xs text-slate-400">Pesanan langsung masuk ke sistem kasir dan dapur secara otomatis instan.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2 backdrop-blur-xl">
              <FaShieldAlt className="text-orange-400 text-2xl mb-2" />
              <h4 className="font-bold text-white text-sm">Pembayaran Mudah</h4>
              <p className="text-xs text-slate-400">Dukungan metode pembayaran serba praktis lewat QRIS, CASH, maupun CARD.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2 backdrop-blur-xl">
              <FaUtensils className="text-orange-400 text-2xl mb-2" />
              <h4 className="font-bold text-white text-sm">Bahan Berkualitas</h4>
              <p className="text-xs text-slate-400">Setiap hidangan dibuat dari bahan segar standar kualitas resto terbaik.</p>
            </div>
          </div>

        </div>
      )}

      {/* 🟢 TAB CONTENT 2: KATALOG MENU & KERANJANG */}
      {activeTab === 'MENU' && (
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-8 shadow-2xl relative animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri: Katalog Menu */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Category Filter Pills (Scrollable di Mobile) */}
              <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
                {['ALL', 'FOOD', 'DRINK', 'DESSERT'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-black font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid Menu Cards */}
              {filteredMenus.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs">
                  Tidak ada menu dalam kategori ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMenus.map((item, index) => {
                    const itemId = getItemId(item) || index;
                    const imageUrl = item.picture?.startsWith('http')
                      ? item.picture
                      : `${BASE_IMAGE_MENU || `${BASE_API_URL}/menu-picture`}/${item.picture}`;

                    return (
                      <div
                        key={itemId}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-orange-500/40 transition group"
                      >
                        <div>
                          {/* Gambar Menu */}
                          <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-black/40 border border-white/5">
                            {item.picture ? (
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-slate-600">
                                <FaUtensils size={32} />
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-base text-white">{item.name}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                          <span className="font-bold text-orange-400">
                            Rp {Number(item.price || 0).toLocaleString('id-ID')}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-black rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            <FaPlus size={10} /> Tambah
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Kolom Kanan: Detail & Keranjang */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit sticky top-24 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white border-b border-white/10 pb-3">
                <FaShoppingBag className="text-orange-400" /> Ringkasan Pesanan
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nama Pemesan *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masukkan nama kamu"
                    className="w-full text-xs bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">No. Meja *</label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Contoh: 05"
                      className="w-full text-xs bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Pembayaran</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full text-xs bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="QRIS">QRIS</option>
                      <option value="CASH">CASH</option>
                      <option value="CARD">CARD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">Belum ada menu dipilih</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-orange-400">Rp {Number(item.price || 0).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg">
                          <button onClick={() => updateQuantity(item.cartId, -1)} className="text-slate-400 hover:text-white">
                            <FaMinus size={10} />
                          </button>
                          <span className="font-bold text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)} className="text-slate-400 hover:text-white">
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={item.note}
                        onChange={(e) => updateNote(item.cartId, e.target.value)}
                        placeholder="Catatan (opsional)..."
                        className="w-full text-[11px] bg-black/60 border border-white/5 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Tagihan</span>
                  <span className="font-extrabold text-orange-400 text-base">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold text-xs rounded-xl transition cursor-pointer uppercase tracking-wider"
                >
                  {loading ? 'MEMPROSES PESANAN...' : 'PESAN SEKARANG'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POPUP MODAL CUSTOM (CHECKOUT BERHASIL) */}
      {showSuccessModal && lastOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121118] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6">
            
            <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto text-orange-500">
              <FaCheck size={28} />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-wide">
                Checkout Berhasil!
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Pesanan atas nama <strong className="text-white">{lastOrderDetails.customer}</strong> telah berhasil dibuat.
              </p>
            </div>

            <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex justify-between items-center text-xs">
              <span className="text-slate-400 tracking-wider font-medium">TOTAL TAGIHAN</span>
              <span className="text-orange-400 font-extrabold text-base">
                Rp {lastOrderDetails.total.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl tracking-wider uppercase transition cursor-pointer shadow-lg shadow-orange-500/20"
            >
              LANJUT PESANAN BARU
            </button>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-[11px] text-slate-500 py-4 border-t border-white/5">
        © 2026 AEON VELVRA System. Built for seamless dining experience.
      </footer>
    </div>
  );
}