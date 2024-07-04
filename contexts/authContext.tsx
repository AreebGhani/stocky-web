"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { sessionData } from '@/types/types';
import Cookies from 'js-cookie';
import { CheckUserSession } from '@/server/actions/CheckUserSession';

type Status = 'loading' | 'authenticated' | 'unauthenticated';
type UserSession = {
  sessionStatus: Status; session: sessionData;
  verifyLogin: () => void;
  updateSession: (updatedUser: sessionData['user']) => sessionData;
  deleteSession: () => void;
};

const AuthContext = createContext<UserSession | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const initialSession = {
  user: { balance: 0, diamonds: 0, email: '', id: '', phone: '', referral: '', picture: '', role: '', rank: 0, teamCommission: 0, username: '' },
  expires: new Date().toString(),
}

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sessionStatus, setSessionStatus] = useState<Status>('loading');
  const [session, setSession] = useState<sessionData>(initialSession);

  const verifyToken = async (token: string) => {
    setSessionStatus('loading');
    try {
      const res: { success: boolean; message?: string; data?: { token: string, user: sessionData['user'] } } = await CheckUserSession(token);
      if (res.success && res.data) {
        const expiry = parseInt(Cookies.get('session-expires') || '1');
        Cookies.set('session', res.data.token, { expires: expiry });
        Cookies.set('session-expires', expiry.toString(), { expires: expiry });
        setSession({ user: res.data.user, expires: new Date(Date.now() + expiry * 24 * 60 * 60 * 1000).toString() });
        setSessionStatus('authenticated');
      } else {
        Cookies.remove('session');
        Cookies.remove('session-expires');
        setSession(initialSession);
        setSessionStatus('unauthenticated');
      }
    } catch (error) {
      Cookies.remove('session');
      Cookies.remove('session-expires');
      setSession(initialSession);
      setSessionStatus('unauthenticated');
    }
  }

  useEffect(() => {
    const token = Cookies.get('session');
    if (token) {
      verifyToken(token);
    } else {
      setSessionStatus('unauthenticated');
    }
  }, []);

  const verifyLogin = () => {
    const token = Cookies.get('session');
    if (token) {
      verifyToken(token);
    } else {
      setSessionStatus('unauthenticated');
    }
  }

  const updateSession = (updatedUser: sessionData['user']) => {
    setSession((prevData) => ({
      ...prevData,
      user: { ...prevData.user, ...updatedUser }
    }));
    return session;
  }

  const deleteSession = () => {
    Cookies.remove('session');
    Cookies.remove('session-expires');
    setSession(initialSession);
    setSessionStatus('unauthenticated');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('picture');
    sessionStorage.removeItem('downloadPopupState');
  }

  const value: UserSession = {
    sessionStatus,
    session,
    verifyLogin,
    updateSession,
    deleteSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
