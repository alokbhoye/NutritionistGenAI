import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom"; // ⬅️ added useLocation
import { useEffect } from "react";

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // ⬅️ current path

  useEffect(() => {
    if (isSignedIn && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate, location.pathname]); // ⬅️ include location.pathname

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white shadow-xl">
      <div id="logo" className="ml-1 text-2xl font-bold text-black">NutritionistGenAI.</div>
      <div>
        {!isSignedIn ? (
          <>
            <SignInButton>
              <button className="bg-[#5A802D] text-white p-2 rounded-xl font-semibold border-3 text-sm w-16 shadow-md hover:bg-[#4d6c25] transition-all">Login</button>
            </SignInButton>
            <SignUpButton>
              <button className="mr-2 ml-3 p-1.5 rounded-xl font-semibold text-[#5A802D] border-[#5A802D] border-3 text-sm shadow-md hover:bg-[#bcbcbc] transition-all">SignUp</button>
            </SignUpButton>
          </>
        ) : (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.firstName}</span>
            <UserButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
