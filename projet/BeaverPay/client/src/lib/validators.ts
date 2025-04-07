import { z } from 'zod';
import { paymentFormSchema } from '@shared/schema';

// Credit card number validator (Luhn algorithm)
export function validateCardNumber(number: string): boolean {
  const digits = number.replace(/\D/g, '');
  
  if (digits.length < 12 || digits.length > 19) {
    return false;
  }
  
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost side
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
}

// Credit card expiry validator
export function validateCardExpiry(expiry: string): boolean {
  const [monthStr, yearStr] = expiry.split('/');
  
  if (!monthStr || !yearStr) {
    return false;
  }
  
  const month = parseInt(monthStr, 10);
  const year = parseInt('20' + yearStr, 10);
  
  // Check if month and year are valid numbers
  if (isNaN(month) || isNaN(year)) {
    return false;
  }
  
  // Check if month is between 1 and 12
  if (month < 1 || month > 12) {
    return false;
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Check if the card is not expired
  return (year > currentYear || (year === currentYear && month >= currentMonth));
}

// Format card number with spaces
export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
}

// Format card expiry date (MM/YY)
export function formatExpiryDate(value: string): string {
  const v = value.replace(/\D/g, '');
  
  if (v.length >= 3) {
    return v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  
  return v;
}

// Extended payment form schema with custom validators
export const extendedPaymentFormSchema = paymentFormSchema.extend({
  cardNumber: z.string()
    .min(16, { message: "Numéro de carte invalide" })
    .refine((val) => validateCardNumber(val), {
      message: "Numéro de carte invalide"
    }),
  cardExpiry: z.string()
    .min(5, { message: "Date d'expiration invalide" })
    .refine((val) => validateCardExpiry(val), {
      message: "Date d'expiration invalide ou expirée"
    }),
});
