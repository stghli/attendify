import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BrowserMultiFormatReader } from '@zxing/library';

interface ScannerCameraProps {
  onScan: (result: any) => void;
  onError: (error: any) => void;
}

const ScannerCamera: React.FC<ScannerCameraProps> = ({ onScan, onError }) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanningRef = useRef<boolean>(false);

  useEffect(() => {
    console.log("ScannerCamera component mounted");
    codeReaderRef.current = new BrowserMultiFormatReader();
    startCamera();
    return () => {
      stopCamera();
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (cameraReady && !cameraError) {
      // Start scanning when camera is ready
      setTimeout(() => startScanning(), 1000);
    }
  }, [cameraReady, cameraError]);

  const startScanning = async () => {
    if (!codeReaderRef.current || !videoRef.current || scanningRef.current) return;
    
    try {
      scanningRef.current = true;
      console.log("Starting QR code scanning...");
      
      // Use continuous decode instead of decodeFromVideoDevice for better detection
      const decodeLoop = async () => {
        if (!scanningRef.current || !codeReaderRef.current || !videoRef.current) return;
        
        try {
          const result = await codeReaderRef.current.decodeFromVideoElement(videoRef.current);
          if (result) {
            console.log("QR Code detected:", result.getText());
            onScan(result.getText());
            scanningRef.current = false;
            return;
          }
        } catch (error: any) {
          // NotFoundException is normal when no QR code is visible
          if (error.name !== 'NotFoundException') {
            console.error("QR scanning error:", error);
          }
        }
        
        // Continue scanning
        if (scanningRef.current) {
          setTimeout(() => decodeLoop(), 100);
        }
      };
      
      // Start the decode loop
      decodeLoop();
      
    } catch (error) {
      console.error("Failed to start QR scanning:", error);
      scanningRef.current = false;
      setCameraError("Failed to start QR scanning");
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current && scanningRef.current) {
      console.log("Stopping QR code scanning...");
      codeReaderRef.current.reset();
      scanningRef.current = false;
    }
  };

  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 640 }
        } 
      });
      
      console.log("Camera access granted");
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
          setCameraError(null);
        };
      }
    } catch (error: any) {
      console.error("Camera access failed:", error);
      setCameraError(error.message || "Camera access denied. Please allow camera access.");
      onError(error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
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
        {/* Loading/Error States */}
        {(!cameraReady || cameraError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center p-4">
              {cameraError ? (
                <>
                  <div className="text-red-500 text-sm mb-2">Camera Error</div>
                  <p className="text-xs text-gray-600 mb-3">{cameraError}</p>
                  <button 
                    onClick={startCamera}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Starting camera...</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Video Element */}
        <video
          ref={videoRef}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover'
          }}
          autoPlay
          playsInline
          muted
        />
        
        {/* Scanning Overlay */}
        {cameraReady && !cameraError && (
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
        )}
        
        {/* Instructions */}
        {cameraReady && !cameraError && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
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