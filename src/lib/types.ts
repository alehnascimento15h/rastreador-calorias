// Tipos para o aplicativo BR AI - Rastreador de Calorias

export type Goal = 'lose' | 'gain' | 'maintain';
export type WorkoutsPerWeek = '0-2' | '3-5' | '6+';
export type WeightGoal = 'lose_fast' | 'lose_moderate' | 'lose_slow' | 'maintain' | 'gain_slow' | 'gain_moderate' | 'gain_fast';

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female' | 'other';
  goal: Goal;
  targetWeight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dailyCalorieGoal: number;
  // Novos campos de onboarding
  workoutsPerWeek: WorkoutsPerWeek;
  weightGoal: WeightGoal;
  hasUsedCalorieApps: boolean;
  previousApps?: string[]; // Lista de apps que já usou
  // Dados de assinatura
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'cancelled';
  trialStartDate: string; // ISO date
  subscriptionEndDate?: string; // ISO date
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  // Dados de corrida
  isRunner?: boolean;
  runningGoal?: 'distance' | 'time' | 'calories' | 'pace';
  weeklyRunningGoal?: number; // km ou minutos
  // Dados de afiliação
  affiliateCode?: string; // Código único do afiliado
  referredBy?: string; // Código de quem indicou
}

export interface Meal {
  id: string;
  timestamp: Date;
  imageUrl?: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number; // gramas
  carbs: number; // gramas
  fat: number; // gramas
  portion: string;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  caloriesGoal: number;
  meals: Meal[];
  weight?: number;
  // Dados de corrida
  runningActivities?: RunningActivity[];
  totalRunningCalories?: number;
  totalDistance?: number;
}

export interface WeightProgress {
  date: string;
  weight: number;
}

// Tipos para corrida e smartwatch
export interface RunningActivity {
  id: string;
  date: Date;
  distance: number; // km
  duration: number; // minutos
  pace: number; // min/km
  caloriesBurned: number;
  heartRateAvg?: number;
  heartRateMax?: number;
  source: 'manual' | 'smartwatch';
}

export interface SmartWatchConnection {
  isConnected: boolean;
  deviceName?: string;
  deviceType?: 'apple_watch' | 'garmin' | 'fitbit' | 'samsung' | 'other';
  lastSync?: Date;
}

export interface RunningStats {
  totalDistance: number; // km
  totalTime: number; // minutos
  totalCalories: number;
  averagePace: number; // min/km
  longestRun: number; // km
  totalRuns: number;
}

// Tipos para sistema de afiliação
export interface AffiliateData {
  userId: string;
  affiliateCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number; // em reais
  availableBalance: number; // saldo disponível para saque
  pendingBalance: number; // saldo pendente (aguardando confirmação)
  referrals: Referral[];
  withdrawals: Withdrawal[];
}

export interface Referral {
  id: string;
  referredUserId: string;
  referredUserName: string;
  signupDate: Date;
  status: 'pending' | 'active' | 'cancelled';
  commissionAmount: number; // 25% do valor da assinatura
  commissionPaid: boolean;
  subscriptionValue: number;
}

export interface Withdrawal {
  id: string;
  amount: number;
  pixKey: string;
  pixKeyType: 'cpf' | 'email' | 'phone' | 'random';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestDate: Date;
  completedDate?: Date;
  transactionId?: string;
}

export interface WalletStats {
  totalEarned: number;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  activeReferrals: number;
  totalReferrals: number;
}
