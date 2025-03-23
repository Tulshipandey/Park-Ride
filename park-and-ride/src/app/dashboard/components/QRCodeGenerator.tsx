'use client';

import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface Booking {
  id: string;
  location: string;
  slot: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'completed' | 'active' | 'canceled';
}

interface QRCodeGeneratorProps {
  booking: Booking;
}

const QRCodeGenerator = ({ booking }: QRCodeGeneratorProps) => {
  const [qrGenerated, setQrGenerated] = useState(true); // Default to true so QR is shown immediately
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-generate QR when component mounts
    setQrGenerated(true);
    console.log("QR Code should render for booking:", booking.id);
  }, [booking.id]); // Re-generate when booking changes

  const generateQRData = () => {
    const bookingDetails = {
      bookingId: booking.id,
      location: booking.location,
      slot: booking.slot,
      date: booking.date,
      time: `${booking.startTime} - ${booking.endTime}`,
      status: booking.status,
      checkInCode: `CHECK-${booking.id.split('-')[1]}`,
    };

    return JSON.stringify(bookingDetails);
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) {
      console.error("SVG element not found");
      return;
    }
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }
    
    // Set canvas size to match SVG
    canvas.width = 200;
    canvas.height = 200;
    
    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      
      // Download the image
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `parking-qr-${booking.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Booking QR Code</h2>
      
      {!qrGenerated ? (
        <button 
          onClick={() => setQrGenerated(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Check-in QR Code
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <div ref={qrRef} className="bg-white p-3 border border-gray-200 rounded-lg mb-4">
            <QRCodeSVG
              value={generateQRData()}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <div className="text-sm text-gray-600 mb-4 text-center">
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Location:</strong> {booking.location} (Slot {booking.slot})</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleDownload}
              className="bg-green-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator; 