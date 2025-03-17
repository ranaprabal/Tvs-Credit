const { GoogleGenerativeAI } = require("@google/generative-ai")
const dotenv = require("dotenv")
dotenv.config()

const generatePitch = async (req, res) => {
  try {
    const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const modelId = "gemini-pro"
    const model = configuration.getGenerativeModel({ model: modelId })
    const userDetails = req.body

    console.log(userDetails.gender === "male")
    let loanString = userDetails.existingLoans
    let pronoun = "she"
    if (userDetails.gender === "male") pronoun = "he"

    let possessivePronouns
    if (userDetails.gender === "male") {
      possessivePronouns = "his"
    } else possessivePronouns = "her"

    if (loanString === "yes") loanString = " "
    else if (loanString === "no") loanString = "no"

    const recommendedProduct = userDetails.choosenProduct

    const promptString = `Write a personalized email to ${userDetails.name}, a ${userDetails.occupation} ${userDetails.gender} aged ${userDetails.age} living in a ${userDetails.location_type} area. ${pronoun} has a credit score of ${userDetails.credit_score} and have ${loanString} existing loans. And recently ${possessivePronouns} had ${userDetails.life_events}.
    Recommend the ${recommendedProduct.productName} which has ${recommendedProduct.interestRate} interest rate with ${recommendedProduct.duration} duration, highlighting its benefits for someone in ${possessivePronouns} situation. For example, how can this loan help ${possessivePronouns} improve ${possessivePronouns} quality of life or achieve ${possessivePronouns} financial goals?
    Use a friendly and conversational tone, and tailor the message to ${possessivePronouns} specific needs and interests based on the provided information.
    I'm Prabal working as sde at TVS credit`

    const chat = model.startChat()

    const result = await chat.sendMessage(promptString)
    const response = await result.response
    const responseText = response.text()

    return res.status(200).json({
      success: true,
      pitch: responseText,
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    })
  }
}

module.exports = generatePitch
