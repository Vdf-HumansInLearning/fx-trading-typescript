var express = require("express");
var router = express.Router();

const fs = require("fs");
const path = require("path");

let rawdata = fs.readFileSync(path.resolve(__dirname, "../db/currencies.json"));
let fileContents = JSON.parse(rawdata);
const currency_pairings = fileContents.currency_pairings;
const currency_rates = fileContents.currency_rates;

let obj = [
  { time: "10:00", buy: 4.5 },
  { time: "10:03", buy: 4.6 },
  { time: "10:06", buy: 4.7 },
  { time: "10:09", buy: 4.1 },
  { time: "10:12", buy: 3.8 },
  { time: "10:15", buy: 1.3 },
  { time: "10:18", buy: 4.0 },
  { time: "10:21", buy: 4.1 },
  { time: "10:24", buy: 4.9 },
  { time: "10:27", buy: 3.6 },
  { time: "10:30", buy: 3.0 },
  { time: "10:33", buy: 4.1 },
];

let chartData = {
  USD_EUR: [{ time: "10:00", buy: 1.14 }],
  USD_GBP: [{ time: "10:00", buy: 1.35 }],
  USD_RON: [{ time: "10:00", buy: 0.23 }],
  USD_CHF: [{ time: "10:00", buy: 1.1 }],
  EUR_USD: [{ time: "10:00", buy: 0.88 }],
  EUR_GBP: [{ time: "10:00", buy: 1.19 }],
  EUR_RON: [{ time: "10:00", buy: 0.2 }],
  EUR_CHF: [{ time: "10:00", buy: 0.96 }],
  GBP_EUR: [{ time: "10:00", buy: 0.84 }],
  GBP_USD: [{ time: "10:00", buy: 0.74 }],
  GBP_RON: [{ time: "10:00", buy: 0.71 }],
  GBP_CHF: [{ time: "10:00", buy: 0.81 }],
  RON_EUR: [{ time: "10:00", buy: 0.2 }],
  RON_GBP: [{ time: "10:00", buy: 0.17 }],
  RON_USD: [{ time: "10:00", buy: 0.23 }],
  RON_CHF: [{ time: "10:00", buy: 0.21 }],
  CHF_EUR: [{ time: "10:00", buy: 1.04 }],
  CHF_GBP: [{ time: "10:00", buy: 1.23 }],
  CHF_RON: [{ time: "10:00", buy: 0.21 }],
  CHF_USD: [{ time: "10:00", buy: 0.91 }],
};
let aa = [];

for (key in chartData) {
  for (let i = 0; i < 10; i++) {
    // datenow minus 30 seconds
    let today = new Date(Date.now() - i * 30000);
    let hh = today.getHours();
    let mins = String(today.getMinutes()).padStart(2, "0");
    let ss = String(today.getSeconds()).padStart(2, "0");

    let time = hh + ":" + mins + ":" + ss;
    let buyValue = (
      Math.random() *
      (Number(chartData[key][i].buy) +
        0.1 -
        Number(chartData[key][i].buy - 0.1)) +
      Number(chartData[key][i].buy) -
      0.1
    ).toFixed(2);
    chartData[key].push({
      time: time,
      buy: Number(buyValue),
    });
  }
}

/* GET all currencies available in the app */
router.get("/currencies", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesAvailable = fileContents.currencies_available;
  res.status(200).json(currenciesAvailable);
});

/* GET all currency rates with pairings */
router.get("/currencies/rates", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesRates = fileContents.currency_rates;
  res.status(200).json(currenciesRates);
});

/* GET all currency pairings */
router.get("/currencies/pairs", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesPairings = fileContents.currency_pairings;
  res.status(200).json(currenciesPairings);
});

/* GET one currency pairing from request query */
// {
//   base_currency: "EUR",
//   quote_currency: "RON"
// }
router.get("/currencies/quote", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesRates = fileContents.currency_rates;
  if (req.query.base_currency && req.query.quote_currency) {
    let foundBase = currenciesRates.find(
      (pair) => pair.base_currency === req.query.base_currency
    ).quotes;
    let foundPair = null;
    for (item in foundBase) {
      if (item === req.query.quote_currency) {
        foundPair = foundBase[item];
        break;
      }
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
    });

    let timer = setInterval(() => getNewCurrencyData(res, foundPair), 3000);

    res.socket.on("end", () => {
      //responses = responses.filter((x) => x != res);
      clearInterval(timer);
      res.emit("close");
    });
    //responses.push(res);
  } else {
    res.status(400).json({ message: "Bad request" });
  }
});

function getNewCurrencyData(res, currencyObj) {
  let sendObj = {
    sell: (
      Math.random() * (currencyObj.sell + 0.1 - (currencyObj.sell - 0.1)) +
      (currencyObj.sell - 0.1)
    ).toFixed(2),
    buy: (
      Math.random() * (currencyObj.buy + 0.1 - (currencyObj.buy - 0.1)) +
      (currencyObj.buy - 0.1)
    ).toFixed(2),
  };

  return res.status(200).write(`data: ${JSON.stringify(sendObj)}\n\n`);
}

/* POST one base currency */
router.post("/currencies", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );
  let fileContents = JSON.parse(rawdata);
  const currenciesRates = fileContents.currency_rates;

  //verify if it is in the list of currencies
  if (req.body.base_currency) {
    let foundCurrency = currenciesRates.find(
      (pair) => pair.base_currency === req.body.base_currency
    );
    if (foundCurrency) {
      res.status(200).json(foundCurrency);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
});

/* POST one currency pairing from request body*/
// {
//   base_currency: "EUR",
//   quote_currency: "RON"
// }
router.post("/currencies/quote", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../db/currencies.json")
  );

  let fileContents = JSON.parse(rawdata);
  const currenciesRates = fileContents.currency_rates;
  const chartData = fileContents.chartData;
  let chartDataArray = [];

  if (req.body.base_currency && req.body.quote_currency) {
    let { base_currency, quote_currency } = req.body;
    let foundBase = currenciesRates.find(
      (pair) => pair.base_currency === base_currency
    ).quotes;

    let currencyPairing = base_currency + "_" + quote_currency;
    for (item in chartData) {
      if (item === currencyPairing) {
        chartDataArray = chartData[item];
      }
    }

    chartDataArray = chartDataArray.map((item, index) => {
      //get time 30s prior
      let today = new Date(Date.now() - index * 30000);
      let hh = today.getHours();
      let mins = String(today.getMinutes()).padStart(2, "0");
      let ss = String(today.getSeconds()).padStart(2, "0");

      let time = hh + ":" + mins + ":" + ss;
      return {
        [base_currency]: item.buy,
        [quote_currency]: item.buy,
        time: time,
      };
    });

    for (item in foundBase) {
      if (item === quote_currency) {
        res.status(200).json({
          sell: (
            Math.random() *
            (foundBase[item].sell + 0.1 - (foundBase[item].sell - 0.1)) +
            (foundBase[item].sell - 0.1)
          ).toFixed(2),
          buy: (
            Math.random() *
            (foundBase[item].buy + 0.1 - (foundBase[item].buy - 0.1)) +
            (foundBase[item].buy - 0.1)
          ).toFixed(2),
          chartData: chartDataArray,
        });
      }
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
