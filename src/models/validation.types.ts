/**
 * TypeScript interface for ValidationResult from .NET backend
 * Using PascalCase to match the .NET naming convention
 */
export interface ValidationResult {
  ErrorMessages: string[];
  HasErrors: boolean;
  WarningsMessages: string[];
  HasWarnings: boolean;
  ConfirmMessages: string[];
  HasConfirm: boolean;

  // Helper methods
  GetConfirmMessages?: () => string;
  GetErrorMessages?: () => string;
  GetWarningsMessages?: () => string;
}

/**
 * TypeScript interface for MercadoPagoPreferenceResultVM from .NET backend
 */
export interface MercadoPagoPreferenceResultVM {
  ValidationResult: ValidationResult;
  PreferenceId: string;
  PreferenceInitPoint: string;
}

/**
 * Generic interface for API responses that may contain ValidationResult
 */
export interface ApiResponseWithValidation<T = any> {
  ValidationResult?: ValidationResult;
  [key: string]: any;
}

/**
 * Helper function to process API responses and handle ValidationResult if present
 * @param response The API response to process
 * @returns The processed response with properly typed ValidationResult
 */
export function processApiResponse<T>(response: any): T {
  if (response && response.ValidationResult) {
    // Ensure all ValidationResult properties exist
    const validationResult: ValidationResult = {
      ErrorMessages: response.ValidationResult.ErrorMessages || [],
      HasErrors: response.ValidationResult.HasErrors || false,
      WarningsMessages: response.ValidationResult.WarningsMessages || [],
      HasWarnings: response.ValidationResult.HasWarnings || false,
      ConfirmMessages: response.ValidationResult.ConfirmMessages || [],
      HasConfirm: response.ValidationResult.HasConfirm || false,
      
      // Add helper methods
      GetConfirmMessages: () => response.ValidationResult.ConfirmMessages?.join('. ') || '',
      GetErrorMessages: () => response.ValidationResult.ErrorMessages?.join('. ') || '',
      GetWarningsMessages: () => response.ValidationResult.WarningsMessages?.join('. ') || '',
    };
    
    // Replace the original ValidationResult with our processed one
    response.ValidationResult = validationResult;
  }
  
  return response as T;
}
