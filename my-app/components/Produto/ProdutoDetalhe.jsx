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
  let destino;
  const navigate = useNavigate();

  // useEffect para buscar os dados do produto sempre que o id mudar
  useEffect(() => {
    async function buscarProduto() {
      try {
        // Requisição para obter todos os produtos do banco local (bd.json)
        const response = await fetch('/bd.json');
        const produtos = await response.json();
        // Busca o produto cujo id corresponde ao parâmetro da URL
        const produtoEncontrado = produtos.find(p => String(p.id) === String(id));
        
        if (produtoEncontrado) {
          setProduto(produtoEncontrado);
          
          // NOTA: Esta busca local é custosa, idealmente o servidor deve enviar produtos semelhantes já processados
          buscarProdutosSemelhantes(produtos, produtoEncontrado);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }

    buscarProduto();
  }, [id]);

  // Função para buscar produtos com preço semelhante ao produto atual
  const buscarProdutosSemelhantes = (todosProdutos, produtoAtual) => {
    // AVISO: Algoritmo local de complexidade O(n log n), substituído futuramente por endpoint otimizado
    
    // 1. Ordenar produtos pelo preço, excluindo o produto atual
    const produtosOrdenados = todosProdutos
      .filter(p => String(p.id) !== String(produtoAtual.id))
      .sort((a, b) => a.preco - b.preco);
    
    // 2. Encontrar a posição do preço do produto atual na lista ordenada
    const precoAtual = produtoAtual.preco;
    let posicaoAtual = produtosOrdenados.findIndex(p => p.preco >= precoAtual);
    
    // Se preço do produto atual for maior que todos os produtos, coloca no final da lista
    if (posicaoAtual === -1) {
      posicaoAtual = produtosOrdenados.length;
    }
    
    // 3. Estratégia para coletar produtos semelhantes: tenta balancear antes e depois da posição atual
    const semelhantes = [];
    const totalDesejado = 6;
    
    // Calcula quantos produtos estão disponíveis antes e depois da posição atual
    const disponivelAntes = posicaoAtual;
    const disponivelDepois = produtosOrdenados.length - posicaoAtual;
    
    // Inicialmente tenta pegar 3 elementos antes e 3 depois, se possível
    let elementosAntes = Math.min(3, disponivelAntes);
    let elementosDepois = Math.min(3, disponivelDepois);
    
    // Se algum lado não tem elementos suficientes, completa do outro lado
    if (elementosAntes < 3 && disponivelDepois > 3) {
      elementosDepois = Math.min(totalDesejado - elementosAntes, disponivelDepois);
    } else if (elementosDepois < 3 && disponivelAntes > 3) {
      elementosAntes = Math.min(totalDesejado - elementosDepois, disponivelAntes);
    }
    
    // Adiciona elementos antes da posição atual (preços menores)
    const inicioAntes = Math.max(0, posicaoAtual - elementosAntes);
    for (let i = inicioAntes; i < posicaoAtual; i++) {
      semelhantes.push(produtosOrdenados[i]);
    }
    
    // Adiciona elementos depois da posição atual (preços maiores)
    const fimDepois = Math.min(produtosOrdenados.length, posicaoAtual + elementosDepois);
    for (let i = posicaoAtual; i < fimDepois; i++) {
      semelhantes.push(produtosOrdenados[i]);
    }
    
    // Define os produtos semelhantes no estado, limitando a 6 itens
    setProdutosSemelhantes(semelhantes.slice(0, 6));
  };

  // Função para adicionar produto ao carrinho, validando seleção do tamanho
  const handleAddToCart = () => {
    if (!tamanhoSelecionado) {
      alert("Por favor, selecione um tamanho");
      return;
    }
    
    onAddToCart(parseInt(id), parseInt(tamanhoSelecionado));
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
              {/* Botões para seleção de tamanho */}
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

      {/* Renderiza produtos semelhantes se houver */}
      {produtosSemelhantes.length > 0 && (
        <div className="pd-produtos-semelhantes">
          <h2>Produtos com preço semelhante:</h2>
          <div className="pd-grid-semelhantes">
            {/* Lista de produtos semelhantes, clicáveis para navegar para seu detalhe */}
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
