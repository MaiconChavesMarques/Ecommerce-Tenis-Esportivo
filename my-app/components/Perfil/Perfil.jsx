import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormPerfil from './FormPerfil';

function Perfil({ token, tipoUsuario, onLogout }) {
const navigate = useNavigate();
// Estado para armazenar os dados do usuário
const [dadosUsuario, setDadosUsuario] = useState(null);
// Estado para controlar o indicador de carregamento
const [carregando, setCarregando] = useState(true);

// useEffect para buscar os dados do usuário assim que o token ou tipoUsuario mudam
useEffect(() => {
  async function buscarDadosUsuario() {
    try {
      setCarregando(true);    
      // Faz a requisição para buscar o perfil do usuário pelo token
      const response = await fetch(`http://localhost:3000/users/perfil/${encodeURIComponent(token)}`);
      
      if (response.ok) {
        const data = await response.json();
        setDadosUsuario(data.usuario); // Define os dados do usuário encontrado
      } else {
        console.error('Usuário não encontrado com o token fornecido');
        // Define dados padrão caso usuário não seja encontrado
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
      // Define dados padrão em caso de erro na requisição
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
      setCarregando(false); // Indica que o carregamento terminou
    }
  }
  
  // Executa a busca apenas se token e tipoUsuario estiverem disponíveis
  if (token && tipoUsuario) {
    buscarDadosUsuario();
  }
}, [token, tipoUsuario]);

// Função para salvar as alterações feitas no perfil do usuário
async function handleSalvarPerfil(dadosAtualizados) {
  try {
    // Faz a requisição PUT para atualizar os dados do perfil
    const response = await fetch(`http://localhost:3000/users/perfil/${token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...dadosAtualizados
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Perfil atualizado com sucesso');
      setDadosUsuario(data.usuario); // Atualiza o estado local com os dados retornados
      alert('Perfil atualizado com sucesso!');
    } else {
      const errorData = await response.json();
      console.error('Erro ao atualizar perfil:', errorData.message);
      alert(errorData.message || 'Erro ao atualizar perfil. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao atualizar perfil. Tente novamente.');
  }
}

// Função para lidar com o logout do usuário
function handleSair() {
  const confirmar = window.confirm('Tem certeza que deseja sair da sua conta?');
  
  if (confirmar) {
    console.log('Usuário saiu da conta');
    onLogout(); // Executa a função de logout passada via props
    navigate('/home'); // Redireciona para a página inicial após logout
  }
}

// Enquanto estiver carregando ou sem dados do usuário, exibe mensagem de carregamento
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

// Renderiza o formulário de perfil com os dados carregados e funções de salvar e sair
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