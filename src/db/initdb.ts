const Sequelize = require("sequelize");
const CONFIG = require("../initialConfig");
const DBPATH = require("../dbPath");

export const sequelize = new Sequelize(
    DBPATH,
    {
        host: "localhost",
        dialect: "postgres",
        operatorsAliases: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export const Contract = sequelize.define("contracts", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
    },
    stockId: Sequelize.UUID,
    type: Sequelize.ENUM("call", "put"),
    premium: Sequelize.INTEGER,
    strike: Sequelize.INTEGER,
    expiry: Sequelize.DATE,
});

export const Long = sequelize.define("longs", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
    },
    amount: Sequelize.INTEGER,
    averagePrice: Sequelize.INTEGER,
});

export const Position = sequelize.define("positions", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
    },
});

export const Productivity = sequelize.define("productivity", {
    stockId: Sequelize.STRING,
    dateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    userId: Sequelize.STRING,
    currencyValue: Sequelize.INTEGER,
});

export const TickerHistory = sequelize.define("ticker_history", {
    stockId: Sequelize.STRING,
    dateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    changedTo: Sequelize.STRING,
});

export const MarketSentimentHistory = sequelize.define("market_sentiment_history", {
    stockId: Sequelize.STRING,
    value: {
        type: Sequelize.DOUBLE,
        defaultValue: CONFIG.marketSentiment,
        validate: {
            min: 0,
            max: 1,
        },
    },
    dateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
});

export const SpotPriceHistory = sequelize.define("spot_price_history", {
    stockId: Sequelize.STRING,
    value: {
        type: Sequelize.DOUBLE,
        defaultValue: CONFIG.marketSentiment,
        validate: {
            min: 0,
            max: 1,
        },
    },
    dateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
});

export const Stock = sequelize.define("stocks", {
    id: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
    },
    serverId: Sequelize.STRING,
    entityId: Sequelize.STRING, // The underlying user, server, or channel of the stock
    entityType: Sequelize.ENUM("user", "server", "channel"),
    currency: {
        type: Sequelize.INTEGER,
        defaultValue: CONFIG.currency,
    },
    ticker: {
        type: Sequelize.STRING,
        validate: {
            is: /^[a-z]+$/i,
            isUppercase: true,
            len: [2, 5],
        },
    },
    totalShares: {
        type: Sequelize.INTEGER,
        defaultValue: CONFIG.totalShares,
    },
    delistedDateTime: {
        type: Sequelize.DATE,
        allowNull: true,
    },
});

export const NPC = sequelize.define("npcs", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
    },
    serverId: Sequelize.STRING,
    currency: {
        type: Sequelize.DOUBLE,
        validate: {
            min: 0,
            max: 1,
        },
    },
    aggression: {
        type: Sequelize.DOUBLE,
        validate: {
            min: 0,
            max: 1,
        },
    },
    paperHands: {
        type: Sequelize.DOUBLE,
        validate: {
            min: 0,
            max: 1,
        },
    },
    restlessness: {
        type: Sequelize.DOUBLE,
        validate: {
            min: 0,
            max: 1,
        },
    },
    trendiness: {
        type: Sequelize.DOUBLE,
        validate: {
            min: 0,
            max: 1,
        },
    },
    greed: {
        type: Sequelize.DOUBLE,
        validate: {
            min: 0,
            max: 1,
        },
    },
    yolo: {
        type: Sequelize.DOUBLE,
        validate: {
            min: 0,
            max: 1,
        },
    },
    bullishness: {
        type: Sequelize.DOUBLE,
        validate: {
            min: 0,
            max: 1,
        },
    },
});

export const Highscore = sequelize.define("highscores", {
    serverId: Sequelize.STRING,
    userId: Sequelize.STRING,
    dateTime: Sequelize.DATE,
    score: Sequelize.INTEGER,
});

(async () => {
    await Contract.sync();
    await Long.sync();
    Position.hasMany(Contract, { as: "calls", foreignKey: "id" });
    Position.hasMany(Contract, { as: "puts", foreignKey: "id" });
    Position.hasOne(Long, { as: "longs", foreignKey: "id" });
    await Position.sync();
    await Productivity.sync();
    await TickerHistory.sync();
    await MarketSentimentHistory.sync();
    await SpotPriceHistory.sync();
    Stock.hasMany(TickerHistory, { as: "tickerHistory" });
    Stock.hasMany(Position, { as: "positions" });
    await Stock.sync();
    NPC.hasMany(Position, { as: "positions" });
    await NPC.sync();
    await Highscore.sync();
    await sequelize.sync({ force: true });
})();