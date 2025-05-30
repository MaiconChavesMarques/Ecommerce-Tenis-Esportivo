import './TabelaEstoque.css';

function TabelaEstoque({ 
  termoBusca, 
  produtos = [], 
  onEditar, 
  onExcluir, 
  onEnviarProduto 
}) {

  function handleEditar(produto) {
    console.log('Editar:', produto);
    if (onEditar) {
      onEditar(produto);
    }
  }

  function handleExcluir(produto) {
    console.log('Excluir:', produto);
    if (onExcluir) {
      onExcluir(produto);
    } else if (onEnviarProduto) {
      // Fallback para a função de envio genérica
      onEnviarProduto(produto, 'excluir');
    }
  }

  // Mostrar mensagem quando não há produtos
  if (!produtos || produtos.length === 0) {
    // Se há termo de busca, significa que não há resultados para a busca
    const mensagem = termoBusca 
      ? `Nenhum resultado encontrado para "${termoBusca}".`
      : 'Nenhum produto encontrado.';

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

  return (
    <div className="produto-tabela-container">
      <div className="produto-tabela-header">
        <div className="produto-icone-tabela">
          📦
        </div>
        <h2>Estoque</h2>
      </div>

      <div className="produto-cabecalho">
        <div className="produto-coluna-imagem">Imagem</div>
        <div className="produto-coluna-nome">Nome</div>
        <div className="produto-coluna-preco">Preço</div>
        <div className="produto-coluna-quantidade">Quantidade</div>
        <div className="produto-coluna-acoes">Ações</div>
      </div>

      <div className="produto-tabela-corpo">
        {produtos.map((produto, index) => (
          <div key={produto.id || index} className="produto-item">
            <div className="produto-coluna-imagem">
              <img 
                src={produto.imagem || '/placeholder-product.jpg'} 
                alt={produto.nome || 'Produto'} 
                className="produto-imagem"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </div>
            <div className="produto-coluna-nome">
              <span className="produto-nome">{produto.nome || 'Nome não informado'}</span>
            </div>
            <div className="produto-coluna-preco">
              <span className="produto-preco">
                R$ {produto.preco ? produto.preco.toFixed(2).replace('.', ',') : '0,00'}
              </span>
            </div>
            <div className="produto-coluna-quantidade">
              <span className="produto-quantidade">
                {produto.quantidade?.reduce((total, q) => total + q, 0) || 0}
              </span>
            </div>
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