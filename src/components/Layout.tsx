// src/components/Layout.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaNetworkWired, FaCalculator, FaCode, FaGlobe, FaBars, FaXmark } from 'react-icons/fa6';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-dark-bg-secondary text-dark-text-light p-4 shadow-lg relative z-30">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-l font-bold flex items-center gap-2 hover:text-accent-neon-green transition-colors duration-200">
            <FaGlobe className="text-accent-neon-green" />
            Mario's Network Coversion Toolkit
          </Link>

          {/* This button (hamburger/X) should ONLY appear on screens < 640px */}
          <button
            onClick={toggleMobileMenu}
            className="sm:hidden text-2xl focus:outline-none focus:ring-2 focus:ring-accent-neon-green rounded-md p-1"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu-items"
          >
            {isMobileMenuOpen ? <FaXmark /> : <FaBars />}
          </button>

          {/* This UL (desktop nav) should ONLY appear on screens >= 640px */}
          <ul className="hidden sm:flex space-x-6">
            <li>
              <Link href="/cidr" className="hover:text-accent-neon-green flex items-center gap-1 transition-colors duration-200">
                <FaNetworkWired /> CIDR Calculator
              </Link>
            </li>
            <li>
              <Link href="/bandwidth" className="hover:text-accent-neon-green flex items-center gap-1 transition-colors duration-200">
                <FaCalculator /> Bandwidth Calculator
              </Link>
            </li>
            <li>
              <Link href="/binary" className="hover:text-accent-neon-green flex items-center gap-1 transition-colors duration-200">
                <FaCode /> Binary Calculator
              </Link>
            </li>
          </ul>
        </nav>

        {/* This DIV (mobile dropdown) should ONLY be rendered and visible on screens < 640px when open */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu-items"
            className="sm:hidden absolute top-full left-0 right-0 bg-dark-bg-secondary shadow-lg py-4 px-4 z-20"
            
          >
            <ul className="flex flex-col space-y-4">
              <li>
                <Link
                  href="/cidr"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-accent-neon-green flex items-center gap-2 transition-colors duration-200 text-lg"
                >
                  <FaNetworkWired /> CIDR Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/bandwidth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-accent-neon-green flex items-center gap-2 transition-colors duration-200 text-lg"
                >
                  <FaCalculator /> Bandwidth Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/binary"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-accent-neon-green flex items-center gap-2 transition-colors duration-200 text-lg"
                >
                  <FaCode /> Binary Calculator
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto relative z-10 overflow-y-auto">
        {children}
      </main>

      <footer className="bg-dark-bg-secondary text-dark-text-muted p-4 text-center text-sm shadow-inner mt-auto border-dark-border-subtle">
        © {new Date().getFullYear()} Marios Pavlou - Network Coversion Toolkit. Built with ❤️, and a few tears.
      </footer>
    </div>
  );
}