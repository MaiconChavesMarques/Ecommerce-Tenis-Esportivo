import React from 'react';
import './TenisCarrinho.css';

function TenisCarrinho({ itens, onRemover, onAumentar, onDiminuir, carregandoOperacao }) {
  return (
    <div>
      {itens.map((item, index) => {
        const estoqueInsuficiente = item.quantidade > item.quantidadeEstoque;
        
        return (
          <div 
            key={`${item.id}_${item.tamanho}`} 
            className={`tenis ${estoqueInsuficiente ? 'estoque-insuficiente' : ''}`}
          >
            <img className="imgTenis" src={item.imagem} width="200px" alt={item.nome} />
            <div className="descricao">
              <div className="infoBotoes">
                <div>
                  <p className={`destaque nome-produto ${estoqueInsuficiente ? 'indisponivel' : ''}`}>
                    {item.nome}
                  </p>
                  {estoqueInsuficiente && (
                    <p className="aviso-estoque">
                      ⚠️ Quantidade indisponível - diminua para continuar
                    </p>
                  )}
                </div>
                <div className="botoes">
                  <button 
                    onClick={() => onDiminuir(item.id, item.tamanho)}
                    disabled={carregandoOperacao}
                  >
                    <img src="imagens/sinal-de-menos4.png" width="20px" alt="Diminuir" />
                  </button>
                  <p className={`${carregandoOperacao ? 'quantidade-loading' : ''} quantidade ${estoqueInsuficiente ? 'indisponivel' : ''}`}>
                    {item.quantidade}
                  </p>
                  <button 
                    onClick={() => onAumentar(item.id, item.tamanho)}
                    disabled={carregandoOperacao || estoqueInsuficiente}
                  >
                    <img src="imagens/sinal-de-adicao (1).png" width="20px" alt="Aumentar" />
                  </button>
                  <button 
                    onClick={() => onRemover(item.id, item.tamanho)}
                    disabled={carregandoOperacao}
                  >
                    <img src="imagens/excluir8.png" width="20px" alt="Remover" />
                  </button>
                </div>
              </div>
              <div className="tamanhoPreco">
                <div className="tamanhoInfo">
                  <p>Tamanho: {item.tamanho}</p>
                  <p className="estoque" style={{
                    fontSize: '12px',
                    color: item.quantidadeEstoque === 0 ? '#DC2626' : item.quantidadeEstoque < 5 ? '#F59E0B' : '#6B7280',
                    margin: '2px 0 0 0'
                  }}>
                    {item.quantidadeEstoque === 0 
                      ? 'Sem estoque' 
                      : `${item.quantidadeEstoque} disponível${item.quantidadeEstoque > 1 ? 'is' : ''}`
                    }
                  </p>
                </div>
                <p className={`destaque preco ${estoqueInsuficiente ? 'indisponivel' : ''}`}>
                  R$ {item.preco.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TenisCarrinho;