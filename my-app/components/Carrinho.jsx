import React, { useEffect, useState } from 'react';
import TenisCarrinho from './TenisCarrinho';
import ValoresCarrinho from './ValoresCarrinho';
import "./Carrinho.css";

const Carrinho = ({ carrinho, onRemover, onAumentar, onDiminuir }) => {
  // Estado inicia como null para indicar que está carregando
  const [detalhesCarrinho, setDetalhesCarrinho] = useState(null);
  const [carregandoOperacao, setCarregandoOperacao] = useState(false);

  useEffect(() => {
    async function buscarDetalhes() {
      try {
        const response = await fetch('bd.json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar dados');
        }

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
          .filter(item => item !== null);

        setDetalhesCarrinho(listaDetalhada);
      } catch (error) {
        console.error('Erro no fetch:', error);
        setDetalhesCarrinho([]); // seta vazio para não ficar carregando eternamente
      }
    }

    buscarDetalhes();
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
            <div style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginTop: '5px' 
            }}>
              Sincronizando...
            </div>
          )}
        </div>

        {detalhesCarrinho === null ? (
          <div id="Carregando">
            <p>Carregando...</p>
          </div>
        ) : detalhesCarrinho.length === 0 ? (
          <div id="Vazio">
            <p>Vazio</p>
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
            <ValoresCarrinho carrinho={detalhesCarrinho} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrinho;