import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashAdmin.css';
import BarraPesquisa from './BarraPesquisa';
import TabelaPessoa from './TabelaPessoa';

function DashAdmin({ tipo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [termoBusca, setTermoBusca] = useState('');
  const [pessoas, setPessoas] = useState([]);

  // Configurações baseadas no tipo
  const config = {
    administrador: {
      titulo: 'Gerenciador de administradores',
      placeholder: 'Buscar administradores...',
      botaoTexto: '+ Adicionar administrador',
      arquivo: '/usuarios.json',
      endpoint: '/api/administradores'
    },
    cliente: {
      titulo: 'Gerenciador de clientes',
      placeholder: 'Buscar clientes...',
      botaoTexto: '+ Adicionar cliente',
      arquivo: '/usuarios.json',
      endpoint: '/api/clientes'
    }
  };

  const currentConfig = config[tipo] || config.administrador;

  useEffect(() => {
    async function buscarPessoas() {
      try {
        const response = await fetch(currentConfig.arquivo);
        const data = await response.json();
  
        // Filtra só os que têm o tipo desejado
        const pessoasFiltradas = (data || []).filter(pessoa => pessoa.tipo === tipo);
  
        setPessoas(pessoasFiltradas);
        console.log(pessoasFiltradas);
      } catch (error) {
        console.error(`Erro ao buscar ${tipo}:`, error);
        setPessoas([]);
      }
    }
    
    buscarPessoas();
  }, [tipo, currentConfig.arquivo]);  

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
    // Implementar navegação ou modal para adicionar pessoa
    console.log(`Adicionar ${tipo.slice(0, -1)}`);
  }

  // Função para editar pessoa - navega para EditarPessoa com dados
  function handleEditar(pessoa) {
    console.log(`Editar ${tipo.slice(0, -1)}:`, pessoa);
    
    // Navega para a página de edição passando os dados da pessoa
    navigate('/editar-pessoa', {
      state: {
        pessoa: pessoa,
        tipo: tipo
      }
    });
  }

  async function handleExcluir(pessoa) {
    console.log(`Excluir ${tipo.slice(0, -1)}:`, pessoa);
    const sucesso = await enviarPessoa(pessoa, 'excluir');
    
    if (sucesso) {
      // Remove a pessoa da lista local
      setPessoas(prev => 
        prev.filter(p => p.email !== pessoa.email)
      );
    }
  }

  function handleAdicionarNovo(novaPessoa) {
    // Função para ser chamada quando uma nova pessoa for adicionada
    setPessoas(prev => [...prev, novaPessoa]);
  }

  function handleAtualizar(pessoaAtualizada) {
    // Função para ser chamada quando uma pessoa for editada
    setPessoas(prev => 
      prev.map(p => 
        p.email === pessoaAtualizada.email ? pessoaAtualizada : p
      )
    );
  }

  // Escuta por mudanças na página (quando voltar da edição)
  useEffect(() => {
    // Recarrega os dados quando a página voltar ao foco
    async function buscarPessoas() {
      try {
        const response = await fetch(currentConfig.arquivo);
        const data = await response.json();
        const pessoasFiltradas = (data || []).filter(pessoa => pessoa.tipo === tipo);
        setPessoas(pessoasFiltradas);
      } catch (error) {
        console.error(`Erro ao buscar ${tipo}:`, error);
        setPessoas([]);
      }
    }
    
    buscarPessoas();
  }, [location.pathname]); // Executa quando a URL muda

  return (
    <div className="container">
      <div id="containerConteudo">
        <div className="cabecalho-dash">
          <h1>{currentConfig.titulo}</h1>
          <div className="acoes-cabecalho">
            <BarraPesquisa 
              placeholder={currentConfig.placeholder}
              onBuscar={handleBuscar}
            />
            <button className="btn-adicionar" onClick={handleAdicionar}>
              {currentConfig.botaoTexto}
            </button>
          </div>
        </div>

        <TabelaPessoa 
          tipo={tipo}
          termoBusca={termoBusca}
          pessoas={pessoas}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onEnviarPessoa={enviarPessoa}
        />
      </div>
    </div>
  );
}

export default DashAdmin;