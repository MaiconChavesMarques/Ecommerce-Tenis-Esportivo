import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaixaLogin from './CaixaLogin';
import './Login.css';

function Login({ onLoginSuccess }) {
  // Estado para armazenar email digitado
  const [email, setEmail] = useState("");
  // Estado para armazenar senha digitada
  const [senha, setSenha] = useState("");
  // Hook para navegação programática
  const navigate = useNavigate();

  /*
  // Função para envio do formulário com chamada real a API
  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.token && data.tipo) {
        onLoginSuccess(data.token, data.tipo); // atualiza estado no App
        if (data.tipo === "administrador") {
          navigate('/administrador');
        } else {
          navigate('/home');
        }
      } else {
        alert("Login inválido.");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Erro de rede.");
    }
  }
  */

  // Função para envio do formulário usando arquivo local JSON para login fake
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Busca usuários do arquivo local usuarios.json
      const response = await fetch('/usuarios.json'); 
      const usuarios = await response.json();

      // Procura usuário que combine email e senha
      const usuario = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );

      if (usuario) {
        onLoginSuccess(usuario.token, usuario.tipo); // atualiza estado no App
        if (usuario.tipo === "administrador") {
          navigate('/admin'); // redireciona para página admin
        } else {
          navigate('/home'); // redireciona para página home
        }
      } else {
        alert("Login inválido."); // alerta se dados não conferem
      }
    } catch (err) {
      console.error("Erro ao carregar dados locais:", err);
      alert("Erro ao acessar os dados de login."); // alerta em caso de erro no fetch
    }
  }

  return (
    <div className="container">
      <div id="containerConteudo">
        <div className="conteudo">
          <div className="identificador">
            {/* Título da página de login */}
            <h2>Bem vindo à Velox!</h2>
          </div>
          <div className="parteTextual">
            {/* Texto informativo sobre a empresa */}
            <p>Fundada em 2010, a Velox começou com uma missão simples: fornecer aos atletas os melhores calçados possíveis. O que começou como uma pequena loja no centro da cidade cresceu e se tornou uma varejista líder em calçados esportivos, com a confiança de atletas profissionais e entusiastas do esporte cotidiano.</p>
            <br/>
            <p>Ao longo dos anos, firmamos parcerias com as principais marcas para oferecer a você tecnologia e designs de ponta. Nosso compromisso com a qualidade, o desempenho e a satisfação do cliente permanece no cerne de tudo o que fazemos.</p>
          </div>
        </div>

        {/* Componente CaixaLogin com props para controlar email, senha e envio */}
        <CaixaLogin
          email={email}
          senha={senha}
          onEmailChange={e => setEmail(e.target.value)}
          onSenhaChange={e => setSenha(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Login;
