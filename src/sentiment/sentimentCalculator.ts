import { ProductivityType } from './../../types';

interface calculateSentimentParameters {
    earlierProductivity: ProductivityType[];
    currentProductivity: ProductivityType[];
    currentSentiment: {
        value: number;
    };
}

/**
 * Given certain parameters, calculate the new sentiment value.
 */
export function calculateSentiment({
    earlierProductivity,
    currentProductivity,
    currentSentiment,
}: calculateSentimentParameters): number {
    const earlierAcc = earlierProductivity.reduce((acc: number, cur: ProductivityType) => {
        return acc + cur.currencyValue;
    }, 0) / 5; // 5 = earlier days TODO magic num
    const currentAcc = currentProductivity.reduce((acc: number, cur: ProductivityType) => {
        return acc + cur.currencyValue;
    }, 0) / 2; // 2 = current days

    const tilt = 0.975;
    const basePercentage = currentAcc / earlierAcc - tilt;
    const percentage = Math.max(Math.min(basePercentage, 1), -1);
    const diff = percentage * 0.3;
    const newValue = currentSentiment.value + diff;
    const rounded = Math.round((newValue + Number.EPSILON) * 100) / 100;
    return Math.min(Math.max(rounded, 0), 1);
}