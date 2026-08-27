import React, { createContext, useContext, useState, useMemo } from 'react';
import type { CampusResource } from '../types/campus';
import { useLoanEngine } from './LoanEngineContext';

export interface HostelStopCluster {
  hostelName: string;
  items: CampusResource[];
  estimatedWalkingMinutes: number;
}

interface CartContextType {
  cartItems: CampusResource[];
  isDrawerOpen: boolean;
  selectedBundleName: string | null;
  borrowHours: number;
  hostelClusters: HostelStopCluster[];
  totalBorrowRupees: number;
  totalDepositRupees: number;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  setBorrowHours: (hours: number) => void;
  addToCart: (resource: CampusResource) => void;
  removeFromCart: (resourceId: string) => void;
  loadBundleIntoCart: (bundleName: string, resources: CampusResource[]) => void;
  clearCart: () => void;
  checkoutCart: () => string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createOrderFromResources } = useLoanEngine();

  const [cartItems, setCartItems] = useState<CampusResource[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedBundleName, setSelectedBundleName] = useState<string | null>(null);
  const [borrowHours, setBorrowHours] = useState<number>(4);

  const openCartDrawer = () => setIsDrawerOpen(true);
  const closeCartDrawer = () => setIsDrawerOpen(false);

  const addToCart = (resource: CampusResource) => {
    setCartItems(prev => {
      if (prev.some(item => item.id === resource.id)) return prev;
      return [...prev, resource];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (resourceId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== resourceId));
  };

  const loadBundleIntoCart = (bundleName: string, resources: CampusResource[]) => {
    setSelectedBundleName(bundleName);
    setCartItems(resources);
    setIsDrawerOpen(true);
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedBundleName(null);
  };

  // Group items by hostel for clean campus pickup logistics
  const hostelClusters: HostelStopCluster[] = useMemo(() => {
    const map = new Map<string, CampusResource[]>();
    cartItems.forEach(item => {
      const list = map.get(item.ownerHostel) || [];
      list.push(item);
      map.set(item.ownerHostel, list);
    });

    return Array.from(map.entries()).map(([hostelName, items]) => {
      const maxDistance = Math.max(...items.map(i => i.distanceMinutes));
      return {
        hostelName,
        items,
        estimatedWalkingMinutes: maxDistance
      };
    });
  }, [cartItems]);

  const totalBorrowRupees = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.hourlyRateRupees * borrowHours, 0);
  }, [cartItems, borrowHours]);

  const totalDepositRupees = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.depositRupees, 0);
  }, [cartItems]);

  const checkoutCart = (): string | null => {
    if (cartItems.length === 0) return null;

    const payload = cartItems.map(item => ({
      resourceId: item.id,
      title: item.title,
      category: item.category,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      ownerHostel: item.ownerHostel,
      hourlyRateRupees: item.hourlyRateRupees,
      depositRupees: item.depositRupees
    }));

    const order = createOrderFromResources(payload, borrowHours);
    clearCart();
    setIsDrawerOpen(false);
    return order.id;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        selectedBundleName,
        borrowHours,
        hostelClusters,
        totalBorrowRupees,
        totalDepositRupees,
        openCartDrawer,
        closeCartDrawer,
        setBorrowHours,
        addToCart,
        removeFromCart,
        loadBundleIntoCart,
        clearCart,
        checkoutCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
