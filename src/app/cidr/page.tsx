// src/app/cidr/page.tsx
'use client'; // This is a client component, so keep this directive

import { useState } from 'react';
// Import all necessary functions from your utility file
import {
  calculateIpRange,
  maskToCidr,
  isIpValid,
  isValidCidr,
  calculateCidrFromUsableHosts
} from '../../lib/network-utils'; // Ensure this path is correct relative to page.tsx

// Updated interface to include maximum host numbers for the determined CIDR
interface CalculatedCidrResult {
  cidr: number;
  mask: string;
  message?: string; // Optional message for specific cases like 0 usable hosts
  maxTotalHosts?: number; // New: Maximum total addresses this CIDR can have
  maxUsableHosts?: number; // New: Maximum usable hosts this CIDR can have
}

export default function CidrCalculatorPage() {
  // Existing states for CIDR to IP Range
  const [cidrInput, setCidrInput] = useState('');
  const [ipRangeResult, setIpRangeResult] = useState<string | null>(null);

  // Existing states for IP Range to CIDR
  const [ipAddressInput, setIpAddressInput] = useState('');
  const [subnetMaskInput, setSubnetMaskInput] = useState('');
  const [ipRangeCidrResult, setIpRangeCidrResult] = useState<string | null>(null);

  // States for Usable Hosts to CIDR
  const [usableHostsInput, setUsableHostsInput] = useState('');
  const [calculatedCidrFromUsable, setCalculatedCidrFromUsable] = useState<CalculatedCidrResult | null>(null);
  const [usableHostsError, setUsableHostsError] = useState<string | null>(null);


  // Existing CIDR to IP Range calculation
  const handleCidrToRange = () => {
    if (!isValidCidr(cidrInput)) {
      setIpRangeResult("Invalid CIDR format. E.g., 192.168.1.0/24");
      return;
    }
    const result = calculateIpRange(cidrInput);
    if (result) {
      setIpRangeResult(
        `Network: ${result.networkAddress}\n` +
        `Broadcast: ${result.broadcastAddress}\n` +
        `First Usable: ${result.firstUsableHost}\n` +
        `Last Usable: ${result.lastUsableHost}\n` +
        `Total Hosts: ${result.totalHosts.toLocaleString()}\n` +
        `Usable Hosts: ${result.usableHosts.toLocaleString()}`
      );
    } else {
      setIpRangeResult("Error calculating range.");
    }
  };

  // Existing IP Range to CIDR calculation
  const handleIpRangeToCidr = () => {
    if (!isIpValid(ipAddressInput)) {
      setIpRangeCidrResult("Invalid IP address format.");
      return;
    }
    const cidr = maskToCidr(subnetMaskInput);
    if (cidr === null) {
      setIpRangeCidrResult("Invalid Subnet Mask format. E.g., 255.255.255.0");
      return;
    }
    setIpRangeCidrResult(`/${cidr}`);
  };

  // NEW: Calculate CIDR from Usable Hosts (updated to also show max hosts for the resulting CIDR)
  const handleCalculateCidrFromUsable = () => {
    setUsableHostsError(null); // Clear previous errors
    const hosts = parseInt(usableHostsInput, 10);

    const calculatedCidrData = calculateCidrFromUsableHosts(hosts);

    if (calculatedCidrData === null) {
      setCalculatedCidrFromUsable(null);
      setUsableHostsError("Invalid input or calculation error (e.g., too many hosts or negative value).");
    } else {
      let message = '';
      if (hosts === 0) {
        message = ' (0 usable hosts requested)';
      }

      // To get the max total and usable hosts for the determined CIDR,
      // we can re-use the calculateIpRange function with a dummy IP
      // since only the CIDR part affects host calculations.
      const dummyCidrInput = `0.0.0.0/${calculatedCidrData.cidr}`;
      const rangeDetailsForCalculatedCidr = calculateIpRange(dummyCidrInput);

      setCalculatedCidrFromUsable({
        cidr: calculatedCidrData.cidr,
        mask: calculatedCidrData.mask,
        message: message,
        maxTotalHosts: rangeDetailsForCalculatedCidr?.totalHosts, // Use optional chaining
        maxUsableHosts: rangeDetailsForCalculatedCidr?.usableHosts, // Use optional chaining
      });
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-white mb-6 animate-fade-in">
        CIDR Calculator - IPv4
      </h1>

      {/* Calculate CIDR from Usable Hosts Section */}
      <div className="bg-dark-bg-secondary p-6 rounded-lg shadow-xl animate-fade-in delay-200 border-dark-border-subtle ">
        <h2 className="text-2xl font-bold text-white mb-4 ">Calculate CIDR from Usable Hosts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <label htmlFor="usableHosts" className="block text-dark-text-muted text-sm font-bold mb-2">
              Desired Usable Hosts:
            </label>
            <input
              type="number"
              id="usableHosts"
              className="w-full"
              value={usableHostsInput}
              onChange={(e) => setUsableHostsInput(e.target.value)}
              min="0"
              placeholder="e.g., 23"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCalculateCidrFromUsable}
              className="btn-highlight w-full"
            >
              Calculate CIDR
            </button>
          </div>
        </div>
        {usableHostsError && (
          <div className="mt-4 text-status-error text-sm">{usableHostsError}</div>
        )}
        {calculatedCidrFromUsable && (
          <div className="mt-6 p-4 bg-dark-bg-secondary rounded-md border-dark-border-subtle text-dark-text-light">
            <h3 className="font-semibold mb-2">Calculated CIDR:</h3>
            <p className="font-mono text-lg">
              Subnet Mask: {calculatedCidrFromUsable.mask} {calculatedCidrFromUsable.message}
              <br/>
              CIDR: /{calculatedCidrFromUsable.cidr}
            </p>
            {/* Displaying the maximum hosts for the determined CIDR */}
            {calculatedCidrFromUsable.maxTotalHosts !== undefined && (
              <div className="mt-4 border-t border-dark-border-subtle pt-4">
                <h3 className="font-semibold mb-2">Capacity of this Subnet:</h3>
                <p className="font-mono text-base">
                  Max Total Hosts: {calculatedCidrFromUsable.maxTotalHosts.toLocaleString()}
                  <br/>
                  Max Usable Hosts: {calculatedCidrFromUsable.maxUsableHosts !== undefined ? calculatedCidrFromUsable.maxUsableHosts.toLocaleString() : 'N/A'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Existing CIDR to IP Range Section */}
      <div className="bg-dark-bg-secondary p-6 rounded-lg shadow-xl animate-fade-in delay-300 border-dark-border-subtle">
        <h2 className="text-2xl font-bold text-white mb-4">CIDR to IP Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cidrInput" className="block text-dark-text-muted text-sm font-bold mb-2">
              CIDR:
            </label>
            <input
              type="text"
              id="cidrInput"
              className="w-full"
              value={cidrInput}
              onChange={(e) => setCidrInput(e.target.value)}
              placeholder="e.g., 192.168.1.0/24"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCidrToRange}
              className="btn-highlight w-full"
            >
              Calculate Range
            </button>
          </div>
        </div>
        {ipRangeResult && (
          <pre className="mt-6 p-4 bg-dark-bg-secondary rounded-md border-dark-border-subtle text-dark-text-light text-sm overflow-x-auto whitespace-pre-wrap">
            {ipRangeResult}
          </pre>
        )}
      </div>

      {/* Existing IP Address & Subnet Mask to CIDR Section */}
      <div className="bg-dark-bg-secondary p-6 rounded-lg shadow-xl animate-fade-in delay-400 border-dark-border-subtle">
        <h2 className="text-2xl font-bold text-white mb-4">IP Address & Subnet Mask to CIDR</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ipAddress" className="block text-dark-text-muted text-sm font-bold mb-2">
              IP Address:
            </label>
            <input
              type="text"
              id="ipAddress"
              className="w-full"
              value={ipAddressInput}
              onChange={(e) => setIpAddressInput(e.target.value)}
              placeholder="e.g., 192.168.1.10"
            />
          </div>
          <div>
            <label htmlFor="subnetMask" className="block text-dark-text-muted text-sm font-bold mb-2">
              Subnet Mask:
            </label>
            <input
              type="text"
              id="subnetMask"
              className="w-full"
              value={subnetMaskInput}
              onChange={(e) => setSubnetMaskInput(e.target.value)}
              placeholder="e.g., 255.255.255.0"
            />
          </div>
        </div>
        <button
          onClick={handleIpRangeToCidr}
          className="btn-highlight w-full mt-4"
        >
          Calculate CIDR
        </button>
        {ipRangeCidrResult && (
          <div className="mt-6 p-4 bg-dark-bg-secondary rounded-md border-dark-border-subtle text-dark-text-light">
            <h3 className="font-semibold mb-2">Calculated CIDR:</h3>
            <p className="font-mono text-lg">{ipRangeCidrResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}