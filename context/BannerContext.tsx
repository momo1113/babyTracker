// BannerContext.tsx
import React, { createContext, useState, useContext } from 'react';

const BannerContext = createContext({
  message: '',
  setMessage: (msg: string) => {},
});

export const BannerProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  return (
    <BannerContext.Provider value={{ message, setMessage }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => useContext(BannerContext);
