import { useState, useEffect } from 'react';
import './FormEditarConta.css';

function FormEditarConta({
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
    pais: "",
    token: ""
  },
  onSubmit,
  mostrarTipo = true,
  acao
}) {
  const [formData, setFormData] = useState(dadosIniciais);

  useEffect(() => {
    setFormData(dadosIniciais);
  }, [dadosIniciais]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Determina os textos baseado na ação
  const textos = {
    editar: {
      titulo: "Editando conta Velox!",
      subtitulo: "Editar conta",
      botao: "Editar conta",
      aviso: "IMPORTANTE: O tipo da conta deve ser editado com cuidado para evitar qualquer engano!"
    },
    adicionar: {
      titulo: "Adicionando nova conta Velox!",
      subtitulo: "Adicionar conta",
      botao: "Adicionar conta",
      aviso: "IMPORTANTE: Escolha o tipo da conta com cuidado!"
    }
  };

  const textosAtivos = textos[acao] || textos.editar;
  
  return (
    <div className="form-editar-conta">
      <h1 className="titulo-principal">{textosAtivos.titulo}</h1>
      
      <div className="container-formulario">
        <h2 className="titulo-formulario">{textosAtivos.subtitulo}</h2>
        <p className="aviso-importante">
          {textosAtivos.aviso}
        </p>
        
        <form className="formulario-editar" onSubmit={handleSubmit}>
          {/* Campo oculto para o token */}
          <input
            type="hidden"
            name="token"
            value={formData.token}
          />

          {mostrarTipo && (
            <div className="grupo-campo">
              <label className="label-campo obrigatorio" htmlFor="tipo">
                Tipo * (Administrador ou Cliente)
              </label>
              <select
                id="tipo"
                name="tipo"
                className="select-campo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="cliente">Cliente</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          )}

          <div className="grupo-campo">
            <label className="label-campo obrigatorio" htmlFor="nome">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="input-campo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grupo-campo">
            <label className="label-campo obrigatorio" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input-campo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grupo-campo">
            <label className="label-campo obrigatorio" htmlFor="senha">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              className="input-campo"
              value={formData.senha}
              onChange={handleChange}
              placeholder={
                acao === "adicionar" 
                  ? "Digite a senha para a nova conta" 
                  : "Digite uma nova senha ou deixe em branco para manter a atual"
              }
              required={acao === "adicionar"} // Obrigatório apenas ao adicionar
            />
          </div>

          <div className="grupo-campo">
            <label className="label-campo" htmlFor="telefone">
              Número de telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              className="input-campo"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="secao-endereco">
            <h3 className="titulo-secao">Endereço</h3>
            
            <div className="grupo-campo">
              <label className="label-campo" htmlFor="rua">
                Rua
              </label>
              <input
                type="text"
                id="rua"
                name="rua"
                className="input-campo"
                value={formData.rua}
                onChange={handleChange}
              />
            </div>

            <div className="linha-campos">
              <div className="grupo-campo">
                <label className="label-campo" htmlFor="cidade">
                  Cidade
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  className="input-campo"
                  value={formData.cidade}
                  onChange={handleChange}
                />
              </div>

              <div className="grupo-campo">
                <label className="label-campo" htmlFor="estado">
                  Estado
                </label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  className="input-campo"
                  value={formData.estado}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="linha-campos">
              <div className="grupo-campo">
                <label className="label-campo" htmlFor="cep">
                  CEP
                </label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  className="input-campo"
                  value={formData.cep}
                  onChange={handleChange}
                />
              </div>

              <div className="grupo-campo">
                <label className="label-campo" htmlFor="pais">
                  País
                </label>
                <input
                  type="text"
                  id="pais"
                  name="pais"
                  className="input-campo"
                  value={formData.pais}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="botao-editar">
            {textosAtivos.botao}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormEditarConta;