
import React from "react";
import { QrReader } from "react-qr-reader";
import { motion } from "framer-motion";

interface ScannerCameraProps {
  onScan: (result: any) => void;
  onError: (error: any) => void;
}

const ScannerCamera: React.FC<ScannerCameraProps> = ({ onScan, onError }) => {
  return (
    <motion.div 
      key="scanner"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="aspect-square max-h-[350px] overflow-hidden rounded-xl border shadow-inner"
    >
      <div className="relative h-full w-full">
        <QrReader
          constraints={{ facingMode: "environment" }}
          scanDelay={500}
          onResult={onScan}
          videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
          containerStyle={{ width: '100%', height: '100%' }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="border-2 border-white/80 rounded-lg w-full h-full flex items-center justify-center">
              <div className="relative w-3/4 h-3/4 border-2 border-dashed border-primary/80 rounded-lg">
                {/* Corner markers */}
                <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-primary"></div>
                
                {/* Scanning effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/60 animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScannerCamera;
