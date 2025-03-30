import React, { useState } from 'react';
import { loginService } from '../services/login.service';
import { apiService } from '../services/api.service';

const TestApi: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<string>('51');
  const [priceListId, setPriceListId] = useState<string>('1');
  const [companyData, setCompanyData] = useState<any>(null);

  const testValidateUserAndGetCompanies = async () => {
    setLoading(true);
    setResult('Testing ValidateUserAndGetCompanies...');
    
    try {
      const success = await loginService.validateUserAndGetCompanies();
      setResult(prev => prev + `\nValidateUserAndGetCompanies result: ${success ? 'Success' : 'Failed'}`);
      
      if (success) {
        setResult(prev => prev + `\nToken: ${loginService.getToken()}`);
      }
    } catch (error) {
      console.error('Error in testGetMenuCommensal:', error);
      
      // Try to extract more detailed error information
      let errorMessage = 'Unknown error';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error, null, 2);
      } else {
        errorMessage = String(error);
      }
      
      // If it's an axios error, try to get the response data
      if (error && (error as any).response) {
        const axiosError = error as any;
        errorMessage += `\nStatus: ${axiosError.response.status}`;
        errorMessage += `\nStatusText: ${axiosError.response.statusText}`;
        
        if (axiosError.response.data) {
          errorMessage += `\nResponse data: ${JSON.stringify(axiosError.response.data, null, 2)}`;
        }
      }
      
      setResult(prev => prev + `\nError: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetCompanyById = async () => {
    setLoading(true);
    setResult('Testing GetCompanyById...');
    
    try {
      apiService.setHeaders(companyId, "");
      const response = await apiService.getCompanyById(companyId);
      
      // Log all headers to see what's available
      setResult(prev => prev + `\nGetCompanyById response headers: ${JSON.stringify(response.headers, null, 2)}`);
      
      // Specifically check for Authorization header
      if (response.headers && response.headers.authorization) {
        setResult(prev => prev + `\nAuthorization header: ${response.headers.authorization}`);
        
        // Extract token from "Bearer <token>" format if needed
        const authHeader = response.headers.authorization;
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
        
        // Save token
        loginService.saveToken(token);
        setResult(prev => prev + `\nToken saved: ${token.substring(0, 20)}...`);
      }
      
      // Save company data for use in testGetMenuCommensal
      setCompanyData(response.data)
      
      setResult(prev => prev + `\nGetCompanyById result: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error('Error in testGetCompanyById:', error);
      
      // Try to extract more detailed error information
      let errorMessage = 'Unknown error';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error, null, 2);
      } else {
        errorMessage = String(error);
      }
      
      // If it's an axios error, try to get the response data
      if (error && (error as any).response) {
        const axiosError = error as any;
        errorMessage += `\nStatus: ${axiosError.response.status}`;
        errorMessage += `\nStatusText: ${axiosError.response.statusText}`;
        
        if (axiosError.response.data) {
          errorMessage += `\nResponse data: ${JSON.stringify(axiosError.response.data, null, 2)}`;
        }
      }
      
      setResult(prev => prev + `\nError: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetMenuCommensal = async () => {
    setLoading(true);
    setResult('Testing GetMenuCommensal...');
    
    try {
      // Check if we have company data from previous call
      if (!companyData) {
        setResult(prev => prev + '\nNo company data available. Please run "Test GetCompanyById" first.');
        setLoading(false);
        return;
      }
      
      // Set headers with company ID and prefix from the previous step
      apiService.setHeaders(companyData.Company.Id, companyData.Company.Prefix);
      setResult(prev => prev + `\nUsing company data: ID=${companyData.Company.Id}, Prefix=${companyData.Company.Prefix}`);
      
      // Create search parameters with the required parameters
      const searchParams = { 
        PriceListId: parseInt(priceListId),
        OrderTypeId: 1, // Default value for OrderTypeId
        TableId: 0 // Default value for TableId
      };
      
      setResult(prev => prev + `\nCalling getMenuCommensal with params: ${JSON.stringify(searchParams)}`);
      
      const response = await apiService.getMenuCommensal(searchParams);
      setResult(prev => prev + `\nGetMenuCommensal result: ${JSON.stringify(response.data, null, 2).substring(0, 500)}...`);
    } catch (error) {
      console.error('Error in testGetMenuCommensal:', error);
      
      // Try to extract more detailed error information
      let errorMessage = 'Unknown error';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error, null, 2);
      } else {
        errorMessage = String(error);
      }
      
      // If it's an axios error, try to get the response data
      if (error && (error as any).response) {
        const axiosError = error as any;
        errorMessage += `\nStatus: ${axiosError.response.status}`;
        errorMessage += `\nStatusText: ${axiosError.response.statusText}`;
        
        if (axiosError.response.data) {
          errorMessage += `\nResponse data: ${JSON.stringify(axiosError.response.data, null, 2)}`;
        }
      }
      
      setResult(prev => prev + `\nError: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testFullFlow = async () => {
    
    setLoading(true);
    setResult('Testing Full Flow...');
    
    try {
      // Step 1: Validate user and get companies
      setResult(prev => prev + '\nStep 1: Validating user and getting companies...');
      const loginSuccess = await loginService.validateUserAndGetCompanies();
      setResult(prev => prev + `\nValidateUserAndGetCompanies result: ${loginSuccess ? 'Success' : 'Failed'}`);
      
   
      // Step 2: Get company by ID
      setResult(prev => prev + `\nStep 2: Getting company by ID ${companyId}...`);
      apiService.setHeaders(companyId, "");
      const companyResponse = await apiService.getCompanyById(companyId);
      setResult(prev => prev + `\nGetCompanyById result: ${JSON.stringify(companyResponse.data, null, 2)}`);
      
      if (!companyResponse.data) {
        setResult(prev => prev + '\nFailed to get company data, stopping test');
        setLoading(false);
        return;
      }
   
     // Step 3: Get menu commensal
      setResult(prev => prev + `\nStep 3: Getting menu commensal with PriceListId=${priceListId}...`);

      apiService.setHeaders(companyResponse.data.Id, companyResponse.data.Prefix);
      
      const searchParams = { 
        PriceListId: parseInt(priceListId),
        OrderTypeId: 1, // Default value for OrderTypeId
        TableId: 0 // Default value for TableId
      };
      
      setResult(prev => prev + `\nCalling getMenuCommensal with params: ${JSON.stringify(searchParams)}`);
      setResult(prev => prev + `\nHeaders: ${JSON.stringify(apiService['headers'])}`);
      
      const menuResponse = await apiService.getMenuCommensal(searchParams);
      setResult(prev => prev + `\nGetMenuCommensal result: ${JSON.stringify(menuResponse.data, null, 2).substring(0, 500)}...`);
      
      // Simulate loading screen before navigating to product browsing
      setResult(prev => prev + '\nLoading data...');
      setTimeout(() => {
        setResult(prev => prev + '\nFull flow completed successfully! Navigating to product browsing...');
        // Navigate to product browsing screen
        // This would be a navigation action in a real app
      }, 2000);
    } catch (error) {
      console.error('Error in testFullFlow:', error);
      
      // Try to extract more detailed error information
      let errorMessage = 'Unknown error';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error, null, 2);
      } else {
        errorMessage = String(error);
      }
      
      // If it's an axios error, try to get the response data
      if (error && (error as any).response) {
        const axiosError = error as any;
        errorMessage += `\nStatus: ${axiosError.response.status}`;
        errorMessage += `\nStatusText: ${axiosError.response.statusText}`;
        
        if (axiosError.response.data) {
          errorMessage += `\nResponse data: ${JSON.stringify(axiosError.response.data, null, 2)}`;
        }
      }
      
      setResult(prev => prev + `\nError: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Company ID:
          <input 
            type="text" 
            value={companyId} 
            onChange={(e) => setCompanyId(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '20px' }}
          />
        </label>
        
        <label>
          Price List ID:
          <input 
            type="text" 
            value={priceListId} 
            onChange={(e) => setPriceListId(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testValidateUserAndGetCompanies} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test ValidateUserAndGetCompanies
        </button>
        
        <button 
          onClick={testGetCompanyById} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test GetCompanyById
        </button>
        
        <button 
          onClick={testGetMenuCommensal} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test GetMenuCommensal
        </button>
        
        <button 
          onClick={testFullFlow} 
          disabled={loading}
          style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
        >
          Test Full Flow
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Results:</h2>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          maxHeight: '400px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {result || 'No results yet. Click a test button to start.'}
        </pre>
      </div>
    </div>
  );
};

export default TestApi;
