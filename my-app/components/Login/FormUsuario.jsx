import { useState, useEffect } from 'react';
import './FormUsuario.css';

function FormUsuario({
  // Dados iniciais do formulário com valores padrão vazios
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
  // Título do formulário
  titulo = "Registre-se",
  // Subtítulo do formulário
  subtitulo = "Preencha suas informações para criar uma conta",
  // Texto do botão de envio
  textoBotao = "Registrar-se",
  // Função que será chamada ao enviar o formulário
  onSubmit,
  // Booleano para controlar se o campo senha deve ser exibido e obrigatório
  mostrarSenha = true
}) {
  // Estado local para armazenar os dados do formulário
  const [formData, setFormData] = useState(dadosIniciais);

  // Atualiza o estado do formulário quando os dados iniciais mudam
  useEffect(() => {
    setFormData(dadosIniciais);
    console.log("Dados Iniciais mudou");
  }, [dadosIniciais]);

  // Função para atualizar o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value, // Atualiza o campo específico pelo id do input
    }));
  };

  // Função para tratar o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão de reload da página
    onSubmit(formData); // Chama a função onSubmit passando os dados do formulário
  };

  return (
    <div className="caixa-formulario">
      {/* Título do formulário */}
      <h2>{titulo}</h2>
      {/* Subtítulo do formulário */}
      <p>{subtitulo}</p>

      <form onSubmit={handleSubmit}>
        {/* Campo para o nome, obrigatório se mostrar senha */}
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

        {/* Campo para o email, obrigatório se mostrar senha */}
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

        {/* Campo para senha, exibido somente se mostrarSenha for true */}
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

        {/* Campo para telefone, opcional */}
        <div className="campo">
          <label htmlFor="telefone">Número de telefone</label>
          <input
            type="tel"
            id="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        {/* Seção de endereço */}
        <div className="endereco-section">
          <h3>Endereço</h3>

          {/* Campo rua */}
          <div className="campo">
            <label htmlFor="rua">Rua</label>
            <input
              type="text"
              id="rua"
              value={formData.rua}
              onChange={handleChange}
            />
          </div>

          {/* Linha com campos cidade e estado lado a lado */}
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

          {/* Linha com campos CEP e país lado a lado */}
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

        {/* Botão para enviar o formulário com texto customizável */}
        <button type="submit" className="btn-formulario">
          {textoBotao}
        </button>
      </form>
    </div>
  );
}

export default FormUsuario;
