import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MasterLoanOrder, SubLoanItem, LifecycleStage } from '../types/campus';
import { canTransition, getNextStage } from '../lib/lifecycleStateMachine';
import { calculateTransactionTotal, rupeesToPaise } from '../lib/finance';
import { safeStorage } from '../lib/safeStorage';
import { useSession } from './SessionContext';

interface LoanEngineContextType {
  orders: MasterLoanOrder[];
  activeOrder: MasterLoanOrder | null;
  timeWarpHours: number;
  setActiveOrderId: (id: string) => void;
  createOrderFromResources: (items: { resourceId: string; title: string; category: any; ownerId: string; ownerName: string; ownerHostel: string; hourlyRateRupees: number; depositRupees: number }[], hours: number) => MasterLoanOrder;
  advanceItemStage: (orderId: string, itemId: string) => boolean;
  setItemConditionInspection: (orderId: string, itemId: string, checklistPassed: boolean, damageReported: boolean, damagePaise?: number) => void;
  warpTime: (hours: number) => void;
  resetTimeWarp: () => void;
  runGoldenPathDemo: () => Promise<void>;
  isDemoRunning: boolean;
}

const DEFAULT_SEED_ORDER: MasterLoanOrder = {
  id: 'order_demo_reel_kit',
  borrowerId: 'user_rohan',
  borrowerName: 'Rohan Sharma (CSE 2nd Yr)',
  createdAtEpoch: Date.now() - 3600000,
  dueAtEpoch: Date.now() + 18000000, // 5 hours from now
  items: [
    {
      resourceId: 'res_sony_a7',
      title: 'Sony Alpha A7 III Full-Frame Camera',
      category: 'Media & Events',
      ownerId: 'user_priya',
      ownerName: 'Priya Patel',
      ownerHostel: 'Hostel 2',
      borrowHours: 5,
      hourlyRateRupees: 120,
      depositRupees: 500,
      borrowPaise: 60000, // 5 hrs * ₹120 = ₹600 -> 60,000 paise
      feePaise: 3000,     // 5% platform fee = ₹30 -> 3,000 paise
      depositPaise: 50000,// ₹500 deposit -> 50,000 paise
      stage: 'HANDOVER',  // Seeded at Handover stage for instant visual inspection demo!
      preHandoverPhoto: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      postReturnPhoto: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      checklistPassed: true,
      damageReported: false,
      damageDeductionPaise: 0
    }
  ],
  totalBorrowPaise: 60000,
  totalFeePaise: 3000,
  totalDepositPaise: 50000,
  totalPaidPaise: 113000, // ₹1,130
  status: 'ACTIVE'
};

const LoanEngineContext = createContext<LoanEngineContextType | null>(null);

export const LoanEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeRole, platformFeePercentage, adjustWalletBalance } = useSession();

  const [orders, setOrders] = useState<MasterLoanOrder[]>(() => {
    return safeStorage.getItem<MasterLoanOrder[]>('loan_orders', [DEFAULT_SEED_ORDER]);
  });

  const [activeOrderId, setActiveOrderId] = useState<string>(() => {
    return orders[0]?.id || DEFAULT_SEED_ORDER.id;
  });

  const [timeWarpHours, setTimeWarpHours] = useState<number>(0);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0] || null;

  useEffect(() => {
    safeStorage.setItem('loan_orders', orders);
  }, [orders]);

  useEffect(() => {
    const handleReset = () => {
      setOrders([DEFAULT_SEED_ORDER]);
      setActiveOrderId(DEFAULT_SEED_ORDER.id);
      setTimeWarpHours(0);
      setIsDemoRunning(false);
    };
    window.addEventListener('campus_state_reset', handleReset);
    return () => window.removeEventListener('campus_state_reset', handleReset);
  }, []);

  const warpTime = (hours: number) => {
    setTimeWarpHours(prev => prev + hours);
  };

  const resetTimeWarp = () => {
    setTimeWarpHours(0);
  };

  const createOrderFromResources = (
    items: { resourceId: string; title: string; category: any; ownerId: string; ownerName: string; ownerHostel: string; hourlyRateRupees: number; depositRupees: number }[],
    hours: number
  ): MasterLoanOrder => {
    let totalBorrowPaise = 0;
    let totalFeePaise = 0;
    let totalDepositPaise = 0;

    const subItems: SubLoanItem[] = items.map(item => {
      const bPaise = rupeesToPaise(item.hourlyRateRupees * hours);
      const dPaise = rupeesToPaise(item.depositRupees);
      const { feePaise, totalPaise: _ } = calculateTransactionTotal(bPaise, platformFeePercentage, dPaise);

      totalBorrowPaise += bPaise;
      totalFeePaise += feePaise;
      totalDepositPaise += dPaise;

      return {
        resourceId: item.resourceId,
        title: item.title,
        category: item.category,
        ownerId: item.ownerId,
        ownerName: item.ownerName,
        ownerHostel: item.ownerHostel,
        borrowHours: hours,
        hourlyRateRupees: item.hourlyRateRupees,
        depositRupees: item.depositRupees,
        borrowPaise: bPaise,
        feePaise,
        depositPaise: dPaise,
        stage: 'REQUESTED',
        preHandoverPhoto: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        postReturnPhoto: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        checklistPassed: true,
        damageReported: false,
        damageDeductionPaise: 0
      };
    });

    const totalPaidPaise = totalBorrowPaise + totalFeePaise + totalDepositPaise;

    const newOrder: MasterLoanOrder = {
      id: `order_${Date.now()}`,
      borrowerId: 'user_rohan',
      borrowerName: 'Rohan Sharma (CSE 2nd Yr)',
      createdAtEpoch: Date.now(),
      dueAtEpoch: Date.now() + hours * 3600000,
      items: subItems,
      totalBorrowPaise,
      totalFeePaise,
      totalDepositPaise,
      totalPaidPaise,
      status: 'ACTIVE'
    };

    // Deduct total payment from borrower simulated wallet
    adjustWalletBalance(-totalPaidPaise);

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    return newOrder;
  };

  const advanceItemStage = (orderId: string, itemId: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const targetItem = order.items.find(i => i.resourceId === itemId);
    if (!targetItem) return false;

    const next = getNextStage(targetItem.stage);

    if (!canTransition(targetItem.stage, next, activeRole)) {
      console.warn(`[RBAC Block] Role ${activeRole} cannot advance ${targetItem.stage} -> ${next}`);
      return false;
    }

    // Settlement side-effects
    if (next === 'SETTLEMENT') {
      const refund = targetItem.depositPaise - (targetItem.damageDeductionPaise || 0);
      adjustWalletBalance(refund); // Refund remaining deposit back to borrower
    }

    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        const updatedItems = o.items.map(item => {
          if (item.resourceId !== itemId) return item;
          return { ...item, stage: next };
        });
        const allSettled = updatedItems.every(i => i.stage === 'RATED' || i.stage === 'SETTLEMENT');
        return {
          ...o,
          items: updatedItems,
          status: allSettled ? 'SETTLED' : o.status
        };
      })
    );

    return true;
  };

  const setItemConditionInspection = (
    orderId: string,
    itemId: string,
    checklistPassed: boolean,
    damageReported: boolean,
    damagePaise: number = 0
  ) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          items: o.items.map(item => {
            if (item.resourceId !== itemId) return item;
            return {
              ...item,
              checklistPassed,
              damageReported,
              damageDeductionPaise: damageReported ? damagePaise : 0
            };
          })
        };
      })
    );
  };

  const runGoldenPathDemo = async () => {
    if (!activeOrder || isDemoRunning) return;
    setIsDemoRunning(true);
    const targetItem = activeOrder.items[0];
    if (!targetItem) {
      setIsDemoRunning(false);
      return;
    }

    const sequence: LifecycleStage[] = [
      'AVAILABLE',
      'REQUESTED',
      'ACCEPTED',
      'HANDOVER',
      'BORROWED',
      'RETURNED',
      'INSPECTION',
      'SETTLEMENT',
      'RATED'
    ];

    for (const st of sequence) {
      setOrders(prev =>
        prev.map(o => {
          if (o.id !== activeOrder.id) return o;
          return {
            ...o,
            items: o.items.map((i, idx) => (idx === 0 ? { ...i, stage: st } : i))
          };
        })
      );
      await new Promise(r => setTimeout(r, 650));
    }

    setIsDemoRunning(false);
  };

  return (
    <LoanEngineContext.Provider
      value={{
        orders,
        activeOrder,
        timeWarpHours,
        setActiveOrderId,
        createOrderFromResources,
        advanceItemStage,
        setItemConditionInspection,
        warpTime,
        resetTimeWarp,
        runGoldenPathDemo,
        isDemoRunning
      }}
    >
      {children}
    </LoanEngineContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoanEngine = () => {
  const ctx = useContext(LoanEngineContext);
  if (!ctx) throw new Error('useLoanEngine must be used within LoanEngineProvider');
  return ctx;
};
