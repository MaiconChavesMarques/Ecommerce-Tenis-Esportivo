// Importação de hooks do React e ferramentas de navegação
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importação de estilos e componentes customizados
import './DashEstoque.css';
import BarraPesquisa from '../../Layout/BarraPesquisa';
import TabelaEstoque from './TabelaEstoque';

// Componente principal para o dashboard de estoque
function DashEstoque({ 
  onIniciarEdicao,        // Função callback para iniciar a edição de um produto
  onRemoverProduto        // Função callback para remover um produto
}) {
  const navigate = useNavigate(); // Hook para navegação programada via React Router

  // Estado para termo de busca do usuário
  const [termoBusca, setTermoBusca] = useState('');
  // Estado para controle da página atual na paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  // Estado para lista de produtos
  const [produtos, setProdutos] = useState([]);
  // Estado para informações de paginação
  const [paginacao, setPaginacao] = useState({
    totalPaginas: 1,
    totalItens: 0,
    temProximaPagina: false,
    temPaginaAnterior: false
  });
  // Estado para controle de carregamento
  const [carregando, setCarregando] = useState(false);

  // Configuração básica para labels e endpoints
  const config = {
    titulo: ['Gerenciador de ', 'Produtos'],
    placeholder: 'Buscar produtos...',
    botaoTexto: '+ Adicionar produto'
  };

  // FETCH GET - Função para buscar dados do servidor
  async function buscarProdutos() {
    setCarregando(true);
    try {
      // Constrói URL com parâmetros de query
      const params = new URLSearchParams({
        pagina: paginaAtual.toString(),
        limite: '6' // Mantém o limite de 6 itens por página
      });

      // Adiciona termo de busca se existir
      if (termoBusca.trim()) {
        params.append('busca', termoBusca.trim());
      }

      const response = await fetch(`http://localhost:3000/products/administrador/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const data = await response.json();
      
      setProdutos(data.produtos || []);
      setPaginacao(data.paginacao || {
        totalPaginas: 1,
        totalItens: 0,
        temProximaPagina: false,
        temPaginaAnterior: false
      });

    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProdutos([]);
      setPaginacao({
        totalPaginas: 1,
        totalItens: 0,
        temProximaPagina: false,
        temPaginaAnterior: false
      });
    } finally {
      setCarregando(false);
    }
  }

  // FETCH DELETE - Função para excluir produto
  async function excluirProduto(id_interno) {
    try {
      const response = await fetch(`http://localhost:3000/products/administrador/products/${id_interno}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir produto');
      }

      const data = await response.json();
      console.log('Produto excluído com sucesso:', data);
      
      // Recarrega a lista após operação bem-sucedida
      await buscarProdutos();
      return { sucesso: true, data };
      
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return { sucesso: false, erro: error.message };
    }
  }

  // Função pública para recarregar a lista de produtos (usada pelos componentes filhos)
  const recarregarProdutos = async () => {
    await buscarProdutos();
  };

  // Efeito para buscar dados quando página ou termo de busca mudam
  useEffect(() => {
    const timer = setTimeout(() => {
      buscarProdutos();
    }, termoBusca ? 500 : 0); // Debounce para busca

    return () => clearTimeout(timer);
  }, [paginaAtual, termoBusca]);

  // Reseta a página atual para 1 sempre que o termo de busca muda
  useEffect(() => {
    if (termoBusca !== '') {
      setPaginaAtual(1);
    }
  }, [termoBusca]);

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
    // Confirma antes de excluir
    if (!window.confirm(`Tem certeza que deseja excluir ${produto.nome}?`)) {
      return;
    }

    console.log('Excluir produto:', produto);
    
    const resultado = await excluirProduto(produto.id_interno);
    
    if (resultado.sucesso) {
      // Chama callback do pai para atualizar estado global se necessário
      onRemoverProduto(produto.id_interno);
      
      // Mostra mensagem de sucesso
      alert(`${produto.nome} foi excluído com sucesso!`);
    } else {
      // Mostra mensagem de erro
      alert(`Erro ao excluir ${produto.nome}: ${resultado.erro}`);
    }
  }

  // Função para retroceder uma página na paginação
  const irParaPaginaAnterior = () => {
    if (paginacao.temPaginaAnterior) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  // Função para avançar uma página na paginação
  const irParaProximaPagina = () => {
    if (paginacao.temProximaPagina) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  // Expõe as funções para uso externo (apenas buscar e excluir)
  const apiMethods = {
    buscarProdutos,
    excluirProduto,
    recarregarProdutos
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

        {/* Indicador de carregamento */}
        {carregando && (
          <div className="dash-estoque-carregando">
            <p>Carregando...</p>
          </div>
        )}

        {/* Tabela com produtos e ações de edição/exclusão */}
        {!carregando && (
          <TabelaEstoque 
            termoBusca={termoBusca}
            produtos={produtos}
            onEditar={handleEditar}
            onExcluir={handleExcluir}
            apiMethods={apiMethods} // Passa os métodos da API para a tabela
          />
        )}

        {/* Exibe mensagem se não houver resultados */}
        {!carregando && produtos.length === 0 && termoBusca && (
          <div className="sem-resultados">
            <p>Nenhum produto encontrado para "{termoBusca}"</p>
          </div>
        )}

        {/* Mensagem exibida caso não haja dados */}
        {!carregando && produtos.length === 0 && !termoBusca && (
          <div className="sem-resultados">
            <p>Nenhum produto cadastrado</p>
          </div>
        )}

        {/* Controles de paginação */}
        {!carregando && paginacao.totalPaginas > 1 && (
          <div className="dash-estoque-paginacao">
            <button 
              onClick={irParaPaginaAnterior} 
              disabled={!paginacao.temPaginaAnterior}
            >
              Página Anterior
            </button>
            <span>
              Página {paginaAtual} de {paginacao.totalPaginas} 
              ({paginacao.totalItens} produto{paginacao.totalItens !== 1 ? 's' : ''} encontrado{paginacao.totalItens !== 1 ? 's' : ''})
            </span>
            <button 
              onClick={irParaProximaPagina} 
              disabled={!paginacao.temProximaPagina}
            >
              Próxima Página
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Exporta componente para uso
export default DashEstoque;