import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ChatWindow = ({ messages }) => {
  const containerRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-2 bg-gray-100"
      style={{ maxHeight: '100%' }}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}  // <-- key is guaranteed unique here
          className={`flex mb-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${msg.type === 'user' ? 'bg-green-700 text-white' : 'bg-white text-gray-800'}`}
            style={{ maxWidth: '80%' }} // Increase max width for better message presentation
          >
            {/* If this message has an image (preview), show it */}
            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="uploaded preview"
                className="w-32 h-32 object-cover rounded mb-2"
                style={{ minWidth: '80px', minHeight: '80px' }} // Minimum size for images
              />
            )}
            <div>
              {msg.text && <div className="message-output">{msg.text}</div>} {/* Render the message text here */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Type checking for props
ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['user', 'bot']).isRequired,
      text: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    })
  ).isRequired,
};

export default ChatWindow;
