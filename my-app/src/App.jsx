import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Home from '../components/Home';
import Carrinho from '../components/Carrinho';
import Cartao from '../components/Cartao';
import Login from '../components/Login';
import Registro from '../components/Registro';
import ProdutoDetalhe from '../components/ProdutoDetalhe';
import Administrador from '../components/Administrador';
import Perfil from '../components/Perfil';
import Chat from '../components/Chat';
import RoteadorEstoque from '../components/RoteadorEstoque';
import RoteadorPessoas from '../components/RoteadorPessoas';

function App() {
  const [carrinho, setCarrinho] = useState({});
  const [token, setToken] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  
  // Estados para o chat
  const [chatMessages, setChatMessages] = useState([]);

  // Função para sincronizar carrinho com servidor
  async function sincronizarCarrinhoServidor(novoCarrinho) {
    if (!token) return;

    try {
      // Converter o formato do carrinho local para o formato do servidor
      const carrinhoProdutos = [];
      const tamanhos = [];
      const quantidades = [];

      Object.entries(novoCarrinho).forEach(([chave, item]) => {
        carrinhoProdutos.push(item.id);
        tamanhos.push(item.tamanho);
        quantidades.push(item.quantidade);
      });

      const response = await fetch('http://localhost:3001/atualizar-carrinho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token: token,
          carrinho: carrinhoProdutos,
          tamanhoCarrinho: tamanhos,
          quantiaCarrinho: quantidades
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao sincronizar carrinho com servidor');
      }

      console.log('Carrinho sincronizado com sucesso');
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);
    }
  }

  // Função para carregar carrinho do servidor após login
  async function carregarCarrinhoServidor(tokenUsuario) {
    try {
      const response = await fetch('/usuarios.json');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados dos usuários');
      }
  
      const usuarios = await response.json();
      const usuario = usuarios.find(u => u.token === tokenUsuario);
      
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
  
      console.log('Usuário encontrado:', usuario);
      
      if (usuario.carrinho && usuario.carrinho.length > 0) {
        const carrinhoLocal = {};
        
        usuario.carrinho.forEach((produtoId, index) => {
          const tamanho = usuario.tamanhoCarrinho[index];
          const quantidade = usuario.quantiaCarrinho[index];
          const chave = `${produtoId}_${tamanho}`;
          
          carrinhoLocal[chave] = {
            id: produtoId,
            tamanho: tamanho,
            quantidade: quantidade
          };
        });
  
        setCarrinho(carrinhoLocal);
      } else {
        console.log('Usuário não possui itens no carrinho');
        setCarrinho({});
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do servidor:', error);
    }
  }

  function handleLoginSuccess(tokenRecebido, tipo) {
    console.log("Login realizado:", { token: tokenRecebido, tipo });
    
    setToken(tokenRecebido);
    setTipoUsuario(tipo);

    if (tipo === "cliente") {
      carregarCarrinhoServidor(tokenRecebido);
    }
  }

  function handleLogout() {
    setToken(null);
    setTipoUsuario(null);
    setCarrinho({});
    setChatMessages([]);
  }

  function handleSendMessage(message) {
    setChatMessages(prev => [...prev, message]);
  }

  async function adicionarAoCarrinho(id, tamanho) {
    console.log(carrinho);
    console.log("Mandei adicionar");
    
    const chave = `${id}_${tamanho}`;
    const novoCarrinho = {
      ...carrinho,
      [chave]: { 
        id, 
        tamanho, 
        quantidade: (carrinho[chave]?.quantidade || 0) + 1 
      }
    };

    setCarrinho(novoCarrinho);
    await sincronizarCarrinhoServidor(novoCarrinho);
  }

  async function removerDoCarrinho(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    const novoCarrinho = { ...carrinho };
    delete novoCarrinho[chave];

    setCarrinho(novoCarrinho);
    await sincronizarCarrinhoServidor(novoCarrinho);
  }

  async function aumentarQuantidade(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    const novoCarrinho = {
      ...carrinho,
      [chave]: {
        ...carrinho[chave],
        quantidade: carrinho[chave].quantidade + 1
      }
    };

    setCarrinho(novoCarrinho);
    await sincronizarCarrinhoServidor(novoCarrinho);
  }

  async function diminuirQuantidade(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    const item = carrinho[chave];
    
    if (!item) return;

    let novoCarrinho;
    
    if (item.quantidade <= 1) {
      novoCarrinho = { ...carrinho };
      delete novoCarrinho[chave];
    } else {
      novoCarrinho = {
        ...carrinho,
        [chave]: {
          ...item,
          quantidade: item.quantidade - 1
        }
      };
    }

    setCarrinho(novoCarrinho);
    await sincronizarCarrinhoServidor(novoCarrinho);
  }

  async function limparCarrinho() {
    const carrinhoVazio = {};
    setCarrinho(carrinhoVazio);
    await sincronizarCarrinhoServidor(carrinhoVazio);
  }

  // 🔐 Rota protegida para usuários/clientes (impede administradores)
  function RotaProtegidaUsuario({ children }) {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    if (tipoUsuario === "administrador") {
      return <Navigate to="/admin" replace />;
    }
    
    return children;
  }

  // 🔐 Rota para usuários não logados ou clientes (impede administradores)
  function RotaPublicaOuUsuario({ children }) {
    if (token && tipoUsuario === "administrador") {
      return <Navigate to="/admin" replace />;
    }
    
    return children;
  }

  // 🔐 Rota protegida para administradores
  function RotaProtegidaAdmin({ children }) {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    if (tipoUsuario !== "administrador") {
      return <Navigate to="/home" replace />;
    }
    
    return children;
  }

  // 🔐 Rota protegida para usuários logados (tanto clientes quanto administradores)
  function RotaProtegidaLogado({ children }) {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  }

  // 🛒 Rota protegida para cartão - verifica se carrinho não está vazio
  function RotaCartao({ children }) {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    if (tipoUsuario === "administrador") {
      return <Navigate to="/admin" replace />;
    }

    if (Object.keys(carrinho).length === 0) {
      return <Navigate to="/home" replace />;
    }
    
    return children;
  }

  return (
    <Router>
      <Routes>
        {/* Rota padrão - redireciona para home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        <Route
          path="/home"
          element={
            <RotaPublicaOuUsuario>
              <>
                <NavBar 
                  onLogout={handleLogout} 
                  token={token} 
                  paginaAtual="home"
                />
                <Home onAddToCart={adicionarAoCarrinho} />
                <Footer />
              </>
            </RotaPublicaOuUsuario>
          }
        />
        
        <Route
          path="/produto/:id"
          element={
            <RotaPublicaOuUsuario>
              <>
                <NavBar 
                  onLogout={handleLogout} 
                  token={token} 
                  paginaAtual="produto-detalhe"
                />
                <ProdutoDetalhe onAddToCart={adicionarAoCarrinho} />
                <Footer />
              </>
            </RotaPublicaOuUsuario>
          }
        />
        
        <Route
          path="/carrinho"
          element={
            <RotaProtegidaUsuario>
              <>
                <NavBar 
                  onLogout={handleLogout} 
                  token={token} 
                  paginaAtual="carrinho"
                />
                <Carrinho
                  carrinho={carrinho}
                  onRemover={removerDoCarrinho}
                  onAumentar={aumentarQuantidade}
                  onDiminuir={diminuirQuantidade}
                />
                <Footer />
              </>
            </RotaProtegidaUsuario>
          }
        />
        
        <Route
          path="/cartao"
          element={
            <RotaCartao>
              <>
                <NavBar 
                  onLogout={handleLogout} 
                  token={token} 
                  paginaAtual="cartao"
                />
                <Cartao
                  token={token}
                  carrinho={carrinho}
                  onLimparCarrinho={limparCarrinho}
                />
                <Footer />
              </>
            </RotaCartao>
          }
        />
        
        <Route
          path="/perfil"
          element={
            <RotaProtegidaLogado>
              <>
                <NavBar 
                  onLogout={handleLogout} 
                  token={token} 
                  paginaAtual="perfil"
                />
                <Perfil 
                  token={token}
                  tipoUsuario={tipoUsuario}
                  onLogout={handleLogout}
                />
                <Footer />
              </>
            </RotaProtegidaLogado>
          }
        />
        
        <Route
          path="/chat"
          element={
            <RotaProtegidaUsuario>
              <>
                <NavBar 
                  onLogout={handleLogout} 
                  token={token} 
                  paginaAtual="chat"
                />
                <Chat
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                />
                <Footer />
              </>
            </RotaProtegidaUsuario>
          }
        />
        
        <Route 
          path="/login"
          element={
            <>
              <NavBar 
                onLogout={handleLogout} 
                token={token} 
                paginaAtual="login"
              />
              <Login onLoginSuccess={handleLoginSuccess} />
              <Footer />
            </>
          } 
        />
        
        <Route 
          path="/registro" 
          element={
            <>
              <NavBar 
                onLogout={handleLogout} 
                token={token} 
                paginaAtual="registro"
              />
              <Registro />
              <Footer />
            </>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <RotaProtegidaAdmin>
              <>
                <NavBar 
                  onLogout={handleLogout} 
                  token={token} 
                  paginaAtual="admin"
                />
                <Administrador />
                <Footer />
              </>
            </RotaProtegidaAdmin>
          }
        />
        
        {/* Roteadores para áreas administrativas - MOVIDOS PARA O FINAL */}
        <Route 
          path="/admin/pessoas/*"
          element={
            <RotaProtegidaAdmin>
              <RoteadorPessoas 
                token={token} 
                onLogout={handleLogout} 
              />
            </RotaProtegidaAdmin>
          }
        />
        
        <Route 
          path="/admin/estoque/*" 
          element={
            <RotaProtegidaAdmin>
              <RoteadorEstoque
                token={token} 
                onLogout={handleLogout} 
              />
            </RotaProtegidaAdmin>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;