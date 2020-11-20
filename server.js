require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const MOVIEDEX = require("./moviedex.json")

app.use(morgan("dev"))
app.use(helmet())
app.use(cors())

app.listen()

const PORT = 8000

app.listen(PORT, () =>{
    console.log(`Now running on port ${PORT}`)
})

console.log(process.env.API_TOKEN)

app.use(function validateBearerToken(req, res, next){
    const API_TOKEN = process.env.API_TOKEN
    const givenToken = req.get("Authorization")
    console.log(process.env.API_KEY)
    if (!givenToken || givenToken.split(" ") !== "Bearer" || givenToken.split(" ")[1] !== API_TOKEN){
        return res.status(401).json({error: "Unauthorized"})
    }
    next()
})

app.get("/movie", handleMovieSearch)

function handleMovieSearch(req, res){
    let {genre="", country="", avg_vote=0} = req.query
    let results =  MOVIEDEX.filter(current => {
        let includesGenre = current.genre.toLowerCase().includes(genre.toLowerCase())
        let includesCountry = current.country.toLowerCase().includes(country.toLowerCase())
        let suffRating = current.avg_vote >= avg_vote
        return includesCountry && includesGenre && suffRating
    })

    res.send(results)
}