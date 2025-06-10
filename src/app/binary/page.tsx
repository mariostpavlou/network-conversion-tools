// src/app/binary/page.tsx (Updated)
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { FaCode } from 'react-icons/fa6'; // Changed FaBinary to FaCode
import {
  getRadix, // Import getRadix
  Base, Operation // Import types
} from '../../lib/conversionUtils'; // Correct relative path

export default function BinaryCalculatorPage() {
  const [input1, setInput1] = useState('');
  const [base1, setBase1] = useState<Base>('decimal');
  const [operation, setOperation] = useState<Operation | ''>('');
  const [input2, setInput2] = useState('');
  const [base2, setBase2] = useState<Base>('decimal');

  const [decimalResult, setDecimalResult] = useState<number | null>(null);
  const [binaryResult, setBinaryResult] = useState<string | null>(null);
  const [hexResult, setHexResult] = useState<string | null>(null);
  const [octalResult, setOctalResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use useMemo for the calculation itself
  const calculatedValues = useMemo(() => {
    setError(null);

    let num1Decimal: number | null = null;
    let num2Decimal: number | null = null;

    try {
      num1Decimal = parseInt(input1, getRadix(base1));
      if (isNaN(num1Decimal)) {
        setError('Invalid Number 1.');
        return null;
      }

      if (operation !== '') { // Only parse num2 if an operation is selected
        num2Decimal = parseInt(input2, getRadix(base2));
        if (isNaN(num2Decimal)) {
          setError('Invalid Number 2.');
          return null;
        }
      }

      let result: number | null = null;

      switch (operation) {
        case '+': result = (num1Decimal || 0) + (num2Decimal || 0); break;
        case '-': result = (num1Decimal || 0) - (num2Decimal || 0); break;
        case '*': result = (num1Decimal || 0) * (num2Decimal || 0); break;
        case '/':
          if ((num2Decimal || 0) === 0) { setError('Division by zero!'); return null; }
          result = Math.floor((num1Decimal || 0) / (num2Decimal || 0)); // Integer division
          break;
        case '&': result = (num1Decimal || 0) & (num2Decimal || 0); break;
        case '|': result = (num1Decimal || 0) | (num2Decimal || 0); break;
        case '^': result = (num1Decimal || 0) ^ (num2Decimal || 0); break;
        case '<<': result = (num1Decimal || 0) << (num2Decimal || 0); break;
        case '>>': result = (num1Decimal || 0) >> (num2Decimal || 0); break;
        default: // No operation selected, just convert the first number
            result = num1Decimal;
            break;
      }

      if (result !== null) {
        return {
          decimal: result,
          binary: result.toString(2),
          hex: result.toString(16).toUpperCase(),
          octal: result.toString(8),
        };
      }
      return null;

    } catch (e: any) {
      setError(`Calculation error: ${e.message}`);
      return null;
    }
  }, [input1, base1, operation, input2, base2]); // Recalculate when inputs change


  // Update state for rendering when calculatedValues changes
  useEffect(() => {
    if (calculatedValues) {
      setDecimalResult(calculatedValues.decimal);
      setBinaryResult(calculatedValues.binary);
      setHexResult(calculatedValues.hex);
      setOctalResult(calculatedValues.octal);
    } else {
      setDecimalResult(null);
      setBinaryResult(null);
      setHexResult(null);
      setOctalResult(null);
    }
  }, [calculatedValues]);


  return (
    <div className="flex flex-col items-center animate-fade-in p-4 sm:p-8 space-y-8">
      <h1 className="text-4xl font-bold text-white-800  mb-8 animate-fade-in">Binary & Base Converter</h1>

      <section className="w-full max-w-xl bg-card-bg dark:bg-white-700 p-6 rounded-lg shadow-md bg-dark-bg-secondary border-card-bg-dark-bg-secondary dark:border-white-600 animate-fade-in">
        <h2 className="text-2xl font-semibold text-white-700  mb-4 flex items-center gap-2">
          <FaCode className="text-secondary-accent" /> Perform Operations & Convert Bases
        </h2>

        {/* Input 1 */}
        <div className="mb-4">
          <label htmlFor="input1" className="block text-white-700  text-sm font-bold mb-2">
            Number 1:
          </label>
          <div className="flex">
            <input
              type="text"
              id="input1"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              className="shadow appearance-none bg-dark-bg-secondary rounded-l w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-white-800  dark:border-white-600"
              placeholder="Enter number"
            />
            <select
              value={base1}
              onChange={(e) => setBase1(e.target.value as Base)}
              className="text-purple-100 bg-dark-bg-secondary rounded-r py-2 px-3 leading-tight"
            >
              <option value="decimal">Decimal</option>
              <option value="binary">Binary</option>
              <option value="hex">Hexadecimal</option>
              <option value="octal">Octal</option>
            </select>
          </div>
        </div>

        {/* Operation Selector */}
        <div className="mb-4 ">
          <label htmlFor="operation" className="block text-white-700  text-sm font-bold mb-2">
            Operation:
          </label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value as Operation)}
            className="shadow bg-dark-bg-secondary rounded w-full py-2 px-3 text-purple-100 leading-tight focus:outline-none focus:shadow-outline dark:bg-white-800  dark:border-white-600"
          >
            <option value="">(Conversion only)</option>
            <option value="+">Add (+)</option>
            <option value="-">Subtract (-)</option>
            <option value="*">Multiply (*)</option>
            <option value="/">Divide (/)</option>
            <option value="&">Bitwise AND (&)</option>
            <option value="|">Bitwise OR (|)</option>
            <option value="^">Bitwise XOR (^)</option>
            <option value="<<">Left Shift (&lt;&lt;)</option>
            <option value=">>">Right Shift (&gt;&gt;)</option>
          </select>
        </div>

        {/* Input 2 */}
        <div className="mb-6">
          <label htmlFor="input2" className="block text-white-700  text-sm font-bold mb-2">
            Number 2 (if operation selected):
          </label>
          <div className="flex">
            <input
              type="text"
              id="input2"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              disabled={!operation}
              className="shadow appearance-none bg-dark-bg-secondary rounded-l w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-white-200 disabled:dark:bg-white-900 disabled:opacity-70 dark:bg-white-800  dark:border-white-600"
              placeholder="Enter number"
            />
            <select
              value={base2}
              onChange={(e) => setBase2(e.target.value as Base)}
              disabled={!operation}
              className="text-purple-100 bg-dark-bg-secondary rounded-r py-2 px-3 leading-tight"
            >
              <option value="decimal">Decimal</option>
              <option value="binary">Binary</option>
              <option value="hex">Hexadecimal</option>
              <option value="octal">Octal</option>
            </select>
          </div>
        </div>

        {/* Results Display */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white-700  mb-4">Results</h2>
          {error ? (
            <p className="text-error-red font-medium">{error}</p>
          ) : (
            decimalResult !== null && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white-700 ">
                <div>
                  <span className="font-semibold">Decimal:</span>{' '}
                  <span className="font-mono text-primary-accent text-lg">{decimalResult}</span>
                </div>
                <div>
                  <span className="font-semibold">Binary:</span>{' '}
                  <span className="font-mono text-secondary-accent text-lg">{binaryResult}</span>
                </div>
                <div>
                  <span className="font-semibold">Hexadecimal:</span>{' '}
                  <span className="font-mono text-primary-accent text-lg">{hexResult}</span>
                </div>
                <div>
                  <span className="font-semibold">Octal:</span>{' '}
                  <span className="font-mono text-secondary-accent text-lg">{octalResult}</span>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}