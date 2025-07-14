import type { Request, Response } from "express";
import Employee from "../models/employee.ts";
import User from "../models/user.ts";
import bcrypt from "bcrypt"
import multer from "multer"
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }

})

const upload = multer({ storage: storage })

const addEmployee = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      dob,
      doj,
      gender,
      department,
      phoneNumber,
      salary,
      role,
      bankBranch,
      bankIfsc,
      accountNumber,
      employeeId
    } = req.body



    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ success: false, error: "user Already Registered in emp" })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      image: req.file ? req.file.filename : ""
    })

    const savedUser = await newUser.save()

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      doj,
      gender,
      phoneNumber,
      accountNumber,
      bankBranch,
      bankIfsc,
      department,
      salary

    })

    await newEmployee.save()

    return res.status(200).json({ success: true, message: "employee created" })
  } catch (error) {
    return res.status(500).json({ success: false, error: "server error in adding employee" })
  }

}



const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().populate('userId', { password: 0 }).populate("department")
    return res.status(200).json({ success: true, employees })
  } catch (error) {
    return res.status(500).json({ success: false, error: "get Employees Server Error" })
  }
}

const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let employee;
    employee = await Employee.findById({ _id: id }).populate('userId', { password: 0 }).populate("department")
    if (!employee) {
      employee = await Employee.findOne({ userId: id }).populate('userId', { password: 0 }).populate("department")
    }
    return res.status(200).json({ success: true, employee })
  } catch (error) {
    return res.status(500).json({ success: false, error: "view employee Server Error" })
  }
}


const UpdateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get the fields from request body
    const {
      name,
      email,
      dob,
      doj,
      gender,
      department,
      phoneNumber,
      salary,
      role,
      bankBranch,
      bankIfsc,
      accountNumber,
      employeeId
    } = req.body;

    // First find the employee to get the userId
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Get current user data to access the current image filename
    const currentUser = await User.findById(employee.userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, error: "User associated with employee not found" });
    }

    // Update the user information
    const updateUserData: any = {};
    if (name) updateUserData.name = name;
    if (email) updateUserData.email = email;
    if (role) updateUserData.role = role;

    // Check if new image is uploaded
    if (req.file) {
      // Delete previous image if it exists
      if (currentUser.image) {
        const imagePath = path.join(process.cwd(), "public/uploads", currentUser.image);

        // Check if file exists before attempting to delete
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
            console.log(`Previous image deleted: ${currentUser.image}`);
          } catch (err) {
            console.error(`Error deleting previous image: ${err}`);
            // Continue with the update even if image deletion fails
          }
        }
      }

      // Set new image filename
      updateUserData.image = req.file.filename;
    }

    // Update the user document
    await User.findByIdAndUpdate(
      employee.userId,
      updateUserData,
      { new: true }
    );

    // Prepare employee update data
    const updateEmployeeData: any = {};
    if (employeeId) updateEmployeeData.employeeId = employeeId;
    if (dob) updateEmployeeData.dob = dob;
    if (doj) updateEmployeeData.doj = doj;
    if (gender) updateEmployeeData.gender = gender;
    if (department) updateEmployeeData.department = department;
    if (phoneNumber) updateEmployeeData.phoneNumber = phoneNumber;
    if (salary) updateEmployeeData.salary = Number(salary);
    if (bankBranch) updateEmployeeData.bankBranch = bankBranch;
    if (bankIfsc) updateEmployeeData.bankIfsc = bankIfsc;
    if (accountNumber) updateEmployeeData.accountNumber = accountNumber;

    // Update the employee document
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updateEmployeeData,
      { new: true }
    ).populate('userId', { password: 0 }).populate("department");

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee
    });

  } catch (error) {
    console.error("Update employee error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error in updating employee"
    });
  }
};


// Delete Employee

const DeleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the employee to get the associated userId
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    // Get the user ID from the employee record
    const userId = employee.userId;

    // Find the user to get image filename (for deletion)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User associated with employee not found"
      });
    }

    // Delete the image file if it exists
    if (user.image) {
      const imagePath = path.join(process.cwd(), "public/uploads", user.image);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Employee image deleted: ${user.image}`);
        } catch (err) {
          console.error(`Error deleting employee image: ${err}`);
          // Continue with deletion even if image removal fails
        }
      }
    }

    // Delete the employee document
    await Employee.findByIdAndDelete(id);

    // Delete the associated user document
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });

  } catch (error) {
    console.error("Delete employee error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error in deleting employee"
    });
  }
};

const fetchEmployeesByDepId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employees = await Employee.find({ department: id })
    return res.status(200).json({ success: true, employees })
  } catch (error) {
    return res.status(500).json({ success: false, error: "get EmployeesByDepId Server Error" })
  }
}


export { addEmployee, upload, getEmployees, getEmployee, UpdateEmployee, DeleteEmployee, fetchEmployeesByDepId }