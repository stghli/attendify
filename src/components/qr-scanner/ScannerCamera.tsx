import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ScannerCameraProps {
  onScan: (result: any) => void;
  onError: (error: any) => void;
}

const ScannerCamera: React.FC<ScannerCameraProps> = ({ onScan, onError }) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("ScannerCamera component mounted");
    startCamera();
    return () => {
      stopCamera();
      stopScanning();
    };
  }, []);

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
          startScanning();
        };
      }
    } catch (error: any) {
      console.error("Camera access failed:", error);
      setCameraError(error.message || "Camera access denied. Please allow camera access.");
      onError(error);
    }
  };

  const startScanning = () => {
    if (scanIntervalRef.current) return;
    
    console.log("Starting QR code scanning...");
    scanIntervalRef.current = setInterval(() => {
      scanForQRCode();
    }, 500); // Scan every 500ms
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // For now, we'll simulate QR detection by looking for user input
    // In a real implementation, you'd use a QR detection library here
    // This is a placeholder that demonstrates the camera is working
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleManualInput = () => {
    const input = prompt("Enter QR code data for testing:");
    if (input) {
      onScan(input);
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
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 mb-2"
                  >
                    Try Again
                  </button>
                  <br />
                  <button 
                    onClick={handleManualInput}
                    className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                  >
                    Manual Input (for testing)
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
        
        {/* Hidden Canvas for QR Processing */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
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
            <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full mx-auto inline-block mb-2">
              Point camera at QR code
            </div>
            <button 
              onClick={handleManualInput}
              className="bg-white/20 text-white text-xs px-2 py-1 rounded"
            >
              Manual Input
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ScannerCamera;