import React from 'react';
import './TenisCarrinho.css'; // se quiser mover os estilos pra cá

function TenisCarrinho({ itens, onRemover, onAumentar, onDiminuir }) {
  return (
    <div>
      {itens.map((item, index) => (
        <div key={index} className="tenis">
          <img className="imgTenis" src={item.imagem} width="200px" alt={item.nome} />
          <div className="descricao">
            <div className="infoBotoes">
              <p className="destaque">{item.nome}</p>
              <div className="botoes">
                <button onClick={() => onDiminuir(item.id, item.tamanho)}>
                  <img src="imagens/sinal-de-menos4.png" width="20px" alt="Diminuir" />
                </button>
                <p>{item.quantidade}</p>
                <button onClick={() => onAumentar(item.id, item.tamanho)}>
                  <img src="imagens/sinal-de-adicao (1).png" width="20px" alt="Aumentar" />
                </button>
                <button onClick={() => onRemover(item.id, item.tamanho)}>
                  <img src="imagens/excluir8.png" width="20px" alt="Remover" />
                </button>
              </div>
            </div>
            <div className="tamanhoPreco">
              <p>Tamanho: {item.tamanho}</p>
              <p className="destaque">R$ {item.preco.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TenisCarrinho;
