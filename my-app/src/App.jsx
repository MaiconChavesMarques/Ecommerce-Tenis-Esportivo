import { useState, useEffect } from 'react'; // Importa hooks do React
import './App.css'; // Importa arquivo CSS
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importa componentes de roteamento
import NavBar from '../components/Layout/NavBar'; // Importa componente NavBar
import Footer from '../components/Layout/Footer'; // Importa componente Footer
import Home from '../components/Home/Home'; // Importa componente Home
import Carrinho from '../components/Carrinho/Carrinho'; // Importa componente Carrinho
import Cartao from '../components/Carrinho/Cartao'; // Importa componente Cartao
import Login from '../components/Login/Login'; // Importa componente Login
import Registro from '../components/Login/Registro'; // Importa componente Registro
import ProdutoDetalhe from '../components/Produto/ProdutoDetalhe'; // Importa componente ProdutoDetalhe
import Administrador from '../components/Administrador/Administrador'; // Importa componente Administrador
import Perfil from '../components/Perfil/Perfil'; // Importa componente Perfil
import Chat from '../components/Chat/Chat'; // Importa componente Chat
import RoteadorEstoque from '../components/Administrador/Estoque/RoteadorEstoque'; // Importa roteador Estoque
import RoteadorPessoas from '../components/Administrador/Pessoas/RoteadorPessoas'; // Importa roteador Pessoas

function App() {
  // Estado para armazenar o carrinho de compras
  const [carrinho, setCarrinho] = useState({});

  // Estado para armazenar o token de autenticação do usuário
  const [token, setToken] = useState(null);

  // Estado para armazenar o tipo do usuário (cliente ou administrador)
  const [tipoUsuario, setTipoUsuario] = useState(null);
  
  // Estado para armazenar as mensagens do chat
  const [chatMessages, setChatMessages] = useState([]);

  // Função para sincronizar o carrinho local com o servidor
  async function sincronizarCarrinhoServidor(novoCarrinho) {
    if (!token) return; // Se não estiver autenticado, sai da função

    try {
      // Preparar arrays para enviar ao servidor
      const carrinhoProdutos = [];
      const tamanhos = [];
      const quantidades = [];

      // Extrair dados do novo carrinho para os arrays
      Object.entries(novoCarrinho).forEach(([chave, item]) => {
        carrinhoProdutos.push(item.id);
        tamanhos.push(item.tamanho);
        quantidades.push(item.quantidade);
      });

      // Envia dados para a API do servidor para atualizar o carrinho
      const response = await fetch(`http://localhost:3000/users/user/carrinho/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          carrinho: carrinhoProdutos,
          tamanhoCarrinho: tamanhos,
          quantiaCarrinho: quantidades
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao sincronizar carrinho com servidor'); // Lança erro se a resposta não for ok
      }

      console.log('Carrinho sincronizado com sucesso'); // Log de sucesso
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error); // Log de erro
    }
  }

  // Função para carregar o carrinho do servidor quando o usuário faz login
// Função para carregar o carrinho do servidor quando o usuário faz login
  async function carregarCarrinhoServidor(tokenUsuario) {
    try {
      // Busca dados do carrinho do usuário através da API
      const response = await fetch(`http://localhost:3000/users/user/carrinho/${tokenUsuario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar carrinho do usuário');
      }

      const data = await response.json();
      
      console.log('Dados do carrinho:', data);
      
      if (data.carrinho && data.carrinho.length > 0) {
        // Reconstruir o carrinho local baseado nos dados do servidor
        const carrinhoLocal = {};
        
        data.carrinho.forEach((produtoId, index) => {
          const tamanho = data.tamanhoCarrinho[index];
          const quantidade = data.quantiaCarrinho[index];
          const chave = `${produtoId}_${tamanho}`;
          
          carrinhoLocal[chave] = {
            id: produtoId,
            tamanho: tamanho,
            quantidade: quantidade
          };
        });

        setCarrinho(carrinhoLocal); // Atualiza o estado do carrinho
      } else {
        console.log('Usuário não possui itens no carrinho');
        setCarrinho({}); // Carrinho vazio se não houver itens
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do servidor:', error);
    }
  }

  // Função chamada após login bem-sucedido para armazenar token e tipo usuário
  function handleLoginSuccess(tokenRecebido, tipo) {
    console.log("Login realizado:", { token: tokenRecebido, tipo });
    
    setToken(tokenRecebido); // Salva token no estado
    setTipoUsuario(tipo); // Salva tipo de usuário no estado

    if (tipo === "cliente") {
      carregarCarrinhoServidor(tokenRecebido); // Carrega carrinho do servidor se for cliente
    }
  }

  // Função para logout, limpa estados sensíveis
  function handleLogout() {
    setToken(null); // Remove token
    setTipoUsuario(null); // Remove tipo usuário
    setCarrinho({}); // Limpa carrinho
    setChatMessages([]); // Limpa mensagens do chat
  }

  // Função para adicionar mensagem ao chat
  function handleSendMessage(message) {
    setChatMessages(prev => [...prev, message]); // Adiciona nova mensagem ao array de mensagens
  }

  // Função para adicionar um produto ao carrinho local e sincronizar com servidor
  async function adicionarAoCarrinho(id, tamanho) {
    console.log("Mandei adicionar");
    
    const chave = `${id}_${tamanho}`; // Chave única combinando id e tamanho
    const novoCarrinho = {
      ...carrinho,
      [chave]: { 
        id, 
        tamanho, 
        quantidade: (carrinho[chave]?.quantidade || 0) + 1 // Incrementa quantidade ou inicia com 1
      }
    };

    setCarrinho(novoCarrinho); // Atualiza o estado local do carrinho
    await sincronizarCarrinhoServidor(novoCarrinho); // Sincroniza com o servidor
  }

  // Função para remover um item do carrinho
  async function removerDoCarrinho(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    const novoCarrinho = { ...carrinho };
    delete novoCarrinho[chave]; // Remove item do objeto

    setCarrinho(novoCarrinho); // Atualiza estado
    await sincronizarCarrinhoServidor(novoCarrinho); // Sincroniza servidor
  }

  // Função para aumentar a quantidade de um item no carrinho
  async function aumentarQuantidade(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    const novoCarrinho = {
      ...carrinho,
      [chave]: {
        ...carrinho[chave],
        quantidade: carrinho[chave].quantidade + 1 // Incrementa quantidade
      }
    };

    setCarrinho(novoCarrinho); // Atualiza estado
    await sincronizarCarrinhoServidor(novoCarrinho); // Sincroniza servidor
  }

  // Função para diminuir a quantidade de um item no carrinho ou remover se for 1
  async function diminuirQuantidade(id, tamanho) {
    const chave = `${id}_${tamanho}`;
    const item = carrinho[chave];
    
    if (!item) return; // Se não existir, sai

    let novoCarrinho;
    
    if (item.quantidade <= 1) {
      novoCarrinho = { ...carrinho };
      delete novoCarrinho[chave]; // Remove item se quantidade for 1
    } else {
      novoCarrinho = {
        ...carrinho,
        [chave]: {
          ...item,
          quantidade: item.quantidade - 1 // Decrementa quantidade
        }
      };
    }

    setCarrinho(novoCarrinho); // Atualiza estado
    await sincronizarCarrinhoServidor(novoCarrinho); // Sincroniza servidor
  }

  // Função para limpar todo o carrinho
  async function limparCarrinho() {
    const carrinhoVazio = {};
    setCarrinho(carrinhoVazio); // Define carrinho vazio
    await sincronizarCarrinhoServidor(carrinhoVazio); // Sincroniza servidor
  }

  // Componente para rota protegida que permite somente usuários clientes (bloqueia admin)
  function RotaProtegidaUsuario({ children }) {
    if (!token) {
      return <Navigate to="/login" replace />; // Redireciona se não logado
    }
    
    if (tipoUsuario === "administrador") {
      return <Navigate to="/admin" replace />; // Redireciona admin para painel admin
    }
    
    return children; // Permite acesso ao conteúdo
  }

  // Componente para rota que permite público e usuários, mas bloqueia admin
  function RotaPublicaOuUsuario({ children }) {
    if (token && tipoUsuario === "administrador") {
      return <Navigate to="/admin" replace />; // Admin redirecionado
    }
    
    return children; // Permite acesso ao conteúdo
  }

  // Componente para rota protegida que permite somente administradores
  function RotaProtegidaAdmin({ children }) {
    if (!token) {
      return <Navigate to="/login" replace />; // Redireciona se não logado
    }
    
    if (tipoUsuario !== "administrador") {
      return <Navigate to="/home" replace />; // Bloqueia não administradores
    }
    
    return children; // Permite acesso ao conteúdo
  }

  // Componente para rota protegida para qualquer usuário logado (cliente ou admin)
  function RotaProtegidaLogado({ children }) {
    if (!token) {
      return <Navigate to="/login" replace />; // Redireciona se não logado
    }
    
    return children; // Permite acesso
  }

  // Componente para rota protegida para cartão, verifica se usuário está logado, não é admin e carrinho não está vazio
  function RotaCartao({ children }) {
    if (!token) {
      return <Navigate to="/login" replace />; // Redireciona se não logado
    }
    
    if (tipoUsuario === "administrador") {
      return <Navigate to="/admin" replace />; // Admin redirecionado
    }

    if (Object.keys(carrinho).length === 0) {
      return <Navigate to="/home" replace />; // Redireciona se carrinho vazio
    }
    
    return children; // Permite acesso
  }

  // JSX com roteamento da aplicação
  return (
    <Router>
      <Routes>
        {/* Rota raiz redireciona para home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Página Home acessível ao público e usuários (exceto admin) */}
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
        
        {/* Página de detalhe do produto */}
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
        
        {/* Página do carrinho, protegida para usuários clientes */}
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
        
        {/* Página do cartão para pagamento, protegida */}
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
        
        {/* Página de perfil acessível para qualquer usuário logado */}
        <Route
          path="/perfil"
          element={
            <RotaProtegidaLogado>
              <>
                <NavBar 
                  onLogout={handleLogout}
                  token={token} 
                  paginaAtual={(token && tipoUsuario === "administrador") ? "perfil-adm" : "perfil"}
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
        
        {/* Página de chat protegida para usuários clientes */}
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
        
        {/* Página de login pública */}
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
        
        {/* Página de registro pública */}
        <Route 
          path="/registro" 
          element={
            <>
              <NavBar 
                onLogout={handleLogout} 
                token={token} 
                paginaAtual="registro"
              />
              <Registro onLoginSuccess={handleLoginSuccess}/>
              <Footer />
            </>
          } 
        />
        
        {/* Página do administrador protegida */}
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
        
        {/* Roteadores para áreas administrativas - rotas aninhadas */}
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

export default App; // Exporta o componente principal da aplicação
