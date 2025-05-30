import './TabelaEstoque.css';

function TabelaEstoque({ 
  termoBusca,   // Texto para filtro/termo de busca
  produtos = [], // Lista de produtos, padrão para array vazio
  onEditar,     // Callback para editar produto
  onExcluir,    // Callback para excluir produto
  onEnviarProduto // Callback genérico para enviar ação sobre produto (excluir, etc)
}) {

  // Função para tratar clique no botão editar
  function handleEditar(produto) {
    console.log('Editar:', produto);
    if (onEditar) {
      onEditar(produto); // Executa callback se definido
    }
  }

  // Função para tratar clique no botão excluir
  function handleExcluir(produto) {
    console.log('Excluir:', produto);
    if (onExcluir) {
      onExcluir(produto); // Executa callback de exclusão se definido
    } else if (onEnviarProduto) {
      // Se não houver onExcluir, chama callback genérico para exclusão
      onEnviarProduto(produto, 'excluir');
    }
  }

  // Caso não existam produtos para exibir
  if (!produtos || produtos.length === 0) {
    // Mensagem exibida depende se há termo de busca ou não
    const mensagem = termoBusca 
      ? `Nenhum resultado encontrado para "${termoBusca}".`
      : 'Nenhum produto encontrado.';

    // Retorna a estrutura de mensagem sem tabela
    return (
      <div className="produto-tabela-container">
        <div className="produto-tabela-header">
          <div className="produto-icone-tabela">
            📦
          </div>
          <h2>Estoque</h2>
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

  // Renderização da tabela de produtos quando há itens na lista
  return (
    <div className="produto-tabela-container">
      {/* Cabeçalho da tabela */}
      <div className="produto-tabela-header">
        <div className="produto-icone-tabela">
          📦
        </div>
        <h2>Estoque</h2>
      </div>

      {/* Linha de cabeçalho das colunas */}
      <div className="produto-cabecalho">
        <div className="produto-coluna-imagem">Imagem</div>
        <div className="produto-coluna-nome">Nome</div>
        <div className="produto-coluna-preco">Preço</div>
        <div className="produto-coluna-quantidade">Quantidade</div>
        <div className="produto-coluna-acoes">Ações</div>
      </div>

      {/* Corpo da tabela com lista de produtos */}
      <div className="produto-tabela-corpo">
        {produtos.map((produto, index) => (
          // Cada produto é uma linha da tabela
          <div key={produto.id || index} className="produto-item">
            {/* Coluna da imagem do produto */}
            <div className="produto-coluna-imagem">
              <img 
                src={produto.imagem || '/placeholder-product.jpg'} 
                alt={produto.nome || 'Produto'} 
                className="produto-imagem"
                onError={(e) => {
                  // Se imagem não carregar, usa placeholder
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </div>

            {/* Coluna do nome do produto */}
            <div className="produto-coluna-nome">
              <span className="produto-nome">{produto.nome || 'Nome não informado'}</span>
            </div>

            {/* Coluna do preço do produto */}
            <div className="produto-coluna-preco">
              <span className="produto-preco">
                {/* Formata preço para moeda brasileira */}
                R$ {produto.preco ? produto.preco.toFixed(2).replace('.', ',') : '0,00'}
              </span>
            </div>

            {/* Coluna da quantidade total do produto (soma das quantidades em array) */}
            <div className="produto-coluna-quantidade">
              <span className="produto-quantidade">
                {produto.quantidade?.reduce((total, q) => total + q, 0) || 0}
              </span>
            </div>

            {/* Coluna com botões de ação: editar e excluir */}
            <div className="produto-coluna-acoes">
              <button 
                className="produto-btn-acao editar" 
                onClick={() => handleEditar(produto)}
                title="Editar"
              >
                ✏️
              </button>
              <button 
                className="produto-btn-acao excluir" 
                onClick={() => handleExcluir(produto)}
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

export default TabelaEstoque;
