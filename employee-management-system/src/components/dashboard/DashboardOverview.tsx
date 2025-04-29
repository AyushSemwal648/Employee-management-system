import employee from "../../assets/employees.svg";
import working from "../../assets/working.svg";

const DashboardOverview = () => {
  return (
    <div className="px-14 bg-background">
      <div className="flex mt-10 gap-7">
        <div className="w-[35%]">
          <div className="py-16 px-10 flex justify-between items-center border border-[#E1E1E1] bg-white">
            <div className="text-[#606060] source-sans-3-semibold">
              Total <br /> Employee
            </div>
            <div className="source-sans-3-bold text-5xl text-primary">05</div>
            <img className="" src={employee} alt="" />
          </div>
          <div className="py-16 px-10 flex justify-between items-center border border-[#E1E1E1] bg-white">
            <div className="text-[#606060] source-sans-3-semibold">
              Working
              <br /> Employee
            </div>
            <div className="source-sans-3-bold text-5xl text-primary">04</div>
            <img className="" src={working} alt="" />
          </div>
        </div>
        <div className="w-[60%] flex flex-col justify-end">
          <h3 className="mb-4 source-sans-3-semibold">
            Who is on leave today ?
          </h3>
          <div className="w-full max-h-[300px] overflow-y-scroll bg-white">
            <table className="table-auto w-full border border-[#E1E1E1] rounded-xl ">
              <thead>
                <tr className="border-y border-[#E1E1E1]">
                  <th className="text-left py-5 px-5">Name</th>
                  <th className="text-left py-5 px-5">Leave Type</th>
                  <th className="text-left py-5 px-5">Leave Duration</th>
                </tr>
              </thead>
              <tbody className="">
                <tr className="border-y border-[#E1E1E1]">
                  <td className="text-left py-5 px-5">Ayush Semwal</td>
                  <td className="text-left py-5 px-5">Annual Leave</td>
                  <td className="text-left py-5 px-5">2 days</td>
                </tr>
                <tr className="border-y border-[#E1E1E1]">
                  <td className="text-left py-5 px-5">Prashant Semwal</td>
                  <td className="text-left py-5 px-5">Medical Leave</td>
                  <td className="text-left py-5 px-5">3 days</td>
                </tr>
                <tr className="border-y border-[#E1E1E1]">
                  <td className="text-left py-5 px-5">Vishal Kuriyal</td>
                  <td className="text-left py-5 px-5">Casual Leave</td>
                  <td className="text-left py-5 px-5">1 day</td>
                </tr>
                <tr className="border-y border-[#E1E1E1]">
                  <td className="text-left py-5 px-5">Vishal Kuriyal</td>
                  <td className="text-left py-5 px-5">Casual Leave</td>
                  <td className="text-left py-5 px-5">1 day</td>
                </tr>
                <tr className="border-y border-[#E1E1E1]">
                  <td className="text-left py-5 px-5">Vishal Kuriyal</td>
                  <td className="text-left py-5 px-5">Casual Leave</td>
                  <td className="text-left py-5 px-5">1 day</td>
                </tr>
                <tr className="border-y border-[#E1E1E1]">
                  <td className="text-left py-5 px-5">Vishal Kuriyal</td>
                  <td className="text-left py-5 px-5">Casual Leave</td>
                  <td className="text-left py-5 px-5">1 day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
