import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";
import pg from "pg";
import { config } from "dotenv";

config();
const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const PORT = 4000;
app.use(express.json());
app.use(cors());

mercadopago.configure({
  access_token:
    "TEST-940969852499922-070913-1a1eb913960e20130586ecece6a08631-1419354662",
});

app.get("/", function (req, res) {
  res.send("The server actually up and running...");
});

app.get("/ping", async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  return res.json(result.rows[0])
});

app.post("/create_preference", (req, res) => {
  const preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        currency_id: req.body.currency_id,
      },
    ],
    back_urls: {
      success: "http://localhost:4000",
      failure: "http://localhost:4000",
      pending: "http://localhost:4000",
    },
    auto_return: "approved",
  };
  console.log("Preference:", preference);
  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
