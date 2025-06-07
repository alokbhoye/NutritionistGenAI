// src/pages/Dashboard.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import cameraIcon from '../assets/Dashboard/camera.png';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for the initial “upload + prompt” box
  const [initialText, setInitialText] = useState('');
  const [initialFile, setInitialFile] = useState(null);

  // Whenever we want to add a new message (user or bot), we generate a unique ID
  const addMessage = (type, text, imageUrl = null) => {
    const newId = `${Date.now()}-${Math.random()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: newId,
        type,
        text,
        imageUrl,
      },
    ]);
  };

  const handleSend = async (file, text) => {
    // If Clerk isn’t loaded yet, don’t proceed
    if (!isLoaded) return;

    // On first send, switch into “chat mode”
    if (!chatStarted) {
      setChatStarted(true);
    }

    // Show the user’s message bubble right away
    let imageUrl = null;
    if (file) {
      imageUrl = URL.createObjectURL(file);
    }
    addMessage('user', text || '(image)', imageUrl);
    setLoading(true);

    // Clear out the initial upload + prompt inputs, so the UI resets
    setInitialFile(null);
    setInitialText('');

    try {
      let macros = null;

      // ─── Step 1: If there’s a file, send it to the Render model ───
      if (file) {
        const formDataModel = new FormData();
        formDataModel.append('image', file);

        console.log('➡️ Posting to Render model with formData:', formDataModel);
        const modelRes = await axios.post(
          'https://nutrient-prediction-model.onrender.com/predict',
          formDataModel,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log('✅ Render model returned:', modelRes.data);
        macros = modelRes.data; // { food, calories, fat, protein, carbs }
      }

      // Ensure user is authenticated before sending the request
      if (!user?.id) {
        console.error('No user ID found');
        addMessage('bot', 'Unable to process your request. Please login first.');
        return;
      }

      // ─── Step 2: Forward macros (or null) + prompt to our backend ───
      const payload = { macros, prompt: text || '' };
      console.log('➡️ Posting to backend /api/process-meal with payload:', payload);

      const backendRes = await axios.post(
        'http://localhost:5000/api/process-meal',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user.id, // Ensure user ID is included
          },
        }
      );
      console.log('✅ /api/process-meal returned:', backendRes.data);

      const { geminiText } = backendRes.data;
      if (geminiText) {
        addMessage('bot', geminiText);
      } else {
        addMessage('bot', '⚠️ No response from Gemini.');
      }
    } catch (err) {
      console.error('❌ Error in handleSend:', err.response || err.message || err);
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      addMessage('bot', `Sorry, something went wrong: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#98BE69]">
      <Navbar />
      <div className="flex flex-1 overflow-y-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 relative">
          {!chatStarted ? (
            <div className="flex flex-col items-center px-10 py-10 mt-20">
              <div className="text-white w-full rounded-md px-6 py-4 text-center">
                <h1 className="text-5xl font-bold">Your Meals. Your Goals.</h1>
                <h2 className="text-xl font-medium">Guided by AI Precision</h2>
              </div>

              <div className="bg-white shadow-lg rounded-lg pl-4 pr-4 pt-2 pb-2 w-full max-w-4xl flex items-center gap-3 mt-10">
                <label htmlFor="initialImageUpload" className="cursor-pointer">
                  <img src={cameraIcon} alt="camera" className="w-6 h-6" />
                  <input
                    type="file"
                    id="initialImageUpload"
                    accept="image/*"
                    onChange={(e) => {
                      setInitialFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  placeholder="Ask Gemini about your meal..."
                  value={initialText}
                  onChange={(e) => setInitialText(e.target.value)}
                  className="flex-1 rounded px-3 py-2 focus:outline-none text-lg"
                />

                <button
                  onClick={() => handleSend(initialFile, initialText)}
                  disabled={loading}
                  className={`${
                    loading
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-700 hover:bg-green-800'
                  } text-white px-4 py-2 rounded transition`}
                >
                  {loading ? 'Analyzing...' : 'Submit'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 overflow-hidden">
              <ChatWindow messages={messages} />

              <div className="border-t border-gray-300">
                <InputBar onSend={handleSend} disabled={loading} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
