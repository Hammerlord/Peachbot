import { Stock } from '../db/initdb';
import { retrieveStock } from '../stock/stock';
import { ENTITY_TYPE } from './../types';
const Discord = require("discord.js");

module.exports = {
    name: "info",
    description: "View information about a stock. Example: info [<ticker> | <username> | 'server' | 'channel']",
    execute: async function (message: any, args: string[]) {
        const stock = await findStock(message, args);
        if (!stock) {
            const response = await message.reply('Sorry, could not find a stock with that query.');
            setTimeout(() => {
                try {
                    response.delete();
                } catch (e) {
                }
            }, 5000);
            return;
        }


    },
};


function sendStockInfo(stock: any): string {

    const exampleEmbed = {
        color: '#ff886e',
        title: `Stock name (${stock.ticker})`,
        fields: [
            {
                name: 'Price',
                value: 'Some value here',
                inline: true,
            },
            {
                name: 'Market Sentiment',
                value: 'Some value here',
                inline: true,
            },
            {
                name: 'Shares Outstanding',
                value: stock.totalShares,
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: 'Insider owned',
                value: 'TODO',
                inline: true,
            },
            {
                name: 'Institution owned',
                value: 'TODO',
                inline: true,
            },
            {
                name: 'Retail owned',
                value: 'TODO',
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: ':peach:',
                value: stock.currency,
                inline: true,
            },
            {
                name: 'Net value',
                value: '',
                inline: true,
            }
        ],
        timestamp: new Date(),
    };
}


async function findStock(message: any, args: string[]): Promise<any> {
    const serverId = message.guild.id;
    const entity = args[0]; // We only care about the first argument

    if (!entity) {
        return await retrieveStock({
            serverId,
            entityId: message.author.id,
            entityType: ENTITY_TYPE.USER,
            entityName: message.author.name,
        });
    }

    // Try to find a stock on the current "server" or "channel"

    if (entity.toLowerCase() === ENTITY_TYPE.SERVER) {
        return await retrieveStock({
            serverId,
            entityId: serverId,
            entityType: ENTITY_TYPE.SERVER,
            entityName: message.guild.name,
        });
    } else if (entity.toLowerCase() === ENTITY_TYPE.CHANNEL) {
        return await retrieveStock({
            serverId,
            entityId: message.channel.id,
            entityType: ENTITY_TYPE.CHANNEL,
            entityName: message.channel.name,
        });
    }

    // Try to find a stock based on its ticker...
    const stock = await Stock.findOne({
        where: {
            serverId,
            ticker: entity.toUpperCase()
        },
    });

    if (stock) {
        return stock;
    }

    // Try to find a stock based on the username...
    const member = await message.guild.members.fetch({ query: entity, limit: 1 }).first();
    const id = member.id;

    if (!id) {
        return;
    }

    const userStock = await Stock.findOne({
        where: {
            serverId,
            entityId: id
        },
    });

    if (userStock) {
        return userStock;
    }
}