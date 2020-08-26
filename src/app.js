require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV} = require('./config')
const ArticlesService = require('./articles-service')
const usersRouter = require('./users/users-router')
const commentsRouter = require('./comments/comments-router')
const app = express()

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)
app.get('/articles', (req, res, next) => {
    const knexInstance = req.app.get('knexInstance')
    ArticlesService.getAllArticles(knexInstance)
    .then(articles => {
        res.json(articles)
    })
    .catch(next)
})

app.get('/articles/:article_id', (req, res, next) => {
    const knexInstance = req.app.get('knexInstance')
    ArticlesService.getById(knexInstance, req.params.article_id)
        .then(article => {
            res.json(article)
        })
        .catch(next)
})

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.log(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app