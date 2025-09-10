import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { QrReader } from 'react-qr-reader';

interface ScannerCameraProps {
  onScan: (result: any) => void;
  onError: (error: any) => void;
}

const ScannerCamera: React.FC<ScannerCameraProps> = ({ onScan, onError }) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const hasScannedRef = useRef(false);

  const handleScan = (result: any, error: any) => {
    console.log("QrReader onResult called", { result, error });
    
    if (error) {
      console.error("QR scanning error:", error);
      if (error.name !== 'NotFoundException') {
        setCameraError(error?.message || "Camera error occurred");
        onError(error);
      }
      return;
    }

    if (result && !hasScannedRef.current) {
      console.log("QR Code detected:", result.text);
      hasScannedRef.current = true;
      onScan(result.text);
      // Reset the flag after a delay to allow for re-scanning
      setTimeout(() => {
        hasScannedRef.current = false;
      }, 2000);
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
        {/* Debug info */}
        <div className="absolute top-2 left-2 z-20 bg-black/50 text-white text-xs p-1 rounded">
          Ready: {cameraReady ? 'Yes' : 'No'} | Error: {cameraError ? 'Yes' : 'No'}
        </div>

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="text-red-500 text-sm mb-2">Camera Error</div>
              <p className="text-xs text-gray-600">{cameraError}</p>
              <button 
                onClick={() => {
                  console.log("Retry button clicked");
                  setCameraError(null);
                  setCameraReady(false);
                  hasScannedRef.current = false;
                }}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {!cameraError && (
          <>
            <div className="w-full h-full">
              <QrReader
                onResult={handleScan}
                constraints={{
                  facingMode: 'environment'
                }}
                videoStyle={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                containerStyle={{
                  width: '100%',
                  height: '100%'
                }}
                ViewFinder={() => {
                  console.log("ViewFinder rendered, setting camera ready");
                  if (!cameraReady) setCameraReady(true);
                  return (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="relative w-3/4 h-3/4 border-2 border-dashed border-white/80 rounded-lg">
                          {/* Corner markers */}
                          <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-white"></div>
                          <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-white"></div>
                          <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-white"></div>
                          <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-white"></div>
                          
                          {/* Scanning effect */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-white/60 animate-[scan_2s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </>
        )}
        
        {/* Simple instruction text */}
        {!cameraError && cameraReady && (
          <div className="absolute bottom-4 left-0 right-0 text-center z-10">
            <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full mx-auto inline-block">
              Point camera at QR code
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ScannerCamera;