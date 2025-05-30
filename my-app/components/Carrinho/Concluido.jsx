import React from 'react';

const Concluido = ({ onVoltarHome }) => {
  const horaAtual = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="concluido-container">
      <div className="concluido-header">
        <div className="concluido-icon">✅</div>
        <h2>Pagamento concluído!</h2>
      </div>
      
      <p className="concluido-subtitle">
        Sua compra foi processada com sucesso às {horaAtual}
      </p>
      <button
        onClick={onVoltarHome}
        className="voltar-home-btn"
      >
        Voltar ao início
      </button>
    </div>
  );
};

export default Concluido;