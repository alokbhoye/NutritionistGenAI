// src/components/ViewMealPlan.jsx
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const ViewMealPlan = () => {
  // ──────────────── ALL HOOKS AT THE TOP ────────────────
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // State for list of days from API
  const [days, setDays] = useState([]);

  // Loading flag
  const [loading, setLoading] = useState(true);

  // View mode: "daily" or "weekly"
  const [viewMode, setViewMode] = useState('daily');

  // Which day index is selected when in weekly mode (0 = first element of `days`)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // ──────────────── FETCH MEAL PLAN ONCE USER IS LOADED ────────────────
  useEffect(() => {
    // Only run once Clerk's user data is available
    if (!isLoaded || !user) return;

    const fetchMealPlan = async () => {
      try {
        // 1) Check questionnaire & meal plan existence
        const res = await axios.get(`/api/user-questionnaire/${user.id}`);

        if (!res.data.hasCompletedQuestionnaire) {
          // If they never filled questionnaire, redirect to Dashboard
          navigate('/dashboard');
          return;
        }

        const mealPlan = res.data.mealPlan;

        // 2) If we stored rawText because parsing failed, attempt to clean & parse
        if (mealPlan?.rawText) {
          let cleanedText = mealPlan.rawText.replace(/```json|```/g, '').trim();
          cleanedText = cleanedText
            .replace(/"\s*}\s*"/g, '", "')
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
            .replace(/,(\s*[}\]])/g, '$1')
            .replace(/"(\s*)\](\s*)"/g, '", "')
            .replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1')
            .replace(/(\d+)(g|k?cal|cal)/g, '$1');

          try {
            const parsed = JSON.parse(cleanedText);
            const extractedDays = parsed.days || parsed.mealPlan?.days || [];
            if (Array.isArray(extractedDays)) {
              setDays(extractedDays);
            } else {
              setDays([]);
            }
          } catch {
            // If parsing still fails, leave days empty
            setDays([]);
          }
        } else if (mealPlan && Array.isArray(mealPlan.days)) {
          // 3) Otherwise we already have an array of days
          setDays(mealPlan.days);
        } else {
          setDays([]);
        }
      } catch {
        // If any error, redirect back to dashboard
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [isLoaded, user, navigate]);

  // ──────────────── CLAMP selectedDayIndex IF days LENGTH CHANGES ────────────────
  useEffect(() => {
    if (selectedDayIndex >= days.length) {
      setSelectedDayIndex(0);
    }
  }, [days, selectedDayIndex]);

  // ──────────────── HELPER: Get today's plan by matching weekday name ────────────────
  const getTodayPlan = () => {
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return days.find((d) => d.day.toLowerCase() === todayName.toLowerCase());
  };

  // ──────────────── LOADING OR NO DATA EARLY RETURNS ────────────────
  if (loading || !isLoaded) {
    // We return this while data is being fetched or Clerk user not loaded
    return <p className="text-center mt-10">Loading meal plan...</p>;
  }

  if (!days.length) {
    // If no days were loaded (empty array), show fallback
    return (
      <div className="text-center mt-10">
        <p>No meal plan found.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-700 text-white rounded"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // ──────────────── MEAL CARD COMPONENT ────────────────
  const MealCard = ({ label, meal }) => {
    if (!meal || !meal.item) return null;
    return (
      <div className="bg-white rounded-lg shadow p-4 w-full sm:w-1/4">
        <h3 className="text-lg font-semibold mb-2 text-center">{label}</h3>
        <p className="text-sm text-center">{meal.item}</p>
        {meal.nutrition && (
          <p className="text-xs text-gray-600 mt-2 text-center">
            {`Calories: ${meal.nutrition.calories ?? '-'} | Protein: ${meal.nutrition.protein ?? '-'} | Carbs: ${meal.nutrition.carbs ?? '-'} | Fat: ${meal.nutrition.fat ?? '-'}`}
          </p>
        )}
      </div>
    );
  };

  // ──────────────── RENDER ────────────────
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-[#98BE69]">
          <h1 className="text-3xl font-bold mb-6 text-green-900">
            Your Personalized Meal Plan
          </h1>

          {/* Toggle Buttons */}
          <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded shadow ${
              viewMode === 'daily'
                ? 'bg-green-700 text-white'  // Green background with white text when selected
                : 'bg-white border border-green-700 text-green-700 hover:bg-green-100' // White background and green border when unselected
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded shadow ${
              viewMode === 'weekly'
                ? 'bg-green-700 text-white'  // Green background with white text when selected
                : 'bg-white border border-green-700 text-green-700 hover:bg-green-100' // White background and green border when unselected
            }`}
          >
            Weekly
          </button>
        </div>


          {viewMode === 'daily' && (
            <div className="space-y-8 flex space-between gap-3 ">
              {/* If today’s plan exists, show four meal cards stacked vertically */}
              {getTodayPlan() ? (
                <>
                  <MealCard label="Breakfast" meal={getTodayPlan().breakfast} />
                  <MealCard label="Lunch" meal={getTodayPlan().lunch} />
                  <MealCard label="Dinner" meal={getTodayPlan().dinner} />
                  <MealCard label="Snacks" meal={getTodayPlan().snacks} />
                </>
              ) : (
                <p>No plan found for today.</p>
              )}
            </div>
          )}

          {viewMode === 'weekly' && (
            <>
              {/* Weekly: Day Tabs */}
              <div className="bg-white rounded-lg shadow mb-6 flex overflow-auto">
                {days.map((dayObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`flex-1 py-2 text-center text-green-900 font-medium ${
                      idx === selectedDayIndex
                        ? 'bg-green-900 text-white rounded-lg'
                        : ''
                    }`}
                  >
                    {dayObj.day}
                  </button>
                ))}
              </div>

              {/* Weekly: Four Meal Cards for the Selected Day */}
              {days[selectedDayIndex] ? (
                <div className="flex flex-wrap gap-6">
                  <MealCard
                    label="Breakfast"
                    meal={days[selectedDayIndex].breakfast}
                  />
                  <MealCard
                    label="Lunch"
                    meal={days[selectedDayIndex].lunch}
                  />
                  <MealCard
                    label="Snack"
                    meal={days[selectedDayIndex].snacks}
                  />
                  <MealCard
                    label="Dinner"
                    meal={days[selectedDayIndex].dinner}
                  />
                </div>
              ) : (
                <p className="text-center">No plan available for this day.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMealPlan;
