export interface User {
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  is_active: boolean
  is_admin: boolean
  is_verified: boolean
  id: string
  username: string
  full_name: string
  created_at: string
  updated_at: string
  last_login: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string  // Optional as per backend schema
}

export interface LoginData {
  email: string
  password: string
}

const API_BASE_URL = 'https://fastapi.kevinlinportfolio.com/api/v1'

/**
 * Get authentication token - unified function for all API calls
 */
export const getAuthToken = (): string => {
  // First check sessionStorage for test token
  if (typeof window !== 'undefined') {
    // First try to get a test token if one exists
    const testToken = sessionStorage.getItem('test_token');
    if (testToken) {
      console.log('Using test token from sessionStorage');
      return testToken;
    }

    // Otherwise get the real auth token
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    }

    // Fallback to dev auth token if environment allows it
    if (process.env.NEXT_PUBLIC_DEV_AUTH_TOKEN) {
      return process.env.NEXT_PUBLIC_DEV_AUTH_TOKEN;
    }
  }
  
  return '';
};

export class AuthService {
  static async login(data: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    return response.json()
  }

  static async register(data: RegisterData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }

    return response.json()
  }

  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Token refresh failed')
    }

    return response.json()
  }

  static async logout(): Promise<void> {
    const token = this.getToken()
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Logout request failed:', error)
      }
    }
    
    this.clearTokens()
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      console.log('AuthService: Getting token, exists:', !!token)
      return token
    }
    return null
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken')
    }
    return null
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      console.log('AuthService: Setting tokens')
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      console.log('AuthService: Tokens set successfully')
    }
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  static setUser(user: User): void {
    if (typeof window !== 'undefined') {
      console.log('AuthService: Setting user data', user)
      localStorage.setItem('user', JSON.stringify(user))
      console.log('AuthService: User data set successfully')
    }
  }

  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      console.log('AuthService: Getting user, raw data:', userStr)
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          const user = JSON.parse(userStr)
          console.log('AuthService: User data parsed successfully', user)
          return user
        } catch (error) {
          console.error('Error parsing user data:', error)
          // Clear invalid data
          localStorage.removeItem('user')
          return null
        }
      }
      console.log('AuthService: No valid user data found')
    }
    return null
  }

  static isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getUser()
    const result = token !== null && user !== null
    console.log('AuthService: isAuthenticated check - token:', !!token, 'user:', !!user, 'result:', result)
    return result
  }

  static clearCorruptedData(): void {
    if (typeof window !== 'undefined') {
      // Check if any data is corrupted and clear it
      const items = ['token', 'refreshToken', 'user']
      items.forEach(item => {
        const value = localStorage.getItem(item)
        if (value === 'undefined' || value === 'null') {
          localStorage.removeItem(item)
        }
      })
    }
  }
}
