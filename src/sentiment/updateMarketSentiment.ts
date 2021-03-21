import { Stock, Productivity, MarketSentimentHistory } from '../db/initdb';
import moment from 'moment';
import { calculateSentiment } from './sentimentCalculator';

async function updateMarketSentiment() {
    const stocks = await Stock.findAll();

    stocks.forEach(async (stock: any) => {
        const stockId = stock.getId();
        const earlierProductivity = await Productivity.findAll({
            where: {
                dateTime: {
                    $lte: moment().subtract(2, "days").toDate(),
                    $gte: moment().subtract(7, "days").toDate(),
                },
                stockId,
            },
        });

        const currentProductivity = await Productivity.findAll({
            where: {
                dateTime: {
                    $gte: moment().subtract(2, "days").toDate(),
                },
                stockId,
            },
        });

        const latestSentiment = await MarketSentimentHistory.findOne({
            order: [["dateTime", "DESC"]],
        });

        await MarketSentimentHistory.create({
            value: calculateSentiment({
                earlierProductivity,
                currentProductivity,
                currentSentiment: latestSentiment.getValue(),
            }),
            stockId,
        });
    });
}

async function initUpdateMarketSentimentJob() {

}