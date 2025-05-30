import { useState, useEffect } from 'react';
import './FormPerfil.css';

function FormPerfil({
  // Dados iniciais padrão para o formulário de perfil, incluindo tipo de usuário e informações pessoais
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
  onSubmit,  // Função chamada ao submeter o formulário
  onSair,    // Função chamada ao clicar no botão sair
  tipoUsuario // Tipo do usuário atual (cliente ou administrador)
}) {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState(dadosIniciais);

  // Atualiza o estado do formulário sempre que os dados iniciais mudam
  useEffect(() => {
    setFormData(dadosIniciais);
  }, [dadosIniciais]);

  // Atualiza o estado local ao mudar qualquer campo do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para lidar com o envio do formulário, chama onSubmit com os dados atuais
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
              {/* Exibe o tipo do usuário de forma legível */}
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
              <h3 className="titulo-senha">Senha</h3>
              
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
                    className="input-campo-perfil"
                    placeholder="Digite sua senha atual"
                  />
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
                    className="input-campo-perfil"
                    placeholder="Digite a nova senha"
                  />
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
                  className="input-campo-perfil"
                  placeholder="Confirme a nova senha"
                />
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
