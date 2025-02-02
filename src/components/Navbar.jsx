
const Navbar = () => {
    return(
        <>
            <div className="flex items-center justify-between max-w-full p-4 bg-white shadow-xl">
                <div id="logo" className="ml-2 text-2xl font-bold" >NutritionistGenAI</div>
                <div>
                <button className="  bg-[#5A802D] text-white p-3.5 rounded-xl font-semibold border-3  text-xl w-30">Login</button>
                <button className=" mr-2 ml-3 p-3 rounded-xl font-semibold text-[#5A802D] border-[#5A802D] border-3 text-xl">SignUp</button>
                </div>
            </div>

        </>
    );
}

export default Navbar