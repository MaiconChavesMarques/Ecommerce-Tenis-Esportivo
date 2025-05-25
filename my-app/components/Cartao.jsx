import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Cartao.css';

const Cartao = ({ token, carrinho, onLimparCarrinho }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { carrinho: carrinhoState, subtotal, desconto, total } = location.state || {};
  
  // Use carrinho do state se disponível, senão use o prop
  const carrinhoFinal = carrinhoState || carrinho;
  const [dadosCartao, setDadosCartao] = useState({
    nomeCartao: '',
    numeroCartao: '',
    dataVencimento: '',
    cvc: ''
  });
  const [erro, setErro] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação específica para cada campo
    let valorFormatado = value;
    
    if (name === 'numeroCartao') {
      // Remove tudo que não é número e adiciona espaços a cada 4 dígitos
      valorFormatado = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    } else if (name === 'dataVencimento') {
      // Formato MM/AA
      valorFormatado = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2').slice(0, 5);
    } else if (name === 'cvc') {
      // Apenas números, máximo 4 dígitos
      valorFormatado = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'nomeCartao') {
      // Apenas letras e espaços
      valorFormatado = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toUpperCase();
    }

    setDadosCartao(prev => ({
      ...prev,
      [name]: valorFormatado
    }));
  };

  const validarFormulario = () => {
    if (!dadosCartao.nomeCartao.trim()) {
      setErro('Por favor, informe o nome no cartão');
      return false;
    }
    if (!dadosCartao.numeroCartao || dadosCartao.numeroCartao.replace(/\s/g, '').length < 16) {
      setErro('Por favor, informe um número de cartão válido');
      return false;
    }
    if (!dadosCartao.dataVencimento || dadosCartao.dataVencimento.length < 5) {
      setErro('Por favor, informe a data de vencimento');
      return false;
    }
    if (!dadosCartao.cvc || dadosCartao.cvc.length < 3) {
      setErro('Por favor, informe o CVC');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!validarFormulario()) {
      return;
    }

    try {
      // Preparar dados da compra
      const dadosCompra = {
        usuario_token: token,
        carrinho: carrinhoFinal,
        valores: {
          subtotal: subtotal,
          desconto: desconto,
          total: total
        },
        pagamento: {
          numero_cartao: dadosCartao.numeroCartao.replace(/\s/g, ''),
          nome_cartao: dadosCartao.nomeCartao,
          data_vencimento: dadosCartao.dataVencimento,
          cvc: dadosCartao.cvc
        }
      };

      const response = await fetch('/api/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosCompra)
      });

      if (response.ok) {
        const resultado = await response.json();
        // Limpa o carrinho após compra bem-sucedida
        if (onLimparCarrinho) {
          onLimparCarrinho();
        }
        alert('Compra realizada com sucesso!');
        navigate('/home');
      } else {
        const error = await response.json();
        setErro(error.message || 'Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Erro ao realizar compra:', error);
      setErro('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="cartao-container">
      <div className="cartao-content">
        <div className="cartao-header">
          <div className="cartao-icon">💳</div>
          <h2>Detalhes do pagamento</h2>
        </div>
        
        <p className="cartao-subtitle">
          Por favor entre com suas informações de cartão de crédito para completar a compra
        </p>

        <form onSubmit={handleSubmit} className="cartao-form">
          <div className="form-group">
            <label htmlFor="nomeCartao">Nome no cartão *</label>
            <input
              type="text"
              id="nomeCartao"
              name="nomeCartao"
              value={dadosCartao.nomeCartao}
              onChange={handleInputChange}
              placeholder=""
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numeroCartao">Número do cartão *</label>
            <input
              type="number"
              id="numeroCartao"
              name="numeroCartao"
              value={dadosCartao.numeroCartao}
              onChange={handleInputChange}
              placeholder=""
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="dataVencimento">Data de vencimento *</label>
              <input
                type="text"
                id="dataVencimento"
                name="dataVencimento"
                value={dadosCartao.dataVencimento}
                onChange={handleInputChange}
                placeholder="MM/AA"
                required
              />
            </div>

            <div className="form-group half">
              <label htmlFor="cvc">CVC *</label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                value={dadosCartao.cvc}
                onChange={handleInputChange}
                placeholder=""
                required
              />
            </div>
          </div>

          {erro && <div className="erro-message">{erro}</div>}

          <button 
            type="submit" 
            className="completar-pagamento-btn"
          >
            Completar pagamento
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cartao;