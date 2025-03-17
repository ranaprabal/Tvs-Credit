const fal = require("@fal-ai/serverless-client")
const dotenv = require("dotenv")
dotenv.config()

const generateImage = async (req, res) => {
  try {
    const userDetails = req.body
    let prompt
    if (userDetails.choosenProduct.productName == "Two Wheeler Loan") {
      prompt = `Create an image showing Beautiful ${userDetails.age} year old indian ${userDetails.gender} happily riding a new bike in ${userDetails.location_type},The scene should convey freedom and adventure. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "Used Car Loan") {
      prompt = `Generate an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} standing next to a stylish used car in ${userDetails.location_type}, The background should depict a vibrant city street. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "Consumer Durable Loan") {
      prompt = `Design an image featuring Beautiful ${userDetails.age} year old indian ${userDetails.gender} in their cozy home in ${userDetails.location_type}, surrounded by new appliances like a washing machine and refrigerator. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "Tractor Loan") {
      prompt = `Create an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} driving a powerful tractor across a field in ${userDetails.location_type},  The scene should reflect agricultural prosperity. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "InstaCard") {
      prompt = `Generate an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} using an InstaCard at a trendy cafe in ${userDetails.location_type},  The setting should be modern and inviting. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "Gold Loan") {
      prompt = `Design an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} proudly displaying their gold jewelry in ${userDetails.location_type}, The background should feel luxurious. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "Loans Against Property") {
      prompt = `Create an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} standing confidently in front of their property in ${userDetails.location_type},  The scene should be professional and reassuring. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (
      userDetails.choosenProduct.productName == "Used Commercial Vehicle Loan"
    ) {
      prompt = `Generate an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} beside a used commercial vehicle, ready for business in ${userDetails.location_type},  also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "Three Wheeler Loan") {
      prompt = `Design an image featuring Beautiful ${userDetails.age} year old indian ${userDetails.gender} driving a three-wheeler in ${userDetails.location_type}, The scene should feel dynamic and practical. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "Mobile Loans") {
      prompt = `Create an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} happily using their new smartphone in ${userDetails.location_type}, The background should be vibrant and youthful. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (userDetails.choosenProduct.productName == "Online Personal Loan") {
      prompt = `Generate an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} relaxing at home in ${userDetails.location_type} while using a laptop, The setting should be comfortable and modern. also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    if (
      userDetails.choosenProduct.productName ==
      "Emerging & Mid-corporate Business Loan"
    ) {
      prompt = `Design an image of Beautiful ${userDetails.age} year old indian ${userDetails.gender} in a business setting in ${userDetails.location_type}, discussing growth strategies with colleagues also include the positive impact that can be created by ${userDetails.choosenProduct.productName}`
    }

    fal.config({
      credentials: process.env.FALAI_API_KEY,
    })

    const result = await fal.subscribe("fal-ai/lora", {
      input: {
        model_name: "stabilityai/stable-diffusion-xl-base-1.0",
        prompt: prompt,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log)
        }
      },
    })

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to generate error",
      error: err.message,
    })
  }
}

module.exports = generateImage
