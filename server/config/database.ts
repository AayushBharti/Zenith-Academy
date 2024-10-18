import mongoose from "mongoose"

// Define the connection function

const DBconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string)
    console.log("DB Connected Successfully")
  } catch (error) {
    console.error("DB Connection Failed:", error)
    process.exit(1)
  }
}

// Export the connection function
export { DBconnect }

// const DBconnect = () => {
//   mongoose
//     .connect(process.env.MONGODB_URL as string)
//     .then(() => console.log("DB Connected Successfully"))
//     .catch((error) => {
//       console.log("DB Connection Failed")
//       console.error(error)
//       process.exit(1)
//     })
// }
