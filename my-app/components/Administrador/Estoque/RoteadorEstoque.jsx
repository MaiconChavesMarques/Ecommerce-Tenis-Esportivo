import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from '../../Layout/NavBar';
import Footer from '../../Layout/Footer';
import DashEstoque from './DashEstoque';
import EditarProduto from './EditarProduto';

function RoteadorEstoque({ token, onLogout }) {
  // Estados compartilhados entre DashEstoque e EditarProduto
  const [dadosEdicao, setDadosEdicao] = useState(null);
  const [produtos, setProdutos] = useState(null);

  // Função para iniciar edição/adição
  const handleIniciarEdicao = (produto, acao) => {
    if (acao === 'adicionar') {
      setDadosEdicao({
        nome: '',
        imagem: '',
        descricao: '',
        preco: '',
        quantidade: [0, 0, 0, 0, 0, 0, 0],
        _acao: acao
      });
    } else {
      setDadosEdicao({
        ...produto,
        _acao: acao
      });
    }
  };

  // Função para limpar dados de edição
  const handleLimparEdicao = () => {
    setDadosEdicao(null);
  };

  // Função para atualizar lista de produtos
  const handleAtualizarProdutos = (novosProdutos) => {
    setProdutos(novosProdutos);
  };

  // Função para adicionar novo produto
  const handleAdicionarProduto = (novoProduto) => {
    setProdutos(prev => [...prev, novoProduto]);
  };

  // Função para atualizar produto existente
  const handleAtualizarProduto = (produtoAtualizado) => {
    setProdutos(prev => 
      prev.map(p => 
        p.id === produtoAtualizado.id ? produtoAtualizado : p
      )
    );
  };

  // Função para remover produto
  const handleRemoverProduto = (idProduto) => {
    setProdutos(prev => prev.filter(p => p.id !== idProduto));
  };

  return (
    <>
      <NavBar 
        onLogout={onLogout} 
        token={token} 
        paginaAtual="estoque"
      />
      <Routes>
        {/* Rota para /admin/estoque */}
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
        
        {/* Rota para /admin/estoque/editar-produto */}
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
      <Footer />
    </>
  );
}

export default RoteadorEstoque;