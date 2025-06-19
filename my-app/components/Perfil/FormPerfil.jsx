import { useState, useEffect } from 'react';
import './FormPerfil.css';

function FormPerfil({
  dadosIniciais = {
    tipo: "cliente",
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
  onSubmit,
  onSair,
  tipoUsuario
}) {
  const [formData, setFormData] = useState(dadosIniciais);
  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  });
  const [errosSenha, setErrosSenha] = useState({});

  useEffect(() => {
    setFormData(dadosIniciais);
  }, [dadosIniciais]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSenhaChange = (e) => {
    const { name, value } = e.target;
    setSenhaData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa erros quando o usuário começa a digitar
    if (errosSenha[name]) {
      setErrosSenha(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validarSenhas = () => {
    const novosErros = {};

    // Se algum campo de senha foi preenchido, todos são obrigatórios
    const algumCampoSenhaPreenchido = senhaData.senhaAtual || senhaData.novaSenha || senhaData.confirmarSenha;

    if (algumCampoSenhaPreenchido) {
      if (!senhaData.senhaAtual) {
        novosErros.senhaAtual = "Senha atual é obrigatória para alterar a senha";
      }

      if (!senhaData.novaSenha) {
        novosErros.novaSenha = "Nova senha é obrigatória";
      }

      if (!senhaData.confirmarSenha) {
        novosErros.confirmarSenha = "Confirmação de senha é obrigatória";
      } else if (senhaData.novaSenha !== senhaData.confirmarSenha) {
        novosErros.confirmarSenha = "As senhas não coincidem";
      }
    }

    setErrosSenha(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valida as senhas
    if (!validarSenhas()) {
      return;
    }

    // Prepara os dados para envio
    const dadosParaEnvio = { ...formData };
    
    // Se há dados de senha, inclui eles
    if (senhaData.senhaAtual && senhaData.novaSenha) {
      dadosParaEnvio.senhaAtual = senhaData.senhaAtual;
      dadosParaEnvio.novaSenha = senhaData.novaSenha;
      dadosParaEnvio.confirmarSenha = senhaData.confirmarSenha;
    }

    onSubmit(dadosParaEnvio);
  };

  return (
    <div className="form-perfil">
      <div className="cabecalho-perfil">
        <h1 className="titulo-perfil">Minha conta</h1>
        <p className="subtitulo-perfil">Gerencie seu perfil</p>
      </div>
      
      <div className="container-perfil">
        <div className="conteudo-perfil">
          <div className="cabecalho-card">
            <h2 className="titulo-secao-perfil">Informações do perfil</h2>
            <div className="tipo-usuario">
              <strong>Tipo: {tipoUsuario === 'cliente' ? 'Cliente' : 'Administrador'}</strong>
            </div>
          </div>

          <form className="formulario-perfil" onSubmit={handleSubmit}>
            {/* Campo para nome */}
            <div className="grupo-campo-perfil">
              <label className="label-campo-perfil" htmlFor="nome">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="input-campo-perfil"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campo para email */}
            <div className="grupo-campo-perfil">
              <label className="label-campo-perfil" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-campo-perfil"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campo para telefone */}
            <div className="grupo-campo-perfil">
              <label className="label-campo-perfil" htmlFor="telefone">
                Número de telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                className="input-campo-perfil"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>

            {/* Seção de endereço */}
            <div className="secao-endereco-perfil">
              <h3 className="titulo-endereco">Endereço</h3>
              
              {/* Campo para rua */}
              <div className="grupo-campo-perfil">
                <label className="label-campo-perfil" htmlFor="rua">
                  Rua
                </label>
                <input
                  type="text"
                  id="rua"
                  name="rua"
                  className="input-campo-perfil"
                  value={formData.rua}
                  onChange={handleChange}
                />
              </div>

              {/* Linha com campos cidade e estado */}
              <div className="linha-campos-perfil">
                <div className="grupo-campo-perfil">
                  <label className="label-campo-perfil" htmlFor="cidade">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    className="input-campo-perfil"
                    value={formData.cidade}
                    onChange={handleChange}
                  />
                </div>

                <div className="grupo-campo-perfil">
                  <label className="label-campo-perfil" htmlFor="estado">
                    Estado
                  </label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    className="input-campo-perfil"
                    value={formData.estado}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Linha com campos CEP e país */}
              <div className="linha-campos-perfil">
                <div className="grupo-campo-perfil">
                  <label className="label-campo-perfil" htmlFor="cep">
                    CEP
                  </label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    className="input-campo-perfil"
                    value={formData.cep}
                    onChange={handleChange}
                  />
                </div>

                <div className="grupo-campo-perfil">
                  <label className="label-campo-perfil" htmlFor="pais">
                    País
                  </label>
                  <input
                    type="text"
                    id="pais"
                    name="pais"
                    className="input-campo-perfil"
                    value={formData.pais}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Seção para alteração de senha */}
            <div className="secao-senha-perfil">
              <h3 className="titulo-senha">Alterar Senha</h3>
              
              <div className="linha-senha-dupla">
                {/* Campo para senha atual */}
                <div className="grupo-campo-perfil">
                  <label className="label-campo-perfil" htmlFor="senhaAtual">
                    Senha atual
                  </label>
                  <input
                    type="password"
                    id="senhaAtual"
                    name="senhaAtual"
                    className={`input-campo-perfil ${errosSenha.senhaAtual ? 'erro' : ''}`}
                    value={senhaData.senhaAtual}
                    onChange={handleSenhaChange}
                    placeholder="Digite sua senha atual"
                  />
                  {errosSenha.senhaAtual && (
                    <span className="mensagem-erro">{errosSenha.senhaAtual}</span>
                  )}
                </div>

                {/* Campo para nova senha */}
                <div className="grupo-campo-perfil">
                  <label className="label-campo-perfil" htmlFor="novaSenha">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    id="novaSenha"
                    name="novaSenha"
                    className={`input-campo-perfil ${errosSenha.novaSenha ? 'erro' : ''}`}
                    value={senhaData.novaSenha}
                    onChange={handleSenhaChange}
                    placeholder="Digite a nova senha"
                  />
                  {errosSenha.novaSenha && (
                    <span className="mensagem-erro">{errosSenha.novaSenha}</span>
                  )}
                </div>
              </div>

              {/* Campo para confirmação da nova senha */}
              <div className="grupo-campo-perfil">
                <label className="label-campo-perfil" htmlFor="confirmarSenha">
                  Confirmação de senha
                </label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  className={`input-campo-perfil ${errosSenha.confirmarSenha ? 'erro' : ''}`}
                  value={senhaData.confirmarSenha}
                  onChange={handleSenhaChange}
                  placeholder="Confirme a nova senha"
                />
                {errosSenha.confirmarSenha && (
                  <span className="mensagem-erro">{errosSenha.confirmarSenha}</span>
                )}
              </div>
            </div>

            {/* Botões para salvar mudanças e sair */}
            <div className="acoes-perfil">
              <button type="submit" className="botao-salvar">
                Salvar mudanças
              </button>
              <button type="button" className="botao-sair" onClick={onSair}>
                Sair
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormPerfil;