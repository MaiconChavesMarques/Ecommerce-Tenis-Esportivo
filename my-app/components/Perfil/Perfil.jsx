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
        const response = await fetch(`http://localhost:3000/users/perfil/${encodeURIComponent(token)}`);
        
        if (response.ok) {
          const data = await response.json();
          setDadosUsuario(data.usuario);
        } else {
          console.error('Usuário não encontrado com o token fornecido');
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

  async function handleSalvarPerfil(dadosAtualizados) {
    try {
      const response = await fetch(`http://localhost:3000/users/perfil/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Perfil atualizado com sucesso');
        setDadosUsuario(data.usuario);
        
        // Se houve erro com a senha mas os dados foram salvos
        if (data.erroSenha && !data.senhaAlterada) {
          alert(`✅ Dados do perfil salvos com sucesso!\n\n⚠️ Problema com a senha: ${data.erroSenha}`);
        } else {
          alert(data.message || 'Perfil atualizado com sucesso!');
        }
      } else {
        // Exibe a mensagem de erro específica do servidor
        console.error('Erro ao atualizar perfil:', data.message);
        alert(data.message || 'Erro ao atualizar perfil. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão. Tente novamente.');
    }
  }

  function handleSair() {
    const confirmar = window.confirm('Tem certeza que deseja sair da sua conta?');
    
    if (confirmar) {
      console.log('Usuário saiu da conta');
      onLogout();
      navigate('/home');
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