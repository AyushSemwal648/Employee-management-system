import mongoose from "mongoose";
import { Schema } from "mongoose";

const leaveSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  leaveType: { type: String, enum: ['sick', 'casual'], required: true },
  fromDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isHalfDay: { type: Boolean, default: false },
  halfDayPeriod: { type: String, enum: ['morning', 'afternoon'] },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  appliedDate: { type: Date, default: Date.now },
  totalDays: { type: Number, required: true }
})

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;