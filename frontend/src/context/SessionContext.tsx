import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CampusUser, UserRole } from '../types/campus';
import { MOCK_USERS } from '../data/mockCampusData';
import { safeStorage } from '../lib/safeStorage';

interface SessionContextType {
  currentUser: CampusUser;
  activeRole: UserRole;
  platformFeePercentage: number;
  switchRole: (role: UserRole) => void;
  setPlatformFeePercentage: (fee: number) => void;
  adjustWalletBalance: (deltaPaise: number) => void;
  resetAllDemoData: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return safeStorage.getItem<UserRole>('active_role', 'borrower');
  });

  const [platformFeePercentage, setPlatformFeePercentageState] = useState<number>(() => {
    return safeStorage.getItem<number>('platform_fee_pct', 5);
  });

  const [userMap, setUserMap] = useState<Record<string, CampusUser>>(() => {
    return safeStorage.getItem<Record<string, CampusUser>>('users_map', MOCK_USERS);
  });

  const currentUser = userMap[activeRole] || MOCK_USERS.borrower;

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    safeStorage.setItem('active_role', role);
  };

  const setPlatformFeePercentage = (fee: number) => {
    const clamped = Math.max(0, Math.min(15, fee));
    setPlatformFeePercentageState(clamped);
    safeStorage.setItem('platform_fee_pct', clamped);
  };

  const adjustWalletBalance = (deltaPaise: number) => {
    setUserMap(prev => {
      const updated = {
        ...prev,
        [activeRole]: {
          ...prev[activeRole],
          walletBalancePaise: Math.max(0, prev[activeRole].walletBalancePaise + deltaPaise)
        }
      };
      safeStorage.setItem('users_map', updated);
      return updated;
    });
  };

  const resetAllDemoData = () => {
    safeStorage.resetDemoState();
    setActiveRole('borrower');
    setPlatformFeePercentageState(5);
    setUserMap(MOCK_USERS);
  };

  useEffect(() => {
    const handleReset = () => {
      setActiveRole('borrower');
      setPlatformFeePercentageState(5);
      setUserMap(MOCK_USERS);
    };
    window.addEventListener('campus_state_reset', handleReset);
    return () => window.removeEventListener('campus_state_reset', handleReset);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        activeRole,
        platformFeePercentage,
        switchRole,
        setPlatformFeePercentage,
        adjustWalletBalance,
        resetAllDemoData
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
};
