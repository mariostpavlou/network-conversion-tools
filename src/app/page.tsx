// src/app/page.tsx
import Link from 'next/link';
import { FaNetworkWired, FaCalculator, FaCode } from 'react-icons/fa6';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4 py-8">
      <h1 className="text-5xl font-extrabold text-aqua-text-light mb-6 animate-fade-in">
        Welcome to Mario's Network Conversion Toolkit!
      </h1>
      <p className="text-xl text-aqua-text-muted mb-10 max-w-2xl animate-fade-in delay-200">
        This project was made for me to learn more in-deapth the details of Node.js scripting and math, web-styling as well as keep my networking skills sharp. <b>This was made with AI Assistance.</b>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl ">
        <Link href="/cidr" className="bg-dark-bg-secondary p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-100 flex flex-col items-center group animate-fade-in delay-100 border-aqua-border-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-aqua-glass-overlay rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-100 btn-highlight:hover"></div>
          <FaNetworkWired className="text-aqua-accent-blue text-5xl mb-4 group-hover:scale-110 transition-transform duration-100" />
          <h2 className="text-2xl font-semibold text-aqua-text-light mb-2">CIDR Calculator</h2>
          <p className="text-aqua-text-muted">Master IP subnetting and address ranges.</p>
        </Link>

        <Link href="/bandwidth" className="bg-dark-bg-secondary p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-100 flex flex-col items-center group animate-fade-in delay-400 border-aqua-border-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-aqua-glass-overlay rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
          <FaCalculator className="text-aqua-accent-green text-5xl mb-4 group-hover:scale-110 transition-transform duration-100" />
          <h2 className="text-2xl font-semibold text-aqua-text-light mb-2">Bandwidth Calculator</h2>
          <p className="text-aqua-text-muted">Estimate transfer times and required bandwidth.</p>
        </Link>

        <Link href="/binary" className="bg-dark-bg-secondary p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-100 flex flex-col items-center group animate-fade-in delay-500 border-aqua-border-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-aqua-glass-overlay rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
          <FaCode className="text-aqua-accent-purple text-5xl mb-4 group-hover:scale-110 transition-transform duration-100" />
          <h2 className="text-2xl font-semibold text-aqua-text-light mb-2">Binary Converter</h2>
          <p className="text-aqua-text-muted">Convert between bases and perform bitwise operations.</p>
        </Link>
      </div>
    </div>
  );
}