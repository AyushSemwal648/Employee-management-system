import type { Request, Response } from "express";
import Department from "../models/department.ts";


const addDepartment = async (req: Request, res: Response) => {
  try {
    const { dep_name, description } = req.body;
    console.log("Attempting to save department:", { dep_name, description });

    if (!dep_name || dep_name.trim() === '') {
      return res.status(400).json({ success: false, error: "Department name is required" });
    }

    const newDep = new Department({
      dep_name,
      description
    })

      await newDep.save()
    return res.status(200).json({ success: true, department: newDep })
  } catch (error) {
    console.error("Department save error:", error);
    return res.status(500).json({ success: false, error: "add Department Server Error" })
  }
}

const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find()
    return res.status(200).json({ success: true, departments })
  } catch (error) {
    return res.status(500).json({ success: false, error: "get Department Server Error" })
  }
}

const getDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id })
    return res.status(200).json({ success: true, department })
  } catch (error) {
    return res.status(500).json({ success: false, error: "edit Department Server Error" })
  }
}

const UpdateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updateDep = await Department.findByIdAndUpdate({ _id: id }, {
      dep_name,
      description
    })
    return res.status(200).json({ success: true, updateDep })
  } catch (error) {
    return res.status(500).json({ success: false, error: "edit Department Server Error" })
  }
}

const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteDep = await Department.findByIdAndDelete({ _id: id })
    return res.status(200).json({ success: true, deleteDep })
  } catch (error) {
    return res.status(500).json({ success: false, error: "edit Department Server Error" })
  }
}

export { addDepartment, getDepartments, getDepartment, UpdateDepartment, deleteDepartment }