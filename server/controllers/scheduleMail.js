const schedule = require("node-schedule")
const nodemailer = require("nodemailer")

const scheduleMail = (req, res) => {
  try {
    const data = req.body

    const template = data.template
    const userMail = data.email
    const scheduleDate = new Date(data.bestTimeToRecommend)
    const pitchSubject = "Looking for a Loan? Check Out This Great Offer!"

    scheduleDate.setHours(10, 10, 0)

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_PASS,
      },
    })

    let mailOptions = {
      from: process.env.GOOGLE_MAIL,
      to: userMail,
      subject: pitchSubject,
      html: template,
    }

    schedule.scheduleJob(scheduleDate, function () {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email: ", err)
        } else {
          console.log("Email sent successfully: ", info.response)
        }
      })
    })

    res.status(200).send({
      success: true,
      message:
        "Mail scheduled successfully, it will be sent on the specified date.",
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    })
  }
}

module.exports = scheduleMail
