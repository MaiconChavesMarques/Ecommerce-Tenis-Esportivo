import React, { useState } from 'react';

// ==========================================
// FUNÇÃO TEMPORÁRIA - SERÁ REMOVIDA NO FUTURO
// ==========================================
// Esta função atualiza o estoque e envia para o servidor salvar
const atualizarEstoque = async (carrinho) => {
  try {
    // Ler o arquivo bd.json do servidor Glitch
    const response = await fetch('https://button-discreet-talk.glitch.me/api/bd');
    const produtos = await response.json();
    
    // Criar uma cópia dos produtos para modificar
    const produtosAtualizados = [...produtos];
    
    // Para cada item no carrinho, diminuir a quantidade no estoque
    carrinho.forEach(itemCarrinho => {
      const produtoIndex = produtosAtualizados.findIndex(p => p.id === itemCarrinho.id);
      
      if (produtoIndex !== -1) {
        const produto = produtosAtualizados[produtoIndex];
        const tamanhoIndex = produto.tamanhos.indexOf(itemCarrinho.tamanho);
        
        if (tamanhoIndex !== -1) {
          // Diminuir a quantidade disponível
          produto.quantidade[tamanhoIndex] = Math.max(0, produto.quantidade[tamanhoIndex] - itemCarrinho.quantidade);
        }
      }
    });
    
    // Enviar JSON atualizado para o servidor Glitch
    const saveResponse = await fetch('https://button-discreet-talk.glitch.me/api/salvar-bd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(produtosAtualizados)
    });
    
    if (saveResponse.ok) {
      console.log('Estoque atualizado e salvo com sucesso!');
    } else {
      console.error('Erro ao salvar estoque no servidor');
    }
    
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    throw error; // Re-throw para que o erro seja tratado no handleSubmit
  }
};
// ==========================================
// FIM DA FUNÇÃO TEMPORÁRIA
// ==========================================

const FormCartao = ({ token, carrinhoFinal, subtotal, desconto, total, onCompraRealizada }) => {
  const [dadosCartao, setDadosCartao] = useState({
    nomeCartao: '',
    numeroCartao: '',
    dataVencimento: '',
    cvc: ''
  });
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(false);

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
    if (!dadosCartao.numeroCartao.trim()) {
      setErro('Por favor, informe o número do cartão');
      return false;
    }
    if (!dadosCartao.dataVencimento.trim()) {
      setErro('Por favor, informe a data de vencimento');
      return false;
    }
    if (!dadosCartao.cvc.trim()) {
      setErro('Por favor, informe o CVC');
      return false;
    }
    return true;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setProcessando(true);

    if (!validarFormulario()) {
      setProcessando(false);
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

      console.log(dadosCompra);
      
      // Atualizar estoque antes de processar o pagamento
      await atualizarEstoque(dadosCompra.carrinho);

      const response = await fetch('https://button-discreet-talk.glitch.me/api/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosCompra)
      });

      if (response.ok) {
        const resultado = await response.json();
        onCompraRealizada();
      } else {
        const error = await response.json();
        setErro(error.message || 'Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Erro ao realizar compra:', error);
      setErro('Erro ao conectar com o servidor');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <>
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
            disabled={processando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="numeroCartao">Número do cartão *</label>
          <input
            type="text"
            id="numeroCartao"
            name="numeroCartao"
            value={dadosCartao.numeroCartao}
            onChange={handleInputChange}
            placeholder=""
            required
            disabled={processando}
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
              disabled={processando}
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
              disabled={processando}
            />
          </div>
        </div>

        {erro && <div className="erro-message">{erro}</div>}

        <button 
          type="submit" 
          className="completar-pagamento-btn"
          disabled={processando}
        >
          {processando ? 'Processando...' : 'Completar pagamento'}
        </button>
      </form>
    </>
  );
};

export default FormCartao;