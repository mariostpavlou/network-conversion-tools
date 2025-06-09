// src/lib/network-utils.ts

/**
 * Validates if a string is a valid IPv4 address.
 * @param ip The IP address string.
 */
export function isIpValid(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && String(num) === part; // Check for leading zeros and valid range
  });
}

/**
 * Validates if a string is a valid CIDR format (IP/Prefix).
 * @param cidr The CIDR string.
 */
export function isValidCidr(cidr: string): boolean {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  const [ip, prefix] = parts;
  if (!isIpValid(ip)) return false;
  const prefixNum = parseInt(prefix, 10);
  return prefixNum >= 0 && prefixNum <= 32 && String(prefixNum) === prefix;
}

/**
 * Converts an IPv4 address to its 32-bit binary representation.
 * @param ip The IPv4 address string.
 */
function ipToBinary(ip: string): string {
  return ip.split('.').map(octet => {
    return parseInt(octet, 10).toString(2).padStart(8, '0');
  }).join('');
}

/**
 * Converts a 32-bit binary string to an IPv4 address.
 * @param binaryIp The 32-bit binary string.
 */
function binaryToIp(binaryIp: string): string {
  const octets = [];
  for (let i = 0; i < 32; i += 8) {
    octets.push(parseInt(binaryIp.substring(i, i + 8), 2));
  }
  return octets.join('.');
}

/**
 * Calculates the network address, broadcast address, and host range for a given CIDR.
 * @param cidr The CIDR string (e.g., "192.168.1.0/24").
 */
export function calculateIpRange(cidr: string) {
  if (!isValidCidr(cidr)) return null;

  const [ip, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);

  const ipBinary = ipToBinary(ip);

  // Network address
  const networkBinary = ipBinary.substring(0, prefix).padEnd(32, '0');
  const networkAddress = binaryToIp(networkBinary);

  // Broadcast address
  const broadcastBinary = ipBinary.substring(0, prefix).padEnd(32, '1');
  const broadcastAddress = binaryToIp(broadcastBinary);

  // Total hosts
  const totalHosts = Math.pow(2, (32 - prefix));

  // Usable hosts
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

  // First usable host
  let firstUsableHost = '';
  if (totalHosts > 2) {
    const firstUsableBinary = networkBinary.substring(0, 31) + '1';
    firstUsableHost = binaryToIp(firstUsableBinary);
  } else {
    firstUsableHost = 'N/A'; // For /31 and /32, no usable hosts in the traditional sense
  }

  // Last usable host
  let lastUsableHost = '';
  if (totalHosts > 2) {
    const lastUsableBinary = broadcastBinary.substring(0, 31) + '0';
    lastUsableHost = binaryToIp(lastUsableBinary);
  } else {
    lastUsableHost = 'N/A'; // For /31 and /32, no usable hosts in the traditional sense
  }

  return {
    networkAddress,
    broadcastAddress,
    firstUsableHost,
    lastUsableHost,
    totalHosts,
    usableHosts,
  };
}

/**
 * Converts a subnet mask (e.g., "255.255.255.0") to a CIDR prefix (e.g., 24).
 * @param mask The subnet mask string.
 */
export function maskToCidr(mask: string): number | null {
  if (!isIpValid(mask)) return null;

  const maskBinary = ipToBinary(mask);
  const onesCount = maskBinary.split('1').length - 1; // Count of '1's

  // A valid mask must consist of N ones followed by 32-N zeros
  if (maskBinary.indexOf('0') < maskBinary.lastIndexOf('1')) {
    return null; // Invalid mask format (e.g., 255.254.255.0)
  }

  return onesCount;
}

/**
 * Converts a CIDR prefix (e.g., 24) to a subnet mask (e.g., "255.255.255.0").
 * @param cidrPrefix The CIDR prefix number.
 */
export function cidrToMask(cidrPrefix: number): string | null {
  if (isNaN(cidrPrefix) || cidrPrefix < 0 || cidrPrefix > 32) {
    return null;
  }
  const ones = '1'.repeat(cidrPrefix);
  const zeros = '0'.repeat(32 - cidrPrefix);
  const binaryMask = ones + zeros;
  return binaryToIp(binaryMask);
}

/**
 * Calculates the smallest CIDR prefix and corresponding subnet mask needed for a given number of usable hosts.
 * Returns an object { cidr: number, mask: string } or null if input is invalid.
 * A /32 has 0 usable hosts.
 * A /31 has 0 usable hosts.
 * A /30 has 2 usable hosts.
 */
export function calculateCidrFromUsableHosts(usableHosts: number): { cidr: number, mask: string } | null {
  if (isNaN(usableHosts) || usableHosts < 0) {
    return null; // Invalid input
  }

  let cidrPrefix: number;

  if (usableHosts === 0) {
    cidrPrefix = 32; // /32 has 1 address, 0 usable hosts (network address only)
  } else {
    // For N usable hosts, we need N + 2 total addresses (network + broadcast)
    // Smallest block for 1 usable host requires 4 addresses (/30 -> 2 usable hosts)
    // So, we need at least 4 total addresses if usable hosts > 0
    const totalAddressesNeeded = usableHosts + 2;

    // Find the smallest 'n' (number of host bits) such that 2^n >= totalAddressesNeeded
    let hostBits = 0;
    let powerOf2 = 1; // Start with 2^0 = 1

    while (powerOf2 < totalAddressesNeeded || (powerOf2 < 4 && usableHosts > 0)) {
      powerOf2 *= 2;
      hostBits++;
      if (hostBits > 32) { // Safety break for extremely large numbers
        return null; // Exceeds /0 network capacity
      }
    }

    cidrPrefix = 32 - hostBits;

    // Ensure prefix is within valid range (0-32)
    if (cidrPrefix < 0 || cidrPrefix > 32) {
      return null; // Should not happen with valid input but as a safeguard
    }
  }

  const subnetMask = cidrToMask(cidrPrefix);
  if (subnetMask === null) {
      return null; // Error converting prefix to mask, though unlikely here
  }

  return { cidr: cidrPrefix, mask: subnetMask };
}


// --- Binary Conversion Utilities ---

/**
 * Converts a decimal number to its binary representation.
 * @param decimal The decimal number.
 * @param padding The number of bits to pad with leading zeros (e.g., 8 for an octet).
 */
export function decToBinary(decimal: number, padding: number = 0): string {
  if (isNaN(decimal)) return '';
  return decimal.toString(2).padStart(padding, '0');
}

/**
 * Converts a binary string to its decimal representation.
 * @param binary The binary string.
 */
export function binaryToDec(binary: string): number | null {
  if (!/^[01]+$/.test(binary)) return null;
  return parseInt(binary, 2);
}

/**
 * Converts a decimal number to hexadecimal.
 * @param decimal The decimal number.
 */
export function decToHex(decimal: number): string {
  if (isNaN(decimal)) return '';
  return decimal.toString(16).toUpperCase();
}

/**
 * Converts a hexadecimal string to decimal.
 * @param hex The hexadecimal string.
 */
export function hexToDec(hex: string): number | null {
  if (!/^[0-9A-Fa-f]+$/.test(hex)) return null;
  return parseInt(hex, 16);
}

/**
 * Converts a binary string to hexadecimal.
 * @param binary The binary string.
 */
export function binaryToHex(binary: string): string | null {
  const dec = binaryToDec(binary);
  if (dec === null) return null;
  return decToHex(dec);
}

/**
 * Converts a hexadecimal string to binary.
 * @param hex The hexadecimal string.
 * @param padding The number of bits to pad with leading zeros.
 */
export function hexToBinary(hex: string, padding: number = 0): string | null {
  const dec = hexToDec(hex);
  if (dec === null) return null;
  return decToBinary(dec, padding);
}

/**
 * Performs a bitwise AND operation on two binary strings.
 * Pads shorter string with leading zeros to match length.
 * @param bin1 First binary string.
 * @param bin2 Second binary string.
 */
export function binaryAnd(bin1: string, bin2: string): string {
  const maxLength = Math.max(bin1.length, bin2.length);
  const paddedBin1 = bin1.padStart(maxLength, '0');
  const paddedBin2 = bin2.padStart(maxLength, '0');
  let result = '';
  for (let i = 0; i < maxLength; i++) {
    result += (parseInt(paddedBin1[i]) & parseInt(paddedBin2[i])).toString();
  }
  return result;
}

/**
 * Performs a bitwise OR operation on two binary strings.
 * Pads shorter string with leading zeros to match length.
 * @param bin1 First binary string.
 * @param bin2 Second binary string.
 */
export function binaryOr(bin1: string, bin2: string): string {
  const maxLength = Math.max(bin1.length, bin2.length);
  const paddedBin1 = bin1.padStart(maxLength, '0');
  const paddedBin2 = bin2.padStart(maxLength, '0');
  let result = '';
  for (let i = 0; i < maxLength; i++) {
    result += (parseInt(paddedBin1[i]) | parseInt(paddedBin2[i])).toString();
  }
  return result;
}

/**
 * Performs a bitwise XOR operation on two binary strings.
 * Pads shorter string with leading zeros to match length.
 * @param bin1 First binary string.
 * @param bin2 Second binary string.
 */
export function binaryXor(bin1: string, bin2: string): string {
  const maxLength = Math.max(bin1.length, bin2.length);
  const paddedBin1 = bin1.padStart(maxLength, '0');
  const paddedBin2 = bin2.padStart(maxLength, '0');
  let result = '';
  for (let i = 0; i < maxLength; i++) {
    result += (parseInt(paddedBin1[i]) ^ parseInt(paddedBin2[i])).toString();
  }
  return result;
}

/**
 * Performs a bitwise NOT operation on a binary string.
 * @param bin The binary string.
 */
export function binaryNot(bin: string): string {
  let result = '';
  for (let i = 0; i < bin.length; i++) {
    result += (bin[i] === '0' ? '1' : '0');
  }
  return result;
}

/**
 * Converts bits per second to a human-readable format.
 * @param bps Bits per second.
 */
export function formatBandwidth(bps: number): string {
  if (isNaN(bps)) return "N/A";
  if (bps === 0) return "0 bps";

  const units = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
  let unitIndex = 0;
  while (bps >= 1000 && unitIndex < units.length - 1) {
    bps /= 1000;
    unitIndex++;
  }
  return `${bps.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Converts bytes to a human-readable format.
 * @param bytes Bytes.
 */
export function formatBytes(bytes: number): string {
  if (isNaN(bytes)) return "N/A";
  if (bytes === 0) return "0 Bytes";

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }
  return `${bytes.toFixed(2)} ${units[unitIndex]}`;
}