import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ messages = [], onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    // Adiciona mensagem do usuário
    onSendMessage(userMessage);
    setInputValue('');

    try {
      // Prepara as mensagens para a API
      const apiMessages = (messages || []).concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer sk-or-v1-YOUR_API_KEY_HERE", // Substituir pela sua chave
          "HTTP-Referer": "https://wvelox.com", 
          "X-Title": "Wvelox Chat Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat:free",
          "messages": [
            {
              "role": "system",
              "content": "Você é um assistente especializado em calçados esportivos da marca Velox. Ajude os clientes a encontrar o tênis perfeito, dê recomendações baseadas nas necessidades deles e responda dúvidas sobre produtos. Seja amigável e prestativo."
            },
            ...apiMessages
          ]
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date()
        };
        
        onSendMessage(assistantMessage);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        timestamp: new Date()
      };
      onSendMessage(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        
        {/* Chat Container */}
        <div className="chat-box">
          
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-icon">
              <span>💬</span>
            </div>
            <span className="chat-header-title">Assistente de Calçados</span>
          </div>

          {/* Messages Area */}
          <div className="messages-area">
            {(!messages || messages.length === 0) ? (
              <>
                {/* Mensagem inicial */}
                <div className="initial-message">
                  <p>
                    Olá! Descreva o que você está procurando e eu ajudarei a encontrar o calçado perfeito para você.
                  </p>
                </div>
                
                {/* Recomendação de exemplo */}
                <div className="recommendation-box">
                  <p className="recommendation-title">
                    Baseado no que você descreveu, eu recomendo o Velox NitroRun
                  </p>
                  <p className="recommendation-desc">
                    Este modelo combina perfeitamente com o que você está procurando.
                  </p>
                  <button className="recommendation-button">
                    Ver produto recomendado
                  </button>
                </div>
              </>
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id} className="message">
                    {message.role === 'user' ? (
                      <div className="user-message-container">
                        <div className="user-message">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="assistant-message">
                        <p>
                          {message.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Descreva o que você está procurando..."
              className="chat-input"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`send-button ${!inputValue.trim() ? 'disabled' : ''}`}
            >
              <svg className="send-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <p className="help-text">
            Ex: "Procuro um tênis esportivo para corrida" ou "Quero um sapato casual e confortável"
          </p>
        </div>

      </div>
    </div>
  );
};

export default Chat;