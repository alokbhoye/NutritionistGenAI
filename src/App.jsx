import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SignInComponent from "./components/SignInComponent";
import SignUpComponent from "./components/SignUpComponent";
import Dashboard from './pages/Dashboard';
import Questionnaire from './components/Questionnaire';
import RedirectAfterLogin from './components/RedirectAfterLogin';
import ViewMealPlan from './components/ViewMealPlan';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInComponent />} />
        <Route path="/sign-up" element={<SignUpComponent />} />
        <Route
          path="/home"
          element={
            <>
              <SignedIn>
                <RedirectAfterLogin />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/questionnaire"
          element={
            <>
              <SignedIn>
                <Questionnaire />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/view-meal-plan"
          element={
            <>
              <SignedIn>
                <ViewMealPlan />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
