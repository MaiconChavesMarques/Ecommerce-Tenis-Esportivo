import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProdutoDetalhe.css';
import BarraPesquisa from './BarraPesquisa';

const ProdutoDetalhe = ({ onAddToCart }) => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);

  useEffect(() => {
    async function buscarProduto() {
      try {
        const response = await fetch('/bd.json');
        const produtos = await response.json();
        const produtoEncontrado = produtos.find(p => String(p.id) === String(id));
        
        if (produtoEncontrado) {
          setProduto(produtoEncontrado);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }

    buscarProduto();
  }, [id]);

  const handleAddToCart = () => {
    if (!tamanhoSelecionado) {
      alert("Por favor, selecione um tamanho");
      return;
    }
    
    onAddToCart(id, tamanhoSelecionado);
  };

  if (!produto) {
    return <div className="produto-container">Carregando...</div>;
  }

  return (
    <div className="produto-container">
      <BarraPesquisa />

      <div className="produto-detalhe">
        <div className="produto-imagem">
          <img src={produto.imagem} alt={produto.nome} />
        </div>
        
        <div className="produto-info">
          <h1 className="produto-titulo">Velox EdgeStep</h1>
          <p className="produto-marca">Velox</p>
          <p className="produto-preco">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
          
          <div className="produto-descricao">
            <h3>⭐ Descrição do produto:</h3>
            <p>{produto.descricao || "Estilo, suporte e segurança se encontram no EdgeStep, que oferece entressola estável e solado de alta aderência para movimentos firmes e controlados."}</p>
          </div>
          
          <div className="tamanhos-container">
            <p>Tamanhos disponíveis:</p>
            <div className="tamanhos-grid">
              {["38", "39", "40", "41", "42", "43", "44"].map(tamanho => (
                <button 
                  key={tamanho}
                  className={`btn-tamanho ${tamanhoSelecionado === tamanho ? 'selecionado' : ''}`}
                  onClick={() => setTamanhoSelecionado(tamanho)}
                >
                  {tamanho}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className="btn-adicionar-carrinho"
            onClick={handleAddToCart}
          >
            <span>🛒</span> Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProdutoDetalhe;