const express = require('express');
const app = express()
const port = proccess.env.PORT || 5001 


app.use(express.static(__dirname + '/public'))

// Motor de plantillas o vistas
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req, res) =>{
    res.render('index', {titulo: 'Index con EJS'})
})

app.get('/lenguajes', (req, res) =>{
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, () => {
    console.log('Arranca el servidor', port)
    console-log(`Arranca el servidor ${port}`)
})

//const server = http.createServer((req, res) => {
//    res.end('Hola Jovenes')
// });