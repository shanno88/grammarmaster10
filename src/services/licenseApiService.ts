const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface VerifyLicenseParams {
  machineId: string;
  code: string;
}

interface VerifyLicenseResponse {
  success: boolean;
  valid?: boolean;
  type?: 'subscription' | 'lifetime';
  expireDate?: string;
  reason?: 'expired' | 'invalid';
  error?: string;
}

interface License {
  id: string;
  machineId: string;
  email: string;
  code: string;
  type: 'subscription' | 'lifetime';
  expireDate: string | null;
  paddleCustomerId: string | null;
  paddleTransactionId: string | null;
  subscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

interface GetLicenseResponse {
  success: boolean;
  license?: License;
  licenses?: License[];
  error?: string;
}

export const LicenseApiService = {
  async verifyLicense(params: VerifyLicenseParams): Promise<VerifyLicenseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/licenses/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Verify license error:', error);
      return { success: false, error: error.message };
    }
  },

  async getLicenseById(id: string): Promise<GetLicenseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/licenses/${id}`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Get license error:', error);
      return { success: false, error: error.message };
    }
  },

  async getLicensesByMachineId(machineId: string): Promise<GetLicenseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/licenses/machine/${machineId}`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Get licenses by machineId error:', error);
      return { success: false, error: error.message };
    }
  },

  async getLicenseByEmail(email: string): Promise<GetLicenseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/licenses/email/${email}`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Get license by email error:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllLicenses(): Promise<GetLicenseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/licenses/list`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Get all licenses error:', error);
      return { success: false, error: error.message };
    }
  },

  async regenerateLicense(id: string): Promise<GetLicenseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/licenses/${id}/regenerate`, {
        method: 'POST',
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Regenerate license error:', error);
      return { success: false, error: error.message };
    }
  }
};
