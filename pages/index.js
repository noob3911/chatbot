import Head from "next/head";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import TypingAnimation from "@/components/typinganime";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
   const [inputValue, setInputValue] = useState("");
   const [chatLog, setChatLog] = useState([]);
   const [isLoading, setLoading] = useState(false);
   const [codeResponseReceived, setCodeResponseReceived] = useState(false);
   const [codeSnippet, setCodeSnippet] = useState("");

   const handleSumbit = (e) => {
      e.preventDefault();
      setChatLog((prevChats) => [...prevChats, { type: "user", message: inputValue }]);
      setInputValue("");
      sendMessage(inputValue);
   };

   const sendMessage = (message) => {
      const url = "https://api.openai.com/v1/chat/completions";
      const headers = {
         "Content-type": "application/json",
         Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      };
      const data = {
         model: "gpt-3.5-turbo",
         messages: [{ role: "user", content: message }],
      };
      setLoading(true);
      axios
         .post(url, data, { headers: headers })
         .then((response) => {
            console.log(response);
            const botMessage = response.data.choices[0].message.content;
            const botMessageLowercase = botMessage.toLowerCase();
            if (botMessageLowercase.startsWith("```")) {
               setCodeSnippet(botMessage.substring(3, botMessage.length - 3));
               setCodeResponseReceived(true);
            } else {
               setChatLog((prevChats) => [...prevChats, { type: "bot", message: botMessage }]);
            }
            setLoading(false);
         })
         .catch((err) => {
            setLoading(false);
            console.log(err);
         });
   };

   return (
      <>
         {/* <div className="container mx-auto h-screen w-3/4 ">
            <div className="flex flex-col h-auto bg-gray-900">
               <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
                  ChatGPT
               </h1>
               <div className="flex-grow p-6">
                  {codeResponseReceived ? (
                     <SyntaxHighlighter language="javascript" style={materialLight}>
                        {codeSnippet}
                     </SyntaxHighlighter>
                  ) : (
                     <div className="flex flex-col space-y-4">
                        {chatLog.map((message, index) => (
                           <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`${message.type === "user" ? "bg-purple-500" : "bg-gray-800"} rounded-lg p-4 text-white max-w-sm`}>
                                 {message.message}
                              </div>
                           </div>
                        ))}
                        {isLoading && (
                           <div key={chatLog.length} className="flex justify-start">
                              <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                                 <TypingAnimation />
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>

               <form onSubmit={handleSumbit} className="flex-none p-6">
                  <div className="flex rounded-lg border border-gray-700 bg-gray-800">
                     <input
                        type="text"
                        className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                     />
                     <button
                        type="submit"
                        className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                     >
                        Send
                     </button>
                  </div>
               </form>
            </div>
         </div> */}


<div className="flex flex-col h-screen bg-gray-900  justify-center">
         <div className="flex-none p-4 bg-gray-800 text-white font-bold text-lg">
            Demo Chat
         </div>
         
         <div className="flex-grow overflow-y-auto mx-24 my-12 no-scrollbar">
            {chatLog.map((message, index) => (
               <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4 `}>
                  <div
                     className={`bg-${message.type === 'user' ? 'green-500' : 'gray-700'} px-4 py-2 rounded-lg ${
                        message.type === 'user' ? 'text-gray-100' : 'text-gray-400 '
                     } max-w-[50rem] text-[1.14rem]  `}
                  >
                     {message.message}
                  </div>
               </div>
            ))}
            {isLoading && (
               <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg max-w-md">
                     <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-700 rounded-full mr-2"></div>
                        <div className="w-2 h-2 bg-gray-700 rounded-full mr-2"></div>
                        <div className="w-2 h-2 bg-gray-700 rounded-full mr-2"></div>
                     </div>
                  </div>
               </div>
            )}
         </div>
         <form onSubmit={handleSumbit} className="flex-none p-4">
            <div className="flex rounded-lg border border-gray-400">
               <input
                  type="text"
                  className="flex-grow text-white px-4 py-2 bg-transparent focus:outline-none"
                  placeholder="Type a message"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
               />
               <button type="submit" className="bg-green-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-green-600 transition-colors duration-300">
                  Send
               </button>
            </div>
         </form>
      </div>
      </>
   );
}
