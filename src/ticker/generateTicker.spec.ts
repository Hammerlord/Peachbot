import { expect } from "chai";
import sinon from "sinon";
import { TickerHistory } from "./../db/initdb";
import { generateTicker, stripNonLetters } from "./generateTicker";

describe("generateTicker", () => {
    const stubTickerQuery = (value?: any) =>
        sinon
            .stub(TickerHistory, "findOne")
            .callsFake(() => Promise.resolve(value));

    it.only("generates a ticker based on the entityName", async () => {
        stubTickerQuery();

        const entityName = "A23B5@がなC";
        const ticker = await generateTicker({ serverId: "1", entityName });

        expect(/[A-Z]/.test(ticker)).equals(true);
        for (let i = 0; i < ticker.length; ++i) {
            expect(entityName.includes(ticker.charAt(i))).equals(true);
        }
        expect(ticker.length > 1 && ticker.length <= 5);
    });

    it("generates a random, valid ticker when entityName is all non-letter characters", async () => {
        stubTickerQuery();

        const entityName = "2424@#@#";
        for (let i = 0; i < 100; ++i) {
            const ticker = await generateTicker({ serverId: "1", entityName });
            expect(/[A-Z]/.test(ticker)).equals(true);
            expect(ticker.length > 1 && ticker.length <= 5);
        }
    });

    it("generates a random, valid ticker when entityName is empty", async () => {
        stubTickerQuery();

        for (let i = 0; i < 100; ++i) {
            const ticker = await generateTicker({
                serverId: "1",
                entityName: "",
            });
            expect(/[A-Z]/.test(ticker)).equals(true);
            expect(ticker.length > 1 && ticker.length <= 5);
        }
    });

    it("returns nothing after too many attempts", async () => {
        // This is just to be defensive against an infinite loop
        const someResult = {};
        stubTickerQuery(someResult);

        for (let i = 0; i < 10; ++i) {
            const ticker = await generateTicker({
                serverId: "1",
                entityName: "",
            });
            expect(ticker).equals(undefined);
        }
    });
});

describe("stripNonLetters", () => {
    it("removes all non-English letter characters", () => {
        expect(stripNonLetters("A23B5@がなC")).equal("ABC");
    });
});
