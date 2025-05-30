import React from 'react';
import './TenisCarrinho.css';

function TenisCarrinho({ itens, onRemover, onAumentar, onDiminuir, carregandoOperacao }) {
  return (
    <div>
      {itens.map((item, index) => {
        // Verifica se a quantidade no carrinho é maior que o estoque disponível
        const estoqueInsuficiente = item.quantidade > item.quantidadeEstoque;
        
        return (
          <div 
            // Usa combinação de id e tamanho como chave única para cada item
            key={`${item.id}_${item.tamanho}`} 
            // Aplica classe para estilizar quando o estoque é insuficiente
            className={`tenis ${estoqueInsuficiente ? 'estoque-insuficiente' : ''}`}
          >
            {/* Imagem do tênis */}
            <img className="imgTenis" src={item.imagem} width="200px" alt={item.nome} />
            
            <div className="descricao">
              <div className="infoBotoes">
                <div>
                  {/* Nome do produto, muda cor se indisponível */}
                  <p className={`destaque nome-produto ${estoqueInsuficiente ? 'indisponivel' : ''}`}>
                    {item.nome}
                  </p>
                  {/* Exibe aviso se estoque insuficiente */}
                  {estoqueInsuficiente && (
                    <p className="aviso-estoque">
                      ⚠️ Quantidade indisponível - diminua para continuar
                    </p>
                  )}
                </div>
                
                <div className="botoes">
                  {/* Botão para diminuir a quantidade, desabilitado durante operação */}
                  <button 
                    onClick={() => onDiminuir(item.id, item.tamanho)}
                    disabled={carregandoOperacao}
                  >
                    <img src="imagens/sinal-de-menos4.png" width="20px" alt="Diminuir" />
                  </button>
                  
                  {/* Exibe a quantidade atual com estilo de loading e indisponibilidade */}
                  <p className={`${carregandoOperacao ? 'quantidade-loading' : ''} quantidade ${estoqueInsuficiente ? 'indisponivel' : ''}`}>
                    {item.quantidade}
                  </p>
                  
                  {/* Botão para aumentar a quantidade, desabilitado se operação em andamento ou estoque insuficiente */}
                  <button 
                    onClick={() => onAumentar(item.id, item.tamanho)}
                    disabled={carregandoOperacao || estoqueInsuficiente}
                  >
                    <img src="imagens/sinal-de-adicao (1).png" width="20px" alt="Aumentar" />
                  </button>
                  
                  {/* Botão para remover o item do carrinho, desabilitado durante operação */}
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
                  {/* Exibe o tamanho selecionado */}
                  <p>Tamanho: {item.tamanho}</p>
                  
                  {/* Exibe a quantidade disponível no estoque com cores diferentes dependendo do nível */}
                  <p className="estoque" style={{
                    fontSize: '12px',
                    color: item.quantidadeEstoque === 0 ? '#DC2626' /* vermelho para sem estoque */
                           : item.quantidadeEstoque < 5 ? '#F59E0B' /* amarelo para estoque baixo */
                           : '#6B7280', /* cinza para estoque normal */
                    margin: '2px 0 0 0'
                  }}>
                    {/* Mensagem dinâmica conforme o estoque */}
                    {item.quantidadeEstoque === 0 
                      ? 'Sem estoque' 
                      : `${item.quantidadeEstoque} disponível${item.quantidadeEstoque > 1 ? 'is' : ''}`
                    }
                  </p>
                </div>
                
                {/* Exibe o preço formatado, muda estilo se indisponível */}
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
