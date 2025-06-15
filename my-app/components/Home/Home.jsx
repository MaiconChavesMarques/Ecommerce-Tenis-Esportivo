import React, { useEffect, useState, useMemo } from "react";
import TenisItem from "./TenisItem";
import BarraPesquisa from "../Layout/BarraPesquisa";
import "./Home.css";

const Home = ({ onAddToCart }) => {
  const [produtos, setProdutos] = useState([]); // Lista de produtos da página atual
  const [termoBusca, setTermoBusca] = useState(''); // Termo de busca digitado pelo usuário
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual para paginação
  const [paginacao, setPaginacao] = useState({
    totalPaginas: 1,
    totalItens: 0,
    temProximaPagina: false,
    temPaginaAnterior: false
  }); // Informações de paginação
  const [carregando, setCarregando] = useState(false); // Estado de carregamento

  // Função para buscar produtos do servidor
  async function buscarProdutos() {
    setCarregando(true);
    try {
      // Constrói URL com parâmetros de query
      const params = new URLSearchParams({
        pagina: paginaAtual.toString(),
        limite: '15' // 15 itens por página conforme original
      });

      // Adiciona termo de busca se existir
      if (termoBusca.trim()) {
        params.append('busca', termoBusca.trim());
      }

      const response = await fetch(`http://localhost:3000/products/home?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const data = await response.json();
      
      setProdutos(data.produtos || []);
      setPaginacao(data.paginacao || {
        totalPaginas: 1,
        totalItens: 0,
        temProximaPagina: false,
        temPaginaAnterior: false
      });

    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProdutos([]);
      setPaginacao({
        totalPaginas: 1,
        totalItens: 0,
        temProximaPagina: false,
        temPaginaAnterior: false
      });
    } finally {
      setCarregando(false);
    }
  }

  // Efeito para buscar dados quando página ou termo de busca mudam
  useEffect(() => {
    const timer = setTimeout(() => {
      buscarProdutos();
    }, termoBusca ? 500 : 0); // Debounce para busca

    return () => clearTimeout(timer);
  }, [paginaAtual, termoBusca]);

  // Reseta a página atual para 1 sempre que o termo de busca muda
  useEffect(() => {
    if (termoBusca !== '') {
      setPaginaAtual(1);
    }
  }, [termoBusca]);

  // Função chamada ao executar busca no componente BarraPesquisa
  function handleBuscar(termo) {
    setTermoBusca(termo); // Atualiza termo de busca no estado
  }

  // Função para ir para página anterior na paginação
  const irParaPaginaAnterior = () => {
    if (paginacao.temPaginaAnterior) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  // Função para ir para página seguinte na paginação
  const irParaProximaPagina = () => {
    if (paginacao.temProximaPagina) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  return (
    <div className="container">
      <div id="conteudo">
        <div className="header-busca">
          <h1>Procure seu modelo</h1>
          {/* Componente barra de pesquisa com placeholder e callback onBuscar */}
          <BarraPesquisa 
            placeholder="Buscar tênis..."
            onBuscar={handleBuscar}
          />
        </div>

        {/* Indicador de carregamento */}
        {carregando && (
          <div className="carregando">
            <p>Carregando...</p>
          </div>
        )}

        {/* Grid de produtos */}
        {!carregando && (
          <div className="grid">
            {/* Mapeia e renderiza os produtos com componente TenisItem */}
            {produtos.map((item) => (
              <TenisItem
                key={item.id_interno} // Usando id_interno como chave única
                id={item.id_interno}
                imagem={item.imagem}
                nome={item.nome}
                preco={item.preco}
                tamanhos={item.tamanhos}
                quantidade={item.quantidade}
                onAddToCart={onAddToCart} // Função para adicionar ao carrinho
              />
            ))}
          </div>
        )}

        {/* Mostrar mensagem quando não há resultados e termo de busca está preenchido */}
        {!carregando && produtos.length === 0 && termoBusca && (
          <div className="sem-resultados">
            <p>Nenhum tênis encontrado para "{termoBusca}"</p>
          </div>
        )}

        {/* Mensagem exibida caso não haja dados */}
        {!carregando && produtos.length === 0 && !termoBusca && (
          <div className="sem-resultados">
            <p>Nenhum produto disponível</p>
          </div>
        )}

        {/* Controles de paginação */}
        {!carregando && paginacao.totalPaginas > 1 && (
          <div className="paginacao">
            <button 
              onClick={irParaPaginaAnterior} 
              disabled={!paginacao.temPaginaAnterior}
            >
              Página Anterior
            </button>
            <span>
              Página {paginaAtual} de {paginacao.totalPaginas} 
              ({paginacao.totalItens} produto{paginacao.totalItens !== 1 ? 's' : ''} encontrado{paginacao.totalItens !== 1 ? 's' : ''})
            </span>
            <button 
              onClick={irParaProximaPagina} 
              disabled={!paginacao.temProximaPagina}
            >
              Próxima Página
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;