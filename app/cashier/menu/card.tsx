"use client";
import React from 'react';
import Image from 'next/image';
import { BASE_IMAGE_MENU } from '@/global';
import { IMenu } from '@/app/types';
import useMenuData from './useData';

interface MenuCardProps {
  menu: IMenu;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu }) => {
  return (
    <div className="group flex flex-col justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-orange-500/40 transition duration-300 shadow-xl backdrop-blur-md">
      <div>
        {/* Gambar Menu */}
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl bg-black/40">
          {menu.picture ? (
            <Image 
              fill
              src={`${BASE_IMAGE_MENU}/${menu.picture}`} 
              className="object-cover object-center group-hover:scale-105 transition duration-500" 
              alt={menu.name} 
              unoptimized 
              onError={(e) => (e.currentTarget.src = '/fallback-image.png')} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
              No Image
            </div>
          )}
        </div>

        {/* Badge Kategori */}
        <div className="mb-2">
          <CategoryBadge category={menu.category} />
        </div>

        {/* Nama Menu */}
        <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition mb-1 line-clamp-1">
          {menu.name}
        </h3>

        {/* Deskripsi */}
        <p className="text-xs text-slate-400 mb-3 line-clamp-3 min-h-[42px]">
          {menu.description || "No description provided."}
        </p>
      </div>

      {/* Harga */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Price</span>
        <span className="text-lg font-extrabold text-orange-400">
          Rp {menu.price?.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
};
    
interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  if (category === "FOOD") {
    return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider">Food</span>;
  }
  if (category === "DESSERT") {
    return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider">Dessert</span>;
  }
  return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider">Drink</span>;
};

interface MenuListProps {
  search: string;
  selectedCategory: string;
}

const MenuList: React.FC<MenuListProps> = ({ search, selectedCategory }) => {
  const menuData: IMenu[] = useMenuData(search);

  const filteredMenuData = selectedCategory === "ALL"
    ? menuData
    : menuData.filter(menu => menu.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredMenuData.map((menu) => ( 
        <MenuCard key={menu.menuId} menu={menu} />
      ))}
    </div>
  );
};

export default MenuList;