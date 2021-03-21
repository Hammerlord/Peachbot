import { ProductivityType } from './../types';
import { expect } from 'chai';

const sentimentCalculator = require("./sentimentCalculator");

describe("sentimentCalculator", () => {
    const { calculateSentiment } = sentimentCalculator;

    function toProductivity(list: number[]): ProductivityType[] {
        return list.map((currencyValue) => ({
            currencyValue,
        })) as ProductivityType[];
    }

    it("productivity deficit should lower the sentiment", () => {
        const earlierProductivity = toProductivity([1, 1, 1, 1, 1, 1]);
        const currentProductivity = toProductivity([1, 1]);
        const currentSentiment = 0.5;

        const result = calculateSentiment({
            earlierProductivity,
            currentProductivity,
            currentSentiment: { value: currentSentiment },
        });

        expect(result).to.be.lessThan(currentSentiment);
    });

    it("productivity improvement should increase the sentiment", () => {
        const earlierProductivity = toProductivity([1, 3]);
        const currentProductivity = toProductivity([1, 1, 3, 5]);
        const currentSentiment = 0.5;

        const result = calculateSentiment({
            earlierProductivity,
            currentProductivity,
            currentSentiment: { value: currentSentiment },
        });
        expect(result).to.be.greaterThan(currentSentiment);
    });
});
