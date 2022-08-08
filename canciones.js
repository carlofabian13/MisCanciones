const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const router = express.Router()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://yisus:<password>@cluster0.gjybw.mongodb.net/test')
  // eslint-disable-next-line no-undef
  .catch((err) => handeError(err))

const songSchema = new mongoose.Schema(
  {
    song: String,
    artist: String,
    album: String,
    year: Number,
    country: String
  },

  { collection: 'Song' }
)

const Song = mongoose.model('Song', songSchema)

router.get('/canciones/all', (req, res) => {
  // eslint-disable-next-line array-callback-return
  Song.find((err, songs) => {
    if (err) res.status(500).send('Error en la base de datos (all)')
    else res.status(200).json(songs)
  })
})

router.get('/canciones', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'canciones.html'))
})

// por artista
router.get('/canciones/artist', (req, res) => {
  Song.find({ artist: req.query.artist }, (err, songs) => {
    if (err) res.status(500).send('Hubo un error en la base de datos (artist)')
    else {
      if (songs != null) {
        res.status(200).json(songs)
      } else res.status(404).send('No se encontro la cancion')
    }
  })
})

// por año
router.get('/canciones/year', function (req, res) {
  Song.find({ year: req.query.year }, function (err, canciones) {
    if (err) {
      console.log(err)
      res.status(500).send('Error al leer de la base de datos')
    } else res.status(200).json(canciones)
  })
})

// entre dos años
router.get('/canciones/yearx', function (req, res) {
  Song.find({ year: { $gt: req.query.gtyear, $lte: req.query.ltyear } }, function (err, canciones) {
    if (err) {
      console.log(err)
      res.status(500).send('Error al leer de la base de datos')
    } else res.status(200).json(canciones)
  })
})

// por id
router.get('/canciones/porid/:id', function (req, res) {
  Song.findById(req.params.id, function (err, cancion) {
    if (err) res.status(500).send('Error en la base de datos (id) ')
    else {
      if (cancion != null) {
        res.status(200).json(cancion)
      } else res.status(404).send('No se encontro esa cancion')
    }
  })
})

router.get('/canciones/descarga', (req, res) => {
  const archivo = req.query
  console.log('req ', archivo.archivo)

  res.download(
    path.join(__dirname, 'public', 'images', `${archivo.archivo}`),
    archivo,
    (err) => {
      if (err) console.log('Occurrio un problema en la descarga, ' + err)
      else console.log('Descarga exitosa!')
    }
  )
})

module.exports = router
