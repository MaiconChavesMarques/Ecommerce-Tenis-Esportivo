import React, { useEffect, useState } from 'react';
import TenisCarrinho from './TenisCarrinho';
import ValoresCarrinho from './ValoresCarrinho';
import "./Carrinho.css";

const Carrinho = ({ carrinho, onRemover, onAumentar, onDiminuir }) => {
  // Estado inicia como null para indicar que está carregando
  const [detalhesCarrinho, setDetalhesCarrinho] = useState(null);
  const [carregandoOperacao, setCarregandoOperacao] = useState(false);
  const [possivelComprar, setPossivelComprar] = useState(true);

  useEffect(() => {
    console.log("impresso");
    //console.log(carrinho);
    async function buscarDetalhes() {
      try {
        const response = await fetch('https://button-discreet-talk.glitch.me/api/bd', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar dados');
        }

        const produtos = await response.json();
        //console.log(carrinho);

        const listaDetalhada = Object.entries(carrinho)
          .map(([chave, item]) => {
            //console.log(item.id);
            const produto = produtos.find(p => p.id === item.id);
            if (!produto) return null; // Ignora itens inválidos
            //console.log(item);
            return {
              ...item,
              nome: produto.nome,
              imagem: produto.imagem,
              preco: produto.preco,
              quantidadeEstoque: produto.quantidade[item.tamanho-38]
            };
          })
          .filter(item => item !== null);

          //console.log(listaDetalhada);

        // Verificar se é possível comprar (se algum item tem quantidade maior que estoque)
        const podeComprar = listaDetalhada.every(item => 
          item.quantidade <= item.quantidadeEstoque && item.quantidadeEstoque > 0
        );

        setDetalhesCarrinho(listaDetalhada);
        setPossivelComprar(podeComprar);
      } catch (error) {
        console.error('Erro no fetch:', error);
        setDetalhesCarrinho([]); // seta vazio para não ficar carregando eternamente
        setPossivelComprar(false);
      }
    }

    if(detalhesCarrinho === null){
      console.log("carrinho era nulo");
      buscarDetalhes();
    }
  }, [carrinho]);

  // Funções wrapper que incluem feedback visual de loading
  const handleRemover = async (id, tamanho) => {
    setCarregandoOperacao(true);
    try {
      await onRemover(id, tamanho);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      // Aqui você poderia mostrar uma notificação de erro
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleAumentar = async (id, tamanho) => {
    setCarregandoOperacao(true);
    try {
      await onAumentar(id, tamanho);
    } catch (error) {
      console.error('Erro ao aumentar quantidade:', error);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleDiminuir = async (id, tamanho) => {
    setCarregandoOperacao(true);
    try {
      await onDiminuir(id, tamanho);
    } catch (error) {
      console.error('Erro ao diminuir quantidade:', error);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  return (
    <div className="container">
      <div id="conteudo">
        <div className="identificador">
          <h2>Seu carrinho</h2>
          {carregandoOperacao && (
            <div className="status-sincronizacao">
              Sincronizando...
            </div>
          )}
          {!possivelComprar && detalhesCarrinho && detalhesCarrinho.length > 0 && (
            <div className="aviso-indisponibilidade">
              ⚠️ Alguns itens não estão disponíveis na quantidade desejada
            </div>
          )}
        </div>

        {detalhesCarrinho === null ? (
          <div id="Carregando">
            <div className="loading-spinner"></div>
            <p>Carregando...</p>
          </div>
        ) : detalhesCarrinho.length === 0 ? (
          <div id="Vazio">
            <p>Seu carrinho está vazio</p>
          </div>
        ) : (
          <div className="elementos">
            <div className="produtos">
              <TenisCarrinho
                itens={detalhesCarrinho}
                onRemover={handleRemover}
                onAumentar={handleAumentar}
                onDiminuir={handleDiminuir}
                carregandoOperacao={carregandoOperacao}
              />
            </div>
            <ValoresCarrinho 
              carrinho={detalhesCarrinho} 
              possivelComprar={possivelComprar}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrinho;