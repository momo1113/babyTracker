import React, { createContext, useContext, useState } from 'react';

const BannerContext = createContext({
  message: '',
  setMessage: (msg: string) => {},
  clearMessage: () => {}, // 👈 this clears the message
});

export const BannerProvider = ({ children }) => {
  const [message, setMessage] = useState('');

  const clearMessage = () => setMessage('');

  return (
    <BannerContext.Provider value={{ message, setMessage, clearMessage }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => useContext(BannerContext);
