import express from 'express'
import mercadopago from 'mercadopago'
import cors from 'cors'
import pg from 'pg'

const app = express()
new pg.Pool({
  connectionString: 'postgres://jkz:VuPbodlDXVcVse4UjsIid0f7E6fG4KfD@dpg-cipn48d9aq0dcpr3gst0-a/backendshopping'
})

const PORT = 4000
app.use(express.json())
app.use(cors())

mercadopago.configure({
  access_token: 'TEST-940969852499922-070913-1a1eb913960e20130586ecece6a08631-1419354662'
})

app.get('/', function (req, res) {
  res.send('The server actually up and running...')
})

app.post('/create_preference', (req, res) => {
  const preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        currency_id: req.body.currency_id
      }
    ],
    back_urls: {
      success: 'http://localhost:4000',
      failure: 'http://localhost:4000',
      pending: 'http://localhost:4000'
    },
    auto_return: 'approved'
  }
  console.log('Preference:', preference)
  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id
      })
    })
    .catch(function (error) {
      console.log(error)
    })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
