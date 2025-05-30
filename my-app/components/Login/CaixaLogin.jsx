import React from 'react';
import './CaixaLogin.css';
import { Navigate, useNavigate } from 'react-router-dom';

const CaixaLogin = ({ email, senha, onEmailChange, onSenhaChange, onSubmit }) => {
  const navigate = useNavigate();

  // Função para navegar para a página de registro
  const handleRegistro = () => {
    navigate("/registro");
  };
  
  return (
    <form className="caixaLogin" onSubmit={onSubmit}>
      <div className="descricaoCaixa">
        {/* Título da caixa de login */}
        <h2>Bem-vindo de volta!</h2>
        {/* Subtítulo incentivando o usuário a entrar com suas credenciais */}
        <p>Entre com suas credenciais</p>
      </div>

      <div className="caixaTexto">
        {/* Label do campo email */}
        <p>Email</p>
        {/* Input controlado para o email */}
        <input
          type="text"
          className="entradaTexto"
          value={email}
          onChange={onEmailChange}
        />
      </div>

      <div className="caixaTexto">
        {/* Label do campo senha */}
        <p>Senha</p>
        {/* Input controlado para a senha */}
        <input
          type="password"
          className="entradaTexto"
          value={senha}
          onChange={onSenhaChange}
        />
      </div>

      {/* Botão para enviar o formulário de login */}
      <button type="submit" className="entrar">Entrar</button>

      <div className="semLogin">
        {/* Texto informativo para quem não tem conta */}
        <p className="naotemConta">Não tem uma conta?</p>
        <div className="novoRegistro">
          {/* Área clicável para direcionar à página de registro */}
          <div id="direcionamento" onClick={handleRegistro}>
            {/* Ícone de adicionar usuário */}
            <img src="imagens/adicionar-usuario21.png" width="20px" alt="Registrar" />
            {/* Texto para registro */}
            <p>Registre-se agora</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CaixaLogin;
