/**
 * API Utilities for error handling and retry mechanisms
 */

interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  debug?: any;
}

/**
 * Enhanced fetch with retry logic and better error handling
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<ApiResponse<T>> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = retryOptions;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle API errors (success: false)
      if (data.success === false) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on certain errors
      if (
        lastError.message.includes('404') ||
        lastError.message.includes('401') ||
        lastError.message.includes('403') ||
        lastError.message.includes('400')
      ) {
        break;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Call retry callback
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Wait before retrying
      const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  return {
    success: false,
    error: lastError ? lastError.message : 'Unknown error',
    timestamp: new Date().toISOString()
  };
}

/**
 * Specific API methods for common operations
 */
export const api = {
  // Get businesses with retry
  getBusinesses: async (params: Record<string, string> = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/api/google-data/retrieve?${searchParams.toString()}`, {}, {
      maxRetries: 2,
      onRetry: (attempt, error) => {
        console.warn(`Retrying business fetch (attempt ${attempt}):`, error.message);
      }
    });
  },

  // Get category counts with retry
  getCategoryCounts: async (city?: string, state?: string) => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (state) params.set('state', state);
    
    return apiRequest(`/api/category-counts?${params.toString()}`, {}, {
      maxRetries: 2,
      onRetry: (attempt, error) => {
        console.warn(`Retrying category counts (attempt ${attempt}):`, error.message);
      }
    });
  },

  // Admin operations
  admin: {
    getBusinesses: async () => {
      return apiRequest('/api/admin/businesses', {}, {
        maxRetries: 1,
        onRetry: (attempt, error) => {
          console.warn(`Retrying admin fetch (attempt ${attempt}):`, error.message);
        }
      });
    },

    updateBusiness: async (business: any) => {
      return apiRequest('/api/admin/businesses', {
        method: 'PUT',
        body: JSON.stringify(business),
      }, {
        maxRetries: 1,
        onRetry: (attempt, error) => {
          console.warn(`Retrying business update (attempt ${attempt}):`, error.message);
        }
      });
    }
  }
};

/**
 * Network status detection
 */
export const networkUtils = {
  isOnline: () => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  onNetworkChange: (callback: (isOnline: boolean) => void) => {
    if (typeof window === 'undefined') return () => {};

    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
};

/**
 * Error boundary helper for components
 */
export const handleComponentError = (error: Error, errorInfo: any, componentName: string) => {
  console.error(`Error in ${componentName}:`, error, errorInfo);
  
  // In production, you could send to error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry, LogRocket, etc.
    // errorReportingService.captureException(error, {
    //   extra: errorInfo,
    //   tags: { component: componentName }
    // });
  }
};
