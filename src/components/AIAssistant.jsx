import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemContext';
import toast from 'react-hot-toast';

const AIAssistant = ({ isOpen, onClose, selectedItem = null }) => {
  const { user } = useAuth();
  const { items, loading } = useItems();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && selectedItem) {
      generateRecommendation(selectedItem);
    }
  }, [isOpen, selectedItem]);

  const generateRecommendation = async (item) => {
    setIsTyping(true);

    setTimeout(() => {
      const availableItems = items.filter(
        (i) =>
          i.id !== item.id &&
          i.status === 'available' &&
          i.user_id !== user?.id
      );

      const matches = availableItems
        .map((availableItem) => {
          let score = 0;

          // Category match
          if (availableItem.category === item.category) score += 40;
          else if (
            availableItem.category?.includes(item.category) ||
            item.category?.includes(availableItem.category)
          )
            score += 20;

          // Size match
          if (availableItem.size === item.size) score += 30;
          else if (
            availableItem.size?.includes(item.size) ||
            item.size?.includes(availableItem.size)
          )
            score += 15;

          // Condition match
          if (availableItem.condition === item.condition) score += 20;
          else {
            const conditionOrder = [
              'New with tags',
              'Like new',
              'Very good',
              'Good',
              'Fair',
            ];
            const itemIndex = conditionOrder.indexOf(item.condition);
            const availableIndex = conditionOrder.indexOf(
              availableItem.condition
            );
            const difference = Math.abs(itemIndex - availableIndex);
            if (difference <= 1) score += 10;
          }

          // Tag similarity
          const commonTags =
            item.tags?.filter((tag) =>
              availableItem.tags?.includes(tag)
            ) || [];
          score += commonTags.length * 5;

          return { ...availableItem, matchScore: score };
        })
        .filter((match) => match.matchScore > 30)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

      setRecommendations(matches);

      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: `I found ${matches.length} great matches for your "${item.title}"! Here are my top recommendations based on category, size, and style compatibility.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "I'm analyzing your request and looking for the best matches in our community!",
        "Based on your preferences, I found some items that would be perfect for you.",
        "Let me search through our database for items that match your style and size.",
        "I'm checking for items with similar quality and condition to ensure a fair swap.",
        "Here are some recommendations that align with your fashion preferences!",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const initiateSwap = (recommendedItem) => {
    if (!user) {
      toast.error('Please log in to initiate a swap');
      return;
    }

    toast.success(`Swap request prepared for ${recommendedItem.title}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">ReWear AI Assistant</h3>
              <p className="text-sm text-gray-500">Your personal style matchmaker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about style matching, swap recommendations..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="w-80 border-l bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-4">AI Recommendations</h4>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg p-3 shadow-sm border"
                    >
                      <div className="flex space-x-3">
                        <img
                          src={item.image_urls?.[0] || item.image_url}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-gray-800 truncate">
                            {item.title}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {item.category} • {item.size} • {item.condition}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {item.matchScore}% match
                            </span>
                            <button
                              onClick={() => initiateSwap(item)}
                              className="text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors"
                            >
                              Swap
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-sm">No recommendations yet</p>
                  <p className="text-xs">Select an item to get AI-powered matches</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
