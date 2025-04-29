import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type FormType = {
  dep_name: string
  description: string
}

const AddDepartment = () => {
  const [department, setDepartment] = useState<FormType>({
    dep_name: "",
    description: "",
  })

  const navigate = useNavigate()

  const handleChange = (e: any) => {
    const { name, value } = e.target
    
    setDepartment({...department, [name] : value})
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!department.dep_name || department.dep_name.trim() === '') {
      alert('Department name is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/department/add', department, {
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        navigate('/admin-dashboard/departments')
      }
    } catch (error) {
      if (axios.isAxiosError(error) &&
      error.response &&
      !error.response.data.success) {
        alert(error.response.data.error)
      }
    }
  }
  return (
    <div className="px-14 bg-background">
      <div className="max-w-3xl w-fit mx-auto mt-10 bg-white px-14 py-16">
        <h3 className="source-sans-3-semibold text-2xl text-center mb-8">Add Department</h3>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="dep_name"  className="source-sans-3-medium">Deparment Name</label>
            <input type="text" placeholder="Enter Dep Name" name="dep_name" className="border border-black/30 px-4 py-2 w-fit outline-none" onChange={handleChange}/>
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="source-sans-3-medium">Description</label>
            <textarea name="description" placeholder="Description" className="px-4 py-2 border border-black/30 w-fit outline-none" onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="px-4 py-2 border w-fit mt-4 bg-secondary text-white cursor-pointer">
            Add Department
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddDepartment