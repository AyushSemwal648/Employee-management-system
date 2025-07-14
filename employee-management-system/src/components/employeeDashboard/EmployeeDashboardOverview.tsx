import React from "react";

const EmployeeDashboardOverview = () => {
  return (
    <div className="py-28 px-16">
      <div className="grid grid-cols-3 gap-10 items-center justify-center">
        <div className="rounded-2xl overflow-hidden">
          <div className="py-8 flex justify-center bg-primary">
            <p className="source-sans-3-regular text-white">Mark Attendence</p>
          </div>
          <div className="bg-white h-[400px]"></div>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <div className="py-8 flex justify-center bg-primary">
            <p className="source-sans-3-regular text-white">Recent Swipes</p>
          </div>
          <div className="bg-white h-[400px]"></div>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <div className="py-8 flex justify-center bg-primary">
            <p className="source-sans-3-regular text-white">Absent days</p>
          </div>
          <div className="bg-white h-[400px]"></div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardOverview;
