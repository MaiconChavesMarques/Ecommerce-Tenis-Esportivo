import React, { useEffect, useState, useMemo } from "react";
import TenisItem from "./TenisItem";
import BarraPesquisa from "../Layout/BarraPesquisa";
import "./Home.css";

const Home = ({ onAddToCart }) => {
  const [todosTenis, setTodosTenis] = useState([]); // Todos os tênis carregados
  const [termoBusca, setTermoBusca] = useState(''); // Termo de busca digitado pelo usuário
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual para paginação
  const [totalPaginas, setTotalPaginas] = useState(1); // Total de páginas calculado
  const itensPorPagina = 15; // Quantidade de itens exibidos por página

  // Carregar todos os tênis uma única vez ao montar o componente
  useEffect(() => {
    async function carregarTenis() {
      try {
        const response = await fetch('/bd.json'); // Buscar dados do arquivo bd.json
        const data = await response.json(); // Converter resposta para JSON
        setTodosTenis(data || []); // Atualizar estado com os tênis carregados, ou array vazio se nulo
      } catch (error) {
        console.error('Erro ao carregar tênis:', error); // Log do erro no console
        setTodosTenis([]); // Caso erro, seta lista vazia para evitar crash
      }
    }
    carregarTenis(); // Executa função para carregar tênis
  }, []); // Dependência vazia para rodar apenas uma vez no mount

  // Filtrar tênis baseado no termo de busca usando useMemo para otimizar performance
  const tenisFiltrados = useMemo(() => {
    if (!todosTenis || todosTenis.length === 0) return []; // Retorna vazio se não tiver tênis carregados
    
    if (!termoBusca) return todosTenis; // Se não tem termo de busca, retorna todos os tênis
    
    return todosTenis.filter(tenis => {
      // Verifica se nome do tênis contém o termo, ignorando maiúsculas/minúsculas
      const nomeMatch = tenis.nome?.toLowerCase().includes(termoBusca.toLowerCase());
      // Verifica se o preço (convertido para string) contém o termo
      const precoMatch = tenis.preco?.toString().includes(termoBusca);
      // Retorna true se nome ou preço bater com o termo
      return nomeMatch || precoMatch;
    });
  }, [todosTenis, termoBusca]); // Atualiza quando lista ou termo de busca mudam

  // Aplicar paginação aos tênis filtrados, calculando quais exibir na página atual
  const tenisPaginados = useMemo(() => {
    // Calcular total de páginas baseado na quantidade de tênis filtrados
    const paginas = Math.ceil(tenisFiltrados.length / itensPorPagina);
    setTotalPaginas(paginas); // Atualiza estado do total de páginas

    // Calcula índice inicial e final para fatia da lista
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    // Retorna somente os tênis da página atual
    return tenisFiltrados.slice(inicio, fim);
  }, [tenisFiltrados, paginaAtual, itensPorPagina]); // Atualiza quando filtros ou página mudam

  // Sempre que o termo de busca mudar, resetar a página atual para 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Função chamada ao executar busca no componente BarraPesquisa
  function handleBuscar(termo) {
    setTermoBusca(termo); // Atualiza termo de busca no estado
  }

  // Função para ir para página anterior na paginação
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  // Função para ir para página seguinte na paginação
  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
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
        <div className="grid">
          {/* Mapeia e renderiza os tênis paginados com componente TenisItem */}
          {tenisPaginados.map((item) => (
            <TenisItem
              key={item.id} // Chave única para React
              id={item.id}
              imagem={item.imagem}
              nome={item.nome}
              preco={item.preco}
              tamanhos={item.tamanhos}
              quantidade={item.quantidade}
              onAddToCart={onAddToCart} // Função para adicionar ao carrinho
            />
          ))}
        </div>

        {/* Mostrar mensagem quando não há resultados e termo de busca está preenchido */}
        {tenisPaginados.length === 0 && termoBusca && (
          <div className="sem-resultados">
            <p>Nenhum tênis encontrado para "{termoBusca}"</p>
          </div>
        )}

        {/* Controles de paginação */}
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
