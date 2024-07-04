"use client"
import React, { createContext, useContext } from 'react';

declare global {
  interface Window {
    isReactNativeWebView?: boolean;
  }
}

const WindowContext = createContext({
  isReactNativeWebView: typeof window !== 'undefined' ? window.isReactNativeWebView : false,
});

export const useWindow = () => useContext(WindowContext);

export const WindowProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  const isReactNativeWebView = typeof window !== 'undefined' ? window.isReactNativeWebView : false;

  return (
    <WindowContext.Provider value={{ isReactNativeWebView }}>
      {children}
    </WindowContext.Provider>
  );
};
