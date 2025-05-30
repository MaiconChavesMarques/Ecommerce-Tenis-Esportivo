import './TabelaPessoa.css';

function TabelaPessoa({ 
  tipo, 
  termoBusca, 
  pessoas = [], 
  onEditar, 
  onExcluir, 
  onEnviarPessoa 
}) {

  // Função chamada ao clicar em editar, chama callback onEditar se existir
  function handleEditar(pessoa) {
    console.log('Editar:', pessoa);
    if (onEditar) {
      onEditar(pessoa);
    }
  }

  // Função chamada ao clicar em excluir, tenta chamar onExcluir ou onEnviarPessoa como fallback
  function handleExcluir(pessoa) {
    console.log('Excluir:', pessoa);
    if (onExcluir) {
      onExcluir(pessoa);
    } else if (onEnviarPessoa) {
      // Fallback para a função genérica de envio com ação 'excluir'
      onEnviarPessoa(pessoa, 'excluir');
    }
  }

  // Determina o título da tabela com base no tipo de pessoa
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

  // Caso não haja pessoas para mostrar, exibe mensagem informativa
  if (!pessoas || pessoas.length === 0) {
    // Mensagem varia conforme há termo de busca ou não
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

  // Renderiza a tabela com cabeçalho e linhas de pessoas
  return (
    <div className="pessoa-tabela-container">
      <div className="pessoa-tabela-header">
        <div className="pessoa-icone-tabela">
          👤
        </div>
        <h2>{getTitulo()}</h2>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="pessoa-cabecalho">
        <div className="pessoa-coluna-nome">Nome</div>
        <div className="pessoa-coluna-email">Email</div>
        <div className="pessoa-coluna-estado">Estado</div>
        <div className="pessoa-coluna-acoes">Ações</div>
      </div>

      {/* Corpo da tabela com pessoas mapeadas */}
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
              {/* Status com classe dinâmica conforme ativo/inativo */}
              <span className={`pessoa-status ${pessoa.estadoConta === 'ativo' ? 'ativo' : 'inativo'}`}>
                {pessoa.estadoConta === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="pessoa-coluna-acoes">
              {/* Botão editar */}
              <button 
                className="pessoa-btn-acao editar" 
                onClick={() => handleEditar(pessoa)}
                title="Editar"
              >
                ✏️
              </button>
              {/* Botão excluir */}
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
