import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashAdmin.css';
import BarraPesquisa from '../../Layout/BarraPesquisa';
import TabelaPessoa from './TabelaPessoa';

function DashAdmin({ 
  tipo, 
  token, // Token do usuário logado
  onIniciarEdicao, 
  onRemoverPessoa 
}) {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState(''); // Estado para o termo de busca digitado
  const [paginaAtual, setPaginaAtual] = useState(1); // Estado para controlar a página atual da paginação
  const [pessoas, setPessoas] = useState([]); // Estado para lista de pessoas
  const [paginacao, setPaginacao] = useState({
    totalPaginas: 1,
    totalItens: 0,
    temProximaPagina: false,
    temPaginaAnterior: false
  });
  const [carregando, setCarregando] = useState(false);

  // Configurações baseadas no tipo (administrador ou cliente)
  const config = {
    administrador: {
      titulo: ['Gerenciador de ', 'Administradores'],
      placeholder: 'Buscar administradores...',
      botaoTexto: '+ Adicionar administrador'
    },
    cliente: {
      titulo: ['Gerenciador de ', 'Clientes'],
      placeholder: 'Buscar clientes...',
      botaoTexto: '+ Adicionar cliente'
    }
  };

  const currentConfig = config[tipo] || config.administrador;

  // FETCH GET - Função para buscar dados do servidor
  async function buscarPessoas() {
    setCarregando(true);
    try {
      // Constrói URL com parâmetros de query
      const params = new URLSearchParams({
        tipo: tipo,
        pagina: paginaAtual.toString(),
        limite: '8'
      });

      // Adiciona termo de busca se existir
      if (termoBusca.trim()) {
        params.append('busca', termoBusca.trim());
      }

      const response = await fetch(`http://localhost:3000/users/administrador/users?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const data = await response.json();
      
      setPessoas(data.usuarios || []);
      setPaginacao(data.paginacao || {
        totalPaginas: 1,
        totalItens: 0,
        temProximaPagina: false,
        temPaginaAnterior: false
      });

    } catch (error) {
      console.error(`Erro ao buscar ${tipo}:`, error);
      setPessoas([]);
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

  // FETCH DELETE - Função para excluir pessoa
  async function excluirPessoa(tokenPessoa) {
    try {
      const response = await fetch(`http://localhost:3000/users/administrador/users/${tokenPessoa}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir usuário');
      }

      const data = await response.json();
      console.log(`${tipo} excluído com sucesso:`, data);
      
      // Recarrega a lista após operação bem-sucedida
      await buscarPessoas();
      return { sucesso: true, data };
      
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      return { sucesso: false, erro: error.message };
    }
  }

  // Efeito para buscar dados quando página, tipo ou termo de busca mudam
  useEffect(() => {
    const timer = setTimeout(() => {
      buscarPessoas();
    }, termoBusca ? 500 : 0); // Debounce para busca

    return () => clearTimeout(timer);
  }, [paginaAtual, tipo, termoBusca]);

  // Reseta a página atual para 1 sempre que o termo de busca muda
  useEffect(() => {
    if (termoBusca !== '') {
      setPaginaAtual(1);
    }
  }, [termoBusca]);

  // Atualiza o termo de busca conforme o usuário digita
  function handleBuscar(termo) {
    setTermoBusca(termo);
  }

  // Lida com clique no botão adicionar nova pessoa
  function handleAdicionar() {
    console.log(`Adicionar ${tipo}`);
    
    // Inicia o processo de edição com estado "adicionar"
    onIniciarEdicao(null, tipo, "adicionar");
    
    // Navega para a tela de edição
    navigate('/admin/pessoas/editar-pessoa');
  }

  // Lida com edição de pessoa clicada
  function handleEditar(pessoa) {
    console.log(`Editar ${tipo}:`, pessoa);
    
    // Inicia edição com pessoa selecionada e tipo
    onIniciarEdicao(pessoa, tipo, "editar");
    
    // Navega para a tela de edição
    navigate('/admin/pessoas/editar-pessoa');
  }

  // Lida com exclusão de pessoa selecionada
  async function handleExcluir(pessoa) {
    // Verifica se o usuário está tentando deletar a si mesmo
    if (pessoa.token === token) {
      alert('Você não pode excluir sua própria conta!');
      return;
    }

    // Confirma antes de excluir
    if (!window.confirm(`Tem certeza que deseja excluir ${pessoa.nome}?`)) {
      return;
    }

    console.log(`Excluir ${tipo}:`, pessoa);
    
    const resultado = await excluirPessoa(pessoa.token);
    
    if (resultado.sucesso) {
      // Chama callback do pai para atualizar estado global se necessário
      onRemoverPessoa(pessoa.token);
      
      // Mostra mensagem de sucesso
      alert(`${pessoa.nome} foi excluído com sucesso!`);
    } else {
      // Mostra mensagem de erro
      alert(`Erro ao excluir ${pessoa.nome}: ${resultado.erro}`);
    }
  }

  // Funções para navegação da paginação
  const irParaPaginaAnterior = () => {
    if (paginacao.temPaginaAnterior) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const irParaProximaPagina = () => {
    if (paginacao.temProximaPagina) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  // Função pública para recarregar dados (pode ser chamada externamente)
  const recarregarDados = () => {
    buscarPessoas();
  };

  return (
    <div className="dash-admin-container">
      <div className="dash-admin-container-conteudo">
        <div className="dash-admin-conteudo-principal">
          <div className="dash-admin-cabecalho">
            <h1>
              {currentConfig.titulo[0]}<br />
              {currentConfig.titulo[1]}
            </h1>
            <div className="dash-admin-acoes-cabecalho">
              {/* Componente para barra de pesquisa */}
              <BarraPesquisa
                placeholder={currentConfig.placeholder}
                onBuscar={handleBuscar}
              />
              {/* Botão para adicionar nova pessoa */}
              <button className="dash-admin-btn-adicionar" onClick={handleAdicionar}>
                {currentConfig.botaoTexto}
              </button>
            </div>
          </div>

          {/* Indicador de carregamento */}
          {carregando && (
            <div className="dash-admin-carregando">
              <p>Carregando...</p>
            </div>
          )}

          {/* Tabela que exibe as pessoas */}
          {!carregando && (
            <TabelaPessoa 
              tipo={tipo}
              termoBusca={termoBusca}
              pessoas={pessoas}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
              onRecarregar={recarregarDados} // Passa função para recarregar se necessário
            />
          )}

          {/* Mensagem exibida caso não haja resultados na busca */}
          {!carregando && pessoas.length === 0 && termoBusca && (
            <div className="dash-admin-sem-resultados">
              <p>Nenhum {tipo} encontrado para "{termoBusca}"</p>
            </div>
          )}

          {/* Mensagem exibida caso não haja dados */}
          {!carregando && pessoas.length === 0 && !termoBusca && (
            <div className="dash-admin-sem-resultados">
              <p>Nenhum {tipo} cadastrado</p>
            </div>
          )}

          {/* Controles da paginação */}
          {!carregando && paginacao.totalPaginas > 1 && (
            <div className="dash-admin-paginacao">
              <button 
                onClick={irParaPaginaAnterior} 
                disabled={!paginacao.temPaginaAnterior}
              >
                Página Anterior
              </button>
              <span>
                Página {paginaAtual} de {paginacao.totalPaginas} 
                ({paginacao.totalItens} {tipo}{paginacao.totalItens !== 1 ? 's' : ''} encontrado{paginacao.totalItens !== 1 ? 's' : ''})
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
    </div>
  );
}

export default DashAdmin;