import React, { useState } from "react";
import './TenisItem.css'

function TenisItem({ id, imagem, nome, preco, tamanhos, quantidade, onAddToCart }) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);

  function handleAddToCart() {
    if (tamanhoSelecionado !== null) {
      onAddToCart(id, tamanhoSelecionado);
      // opcional: limpar seleção após adicionar
      setTamanhoSelecionado(null);
    } else {
      alert("Selecione um tamanho antes de adicionar ao carrinho.");
    }
  }

  return (
    <div className="itens">
      <img src={imagem} width="100%" alt={nome} />
      <div className="descricao">
        <p>{nome}</p>
        <p>R$ {preco.toFixed(2)}</p>
        <p className="tamanhosDisponiveis">Tamanhos disponíveis:</p>
        <div className="itensBotoes">
          {tamanhos.map((tam, index) => {
            const indisponivel = quantidade[index] === 0;
            return (
              <label
                key={tam}
                className={`tamanhoTenis ${indisponivel ? "indisponivel" : ""}`}
                style={{ color: indisponivel ? "gray" : "initial", cursor: indisponivel ? "not-allowed" : "pointer" }}
              >
                <input
                  type="radio"
                  name={`tamanho_${id}`}
                  value={tam}
                  disabled={indisponivel}
                  checked={tamanhoSelecionado === tam}
                  onChange={() => setTamanhoSelecionado(tam)}
                  style={{ marginRight: 6 }}
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