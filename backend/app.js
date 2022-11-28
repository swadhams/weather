const express = require('express')
const cors = require('cors');
const { json } = require('express');
const app = express()
const port = 3000

app.use(express.json())

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || [
            'http://localhost:5174'
        ].includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(origin, 'Not allowed by CORS.'));
    }
  }));  

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/user', (req, res) => { 
  console.log(req.body)
  let {textarea} = req.body;
  res.json (req.body)
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const airdata = require
