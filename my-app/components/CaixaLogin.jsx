import React from 'react';
import './CaixaLogin.css';

const CaixaLogin = ({ email, senha, onEmailChange, onSenhaChange, onSubmit }) => {
  return (
    <form className="caixaLogin" onSubmit={onSubmit}>
      <div className="descricaoCaixa">
        <h2>Bem-vindo de volta!</h2>
        <p>Entre com suas credenciais</p>
      </div>

      <div className="caixaTexto">
        <p>Email</p>
        <input
          type="text"
          className="entradaTexto"
          value={email}
          onChange={onEmailChange}
        />
      </div>

      <div className="caixaTexto">
        <p>Senha</p>
        <input
          type="password"
          className="entradaTexto"
          value={senha}
          onChange={onSenhaChange}
        />
      </div>

      <button type="submit" className="entrar">Entrar</button>

      <div className="semLogin">
        <p className="naotemConta">Não tem uma conta?</p>
        <div className="novoRegistro">
          <div id="direcionamento">
            <img src="imagens/adicionar-usuario21.png" width="20px" alt="Registrar" />
            <p>Registre-se agora</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CaixaLogin;