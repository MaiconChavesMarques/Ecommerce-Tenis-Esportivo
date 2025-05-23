import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaixaLogin from '../components/CaixaLogin';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
/*
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
async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      const response = await fetch('/usuarios.json'); // acessa o arquivo local
      const usuarios = await response.json();
  
      const usuario = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );
  
      if (usuario) {
        onLoginSuccess(usuario.token, usuario.tipo); // atualiza estado no App
        if (usuario.tipo === "administrador") {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        alert("Login inválido.");
      }
    } catch (err) {
      console.error("Erro ao carregar dados locais:", err);
      alert("Erro ao acessar os dados de login.");
    }
  }

  return (
    <div className="container">
      <div id="containerConteudo">
        <div className="conteudo">
          <div className="identificador">
            <h2>Bem vindo à Velox!</h2>
          </div>
          <div className="parteTextual">
                <p>Fundada em 2010, a Velox começou com uma missão simples: fornecer aos atletas os melhores calçados possíveis. O que começou como uma pequena loja no centro da cidade cresceu e se tornou uma varejista líder em calçados esportivos, com a confiança de atletas profissionais e entusiastas do esporte cotidiano.</p>
                <br/>
                <p>Ao longo dos anos, firmamos parcerias com as principais marcas para oferecer a você tecnologia e designs de ponta. Nosso compromisso com a qualidade, o desempenho e a satisfação do cliente permanece no cerne de tudo o que fazemos.</p>
          </div>
        </div>

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