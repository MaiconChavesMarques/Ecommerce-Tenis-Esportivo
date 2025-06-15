import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from '../../Layout/NavBar';
import Footer from '../../Layout/Footer';
import DashEstoque from './DashEstoque';
import EditarProduto from './EditarProduto';

function RoteadorEstoque({ token, onLogout }) {
  // Estado para armazenar os dados do produto em edição ou adição
  const [dadosEdicao, setDadosEdicao] = useState(null);

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
      // Se for editar, carrega TODOS os dados do produto selecionado incluindo id_interno
      setDadosEdicao({
        ...produto, // Isso já inclui id_interno, id, e todos os outros campos
        _acao: acao
      });
    }
  };

  // Função para limpar o estado de edição
  const handleLimparEdicao = () => {
    setDadosEdicao(null);
  };

  // Callback para quando um produto é adicionado com sucesso
  const handleAdicionarProduto = (novoProduto) => {
    console.log('Produto adicionado:', novoProduto);
    // Aqui você pode adicionar lógica adicional se necessário
    // Por exemplo, atualizar um estado global ou cache
  };

  // Callback para quando um produto é atualizado com sucesso
  const handleAtualizarProduto = (produtoAtualizado) => {
    console.log('Produto atualizado:', produtoAtualizado);
    // Aqui você pode adicionar lógica adicional se necessário
    // Por exemplo, atualizar um estado global ou cache
  };

  // Callback para quando um produto é removido
  const handleRemoverProduto = (idProduto) => {
    console.log('Produto removido:', idProduto);
    // Aqui você pode adicionar lógica adicional se necessário
    // Por exemplo, atualizar um estado global ou cache
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
              onIniciarEdicao={handleIniciarEdicao}
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