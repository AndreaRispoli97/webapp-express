const connection = require('../data/db')


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

    const sql = 'SELECT * FROM movies WHERE id = ?;'

    const reviewSql = 'SELECT * FROM reviews WHERE movie_id = 1'

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
            res.json({
                ...movie,
                imagePath: process.env.PATH_IMG + movie.image
            })

        })
    })

}

module.exports = { index, show }