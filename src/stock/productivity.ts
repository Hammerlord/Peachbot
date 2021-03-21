import { Productivity, Stock } from "../db/initdb";
import { ENTITY_TYPE } from "../types";
import { createStock } from "./stock";

export async function updateEntitiesProductivity({
    author,
    channel,
    guild,
}: any): Promise<void> {
    const idEntityTypeMap = {
        [author.id]: ENTITY_TYPE.USER,
        [channel.id]: ENTITY_TYPE.CHANNEL,
        [guild.id]: ENTITY_TYPE.SERVER,
    };

    const stocks = await Stock.findAll({
        where: {
            serverId: guild.id,
            $or: Object.keys(idEntityTypeMap).map((id) => ({
                entityId: {
                    $eq: id,
                },
            })),
        },
    });

    stocks.forEach(async (stock: any) => {
        delete idEntityTypeMap[stock.getId()]; // Delete entry such that only non-existing stocks remain in the map
        await updateProductivity({ stock, userId: author.id });
    });

    Object.entries(idEntityTypeMap).forEach(([entityId, entityType]) => {
        createStock({ serverId: guild.id, entityId, entityType });
    });
}

interface StockProductivityParameters {
    stock: any; // Stock instance from the database
    userId: string; // The user who performed the action that changed stock productivity
}

export async function updateProductivity({
    stock,
    userId,
}: StockProductivityParameters): Promise<void> {
    const currencyIncrement = 1; // TODO
    await stock.setCurrency(stock.getCurrency() + currencyIncrement);
    await Productivity.create({
        stockId: stock.getId(),
        userId,
        currencyValue: currencyIncrement, // TODO
    });
    await stock.sync();
    await Productivity.sync();
}
