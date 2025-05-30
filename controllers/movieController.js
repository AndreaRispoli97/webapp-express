const connection = require('../data/db')
const slugify = require('slugify')

function index(req, res) {
    const { resarc } = req.query

    const preparedParams = []

    let sql = 'SELECT movies.*, round(avg(reviews.vote),2) as media_voti FROM movies LEFT JOIN reviews ON movies.id = reviews.movie_id'
    if (resarc) {
        sql += ` WHERE title like ? or director like ? or abstract like ?`
        preparedParams.push(`%${resarc}%`, `%${resarc}%`, `%${resarc}%`)
    }

    sql += ` GROUP BY movies.ID`
    connection.query(sql, preparedParams, (err, results) => {

        if (err) {
            console.log(err)
            return res.status(500).json({
                errorMessage: 'Error connection'
            })

        }
        res.json(results.map(result => ({
            ...result, imagePath: process.env.PATH_IMG + result.image
        })))
    })

}


function show(req, res) {

    const { id } = req.params

    const sql = 'SELECT * FROM movies WHERE slug = ?;'

    const reviewSql = 'SELECT * FROM reviews WHERE movie_id = ?'

    connection.query(sql, [id], (err, movieResults) => {

        if (err) {
            return res.status(500).json({
                errorMessage: 'Error connection'
            })

        }

        if (movieResults.length === 0) {
            return res.status(404).json({
                errorMessage: ' not Found'
            })
        }

        const movie = movieResults[0]



        connection.query(reviewSql, [movie.id], (err, reviewResults) => {
            if (err) {
                return res.status(500).json({
                    error: 'Database query failed'
                })
            }


            movie.reviews = reviewResults
            res.json({
                ...movie,
                imagePath: process.env.PATH_IMG + movie.image
            })

        })
    })

}


function storeMovie(req, res) {

    const { title, director, abstract } = req.body

    const imageName = req.file.filename;
    console.log(imageName)

    const sql = `INSERT INTO movies(title, director, abstract, image, slug)
    VALUES ( ? , ? , ? , ? , ? )`


    const slug = slugify(title, {
        lower: true,
        trim: true
    })

    connection.query(sql, [title, director, abstract, imageName, slug], (err, results) => {
        console.log(results)
        if (err) {

            return res.status(500).json({
                errorMessage: err
            })
        }
        return res.status(201).json({
            message: results
        })

    })




}

function storeReview(req, res) {

    const { id } = req.params;

    console.log(req.body);

    const { name, vote, text } = req.body;

    const sql = `INSERT INTO reviews(movie_id, name, vote, text)
    VALUES ( ? , ? , ? , ? )`

    connection.query(sql, [id, name, vote, text], (err, results) => {

        if (err) {

            return res.status(500).json({
                errorMessage: err
            })
        }
        return res.status(201).json({
            message: results
        })

    })

}

module.exports = { index, show, storeReview, storeMovie }