import type { Request, Response } from "express";
import Leave from "../models/leave.ts";
import Employee from "../models/employee.ts";
import { Types } from "mongoose";

const MONTHLY_LEAVE_ALLOCATION = {
  casual: 1,
  sick: 1
};

// Define interfaces for populated documents
interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
}

interface PopulatedDepartment {
  _id: Types.ObjectId;
  name: string;
}

interface PopulatedEmployee {
  _id: Types.ObjectId;
  userId: PopulatedUser;
  employeeId: string;
  department: PopulatedDepartment;
  doj: Date;
  dob?: Date;
  gender?: string;
  phoneNumber?: string;
  salary: number;
}

// Type guard to check if employeeId is populated
const isPopulatedEmployee = (employeeId: any): employeeId is PopulatedEmployee => {
  return employeeId && typeof employeeId === 'object' && 'userId' in employeeId;
};

// Helper function to safely access populated employee data
const getEmployeeInfo = (employeeId: any) => {
  if (isPopulatedEmployee(employeeId)) {
    return {
      name: employeeId.userId?.name || 'Unknown',
      employeeCode: employeeId.employeeId || 'N/A',
      department: employeeId.department?.name || 'N/A'
    };
  }
  return {
    name: 'Unknown',
    employeeCode: 'N/A',
    department: 'N/A'
  };
};

// Helper function to calculate available leaves based on date of joining
const calculateAvailableLeaves = (doj: Date, leaveType: keyof typeof MONTHLY_LEAVE_ALLOCATION) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const joiningYear = doj.getFullYear();
  
  let startMonth: number;
  let startYear: number;
  
  // If employee joined in current year, start from joining month
  // If employee joined in previous years, start from January of current year
  if (joiningYear === currentYear) {
    startMonth = doj.getMonth(); // 0-based (January = 0)
    startYear = joiningYear;
  } else {
    startMonth = 0; // January
    startYear = currentYear;
  }
  
  const currentMonth = currentDate.getMonth();
  
  // Calculate months from start month to current month (inclusive)
  let totalMonths: number;
  if (startYear === currentYear) {
    totalMonths = currentMonth - startMonth + 1;
  } else {
    totalMonths = 12; // Full year if joined in previous years
  }
  
  // Ensure we don't go negative
  totalMonths = Math.max(0, totalMonths);
  
  return totalMonths * MONTHLY_LEAVE_ALLOCATION[leaveType];
};

const addLeave = async (req: Request, res: Response) => {
  try {
    const { userId, leaveType, fromDate, endDate, reason, isHalfDay, halfDayPeriod } = req.body;

    // Validate required fields
    if (!userId || !leaveType || !fromDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Validate half day period if half day is selected
    if (isHalfDay && !halfDayPeriod) {
      return res.status(400).json({
        success: false,
        error: "Half day period is required when selecting half day leave"
      });
    }

    // Find employee
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    // Check if employee has date of joining
    if (!employee.doj) {
      return res.status(400).json({
        success: false,
        error: "Employee date of joining not found. Please contact HR."
      });
    }

    // Calculate total days for this leave request
    const startDate = new Date(fromDate);
    const endDateObj = new Date(endDate);
    
    let totalDays: number;
    
    if (isHalfDay) {
      totalDays = 0.5;
      // For half day, ensure fromDate and endDate are the same
      if (startDate.getTime() !== endDateObj.getTime()) {
        return res.status(400).json({
          success: false,
          error: "For half day leave, from date and end date must be the same"
        });
      }
    } else {
      const timeDiff = endDateObj.getTime() - startDate.getTime();
      totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      if (totalDays <= 0) {
        return res.status(400).json({
          success: false,
          error: "End date must be after or equal to start date"
        });
      }
    }

    // Calculate available leaves based on date of joining
    const availableLeaves = calculateAvailableLeaves(
      employee.doj, 
      leaveType as keyof typeof MONTHLY_LEAVE_ALLOCATION
    );

    // Get current year's leave usage
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    // Get all approved and pending leaves for this employee in current year
    const existingLeaves = await Leave.find({
      employeeId: employee._id,
      leaveType: leaveType,
      status: { $in: ['approved', 'pending'] },
      fromDate: { $gte: yearStart, $lte: yearEnd }
    });

    // Calculate total used leaves
    const totalUsedLeaves = existingLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);
    const remainingLeaves = availableLeaves - totalUsedLeaves;

    // Check if employee has enough leave balance
    if (totalDays > remainingLeaves) {
      return res.status(400).json({
        success: false,
        error: `Insufficient ${leaveType} leave balance. You have ${remainingLeaves} days remaining out of ${availableLeaves} available, but requested ${totalDays} days.`
      });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      fromDate: startDate,
      endDate: endDateObj,
      reason,
      totalDays,
      isHalfDay: isHalfDay || false,
      halfDayPeriod: isHalfDay ? halfDayPeriod : undefined
    });

    await newLeave.save();

    console.log('Leave saved successfully:', newLeave);

    // Calculate new remaining balance
    const newRemainingLeaves = remainingLeaves - totalDays;

    return res.status(200).json({
      success: true,
      message: "Leave application submitted successfully",
      leave: newLeave,
      leaveBalance: {
        totalAvailable: availableLeaves,
        totalUsed: totalUsedLeaves + totalDays,
        remaining: newRemainingLeaves,
        monthlyAllocation: MONTHLY_LEAVE_ALLOCATION[leaveType as keyof typeof MONTHLY_LEAVE_ALLOCATION],
        doj: employee.doj
      }
    });

  } catch (error) {
    console.error('Error in addLeave:', error);
    return res.status(500).json({
      success: false,
      error: "Leave add server error",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// Helper function to get comprehensive leave balance for an employee
const getLeaveBalance = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    if (!employee.doj) {
      return res.status(400).json({
        success: false,
        error: "Employee date of joining not found. Please contact HR."
      });
    }

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    // Calculate available leaves for both types
    const availableCasualLeaves = calculateAvailableLeaves(employee.doj, 'casual');
    const availableSickLeaves = calculateAvailableLeaves(employee.doj, 'sick');

    // Get current year's leave usage for both types
    const casualLeaves = await Leave.find({
      employeeId: employee._id,
      leaveType: 'casual',
      status: { $in: ['approved', 'pending'] },
      fromDate: { $gte: yearStart, $lte: yearEnd }
    });

    const sickLeaves = await Leave.find({
      employeeId: employee._id,
      leaveType: 'sick',
      status: { $in: ['approved', 'pending'] },
      fromDate: { $gte: yearStart, $lte: yearEnd }
    });

    const casualUsed = casualLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);
    const sickUsed = sickLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);

    return res.status(200).json({
      success: true,
      leaveBalance: {
        casual: {
          available: availableCasualLeaves,
          used: casualUsed,
          remaining: availableCasualLeaves - casualUsed,
          monthlyAllocation: MONTHLY_LEAVE_ALLOCATION.casual
        },
        sick: {
          available: availableSickLeaves,
          used: sickUsed,
          remaining: availableSickLeaves - sickUsed,
          monthlyAllocation: MONTHLY_LEAVE_ALLOCATION.sick
        },
        doj: employee.doj,
        currentYear: currentYear
      }
    });

  } catch (error) {
    console.error('Error in getLeaveBalance:', error);
    return res.status(500).json({
      success: false,
      error: "Error fetching leave balance"
    });
  }
};

// Helper function to get leave summary with month-wise breakdown
const getLeaveBreakdown = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { year } = req.query;
    
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    if (!employee.doj) {
      return res.status(400).json({
        success: false,
        error: "Employee date of joining not found."
      });
    }

    const doj = employee.doj;
    const joiningYear = doj.getFullYear();
    const joiningMonth = doj.getMonth();

    // Calculate month-wise allocation
    const monthlyBreakdown = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let startMonth = 0;
    if (joiningYear === targetYear) {
      startMonth = joiningMonth;
    }

    for (let month = startMonth; month < 12; month++) {
      const monthStart = new Date(targetYear, month, 1);
      const monthEnd = new Date(targetYear, month + 1, 0);
      
      // Get leaves taken in this month
      const monthLeaves = await Leave.find({
        employeeId: employee._id,
        status: { $in: ['approved', 'pending'] },
        $or: [
          { fromDate: { $gte: monthStart, $lte: monthEnd } },
          { endDate: { $gte: monthStart, $lte: monthEnd } },
          { fromDate: { $lt: monthStart }, endDate: { $gt: monthEnd } }
        ]
      });

      const casualTaken = monthLeaves
        .filter(leave => leave.leaveType === 'casual')
        .reduce((sum, leave) => sum + leave.totalDays, 0);
      
      const sickTaken = monthLeaves
        .filter(leave => leave.leaveType === 'sick')
        .reduce((sum, leave) => sum + leave.totalDays, 0);

      monthlyBreakdown.push({
        month: monthNames[month],
        monthNumber: month + 1,
        allocated: {
          casual: MONTHLY_LEAVE_ALLOCATION.casual,
          sick: MONTHLY_LEAVE_ALLOCATION.sick
        },
        taken: {
          casual: casualTaken,
          sick: sickTaken
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        year: targetYear,
        doj: doj,
        monthlyAllocation: MONTHLY_LEAVE_ALLOCATION, 
        breakdown: monthlyBreakdown
      }
    });

  } catch (error) {
    console.error('Error in getLeaveBreakdown:', error);
    return res.status(500).json({
      success: false,
      error: "Error fetching leave breakdown"
    });
  }
};

const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, leaveType, search } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (leaveType && leaveType !== 'all') {
      filter.leaveType = leaveType;
    }

    // Calculate pagination
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Get leaves with nested employee and user details
    const leaves = await Leave.find(filter)
      .populate({
        path: 'employeeId',
        populate: [
          {
            path: 'userId',
            select: 'name email'
          },
          {
            path: 'department',
            select: 'name'
          }
        ]
      })
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Filter by search if provided
    let filteredLeaves = leaves;
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredLeaves = leaves.filter(leave => {
        const employeeInfo = getEmployeeInfo(leave.employeeId);
        return employeeInfo.name.toLowerCase().includes(searchTerm) || 
               employeeInfo.employeeCode.toLowerCase().includes(searchTerm);
      });
    }

    // Get total count for pagination (this is a simplified approach)
    const totalCount = await Leave.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Format the response
    const formattedLeaves = filteredLeaves.map(leave => {
      const employeeInfo = getEmployeeInfo(leave.employeeId);
      return {
        _id: leave._id,
        employeeName: employeeInfo.name,
        employeeCode: employeeInfo.employeeCode,
        department: employeeInfo.department,
        leaveType: leave.leaveType,
        fromDate: leave.fromDate,
        endDate: leave.endDate,
        totalDays: leave.totalDays,
        isHalfDay: leave.isHalfDay,
        halfDayPeriod: leave.halfDayPeriod,
        reason: leave.reason,
        status: leave.status,
        appliedDate: leave.appliedDate
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        leaves: formattedLeaves,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCount,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1
        }
      }
    });

  } catch (error) {
    console.error('Error in getAllLeaves:', error);
    return res.status(500).json({
      success: false,
      error: "Error fetching leaves",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { leaveId } = req.params;
    const { status, comments } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be 'approved' or 'rejected'"
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { 
        status,
        adminComments: comments || '',
        reviewedDate: new Date()
      },
      { new: true }
    ).populate({
      path: 'employeeId',
      populate: [
        {
          path: 'userId',
          select: 'name email'
        },
        {
          path: 'department',
          select: 'name'
        }
      ]
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave request not found"
      });
    }

    const employeeInfo = getEmployeeInfo(leave.employeeId);

    return res.status(200).json({
      success: true,
      message: `Leave ${status} successfully`,
      leave: {
        _id: leave._id,
        employeeName: employeeInfo.name,
        employeeCode: employeeInfo.employeeCode,
        department: employeeInfo.department,
        leaveType: leave.leaveType,
        fromDate: leave.fromDate,
        endDate: leave.endDate,
        totalDays: leave.totalDays,
        status: leave.status,
        appliedDate: leave.appliedDate
      }
    });

  } catch (error) {
    console.error('Error in updateLeaveStatus:', error);
    return res.status(500).json({
      success: false,
      error: "Error updating leave status"
    });
  }
};

export { addLeave, getLeaveBalance, getLeaveBreakdown, getAllLeaves, updateLeaveStatus };