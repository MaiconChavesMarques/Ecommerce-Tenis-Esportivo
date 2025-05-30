import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashAdmin.css';
import BarraPesquisa from '../../Layout/BarraPesquisa';
import TabelaPessoa from './TabelaPessoa';

function DashAdmin({ 
  tipo, 
  pessoas, 
  onIniciarEdicao, 
  onAtualizarPessoas, 
  onAdicionarPessoa, 
  onAtualizarPessoa, 
  onRemoverPessoa 
}) {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState(''); // Estado para o termo de busca digitado
  const [paginaAtual, setPaginaAtual] = useState(1); // Estado para controlar a página atual da paginação
  const [totalPaginas, setTotalPaginas] = useState(1); // Estado para o total de páginas calculado
  const itensPorPagina = 8; // Quantidade fixa de itens por página

  // Configurações baseadas no tipo (administrador ou cliente)
  const config = {
    administrador: {
      titulo: ['Gerenciador de ', 'Administradores'],
      placeholder: 'Buscar administradores...',
      botaoTexto: '+ Adicionar administrador',
      arquivo: '/usuarios.json', // Arquivo local para dados (mock)
      endpoint: '/api/administradores' // Endpoint para API
    },
    cliente: {
      titulo: ['Gerenciador de ', 'Clientes'],
      placeholder: 'Buscar clientes...',
      botaoTexto: '+ Adicionar cliente',
      arquivo: '/usuarios.json',
      endpoint: '/api/clientes'
    }
  };

  const currentConfig = config[tipo] || config.administrador; // Define config atual baseada no tipo recebido

  // Filtra pessoas pelo tipo atual usando useMemo para otimizar
  const pessoasTipo = useMemo(() => {
    return (pessoas || []).filter(pessoa => pessoa.tipo === tipo);
  }, [pessoas, tipo]);

  // Filtra pessoas pelo termo de busca (nome ou email), também memoizado
  const pessoasFiltradas = useMemo(() => {
    if (!pessoasTipo || pessoasTipo.length === 0) return [];
    
    if (!termoBusca) return pessoasTipo; // Se não tem termo, retorna todos do tipo
    
    return pessoasTipo.filter(pessoa => {
      const nomeMatch = pessoa.nome?.toLowerCase().includes(termoBusca.toLowerCase());
      const emailMatch = pessoa.email?.toLowerCase().includes(termoBusca.toLowerCase());
      return nomeMatch || emailMatch;
    });
  }, [pessoasTipo, termoBusca]);

  // Aplica paginação nos dados filtrados e atualiza total de páginas
  const pessoasPaginadas = useMemo(() => {
    // Calcula total de páginas com base nos dados filtrados
    const paginas = Math.ceil(pessoasFiltradas.length / itensPorPagina);
    setTotalPaginas(paginas);

    // Seleciona somente os itens da página atual
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return pessoasFiltradas.slice(inicio, fim);
  }, [pessoasFiltradas, paginaAtual, itensPorPagina]);

  // Reseta a página atual para 1 sempre que o termo de busca muda
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Efeito para carregar dados iniciais quando o componente monta ou tipo muda
  useEffect(() => {
    async function buscarPessoas() {
      try {
        const response = await fetch(currentConfig.arquivo);
        const data = await response.json();
        
        // Atualiza a lista no componente pai com dados filtrados pelo tipo
        onAtualizarPessoas(data.filter(pessoa => pessoa.tipo === tipo) || []);
      } catch (error) {
        console.error(`Erro ao buscar ${tipo}:`, error);
        onAtualizarPessoas([]);
      }
    }
    // Busca os dados somente se a lista de pessoas não está disponível ainda
    if (!pessoas) {
      buscarPessoas();
    }
  }, [tipo, currentConfig.arquivo, onAtualizarPessoa, pessoas]);

  // Função para enviar dados de pessoa para a API (POST)
  async function enviarPessoa(pessoa, acao = 'adicionar') {
    try {
      const response = await fetch(currentConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pessoa,
          acao: acao // Ação: 'adicionar', 'editar', 'excluir'
        })
      });
      //Erro: retorno antecipado, código abaixo nunca executado
      return true;
      
      if (response.ok) {
        console.log(`${tipo.slice(0, -1)} ${acao} com sucesso`);
        return true;
      } else {
        console.error(`Erro ao ${acao} ${tipo.slice(0, -1)}`);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return false;
    }
  }

  // Atualiza o termo de busca conforme o usuário digita
  function handleBuscar(termo) {
    setTermoBusca(termo);
  }

  // Lida com clique no botão adicionar nova pessoa
  function handleAdicionar() {
    console.log(`Adicionar ${tipo.slice(0, -1)}`);
    
    // Inicia o processo de edição com estado "adicionar"
    onIniciarEdicao(null, tipo, "adicionar");
    
    // Navega para a tela de edição
    navigate('/admin/pessoas/editar-pessoa');
  }

  // Lida com edição de pessoa clicada
  function handleEditar(pessoa) {
    console.log(`Editar ${tipo.slice(0, -1)}:`, pessoa);
    
    // Inicia edição com pessoa selecionada e tipo
    onIniciarEdicao(pessoa, tipo, "editar");
    
    // Navega para a tela de edição
    navigate('/admin/pessoas/editar-pessoa');
  }

  // Lida com exclusão de pessoa selecionada
  async function handleExcluir(pessoa) {
    console.log(`Excluir ${tipo.slice(0, -1)}:`, pessoa);
    const sucesso = await enviarPessoa(pessoa, 'excluir');
    
    if (sucesso) {
      // Remove a pessoa do estado do componente pai usando o token
      onRemoverPessoa(pessoa.token);
    }
  }

  // Funções para navegação da paginação
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
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

          {/* Tabela que exibe as pessoas paginadas */}
          <TabelaPessoa 
            tipo={tipo}
            termoBusca={termoBusca}
            pessoas={pessoasPaginadas}
            onEditar={handleEditar}
            onExcluir={handleExcluir}
            onEnviarPessoa={enviarPessoa}
          />

          {/* Mensagem exibida caso não haja resultados na busca */}
          {pessoasPaginadas.length === 0 && termoBusca && (
            <div className="dash-admin-sem-resultados">
              <p>Nenhum {tipo.slice(0, -1)} encontrado para "{termoBusca}"</p>
            </div>
          )}

          {/* Controles da paginação */}
          <div className="dash-admin-paginacao">
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
    </div>
  );
}

export default DashAdmin;
