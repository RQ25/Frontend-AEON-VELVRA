import React from "react";
import Link from "next/link";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
}

const MenuItem = ({ icon, label, path, active }: MenuItemProps) => {
  return (
    <Link
      href={path}
      className={`flex items-center border-2 p-5 rounded-xl border-black my-3
        "bg-amber-400 hover:bg-amber-700 hover:text-stone-200 uppercase w-full text-stone-800 cursor-pointer
        ${
        active ? "text-" : "text-black"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{label}</span>
    </Link>
  );
};

export default MenuItem;

