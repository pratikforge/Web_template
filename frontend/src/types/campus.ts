import type { LifecycleStage, UserRole } from '../lib/lifecycleStateMachine';

export type { LifecycleStage, UserRole };

export type ResourceCategory =
  | 'All'
  | 'Electronics'
  | 'Lab & Academic'
  | 'Media & Events'
  | 'Sports & Dorm'
  | 'Free / Donate';

export interface CampusUser {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  year: string;
  hostel: string;
  roomNo: string;
  trustScore: number; // 0 to 100
  isVerified: boolean;
  avatarUrl: string;
  successfulExchanges: number;
  lateReturns: number;
  disputes: number;
  walletBalancePaise: number;
  role: UserRole;
}

export interface CampusResource {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  hourlyRateRupees: number;
  depositRupees: number;
  ownerId: string;
  ownerName: string;
  ownerDepartment: string;
  ownerHostel: string;
  distanceMinutes: number;
  condition: 'Brand New' | 'Excellent' | 'Good' | 'Fair';
  isAvailable: boolean;
  imageUrl: string;
  accessoriesIncluded: string[];
  borrowingTerms: string[];
  totalBorrowsCount: number;
  isDonation?: boolean;
}

export interface SubLoanItem {
  resourceId: string;
  title: string;
  category: ResourceCategory;
  ownerId: string;
  ownerName: string;
  ownerHostel: string;
  borrowHours: number;
  hourlyRateRupees: number;
  depositRupees: number;
  borrowPaise: number;
  feePaise: number;
  depositPaise: number;
  stage: LifecycleStage;
  preHandoverPhoto?: string;
  postReturnPhoto?: string;
  checklistPassed: boolean;
  damageReported?: boolean;
  damageDescription?: string;
  damageDeductionPaise?: number;
}

export interface MasterLoanOrder {
  id: string;
  borrowerId: string;
  borrowerName: string;
  createdAtEpoch: number;
  dueAtEpoch: number;
  returnedAtEpoch?: number;
  items: SubLoanItem[];
  totalBorrowPaise: number;
  totalFeePaise: number;
  totalDepositPaise: number;
  totalPaidPaise: number;
  status: 'ACTIVE' | 'SETTLED' | 'DISPUTED';
}

export interface CommunityBeaconRequest {
  id: string;
  studentName: string;
  studentHostel: string;
  itemNeeded: string;
  category: ResourceCategory;
  urgency: 'Immediate (Next 1 hr)' | 'Today' | 'This Weekend';
  maxBudgetRupees: number;
  postedAgo: string;
  responsesCount: number;
}

export interface CampusImpactStats {
  moneySavedRupees: number;
  itemsReusedCount: number;
  co2DivertedKg: number;
  onTimeReturnPercentage: number;
  activeStudentsCount: number;
}
