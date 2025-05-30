import React from 'react';

// Componente funcional Concluido que recebe uma função onVoltarHome como prop
const Concluido = ({ onVoltarHome }) => {
  // Obtém a hora atual formatada no padrão brasileiro (horas e minutos)
  const horaAtual = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="concluido-container">
      <div className="concluido-header">
        {/* Ícone de confirmação */}
        <div className="concluido-icon">✅</div>
        {/* Título indicando que o pagamento foi concluído */}
        <h2>Pagamento concluído!</h2>
      </div>
      
      {/* Mensagem mostrando que a compra foi processada e a hora atual */}
      <p className="concluido-subtitle">
        Sua compra foi processada com sucesso às {horaAtual}
      </p>
      
      {/* Botão que, ao ser clicado, executa a função onVoltarHome para voltar à tela inicial */}
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
