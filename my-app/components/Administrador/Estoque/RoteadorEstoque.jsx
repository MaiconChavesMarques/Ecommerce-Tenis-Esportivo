import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from '../../Layout/NavBar';
import Footer from '../../Layout/Footer';
import DashEstoque from './DashEstoque';
import EditarProduto from './EditarProduto';

function RoteadorEstoque({ token, onLogout }) {
  // Estado para armazenar os dados do produto em edição ou adição
  const [dadosEdicao, setDadosEdicao] = useState(null);
  
  // Estado para armazenar a lista de produtos
  const [produtos, setProdutos] = useState(null);

  // Função para iniciar edição ou adição de um produto
  const handleIniciarEdicao = (produto, acao) => {
    if (acao === 'adicionar') {
      // Se a ação for adicionar, cria um objeto vazio com a ação
      setDadosEdicao({
        nome: '',
        imagem: '',
        descricao: '',
        preco: '',
        quantidade: [0, 0, 0, 0, 0, 0, 0],
        _acao: acao
      });
    } else {
      // Se for editar, carrega os dados do produto selecionado e adiciona a ação
      setDadosEdicao({
        ...produto,
        _acao: acao
      });
    }
  };

  // Função para limpar o estado de edição
  const handleLimparEdicao = () => {
    setDadosEdicao(null);
  };

  // Função para atualizar a lista completa de produtos
  const handleAtualizarProdutos = (novosProdutos) => {
    setProdutos(novosProdutos);
  };

  // Função para adicionar um novo produto à lista
  const handleAdicionarProduto = (novoProduto) => {
    setProdutos(prev => [...prev, novoProduto]);
  };

  // Função para atualizar os dados de um produto na lista
  const handleAtualizarProduto = (produtoAtualizado) => {
    setProdutos(prev => 
      prev.map(p => 
        p.id === produtoAtualizado.id ? produtoAtualizado : p
      )
    );
  };

  // Função para remover um produto da lista pelo ID
  const handleRemoverProduto = (idProduto) => {
    setProdutos(prev => prev.filter(p => p.id !== idProduto));
  };

  return (
    <>
      {/* Barra de navegação fixa */}
      <NavBar 
        onLogout={onLogout} 
        token={token} 
        paginaAtual="estoque"
      />
      <Routes>
        {/* Rota principal do estoque */}
        <Route 
          path="/" 
          element={
            <DashEstoque 
              produtos={produtos}
              onIniciarEdicao={handleIniciarEdicao}
              onAtualizarProdutos={handleAtualizarProdutos}
              onAdicionarProduto={handleAdicionarProduto}
              onAtualizarProduto={handleAtualizarProduto}
              onRemoverProduto={handleRemoverProduto}
            />
          }
        />
        
        {/* Rota para edição ou adição de produto */}
        <Route 
          path="/editar-produto" 
          element={
            <EditarProduto 
              dadosProduto={dadosEdicao}
              onLimparEdicao={handleLimparEdicao}
              onAdicionarProduto={handleAdicionarProduto}
              onAtualizarProduto={handleAtualizarProduto}
            />
          }
        />
      </Routes>
      {/* Rodapé fixo */}
      <Footer />
    </>
  );
}

export default RoteadorEstoque;
