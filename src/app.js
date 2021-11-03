const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(publicDirectoryPath))
hbs.registerPartials(partialsPath)

app.get('', (req, res) => {
    res.render('index',
        { title: 'Weather', name: 'Ahmed Samir' }
    )
})

app.get('/about', (req, res) => {
    res.render('about',
        { title: 'About Me', name: 'Ahmed Samir', aboutMsg: 'This site was created by Node.js. It uses data from mapbox.com and weatherstack.com' }
    )
})

app.get('/help', (req, res) => {
    res.render('help',
        { helpMsg: 'This is helpful text.', title: 'Help', name: 'Ahmed Samir' }
    )
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'You must provide an address.' })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({ forecast: forecastData, location, address: req.query.address })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', { title: '404', name: 'Ahmed Samir', errorMessage: 'Help article not found.' })
})

app.get('*', (req, res) => {
    res.render('404', { title: '404', name: 'Ahmed Samir', errorMessage: 'Page not found.' })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})