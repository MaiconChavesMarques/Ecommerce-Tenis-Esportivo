import { useNavigate } from 'react-router-dom';
import './Registro.css';
import FormUsuario from './FormUsuario';

function Registro({ onLoginSuccess }) {
  // Hook para navegação programática entre páginas
  const navigate = useNavigate();

  // Dados iniciais vazios para o formulário de registro
  const dadosIniciais = {
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    rua: "",
    cidade: "",
    estado: "",
    cep: "",
    pais: ""
  };

  // Função para lidar com envio do formulário de registro
  async function handleSubmit(formData) {
    // Validação simples: campos obrigatórios
    if (!formData.nome || !formData.email || !formData.senha || !formData.telefone || 
        !formData.rua || !formData.cidade || !formData.estado || !formData.cep || !formData.pais) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // Envia dados para endpoint /api/login/registro via POST
      const response = await fetch('http://localhost:3000/users/login/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          telefone: formData.telefone,
          rua: formData.rua,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
          pais: formData.pais
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Usuário registrado:", result);
        
        // Se receber token e função onLoginSuccess definida, faz login automático
        if (result.token && onLoginSuccess) {
          onLoginSuccess(result.token, result.tipo);
          
          // Redireciona para página de admin ou home conforme tipo do usuário
          if (result.tipo === "administrador") {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        } else {
          // Se não houver token ou função de login, redireciona para página de login
          navigate('/login');
        }
      } else {
        // Caso resposta do servidor seja erro, lança exceção com mensagem
        const error = await response.json();
        throw new Error(error.message || "Erro ao registrar usuário");
      }
    } catch (err) {
      // Trata erros de requisição e exibe alerta ao usuário
      console.error("Erro ao registrar:", err);
      alert(err.message || "Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <div className="container">
      <div id="containerConteudo">
        <div className="conteudo-registro">
          {/* Título da página de registro */}
          <h1>Crie sua conta Velox!</h1>
          {/* Subtítulo para motivar o registro */}
          <p>Junte-se à nossa comunidade de entusiastas do esporte</p>

          {/* Componente FormUsuario que exibe o formulário e envia os dados */}
          <FormUsuario
            dadosIniciais={dadosIniciais}
            onSubmit={handleSubmit}
            titulo="Registre-se"
            subtitulo="Preencha suas informações para criar uma conta"
            textoBotao="Registrar-se"
            mostrarSenha={true}
          />

          {/* Link para quem já tem conta ir para a página de login */}
          <div className="link-login">
            <span>Já tem uma conta?</span>
            <a href="/login">Entrar agora</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;