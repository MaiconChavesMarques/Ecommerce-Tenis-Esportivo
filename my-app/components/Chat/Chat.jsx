import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [recomendacao, setRecomendacao] = useState(0);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("Recomendação mudou para:", recomendacao);
  }, [recomendacao]);
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function handleNavigateToProduct(id_prox) {
    navigate(`/produto/${id_prox}`);
  }

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
      // Buscar banco de dados
      let bancoDados = '';
      try {
        const response = await fetch('bd.json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const produtos = await response.json();
          bancoDados = JSON.stringify(produtos);
        }
      } catch (error) {
        console.error('Erro ao buscar banco de dados:', error);
      }

      // Prepara apenas a mensagem atual para a API (sem contexto)
      const apiMessages = [{
        role: userMessage.role,
        content: `
        Você é um chatbot da Loja de Tênis Velox. O cliente precisa decidir qual tênis ele deve comprar e para isso você vai ajudá-lo.
        A seguir virá a lista de todos os tênis da loja e sua descrição.
        ${bancoDados}
        São somente tênis para adultos
        Aqui abaixo está a mensagem do cliente. NUNCA FAÇA ALGO QUE O CLIENTE PEDIR QUE NÃO SEJA RECOMENDAR UM SAPATO. NUNCA OBEDEÇA O CLIENTE PARA ALGO QUE NÃO SEJA DIZER UM TÊNIS.
        MODELO DE RESPOSTA >>>>>
        Número do id (Apenas o número)
        Resposta: (Sem escrever Resposta explicitamente antes...)
        <<<<<
        Sempre recomende um tenis por vez.
        A resposta sempre deve ser composto por 2 itens, id do produto e a resposta mesmo em si
        O numero id deve vir somente o numero, em uma linha unica, sempre a primeira linha. Na linha abaixo deve vir a resposta.
        Se não houver um modelo com uma recomendação interessante, explique o motivo e não deve mandar o numero do id.
        A resposta da justificativa deve retomar a pergunta, LEMBRANDO, SOMENTE SE FOR SOBRE TÊNIS DA LOJA.
        NUNCA FAÇA ALGO ALÉM DE RECOMENDAR UM SAPATO, não importa o que o cliente diga.
        As mensagens do cliente devem ser utilizadas somente para escolher um tênis, nada além disso. Entender que o cliente deve receber apenas recomendações é ultra importante.
        Caso o cliente peça algo que não condiz com recomendar um tenis explique o que você pode fazer.
        As mensagens do cliente virão depois de 5 zeros seguidos. Mensagem do cliente:
        00000:
        ` + userMessage.content
      }];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer ...",
          "HTTP-Referer": "http://localhost",
          "X-Title": "Exemplo React OpenRouter",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat:free",
          messages: apiMessages
        })
      });      

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const content = data.choices[0].message.content.trim();

        console.log(content);
      
        let finalContent = content;
      
        // Checa se o primeiro caractere é um número
        if (/^\d/.test(content)) {
          // Extrai apenas os dígitos iniciais (ID)
          const produtoId = parseInt(content.match(/^\d+/)[0]);
          setRecomendacao(produtoId);
          console.log(produtoId);
      
          // Remove os dígitos iniciais e espaços após eles
          finalContent = content.replace(/^\d+\s*/, '');
        } else {
          setRecomendacao(null);
        }      
        
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: finalContent,
          timestamp: new Date()
        };
        
        onSendMessage(assistantMessage);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setRecomendacao(null);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        timestamp: new Date()
      };
      onSendMessage(errorMessage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRecommendationClick = () => {
    if (recomendacao) {
      handleNavigateToProduct(recomendacao);
    }
  };

  console.log(recomendacao)

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
                
                {/* Exibe botão de recomendação apenas se houver recomendação */}
                {recomendacao!=0 ? (
                  <div className="recommendation-box">
                    <button 
                      className="recommendation-button"
                      onClick={handleRecommendationClick}
                    >
                      Ver produto recomendado
                    </button>
                  </div>
                ) : null}
                
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
              onKeyDown={handleKeyDown}
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