import express from 'express'
import QRCode from 'qrcode'
import bodyParser from 'body-parser'
import { uniqueNamesGenerator, colors, adjectives } from "unique-names-generator"
import path from 'path'
import { fileURLToPath } from 'url';
// __dirname is not defined in Node 14 version
// https://stackoverflow.com/questions/64383909/dirname-is-not-defined-in-node-14-version
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send("api is connected")
})


const shortName = uniqueNamesGenerator({
    dictionaries: [colors, adjectives], // colors can be omitted here as not used
    length: 2
});

// generate the qr code with express post rquest
// toFile(path, text, [options], [cb(error)])
// https://github.com/soldair/node-qrcode#tofilepath-text-options-cberror
app.post('/create', (req, res) => {

    QRCode.toFile(`./images/${shortName}.png`, req.body.text).then(url => {
        // console.log(url)
        res.send(`http://localhost:3000/images/${shortName}.png`)
    }).catch(err => { console.log(err) })


})
// view the images online
// How to fetch images from Node.js server ?
// https://www.geeksforgeeks.org/how-to-fetch-images-from-node-js-server/
app.use('/images', express.static('./images'))

// render the image in the front end
// How To Deliver HTML Files with Express
// https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
app.get('/html', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})


app.listen(3000, () => {
    console.log("app is runing at port 3000")
})

