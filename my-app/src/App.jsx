import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Home from '../components/Home';
import Carrinho from '../components/Carrinho';
import Login from '../components/Login';
import Registro from '../components/Registro';
import ProdutoDetalhe from '../components/ProdutoDetalhe';
import Administrador from '../components/Administrador';
import DashAdmin from '../components/DashAdmin';
import EditarPessoa from '../components/EditarPessoa';
import DashEstoque from '../components/DashEstoque';
import EditarProduto from '../components/EditarProduto';
import Perfil from '../components/Perfil';

function App() {
  const [carrinho, setCarrinho] = useState({});
  const [token, setToken] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  function handleLoginSuccess(tokenRecebido, tipo) {
    console.log("Login realizado:", { token: tokenRecebido, tipo });
    
    setToken(tokenRecebido);
    setTipoUsuario(tipo);
  }

  function handleLogout() {
    setToken(null);
    setTipoUsuario(null);
  }

  function adicionarAoCarrinho(id, tamanho) {
    console.log(carrinho)
    console.log("Mandei adicionar");
    const chave = `${id}_${tamanho}`;
    setCarrinho(prev => {
      const novaQuantidade = (prev[chave]?.quantidade || 0) + 1;
      return {
        ...prev,
        [chave]: { id, tamanho, quantidade: novaQuantidade }
      };
    });
  }

  function removerDoCarrinho(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    setCarrinho(prev => {
      const novoCarrinho = { ...prev };
      delete novoCarrinho[chave];
      return novoCarrinho;
    });
  }

  function aumentarQuantidade(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    setCarrinho(prev => ({
      ...prev,
      [chave]: {
        ...prev[chave],
        quantidade: prev[chave].quantidade + 1
      }
    }));
  }

  function diminuirQuantidade(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    setCarrinho(prev => {
      const item = prev[chave];
      if (!item) return prev;
      if (item.quantidade <= 1) {
        // Se a quantidade for 1, remove o item
        const novoCarrinho = { ...prev };
        delete novoCarrinho[chave];
        return novoCarrinho;
      } else {
        return {
          ...prev,
          [chave]: {
            ...item,
            quantidade: item.quantidade - 1
          }
        };
      }
    });
  }

  // 🔐 Rota protegida para usuários/clientes (impede administradores)
  function RotaProtegidaUsuario({ children }) {
    // Verifica se não tem token - redireciona para login
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    // Verifica se é administrador - redireciona para área administrativa
    if (tipoUsuario === "administrador") {
      return <Navigate to="/admin" replace />;
    }
    
    return children;
  }

  // 🔐 Rota para usuários não logados ou clientes (impede administradores)
  function RotaPublicaOuUsuario({ children }) {
    // Se é administrador, redireciona para área administrativa
    if (token && tipoUsuario === "administrador") {
      return <Navigate to="/admin" replace />;
    }
    
    // Permite acesso para não logados ou clientes
    return children;
  }

  // 🔐 Rota protegida para administradores
  function RotaProtegidaAdmin({ children }) {
    // Verifica se não tem token - redireciona para login
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    // Verifica se não é administrador - redireciona para home
    if (tipoUsuario !== "administrador") {
      return <Navigate to="/home" replace />;
    }
    
    return children;
  }

  // 🔐 Rota protegida para usuários logados (tanto clientes quanto administradores)
  function RotaProtegidaLogado({ children }) {
    // Verifica se não tem token - redireciona para login
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  }

  return (
    <Router>
      <NavBar 
        onLogout={handleLogout} 
        token={token} 
      />
      <Routes>
        <Route
          path="/home"
          element={
            <RotaPublicaOuUsuario>
              <Home onAddToCart={adicionarAoCarrinho} />
            </RotaPublicaOuUsuario>
          }
        />
        <Route
          path="/produto/:id"
          element={
            <RotaPublicaOuUsuario>
              <ProdutoDetalhe onAddToCart={adicionarAoCarrinho} />
            </RotaPublicaOuUsuario>
          }
        />
        <Route
          path="/carrinho"
          element={
            <RotaProtegidaUsuario>
              <Carrinho
                carrinho={carrinho}
                onRemover={removerDoCarrinho}
                onAumentar={aumentarQuantidade}
                onDiminuir={diminuirQuantidade}
              />
            </RotaProtegidaUsuario>
          }
        />
        <Route
          path="/perfil"
          element={
            <RotaProtegidaLogado>
              <Perfil 
                token={token}
                tipoUsuario={tipoUsuario}
                onLogout={handleLogout}
              />
            </RotaProtegidaLogado>
          }
        />
        <Route 
          path="/login"
          element={
            <Login
             onLoginSuccess={handleLoginSuccess} 
            />
          } 
        />
        <Route 
          path="/registro" 
          element={
            <Registro 
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
          <RotaProtegidaAdmin>
            <Administrador />
          </RotaProtegidaAdmin>
          }
        />
        <Route 
          path="/administradores" 
          element={
          <RotaProtegidaAdmin>
            <DashAdmin tipo="administrador" />
          </RotaProtegidaAdmin>
          }
        />
        <Route 
          path="/clientes" 
          element={
          <RotaProtegidaAdmin>
            <DashAdmin tipo="cliente" />
          </RotaProtegidaAdmin>
          }
        />
        <Route 
          path="/estoque" 
          element={
          <RotaProtegidaAdmin>
            <DashEstoque />
          </RotaProtegidaAdmin>
          }
        />
        <Route 
          path="/editar-pessoa" 
          element={
            <RotaProtegidaAdmin>
              <EditarPessoa />
            </RotaProtegidaAdmin>
          } 
        />
        <Route 
          path="/editar-produto" 
          element={
            <RotaProtegidaAdmin>
              <EditarProduto />
            </RotaProtegidaAdmin>
          } 
        />
        
        {/* Rota padrão - redireciona para home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;