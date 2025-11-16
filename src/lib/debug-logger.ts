/**
 * Debug Logger Utility
 * 
 * Provides centralized logging for authentication and API flow debugging
 * Can be enabled/disabled based on environment variables
 */

// Control debug logging with environment variables
const DEBUG_ENABLED = process.env.NEXT_PUBLIC_DEBUG_ENABLED === 'true';
const AUTH_DEBUG_ENABLED = process.env.NEXT_PUBLIC_AUTH_DEBUG_ENABLED === 'true';

// Debug log levels
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  AUTH = 'AUTH',
  API = 'API',
  CHECKOUT = 'CHECKOUT'
}

// Helper to format log entries
const formatLogEntry = (level: LogLevel, message: string, data?: any): string => {
  const timestamp = new Date().toISOString();
  const dataString = data ? `\n${JSON.stringify(data, null, 2)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataString}`;
};

// Main debug logger function
export const debugLog = (level: LogLevel, message: string, data?: any): void => {
  // Skip logging if debugging is disabled
  if (!DEBUG_ENABLED) {
    return;
  }

  // Skip auth logs if auth debugging specifically disabled
  if (level === LogLevel.AUTH && !AUTH_DEBUG_ENABLED) {
    return;
  }

  const logEntry = formatLogEntry(level, message, data);
  
  switch (level) {
    case LogLevel.ERROR:
      console.error(logEntry);
      break;
    case LogLevel.WARN:
      console.warn(logEntry);
      break;
    default:
      console.log(logEntry);
  }
};

// Authentication specific logging
export const logAuthEvent = (stage: string, token?: string, headers?: Record<string, string>): void => {
  if (!DEBUG_ENABLED || !AUTH_DEBUG_ENABLED) return;
  
  const tokenInfo = token ? {
    tokenLength: token.length,
    tokenStart: token.substring(0, 10) + '...',
    tokenFormat: token.startsWith('Bearer ') ? 'Bearer prefix' : 'Raw token'
  } : { tokenStatus: 'No token provided' };

  debugLog(
    LogLevel.AUTH, 
    `Authentication at ${stage}`, 
    {
      ...tokenInfo,
      headers: headers || 'No headers provided',
      timestamp: new Date().toISOString()
    }
  );
};

// API call logging
export const logApiCall = (
  endpoint: string, 
  method: string, 
  requestData?: any,
  responseStatus?: number,
  responseData?: any,
  error?: any
): void => {
  if (!DEBUG_ENABLED) return;
  
  const apiInfo = {
    endpoint,
    method,
    requestData: requestData || 'No request data',
    ...(responseStatus ? { responseStatus } : {}),
    ...(responseData ? { responseData } : {}),
    ...(error ? { error: typeof error === 'object' ? error.message : error } : {})
  };

  debugLog(LogLevel.API, `API call to ${endpoint}`, apiInfo);
};

// Checkout flow specific logging
export const logCheckoutStep = (
  step: string,
  stepNumber: number,
  status: 'start' | 'complete' | 'error',
  data?: any
): void => {
  if (!DEBUG_ENABLED) return;
  
  debugLog(
    LogLevel.CHECKOUT,
    `Checkout Step ${stepNumber}: ${step} - ${status.toUpperCase()}`,
    data
  );
};

// Export a checkout flow tracker
export class CheckoutFlowTracker {
  private steps: Array<{
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    startTime?: Date;
    endTime?: Date;
    data?: any;
    error?: any;
  }> = [];

  constructor() {
    // Initialize standard checkout steps
    this.steps = [
      { name: 'Initialize checkout', status: 'pending' },
      { name: 'Create shipping address', status: 'pending' },
      { name: 'Create payment intent', status: 'pending' },
      { name: 'Process payment method', status: 'pending' },
      { name: 'Create order with payment', status: 'pending' },
      { name: 'Finalize order', status: 'pending' }
    ];
  }

  startStep(stepIndex: number, data?: any): void {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return;
    
    this.steps[stepIndex].status = 'in_progress';
    this.steps[stepIndex].startTime = new Date();
    this.steps[stepIndex].data = data;
    
    debugLog(
      LogLevel.CHECKOUT,
      `STARTED: Step ${stepIndex + 1} - ${this.steps[stepIndex].name}`,
      data
    );
  }

  completeStep(stepIndex: number, resultData?: any): void {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return;
    
    this.steps[stepIndex].status = 'completed';
    this.steps[stepIndex].endTime = new Date();
    this.steps[stepIndex].data = resultData;
    
    // Calculate duration
    const start = this.steps[stepIndex].startTime;
    const end = this.steps[stepIndex].endTime;
    const durationMs = start && end ? end.getTime() - start.getTime() : 0;
    
    debugLog(
      LogLevel.CHECKOUT,
      `COMPLETED: Step ${stepIndex + 1} - ${this.steps[stepIndex].name} (${durationMs}ms)`,
      resultData
    );
  }

  errorStep(stepIndex: number, error: any): void {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return;
    
    this.steps[stepIndex].status = 'error';
    this.steps[stepIndex].endTime = new Date();
    this.steps[stepIndex].error = error;
    
    debugLog(
      LogLevel.ERROR,
      `ERROR: Step ${stepIndex + 1} - ${this.steps[stepIndex].name}`,
      { error: typeof error === 'object' ? error.message : error }
    );
  }

  getSummary(): any {
    return {
      steps: this.steps.map((step, index) => ({
        stepNumber: index + 1,
        name: step.name,
        status: step.status,
        duration: step.startTime && step.endTime 
          ? `${step.endTime.getTime() - step.startTime.getTime()}ms`
          : 'N/A'
      })),
      completedSteps: this.steps.filter(s => s.status === 'completed').length,
      totalSteps: this.steps.length,
      hasErrors: this.steps.some(s => s.status === 'error')
    };
  }
}
