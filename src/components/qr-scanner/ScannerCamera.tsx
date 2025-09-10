import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';

interface ScannerCameraProps {
  onScan: (result: any) => void;
  onError: (error: any) => void;
}

const ScannerCamera: React.FC<ScannerCameraProps> = ({ onScan, onError }) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("ScannerCamera component mounted");
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = () => {
    if (!scannerDivRef.current) return;
    
    try {
      console.log("Starting HTML5 QR code scanner...");
      
      scannerRef.current = new Html5QrcodeScanner(
        "qr-scanner-div",
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
        },
        false
      );

      scannerRef.current.render(
        (decodedText, decodedResult) => {
          console.log("QR Code detected:", decodedText);
          onScan(decodedText);
          setCameraReady(true);
          setCameraError(null);
        },
        (error) => {
          // Only log actual errors, not "NotFoundException" which is normal
          if (!error.includes('NotFoundException')) {
            console.error("QR scanning error:", error);
          }
        }
      );
      
      setCameraReady(true);
      setCameraError(null);
    } catch (error: any) {
      console.error("Failed to start QR scanner:", error);
      setCameraError(error.message || "Scanner initialization failed");
      onError(error);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      console.log("Stopping QR code scanner...");
      try {
        if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.clear();
        }
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
      scannerRef.current = null;
    }
  };


  return (
    <motion.div 
      key="scanner"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="aspect-square w-full max-w-[320px] max-h-[320px] overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl bg-white relative"
    >
      <div className="relative h-full w-full">
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="text-red-500 text-sm mb-2">Scanner Error</div>
              <p className="text-xs text-gray-600">{cameraError}</p>
              <button 
                onClick={startScanner}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <div 
          ref={scannerDivRef}
          id="qr-scanner-div"
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
};

export default ScannerCamera;