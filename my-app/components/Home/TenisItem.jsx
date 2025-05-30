import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './TenisItem.css'

function TenisItem({ id, imagem, nome, preco, tamanhos, quantidade, onAddToCart }) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const navigate = useNavigate();

  function handleAddToCart() {
    if (tamanhoSelecionado !== null) {
      onAddToCart(id, tamanhoSelecionado);
      // opcional: limpar seleção após adicionar
      setTamanhoSelecionado(null);
    } else {
      alert("Selecione um tamanho antes de adicionar ao carrinho.");
    }
  }

  function handleNavigateToProduct() {
    navigate(`/produto/${id}`);
  }

  return (
    <div className="itens">
      <img 
        src={imagem} 
        width="100%" 
        alt={nome} 
        onClick={handleNavigateToProduct}
        style={{ cursor: "pointer" }}
      />
      <div className="descricao">
        <p 
          onClick={handleNavigateToProduct}
          style={{ cursor: "pointer" }}
        >
          {nome}
        </p>
        <p>R$ {preco.toFixed(2)}</p>
        <p className="tamanhosDisponiveis">Tamanhos disponíveis:</p>
        <div className="itensBotoes">
          {tamanhos.map((tam, index) => {
            const indisponivel = quantidade[index] === 0;
            const isSelected = tamanhoSelecionado === tam;
            
            return (
              <label
                key={tam}
                className={`tamanhoTenis ${indisponivel ? "indisponivel" : ""} ${isSelected && !indisponivel ? "selecionado" : ""}`}
                onClick={() => !indisponivel && setTamanhoSelecionado(tam)}
              >
                <input
                  type="radio"
                  name={`tamanho_${id}`}
                  value={tam}
                  disabled={indisponivel}
                  checked={isSelected}
                  onChange={() => setTamanhoSelecionado(tam)}
                />
                {tam}
              </label>
            );
          })}
        </div>
      </div>
      <div className="botaoCarrinho">
        <button onClick={handleAddToCart}>
          <img src="imagens/carrinho-de-compras11.png" width="20px" alt="Carrinho" />
          <p>Adicionar ao carrinho</p>
        </button>
      </div>
    </div>
  );
}

export default TenisItem;