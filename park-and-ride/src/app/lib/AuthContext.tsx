'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Create a mock user type that mimics Firebase User
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

// Mock user credentials including password
interface MockUserWithCredentials {
  email: string;
  password: string;
  uid: string;
  displayName: string | null;
  emailVerified: boolean;
}

// Default mock user
const defaultMockUsers: MockUserWithCredentials[] = [
  {
    email: 'test@example.com',
    password: 'password123',
    uid: 'user-123',
    displayName: 'Test User',
    emailVerified: true
  }
];

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
}

// Default context value
const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  error: null,
  setError: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mockUsers, setMockUsers] = useState<MockUserWithCredentials[]>(defaultMockUsers);

  // Load mock users from localStorage on initialization
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('auth_user');
      }
    }

    // Load registered users from localStorage
    const savedMockUsers = localStorage.getItem('mock_users');
    if (savedMockUsers) {
      try {
        const parsedUsers = JSON.parse(savedMockUsers);
        setMockUsers(parsedUsers);
      } catch (e) {
        console.error('Failed to parse saved mock users', e);
        // Fallback to default mock users
        localStorage.setItem('mock_users', JSON.stringify(defaultMockUsers));
      }
    } else {
      // Initialize the localStorage with default users if not present
      localStorage.setItem('mock_users', JSON.stringify(defaultMockUsers));
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get the users from localStorage
      const storedUsers = localStorage.getItem('mock_users');
      const currentMockUsers = storedUsers ? JSON.parse(storedUsers) : defaultMockUsers;
      
      // Find user in our mock database
      const foundUser = currentMockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('auth/invalid-credential');
      }
      
      const userObj: MockUser = {
        uid: foundUser.uid,
        email: foundUser.email,
        displayName: foundUser.displayName,
        emailVerified: foundUser.emailVerified
      };
      
      // Save to localStorage to persist login
      localStorage.setItem('auth_user', JSON.stringify(userObj));
      setUser(userObj);
    } catch (error: any) {
      console.error('Error signing in:', error);
      let errorMessage = 'Failed to sign in';
      
      if (error.message === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get current users from localStorage
      const storedUsers = localStorage.getItem('mock_users');
      const currentMockUsers = storedUsers ? JSON.parse(storedUsers) : defaultMockUsers;
      
      // Check if user already exists
      if (currentMockUsers.some(u => u.email === email)) {
        throw new Error('auth/email-already-in-use');
      }
      
      // Create new mock user
      const displayName = name || email.split('@')[0];
      const newUser = {
        email,
        password,
        uid: `user-${Math.random().toString(36).substring(2, 9)}`,
        displayName,
        emailVerified: false
      };
      
      // Add to mock database and save to localStorage
      const updatedUsers = [...currentMockUsers, newUser];
      localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
      setMockUsers(updatedUsers);
      
      const userObj: MockUser = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        emailVerified: newUser.emailVerified
      };
      
      // Save to localStorage to persist login
      localStorage.setItem('auth_user', JSON.stringify(userObj));
      setUser(userObj);
    } catch (error: any) {
      console.error('Error signing up:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.message === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from localStorage
      localStorage.removeItem('auth_user');
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get current users from localStorage
      const storedUsers = localStorage.getItem('mock_users');
      const currentMockUsers = storedUsers ? JSON.parse(storedUsers) : defaultMockUsers;
      
      // Check if user exists
      const foundUser = currentMockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('auth/user-not-found');
      }
      
      console.log(`Mock password reset email sent to ${email}`);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      let errorMessage = 'Failed to send password reset email';
      
      if (error.message === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      error,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 