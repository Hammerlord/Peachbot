import { TickerHistory } from "./../db/initdb";

interface generateTickerParameters {
    serverId: string;
    entityName: string;
}

export async function generateTicker({
    serverId,
    entityName,
}: generateTickerParameters): Promise<string> {
    entityName = stripNonLetters(entityName).toUpperCase();

    async function findExisting(ticker: string): Promise<any> {
        return await TickerHistory.findOne({
            where: { serverId, changedTo: ticker },
        });
    }

    async function getRandom(): Promise<string> {
        let attempts = 10;
        while (attempts > 0) {
            const ticker = generateRandomTicker();
            const existingStock = await findExisting(ticker);
            if (!existingStock) {
                return ticker;
            }
            --attempts;
        }

        return "";
    }

    if (!entityName.length) {
        return await getRandom();
    }

    const max = Math.min(entityName.length, 5);
    for (let i = max; i > 1; --i) {
        const ticker = entityName.slice(0, i).toUpperCase();
        const existingStock = await TickerHistory.findOne({
            where: { serverId, changedTo: ticker },
        });
        if (!existingStock) {
            return ticker;
        }
    }

    return await getRandom();
}

export function generateRandomTicker(): string {
    const MAX = 5;
    const MIN = 1;
    const numChars = Math.random() * (MAX - MIN) + MIN;
    return Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, numChars)
        .toUpperCase();
}

export function stripNonLetters(value: string): string {
    return value.replace(/[^a-zA-Z]/gim, "");
}
