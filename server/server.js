const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(_,_, cb) {
    cb(null, 'uploads/')
  },
  filename: function(_,file,cb) {
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'))
  }
})
const upload = multer({storage})
const log = multer()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (_,res)=>{
  res.send('<h1>hello world</h1>')
});

app.delete('/', log.single(), (req,res)=>{
  console.log('received delete request');
  console.log(req.body.first_name);
  const { first_name, last_name, email }  = req.body;
  res.json(`{
    "result":"success",
    "first_name":"${first_name}",
    "last_name":"${last_name}",
    "email":"${email}"
  }`);
});

app.get('/sleep/sync', (_,res)=>{
  console.log('before');
  sleep(10000);
  console.log('after');
  res.send('<h1>done</h1>')
});

app.get(['/sleep','/sleep/async'], (_,res)=>{
  console.log('before');
  asyncSleep(10000)
  .then(()=>console.log('after'))
  .then(()=>res.send('<h1>hello world</h1>'));
});

app.use('/', express.static(path.join(__dirname, './public')))

app.post('/upload', upload.single('upload'), (req, res)=>{
  console.log(req)
  res.sendStatus(201);
});

app.listen(port,'0.0.0.0',async()=>{
  console.log('server started...');
});

function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

function asyncSleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
