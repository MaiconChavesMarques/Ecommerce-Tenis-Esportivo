import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./ValoresCarrinho.css";

const ValoresCarrinho = ({ carrinho, possivelComprar }) => {
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  
  // Calcula o subtotal somando preço * quantidade de cada item do carrinho
  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  
  // Valor fixo de desconto (pode ser alterado para dinâmico)
  const desconto = 10.0; 
  // Calcula o total após aplicar o desconto
  const total = subtotal - desconto;

  // Função chamada ao clicar no botão comprar
  const handleComprar = () => {
    // Só navega para página de pagamento se compra for possível
    if (possivelComprar) {
      // Navega para rota /cartao, passando os valores via estado
      navigate('/cartao', { 
        state: { 
          carrinho, 
          subtotal, 
          desconto, 
          total 
        } 
      });
    }
  };

  return (
      <div className="resumoValores">
        <div className="resumoTextual">
          <div className="resumo">
            {/* Título do resumo */}
            <p className="destaque">Resumo de valores</p>
          </div>
          <div className="subtotal">
            {/* Exibe subtotal formatado */}
            <p>Subtotal</p>
            <p>R$ {subtotal.toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="desconto">
            {/* Exibe desconto formatado */}
            <p>Desconto</p>
            <p>R$ {desconto.toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="total">
            {/* Exibe total formatado */}
            <p className="destaque">Total</p>
            <p className="destaque">R$ {total.toFixed(2).replace('.', ',')}</p>
          </div>
          {/* Mensagem de aviso se não for possível comprar */}
          {!possivelComprar && (
            <div className="aviso-compra">
              Ajuste as quantidades para finalizar a compra
            </div>
          )}
        </div>
        <div className="comprarBotao">
          {/* Botão para iniciar a compra */}
          <button 
            className="comprar" 
            onClick={handleComprar}
            // Desabilita botão se compra não for possível
            disabled={!possivelComprar}
          >
            {/* Texto muda conforme possibilidade de compra */}
            {possivelComprar ? 'Comprar' : 'Indisponível'}
          </button>
        </div>
      </div>
  );
};

export default ValoresCarrinho;
