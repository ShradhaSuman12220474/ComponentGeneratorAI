// import React, { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import ChatView from './components/ChatView';
// import OutputView from './components/OutputView';
// import InputArea from './components/InputArea';

// export default function App() {
//     // Placeholder state for the generated code.
//     const [sessionId, setSessionId] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [components, setComponents] = useState([]);

//     const [generatedCode, setGeneratedCode] = useState({
//         jsx: `function LoginForm() {
//   return (
//     <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
//       <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
//       <form>
//         <div className="mb-4">
//           <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="username">
//             Username
//           </label>
//           <input className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 text-white leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
//         </div>
//         <div className="mb-6">
//           <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="password">
//             Password
//           </label>
//           <input className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
//         </div>
//         <div className="flex items-center justify-between">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
//             Sign In
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }`,
//         css: `/* All styling is handled by Tailwind CSS utility classes.
//   No custom CSS is needed for this component.
// */`
//     });

//     const API_BASE_URL = "http://localhost:3000/api"; // adjust if needed
//     // const handleNewChat = () => {
//     //     console.log("Starting a new chat session...");
//     //     // Here we would clear the state or create a new session via API

//     // };
//    const handleNewChat = async () => {
//   try {
//     // Prompt the user for a session name
//     const sessionName = window.prompt("Enter a name for your new session:");

//     if (!sessionName || sessionName.trim() === "") {
//       alert("Session name cannot be empty.");
//       return;
//     }

//     const res = await fetch(`${API_BASE_URL}/session/create`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userId: "68832c8b428600e64016d48d", // Use dynamic user ID if available
//         sessionName: sessionName.trim(),
//       }),
//     });

//     const result = await res.json();

//     if (result.success && result.data && result.data._id) {
//       const newSessionId = result.data._id;

//       // Update state
//       setSessionId(newSessionId);
//       setMessages([]);
//       setComponents([]);
//       setGeneratedCode({ jsx: '', css: '' });

//       console.log("✅ New session created:", result.data.sessionName, newSessionId);
//     } else {
//       console.error("❌ Failed to create session:", result.message || "Unknown error");
//     }
//   } catch (error) {
//     console.error("❌ Error creating new chat session:", error);
//   }
// };


//     const handleSelectSession = async (sessionId) => {
//         // console.log(`Loading session: ${sessionId}`);
//         // Here we would fetch the data for the selected session
//         try {
//           console.log(`Loading session: ${sessionId}`);

//           const res = await fetch(`${API_BASE_URL}/session/${sessionId}`);
//           const session = await res.json();

//           console.log("Fetched session data:", session);
//           setSessionId(sessionId);

//         // Update  UI with chatHistory and components
//         if (session.success && session.data) {
//           const { chatHistory = [], components = [] } = session.data;
//           console.log(chatHistory);

//           setMessages(chatHistory); // if your backend sends chatHistory
//           setComponents(components); // if your backend sends saved components
//         }
//         } catch (error) {
//           console.error("Error loading session:", error);
//         }
//       };

//     const handleSendMessage = async (message) => {
//         // console.log("Sending message to AI:", message);
//         // Here you would make the API call to your backend
//         if (!sessionId) {
//               console.warn("No session selected.");
//               return;
//             }
//          try {
//             console.log("Sending message to AI:", message);
//             setMessages(prev => [...prev, { role: 'user', content: message }]);
//             const res = await fetch(`${API_BASE_URL}/generate`, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 sessionId,
//                 userPrompt: message,
//               }),
//             });
//             const { aiContent, newComponent } = await res.json();

//               // Add AI message
//               setMessages(prev => [...prev, { from: 'ai', content: aiContent }]);

//               // Update generated code preview
//               setGeneratedCode({
//                 jsx: newComponent.jsx,
//                 css: newComponent.css || '',
//               });

//               // Save component for session output history if needed
//               setComponents(prev => [...prev, newComponent]);


//             // const response = await res.json();
//             // console.log("AI response received:", response);

//             // Append AI response and new component (if any) to UI
//           } catch (error) {
//             console.error("Error sending message:", error);
//           }

//     };

//     return (
//         <div className="flex h-screen bg-gray-800 text-white font-sans">
//             <Sidebar onNewChat={handleNewChat} onSelectSession={handleSelectSession} />
//             <main className="flex-1 flex flex-col">
//                 <ChatView messages={messages} />
//                 <OutputView generatedCode={generatedCode} />
//                 <InputArea onSendMessage={handleSendMessage} />
//             </main>
//         </div>
//     );
// }



import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import OutputView from './components/OutputView';
import InputArea from './components/InputArea';
import AuthPage from './components/AuthPage';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
export default function App() {
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [components, setComponents] = useState([]);
  const [generatedCode, setGeneratedCode] = useState({ jsx: '', css: '' });

  const API_BASE_URL = "https://aicomponentgeneratorbackend.onrender.com/api";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleNewChat = async () => {
    const sessionName = window.prompt("Enter a name for your new session:");
    if (!sessionName || sessionName.trim() === "") return alert("Session name cannot be empty.");

    try {
      const res = await fetch(`${API_BASE_URL}/session/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sessionName: sessionName.trim() }),
      });
      const result = await res.json();

      if (result.success && result.data._id) {
        setSessionId(result.data._id);
        setMessages([]);
        setComponents([]);
        setGeneratedCode({ jsx: '', css: '' });
      } else {
        console.error("Session creation failed:", result.message);
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleSelectSession = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/session/${sessionId}`);
      const session = await res.json();

      if (session.success && session.data) {
        setSessionId(sessionId);
        setMessages(session.data.chatHistory || []);
        setComponents(session.data.components || []);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!sessionId) return console.warn("No session selected.");
    try {
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      const res = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userPrompt: message }),
      });

      const { aiContent, newComponent } = await res.json();
      setMessages(prev => [...prev, { from: 'ai', content: aiContent }]);
      setGeneratedCode({ jsx: newComponent.jsx, css: newComponent.css || '' });
      setComponents(prev => [...prev, newComponent]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    setSessionId(null);
    setMessages([]);
    setComponents([]);
    setGeneratedCode({ jsx: '', css: '' });
  };

  // if (!userId) {
  //   return <AuthPage  onAuthSuccess={setUserId} />;
  // }
  return (
      <>
      <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
              <div className="flex h-screen bg-gray-800 text-white font-sans">
                <Sidebar
                  onNewChat={handleNewChat}
                  onSelectSession={handleSelectSession}
                  onLogout={handleLogout}
                />
                <main className="flex-1 flex flex-col">
                  <ChatView messages={messages} />
                  <OutputView generatedCode={generatedCode} />
                  <InputArea onSendMessage={handleSendMessage} />
                </main>
              </div>
          </ProtectedRoute>
        }
      />
    </Routes>
    </>

    
  );
}

