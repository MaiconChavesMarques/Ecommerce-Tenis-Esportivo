import React, { useEffect, useState } from "react";
import TenisItem from "./TenisItem";
import BarraPesquisa from "./BarraPesquisa";
import BotoesSecundarios from "./BotoesSecundarios";
import "./Home.css";

const Home = ({ onAddToCart }) => {
  const [tenis, setTenis] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 15;

  useEffect(() => {
    async function carregarTenis() {
      const response = await fetch('/bd.json');
      const data = await response.json();

      // Calcular total de páginas com base no total de itens
      const paginas = Math.ceil(data.length / itensPorPagina);
      setTotalPaginas(paginas);

      // Obter somente os itens da página atual
      const inicio = (paginaAtual - 1) * itensPorPagina;
      const fim = inicio + itensPorPagina;
      const pagina = data.slice(inicio, fim);

      setTenis(pagina);
    }
    carregarTenis();
  }, [paginaAtual]);

  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <div className="container">
      <div id="conteudo">
        <BarraPesquisa />
        <BotoesSecundarios />
        <div className="grid">
          {tenis.map((item) => (
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
