import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { QrReader } from 'react-qr-reader';

interface ScannerCameraProps {
  onScan: (result: any) => void;
  onError: (error: any) => void;
}

const ScannerCamera: React.FC<ScannerCameraProps> = ({ onScan, onError }) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      console.log("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 640 }
        } 
      });
      
      console.log("Camera permission granted");
      setPermissionGranted(true);
      setCameraError(null);
      
      // Stop the stream since QrReader will create its own
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error("Camera permission denied:", error);
      setPermissionGranted(false);
      setCameraError(error.message || "Camera access denied. Please allow camera access and try again.");
      onError(error);
    }
  };

  const handleScan = (result: any, error: any) => {
    console.log("QrReader onResult called", { result, error });
    
    if (error) {
      console.error("QR scanning error:", error);
      if (error.name !== 'NotFoundException' && error.name !== 'NotFoundError') {
        setCameraError(error?.message || "Camera error occurred");
        onError(error);
      }
      return;
    }

    if (result && !hasScannedRef.current) {
      console.log("QR Code detected:", result.text);
      hasScannedRef.current = true;
      onScan(result.text);
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
        {/* Permission request screen */}
        {permissionGranted === null && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Requesting camera access...</p>
            </div>
          </div>
        )}

        {/* Permission denied screen */}
        {permissionGranted === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center p-4">
              <div className="text-red-500 text-sm mb-2">Camera Access Required</div>
              <p className="text-xs text-gray-600 mb-3">
                Please allow camera access to scan QR codes. 
                Click the camera icon in your browser's address bar or try the button below.
              </p>
              <button 
                onClick={requestCameraPermission}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Request Camera Access
              </button>
            </div>
          </div>
        )}

        {/* Camera error screen */}
        {cameraError && permissionGranted !== false && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center p-4">
              <div className="text-red-500 text-sm mb-2">Camera Error</div>
              <p className="text-xs text-gray-600 mb-3">{cameraError}</p>
              <button 
                onClick={() => {
                  console.log("Retry button clicked");
                  setCameraError(null);
                  setCameraReady(false);
                  hasScannedRef.current = false;
                  requestCameraPermission();
                }}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* QR Reader - only show when permission is granted */}
        {permissionGranted === true && !cameraError && (
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
        
        {/* Instruction text */}
        {permissionGranted === true && !cameraError && cameraReady && (
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