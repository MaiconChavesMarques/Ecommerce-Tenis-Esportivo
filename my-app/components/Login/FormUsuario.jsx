import { useState, useEffect } from 'react';
import './FormUsuario.css';

function FormUsuario({
  dadosIniciais = {
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    rua: "",
    cidade: "",
    estado: "",
    cep: "",
    pais: ""
  },
  titulo = "Registre-se",
  subtitulo = "Preencha suas informações para criar uma conta",
  textoBotao = "Registrar-se",
  onSubmit,
  mostrarSenha = true
}) {
  const [formData, setFormData] = useState(dadosIniciais);

  useEffect(() => {
    setFormData(dadosIniciais);
    console.log("Dados Iniciais mudou");
  }, [dadosIniciais]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="caixa-formulario">
      <h2>{titulo}</h2>
      <p>{subtitulo}</p>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="nome">Nome {mostrarSenha && '*'}</label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={handleChange}
            required={mostrarSenha}
          />
        </div>

        <div className="campo">
          <label htmlFor="email">Email {mostrarSenha && '*'}</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required={mostrarSenha}
          />
        </div>

        {mostrarSenha && (
          <div className="campo">
            <label htmlFor="senha">Senha *</label>
            <input
              type="password"
              id="senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="campo">
          <label htmlFor="telefone">Número de telefone</label>
          <input
            type="tel"
            id="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div className="endereco-section">
          <h3>Endereço</h3>

          <div className="campo">
            <label htmlFor="rua">Rua</label>
            <input
              type="text"
              id="rua"
              value={formData.rua}
              onChange={handleChange}
            />
          </div>

          <div className="campos-linha">
            <div className="campo meio">
              <label htmlFor="cidade">Cidade</label>
              <input
                type="text"
                id="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
            </div>

            <div className="campo meio">
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                value={formData.estado}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="campos-linha">
            <div className="campo meio">
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                value={formData.cep}
                onChange={handleChange}
              />
            </div>

            <div className="campo meio">
              <label htmlFor="pais">País</label>
              <input
                type="text"
                id="pais"
                value={formData.pais}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-formulario">
          {textoBotao}
        </button>
      </form>
    </div>
  );
}

export default FormUsuario;