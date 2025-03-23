'use client';

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface BookingDetails {
  bookingId: string;
  location: string;
  slot: string;
  date: string;
  time: string;
  status: string;
  checkInCode: string;
}

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState<BookingDetails | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error(err));
      }
    };
  }, []);

  const startScanner = () => {
    setIsScanning(true);
    setCheckInStatus(null);
    setScanResult(null);

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const scannerContainer = document.getElementById('scanner-container');
    
    if (!scannerContainer) return;

    scannerRef.current = new Html5Qrcode('scanner-container');
    
    scannerRef.current.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    ).catch(err => {
      console.error("Error starting scanner:", err);
      setIsScanning(false);
    });
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(err => console.error(err));
    }
    setIsScanning(false);
  };

  const onScanSuccess = (decodedText: string) => {
    stopScanner();
    
    try {
      const bookingDetails = JSON.parse(decodedText) as BookingDetails;
      setScanResult(bookingDetails);
      
      // Simulate an API call to check in
      simulateCheckIn(bookingDetails);
    } catch (err) {
      console.error("Error parsing QR code data:", err);
      setCheckInStatus('error');
    }
  };

  const onScanFailure = (error: any) => {
    // Silent failures are better for scanning attempts
    console.warn("QR Code scan error:", error);
  };

  const simulateCheckIn = (bookingDetails: BookingDetails) => {
    setCheckInStatus('pending');
    
    // Simulate API call delay
    setTimeout(() => {
      if (bookingDetails.bookingId) {
        setCheckInStatus('success');
        // In a real app, you'd send this to your backend
        console.log('Check-in successful for booking:', bookingDetails.bookingId);
      } else {
        setCheckInStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Check-in Scanner</h2>

      <div id="scanner-container" className={`w-full h-64 bg-gray-100 flex items-center justify-center mb-4 rounded-lg overflow-hidden ${isScanning ? 'block' : 'hidden'}`}>
        {!isScanning && (
          <div className="text-gray-500">Scanner will appear here</div>
        )}
      </div>

      {!isScanning && !scanResult && (
        <button
          onClick={startScanner}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Start Check-in Scanner
        </button>
      )}

      {isScanning && (
        <button
          onClick={stopScanner}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Cancel Scanning
        </button>
      )}

      {scanResult && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Booking Information</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Booking ID:</div>
            <div>{scanResult.bookingId}</div>
            
            <div className="font-medium">Location:</div>
            <div>{scanResult.location} (Slot {scanResult.slot})</div>
            
            <div className="font-medium">Date:</div>
            <div>{scanResult.date}</div>
            
            <div className="font-medium">Time:</div>
            <div>{scanResult.time}</div>
            
            <div className="font-medium">Check-in Code:</div>
            <div>{scanResult.checkInCode}</div>
          </div>
          
          <div className="mt-4">
            {checkInStatus === 'pending' && (
              <div className="flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-md">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing check-in...
              </div>
            )}
            
            {checkInStatus === 'success' && (
              <div className="p-2 bg-green-50 text-green-600 rounded-md text-center">
                ✅ Check-in successful!
              </div>
            )}
            
            {checkInStatus === 'error' && (
              <div className="p-2 bg-red-50 text-red-600 rounded-md text-center">
                ❌ Check-in failed. Please try again.
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              setScanResult(null);
              setCheckInStatus(null);
            }}
            className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Scan Another QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner; 