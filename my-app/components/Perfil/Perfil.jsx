import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormPerfil from './FormPerfil';

function Perfil({ token, tipoUsuario, onLogout }) {
  const navigate = useNavigate();
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDadosUsuario() {
      try {
        setCarregando(true);
        const response = await fetch('/usuarios.json');
        const data = await response.json();
        
        // Busca pelo usuário que possui o token correspondente
        const usuario = data.find(pessoa => pessoa.token === token);
        
        if (usuario) {
          setDadosUsuario(usuario);
        } else {
          console.error('Usuário não encontrado com o token fornecido');
          // Dados padrão caso não encontre o usuário
          setDadosUsuario({
            tipo: tipoUsuario,
            nome: "",
            email: "",
            senha: "",
            telefone: "",
            rua: "",
            cidade: "",
            estado: "",
            cep: "",
            pais: ""
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Dados padrão em caso de erro
        setDadosUsuario({
          tipo: tipoUsuario,
          nome: "",
          email: "",
          senha: "",
          telefone: "",
          rua: "",
          cidade: "",
          estado: "",
          cep: "",
          pais: ""
        });
      } finally {
        setCarregando(false);
      }
    }
    
    if (token && tipoUsuario) {
      buscarDadosUsuario();
    }
  }, [token, tipoUsuario]);

  // Função para salvar alterações do perfil
  async function handleSalvarPerfil(dadosAtualizados) {
    try {
      const endpoint = tipoUsuario === 'administrador' 
        ? '/api/administradores' 
        : '/api/clientes';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...dadosAtualizados,
          acao: 'editar'
        })
      });
      
      if (response.ok) {
        console.log('Perfil atualizado com sucesso');
        setDadosUsuario(dadosAtualizados);
        alert('Perfil atualizado com sucesso!');
      } else {
        console.error('Erro ao atualizar perfil');
        alert('Erro ao atualizar perfil. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    }
  }

  // Função para sair da conta
  function handleSair() {
    const confirmar = window.confirm('Tem certeza que deseja sair da sua conta?');
    
    if (confirmar) {
      console.log('Usuário saiu da conta');
      onLogout(); // Chama a função de logout do App.jsx
      navigate('/home'); // Redireciona para home após logout
    }
  }

  if (carregando || !dadosUsuario) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.2rem' 
      }}>
        Carregando perfil...
      </div>
    );
  }

  return (
    <div>
      <FormPerfil
        dadosIniciais={dadosUsuario}
        onSubmit={handleSalvarPerfil}
        onSair={handleSair}
        tipoUsuario={tipoUsuario}
      />
    </div>
  );
}

export default Perfil;