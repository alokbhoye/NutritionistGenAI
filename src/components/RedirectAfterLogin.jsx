import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const RedirectAfterLogin = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Wait until Clerk finishes loading the user
    if (!isLoaded || !user) return;

    const checkQuestionnaire = async () => {
      try {
        const userId = user.id;

        // Make sure the backend API is being called correctly
        const res = await axios.get(`http://localhost:5000/api/user-questionnaire/${userId}`);
        const { hasCompletedQuestionnaire, hasMealPlan } = res.data;
        
        // If the questionnaire isn't filled out, redirect to /questionnaire
        if (!hasCompletedQuestionnaire) {
          navigate("/questionnaire");
        } else if (!hasMealPlan) {
          // If no meal plan is found, redirect to questionnaire to gather more info
          navigate("/questionnaire");
        } else {
          // If meal plan exists, navigate to /view-meal-plan
          navigate("/view-meal-plan");
        }
      } catch (err) {
        console.error("❌ Error checking questionnaire:", err);
        // Fallback in case of error
        navigate("/dashboard");
      }
    };

    checkQuestionnaire();
  }, [user, isLoaded, navigate]);

  // While the effect is running, show a simple loading state
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <p className="text-lg font-medium text-gray-600">Redirecting...</p>
    </div>
  );
};

export default RedirectAfterLogin;
