import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InputBar = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (!text.trim() && !file) return; // Avoid sending empty message

    onSend(file, text.trim());
    // Clear the input after sending
    setText('');
    setFile(null);
  };

  return (
    <div className="flex items-center px-4 py-2 bg-white">
      {/* File input (optional for chat-mode image) */}
      <label htmlFor="chatFileUpload" className="cursor-pointer mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500 hover:text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M15.172 7L21 12.828" />
        </svg>
        <input
          type="file"
          id="chatFileUpload"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          className="hidden"
        />
      </label>

      {/* Text input */}
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 rounded-l border border-gray-300 px-3 py-2 focus:outline-none"
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      {/* Send button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || (!text.trim() && !file)}
        className={`${
          disabled ? 'bg-green-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
        } text-white px-4 py-2 rounded-r transition`}
      >
        Send
      </button>
    </div>
  );
};

// Type checking for props
InputBar.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default InputBar;
