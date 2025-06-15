import React, { useState } from 'react';

// Componente de formulário para dados do cartão de crédito
const FormCartao = ({ token, carrinhoFinal, subtotal, desconto, total, onCompraRealizada }) => {
  // Estado para armazenar os dados do cartão preenchidos pelo usuário
  const [dadosCartao, setDadosCartao] = useState({
    nomeCartao: '',
    numeroCartao: '',
    dataVencimento: '',
    cvc: ''
  });
  // Estado para armazenar mensagens de erro do formulário
  const [erro, setErro] = useState('');
  // Estado para indicar se o processamento do pagamento está em andamento
  const [processando, setProcessando] = useState(false);

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação específica para cada campo do formulário
    let valorFormatado = value;
    
    if (name === 'numeroCartao') {
      // Remove caracteres que não são números e insere espaços a cada 4 dígitos (ex: "1234 5678 9012 3456")
      valorFormatado = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    } else if (name === 'dataVencimento') {
      // Formato da data de vencimento no padrão MM/AA
      valorFormatado = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2').slice(0, 5);
    } else if (name === 'cvc') {
      // Apenas números, com no máximo 4 dígitos para o CVC
      valorFormatado = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'nomeCartao') {
      // Apenas letras (inclusive com acentos) e espaços, e converte para maiúsculas
      valorFormatado = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toUpperCase();
    }

    // Atualiza o estado dos dados do cartão com o valor formatado
    setDadosCartao(prev => ({
      ...prev,
      [name]: valorFormatado
    }));
  };

  // Função para validar os campos obrigatórios do formulário
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
    // Se todas as validações passaram, retorna true
    return true;
  };  

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Limpa mensagem de erro anterior
    setErro('');
    // Indica que o processamento está em andamento
    setProcessando(true);

    // Valida o formulário antes de continuar
    if (!validarFormulario()) {
      setProcessando(false);
      return;
    }

    try {
      // Prepara os dados da compra a serem enviados para o servidor
      const dadosCompra = {
        usuario_token: token,
        carrinho: carrinhoFinal,
        valores: {
          subtotal: subtotal,
          desconto: desconto,
          total: total
        },
        pagamento: {
          // Remove espaços do número do cartão antes de enviar
          numero_cartao: dadosCartao.numeroCartao.replace(/\s/g, ''),
          nome_cartao: dadosCartao.nomeCartao,
          data_vencimento: dadosCartao.dataVencimento,
          cvc: dadosCartao.cvc
        }
      };

      // Log para debug dos dados da compra
      console.log(dadosCompra);

      // Envia a requisição de pagamento para o novo endpoint
      const response = await fetch('http://localhost:3000/products/pagamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosCompra)
      });

      if (response.ok) {
        // Caso o pagamento seja processado com sucesso
        const resultado = await response.json();
        console.log('Pagamento processado:', resultado);
        // Chama callback informando que a compra foi realizada
        onCompraRealizada();
      } else {
        // Caso haja erro na requisição, extrai a mensagem e exibe para o usuário
        const error = await response.json();
        setErro(error.message || 'Erro ao processar pagamento');
      }
    } catch (error) {
      // Captura erros de conexão ou execução e mostra mensagem genérica
      console.error('Erro ao realizar compra:', error);
      setErro('Erro ao conectar com o servidor');
    } finally {
      // Finaliza o estado de processamento, habilitando inputs e botões
      setProcessando(false);
    }
  };

  return (
    <>
      {/* Cabeçalho do formulário com ícone e título */}
      <div className="cartao-header">
        <div className="cartao-icon">💳</div>
        <h2>Detalhes do pagamento</h2>
      </div>
      
      {/* Subtítulo orientando o usuário */}
      <p className="cartao-subtitle">
        Por favor entre com suas informações de cartão de crédito para completar a compra
      </p>

      {/* Formulário que chama handleSubmit no envio */}
      <form onSubmit={handleSubmit} className="cartao-form">
        {/* Campo para o nome no cartão */}
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
            disabled={processando} // Desabilita durante processamento
          />
        </div>

        {/* Campo para o número do cartão */}
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

        {/* Linha com campos de data de vencimento e CVC */}
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

        {/* Exibe mensagem de erro caso exista */}
        {erro && <div className="erro-message">{erro}</div>}

        {/* Botão para enviar o formulário, desabilitado durante o processamento */}
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