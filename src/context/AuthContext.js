import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Simulate loading and auto-login for testing
    setTimeout(() => {
      // CHANGE THIS TO TEST DIFFERENT USER TYPES
      const testUserType = 'service-provider'; // Change to 'vehicle-owner' or 'service-provider'
      
      let mockUser;
      if (testUserType === 'vehicle-owner') {
        mockUser = {
          id: 1,
          name: 'Pramudi Gamage',
          email: 'gamage123@gmail.com',
          phone: '077 256 2589',
          address: '27, Galle Road, Dehiwala'
        };
      } else {
        mockUser = {
          id: 2,
          name: 'Sterling AfterCare Centre',
          email: 'sterling@aftercare.com',
          phone: '077 123 4567',
          address: 'Colombo 07'
        };
      }

      setUser(mockUser);
      setUserType(testUserType);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email, password, selectedUserType) => {
    let mockUser;
    if (selectedUserType === 'vehicle-owner') {
      mockUser = {
        id: 1,
        name: 'Pramudi Gamage',
        email: email,
        phone: '077 256 2589'
      };
    } else {
      mockUser = {
        id: 2,
        name: 'Sterling AfterCare Centre',
        email: email,
        phone: '077 123 4567'
      };
    }

    setUser(mockUser);
    setUserType(selectedUserType);
    setIsAuthenticated(true);
    return { success: true };
  };

  const signUp = async (userData) => {
    const mockUser = {
      id: 1,
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    };

    setUser(mockUser);
    setUserType(userData.userType);
    setIsAuthenticated(true);
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isLoading,
      isAuthenticated,
      user,
      userType,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};