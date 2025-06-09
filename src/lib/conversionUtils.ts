// src/lib/conversionUtils.ts

// Type definitions
export type TimeUnit = 'seconds' | 'minutes' | 'hours';
export type DataUnit = 'KB' | 'MB' | 'GB' | 'TB';
export type BandwidthUnit = 'bps' | 'Kbps' | 'Mbps' | 'Gbps';

/**
 * Converts a given data value from its unit to bits.
 * @param value The numerical data value.
 * @param unit The unit of the data value (KB, MB, GB, TB).
 * @returns The data value in bits.
 */
export function convertToBits(value: number, unit: DataUnit): number {
  switch (unit) {
    case 'KB': return value * 1024 * 8;
    case 'MB': return value * 1024 * 1024 * 8;
    case 'GB': return value * 1024 * 1024 * 1024 * 8;
    case 'TB': return value * 1024 * 1024 * 1024 * 1024 * 8;
    default: return value; // Fallback, though unit should always match
  }
}

/**
 * Converts a given time value from its unit to seconds.
 * @param value The numerical time value.
 * @param unit The unit of the time value (seconds, minutes, hours).
 * @returns The time value in seconds.
 */
export function convertToSeconds(value: number, unit: TimeUnit): number {
  switch (unit) {
    case 'minutes': return value * 60;
    case 'hours': return value * 3600;
    default: return value; // Fallback
  }
}

/**
 * Converts a given bandwidth value from its unit to bits per second (bps).
 * @param value The numerical bandwidth value.
 * @param unit The unit of the bandwidth value (bps, Kbps, Mbps, Gbps).
 * @returns The bandwidth value in bps.
 */
export function convertToBps(value: number, unit: BandwidthUnit): number {
  switch (unit) {
    case 'Kbps': return value * 1000;
    case 'Mbps': return value * 1000 * 1000;
    case 'Gbps': return value * 1000 * 1000 * 1000;
    default: return value; // Fallback
  }
}

/**
 * Formats a numerical result into a human-readable string with appropriate units.
 * @param value The numerical result.
 * @param type The type of value being formatted ('data', 'time', 'bandwidth').
 * @returns Formatted string (e.g., "1.23 MB", "5.4 seconds", "100 Mbps").
 */
export const formatResult = (value: number, type: 'data' | 'time' | 'bandwidth') => {
  if (isNaN(value) || !isFinite(value)) return 'N/A';

  if (type === 'data') {
    // Using 1024 for data storage units (KB, MB, etc.)
    if (value < 1024 * 8) return `${(value / 8).toFixed(2)} B`; // Bytes
    if (value < 1024 * 1024 * 8) return `${(value / (1024 * 8)).toFixed(2)} KB`;
    if (value < 1024 * 1024 * 1024 * 8) return `${(value / (1024 * 1024 * 8)).toFixed(2)} MB`;
    if (value < 1024 * 1024 * 1024 * 1024 * 8) return `${(value / (1024 * 1024 * 1024 * 8)).toFixed(2)} GB`;
    return `${(value / (1024 * 1024 * 1024 * 1024 * 8)).toFixed(2)} TB`;
  } else if (type === 'time') {
    if (value < 60) return `${value.toFixed(2)} seconds`;
    if (value < 3600) return `${(value / 60).toFixed(2)} minutes`;
    return `${(value / 3600).toFixed(2)} hours`;
  } else if (type === 'bandwidth') {
    // Using 1000 for network units (Kbps, Mbps, etc.)
    if (value < 1000) return `${value.toFixed(2)} bps`;
    if (value < 1000 * 1000) return `${(value / 1000).toFixed(2)} Kbps`;
    if (value < 1000 * 1000 * 1000) return `${(value / (1000 * 1000)).toFixed(2)} Mbps`;
    return `${(value / (1000 * 1000 * 1000)).toFixed(2)} Gbps`;
  }
  return 'N/A';
};

/**
 * Helper to get radix for parseInt/toString.
 * @param base The base type ('binary', 'decimal', 'hex', 'octal').
 * @returns The numerical radix.
 */
export const getRadix = (base: Base) => {
    switch (base) {
      case 'binary': return 2;
      case 'octal': return 8;
      case 'decimal': return 10;
      case 'hex': return 16;
      default: return 10; // Fallback for safety
    }
  };

  // Binary calculator specific types
export type Base = 'binary' | 'decimal' | 'hex' | 'octal';
export type Operation = '+' | '-' | '*' | '/' | '&' | '|' | '^' | '<<' | '>>';