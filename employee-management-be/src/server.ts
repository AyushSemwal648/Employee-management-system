import dotenv from "dotenv"
// Load environment variables before other imports
dotenv.config();

import express from "express";
import cors from "cors"
import { connectToDatabase } from "./config/db.ts";
import authRouter from "./routes/auth.ts"
import departmentRouter from "./routes/department.ts"
import employeeRouter from "./routes/employee.ts"
import salaryRouter from "./routes/salary.ts"
import leaveRouter from "./routes/leave.ts"

const app = express()
const port = process.env.PORT

async function startServer() {
  try {
    await connectToDatabase();
    // Middleware
    app.use(cors())
    app.use(express.json())
    app.use(express.static('public/uploads'))
    app.use('/api/auth', authRouter)
    app.use('/api/department', departmentRouter)
    app.use('/api/employees', employeeRouter)
    app.use('/api/salary', salaryRouter)
    app.use('/api/leave',leaveRouter)
    
    
    // // Routes
    // app.use('/api', routes);
    
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();