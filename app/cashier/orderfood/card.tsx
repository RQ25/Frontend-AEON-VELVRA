"use client";
import React from "react";
import Image from "next/image";
import { BASE_IMAGE_MENU } from "@/global";
import { ICart, IMenu } from "@/app/types";
import { FaPlus, FaMinus } from "react-icons/fa";

interface CardComponentProps {
  data: IMenu;
  itemInCart: ICart | null;
  handleAddToCart: (menuItem: IMenu) => void;
  handleRemoveFromCart: (menuItem: IMenu) => void;
  renderCategory?: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({
  data,
  itemInCart,
  handleAddToCart,
  handleRemoveFromCart,
  renderCategory = true,
}) => {
  return (
    <div className="group flex flex-col justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-orange-500/40 transition duration-300 shadow-xl backdrop-blur-md">
      <div>
        {/* Gambar Menu */}
        <div className="relative w-full h-40 mb-3 overflow-hidden rounded-xl bg-black/40">
          {data.picture ? (
            <Image
              fill
              src={`${BASE_IMAGE_MENU}/${data.picture}`}
              className="object-cover object-center group-hover:scale-105 transition duration-500"
              alt={data.name}
              unoptimized
              onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
              No Image
            </div>
          )}
        </div>

        {/* Badge Kategori */}
        {renderCategory && data.category && (
          <div className="mb-2">
            <CategoryBadge category={data.category} />
          </div>
        )}

        {/* Nama Menu */}
        <h5 className="font-bold text-base text-white group-hover:text-orange-400 transition mb-1 line-clamp-1">
          {data.name}
        </h5>

        {/* Deskripsi */}
        <p className="text-xs text-slate-400 mb-3 line-clamp-2 min-h-[32px]">
          {data.description || "No description provided."}
        </p>
      </div>

      <div>
        {/* Harga & Tombol Tambah/Kurang */}
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <span className="text-sm font-extrabold text-orange-400">
            Rp {data.price?.toLocaleString("id-ID")}
          </span>

          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-rose-500/80 active:bg-rose-600 text-white rounded-lg transition"
              onClick={() => handleRemoveFromCart(data)}
              title="Kurangi"
            >
              <FaMinus size={10} />
            </button>

            <span className="text-xs font-semibold text-white px-1">
              {itemInCart ? itemInCart.quantity : 0}
            </span>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-slate-950 font-bold rounded-lg transition"
              onClick={() => handleAddToCart(data)}
              title="Tambah"
            >
              <FaPlus size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  if (category === "FOOD") {
    return (
      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
        Food
      </span>
    );
  }
  if (category === "DESSERT") {
    return (
      <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
        Dessert
      </span>
    );
  }
  return (
    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
      Drink
    </span>
  );
};

export default CardComponent;