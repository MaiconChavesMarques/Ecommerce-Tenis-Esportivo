import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashAdmin.css';
import BarraPesquisa from './BarraPesquisa';
import TabelaEstoque from './TabelaEstoque';

function DashEstoque({ 
  produtos, 
  onIniciarEdicao, 
  onAtualizarProdutos, 
  onAdicionarProduto, 
  onAtualizarProduto, 
  onRemoverProduto 
}) {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 5;

  // Configuração para estoque
  const config = {
    titulo: 'Gerenciador de produtos',
    placeholder: 'Buscar produtos...',
    botaoTexto: '+ Adicionar produto',
    arquivo: '/bd.json',
    endpoint: '/api/produtos'
  };

  // Filtrar produtos baseado no termo de busca usando useMemo para otimização
  const produtosFiltrados = useMemo(() => {
    if (!produtos || produtos.length === 0) return [];
    
    if (!termoBusca) return produtos;
    
    return produtos.filter(produto => {
      const nomeMatch = produto.nome?.toLowerCase().includes(termoBusca.toLowerCase());
      const precoMatch = produto.preco?.toString().includes(termoBusca);
      return nomeMatch || precoMatch;
    });
  }, [produtos, termoBusca]);

  // Aplicar paginação aos dados filtrados
  const produtosPaginados = useMemo(() => {
    // Calcular total de páginas com base nos dados filtrados
    const paginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
    setTotalPaginas(paginas);

    // Obter somente os itens da página atual
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return produtosFiltrados.slice(inicio, fim);
  }, [produtosFiltrados, paginaAtual, itensPorPagina]);

  // Reset da página quando o termo de busca muda
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Carregar dados iniciais
  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await fetch(config.arquivo);
        const data = await response.json();
        
        // Atualiza a lista no componente pai
        onAtualizarProdutos(data || []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        onAtualizarProdutos([]);
      }
    }
    
    // Só carrega se não há produtos
    if (!produtos || produtos.length === 0) {
      buscarProdutos();
    }
  }, [config.arquivo, onAtualizarProdutos]);

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
    console.log('Adicionar produto');
    
    // Inicia o processo de edição através do componente pai
    onIniciarEdicao(null, "adicionar");
    
    // Navega para a página de edição
    navigate('/admin/estoque/editar-produto');
  }

  // Função para editar produto
  function handleEditar(produto) {
    console.log('Editar produto:', produto);
    
    // Inicia o processo de edição através do componente pai
    onIniciarEdicao(produto, "editar");
    
    // Navega para a página de edição
    navigate('/admin/estoque/editar-produto');
  }

  async function handleExcluir(produto) {
    console.log('Excluir produto:', produto);
    const sucesso = await enviarProduto(produto, 'excluir');
    
    if (sucesso) {
      // Remove o produto através do componente pai
      onRemoverProduto(produto.id);
    }
  }

  // Funções de navegação da paginação
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

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
          produtos={produtosPaginados}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onEnviarProduto={enviarProduto}
        />

        <div className="paginacao">
          <button onClick={irParaPaginaAnterior} disabled={paginaAtual === 1}>
            Página Anterior
          </button>
          <span>Página {paginaAtual} de {totalPaginas}</span>
          <button onClick={irParaProximaPagina} disabled={paginaAtual === totalPaginas}>
            Próxima Página
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashEstoque;