const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;
require('dotenv').config()


const Car = require('./models/car')


app.set('view engine', 'ejs')


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`)
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err)
  })
  


app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

// Routes


app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find()
    res.render('index', { cars })
  } catch (err) {
    console.error('Error retrieving cars:', err)
    res.status(500).send('Error retrieving cars')
  }
})


app.get('/cars/new', (req, res) => {
  res.render('new')
})


app.post('/cars', async (req, res) => {
  try {
    const newCar = new Car({
      model: req.body.model,
      price: req.body.price,
      description: req.body.description,
    })
    await newCar.save()
    res.redirect('/cars')
  } catch (err) {
    console.error('Error saving car:', err)
    res.status(500).send('Error saving car')
  }
})


app.get('/cars/:id/edit', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
    res.render('edit', { car })
  } catch (err) {
    console.error('Error fetching car for edit:', err)
    res.status(500).send('Error fetching car')
  }
})


app.put('/cars/:id', async (req, res) => {
  try {
    await Car.findByIdAndUpdate(req.params.id, {
      model: req.body.model,
      price: req.body.price,
      description: req.body.description,
    });
    res.redirect('/cars');
  } catch (err) {
    console.error('Error updating car:', err)
    res.status(500).send('Error updating car')
  }
})


app.delete('/cars/:id', async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id)
    res.redirect('/cars')
  } catch (err) {
    console.error('Error deleting car:', err)
    res.status(500).send('Error deleting car')
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})