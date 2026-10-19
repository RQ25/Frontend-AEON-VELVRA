"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Chart from "chart.js/auto";
import { GetCookie } from "@/lib/client-cookie";
import { BASE_API_URL } from "@/global";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert/index";
import {
  FaClipboardList,
  FaStar,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHome,
  FaShoppingBag,
  FaReceipt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaSearch
} from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

interface IMenu {
  menuId: number;
  name: string;
  price: number;
}

interface IOrderList {
  id: number;
  idOrder?: number;
  menuId?: number;
  quantity: number;
  note: string;
  menu?: IMenu;
}

interface IOrder {
  id: number;
  customer: string;
  table_number: string;
  total_price: number;
  payment_method: string;
  status: string;
  createdAt: string;
  orderList: IOrderList[];
}

const HistoryPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Kasir");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const chartRef = useRef<Chart | null>(null);

  // Helper untuk menghitung total harga 1 transaksi jika total_price di backend bernilai 0
  const calculateOrderTotal = (order: IOrder): number => {
    if (order.total_price && order.total_price > 0) {
      return order.total_price;
    }
    if (order.orderList && order.orderList.length > 0) {
      return order.orderList.reduce((sum, item) => {
        const itemPrice = item.menu?.price || 0;
        return sum + itemPrice * (item.quantity || 1);
      }, 0);
    }
    return 0;
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = (await GetCookie("token")) || "";
      const url = `${BASE_API_URL}/order`;
      const { data } = await get(url, token);

      if (data?.status && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const nameFromCookie = await GetCookie("name");
      if (nameFromCookie) {
        setUserName(nameFromCookie);
      }
    };
    loadUser();
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const customerName = (order.customer || "").toLowerCase();
    const tableNumber = (order.table_number || "").toLowerCase();
    const id = (order.id || "").toString();
    return customerName.includes(q) || tableNumber.includes(q) || id.includes(q);
  });

  const totalTransactionCount = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + calculateOrderTotal(order), 0);

  useEffect(() => {
    const canvas = document.getElementById("salesChart") as HTMLCanvasElement;
    if (canvas && orders.length > 0) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        const monthlyData = new Array(12).fill(0);

        orders.forEach((order) => {
          if (order.createdAt) {
            const monthIdx = new Date(order.createdAt).getMonth();
            if (monthIdx >= 0 && monthIdx < 12) {
              monthlyData[monthIdx] += calculateOrderTotal(order);
            }
          }
        });

        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: months,
            datasets: [
              {
                label: "Pendapatan Bulanan (Rp)",
                data: monthlyData,
                backgroundColor: "rgba(249, 115, 22, 0.5)",
                borderColor: "rgba(249, 115, 22, 1)",
                borderWidth: 1.5,
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: "#cbd5e1",
                  font: { size: 12 },
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#94a3b8" },
                grid: { color: "rgba(255, 255, 255, 0.05)" },
              },
              y: {
                ticks: { color: "#94a3b8" },
                grid: { color: "rgba(255, 255, 255, 0.05)" },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [orders]);

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
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition"
            >
              <FaShoppingBag className="text-slate-400 text-lg" />
              <span>Pesan Makanan</span>
            </Link>

            <Link
              href="/cashier/history"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-orange-500/20 border border-orange-500/30 rounded-xl transition"
            >
              <FaClockRotateLeft className="text-orange-400 text-lg" />
              <span>History Pemesanan</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-500">
          © 2026 AEON VELVRA
        </div>
      </aside>

      {/* Main Content */}
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
              <p className="text-xs text-slate-400">Order History & Sales Analytics</p>
            </div>
          </div>
        </header>

        {/* Card Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="p-4 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-xl">
              <FaReceipt size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Transaksi</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">{totalTransactionCount} Order</h3>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl">
              <FaMoneyBillWave size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Omset</p>
              <h3 className="text-2xl font-extrabold text-orange-400 mt-1">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="p-4 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl">
              <FaCalendarAlt size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Status Operasional</p>
              <h3 className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-2">
                <FaCheckCircle size={16} /> Active Terminal
              </h3>
            </div>
          </div>
        </div>

        {/* Chart Penjualan */}
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl mb-8">
          <h4 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">
            Grafik Penjualan
          </h4>
          <div className="relative w-full h-72">
            <canvas id="salesChart"></canvas>
          </div>
        </div>

        {/* Tabel Daftar Transaksi */}
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <h4 className="text-xl font-bold text-white">Daftar Transaksi</h4>
              <p className="text-xs text-slate-400 mt-0.5">Riwayat pesanan yang telah dikonfirmasi.</p>
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID / Pelanggan / Meja..."
                className="w-full text-xs rounded-xl py-2.5 pl-9 pr-4 bg-black/40 border border-white/10 text-white placeholder-slate-400 focus:border-orange-500/60 focus:outline-none transition"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400">Loading history transactions...</div>
          ) : filteredOrders.length === 0 ? (
            <AlertInfo title="Informasi">Tidak ada riwayat transaksi ditemukan.</AlertInfo>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Pelanggan / Meja</th>
                    <th className="py-3 px-4">Tanggal & Waktu</th>
                    <th className="py-3 px-4">Item Pesanan</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Total Tagihan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => {
                    const finalTotal = calculateOrderTotal(order);

                    return (
                      <tr key={order.id} className="hover:bg-white/5 transition">
                        <td className="py-4 px-4 font-bold text-orange-400">
                          #{order.id}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-white">{order.customer || "-"}</p>
                          <p className="text-[11px] text-slate-400">Meja: {order.table_number || "-"}</p>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("id-ID", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "-"}
                        </td>
                        <td className="py-4 px-4">
                          {order.orderList && order.orderList.length > 0 ? (
                            <ul className="space-y-1 text-slate-300">
                              {order.orderList.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <span className="font-semibold text-white">
                                    {item.menu?.name || `Item #${item.menuId}`}
                                  </span>
                                  <span className="text-orange-400">x{item.quantity}</span>
                                  {item.note && (
                                    <span className="text-[10px] text-slate-400 italic">
                                      ({item.note})
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-slate-500 italic">Tidak ada item detail</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-slate-300 font-semibold uppercase">
                          {order.payment_method || "CASH"}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded-md uppercase tracking-wider">
                            {order.status || "NEW"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-extrabold text-white text-sm">
                          Rp {finalTotal.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="mt-auto pt-8 text-center text-xs text-slate-500">
          © 2026 AEON VELVRA. All rights reserved.
        </footer>
      </div>

    </div>
  );
};

export default HistoryPage;