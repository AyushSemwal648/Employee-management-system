import type { Request, Response } from "express";
import Salary from "../models/salary.ts";

const addSalary = async (req: Request, res: Response) => {
  try {
    const { employeeId, basicSalary, payDate } = req.body
    const newSalary = new Salary({
      employeeId,
      basicSalary,
      payDate,
      netSalary: basicSalary
    })

    await newSalary.save()

    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false , error: "salary add server error"})

  }
}

export { addSalary }