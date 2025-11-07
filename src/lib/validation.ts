/**
 * Comprehensive validation utilities for forms and data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

export interface BusinessFormData {
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string;
  description: string;
  listingType: 'basic' | 'featured';
  agreeToTerms: boolean;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (US format)
 */
export const validatePhone = (phone: string): boolean => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  // Check for 10 or 11 digits (with or without country code)
  return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate ZIP code (US format)
 */
export const validateZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

/**
 * Validate state (US states)
 */
export const validateState = (state: string): boolean => {
  const validStates = [
    'texas', 'tx', 'louisiana', 'la', 'mississippi', 'ms', 
    'alabama', 'al', 'florida', 'fl'
  ];
  return validStates.includes(state.toLowerCase());
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validate business name for duplicates
 */
export const validateBusinessNameUnique = async (businessName: string, city: string, state: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/businesses?name=${encodeURIComponent(businessName)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`);
    const data = await response.json();
    
    if (data.success && data.businesses) {
      // Check if any existing business has the same name in the same city/state
      const duplicate = data.businesses.find((business: any) => 
        business.name.toLowerCase() === businessName.toLowerCase() &&
        business.city.toLowerCase() === city.toLowerCase() &&
        business.state.toLowerCase() === state.toLowerCase()
      );
      return !duplicate;
    }
    
    return true; // Assume unique if we can't check
  } catch {
    return true; // Assume unique if validation fails
  }
};

/**
 * Comprehensive business form validation
 */
export const validateBusinessForm = async (formData: BusinessFormData): Promise<ValidationResult> => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // Required field validation
  if (!formData.businessName.trim()) {
    errors.businessName = 'Business name is required';
  } else if (formData.businessName.length < 2) {
    errors.businessName = 'Business name must be at least 2 characters';
  } else if (formData.businessName.length > 100) {
    errors.businessName = 'Business name must be less than 100 characters';
  }

  if (!formData.businessType.trim()) {
    errors.businessType = 'Business type is required';
  }

  if (!formData.contactName.trim()) {
    errors.contactName = 'Contact name is required';
  } else if (formData.contactName.length < 2) {
    errors.contactName = 'Contact name must be at least 2 characters';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid US phone number';
  }

  if (!formData.address.trim()) {
    errors.address = 'Business address is required';
  } else if (formData.address.length < 5) {
    errors.address = 'Please enter a complete address';
  }

  if (!formData.city.trim()) {
    errors.city = 'City is required';
  } else if (formData.city.length < 2) {
    errors.city = 'City name must be at least 2 characters';
  }

  if (!formData.state.trim()) {
    errors.state = 'State is required';
  } else if (!validateState(formData.state)) {
    errors.state = 'Please select a valid Gulf Coast state (TX, LA, MS, AL, FL)';
  }

  if (!formData.zipCode.trim()) {
    errors.zipCode = 'ZIP code is required';
  } else if (!validateZipCode(formData.zipCode)) {
    errors.zipCode = 'Please enter a valid ZIP code (12345 or 12345-6789)';
  }

  if (!formData.description.trim()) {
    errors.description = 'Business description is required';
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (formData.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions';
  }

  // Optional field validation
  if (formData.website && formData.website.trim()) {
    if (!validateUrl(formData.website)) {
      errors.website = 'Please enter a valid website URL';
    }
  }

  // Business-specific validation
  if (formData.businessName && formData.city && formData.state) {
    const isUnique = await validateBusinessNameUnique(formData.businessName, formData.city, formData.state);
    if (!isUnique) {
      errors.businessName = 'A business with this name already exists in this city';
    }
  }

  // Warnings (non-blocking)
  if (formData.businessName && /\d{3,}/.test(formData.businessName)) {
    warnings.businessName = 'Business name contains many numbers - is this correct?';
  }

  if (formData.description && formData.description.length < 50) {
    warnings.description = 'A longer description helps customers understand your business better';
  }

  if (!formData.website || !formData.website.trim()) {
    warnings.website = 'Adding a website URL can increase customer engagement';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};

/**
 * Real-time field validation for better UX
 */
export const validateField = (fieldName: keyof BusinessFormData, value: any): string | null => {
  switch (fieldName) {
    case 'email':
      if (value && !validateEmail(value)) {
        return 'Invalid email format';
      }
      break;
    
    case 'phone':
      if (value && !validatePhone(value)) {
        return 'Invalid phone number format';
      }
      break;
    
    case 'website':
      if (value && value.trim() && !validateUrl(value)) {
        return 'Invalid website URL';
      }
      break;
    
    case 'zipCode':
      if (value && !validateZipCode(value)) {
        return 'Invalid ZIP code format';
      }
      break;
    
    case 'state':
      if (value && !validateState(value)) {
        return 'Please select a Gulf Coast state';
      }
      break;
    
    default:
      break;
  }
  
  return null;
};

/**
 * Format input values
 */
export const formatters = {
  phone: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  },

  zipCode: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
    }
    return digits;
  },

  website: (value: string): string => {
    if (value && !value.startsWith('http')) {
      return `https://${value}`;
    }
    return value;
  }
};

