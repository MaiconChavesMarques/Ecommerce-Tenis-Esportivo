import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProdutoDetalhe.css';
import { useNavigate } from "react-router-dom";

const ProdutoDetalhe = ({ onAddToCart }) => {
  // Obtém o parâmetro "id" da URL
  const { id } = useParams();
  // Estado para armazenar o produto atual
  const [produto, setProduto] = useState(null);
  // Estado para armazenar o tamanho selecionado pelo usuário
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  // Estado para armazenar os produtos semelhantes ao atual
  const [produtosSemelhantes, setProdutosSemelhantes] = useState([]);
  const navigate = useNavigate();

  // useEffect para buscar os dados do produto sempre que o id mudar
  useEffect(() => {
    async function buscarProduto() {
      try {
        // Requisição para o endpoint do backend que retorna produto e produtos semelhantes
        const response = await fetch(`http://localhost:3000/products/productPage/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setProduto(data.produto);
          setProdutosSemelhantes(data.produtosSemelhantes);
        } else {
          console.error("Erro ao buscar produto:", data.message);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }

    buscarProduto();
  }, [id]);

  // Função para adicionar produto ao carrinho, validando seleção do tamanho
  const handleAddToCart = () => {
    if (!tamanhoSelecionado) {
      alert("Por favor, selecione um tamanho");
      return;
    }
    
    onAddToCart(produto.id_interno, parseInt(tamanhoSelecionado));
  };

  // Exibe mensagem enquanto o produto está carregando
  if (!produto) {
    return <div className="pd-produto-container">Carregando...</div>;
  }

  // Função para navegar para o detalhe de outro produto (produtos semelhantes)
  function handleNavigateToProduct(id_prox) {
    navigate(`/produto/${id_prox}`);
  }

  // Renderização do componente com detalhes do produto, tamanhos e produtos semelhantes
  return (
    <div className="pd-produto-container">
      <div className="pd-produto-detalhe">
        <div className="pd-produto-imagem">
          <img src={produto.imagem} alt={produto.nome} />
        </div>
        
        <div className="pd-produto-info">
          <h1 className="pd-produto-titulo">{produto.nome}</h1>
          <p className="pd-produto-marca">Velox</p>
          <p className="pd-produto-preco">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
          
          <div className="pd-produto-descricao">
            <h3>⭐ Descrição do produto:</h3>
            <p>{produto.descricao || "Estilo, suporte e segurança se encontram no EdgeStep, que oferece entressola estável e solado de alta aderência para movimentos firmes e controlados."}</p>
          </div>
          
          <div className="pd-tamanhos-container">
            <p>Tamanhos disponíveis:</p>
            <div className="pd-tamanhos-grid">
              {/* Renderiza os tamanhos disponíveis do produto */}
              {produto.tamanhos && produto.tamanhos.length > 0 ? (
                produto.tamanhos.map((tamanho, index) => (
                  <button 
                    key={tamanho}
                    className={`pd-btn-tamanho ${tamanhoSelecionado === tamanho ? 'pd-selecionado' : ''}`}
                    onClick={() => setTamanhoSelecionado(tamanho)}
                    disabled={produto.quantidade && produto.quantidade[index] === 0}
                  >
                    {tamanho}
                  </button>
                ))
              ) : (
                // Fallback para tamanhos padrão se não houver tamanhos no produto
                ["38", "39", "40", "41", "42", "43", "44"].map(tamanho => (
                  <button 
                    key={tamanho}
                    className={`pd-btn-tamanho ${tamanhoSelecionado === tamanho ? 'pd-selecionado' : ''}`}
                    onClick={() => setTamanhoSelecionado(tamanho)}
                  >
                    {tamanho}
                  </button>
                ))
              )}
            </div>
          </div>
          
          <button 
            className="pd-btn-adicionar-carrinho"
            onClick={handleAddToCart}
          >
            <span>🛒</span> Adicionar ao carrinho
          </button>
        </div>
      </div>

      {/* Renderiza produtos semelhantes se houver */}
      {produtosSemelhantes.length > 0 && (
        <div className="pd-produtos-semelhantes">
          <h2>Produtos com preço semelhante:</h2>
          <div className="pd-grid-semelhantes">
            {/* Lista de produtos semelhantes, clicáveis para navegar para seu detalhe */}
            {produtosSemelhantes.map((item) => (
              <div key={item.id_interno} className="pd-produto-semelhante" onClick={() => handleNavigateToProduct(item.id_interno)}>
                <div className="pd-produto-semelhante-imagem">
                  <img src={item.imagem} alt={item.nome}/>
                </div>
                <div className="pd-produto-semelhante-info">
                  <h4 className="pd-produto-semelhante-nome">{item.nome}</h4>
                  <p className="pd-produto-semelhante-preco">
                    R$ {item.preco.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdutoDetalhe;