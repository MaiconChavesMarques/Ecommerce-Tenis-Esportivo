// Importa useState para gerenciar estado local e componentes de rota do react-router-dom
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
// Importa componentes de navegação e rodapé
import NavBar from '../../Layout/NavBar';
import Footer from '../../Layout/Footer';
// Importa componentes específicos da funcionalidade de pessoas
import DashAdmin from './DashAdmin';
import EditarPessoa from './EditarPessoa';

// Componente principal que gerencia as rotas e estado relacionado às pessoas (clientes e administradores)
function RoteadorPessoas({ token, onLogout }) {
  // Estado que armazena os dados da pessoa que está sendo editada ou adicionada
  const [dadosEdicao, setDadosEdicao] = useState(null);
  // Estado que mantém a lista atual de pessoas (clientes ou administradores)
  const [pessoas, setPessoas] = useState([]);
  // Estado que guarda o tipo atual selecionado, padrão 'cliente'
  const [tipoAtual, setTipoAtual] = useState('cliente');

  // Função para iniciar edição ou adição de uma pessoa
  const handleIniciarEdicao = (pessoa, tipo, acao) => {
    setTipoAtual(tipo); // Atualiza o tipo atual com o tipo passado
    
    // Se for uma nova pessoa, inicializa dados vazios para o formulário
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
        estadoConta: 'ativo', // Estado ativo padrão para nova pessoa
        _acao: acao           // Marca ação para controle interno (adicionar)
      });
    } else {
      // Se for edição, preenche com dados existentes e garante que todos os campos estejam presentes
      setDadosEdicao({
        tipo: tipo,
        nome: pessoa.nome || '',
        email: pessoa.email || '',
        telefone: pessoa.telefone || '',
        rua: pessoa.rua || '',
        cidade: pessoa.cidade || '',
        estado: pessoa.estado || '',
        cep: pessoa.cep || '',
        pais: pessoa.pais || '',
        token: pessoa.token, // IMPORTANTE: Sempre incluir o token para edição
        estadoConta: pessoa.estadoConta || 'ativo', // Garante campo estadoConta válido
        _acao: acao  // Marca ação para controle interno (editar)
      });
    }
  };

  // Função para limpar os dados da edição, resetando estado
  const handleLimparEdicao = () => {
    setDadosEdicao(null);
  };

  // Atualiza a lista completa de pessoas com novos dados
  const handleAtualizarPessoas = (novasPessoas) => {
    setPessoas(novasPessoas);
  };

  // Adiciona uma nova pessoa à lista existente
  const handleAdicionarPessoa = (novaPessoa) => {
    setPessoas(prev => {
      // Se prev for null, cria um novo array com a nova pessoa
      if (!prev || !Array.isArray(prev)) {
        return [novaPessoa];
      }
      return [...prev, novaPessoa];
    });
  };

  // Atualiza uma pessoa existente na lista com dados atualizados
  const handleAtualizarPessoa = (pessoaAtualizada) => {
    setPessoas(prev => {
      // Verifica se prev existe e é um array antes de fazer o map
      if (!prev || !Array.isArray(prev)) {
        console.warn('Lista de pessoas não está disponível para atualização');
        return prev;
      }
      
      return prev.map(p => 
        p.token === pessoaAtualizada.token ? pessoaAtualizada : p
      );
    });
  };

  // Remove uma pessoa da lista pelo seu token único
  const handleRemoverPessoa = (tokenPessoa) => {
    setPessoas(prev => {
      // Verifica se prev existe e é um array antes de fazer o filter
      if (!prev || !Array.isArray(prev)) {
        console.warn('Lista de pessoas não está disponível para remoção');
        return prev;
      }
      return prev.filter(p => p.token !== tokenPessoa);
    });
  };

  return (
    <>
      {/* Barra de navegação que recebe token e função de logout */}
      <NavBar 
        onLogout={onLogout} 
        token={token} 
        paginaAtual="pessoas" // Informa que estamos na página 'pessoas'
      />
      
      {/* Define rotas internas para diferentes tipos de usuários e edição */}
      <Routes>
        {/* Rota para mostrar administradores */}
        <Route 
          path="administradores" 
          element={
            <DashAdmin 
              tipo="administrador" 
              token={token} // Passa o token do usuário logado
              pessoas={pessoas}
              onIniciarEdicao={handleIniciarEdicao}
              onAtualizarPessoas={handleAtualizarPessoas}
              onAdicionarPessoa={handleAdicionarPessoa}
              onAtualizarPessoa={handleAtualizarPessoa}
              onRemoverPessoa={handleRemoverPessoa}
            />
          }
        />
        
        {/* Rota para mostrar clientes */}
        <Route 
          path="clientes"
          element={
            <DashAdmin 
              tipo="cliente" 
              token={token} // Passa o token do usuário logado
              pessoas={pessoas}
              onIniciarEdicao={handleIniciarEdicao}
              onAtualizarPessoas={handleAtualizarPessoas}
              onAdicionarPessoa={handleAdicionarPessoa}
              onAtualizarPessoa={handleAtualizarPessoa}
              onRemoverPessoa={handleRemoverPessoa}
            />
          }
        />
        
        {/* Rota para editar ou adicionar pessoa */}
        <Route 
          path="editar-pessoa" 
          element={
            <EditarPessoa 
              dadosPessoa={dadosEdicao}             // Dados da pessoa a editar ou adicionar
              onLimparEdicao={handleLimparEdicao}   // Função para limpar edição
              onAdicionarPessoa={handleAdicionarPessoa} // Callback para adicionar pessoa
              onAtualizarPessoa={handleAtualizarPessoa} // Callback para atualizar pessoa
            />
          }
        />
      </Routes>
      
      {/* Rodapé do site */}
      <Footer />
    </>
  );
}

// Exporta o componente para ser usado em outras partes da aplicação
export default RoteadorPessoas;