import { useMemo } from 'react';
import './TabelaPessoa.css';

function TabelaPessoa({ 
  tipo, 
  termoBusca, 
  pessoas = [], 
  onEditar, 
  onExcluir, 
  onEnviarPessoa 
}) {

  function handleEditar(pessoa) {
    console.log('Editar:', pessoa);
    if (onEditar) {
      onEditar(pessoa);
    }
  }

  function handleExcluir(pessoa) {
    console.log('Excluir:', pessoa);
    if (onExcluir) {
      onExcluir(pessoa);
    } else if (onEnviarPessoa) {
      // Fallback para a função de envio genérica
      onEnviarPessoa(pessoa, 'excluir');
    }
  }

  // Filtrar pessoas baseado no termo de busca usando useMemo para otimização
  const pessoasFiltradas = useMemo(() => {
    if (!pessoas || pessoas.length === 0) return [];
    
    if (!termoBusca) return pessoas;
    
    return pessoas.filter(pessoa => {
      const nomeMatch = pessoa.nome?.toLowerCase().includes(termoBusca.toLowerCase());
      const emailMatch = pessoa.email?.toLowerCase().includes(termoBusca.toLowerCase());
      return nomeMatch || emailMatch;
    });
  }, [pessoas, termoBusca]);

  // Determinar o título baseado no tipo
  const getTitulo = () => {
    switch(tipo) {
      case 'administradores':
        return 'Administradores';
      case 'clientes':
        return 'Clientes';
      default:
        return 'Pessoas';
    }
  };

  // Mostrar mensagem quando não há pessoas
  if (!pessoas || pessoas.length === 0) {
    return (
      <div className="tabela-container">
        <div className="tabela-header">
          <div className="icone-tabela">
            👤
          </div>
          <h2>{getTitulo()}</h2>
        </div>
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          color: '#666' 
        }}>
          Nenhum {tipo === 'administradores' ? 'administrador' : 'cliente'} encontrado.
        </div>
      </div>
    );
  }

  // Mostrar mensagem quando não há resultados de busca
  if (pessoasFiltradas.length === 0 && termoBusca) {
    return (
      <div className="tabela-container">
        <div className="tabela-header">
          <div className="icone-tabela">
            👤
          </div>
          <h2>{getTitulo()}</h2>
        </div>
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          color: '#666' 
        }}>
          Nenhum resultado encontrado para "{termoBusca}".
        </div>
      </div>
    );
  }

  return (
    <div className="tabela-container">
      <div className="tabela-header">
        <div className="icone-tabela">
          👤
        </div>
        <h2>{getTitulo()}</h2>
      </div>

      <div className="tabela-cabecalho">
        <div className="coluna-nome">Nome</div>
        <div className="coluna-email">Email</div>
        <div className="coluna-estado">Estado</div>
        <div className="coluna-acoes">Ações</div>
      </div>

      <div className="tabela-corpo">
        {pessoasFiltradas.map((pessoa, index) => (
          <div key={pessoa.email || index} className="item-tabela">
            <div className="coluna-nome">
              <span className="nome-pessoa">{pessoa.nome || 'Nome não informado'}</span>
            </div>
            <div className="coluna-email">
              <span className="email-pessoa">{pessoa.email || 'Email não informado'}</span>
            </div>
            <div className="coluna-estado">
              <span className={`status ${pessoa.ativo ? 'ativo' : 'inativo'}`}>
                {pessoa.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="coluna-acoes">
              <button 
                className="btn-acao editar" 
                onClick={() => handleEditar(pessoa)}
                title="Editar"
              >
                ✏️
              </button>
              <button 
                className="btn-acao excluir" 
                onClick={() => handleExcluir(pessoa)}
                title="Excluir"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabelaPessoa;