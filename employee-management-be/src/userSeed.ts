import User from "./models/user.ts"
import bcrypt from "bcrypt"
import { connectToDatabase } from "./config/db.ts"
const userRegister = async () => {
  connectToDatabase()
  try {
    const hashPassword = await bcrypt.hash("Makedollars@12345", 10)
    const newUser = new User({
      name: "Diksha Kuriyal",
      email: "admin@techqilla.com",
      password: hashPassword,
      role: "admin",
      profileImage: ""
    })

    await newUser.save()
   } catch (error) {
    console.log(error)
  }
}

userRegister();