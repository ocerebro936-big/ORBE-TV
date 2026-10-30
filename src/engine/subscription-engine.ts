import { SubscriptionTier, PlanConfig } from '../types/content';
import { UBLUE_PLANS } from '../data/mock-content';

export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  start: 1,
  basic: 2,
  medio: 3,
  max: 4
};

export interface EntitlementCheckResult {
  allowed: boolean;
  requiredTier: SubscriptionTier;
  userTier: SubscriptionTier;
  reason?: string;
  suggestedPlan?: PlanConfig;
}

export class EntitlementEngine {
  /**
   * Check if user's tier has permission to view a channel or content
   */
  canAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
    const userLevel = TIER_HIERARCHY[userTier] ?? 0;
    const requiredLevel = TIER_HIERARCHY[requiredTier] ?? 0;
    return userLevel >= requiredLevel;
  }

  evaluateAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): EntitlementCheckResult {
    const allowed = this.canAccess(userTier, requiredTier);
    if (allowed) {
      return {
        allowed: true,
        requiredTier,
        userTier
      };
    }

    const suggestedPlan = UBLUE_PLANS.find(p => p.id === requiredTier) || UBLUE_PLANS[1];

    return {
      allowed: false,
      requiredTier,
      userTier,
      reason: `Este canal requer o pacote ${suggestedPlan.name} (${suggestedPlan.priceMT} MT). Seu pacote atual é ${this.getTierName(userTier)}.`,
      suggestedPlan
    };
  }

  getTierName(tier: SubscriptionTier): string {
    const plan = UBLUE_PLANS.find(p => p.id === tier);
    return plan ? plan.name : tier.toUpperCase();
  }

  getPlanConfig(tier: SubscriptionTier): PlanConfig {
    return UBLUE_PLANS.find(p => p.id === tier) || UBLUE_PLANS[0];
  }
}

export const entitlementEngine = new EntitlementEngine();
