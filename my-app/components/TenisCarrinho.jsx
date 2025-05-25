import React from 'react';
import './TenisCarrinho.css';

function TenisCarrinho({ itens, onRemover, onAumentar, onDiminuir, carregandoOperacao }) {
  return (
    <div>
      {itens.map((item, index) => (
        <div key={`${item.id}_${item.tamanho}`} className="tenis">
          <img className="imgTenis" src={item.imagem} width="200px" alt={item.nome} />
          <div className="descricao">
            <div className="infoBotoes">
              <p className="destaque">{item.nome}</p>
              <div className="botoes">
                <button 
                  onClick={() => onDiminuir(item.id, item.tamanho)}
                  disabled={carregandoOperacao}
                  style={{
                    opacity: carregandoOperacao ? 0.6 : 1,
                    cursor: carregandoOperacao ? 'not-allowed' : 'pointer'
                  }}
                >
                  <img src="imagens/sinal-de-menos4.png" width="20px" alt="Diminuir" />
                </button>
                <p style={{ 
                  opacity: carregandoOperacao ? 0.6 : 1,
                  transition: 'opacity 0.2s'
                }}>
                  {item.quantidade}
                </p>
                <button 
                  onClick={() => onAumentar(item.id, item.tamanho)}
                  disabled={carregandoOperacao}
                  style={{
                    opacity: carregandoOperacao ? 0.6 : 1,
                    cursor: carregandoOperacao ? 'not-allowed' : 'pointer'
                  }}
                >
                  <img src="imagens/sinal-de-adicao (1).png" width="20px" alt="Aumentar" />
                </button>
                <button 
                  onClick={() => onRemover(item.id, item.tamanho)}
                  disabled={carregandoOperacao}
                  style={{
                    opacity: carregandoOperacao ? 0.6 : 1,
                    cursor: carregandoOperacao ? 'not-allowed' : 'pointer'
                  }}
                >
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