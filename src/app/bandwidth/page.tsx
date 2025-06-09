// src/app/bandwidth/page.tsx (Updated)
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { FaDownload, FaUpload, FaClock, FaGauge, FaCalculator } from 'react-icons/fa6';
import {
  convertToBits,
  convertToSeconds,
  convertToBps,
  formatResult, // Also moved this one
  TimeUnit, DataUnit, BandwidthUnit
} from '../../lib/conversionUtils'; // Correct relative path

export default function BandwidthCalculatorPage() {
  const [fileSize, setFileSize] = useState<number | ''>('');
  const [fileSizeUnit, setFileSizeUnit] = useState<DataUnit>('MB');
  const [transferTime, setTransferTime] = useState<number | ''>('');
  const [transferTimeUnit, setTransferTimeUnit] = useState<TimeUnit>('seconds');
  const [bandwidth, setBandwidth] = useState<number | ''>('');
  const [bandwidthUnit, setBandwidthUnit] = useState<BandwidthUnit>('Mbps');

  const [error, setError] = useState<string | null>(null);

  // Memoize the calculation logic
  const calculatedResult = useMemo(() => {
    setError(null); // Clear error on new calculation attempt
    let result: { type: string; value: number; unit: string } | null = null;

    // Convert inputs to a base unit (e.g., bits for data, seconds for time, bps for bandwidth)
    const fileSizeBits = typeof fileSize === 'number' ? convertToBits(fileSize, fileSizeUnit) : null;
    const transferTimeSeconds = typeof transferTime === 'number' ? convertToSeconds(transferTime, transferTimeUnit) : null;
    const bandwidthBps = typeof bandwidth === 'number' ? convertToBps(bandwidth, bandwidthUnit) : null;

    let numInputs = 0;
    if (fileSizeBits !== null) numInputs++;
    if (transferTimeSeconds !== null) numInputs++;
    if (bandwidthBps !== null) numInputs++;

    if (numInputs < 2) {
      setError('Enter at least two values to calculate.');
      return null;
    }

    try {
      if (fileSizeBits !== null && transferTimeSeconds !== null && transferTimeSeconds > 0) {
        // Calculate Bandwidth
        const calculatedBandwidthBps = fileSizeBits / transferTimeSeconds;
        result = {
          type: 'Bandwidth',
          value: calculatedBandwidthBps,
          unit: 'bps',
        };
      } else if (fileSizeBits !== null && bandwidthBps !== null && bandwidthBps > 0) {
        // Calculate Transfer Time
        const calculatedTransferTimeSeconds = fileSizeBits / bandwidthBps;
        result = {
          type: 'Transfer Time',
          value: calculatedTransferTimeSeconds,
          unit: 'seconds',
        };
      } else if (transferTimeSeconds !== null && bandwidthBps !== null) {
        // Calculate File Size
        const calculatedFileSizeBits = bandwidthBps * transferTimeSeconds;
        result = {
          type: 'File Size',
          value: calculatedFileSizeBits,
          unit: 'bits',
        };
      } else {
        setError('Invalid input combination or zero values.');
      }
    } catch (e: any) {
      setError(`Calculation error: ${e.message}`);
    }

    return result;
  }, [fileSize, fileSizeUnit, transferTime, transferTimeUnit, bandwidth, bandwidthUnit]);

  // Use useEffect to update state based on memoized calculation
  // This is technically not strictly needed here if `calculatedResult` is directly rendered,
  // but it's a good pattern if `results` state was more complex.
  // For this simple case, `calculatedResult` could directly be rendered.
  // Leaving it as a pattern for more complex scenarios.
  const [displayResult, setDisplayResult] = useState<typeof calculatedResult>(null);

  useEffect(() => {
    setDisplayResult(calculatedResult);
  }, [calculatedResult]);


  return (
    <div className="flex flex-col items-center animate-fade-in p-4 sm:p-8 space-y-8">
      <h1 className="text-4xl font-bold text-white-800 mb-8">Bandwidth Calculator</h1>

      <section className="w-full max-w-xl bg-card-bg dark:bg-white-700 p-6 rounded-lg shadow-md border border-card-border dark:border-white-600">
        <h2 className="text-2xl font-semibold text-white-700 mb-4 flex items-center gap-2">
          <FaCalculator className="text-secondary-accent" /> Calculate Bandwidth, Time, or Size
        </h2>

        {/* Input fields */}
        <div className="mb-4">
          <label htmlFor="fileSize" className="block text-white-700  text-sm font-bold mb-2">
            <FaDownload className="inline-block mr-1 text-primary-accent" /> File Size:
          </label>
          <div className="flex">
            <input
              type="number"
              id="fileSize"
              value={fileSize}
              onChange={(e) => setFileSize(parseFloat(e.target.value) || '')}
              className="shadow appearance-none border rounded-l w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-white-800  dark:border-white-600"
              placeholder="e.g., 100"
            />
            <select
              value={fileSizeUnit}
              onChange={(e) => setFileSizeUnit(e.target.value as DataUnit)}
              className="shadow border rounded-r py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-white-800  dark:border-white-600"
            >
              <option>KB</option>
              <option>MB</option>
              <option>GB</option>
              <option>TB</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="transferTime" className="block text-white-700  text-sm font-bold mb-2">
            <FaClock className="inline-block mr-1 text-primary-accent" /> Transfer Time:
          </label>
          <div className="flex">
            <input
              type="number"
              id="transferTime"
              value={transferTime}
              onChange={(e) => setTransferTime(parseFloat(e.target.value) || '')}
              className="shadow appearance-none border rounded-l w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-white-800  dark:border-white-600"
              placeholder="e.g., 60"
            />
            <select
              value={transferTimeUnit}
              onChange={(e) => setTransferTimeUnit(e.target.value as TimeUnit)}
              className="shadow border rounded-r py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-white-800  dark:border-white-600"
            >
              <option>seconds</option>
              <option>minutes</option>
              <option>hours</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="bandwidth" className="block text-white-700  text-sm font-bold mb-2">
            <FaGauge className="inline-block mr-1 text-primary-accent" /> Bandwidth:
          </label>
          <div className="flex">
            <input
              type="number"
              id="bandwidth"
              value={bandwidth}
              onChange={(e) => setBandwidth(parseFloat(e.target.value) || '')}
              className="shadow appearance-none border rounded-l w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-white-800  dark:border-white-600"
              placeholder="e.g., 10"
            />
            <select
              value={bandwidthUnit}
              onChange={(e) => setBandwidthUnit(e.target.value as BandwidthUnit)}
              className="shadow border rounded-r py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-white-800  dark:border-white-600"
            >
              <option>bps</option>
              <option>Kbps</option>
              <option>Mbps</option>
              <option>Gbps</option>
            </select>
          </div>
        </div>

        {/* Results display */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white-700  mb-4">Results</h2>
          {error ? (
            <p className="text-error-red font-medium">{error}</p>
          ) : (
            displayResult && (
              <p className="text-xl text-primary-accent font-bold">
                {displayResult.type}:{' '}
                <span className="font-mono text-secondary-accent">
                  {formatResult(displayResult.value, displayResult.type === 'File Size' ? 'data' : displayResult.type === 'Transfer Time' ? 'time' : 'bandwidth')}
                </span>
              </p>
            )
          )}
        </div>
      </section>
    </div>
  );
}