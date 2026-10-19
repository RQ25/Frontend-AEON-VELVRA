'use client';
import React from 'react';
import Image from 'next/image';
import CustomerHeader from './header';
import CustomerFooter from './footer';

interface CustomerTemplateProps {
  children: React.ReactNode;
  title?: string;
}

export default function CustomerTemplate({ children, title }: CustomerTemplateProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col text-white font-sans overflow-x-hidden">
      
      {/* 1. Background Image Fullscreen */}
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

      {/* 2. Content Container */}
      <div className="relative z-10 flex-grow flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <CustomerHeader />

        <main className="flex-grow">
          {children}
        </main>

        <CustomerFooter />
      </div>

    </div>
  );
}