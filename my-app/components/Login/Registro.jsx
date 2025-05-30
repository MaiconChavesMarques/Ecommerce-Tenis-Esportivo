import { useNavigate } from 'react-router-dom';
import './Registro.css';
import FormUsuario from './FormUsuario';

function Registro({ onLoginSuccess }) {
  const navigate = useNavigate();

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

  async function handleSubmit(formData) {
    if (!formData.nome || !formData.email || !formData.senha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          telefone: formData.telefone,
          endereco: {
            rua: formData.rua,
            cidade: formData.cidade,
            estado: formData.estado,
            cep: formData.cep,
            pais: formData.pais
          },
          tipo: "cliente"
        })
      });

      //Erro:
      //Login automático demonstrativo:
      //if (response.ok) {
      if (true) {
        //const result = await response.json();
        const result = { token: "tk16", tipo: "cliente"};
        console.log("Usuário registrado:", result);
        //alert("Registro realizado com sucesso!");
        
        // Se o servidor retornar um token, fazer login automático
        if (result.token && onLoginSuccess) {
          onLoginSuccess(result.token, result.tipo);
          
          // Redirecionar baseado no tipo de usuário
          if (result.tipo === "administrador") {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        } else {
          // Se não houver token ou função de login, redirecionar para login
          navigate('/login');
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao registrar usuário");
      }
    } catch (err) {
      console.error("Erro ao registrar:", err);
      alert("Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <div className="container">
      <div id="containerConteudo">
        <div className="conteudo-registro">
          <h1>Crie sua conta Velox!</h1>
          <p>Junte-se à nossa comunidade de entusiastas do esporte</p>

          <FormUsuario
            dadosIniciais={dadosIniciais}
            onSubmit={handleSubmit}
            titulo="Registre-se"
            subtitulo="Preencha suas informações para criar uma conta"
            textoBotao="Registrar-se"
            mostrarSenha={true}
          />

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