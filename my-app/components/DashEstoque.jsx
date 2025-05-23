import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashAdmin.css';
import BarraPesquisa from './BarraPesquisa';
import TabelaEstoque from './TabelaEstoque';

function DashEstoque() {
  const navigate = useNavigate();
  const location = useLocation();
  const [termoBusca, setTermoBusca] = useState('');
  const [produtos, setProdutos] = useState([]);

  // Configuração para estoque
  const config = {
    titulo: 'Gerenciador de produtos',
    placeholder: 'Buscar produtos...',
    botaoTexto: '+ Adicionar produto',
    arquivo: '/bd.json',
    endpoint: '/api/produtos'
  };

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await fetch(config.arquivo);
        const data = await response.json();

        setProdutos(data || []);
        console.log(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setProdutos([]);
      }
    }
    
    buscarProdutos();
  }, []);

  // Função para enviar dados de produto (POST)
  async function enviarProduto(produto, acao = 'adicionar') {
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...produto,
          acao: acao // 'adicionar', 'editar', 'excluir'
        })
      });
      
      if (response.ok) {
        console.log(`Produto ${acao} com sucesso`);
        return true;
      } else {
        console.error(`Erro ao ${acao} produto`);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return false;
    }
  }

  function handleBuscar(termo) {
    setTermoBusca(termo);
  }

  function handleAdicionar() {
    // Implementar navegação ou modal para adicionar produto
    console.log('Adicionar produto');
  }

  // Função para editar produto
  function handleEditar(produto) {
    console.log('Editar produto:', produto);

    // Navega para a página de edição passando os dados do produto
    navigate('/editar-produto', {
      state: {
        produto: produto
      }
    });
  }


  async function handleExcluir(produto) {
    console.log('Excluir produto:', produto);
    const sucesso = await enviarProduto(produto, 'excluir');
    
    if (sucesso) {
      // Remove o produto da lista local
      setProdutos(prev => 
        prev.filter(p => p.id !== produto.id)
      );
    }
  }

  function handleAdicionarNovo(novoProduto) {
    // Função para ser chamada quando um novo produto for adicionado
    setProdutos(prev => [...prev, novoProduto]);
  }

  function handleAtualizar(produtoAtualizado) {
    // Função para ser chamada quando um produto for editado
    setProdutos(prev => 
      prev.map(p => 
        p.id === produtoAtualizado.id ? produtoAtualizado : p
      )
    );
  }

  // Escuta por mudanças na página (quando voltar da edição)
  useEffect(() => {
    // Recarrega os dados quando a página voltar ao foco
    async function buscarProdutos() {
      try {
        const response = await fetch(config.arquivo);
        const data = await response.json();
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setProdutos([]);
      }
    }
    
    buscarProdutos();
  }, [location.pathname]); // Executa quando a URL muda

  return (
    <div className="container">
      <div id="containerConteudo">
        <div className="cabecalho-dash">
          <h1>{config.titulo}</h1>
          <div className="acoes-cabecalho">
            <BarraPesquisa 
              placeholder={config.placeholder}
              onBuscar={handleBuscar}
            />
            <button className="btn-adicionar" onClick={handleAdicionar}>
              {config.botaoTexto}
            </button>
          </div>
        </div>

        <TabelaEstoque 
          termoBusca={termoBusca}
          produtos={produtos}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onEnviarProduto={enviarProduto}
        />
      </div>
    </div>
  );
}

export default DashEstoque;