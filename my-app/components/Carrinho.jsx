import React, { useEffect, useState } from 'react';
import TenisCarrinho from './TenisCarrinho';
import ValoresCarrinho from './ValoresCarrinho';
import "./Carrinho.css";

const Carrinho = ({ carrinho, onRemover, onAumentar, onDiminuir }) => {
  const [detalhesCarrinho, setDetalhesCarrinho] = useState([]);

  useEffect(() => {
    async function buscarDetalhes() {
      const response = await fetch('/bd.json');
      const produtos = await response.json();

      const listaDetalhada = Object.entries(carrinho)
        .map(([chave, item]) => {
          const produto = produtos.find(p => p.id === item.id);
          if (!produto) return null; // Ignora itens inválidos
          return {
            ...item,
            nome: produto.nome,
            imagem: produto.imagem,
            preco: produto.preco
          };
        })
        .filter(item => item !== null); // Remove nulos

      setDetalhesCarrinho(listaDetalhada);
    }

    if (Object.keys(carrinho).length > 0) {
      buscarDetalhes();
    } else {
      setDetalhesCarrinho([]);
    }
  }, [carrinho]);

  return (
    <div className="container">
      <div id="conteudo">
        <div className="identificador">
          <h2>Seu carrinho</h2>
        </div>
  
        {detalhesCarrinho.length === 0 ? (
          <div id="Vazio">
            <p>Vazio</p>
          </div>
        ) : (
            <div className="elementos">
              <div className="produtos">
                <TenisCarrinho
                  itens={detalhesCarrinho}
                  onRemover={onRemover}
                  onAumentar={onAumentar}
                  onDiminuir={onDiminuir}
                />
              </div>
              <ValoresCarrinho carrinho={detalhesCarrinho} />
            </div>
        )}
      </div>
    </div>
  ); 
};

export default Carrinho;
