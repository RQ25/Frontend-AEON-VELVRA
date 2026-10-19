"use client";
import { useState, useEffect } from "react";
import { IMenu, ICart } from "@/app/types";
import { GetCookie } from "@/lib/client-cookie";
import { BASE_API_URL } from "@/global";
import { get, post } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert/index";
import Search from "./searchMenu";
import CardComponent from "./card";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaClipboardList,
  FaStar,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHome,
  FaShoppingBag,
  FaCheckCircle,
  FaPencilAlt,
  FaUser,
  FaChair,
  FaCreditCard
} from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

const getMenu = async (search: string, token: string): Promise<IMenu[]> => {
  try {
    const url = `${BASE_API_URL}/menu?search=${search}`;
    const { data } = await get(url, token);
    return data?.status ? data.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const MenuOrderPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [menu, setMenu] = useState<IMenu[]>([]);
  const [cart, setCart] = useState<ICart[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Kasir");
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const token = GetCookie("token") || "";
    const nameFromCookie = GetCookie("name");
    if (nameFromCookie) {
      setUserName(nameFromCookie);
    }

    const fetchMenu = async () => {
      const data = await getMenu(search, token);
      setMenu(data);
    };
    fetchMenu();
  }, [search]);

  const handleAddToCart = (menuItem: IMenu) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.menuId === menuItem.menuId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({
        menuId: menuItem.menuId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        note: "",
      });
    }

    setCart(updatedCart);
    setTotal((prevTotal) => prevTotal + menuItem.price);
  };

  const handleRemoveFromCart = (menuItem: IMenu) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.menuId === menuItem.menuId);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        const index = updatedCart.indexOf(existingItem);
        updatedCart.splice(index, 1);
      }
      setCart(updatedCart);
      setTotal((prevTotal) => Math.max(0, prevTotal - menuItem.price));
    }
  };

  const handleNoteChange = (menuId: number, noteValue: string) => {
    const updatedCart = cart.map((item) => {
      if (item.menuId === menuId) {
        return { ...item, note: noteValue };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) {
      alert("Harap isi nama pemesan/pelanggan terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = GetCookie("token") || "";
      const url = `${BASE_API_URL}/order`;

      // Format payload dikirim sebagai JSON/Body yang sesuai controller backend
      const payload = {
        customer: customerName,
        table_number: tableNumber || "-",
        payment_method: paymentMethod,
        orderlists: cart.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          note: item.note || "",
        })),
      };

      const res = await post(url, JSON.stringify(payload), token);
      if (res.data?.status) {
        setIsCheckoutSuccess(true);
      } else {
        alert(res.data?.message || "Gagal membuat order.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsCheckoutSuccess(false);
    setCart([]);
    setTotal(0);
    setCustomerName("");
    setTableNumber("");
    setPaymentMethod("CASH");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col text-white font-sans overflow-x-hidden">
      
      {/* Background Utama */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/image/login2.jpg"
          alt="AEON VELVRA Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0812]/90 via-black/75 to-[#08050c]/90" />
      </div>

      {/* Overlay Sidebar Blur */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] backdrop-blur-2xl bg-black/80 border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <Image alt="AEON VELVRA Logo" width={36} height={36} src="/image/logowht.png" className="h-auto" />
              <div>
                <h2 className="font-bold text-lg text-white leading-tight">AEON VELVRA</h2>
                <p className="text-[11px] text-slate-400">Restaurant System</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl mb-6">
            <FaUserCircle className="text-orange-400 text-2xl" />
            <div>
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-[10px] text-orange-400 font-medium uppercase tracking-wider">Kasir Active</p>
            </div>
          </div>

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
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition"
            >
              <FaStar className="text-slate-400 text-lg" />
              <span>Menu Favorite</span>
            </Link>

            <Link
              href="/cashier/orderfood"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-orange-500/20 border border-orange-500/30 rounded-xl transition"
            >
              <FaShoppingBag className="text-orange-400 text-lg" />
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

        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-500">
          © 2026 AEON VELVRA
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        
        {/* Top Header */}
        <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
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
              <p className="text-xs text-slate-400">Order Food Terminal</p>
            </div>
          </div>
        </header>

        {/* Layout Grid POS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Pilih Menu */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/10">
              <h4 className="text-xl font-bold text-white">Pilih Menu</h4>
              <div className="w-full sm:max-w-xs">
                <Search url="/cashier/orderfood" search={search} />
              </div>
            </div>

            {menu.length === 0 ? (
              <AlertInfo title="Informasi">Tidak ada menu tersedia.</AlertInfo>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menu.map((data, index) => {
                  const itemInCart = cart.find((item) => item.menuId === data.menuId) || null;
                  return (
                    <CardComponent
                      key={`keyMenu${index}`}
                      data={data}
                      itemInCart={itemInCart}
                      handleAddToCart={handleAddToCart}
                      handleRemoveFromCart={handleRemoveFromCart}
                      renderCategory={true}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Kolom Kanan: Pesanan & Form Pelanggan */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-6">
              <h4 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
                <FaShoppingBag className="text-orange-400" />
                <span>Pesanan Saat Ini</span>
              </h4>

              {/* Form Data Pelanggan & Meja */}
              <div className="space-y-3 mb-6 pb-4 border-b border-white/10">
                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <FaUser className="text-orange-400" size={11} />
                    <span>Nama Pemesan *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Thoriq"
                    className="w-full text-xs rounded-xl py-2 px-3 bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:border-orange-500/60 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                      <FaChair className="text-orange-400" size={11} />
                      <span>No. Meja</span>
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Contoh: 2"
                      className="w-full text-xs rounded-xl py-2 px-3 bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:border-orange-500/60 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                      <FaCreditCard className="text-orange-400" size={11} />
                      <span>Metode Bayar</span>
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full text-xs rounded-xl py-2 px-3 bg-black/80 border border-white/10 text-white focus:border-orange-500/60 focus:outline-none transition cursor-pointer"
                    >
                      <option value="CASH">CASH</option>
                      <option value="QRIS">QRIS</option>
                      <option value="CARD">CARD</option>
                    </select>
                  </div>
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-slate-400 bg-white/5 border border-white/5 rounded-xl p-4">
                  <p className="text-sm">Keranjang masih kosong</p>
                  <p className="text-[11px] text-slate-500 mt-1">Pilih menu di sebelah kiri untuk menambahkan pesanan.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                    {cart.map((cartItem) => (
                      <div
                        key={cartItem.menuId}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-white">{cartItem.name}</p>
                            <p className="text-xs text-orange-400 mt-0.5">
                              Rp {cartItem.price?.toLocaleString("id-ID")} x {cartItem.quantity}
                            </p>
                          </div>
                          <span className="font-bold text-sm text-white">
                            Rp {(cartItem.price * cartItem.quantity).toLocaleString("id-ID")}
                          </span>
                        </div>

                        {/* Catatan Per-Item */}
                        <div className="relative pt-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                            <FaPencilAlt size={10} className="text-orange-400" />
                            <span>Catatan pesanan:</span>
                          </div>
                          <input
                            type="text"
                            value={cartItem.note || ""}
                            onChange={(e) => handleNoteChange(cartItem.menuId, e.target.value)}
                            placeholder="Contoh: Pedas, Tanpa es, dll..."
                            className="w-full text-xs rounded-lg py-1.5 px-2.5 bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:border-orange-500/60 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Button Checkout */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Total Tagihan</span>
                      <span className="text-xl font-extrabold text-orange-400">
                        Rp {total.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleCheckout}
                      className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-50 text-slate-950 font-bold uppercase rounded-xl shadow-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle size={16} />
                      <span>{isSubmitting ? "Memproses..." : "Checkout Order"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        <footer className="mt-auto pt-8 text-center text-xs text-slate-500">
          © 2026 AEON VELVRA. All rights reserved.
        </footer>
      </div>

      {/* Modal Sukses Checkout */}
      {isCheckoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
          <div className="w-full max-w-sm backdrop-blur-2xl bg-[#0d0a14]/95 border border-white/10 rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center">
            
            <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center text-orange-400 mb-4 animate-bounce">
              <FaCheckCircle size={32} />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Checkout Berhasil!</h3>
            <p className="text-xs text-slate-400 mb-2">
              Pesanan atas nama <strong className="text-white">{customerName}</strong> telah berhasil dibuat.
            </p>

            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-6 flex justify-between items-center text-xs">
              <span className="text-slate-400 uppercase tracking-wider">Total Tagihan</span>
              <span className="text-base font-extrabold text-orange-400">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-slate-950 font-bold text-sm uppercase rounded-xl shadow-lg transition duration-200 cursor-pointer"
            >
              Lanjut Pesanan Baru
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default MenuOrderPage;