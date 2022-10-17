const cors = require("cors");
const express = require("express");
const app = express();
require('dotenv').config()

// const port = process.env.PORT || process.env.MY_PORT;

const port = 8003

app.listen(port, () => {
	console.log("Listen on :", port);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(cors());

const landing_page = require("./routes/landing_page");
app.use(landing_page);

const auth = require("./routes/auth");
app.use(auth);

const products = require("./routes/products");
app.use(products);

const rating = require("./routes/rating");
app.use(rating);

const keranjang = require("./routes/keranjang");
app.use(keranjang);

const pesanan = require("./routes/pesanan");
app.use(pesanan);

const midtrans = require("./routes/midtrans");
app.use(midtrans);

const ongkir = require("./routes/ongkir");
app.use(ongkir);