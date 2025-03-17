const { PythonShell } = require("python-shell")

const recommend = (req, res) => {
  const userDetails = JSON.stringify(req.body)

  const options = {
    mode: "json",
    pythonOptions: ["-u"],
  }

  let pyShell = new PythonShell("./controllers/recommendation.py", options)

  pyShell.send(userDetails)

  pyShell.on("message", (message) => {
    output = message
  })

  pyShell.end((err, code, signal) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }
    res.send({ result: output, code: code })
  })
}

module.exports = recommend
