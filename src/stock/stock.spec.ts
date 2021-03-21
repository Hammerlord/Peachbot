import { expect } from 'chai';
import { ENTITY_TYPE } from './../types';
import { createStock, getStock } from "./stock";

describe('Stock', () => {
    it('can create a stock', async () => {
        const serverId = 'testserver';
        const entityId = 'testentity';
        await createStock({ serverId, entityId, entityType: ENTITY_TYPE.USER });
        const stock = await getStock(serverId, entityId);
        expect(stock.id).equal('testserver-testentity');
        //console.log('aaa', stock.get('ticker'));
        console.log(stock);
        //console.log(stock.entityType);
    });
});