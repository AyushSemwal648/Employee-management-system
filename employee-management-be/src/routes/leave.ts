
import express from "express"
import authMiddleWare from "../middleware/authMiddleware.ts"
import { addLeave, getLeaveBalance, getLeaveBreakdown } from "../controllers/leaveController.ts"

const router = express.Router()

router.post('/add', authMiddleWare, addLeave)
router.get('/balance/:userId', authMiddleWare, getLeaveBalance)
router.get('/breakdown/:userId', authMiddleWare, getLeaveBreakdown)

export default router