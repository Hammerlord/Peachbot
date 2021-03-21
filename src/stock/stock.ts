import { Stock } from "../db/initdb";
import { generateTicker } from "../ticker/generateTicker";

function formatId(serverId: string, entityId: string): string {
    return `${serverId}-${entityId}`;
}

/**
 * Get a stock from the db. If it doesn't exist, create and return it.
 */
export async function retrieveStock({
    serverId,
    entityId,
    entityType,
    entityName,
}: any): Promise<any> {
    const existingStock = await getStock(serverId, entityId);
    if (existingStock) {
        return existingStock;
    }

    return await createStock({ serverId, entityId, entityType, entityName });
}

export async function getStock(
    serverId: string,
    entityId: string
): Promise<any> {
    return await Stock.findOne({
        where: {
            id: formatId(serverId, entityId),
        },
    });
}

export async function createStock({
    serverId,
    entityId,
    entityType,
    entityName,
}: any): Promise<any> {
    const stock = await Stock.create({
        id: formatId(serverId, entityId),
        entityId,
        serverId,
        entityType,
        ticker: generateTicker({ serverId, entityName }),
    });
    await Stock.sync();
    return stock;
}
