import './TabelaPessoa.css';
import './DashEstoque.css';

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
      <div className="tabela-container">
        <div className="tabela-header">
          <div className="icone-tabela">
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
    <div className="tabela-container">
      <div className="tabela-header">
        <div className="icone-tabela">
          📦
        </div>
        <h2>Estoque</h2>
      </div>

      <div className="tabela-cabecalho">
        <div className="coluna-imagem">Imagem</div>
        <div className="coluna-nome">Nome</div>
        <div className="coluna-preco">Preço</div>
        <div className="coluna-quantidade">Quantidade</div>
        <div className="coluna-acoes">Ações</div>
      </div>

      <div className="tabela-corpo">
        {produtos.map((produto, index) => (
          <div key={produto.id || index} className="item-tabela item-produto">
            <div className="coluna-imagem">
              <img 
                src={produto.imagem || '/placeholder-product.jpg'} 
                alt={produto.nome || 'Produto'} 
                className="imagem-produto"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </div>
            <div className="coluna-nome">
              <span className="nome-produto">{produto.nome || 'Nome não informado'}</span>
            </div>
            <div className="coluna-preco">
              <span className="preco-produto">
                R$ {produto.preco ? produto.preco.toFixed(2).replace('.', ',') : '0,00'}
              </span>
            </div>
            <div className="coluna-quantidade">
              <span className="quantidade-produto">{produto.quantidade.reduce((total, q) => total + q, 0) || 0}</span>
            </div>
            <div className="coluna-acoes">
              <button 
                className="btn-acao editar" 
                onClick={() => handleEditar(produto)}
                title="Editar"
              >
                ✏️
              </button>
              <button 
                className="btn-acao excluir" 
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