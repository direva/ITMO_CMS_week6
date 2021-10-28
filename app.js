const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
}

const login = 'direva99'

export default function initApp(express, bodyParser, fs, crypto, http, User, m, puppeteer) {
    const app = express()
    app
        .use(bodyParser.urlencoded({extended:true}))   
        .all('/login/', r => {
            r.res.set(headers).send(login)
        })
        .all('/code/', r => {
            r.res.set(headers)
            fs.readFile(import.meta.url.substring(7),(err, data) => {
                if (err) throw err
                r.res.end(data)
              })
        })
        .all('/sha1/:input/', r => {
            r.res.set(headers).send(crypto.createHash('sha1').update(r.params.input).digest('hex'))
        })
        .get('/req/', (req, res) =>{
            res.set(headers)
            let data = ''
            http.get(req.query.addr, async function(response) {
                await response.on('data',function (chunk){
                    data+=chunk
                }).on('end',()=>{})
                res.send(data)
            })
        })
        .post('/req/', r =>{
            r.res.set(headers)
            const {addr} = req.body
            r.res.send(addr)
        })
        .post('/insert/', async r => {
            r.res.set(headers)
            const { login, password, URL } = r.body
            const newUser = new User({ login, password })
            try {
                await m.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
                try {
                    await newUser.save()
                    r.res.status(201).json({ 'Added: ': login })
                } catch(e) {
                    r.res.status(400).json({ 'Error: ': 'No password entered' })
                }
            } catch(e) {
                console.log(e.codeName)
            }
        })
        .get('/test/', async r=>{
            r.res.set(headers)
            const { URL } = r.query
            const browser = await puppeteer.launch({ headless: true, args:['--no-sandbox','--disable-setuid-sandbox'] })
            const page = await browser.newPage()
            await page.goto(URL)
            await page.waitForSelector('#inp')
            await page.click('#bt')
            const got = await page.$eval('#inp', el => el.value)
            browser.close()
            r.res.send(got)
        })
        .all('*', r => r.res.send(login))
        .use(({res:r})=>r.status(404).send(login))
    return app
}