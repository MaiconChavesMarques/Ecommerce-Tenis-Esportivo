import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Home from '../components/Home';
import Carrinho from '../components/Carrinho';
import Login from '../components/Login';

function App() {
  const [carrinho, setCarrinho] = useState({});
  const [token, setToken] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  function handleLoginSuccess(tokenRecebido, tipo) {
    setToken(tokenRecebido);
    setTipoUsuario(tipo);
    localStorage.setItem("token", tokenRecebido);
    localStorage.setItem("tipo", tipo);
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

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/home"
          element={
            <Home onAddToCart={adicionarAoCarrinho} />
          }
        />
        <Route
          path="/carrinho"
          element={
            <Carrinho
              carrinho={carrinho}
              onRemover={removerDoCarrinho}
              onAumentar={aumentarQuantidade}
              onDiminuir={diminuirQuantidade}
            />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;