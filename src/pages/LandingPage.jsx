import Navbar from "../components/Navbar";
import Spreader from '../assets/Spreader.png'

const LandingPage = () => {
    return (
        <>
        <div className="bg-[#FBE9D1] w-full h-screen">
        <Navbar></Navbar>
        <img src={Spreader} alt="" className="absolute left-[-260px] z-20 h-73 rotate-330 top-27" />
        <div className="flex flex-col justify-center items-center text-center text-[#5A802D] font-extrabold text-8xl mt-20">
        <div id="tagline">Stay On Track with <br />AI-Powered Nutrition</div>
        </div>
        <div className="flex flex-col justify-center mt-4 text-3xl text-center subtext">
        Get personalized meal plans, track your daily calorie intake, and <br /> discover the nutrients in every meal with our GenAI assistant.
        </div>
        <div className="flex justify-center items-center mt-8 bg-[#FBE9D1]">
        <button className="bg-[#5A802D] text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#4d6c25] transition-all">
        Sign Up Now
        </button>
        </div>

        </div>
        </>
    );
}

export default LandingPage