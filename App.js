const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config()

const app = express();


app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.get("/news", (req, res) => {
  //Get news articles
  axios
    .get(
      "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&limit=10&apikey=" + process.env.API_KEY
    )
    .then((response) => {
      res.send(response.data);
    });
});

app.post("/stocks", (req, res) => {
  //Get Stock info
  const ticker = req.body.ticker.toLowerCase().trim();
  axios
    .get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.API_KEY}`
    )
    .then((response) => {
      if (Object.keys(response.data["Global Quote"]).length === 0) {
        res.status(404);
        res.send("Invalid");
      } else {
        const data = {
          symbol: response.data["Global Quote"]["01. symbol"],
          price: response.data["Global Quote"]["05. price"],
          date: response.data["Global Quote"]["07. latest trading day"],
          change: response.data["Global Quote"]["09. change"],
        };
        res.send(data);
      }
    });
});

app.post("/exchanges", (req, res) => {

  //Get exchange info
  console.log(req.body);
  const toCurrency = req.body.toCurrency;
  const fromCurrency = req.body.fromCurrency;

  axios
    .get(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${process.env.API_KEY}`
    )
    .then((response) => {
      const data = {
        symbol:
          response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"],
        date: response.data["Realtime Currency Exchange Rate"][
          "6. Last Refreshed"
        ],
      };
      res.send(data);
    });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 5000");
});
