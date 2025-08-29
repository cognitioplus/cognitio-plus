interface InsightParams {
    hrv: number | null;
    mood: number | null; // 1 (Overwhelmed) to 5 (Great)
    tier: 'free' | 'premium';
}

/**
 * Generates a simple, rule-based AI insight based on user data.
 * @param params The user's latest metrics.
 * @returns A string containing a helpful insight.
 */
export const getAIInsight = ({ hrv, mood, tier }: InsightParams): string => {
    if (tier === 'premium' && hrv !== null && mood !== null) {
        if (hrv < 50 && mood < 3) {
            return `Premium Insight: Your low HRV of ${hrv}ms combined with a low mood score suggests your nervous system is under significant strain. Prioritizing rest and gentle activities today is highly recommended. Let's see if we can raise this score tomorrow.`;
        }
        if (hrv > 70 && mood > 3) {
            return `Premium Insight: Excellent synergy! Your high HRV of ${hrv}ms and positive mood indicate a state of high resilience. This is a great time to tackle challenges or engage in creative work.`;
        }
    }

    if (hrv !== null && hrv < 50 && mood !== null && mood < 3) {
        return "Your nervous system shows high stress. Your HRV is low and you're feeling down. This might be a good time to try a guided breathing exercise or talk to someone you trust.";
    }

    if (mood !== null) {
        if (mood <= 2) {
            return "It sounds like you're having a tough day. Remember that it's okay to not be okay. Consider a short walk or listening to some calming music.";
        }
        if (mood === 3) {
            return "Feeling just 'okay' is a valid state. What's one small thing you could do right now to make your day a little brighter?";
        }
        if (mood >= 4) {
            return "It's great that you're feeling good today! What's contributing to this positive feeling? Acknowledging it can help you cultivate more of it.";
        }
    }
    
    if (hrv !== null && hrv < 50) {
        return "Your HRV seems a bit low, which can be a sign of stress. Ensure you're staying hydrated and getting enough rest.";
    }

    return "Consistency is key to understanding your well-being. Keep checking in daily to discover more personalized insights.";
};
