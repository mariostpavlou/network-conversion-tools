// src/components/Layout.tsx
'use client';
import Link from 'next/link';
import { FaNetworkWired, FaCalculator, FaCode, FaGlobe, FaBriefcase } from 'react-icons/fa6';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    // This outermost div will now guarantee the full viewport height.
    // 'flex flex-col' makes it a column flex container.
    <div className="min-h-screen flex flex-col">
      <header className="bg-dark-bg-secondary text-dark-text-light p-4 shadow-lg border-b border-dark-border-subtle">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-accent-neon-green transition-colors duration-200">
            <FaGlobe className="text-accent-neon-green" />
            Mario's Network Coversion Toolkit
          </Link>
          <ul className="flex space-x-6">
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
            <li>
              <Link href="https://www.mariospavlou.net" className="hover:text-accent-neon-green flex items-center gap-1 transition-colors duration-200">
                <FaBriefcase /> Portfolio Site
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main content area:
          - flex-grow: Essential! This makes the main section expand to fill all available vertical space
                       between the header and footer, pushing the footer to the bottom.
          - container mx-auto: Still for horizontal centering.
          - NO vertical padding here. Individual page content handles its own padding.
          - overflow-y-auto: Allows scrolling ONLY within this main content area if its children are too tall.
      */}
      <main className="flex-grow container mx-auto relative z-10 overflow-y-auto">
        {children}
      </main>

      <footer className="bg-dark-bg-secondary text-dark-text-muted p-4 text-center text-sm shadow-inner mt-auto border-t border-dark-border-subtle">
        © {new Date().getFullYear()} Marios Pavlou - Network Coversion Toolkit. Built with ❤️, and a few tears.
      </footer>
    </div>
  );
}