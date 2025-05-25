import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import DashAdmin from './DashAdmin';
import EditarPessoa from './EditarPessoa';

function RoteadorPessoas({ token, onLogout }) {
  // Estados compartilhados entre DashAdmin e EditarPessoa
  const [dadosEdicao, setDadosEdicao] = useState(null);
  const [pessoas, setPessoas] = useState([]);
  const [tipoAtual, setTipoAtual] = useState('cliente');

  // Função para iniciar edição/adição
  const handleIniciarEdicao = (pessoa, tipo, acao) => {
    setTipoAtual(tipo);
    
    if (acao === 'adicionar') {
      setDadosEdicao({
        tipo: tipo || 'cliente',
        nome: '', 
        email: '', 
        telefone: '', 
        rua: '', 
        cidade: '', 
        estado: '', 
        cep: '', 
        pais: '',
        token: '', // Token vazio para nova pessoa
        _acao: acao
      });
    } else {
      setDadosEdicao({
        ...pessoa,
        tipo: tipo,
        _acao: acao
      });
    }
  };

  // Função para limpar dados de edição
  const handleLimparEdicao = () => {
    setDadosEdicao(null);
  };

  // Função para atualizar lista de pessoas
  const handleAtualizarPessoas = (novasPessoas) => {
    setPessoas(novasPessoas);
  };

  // Função para adicionar nova pessoa
  const handleAdicionarPessoa = (novaPessoa) => {
    setPessoas(prev => [...prev, novaPessoa]);
  };

  // Função para atualizar pessoa existente
  const handleAtualizarPessoa = (pessoaAtualizada) => {
    setPessoas(prev => 
      prev.map(p => 
        p.token === pessoaAtualizada.token ? pessoaAtualizada : p
      )
    );
  };

  // Função para remover pessoa - corrigida para usar token
  const handleRemoverPessoa = (tokenPessoa) => {
    setPessoas(prev => prev.filter(p => p.token !== tokenPessoa));
  };

  return (
    <>
      <NavBar 
        onLogout={onLogout} 
        token={token} 
        paginaAtual="pessoas"
      />
      <Routes>
        {/* Rota para /admin/pessoas/administradores */}
        <Route 
          path="administradores" 
          element={
            <DashAdmin 
              tipo="administrador" 
              pessoas={pessoas}
              onIniciarEdicao={handleIniciarEdicao}
              onAtualizarPessoas={handleAtualizarPessoas}
              onAdicionarPessoa={handleAdicionarPessoa}
              onAtualizarPessoa={handleAtualizarPessoa}
              onRemoverPessoa={handleRemoverPessoa}
            />
          }
        />
        
        {/* Rota para /admin/pessoas/clientes */}
        <Route 
          path="clientes"
          element={
            <DashAdmin 
              tipo="cliente" 
              pessoas={pessoas}
              onIniciarEdicao={handleIniciarEdicao}
              onAtualizarPessoas={handleAtualizarPessoas}
              onAdicionarPessoa={handleAdicionarPessoa}
              onAtualizarPessoa={handleAtualizarPessoa}
              onRemoverPessoa={handleRemoverPessoa}
            />
          }
        />
        
        {/* Rota para /admin/pessoas/editar-pessoa */}
        <Route 
          path="editar-pessoa" 
          element={
            <EditarPessoa 
              dadosPessoa={dadosEdicao}
              onLimparEdicao={handleLimparEdicao}
              onAdicionarPessoa={handleAdicionarPessoa}
              onAtualizarPessoa={handleAtualizarPessoa}
            />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default RoteadorPessoas;