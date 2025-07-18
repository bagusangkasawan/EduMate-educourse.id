import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPaperPlane, FaCommentDots, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import api from '../../utils/api.js';
import AuthContext from '../context/AuthContext';

const TYPING_SPEED = 20;
const normalizeLineBreaks = (text) => text.replace(/\n{2,}/g, '\n');

const TypingMessage = ({ text, onFinish, speed = TYPING_SPEED }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let isCancelled = false;

    const typeText = async () => {
      setDisplayedText('');
      for (let i = 0; i < text.length; i++) {
        if (isCancelled) break;
        setDisplayedText((prev) => prev + text[i]);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      if (!isCancelled && onFinish) {
        onFinish();
      }
    };

    typeText();

    return () => {
      isCancelled = true;
    };
  }, [text, speed, onFinish]);

  return (
    <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
        p: ({ children }) => <span className="mb-0">{children}</span>,
        br: () => <br />,
        }}
    >
        {normalizeLineBreaks(displayedText)}
    </ReactMarkdown>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [typingText, setTypingText] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'ai', text: 'Halo! Ada yang bisa saya bantu?' }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    chatboxRef.current?.scrollTo(0, chatboxRef.current.scrollHeight);
  }, [messages, typingText, isThinking]);

  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([]);
      setInput('');
      setIsOpen(false);
      setTypingText(null);
      setIsThinking(false);
    }
  }, [isAuthenticated]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = input;
    const updatedMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setIsThinking(true);
    setTypingText(null);

    try {
      const res = await api.post('/chatbot', { message: userMessage });
      setTypingText(res.data.reply);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Maaf, terjadi kesalahan.';
      setTypingText(errorMessage);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleTypingFinished = () => {
    if (typingText) {
      setMessages((prev) => [...prev, { sender: 'ai', text: typingText }]);
      setTypingText(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="bg-white w-96 h-[500px] rounded-lg shadow-2xl flex flex-col transition-all duration-300">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold">Asisten AI EduMate</h3>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Chat Body */}
          <div ref={chatboxRef} className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-3 ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${
                    msg.sender === 'ai' ? 'bg-gray-200' : 'bg-blue-500 text-white'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        p: ({ children }) => <span className="mb-0">{children}</span>,
                        br: () => <br />,
                      }}
                    >
                      {normalizeLineBreaks(msg.text)}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {/* Spinner loading */}
            {isThinking && (
              <div className="flex justify-start mb-3">
                <div className="p-2 rounded-lg bg-gray-200 max-w-[80%] text-sm">
                  <span className="animate-pulse text-gray-500">⏳ AI sedang mengetik...</span>
                </div>
              </div>
            )}

            {/* Typing animation */}
            {typingText && (
              <div className="flex justify-start mb-3">
                <div className="p-2 rounded-lg bg-gray-200 max-w-[80%] text-sm whitespace-pre-wrap">
                  <TypingMessage
                    text={typingText}
                    onFinish={handleTypingFinished}
                    speed={TYPING_SPEED}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tanya sesuatu..."
              className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 transition-transform hover:scale-110"
        >
          <FaCommentDots />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
