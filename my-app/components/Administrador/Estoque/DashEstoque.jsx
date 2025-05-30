// Importação de hooks do React e ferramentas de navegação
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Importação de estilos e componentes customizados
import './DashEstoque.css';
import BarraPesquisa from '../../Layout/BarraPesquisa';
import TabelaEstoque from './TabelaEstoque';

// Componente principal para o dashboard de estoque
function DashEstoque({ 
  produtos,               // Lista de produtos passada como prop
  onIniciarEdicao,        // Função callback para iniciar a edição de um produto
  onAtualizarProdutos,    // Função callback para atualizar lista de produtos
  onAdicionarProduto,     // (Não utilizado nesse trecho)
  onAtualizarProduto,     // (Não utilizado nesse trecho)
  onRemoverProduto        // Função callback para remover um produto
}) {
  const navigate = useNavigate(); // Hook para navegação programada via React Router

  // Estado para termo de busca do usuário
  const [termoBusca, setTermoBusca] = useState('');
  // Estado para controle da página atual na paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  // Estado para total de páginas disponíveis baseado no filtro
  const [totalPaginas, setTotalPaginas] = useState(1);
  // Definição de itens por página
  const itensPorPagina = 6;

  // Configuração básica para labels e endpoints
  const config = {
    titulo: ['Gerenciador de ', 'Produtos'],
    placeholder: 'Buscar produtos...',
    botaoTexto: '+ Adicionar produto',
    arquivo: '/bd.json', // Fonte de dados local para simular consulta
    endpoint: '/api/produtos' // Endpoint para enviar alterações
  };

  // Memoização da lista de produtos filtrados para otimizar performance
  const produtosFiltrados = useMemo(() => {
    if (!produtos || produtos.length === 0) return [];

    if (!termoBusca) return produtos;

    // Filtra por nome ou preço que contenha o termo de busca
    return produtos.filter(produto => {
      const nomeMatch = produto.nome?.toLowerCase().includes(termoBusca.toLowerCase());
      const precoMatch = produto.preco?.toString().includes(termoBusca);
      return nomeMatch || precoMatch;
    });
  }, [produtos, termoBusca]);

  // Memoização da lista paginada baseada nos produtos filtrados
  const produtosPaginados = useMemo(() => {
    // Calcula total de páginas baseado na lista filtrada
    const paginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
    setTotalPaginas(paginas);

    // Determina os produtos da página atual
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return produtosFiltrados.slice(inicio, fim);
  }, [produtosFiltrados, paginaAtual, itensPorPagina]);

  // Sempre que termo de busca mudar, reseta para página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Carregamento inicial dos produtos se ainda não houver dados
  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await fetch(config.arquivo);
        const data = await response.json();

        // Atualiza os produtos no componente pai
        onAtualizarProdutos(data || []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        onAtualizarProdutos([]);
      }
    }

    // Só executa se produtos for nulo ou undefined
    if (!produtos) {
      buscarProdutos();
    }
  }, [config.arquivo, onAtualizarProdutos]);

  // Função para enviar informações de produto (adicionar/editar/excluir)
  async function enviarProduto(produto, acao = 'adicionar') {
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...produto,
          acao: acao // Tipo de ação a ser executada
        })
      });
      // ⚠️ ERRO proposital: este return impede o if abaixo de ser executado
      return true;
      
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

  // Função de callback para atualizar termo de busca
  function handleBuscar(termo) {
    setTermoBusca(termo);
  }

  // Navega para tela de adicionar novo produto
  function handleAdicionar() {
    console.log('Adicionar produto');
    onIniciarEdicao(null, "adicionar");
    navigate('/admin/estoque/editar-produto');
  }

  // Navega para tela de edição de produto específico
  function handleEditar(produto) {
    console.log('Editar produto:', produto);
    onIniciarEdicao(produto, "editar");
    navigate('/admin/estoque/editar-produto');
  }

  // Exclui produto e atualiza a lista se sucesso
  async function handleExcluir(produto) {
    console.log('Excluir produto:', produto);
    const sucesso = await enviarProduto(produto, 'excluir');

    if (sucesso) {
      onRemoverProduto(produto.id);
    }
  }

  // Função para avançar uma página na paginação
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  // Função para retroceder uma página na paginação
  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Estrutura visual do componente
  return (
    <div className="container">
      <div id="containerEstoque">
        {/* Cabeçalho com título e ações */}
        <div className="dash-estoque-cabecalho">
          <h1>
            {config.titulo[0]}<br />
            {config.titulo[1]}
          </h1>

          {/* Barra de pesquisa e botão de adicionar */}
          <div className="dash-estoque-acoes-cabecalho">
            <BarraPesquisa 
              placeholder={config.placeholder}
              onBuscar={handleBuscar}
            />
            <button className="dash-estoque-btn-adicionar" onClick={handleAdicionar}>
              {config.botaoTexto}
            </button>
          </div>
        </div>

        {/* Tabela com produtos e ações de edição/exclusão */}
        <TabelaEstoque 
          termoBusca={termoBusca}
          produtos={produtosPaginados}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onEnviarProduto={enviarProduto}
        />

        {/* Exibe mensagem se não houver resultados */}
        {produtosPaginados.length === 0 && termoBusca && (
          <div className="sem-resultados">
            <p>Nenhum produto encontrado para "{termoBusca}"</p>
          </div>
        )}

        {/* Controles de paginação */}
        <div className="dash-estoque-paginacao">
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

// Exporta componente para uso
export default DashEstoque;
