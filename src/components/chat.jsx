import { useState } from 'react';
import { chatAgent } from '../api/appointmentSetter';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async (message) => {
    try {
      const payload = { message: message };
      const response = await chatAgent(payload, 3);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const data = await handleSendMessage(input);
    setInput('');

    if (data && data.success) {
      const lastAgentEntry = data.success.filter(entry => entry.agent);
      console.log(lastAgentEntry)
      if (lastAgentEntry) {
        try {
          const parsedAgentData = JSON.parse(lastAgentEntry.agent);
          const agentMessage = {
            sender: 'agent',
            text: parsedAgentData.response
          };
          setMessages((prev) => [...prev, agentMessage]);
        } catch (err) {
          console.log("Failed to parse agent message:", err);
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="border rounded p-4 h-96 overflow-y-auto bg-gray-100 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.sender === 'user' ? 'bg-blue-200 text-right' : 'bg-green-200 text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
