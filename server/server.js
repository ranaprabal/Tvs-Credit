const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const generateImage = require("./controllers/generateImage")
const generatePitch = require("./controllers/generatePitch")
const recommend = require("./controllers/recommend")
const scheduleMail = require("./controllers/scheduleMail")
const router = express.Router()

const app = express()
app.use(cors())

dotenv.config()

app.use(express.json())
app.use(express.static("public"))

router.post("/recommend", recommend)
router.post("/generatePitch", generatePitch)
router.post("/generateImage", generateImage)
router.post("/scheduleMail", scheduleMail)

app.use("", router)

const port = 8000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
