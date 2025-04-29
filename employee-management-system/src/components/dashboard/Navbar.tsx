import { useAuth } from "../../context/AuthContext";
import { RiLogoutCircleRFill } from "react-icons/ri";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <div className="h-fit px-14 bg-background">
      <div className="flex justify-between items-center border-b border-[#E0E0E0] py-6 ">
        <p className="source-sans-3-semibold text-secondary">
          Welcome {user?.name}
        </p>
        <div className="flex items-center gap-10">
          <button className="flex gap-2 items-center bg-secondary px-6 py-2 cursor-pointer">
            <RiLogoutCircleRFill className="text-white" />
            <span className="text-white source-sans-3-medium">Logout</span>
          </button>
          <div className="flex gap-4 items-center">
            <div className="source-sans-3-regular">
              <p className="">{user?.name}</p>
              <p className="">{user?.role}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
