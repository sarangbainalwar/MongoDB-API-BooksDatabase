const express = require('express')
const { connectToDB, getDb } = require('./db')
const { ObjectId } = require('mongodb')
//init app and middleware

const app = express()
app.use(express.json())

//db connection
let db

connectToDB((err) => {
  if(!err){
      app.listen(3000, ()=>{
          console.log('app listening on port 3000')
    })
    db=getDb()
  }
})

//routes
app.get('/books', (req,res) => {
  let books = []

  const page = req.query.p || 0
  const booksPerPages = 3


  db.collection("books")
  .find()  //cursor toArray forEach
  .sort({ author:1 })
  .skip(page*booksPerPages)
  .limit(booksPerPages)  // limit to 3 books per page
  .forEach(book => books.push(book))
  .then(() => {
    res.status(200).json(books)
  })
  .catch(() => {
    res.status(500).json({error: 'could not fetch the documents'})
  })
})

app.get('/books/:id',(req,res) => {

  if(ObjectId.isValid(req.params.id)){
    db.collection("books")
  .findOne({_id: new ObjectId(req.params.id)})
  .then(doc => {
    res.status(200).json(doc)
  })
  .catch(err => {
    res.status(500).json({error: 'could not fetch the document'})
  })
  }
  else{
    res.status(500).json({error: 'Not a valid id'})
  }
})

app.post('/books',(req,res)=>{
   const book = req.body
    db.collection("books")
    .insertOne(book)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({er: 'Could not create a new document'})
    })
})

app.delete('/books/:id',(req,res) => {
  if(ObjectId.isValid(req.params.id)){
    db.collection("books")
  .deleteOne({_id: new ObjectId(req.params.id)})
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    res.status(500).json({error: 'could not delete'})
  })
  }
  else{
    res.status(500).json({error: 'Not a valid id'})
  }
})

app.patch('/books/:id', (req,res) => {
  const updates = req.body


  if(ObjectId.isValid(req.params.id)){
    db.collection("books")
  .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    res.status(500).json({error: 'could not update'})
  })
  }
  else{
    res.status(500).json({error: 'Not a valid id'})
  }
})