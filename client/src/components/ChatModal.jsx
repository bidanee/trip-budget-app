import { useEffect, useRef, useState } from "react";
import {Bot, X, Send, Loader} from 'lucide-react';
import styles from './ChatModal.module.css';
import {askAI} from "../api";
import ReactMarkdown from "react-markdown";


const ChatModal = ({close}) => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: '안녕하세요! 여행에 대해 궁금한점이 있으시면 물어보세요!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await askAI(currentInput);
      const aiResponse = { from:'ai', text: data.response};
      setMessages(prev => [...prev, aiResponse]);
    } catch (error){
      const errorResponse = { from:'ai', text: '죄송해요, 답변을 생성하는 중에 오류가 발생했어요.'}
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }

  return(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <Bot size={24}/>
          <h3>AI 여행 플래너</h3>
          <button onClick={close} className={styles.closeButton}><X size={24}/></button>
        </header>
        <div className={styles.messageList}>
          {messages.map((msg, index) =>(
            <div key={index} className={`${styles.message} ${styles[msg.from]}`}>
              <div className={styles.bubble}>
                {msg.from === 'ai' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.ai}`}>
              <div className={styles.bubble}><Loader size={20} className={styles.spinner}/></div>
            </div>
          )}
        </div>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="무엇이든 물어보세요" disabled={isLoading}/>
          <button type="submit" disabled={isLoading}><Send size={24}/></button>          
        </form>
      </div>
    </div>
  )
}
export default ChatModal