import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'PartyDial Marketplace',
    description: 'PartyDial Marketplace',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
