// src/components/Questionnaire.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize formData once user.id is available
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    goal: '',
    mealFrequency: '',
    cookingTimeWeekday: '',
    cookingTimeWeekend: '',
    restrictions: '',
    eatingStyle: '',
    proteinPreference: '',
    rotiRicePreference: '',
    oilFatPreference: '',
    healthIssues: '',
    exerciseFrequency: '',
    energyLevel: '',
    budgetPriority: '',
    eatingOutFrequency: ''
  });

  // Once Clerk’s user is loaded, set userId in formData
  useEffect(() => {
    if (isLoaded && user?.id) {
      setFormData((prev) => ({ ...prev, userId: user.id }));
    }
  }, [isLoaded, user]);

  // Questions are grouped into seven “steps”
  const questions = [
    [
      { label: 'What is your name?', name: 'name', type: 'text' },
      { label: 'What is your age?', name: 'age', type: 'number' },
      {
        label: 'What is your gender?',
        name: 'gender',
        type: 'mcq',
        options: ['Male', 'Female', 'Other', 'Prefer not to say']
      }
    ],
    [
      { label: 'What is your weight (kg)?', name: 'weight', type: 'number' },
      { label: 'What is your height (cm)?', name: 'height', type: 'number' }
    ],
    [
      {
        label: 'Main goal for your eating plan?',
        name: 'goal',
        type: 'mcq',
        options: [
          'Weight loss',
          'Weight gain',
          'Weight maintenance',
          'Feeling more energy',
          'Better health',
          'Just eating well'
        ]
      },
      {
        label: 'How many meals do you usually have in a day?',
        name: 'mealFrequency',
        type: 'mcq',
        options: [
          'Two times',
          'Three times',
          'Four times',
          'Five or more times',
          'It varies'
        ]
      },
      {
        label: 'Weekday cooking time available?',
        name: 'cookingTimeWeekday',
        type: 'mcq',
        options: [
          'Very little time',
          '15-30 mins',
          '30-45 mins',
          'More than 45 mins'
        ]
      }
    ],
    [
      {
        label: 'Weekend cooking time compared to weekdays?',
        name: 'cookingTimeWeekend',
        type: 'mcq',
        options: ['Less', 'More', 'Same', 'Varies']
      },
      {
        label: 'Any food restrictions/allergies?',
        name: 'restrictions',
        type: 'mcq',
        options: [
          'No restrictions',
          'Gluten-free',
          'Dairy-free',
          'Vegetarian',
          'Vegan',
          'Nut allergy',
          'Fish/Seafood allergy',
          'Soy allergy',
          'Other'
        ]
      },
      {
        label: 'Eating style/preference?',
        name: 'eatingStyle',
        type: 'mcq',
        options: ['Wide variety', 'Selective', 'Home food', 'Experimentative']
      }
    ],
    [
      {
        label: 'Favourite protein-rich foods?',
        name: 'proteinPreference',
        type: 'mcq',
        options: [
          'Meat/Poultry',
          'Fish/Seafood',
          'Eggs',
          'Lentils/Chickpeas',
          'Paneer/Tofu',
          'Nuts/Seeds',
          'Dairy products',
          'Protein powder'
        ]
      },
      {
        label: 'Regular roti-chawal (bread-rice) you eat?',
        name: 'rotiRicePreference',
        type: 'mcq',
        options: [
          'Wheat bread',
          'White flour bread',
          'Brown rice',
          'White rice',
          'Millets',
          'Quinoa'
        ]
      },
      {
        label: 'Healthy oils/fats used in cooking?',
        name: 'oilFatPreference',
        type: 'mcq',
        options: [
          'Olive oil',
          'Mustard oil',
          'Ghee',
          'Coconut oil',
          'Sunflower/Soybean oil',
          'Other'
        ]
      }
    ],
    [
      {
        label: 'Any health issues or conditions?',
        name: 'healthIssues',
        type: 'mcq',
        options: ['None', 'Diabetes', 'High BP', 'High cholesterol', 'Stomach issues', 'Food sensitivity', 'Other']
      },
      {
        label: 'How often do you exercise?',
        name: 'exerciseFrequency',
        type: 'mcq',
        options: ['Not at all', '1-2 times a week', '3-4 times a week', 'Daily, 5+ times']
      },
      {
        label: 'Daily energy levels?',
        name: 'energyLevel',
        type: 'mcq',
        options: ['Very low', 'Low', 'Okay', 'Good', 'Very good']
      }
    ],
    [
      {
        label: 'How important is your food budget?',
        name: 'budgetPriority',
        type: 'mcq',
        options: ['Not a concern', 'Somewhat important', 'Very important']
      },
      {
        label: 'Eating out frequency?',
        name: 'eatingOutFrequency',
        type: 'mcq',
        options: ['Always home-cooked', 'Once a week', '2-3 times a week', 'Mostly eat out']
      }
    ]
  ];


  // Handle updating form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // Make sure each question on the current step is answered
  const validateCurrentStep = () => {
    return questions[currentStep].every((q) => formData[q.name] !== '');
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setError('Please fill in all fields before proceeding');
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Final submit: save questionnaire, then generate meal plan, then navigate to view
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      setError('Please fill in all fields before submitting');
      return;
    }
  
    setIsSubmitting(true);
    try {
      // 1. POST answers to /api/questionnaire
      await axios.post('http://localhost:5000/api/questionnaire', { ...formData }); // Ensure URL is correct
  
      // 2. Immediately trigger meal plan generation
      await axios.post('http://localhost:5000/api/generate-meal-plan', { userId: user.id });
  
      // 3. Redirect to /view-meal-plan
      navigate('/view-meal-plan');
    } catch (err) {
      console.error('Questionnaire submit error:', err);
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#FBE9D1] flex justify-center items-center">
      <form className="p-8 bg-white rounded-lg shadow-lg w-96" onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-2xl font-bold mb-6 text-[#5A802D]">Tell Us About You</h2>
        <div className="mb-4 text-sm text-gray-500">
          Step {currentStep + 1} of {questions.length}
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {questions[currentStep].map((q, i) => (
          <div className="mb-4" key={i}>
            <label className="block text-[#5A802D] mb-1">{q.label}</label>

            {q.type === 'text' || q.type === 'number' ? (
              <input
                type={q.type}
                name={q.name}
                value={formData[q.name]}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A802D]"
              />
            ) : (
              <select
                name={q.name}
                value={formData[q.name]}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A802D]"
              >
                <option value="">Select an option</option>
                {q.options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className={`w-full p-2 rounded-lg text-white transition-all ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#5A802D] hover:bg-[#4d6c25]'
          }`}
        >
          {isSubmitting
            ? 'Processing...'
            : currentStep < questions.length - 1
            ? 'Next'
            : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Questionnaire;
