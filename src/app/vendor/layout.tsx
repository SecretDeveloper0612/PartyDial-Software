import { DashboardLayout } from '@/components/Layout';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="vendor">{children}</DashboardLayout>;
}
