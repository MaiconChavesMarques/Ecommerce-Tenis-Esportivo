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
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 8;

  // Configurações baseadas no tipo
  const config = {
    administrador: {
      titulo: ['Gerenciador de ', 'Administradores'],
      placeholder: 'Buscar administradores...',
      botaoTexto: '+ Adicionar administrador',
      arquivo: '/usuarios.json',
      endpoint: '/api/administradores'
    },
    cliente: {
      titulo: ['Gerenciador de ', 'Clientes'],
      placeholder: 'Buscar clientes...',
      botaoTexto: '+ Adicionar cliente',
      arquivo: '/usuarios.json',
      endpoint: '/api/clientes'
    }
  };

  const currentConfig = config[tipo] || config.administrador;

  // Filtrar pessoas do tipo específico
  const pessoasTipo = useMemo(() => {
    return (pessoas || []).filter(pessoa => pessoa.tipo === tipo);
  }, [pessoas, tipo]);

  // Filtrar pessoas baseado no termo de busca
  const pessoasFiltradas = useMemo(() => {
    if (!pessoasTipo || pessoasTipo.length === 0) return [];
    
    if (!termoBusca) return pessoasTipo;
    
    return pessoasTipo.filter(pessoa => {
      const nomeMatch = pessoa.nome?.toLowerCase().includes(termoBusca.toLowerCase());
      const emailMatch = pessoa.email?.toLowerCase().includes(termoBusca.toLowerCase());
      return nomeMatch || emailMatch;
    });
  }, [pessoasTipo, termoBusca]);

  // Aplicar paginação aos dados filtrados
  const pessoasPaginadas = useMemo(() => {
    // Calcular total de páginas com base nos dados filtrados
    const paginas = Math.ceil(pessoasFiltradas.length / itensPorPagina);
    setTotalPaginas(paginas);

    // Obter somente os itens da página atual
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return pessoasFiltradas.slice(inicio, fim);
  }, [pessoasFiltradas, paginaAtual, itensPorPagina]);

  // Reset da página quando o termo de busca muda
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Carregar dados iniciais
  useEffect(() => {
    async function buscarPessoas() {
      try {
        const response = await fetch(currentConfig.arquivo);
        const data = await response.json();
        
        // Atualiza a lista no componente pai
        onAtualizarPessoas(data.filter(pessoa => pessoa.tipo === tipo) || []);
      } catch (error) {
        console.error(`Erro ao buscar ${tipo}:`, error);
        onAtualizarPessoas([]);
      }
    }
    // Só carrega se não há pessoas ou se mudou o tipo
    if (!pessoas) {
      buscarPessoas();
    }
  }, [tipo, currentConfig.arquivo, onAtualizarPessoa, pessoas]);

  // Função para enviar dados de pessoa (POST)
  async function enviarPessoa(pessoa, acao = 'adicionar') {
    try {
      const response = await fetch(currentConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pessoa,
          acao: acao // 'adicionar', 'editar', 'excluir'
        })
      });
      //Erro:
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

  function handleBuscar(termo) {
    setTermoBusca(termo);
  }

  function handleAdicionar() {
    console.log(`Adicionar ${tipo.slice(0, -1)}`);
    
    // Inicia o processo de edição através do componente pai
    onIniciarEdicao(null, tipo, "adicionar");
    
    // Navega para a página de edição
    navigate('/admin/pessoas/editar-pessoa');
  }

  // Função para editar pessoa
  function handleEditar(pessoa) {
    console.log(`Editar ${tipo.slice(0, -1)}:`, pessoa);
    
    // Inicia o processo de edição através do componente pai
    //console.log(pessoa);
    onIniciarEdicao(pessoa, tipo, "editar");
    
    // Navega para a página de edição
    navigate('/admin/pessoas/editar-pessoa');
  }

  async function handleExcluir(pessoa) {
    console.log(`Excluir ${tipo.slice(0, -1)}:`, pessoa);
    const sucesso = await enviarPessoa(pessoa, 'excluir');
    
    if (sucesso) {
      // Remove a pessoa através do componente pai usando o token
      onRemoverPessoa(pessoa.token);
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
    <div className="dash-admin-container">
      <div className="dash-admin-container-conteudo">
        <div className="dash-admin-conteudo-principal">
          <div className="dash-admin-cabecalho">
            <h1>
              {currentConfig.titulo[0]}<br />
              {currentConfig.titulo[1]}
            </h1>
            <div className="dash-admin-acoes-cabecalho">
              <BarraPesquisa
                placeholder={currentConfig.placeholder}
                onBuscar={handleBuscar}
              />
              <button className="dash-admin-btn-adicionar" onClick={handleAdicionar}>
                {currentConfig.botaoTexto}
              </button>
            </div>
          </div>

          <TabelaPessoa 
            tipo={tipo}
            termoBusca={termoBusca}
            pessoas={pessoasPaginadas}
            onEditar={handleEditar}
            onExcluir={handleExcluir}
            onEnviarPessoa={enviarPessoa}
          />

          {/* Mostrar mensagem quando não há resultados */}
          {pessoasPaginadas.length === 0 && termoBusca && (
            <div className="dash-admin-sem-resultados">
              <p>Nenhum {tipo.slice(0, -1)} encontrado para "{termoBusca}"</p>
            </div>
          )}

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