require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns')
const bodyparser = require("body-parser");
const { URL } = require('url');
const mongoose = require('mongoose')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;



mongoose.connect('mongodb+srv://admin:ew6ZHc9o5rXWnwaz@cluster0.jhovera.mongodb.net/Codecamp?retryWrites=true&w=majority&appName=Cluster0;')
.then(() => {
   console.log('Databae Connected')
})


const urlShortSchema = new mongoose.Schema({
   url: String,
   short_url: Number
})

const UrlModel = mongoose.model('UrlShortener', urlShortSchema)


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyparser.json())

app.use('/public', express.static(`${process.cwd()}/public`));

let urls = [
  {
    original_url: 'https://github.com/freeCodeCamp/boilerplate-project-urlshortener/',
    short_url: 1
  }
]
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {
  
  const {url} = req.body

  const urlCount = await UrlModel.find()

  try {
    const valUrl = new URL(url).hostname 

   dns.lookup(valUrl,(err,address,family) => {
      if(err){
       res.json( {
        error: 'invalid url'
       })
      }else{
        UrlModel.create({
          url: url,
          short_url: urlCount.length
        })

         res.json({
          original_url: url,
          short_url: urlCount.length
        })
      }
  })
  } catch (error) {
    res.json( {
      error: 'invalid url'
     })
  }
});
app.get("/api/shorturl/:short_url", async (req,res) => {
   
   const shorturl = req.params.short_url
   const urlDoc = await UrlModel.findOne({short_url: shorturl})
   res.redirect(urlDoc.url)
 
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
