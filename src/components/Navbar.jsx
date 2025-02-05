
const Navbar = () => {
    return(
        <>
            <div className="flex items-center justify-between max-w-full p-4 bg-white shadow-xl">
                <div id="logo" className="ml-1 text-2xl font-bold text-black" >NutritionistGenAI.</div>
                <div>
                <button className="  bg-[#5A802D] text-white p-2 rounded-xl font-semibold border-3  text-sm w-16 shadow-md hover:bg-[#4d6c25] transition-all">Login</button>
                <button className=" mr-2 ml-3 p-1.5 rounded-xl font-semibold text-[#5A802D] border-[#5A802D] border-3 text-sm shadow-md hover:bg-[#bcbcbc] transition-all">SignUp</button>
                </div>
            </div>

        </>
    );
}

export default Navbar