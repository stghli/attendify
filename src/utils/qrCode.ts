// Standardized QR code format for the school management system
export interface QRCodeData {
  type: 'school-attendance';
  user_id: string;
  user_role: 'student' | 'teacher';
  user_name: string;
  generated_at: string;
}

export const generateQRCodeData = (
  userId: string,
  userRole: 'student' | 'teacher',
  userName: string
): string => {
  const qrData: QRCodeData = {
    type: 'school-attendance',
    user_id: userId,
    user_role: userRole,
    user_name: userName,
    generated_at: new Date().toISOString(),
  };
  
  return JSON.stringify(qrData);
};

export const parseQRCodeData = (qrString: string): QRCodeData | null => {
  try {
    // Try parsing as JSON first (new format)
    const parsed = JSON.parse(qrString);
    if (parsed.type === 'school-attendance' && parsed.user_id && parsed.user_role) {
      return parsed as QRCodeData;
    }
  } catch {
    // If JSON parsing fails, try legacy formats
    
    // Legacy format: "role-id-qr" (e.g., "student-123-qr")
    const legacyMatch = qrString.match(/^(student|teacher)-(.+)-qr$/);
    if (legacyMatch) {
      return {
        type: 'school-attendance',
        user_id: legacyMatch[2],
        user_role: legacyMatch[1] as 'student' | 'teacher',
        user_name: 'Unknown', // We'll need to fetch this from the database
        generated_at: new Date().toISOString(),
      };
    }
    
    // Simple user ID format
    if (qrString.length > 0 && qrString.length < 50) {
      return {
        type: 'school-attendance',
        user_id: qrString,
        user_role: 'student', // Default assumption
        user_name: 'Unknown',
        generated_at: new Date().toISOString(),
      };
    }
  }
  
  return null;
};