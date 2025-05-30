import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProdutoDetalhe.css';
import { useNavigate } from "react-router-dom";

const ProdutoDetalhe = ({ onAddToCart }) => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [produtosSemelhantes, setProdutosSemelhantes] = useState([]);
  let destino;
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarProduto() {
      try {
        const response = await fetch('/bd.json');
        const produtos = await response.json();
        const produtoEncontrado = produtos.find(p => String(p.id) === String(id));
        
        if (produtoEncontrado) {
          setProduto(produtoEncontrado);
          
          // NOTA: Esta é uma busca local de alto custo computacional.
          // Em produção, o servidor deve retornar os produtos semelhantes
          // já processados para otimizar a performance.
          buscarProdutosSemelhantes(produtos, produtoEncontrado);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }

    buscarProduto();
  }, [id]);

  const buscarProdutosSemelhantes = (todosProdutos, produtoAtual) => {
    // AVISO: Algoritmo de busca local com alta complexidade O(n log n)
    // Futuramente será substituído por endpoint otimizado do servidor
    
    // 1. Ordenar todos os produtos por preço
    const produtosOrdenados = todosProdutos
      .filter(p => String(p.id) !== String(produtoAtual.id)) // Excluir o produto atual
      .sort((a, b) => a.preco - b.preco);
    
    // 2. Encontrar a posição do produto atual na lista ordenada
    const precoAtual = produtoAtual.preco;
    let posicaoAtual = produtosOrdenados.findIndex(p => p.preco >= precoAtual);
    
    // Se não encontrou posição (preço muito alto), colocar no final
    if (posicaoAtual === -1) {
      posicaoAtual = produtosOrdenados.length;
    }
    
    // 3. Estratégia de coleta: tenta um lado, se não der pega do outro
    const semelhantes = [];
    const totalDesejado = 6;
    
    // Calcular quantos elementos estão disponíveis em cada lado
    const disponivelAntes = posicaoAtual;
    const disponivelDepois = produtosOrdenados.length - posicaoAtual;
    
    // Estratégia otimizada: preenche um lado e depois o outro conforme disponibilidade
    let elementosAntes = Math.min(3, disponivelAntes);
    let elementosDepois = Math.min(3, disponivelDepois);
    
    // Se um lado não tem elementos suficientes, pega mais do outro lado
    if (elementosAntes < 3 && disponivelDepois > 3) {
      elementosDepois = Math.min(totalDesejado - elementosAntes, disponivelDepois);
    } else if (elementosDepois < 3 && disponivelAntes > 3) {
      elementosAntes = Math.min(totalDesejado - elementosDepois, disponivelAntes);
    }
    
    // Pegar elementos antes da posição atual (preços menores)
    const inicioAntes = Math.max(0, posicaoAtual - elementosAntes);
    for (let i = inicioAntes; i < posicaoAtual; i++) {
      semelhantes.push(produtosOrdenados[i]);
    }
    
    // Pegar elementos depois da posição atual (preços maiores)
    const fimDepois = Math.min(produtosOrdenados.length, posicaoAtual + elementosDepois);
    for (let i = posicaoAtual; i < fimDepois; i++) {
      semelhantes.push(produtosOrdenados[i]);
    }
    
    // Garantir máximo de 6 elementos
    setProdutosSemelhantes(semelhantes.slice(0, 6));
  };

  const handleAddToCart = () => {
    if (!tamanhoSelecionado) {
      alert("Por favor, selecione um tamanho");
      return;
    }
    
    onAddToCart(parseInt(id), parseInt(tamanhoSelecionado));
  };

  if (!produto) {
    return <div className="pd-produto-container">Carregando...</div>;
  }

  function handleNavigateToProduct(id_prox) {
    navigate(`/produto/${id_prox}`);
  }

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
              {["38", "39", "40", "41", "42", "43", "44"].map(tamanho => (
                <button 
                  key={tamanho}
                  className={`pd-btn-tamanho ${tamanhoSelecionado === tamanho ? 'pd-selecionado' : ''}`}
                  onClick={() => setTamanhoSelecionado(tamanho)}
                >
                  {tamanho}
                </button>
              ))}
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

      {/* Seção de produtos semelhantes */}
      {produtosSemelhantes.length > 0 && (
        <div className="pd-produtos-semelhantes">
          <h2>Produtos com preço semelhante:</h2>
          <div className="pd-grid-semelhantes">
            {produtosSemelhantes.map((item) => (
              <div key={item.id} className="pd-produto-semelhante" onClick={() => handleNavigateToProduct(item.id)}>
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