import { ENTITY_TYPE } from './../types';
import { TickerHistory, Stock } from './../db/initdb';

const TICKER_CHANGE_BASE_PRICE = 50; // For users only

export function calculateTickerChangePrice({ history, entityType, stockId }: any): number {
    if (entityType === ENTITY_TYPE.USER) {
        return history.reduce((acc: any, cur: number, i: number) => {
            return i <= 1 ? 0 : cur * 2;
        }, TICKER_CHANGE_BASE_PRICE);
    }

    return 0;
}

export async function updateTicker({ stockId, newTicker, serverId }: any): Promise<any> {
    const history = await TickerHistory.findAll({
        where: {
            stockId,
        }
    });

    const price = calculateTickerChangePrice({ history, entityType: ENTITY_TYPE.USER, stockId });
    const stock = await Stock.findOne({ where: { stockId } });

    if (stock.getCurrency() <= price) {
        return await Promise.reject(`Insufficient funds. You need ${price} :peach: to change the ticker.`);
    }

    newTicker = newTicker.toUpperCase();
    const existingTicker = await TickerHistory.findOne({
        where: {
            serverId,
            changedTo: newTicker
        }
    });

    if (existingTicker) {
        return await Promise.reject('This ticker has already been used and is unavailable. Please pick another one.');
    }

    stock.setTicker(newTicker);
    stock.setCurrency(stock.getCurrency() - price);

    try {
        await stock.save();
        await TickerHistory.create({
            stockId,
            changedTo: newTicker
        });
    } catch (e) {
        return await Promise.reject(e);
    }
}