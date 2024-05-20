import yahooFinance from 'yahoo-finance2';
import { DateTime } from 'luxon';

const today = DateTime.now();
console.log("תאריך", today);

const symbol = "AAPL";
const rateBuy = 192.777;
const rateSell = 200;
const quantity = 15;



function calculateProfitLossSold(rateBuy, rateSell, quantity) {
    const profitLossSold = (rateSell - rateBuy) * quantity;
    return profitLossSold.toFixed(2);
}

async function plcuurentsymbol(symbol, rateBuy, quantity) {
    const closedaily = await fetchAppleStockPrice(symbol);
    const profitLossConvenience = (closedaily - rateBuy) * quantity;
    return profitLossConvenience.toFixed(2);
}

async function fetchAppleStockPrice(symbol) {
    try {
        const closePrice = await yahooFinance.quote(symbol);
        const close2 = closePrice.regularMarketPrice;
        return close2;
    } catch (error) {
        console.error("אירעה שגיאה בבקשת הנתונים:", error);
    }
}

async function main() {
    const closeDay = await fetchAppleStockPrice(symbol);
    console.log("מחיר הסגירה:", closeDay);
    
    const p1 = calculateProfitLossSold(rateBuy, rateSell, quantity);
    console.log("רווח והפסד יומי", p1);

    const p2 = await plcuurentsymbol(symbol, rateBuy, quantity);
    console.log("רווח או הפסד לאחר מכירה בהתאם לשער סגירת היום האחרון:", p2);
}

main();
export { calculateProfitLossSold, fetchAppleStockPrice, plcuurentsymbol };
