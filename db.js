const { MongoClient } = require('mongodb')

let dbConnection
let uri='mongodb+srv://ragnarb2003:TTLqcOmlDiE8QjgN@books.l2d2mb8.mongodb.net/?retryWrites=true&w=majority&appName=Books'
module.exports = {
    connectToDB: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
         dbConnection = client.db()
         return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}