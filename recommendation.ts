import React from 'react';
import type { UserType, Service, BadgeInfo } from '../types';
import { IMAGES, IconBadge } from '../constants';

const ALL_SERVICES: Record<string, Service> = {
    'well-be': { id: 'well-be', name: 'Well-Be App', description: 'HRV, AI insights, and therapy booking.', icon: IMAGES.WELL_BE },
    'psych-assess': { id: 'psych-assess', name: 'PsychAssess Pro', description: 'Scientific assessment for high-stress situations.', icon: IMAGES.PSYCH_ASSESS_PRO },
    'oasis': { id: 'oasis', name: 'Oasis Mindfulness', description: 'Guided meditations and sleep stories.', icon: IMAGES.OASIS },
    'care-talk': { id: 'care-talk', name: 'CareTalk Circles', description: 'Facilitated peer support groups for communities.', icon: IMAGES.GROWTH_TRIBE },
    'pfa': { id: 'pfa', name: 'PFA Certification', description: 'Get certified in Psychological First Aid.', icon: IMAGES.RESILIENCE_NAVIGATOR },
    'policy-design': { id: 'policy-design', name: 'Policy Co-Design Support', description: 'Integrate MHPSS into your organization\'s plans.', icon: IMAGES.HABIT_DESIGNER }
};

export const getRecommendations = (userType: UserType, data: Record<string, any>): Service[] => {
    const recs = new Set<Service>();
    
    switch (userType) {
        case 'individual':
            // Always recommend the base app
            recs.add(ALL_SERVICES['well-be']);

            if (data.goal === 'individual_goal_stress' || data.mood === 'individual_checkin_1' || data.mood === 'individual_checkin_2') {
                recs.add(ALL_SERVICES['psych-assess']);
            }
            if (data.goal === 'individual_goal_sleep') {
                recs.add(ALL_SERVICES['oasis']);
            }
            if (data.goal === 'individual_goal_talk' || data.counselingPreference === 'individual_counseling_video' || data.counselingPreference === 'individual_counseling_chat') {
                recs.add(ALL_SERVICES['well-be']);
            }
            if (data.vulnerability?.includes('individual_context_remote') || data.vulnerability?.includes('individual_context_indigenous')) {
                recs.add(ALL_SERVICES['care-talk']);
            }
            break;
        case 'mhp':
            if (data.communityService === 'mhp_community_yes') {
                recs.add(ALL_SERVICES['care-talk']);
            }
            recs.add(ALL_SERVICES['pfa']);
            break;
        case 'community':
            recs.add(ALL_SERVICES['care-talk']);
            recs.add(ALL_SERVICES['pfa']);
            break;
        case 'organization':
             recs.add(ALL_SERVICES['well-be']);
            if (data.orgGoal === 'org_goals_emergency' || data.compliance === 'org_compliance_non' || data.compliance === 'org_compliance_unsure') {
                 recs.add(ALL_SERVICES['policy-design']);
            }
            if (data.orgGoal === 'org_goals_train_managers') {
                recs.add(ALL_SERVICES['pfa']);
            }
            break;
    }

    return Array.from(recs);
};


export const getBadgeForUser = (userType: UserType): BadgeInfo => {
    const commonIcon = React.createElement(IconBadge, { className: "w-8 h-8" });
    switch (userType) {
        case 'individual':
            return { name: "First Step Taken", description: "You've started your journey to well-being!", icon: commonIcon };
        case 'mhp':
            return { name: "Professional Partner", description: "You're ready to connect and provide care.", icon: commonIcon };
        case 'community':
            return { name: "Community Champion", description: "You're empowered to lead your community's well-being.", icon: commonIcon };
        case 'organization':
            return { name: "Workplace Wellness Advocate", description: "You're building a healthier, more resilient team.", icon: commonIcon };
    }
};

export const getBadgeForEngagement = (engagementCount: number): BadgeInfo | null => {
    const commonIcon = React.createElement(IconBadge, { className: "w-8 h-8" });
    if (engagementCount >= 3) {
        return { name: "Supportive Peer", description: "You've started supporting your community. Thank you!", icon: commonIcon };
    }
    // Can add more badges for higher counts later
    // e.g., if (engagementCount >= 10) { ... }
    return null;
}
