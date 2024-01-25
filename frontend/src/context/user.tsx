import React, { useState, createContext, ReactNode, useContext } from "react";

export interface IConfiguration {
    id: string
    type: string
    shortname: string
    name: string
    value: number
    isPercentage: boolean
    calculatedPrice: number
}

export interface User {
    id: string
    name: string
    age: number
    city: String
    vehiclePower: number
    voucher: number
    basePrice: number
    totalPrice: number
    selectedCoverages: Array<IConfiguration>
    selectedDiscounts: Array<IConfiguration>
}
  
  interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
  }


  const UserContext = createContext<UserContextType | undefined>(undefined);
  
  interface UserProviderProps {
    children: ReactNode;
  }
  
  export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
     });

    const contextValue: UserContextType = {
      user,
      setUser,
    };
  
    return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    );
  };
  
  export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };