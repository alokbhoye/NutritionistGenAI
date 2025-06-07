import { SignIn, useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignInComponent = () => {
  const { user } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserQuestionnaire = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/user-questionnaire/${user.id}`);
          if (response.data.hasCompletedQuestionnaire) {
            navigate("/dashboard");
          } else {
            navigate("/questionnaire");
          }
        } catch (error) {
          console.error('Error checking questionnaire status:', error);
          navigate("/questionnaire");
        }
      }
    };

    checkUserQuestionnaire();
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInComponent;
