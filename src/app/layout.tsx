import type { Metadata } from 'next'
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Capture Your Music!',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ToastContainer position="bottom-right" />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
