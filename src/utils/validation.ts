import { z } from 'zod';

/**
 * Input validation schemas for secure data handling
 */

// Phone number validation (basic international format)
export const phoneNumberSchema = z.string()
  .trim()
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number must be less than 20 characters')
  .regex(/^[+]?[\d\s()-]+$/, 'Phone number contains invalid characters');

// SMS message validation
export const smsMessageSchema = z.string()
  .trim()
  .min(1, 'Message cannot be empty')
  .max(1000, 'Message must be less than 1000 characters');

// Student name validation
export const studentNameSchema = z.string()
  .trim()
  .min(1, 'Name cannot be empty')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters');

// Access code validation
export const accessCodeSchema = z.string()
  .trim()
  .length(4, 'Access code must be exactly 4 digits')
  .regex(/^\d{4}$/, 'Access code must contain only numbers');

/**
 * Sanitize phone number for safe storage and display
 */
export const sanitizePhoneNumber = (phone: string): string => {
  try {
    const validated = phoneNumberSchema.parse(phone);
    // Remove any non-digit characters except +
    return validated.replace(/[^\d+]/g, '');
  } catch {
    throw new Error('Invalid phone number format');
  }
};

/**
 * Sanitize SMS message content
 */
export const sanitizeSmsMessage = (message: string): string => {
  try {
    return smsMessageSchema.parse(message);
  } catch {
    throw new Error('Invalid message content');
  }
};
