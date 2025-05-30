import React, { useEffect, useState, useMemo } from "react";
import TenisItem from "./TenisItem";
import BarraPesquisa from "../Layout/BarraPesquisa";
import "./Home.css";

const Home = ({ onAddToCart }) => {
  const [todosTenis, setTodosTenis] = useState([]); // Todos os tênis carregados
  const [termoBusca, setTermoBusca] = useState(''); // Termo de busca
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 15;

  // Carregar todos os tênis uma única vez
  useEffect(() => {
    async function carregarTenis() {
      try {
        const response = await fetch('/bd.json');
        const data = await response.json();
        setTodosTenis(data || []);
      } catch (error) {
        console.error('Erro ao carregar tênis:', error);
        setTodosTenis([]);
      }
    }
    carregarTenis();
  }, []);

  // Filtrar tênis baseado no termo de busca usando useMemo para otimização
  const tenisFiltrados = useMemo(() => {
    if (!todosTenis || todosTenis.length === 0) return [];
    
    if (!termoBusca) return todosTenis;
    
    return todosTenis.filter(tenis => {
      const nomeMatch = tenis.nome?.toLowerCase().includes(termoBusca.toLowerCase());
      const precoMatch = tenis.preco?.toString().includes(termoBusca);
      return nomeMatch || precoMatch;
    });
  }, [todosTenis, termoBusca]);

  // Aplicar paginação aos dados filtrados
  const tenisPaginados = useMemo(() => {
    // Calcular total de páginas com base nos dados filtrados
    const paginas = Math.ceil(tenisFiltrados.length / itensPorPagina);
    setTotalPaginas(paginas);

    // Obter somente os itens da página atual
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return tenisFiltrados.slice(inicio, fim);
  }, [tenisFiltrados, paginaAtual, itensPorPagina]);

  // Reset da página quando o termo de busca muda
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Função para lidar com a busca
  function handleBuscar(termo) {
    setTermoBusca(termo);
  }

  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <div className="container">
      <div id="conteudo">
        <div className="header-busca">
          <h1>Procure seu modelo</h1>
          <BarraPesquisa 
            placeholder="Buscar tênis..."
            onBuscar={handleBuscar}
          />
        </div>
        <div className="grid">
          {tenisPaginados.map((item) => (
            <TenisItem
              key={item.id}
              id={item.id}
              imagem={item.imagem}
              nome={item.nome}
              preco={item.preco}
              tamanhos={item.tamanhos}
              quantidade={item.quantidade}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Mostrar mensagem quando não há resultados */}
        {tenisPaginados.length === 0 && termoBusca && (
          <div className="sem-resultados">
            <p>Nenhum tênis encontrado para "{termoBusca}"</p>
          </div>
        )}

        <div className="paginacao">
          <button onClick={irParaPaginaAnterior} disabled={paginaAtual === 1}>
            Página Anterior
          </button>
          <span>Página {paginaAtual} de {totalPaginas}</span>
          <button onClick={irParaProximaPagina} disabled={paginaAtual === totalPaginas}>
            Próxima Página
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;