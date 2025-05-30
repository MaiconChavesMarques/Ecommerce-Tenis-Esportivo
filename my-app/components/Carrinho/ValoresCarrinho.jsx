import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./ValoresCarrinho.css";

const ValoresCarrinho = ({ carrinho, possivelComprar }) => {
  const navigate = useNavigate();
  
  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  const desconto = 10.0; // Você pode tornar isso dinâmico se quiser
  const total = subtotal - desconto;

  const handleComprar = () => {
    if (possivelComprar) {
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
            <p className="destaque">Resumo de valores</p>
          </div>
          <div className="subtotal">
            <p>Subtotal</p>
            <p>R$ {subtotal.toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="desconto">
            <p>Desconto</p>
            <p>R$ {desconto.toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="total">
            <p className="destaque">Total</p>
            <p className="destaque">R$ {total.toFixed(2).replace('.', ',')}</p>
          </div>
          {!possivelComprar && (
            <div className="aviso-compra">
              Ajuste as quantidades para finalizar a compra
            </div>
          )}
        </div>
        <div className="comprarBotao">
          <button 
            className="comprar" 
            onClick={handleComprar}
            disabled={!possivelComprar}
          >
            {possivelComprar ? 'Comprar' : 'Indisponível'}
          </button>
        </div>
      </div>
  );
};

export default ValoresCarrinho;