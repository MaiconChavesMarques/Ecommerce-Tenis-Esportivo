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
    // Se há termo de busca, significa que não há resultados para a busca
    const mensagem = termoBusca 
      ? `Nenhum resultado encontrado para "${termoBusca}".`
      : `Nenhum ${tipo === 'administradores' ? 'administrador' : 'cliente'} encontrado.`;

    return (
      <div className="pessoa-tabela-container">
        <div className="pessoa-tabela-header">
          <div className="pessoa-icone-tabela">
            👤
          </div>
          <h2>{getTitulo()}</h2>
        </div>
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          color: '#666' 
        }}>
          {mensagem}
        </div>
      </div>
    );
  }

  return (
    <div className="pessoa-tabela-container">
      <div className="pessoa-tabela-header">
        <div className="pessoa-icone-tabela">
          👤
        </div>
        <h2>{getTitulo()}</h2>
      </div>

      <div className="pessoa-cabecalho">
        <div className="pessoa-coluna-nome">Nome</div>
        <div className="pessoa-coluna-email">Email</div>
        <div className="pessoa-coluna-estado">Estado</div>
        <div className="pessoa-coluna-acoes">Ações</div>
      </div>

      <div className="pessoa-tabela-corpo">
        {pessoas.map((pessoa, index) => (
          <div key={pessoa.email || index} className="pessoa-item">
            <div className="pessoa-coluna-nome">
              <span className="pessoa-nome">{pessoa.nome || 'Nome não informado'}</span>
            </div>
            <div className="pessoa-coluna-email">
              <span className="pessoa-email">{pessoa.email || 'Email não informado'}</span>
            </div>
            <div className="pessoa-coluna-estado">
              <span className={`pessoa-status ${pessoa.estadoConta === 'ativo' ? 'ativo' : 'inativo'}`}>
                {pessoa.estadoConta === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="pessoa-coluna-acoes">
              <button 
                className="pessoa-btn-acao editar" 
                onClick={() => handleEditar(pessoa)}
                title="Editar"
              >
                ✏️
              </button>
              <button 
                className="pessoa-btn-acao excluir" 
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