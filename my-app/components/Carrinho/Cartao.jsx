import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FormCartao from './FormCartao';
import Concluido from './Concluido';
import './Cartao.css';

const Cartao = ({ token, carrinho, onLimparCarrinho }) => {
  const navigate = useNavigate(); // Hook para navegação entre rotas
  const location = useLocation(); // Hook para acessar estado da rota atual
  const { carrinho: carrinhoState, subtotal, desconto, total } = location.state || {};
  
  // Use o carrinho vindo do estado da rota, se existir; caso contrário, usa o prop
  const carrinhoFinal = carrinhoState || carrinho;
  // Estado para controlar se a compra foi concluída com sucesso
  const [compraBemSucedida, setCompraBemSucedida] = useState(false);

  // Função chamada quando compra é realizada para atualizar estado
  const handleCompraRealizada = () => {
    setCompraBemSucedida(true);
  };

  // Função para voltar para a home após compra, limpando o carrinho se houver função para isso
  const handleVoltarHome = () => {
    if (onLimparCarrinho) {
      onLimparCarrinho();
    }
    navigate('/home'); // Redireciona para a rota /home
  };

  return (
    <div className="cartao-container">
      <div className="cartao-content">
        {/* Renderiza formulário de pagamento ou tela de conclusão dependendo do estado */}
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
