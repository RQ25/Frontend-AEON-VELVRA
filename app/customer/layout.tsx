import React from 'react';
import CustomerTemplate from '@/components/customerTemplate';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerTemplate>
      {children}
    </CustomerTemplate>
  );
}