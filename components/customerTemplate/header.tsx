'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CustomerHeader() {
  return (
    <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
      <Link href="/customer" className="flex items-center gap-3 group">
        <Image 
          alt="AEON VELVRA Logo" 
          width={36} 
          height={36} 
          src="/image/logowht.png" 
          className="h-auto group-hover:scale-105 transition" 
        />
        <div>
          <h1 className="font-extrabold text-xl sm:text-2xl tracking-wider text-orange-400 uppercase">
            AEON VELVRA
          </h1>
          <p className="text-xs text-slate-400">Self-Service Customer Portal</p>
        </div>
      </Link>
    </header>
  );
}