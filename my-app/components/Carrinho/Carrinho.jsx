import React, { useEffect, useState } from 'react';
import TenisCarrinho from './TenisCarrinho';
import ValoresCarrinho from './ValoresCarrinho';
import "./Carrinho.css";

const Carrinho = ({ carrinho, onRemover, onAumentar, onDiminuir }) => {
  // Estado inicia como null para indicar que está carregando
  const [detalhesCarrinho, setDetalhesCarrinho] = useState(null);
  // Estado para controlar se uma operação de alteração está em andamento
  const [carregandoOperacao, setCarregandoOperacao] = useState(false);
  // Estado que indica se a compra é possível (estoque suficiente)
  const [possivelComprar, setPossivelComprar] = useState(true);

  useEffect(() => {
    console.log("impresso");
    // Função assíncrona para buscar detalhes dos produtos do carrinho
    async function buscarDetalhes() {
      try {
        // Requisição GET para buscar dados dos produtos
        const response = await fetch('https://button-discreet-talk.glitch.me/api/bd', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          // Caso a resposta não seja OK, lança erro para ser tratado
          throw new Error('Erro ao buscar dados');
        }

        const produtos = await response.json();
        // Transformar o objeto do carrinho em lista detalhada com dados do produto
        const listaDetalhada = Object.entries(carrinho)
          .map(([chave, item]) => {
            // Busca o produto correspondente no array retornado da API
            const produto = produtos.find(p => p.id === item.id);
            if (!produto) return null; // Ignora itens inválidos que não existem na base
            // Retorna objeto com dados mesclados do item do carrinho e detalhes do produto
            return {
              ...item,
              nome: produto.nome,
              imagem: produto.imagem,
              preco: produto.preco,
              quantidadeEstoque: produto.quantidade[item.tamanho-38] // Ajuste pelo tamanho
            };
          })
          .filter(item => item !== null); // Remove itens inválidos da lista final

        // Verificar se é possível comprar: se todos os itens tem estoque suficiente
        const podeComprar = listaDetalhada.every(item => 
          item.quantidade <= item.quantidadeEstoque && item.quantidadeEstoque > 0
        );

        // Atualiza o estado com a lista detalhada e a possibilidade de compra
        setDetalhesCarrinho(listaDetalhada);
        setPossivelComprar(podeComprar);
      } catch (error) {
        // Em caso de erro no fetch, loga e seta carrinho vazio para evitar loading infinito
        console.error('Erro no fetch:', error);
        setDetalhesCarrinho([]); // seta vazio para não ficar carregando eternamente
        setPossivelComprar(false);
      }
    }

    // Só busca os detalhes se ainda não tiver detalhes carregados (null)
    if(detalhesCarrinho === null){
      console.log("carrinho era nulo");
      buscarDetalhes();
    }
  }, [carrinho]); // Reexecuta quando o carrinho muda

  // Funções wrapper que incluem feedback visual de loading para remoção
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

  // Função wrapper para aumentar quantidade, com loading visual
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

  // Função wrapper para diminuir quantidade, com loading visual
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

  // JSX retornado para renderizar o componente
  return (
    <div className="container">
      <div id="conteudo">
        <div className="identificador">
          <h2>Seu carrinho</h2>
          {/* Mostra mensagem de sincronização enquanto operação está em andamento */}
          {carregandoOperacao && (
            <div className="status-sincronizacao">
              Sincronizando...
            </div>
          )}
          {/* Exibe aviso se algum item não está disponível na quantidade desejada */}
          {!possivelComprar && detalhesCarrinho && detalhesCarrinho.length > 0 && (
            <div className="aviso-indisponibilidade">
              ⚠️ Alguns itens não estão disponíveis na quantidade desejada
            </div>
          )}
        </div>

        {/* Exibe tela de carregando enquanto detalhes são null */}
        {detalhesCarrinho === null ? (
          <div id="Carregando">
            <div className="loading-spinner"></div>
            <p>Carregando...</p>
          </div>
        ) : 
          // Caso carrinho esteja vazio, exibe mensagem correspondente
          detalhesCarrinho.length === 0 ? (
          <div id="Vazio">
            <p>Seu carrinho está vazio</p>
          </div>
        ) : (
          // Caso tenha itens, exibe lista de produtos e resumo de valores
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
