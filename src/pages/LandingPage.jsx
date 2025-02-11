import Navbar from "../components/Navbar";
import Spreader from '../assets/Spreader.png'
import saladBowl from '../assets/Salad Bowl.png'
import { useState, useEffect } from "react";
import getPlanImg from '../assets/getYourPlan.png'
import uploadMealImg from '../assets/UploadMeal.png'
import GeminiImg from '../assets/gemini.png'
import TrackImg from '../assets/TrackProgress.png'
import forkImg from '../assets/WoodenFork.png'
import g1 from '../assets/grid1.png'
import g2 from '../assets/grid2.png'
import g3 from '../assets/grid3.png'
import g4 from '../assets/grid4.png'
import g5 from '../assets/grid5.png'
import spoonImg from '../assets/spoon.png'
import { motion } from "motion/react";


const LandingPage = () => {

    const [x, setX] = useState(0); // Track left movement
    const [scale, setScale] = useState(1); // Track size
    let ticking = false; // Prevent excessive updates

    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                let scrollY = window.scrollY;

                // Move left smoothly (negative x values move it left)
                let newX = Math.min(scrollY * 1.8, 700); // Moves up to -300px left

                // Shrink image smoothly
                let newScale = Math.max(1 - scrollY * 0.001, 0.75); // Shrinks to 65% of size

                // Update state
                setX(-newX);  
                setScale(newScale);  

                ticking = false; // Reset ticking flag
            });

            ticking = true; // Mark as processing
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    
    return (
        <div className="bg-[#FBE9D1]">
        <div className="bg-[#FBE9D1] w-full h-screen">
        <Navbar/>
        <img src={Spreader} alt="" className="absolute left-[-260px] z-20 h-85 rotate-330 top-18" />
        <div className="flex flex-col justify-center items-center text-center text-[#5A802D] font-extrabold text-7xl mt-15">
        <div id="tagline">Stay On Track with <br />AI-Powered Nutrition</div>
        </div>
        <div className="flex flex-col justify-center mt-2 text-lg text-center subtext">
        Get personalized meal plans, track your daily calorie intake, and <br /> discover the nutrients in every meal with our GenAI assistant.
        </div>
        <div className="flex justify-center items-center mt-4 bg-[#FBE9D1]">
              <motion.button
                className="bg-[#5A802D] text-white text-lg font-semibold p-2 rounded-lg shadow-md hover:bg-[#4d6c25] transition-all"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                Sign Up Now
              </motion.button>
            </div>
        <div className="relative w-full mt-25 bg-[#FBE9D1]">
            <div className="absolute inset-0 flex items-center justify-center -top-60">
                <motion.img src={saladBowl} className="h-120" 
                animate={{ x: x, scale: scale }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }} />
            </div>
{/* How it Works Section */}
<div className="absolute inset-0 z-50 flex items-center justify-center -top-60">
    <motion.p
        className="text-5xl font-extrabold text-[#5A802D]"
        initial={{ opacity: 0, y: 20 }}
        animate={x <= -200 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
        transition={{ duration: 1.5, ease: "easeOut" }}
    >
        How it Works?
    </motion.p>

    <motion.img 
    className="absolute right-0 flex overflow-x-hidden h-25"
    src={forkImg}
    initial={{ opacity: 0, y: 20 }}
        animate={x <= -200 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
        transition={{ duration: 1.5, ease: "easeOut" }}
    />
{/* Steps Section - Moved Below "How it Works?" */}
    <div className="absolute mt-70">  
    <div className="flex justify-center items-center gap-10 text-[#5A802D]">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
            <img src={getPlanImg} alt="Calendar Icon" className="w-12 h-12" />
            <p className="mt-2 text-lg font-semibold">Get Your Plan</p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
            <img src={uploadMealImg} alt="Upload Icon" className="w-12 h-12" />
            <p className="mt-2 text-lg font-semibold">Upload Your Meals</p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
            <img src={GeminiImg} alt="Chat Icon" className="w-12 h-12" />
            <p className="mt-2 text-lg font-semibold">Chat with GenAI</p>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col items-center">
            <img src={TrackImg} alt="Progress Icon" className="w-12 h-12" />
            <p className="mt-2 text-lg font-semibold">Track Progress</p>
        </div>
    </div>
</div>
</div>

        <svg width="100%" height="614" viewBox="0 0 1440 614" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-175 614V20.446L-170.528 24.7167L-166.055 29.0537L-161.582 33.3686L-157.11 37.5286L-152.638 41.4452L-148.165 45.0299L-143.693 48.1721L-139.22 50.8053L-134.748 52.8853L-130.275 54.3236L-125.803 55.1202L-121.33 55.2308L-116.858 54.6776L-112.385 53.4384L-107.913 51.5797L-103.44 49.1014L-98.9675 46.1142L-94.495 42.6844L-90.0225 38.8563L-85.55 34.7848L-81.0775 30.5141L-76.605 26.1771L-72.1325 21.8622L-67.66 17.7022L-63.1875 13.7856L-58.715 10.2009L-54.2425 7.05875L-49.77 4.42554L-45.2975 2.34555L-40.825 0.907245L-36.3525 0.110645L-31.88 0L-27.4075 0.553193L-22.935 1.79236L-18.4625 3.65108L-13.99 6.12939L-9.5175 9.11663L-5.04501 12.5464L-0.572495 16.3745L3.89999 20.446L8.37248 24.7167L12.845 29.0537L17.3175 33.3686L21.79 37.5286L26.2625 41.4452L30.735 45.0299L35.2075 48.1721L39.68 50.8053L44.1525 52.8853L48.625 54.3236L53.0975 55.1202L57.57 55.2308L62.0425 54.6776L66.515 53.4384L70.9875 51.5797L75.46 49.1014L79.9325 46.1142L84.405 42.6844L88.8775 38.8563L93.35 34.7848L97.8225 30.5141L102.295 26.1771L106.767 21.8622L111.24 17.7022L115.712 13.7856L120.185 10.2009L124.657 7.05875L129.13 4.42554L133.603 2.34555L138.075 0.907245L142.547 0.110645L147.02 0L151.492 0.553193L155.965 1.79236L160.438 3.65108L164.91 6.12939L169.382 9.11663L173.855 12.5464L178.327 16.3745L182.8 20.446L187.272 24.7167L191.745 29.0537L196.217 33.3686L200.69 37.5286L205.162 41.4452L209.635 45.0299L214.107 48.1721L218.58 50.8053L223.052 52.8853L227.525 54.3236L231.997 55.1202L236.47 55.2308L240.943 54.6776L245.415 53.4384L249.887 51.5797L254.36 49.1014L258.832 46.1142L263.305 42.6844L267.777 38.8563L272.25 34.7848L276.723 30.5141L281.195 26.1771L285.667 21.8622L290.14 17.7022L294.612 13.7856L299.085 10.2009L303.557 7.05875L308.03 4.42554L312.502 2.34555L316.975 0.907245L321.448 0.110645L325.92 0L330.392 0.553193L334.865 1.79236L339.337 3.65108L343.81 6.12939L348.282 9.11663L352.755 12.5464L357.227 16.3745L361.7 20.446L366.172 24.7167L370.645 29.0537L375.117 33.3686L379.59 37.5286L384.062 41.4452L388.535 45.0299L393.007 48.1721L397.48 50.8053L401.952 52.8853L406.425 54.3236L410.898 55.1202L415.37 55.2308L419.842 54.6776L424.315 53.4384L428.787 51.5797L433.26 49.1014L437.732 46.1142L442.205 42.6844L446.677 38.8563L451.15 34.7848L455.622 30.5141L460.095 26.1771L464.568 21.8622L469.04 17.7022L473.512 13.7856L477.985 10.2009L482.457 7.05875L486.93 4.42554L491.402 2.34555L495.875 0.907245L500.347 0.110645L504.82 0L509.292 0.553193L513.765 1.79236L518.237 3.65108L522.71 6.12939L527.182 9.11663L531.655 12.5464L536.127 16.3745L540.6 20.446L545.073 24.7167L549.545 29.0537L554.017 33.3686L558.49 37.5286L562.962 41.4452L567.435 45.0299L571.908 48.1721L576.38 50.8053L580.852 52.8853L585.325 54.3236L589.797 55.1202L594.27 55.2308L598.742 54.6776L603.215 53.4384L607.688 51.5797L612.16 49.1014L616.633 46.1142L621.105 42.6844L625.577 38.8563L630.05 34.7848L634.522 30.5141L638.995 26.1771L643.467 21.8622L647.94 17.7022L652.412 13.7856L656.885 10.2009L661.357 7.05875L665.83 4.42554L670.302 2.34555L674.775 0.907245L679.247 0.110645L683.72 0L688.192 0.553193L692.665 1.79236L697.137 3.65108L701.61 6.12939L706.083 9.11663L710.555 12.5464L715.027 16.3745L719.5 20.446L723.972 24.7167L728.445 29.0537L732.917 33.3686L737.39 37.5286L741.862 41.4452L746.335 45.0299L750.807 48.1721L755.28 50.8053L759.752 52.8853L764.225 54.3236L768.698 55.1202L773.17 55.2308L777.642 54.6776L782.115 53.4384L786.587 51.5797L791.06 49.1014L795.532 46.1142L800.005 42.6844L804.477 38.8563L808.95 34.7848L813.422 30.5141L817.895 26.1771L822.367 21.8622L826.84 17.7022L831.312 13.7856L835.785 10.2009L840.258 7.05875L844.73 4.42554L849.202 2.34555L853.675 0.907245L858.147 0.110645L862.62 0L867.092 0.553193L871.565 1.79236L876.037 3.65108L880.51 6.12939L884.983 9.11663L889.455 12.5464L893.927 16.3745L898.4 20.446L902.872 24.7167L907.345 29.0537L911.817 33.3686L916.29 37.5286L920.762 41.4452L925.235 45.0299L929.708 48.1721L934.18 50.8053L938.652 52.8853L943.125 54.3236L947.598 55.1202L952.07 55.2308L956.542 54.6776L961.015 53.4384L965.487 51.5797L969.96 49.1014L974.432 46.1142L978.905 42.6844L983.377 38.8563L987.85 34.7848L992.323 30.5141L996.795 26.1771L1001.27 21.8622L1005.74 17.7022L1010.21 13.7856L1014.68 10.2009L1019.16 7.05875L1023.63 4.42554L1028.1 2.34555L1032.57 0.907245L1037.05 0.110645L1041.52 0L1045.99 0.553193L1050.46 1.79236L1054.94 3.65108L1059.41 6.12939L1063.88 9.11663L1068.35 12.5464L1072.83 16.3745L1077.3 20.446L1081.77 24.7167L1086.24 29.0537L1090.72 33.3686L1095.19 37.5286L1099.66 41.4452L1104.14 45.0299L1108.61 48.1721L1113.08 50.8053L1117.55 52.8853L1122.02 54.3236L1126.5 55.1202L1130.97 55.2308L1135.44 54.6776L1139.91 53.4384L1144.39 51.5797L1148.86 49.1014L1153.33 46.1142L1157.8 42.6844L1162.28 38.8563L1166.75 34.7848L1171.22 30.5141L1175.69 26.1771L1180.17 21.8622L1184.64 17.7022L1189.11 13.7856L1193.58 10.2009L1198.06 7.05875L1202.53 4.42554L1207 2.34555L1211.47 0.907245L1215.95 0.110645L1220.42 0L1224.89 0.553193L1229.36 1.79236L1233.84 3.65108L1238.31 6.12939L1242.78 9.11663L1247.25 12.5464L1251.73 16.3745L1256.2 20.446L1260.67 24.7167L1265.15 29.0537L1269.62 33.3686L1274.09 37.5286L1278.56 41.4452L1283.03 45.0299L1287.51 48.1721L1291.98 50.8053L1296.45 52.8853L1300.92 54.3236L1305.4 55.1202L1309.87 55.2308L1314.34 54.6776L1318.82 53.4384L1323.29 51.5797L1327.76 49.1014L1332.23 46.1142L1336.7 42.6844L1341.18 38.8563L1345.65 34.7848L1350.12 30.5141L1354.59 26.1771L1359.07 21.8622L1363.54 17.7022L1368.01 13.7856L1372.48 10.2009L1376.96 7.05875L1381.43 4.42554L1385.9 2.34555L1390.38 0.907245L1394.85 0.110645L1399.32 0L1403.79 0.553193L1408.27 1.79236L1412.74 3.65108L1417.21 6.12939L1421.68 9.11663L1426.15 12.5464L1430.63 16.3745L1435.1 20.446L1439.57 24.7167L1444.04 29.0537L1448.52 33.3686L1452.99 37.5286L1457.46 41.4452L1461.93 45.0299L1466.41 48.1721L1470.88 50.8053L1475.35 52.8853L1479.82 54.3236L1484.3 55.1202L1488.77 55.2308L1493.24 54.6776L1497.71 53.4384L1502.19 51.5797L1506.66 49.1014L1511.13 46.1142L1515.6 42.6844L1520.08 38.8563L1524.55 34.7848L1529.02 30.5141L1533.49 26.1771L1537.97 21.8622L1542.44 17.7022L1546.91 13.7856L1551.38 10.2009L1555.86 7.05875L1560.33 4.42554L1564.8 2.34555L1569.27 0.907245L1573.75 0.110645L1578.22 0L1582.69 0.553193L1587.17 1.79236L1591.64 3.65108L1596.11 6.12939L1600.58 9.11663L1605.05 12.5464L1609.53 16.3745L1614 20.446V614H-175Z" fill="white"/>
        </svg> 
 
        </div>
        
        <section className="relative -mt-10">
        <div className="">
            <motion.img 
                className="absolute left-0 transform rotate-180 -translate-y-1/2 h-25 top-1/4"
                src={forkImg}
                initial={{ opacity: 0, y: 20 }}
                animate={x <= -200 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.p
                className="absolute text-5xl font-extrabold text-white transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/4"
                initial={{ opacity: 0, y: 20 }}
                animate={x <= -200 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                >
                Why Choose Us...
            </motion.p>    
   
        </div>


  
        <svg
          className="block w-full"
          viewBox="-175 0 1789 614"
          fill="#5A802D"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M-175 614V20.446L-170.528 24.7167L-166.055 29.0537L-161.582 33.3686L-157.11 37.5286L-152.638 41.4452L-148.165 45.0299L-143.693 48.1721L-139.22 50.8053L-134.748 52.8853L-130.275 54.3236L-125.803 55.1202L-121.33 55.2308L-116.858 54.6776L-112.385 53.4384L-107.913 51.5797L-103.44 49.1014L-98.9675 46.1142L-94.495 42.6844L-90.0225 38.8563L-85.55 34.7848L-81.0775 30.5141L-76.605 26.1771L-72.1325 21.8622L-67.66 17.7022L-63.1875 13.7856L-58.715 10.2009L-54.2425 7.05875L-49.77 4.42554L-45.2975 2.34555L-40.825 0.907245L-36.3525 0.110645L-31.88 0L-27.4075 0.553193L-22.935 1.79236L-18.4625 3.65108L-13.99 6.12939L-9.5175 9.11663L-5.04501 12.5464L-0.572495 16.3745L3.89999 20.446L8.37248 24.7167L12.845 29.0537L17.3175 33.3686L21.79 37.5286L26.2625 41.4452L30.735 45.0299L35.2075 48.1721L39.68 50.8053L44.1525 52.8853L48.625 54.3236L53.0975 55.1202L57.57 55.2308L62.0425 54.6776L66.515 53.4384L70.9875 51.5797L75.46 49.1014L79.9325 46.1142L84.405 42.6844L88.8775 38.8563L93.35 34.7848L97.8225 30.5141L102.295 26.1771L106.767 21.8622L111.24 17.7022L115.712 13.7856L120.185 10.2009L124.657 7.05875L129.13 4.42554L133.603 2.34555L138.075 0.907245L142.547 0.110645L147.02 0L151.492 0.553193L155.965 1.79236L160.438 3.65108L164.91 6.12939L169.382 9.11663L173.855 12.5464L178.327 16.3745L182.8 20.446L187.272 24.7167L191.745 29.0537L196.217 33.3686L200.69 37.5286L205.162 41.4452L209.635 45.0299L214.107 48.1721L218.58 50.8053L223.052 52.8853L227.525 54.3236L231.997 55.1202L236.47 55.2308L240.943 54.6776L245.415 53.4384L249.887 51.5797L254.36 49.1014L258.832 46.1142L263.305 42.6844L267.777 38.8563L272.25 34.7848L276.723 30.5141L281.195 26.1771L285.667 21.8622L290.14 17.7022L294.612 13.7856L299.085 10.2009L303.557 7.05875L308.03 4.42554L312.502 2.34555L316.975 0.907245L321.448 0.110645L325.92 0L330.392 0.553193L334.865 1.79236L339.337 3.65108L343.81 6.12939L348.282 9.11663L352.755 12.5464L357.227 16.3745L361.7 20.446L366.172 24.7167L370.645 29.0537L375.117 33.3686L379.59 37.5286L384.062 41.4452L388.535 45.0299L393.007 48.1721L397.48 50.8053L401.952 52.8853L406.425 54.3236L410.898 55.1202L415.37 55.2308L419.842 54.6776L424.315 53.4384L428.787 51.5797L433.26 49.1014L437.732 46.1142L442.205 42.6844L446.677 38.8563L451.15 34.7848L455.622 30.5141L460.095 26.1771L464.568 21.8622L469.04 17.7022L473.512 13.7856L477.985 10.2009L482.457 7.05875L486.93 4.42554L491.402 2.34555L495.875 0.907245L500.347 0.110645L504.82 0L509.292 0.553193L513.765 1.79236L518.237 3.65108L522.71 6.12939L527.182 9.11663L531.655 12.5464L536.127 16.3745L540.6 20.446L545.073 24.7167L549.545 29.0537L554.017 33.3686L558.49 37.5286L562.962 41.4452L567.435 45.0299L571.908 48.1721L576.38 50.8053L580.852 52.8853L585.325 54.3236L589.797 55.1202L594.27 55.2308L598.742 54.6776L603.215 53.4384L607.688 51.5797L612.16 49.1014L616.633 46.1142L621.105 42.6844L625.577 38.8563L630.05 34.7848L634.522 30.5141L638.995 26.1771L643.467 21.8622L647.94 17.7022L652.412 13.7856L656.885 10.2009L661.357 7.05875L665.83 4.42554L670.302 2.34555L674.775 0.907245L679.247 0.110645L683.72 0L688.192 0.553193L692.665 1.79236L697.137 3.65108L701.61 6.12939L706.083 9.11663L710.555 12.5464L715.027 16.3745L719.5 20.446L723.972 24.7167L728.445 29.0537L732.917 33.3686L737.39 37.5286L741.862 41.4452L746.335 45.0299L750.807 48.1721L755.28 50.8053L759.752 52.8853L764.225 54.3236L768.698 55.1202L773.17 55.2308L777.642 54.6776L782.115 53.4384L786.587 51.5797L791.06 49.1014L795.532 46.1142L800.005 42.6844L804.477 38.8563L808.95 34.7848L813.422 30.5141L817.895 26.1771L822.367 21.8622L826.84 17.7022L831.312 13.7856L835.785 10.2009L840.258 7.05875L844.73 4.42554L849.202 2.34555L853.675 0.907245L858.147 0.110645L862.62 0L867.092 0.553193L871.565 1.79236L876.037 3.65108L880.51 6.12939L884.983 9.11663L889.455 12.5464L893.927 16.3745L898.4 20.446L902.872 24.7167L907.345 29.0537L911.817 33.3686L916.29 37.5286L920.762 41.4452L925.235 45.0299L929.708 48.1721L934.18 50.8053L938.652 52.8853L943.125 54.3236L947.598 55.1202L952.07 55.2308L956.542 54.6776L961.015 53.4384L965.487 51.5797L969.96 49.1014L974.432 46.1142L978.905 42.6844L983.377 38.8563L987.85 34.7848L992.323 30.5141L996.795 26.1771L1001.27 21.8622L1005.74 17.7022L1010.21 13.7856L1014.68 10.2009L1019.16 7.05875L1023.63 4.42554L1028.1 2.34555L1032.57 0.907245L1037.05 0.110645L1041.52 0L1045.99 0.553193L1050.46 1.79236L1054.94 3.65108L1059.41 6.12939L1063.88 9.11663L1068.35 12.5464L1072.83 16.3745L1077.3 20.446L1081.77 24.7167L1086.24 29.0537L1090.72 33.3686L1095.19 37.5286L1099.66 41.4452L1104.14 45.0299L1108.61 48.1721L1113.08 50.8053L1117.55 52.8853L1122.02 54.3236L1126.5 55.1202L1130.97 55.2308L1135.44 54.6776L1139.91 53.4384L1144.39 51.5797L1148.86 49.1014L1153.33 46.1142L1157.8 42.6844L1162.28 38.8563L1166.75 34.7848L1171.22 30.5141L1175.69 26.1771L1180.17 21.8622L1184.64 17.7022L1189.11 13.7856L1193.58 10.2009L1198.06 7.05875L1202.53 4.42554L1207 2.34555L1211.47 0.907245L1215.95 0.110645L1220.42 0L1224.89 0.553193L1229.36 1.79236L1233.84 3.65108L1238.31 6.12939L1242.78 9.11663L1247.25 12.5464L1251.73 16.3745L1256.2 20.446L1260.67 24.7167L1265.15 29.0537L1269.62 33.3686L1274.09 37.5286L1278.56 41.4452L1283.03 45.0299L1287.51 48.1721L1291.98 50.8053L1296.45 52.8853L1300.92 54.3236L1305.4 55.1202L1309.87 55.2308L1314.34 54.6776L1318.82 53.4384L1323.29 51.5797L1327.76 49.1014L1332.23 46.1142L1336.7 42.6844L1341.18 38.8563L1345.65 34.7848L1350.12 30.5141L1354.59 26.1771L1359.07 21.8622L1363.54 17.7022L1368.01 13.7856L1372.48 10.2009L1376.96 7.05875L1381.43 4.42554L1385.9 2.34555L1390.38 0.907245L1394.85 0.110645L1399.32 0L1403.79 0.553193L1408.27 1.79236L1412.74 3.65108L1417.21 6.12939L1421.68 9.11663L1426.15 12.5464L1430.63 16.3745L1435.1 20.446L1439.57 24.7167L1444.04 29.0537L1448.52 33.3686L1452.99 37.5286L1457.46 41.4452L1461.93 45.0299L1466.41 48.1721L1470.88 50.8053L1475.35 52.8853L1479.82 54.3236L1484.3 55.1202L1488.77 55.2308L1493.24 54.6776L1497.71 53.4384L1502.19 51.5797L1506.66 49.1014L1511.13 46.1142L1515.6 42.6844L1520.08 38.8563L1524.55 34.7848L1529.02 30.5141L1533.49 26.1771L1537.97 21.8622L1542.44 17.7022L1546.91 13.7856L1551.38 10.2009L1555.86 7.05875L1560.33 4.42554L1564.8 2.34555L1569.27 0.907245L1573.75 0.110645L1578.22 0L1582.69 0.553193L1587.17 1.79236L1591.64 3.65108L1596.11 6.12939L1600.58 9.11663L1605.05 12.5464L1609.53 16.3745L1614 20.446V614H-175Z"
            fill="#98BE69"
          />
          
        </svg>
        
  <div className="absolute grid grid-cols-2 grid-rows-2 gap-6 p-10 top-50 bg-[#98BE69]">

  {/* 1st Cell */}
        {/* 1st Cell */}
      <motion.div
        id="PersonalizedMealPlans"
        className="relative landingPageGrid"
        // Add hover & tap scale here
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.9 }}
      >
        <img
          src={g1}
          alt="heartBowl"
          className="absolute top-0 right-0 -translate-y-10 translate-x-35 h-65"
        />
        <h3 className="text-4xl font-bold">
          Personalized <br /> Meal Plans
        </h3>
        <p>
          Our AI tailors daily calorie and macro <br />
          targets to your specific goals <br />
          and dietary preferences.
        </p>
      </motion.div>

      {/* 2nd Cell */}
      <motion.div
        id="Convenient"
        className="relative landingPageGrid"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <img
          src={g2}
          alt="handphoto"
          className="absolute top-0 right-0 translate-x-0 -translate-y-9 h-55 rounded-2xl"
        />
        <h3 className="text-4xl font-bold">
          Convenient Photo
          <br /> Upload
        </h3>
        <p>
          Simply snap a picture of your meal
          <br />
          no more manual logging or guesswork.
        </p>
      </motion.div>

      {/* 3rd Cell */}
      <motion.div
        id="Real-Time AI Assistance"
        className="relative landingPageGrid"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <img
          src={g3}
          alt="heartBowl"
          className="absolute top-0 right-0 -translate-y-0 translate-x-18 h-45"
        />
        <h3 className="text-4xl font-bold">
          Real-Time AI <br /> Assistance
        </h3>
        <p>
          Chat directly with our GenAI for <br />
          instant nutrition advice,
          meal <br />
          suggestions, and accountability.
        </p>
      </motion.div>

      {/* 4th Cell */}
      <motion.div
        id="Comprehensive Tracking"
        className="relative landingPageGrid"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <img
          src={g4}
          alt="heartBowl"
          className="absolute top-0 right-0 h-40 translate-x-0 translate-y-6"
        />
        <h3 className="text-4xl font-bold">
          Comprehensive <br /> Tracking
        </h3>
        <p>
          Keep tabs on your calorie intake,
          <br />
          macronutrient balance, and
          <br /> progress over time with user-friendly dashboards.
        </p>
      </motion.div>

      {/* 5th Cell */}
      <motion.div
        id="Comprehensive Tracking"
        className="p-4 border-[#5A802D] shadow-xl border-5 rounded-3xl flex flex-col text-[#3D571E] w-283"
        whileHover={{ scale: 1.0 }}
        whileTap={{ scale: 0.98 }}
      >
        <img
          src={g5}
          alt="heartBowl"
          className="absolute top-0 right-0 -translate-x-20 h-35 translate-y-120 w-75"
        />

          <h3 className="text-4xl font-bold">
          Compete With Friends
          </h3>
          <p>
          Take your journey to the next level by inviting friends or family. 
          <br /> Track each other's progress, compare stats, and celebrate milestones together. 
          <br />A friendly challenge keeps everyone motivated—and makes staying healthy more fun!
          </p>

         
        </motion.div> 
        
          
    </div> 
 
</section> 

</div>  
      <div className="flex items-end justify-center w-full bg-[#FBE9D1] h-307">
      </div>
<section id="Footer" className="bg-[#FBE9D1] pt-4 pb-4 flex justify-between">
  <img src={spoonImg} alt="" className="left-0 h-25"/>
      <p className="font-extrabold text-[#3D571E] text-4xl justify-center flex pt-3">"Healthy eating is a <br />form of self-respect."</p>

  <img src={forkImg} alt="" className="right-0 h-20 "/>
</section>

<div className="flex flex-row justify-between p-2bg-[#3D571E] shadow-xl rounded-t-xl p-2 text-white font-semibold bg-white">
    <button className="footer-button hover:underline" >Home</button>
    <button className="footer-button hover:underline">Privacy Policy</button>
    <button className="footer-button hover:underline">Terms and Conditions</button>
    <button className="footer-button hover:underline">About Us</button>
    <button className="footer-button hover:underline">View Plans</button>
    <button className="footer-button hover:underline">Contact Us</button>

</div>

</div>
    );
}

export default LandingPage