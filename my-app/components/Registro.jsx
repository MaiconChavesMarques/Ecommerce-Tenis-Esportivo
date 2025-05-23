import { useNavigate } from 'react-router-dom';
import './Registro.css';
import FormUsuario from './FormUsuario';

function Registro() {
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

      if (response.ok) {
        const result = await response.json();
        console.log("Usuário registrado:", result);
        alert("Registro realizado com sucesso!");
        navigate('/login');
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