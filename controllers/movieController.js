const connection = require('../data/db')


function index(req, res) {

    const sql = 'SELECT * FROM movies;'

    connection.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                errorMessage: 'Error connection'
            })

        }
        res.json(results)
    })

}

function show(req, res) {

    const { id } = req.params

    const sql = 'SELECT * FROM movies WHERE id = ?;'

    const reviewSql = 'SELECT * FROM reviews JOIN movies ON movies.id = reviews.movie_id WHERE movies.id = ?'

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


        connection.query(reviewSql, [id], (err, reviewResults) => {
            if (err) {
                return res.status(500).json({
                    error: 'Database query failed'
                })
            }


            movie.reviews = reviewResults
            res.json(movie)

        })
    })

}

module.exports = { index, show }