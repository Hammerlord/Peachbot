export enum ENTITY_TYPE {
    USER = "user",
    SERVER = "server",
    CHANNEL = "channel"
}

export interface Stock {
    id: string;
    entityId: string;
    serverId: string;
    entityType: ENTITY_TYPE;
    currency: number;
    ticker: string; // First 2-5 characters of a user's name or custom defined (as long as there are no collisions)
    totalShares: number; // Possibly FK
    marketSentiment: number; // In despair, very negative, negative, unimpressed, ambivalent, hopeful, positive, very positive, exuberant
    activity: number; // Of messages
    volume: number; // Of trades
    delistedDatetime: string; // Eg. in case a channel has been deleted
}

export interface NPC {
    id: string;
    serverId: string;
    name: string;
    currency: number; // Liquid peaches
    positions: Position; // or FK
    previousScores: number[]; // Maybe?
    aggression: number;
    paperHands: number;
    restlessness: number;
    trendiness: number;
    greed: number;
    yolo: number;
    bullishness: number;
    lastTransaction: string;
}

/**
 * The cumulative positions a trader owns on a stock.
 */
interface Position {
    [stockId: string]: {
        calls: Contract[];
        puts: {
            [contractId: string]: {
                amount: number;
                contract: Contract;
            };
        };
        longs: { amount: number; averagePrice: number };
    };
}

interface User {
    // This is real users only
    id: string; // Unique ID. A user can have multiple "User" entries if they are on multiple servers with Peachbot... maybe
    serverId: string;
    entityId: string; // User ID
    currency: number;
    positions: Position;
    currentHighscore: number;
    joined: string; // Datetime
    previousScores: {
        dateTime: string;
        highscore: number;
    }[]; // If you went bust, your previous high score will appear here.
}

// If a channel is deleted, player buys will be frozen on that security, but the security will continue going up and down randomly.

/**
 * Market sentiment
 * Exuberant: 0.91 - 1
 * Very positive: 0.75 - 0.9
 * Positive: 0.66 - 0.74
 * Hopeful: 0.55 - 0.65
 * Ambivalent: 0.46 - 0.54
 * Unimpressed: 0.36 - 0.45
 * Negative: 0.26 - 0.35
 * Very negative: 0.1 - 0.25
 * In despair: 0 - 0.9
 */

interface SpotPrice {
    // Generated?
    id: string;
    entityId: string;
    price: number;
}

/**
 * A log of the upwards/downwards pressure on a stock's currency based on user message activity.
 */
export interface ProductivityType {
    stockId: string;
    dateTime: string;
    userId: string;
    currencyValue: number;
}

export enum CONTRACT_TYPE {
    CALL = "call",
    PUT = "put",
}

interface Contract {
    id: string;
    entityId: string;
    type: CONTRACT_TYPE;
    premium: number;
    strike: number;
    expiry: string; // Date-time string
}

interface Share {
    entityId: string;
    type: "long" | "short";
    openSpotPrice: number;
}

export interface Transaction {
    id: string;
    type: "buy" | "sell";
    underlying: {
        type: "contract" | "share";
        assetId: Contract | Share;
    };
    buyer: string;
    seller: string;
    amount: number;
    totalCurrencyDifference: number;
    dateTime: string;
}