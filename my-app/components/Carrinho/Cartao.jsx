import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FormCartao from './FormCartao';
import Concluido from './Concluido';
import './Cartao.css';

const Cartao = ({ token, carrinho, onLimparCarrinho }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { carrinho: carrinhoState, subtotal, desconto, total } = location.state || {};
  
  // Use carrinho do state se disponível, senão use o prop
  const carrinhoFinal = carrinhoState || carrinho;
  const [compraBemSucedida, setCompraBemSucedida] = useState(false);

  const handleCompraRealizada = () => {
    setCompraBemSucedida(true);
  };

  const handleVoltarHome = () => {
    // Limpa o carrinho após compra bem-sucedida
    if (onLimparCarrinho) {
      onLimparCarrinho();
    }
    navigate('/home');
  };

  return (
    <div className="cartao-container">
      <div className="cartao-content">
        {!compraBemSucedida ? (
          <FormCartao 
            token={token}
            carrinhoFinal={carrinhoFinal}
            subtotal={subtotal}
            desconto={desconto}
            total={total}
            onCompraRealizada={handleCompraRealizada}
          />
        ) : (
          <Concluido onVoltarHome={handleVoltarHome} />
        )}
      </div>
    </div>
  );
};

export default Cartao;