import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './TenisItem.css'

function TenisItem({ id, imagem, nome, preco, tamanhos, quantidade, onAddToCart }) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null); // Estado para armazenar tamanho selecionado pelo usuário
  const navigate = useNavigate(); // Hook para navegação entre páginas

  // Função chamada ao clicar para adicionar produto ao carrinho
  function handleAddToCart() {
    if (tamanhoSelecionado !== null) {
      onAddToCart(id, tamanhoSelecionado); // Chama callback passando id e tamanho selecionado
      // opcional: limpar seleção após adicionar
      setTamanhoSelecionado(null); // Reseta seleção de tamanho após adicionar
    } else {
      alert("Selecione um tamanho antes de adicionar ao carrinho."); // Alerta se tentar adicionar sem selecionar tamanho
    }
  }

  // Função para navegar para página de detalhes do produto
  function handleNavigateToProduct() {
    navigate(`/produto/${id}`); // Navega para rota do produto usando id
  }

  return (
    <div className="itens">
      {/* Imagem do tênis, clicável para navegar ao produto */}
      <img 
        src={imagem} 
        width="100%" 
        alt={nome} 
        onClick={handleNavigateToProduct}
        style={{ cursor: "pointer" }} // Cursor muda para indicar clicável
      />
      <div className="descricao">
        {/* Nome do tênis, também clicável para navegar ao produto */}
        <p 
          onClick={handleNavigateToProduct}
          style={{ cursor: "pointer" }}
        >
          {nome}
        </p>
        {/* Preço formatado com duas casas decimais */}
        <p>R$ {preco.toFixed(2)}</p>
        <p className="tamanhosDisponiveis">Tamanhos disponíveis:</p>
        <div className="itensBotoes">
          {/* Mapeia tamanhos disponíveis para exibir botões radio */}
          {tamanhos.map((tam, index) => {
            const indisponivel = quantidade[index] === 0; // Marca tamanho como indisponível se quantidade for zero
            const isSelected = tamanhoSelecionado === tam; // Verifica se este tamanho está selecionado
            
            return (
              <label
                key={tam} // Chave única para cada tamanho
                className={`tamanhoTenis ${indisponivel ? "indisponivel" : ""} ${isSelected && !indisponivel ? "selecionado" : ""}`}
                onClick={() => !indisponivel && setTamanhoSelecionado(tam)} // Atualiza seleção se disponível
              >
                <input
                  type="radio"
                  name={`tamanho_${id}`} // Agrupa inputs por produto
                  value={tam}
                  disabled={indisponivel} // Desabilita input se indisponível
                  checked={isSelected} // Marca input se selecionado
                  onChange={() => setTamanhoSelecionado(tam)} // Atualiza estado no onChange
                />
                {tam}
              </label>
            );
          })}
        </div>
      </div>
      <div className="botaoCarrinho">
        {/* Botão para adicionar ao carrinho */}
        <button onClick={handleAddToCart}>
          <img src="imagens/carrinho-de-compras11.png" width="20px" alt="Carrinho" />
          <p>Adicionar ao carrinho</p>
        </button>
      </div>
    </div>
  );
}

export default TenisItem;
