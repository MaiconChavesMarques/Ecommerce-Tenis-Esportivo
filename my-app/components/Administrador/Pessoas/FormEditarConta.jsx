// Importa hooks useState e useEffect do React
import { useState, useEffect } from 'react';
// Importa arquivo CSS específico para este componente
import './FormEditarConta.css';

// Componente funcional que recebe props para renderizar formulário de edição/adicionar conta
function FormEditarConta({
  // Dados iniciais do formulário com valores padrão
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
    token: "",
    estadoConta: "ativo"
  },
  onSubmit,           // Função para chamar ao enviar o formulário
  mostrarTipo = true, // Flag para mostrar ou ocultar o campo tipo
  acao                // Ação que define se o formulário é para 'editar' ou 'adicionar'
}) {
  // Estado local que guarda os dados do formulário, inicializado com dadosIniciais
  const [formData, setFormData] = useState(dadosIniciais);

  // Atualiza o estado do formulário sempre que os dados iniciais mudarem externamente
  useEffect(() => {
    setFormData(dadosIniciais);
  }, [dadosIniciais]);

  // Função que trata alterações nos inputs, atualizando o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;  // Extrai nome e valor do input alterado
    console.log(name);                  // Log para depuração do campo modificado
    
    // Atualiza somente o campo específico dentro do estado formData
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função chamada no envio do formulário para evitar recarregamento e enviar dados ao pai
  const handleSubmit = (e) => {
    e.preventDefault();      // Previna comportamento padrão do form
    onSubmit(formData);      // Chama função externa com os dados do formulário
  };

  // Objeto que define textos diferentes para editar ou adicionar, usado para labels e botões
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

  // Seleciona textos ativos baseando-se na ação passada como prop, padrão para editar
  const textosAtivos = textos[acao] || textos.editar;
  
  return (
    <div className="form-editar-conta">
      {/* Título principal dinâmico */}
      <h1 className="titulo-principal">{textosAtivos.titulo}</h1>
      
      <div className="container-formulario">
        {/* Subtítulo do formulário */}
        <h2 className="titulo-formulario">{textosAtivos.subtitulo}</h2>
        {/* Aviso importante exibido acima do formulário */}
        <p className="aviso-importante">
          {textosAtivos.aviso}
        </p>
        
        {/* Formulário controlado */}
        <form className="formulario-editar" onSubmit={handleSubmit}>
          {/* Campo oculto para armazenar token, não visível para usuário */}
          <input
            type="hidden"
            name="token"
            value={formData.token}
          />

          {/* Renderiza campo 'tipo' condicionalmente */}
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
                {/* Opções possíveis para o tipo da conta */}
                <option value="cliente">Cliente</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          )}

          {/* Campo para nome, obrigatório */}
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

          {/* Campo para email, obrigatório */}
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

          {/* Campo para senha, com comportamento dinâmico no placeholder e obrigatoriedade */}
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
              required={acao === "adicionar"} // Apenas obrigatório para adicionar nova conta
            />
          </div>

          {/* Campo opcional para telefone */}
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

          {/* Campo para status da conta com opções Ativo/Inativo */}
          <div className="grupo-campo">
            <label className="label-campo" htmlFor="estadoConta">
              Status da Conta
            </label>
            <select
              id="estadoConta"
              name="estadoConta"
              className="select-campo"
              value={formData.estadoConta}
              onChange={handleChange}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          {/* Seção para endereço com campos específicos */}
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

            {/* Linha com dois campos lado a lado: cidade e estado */}
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

            {/* Linha com dois campos lado a lado: cep e país */}
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

          {/* Botão para enviar o formulário com texto dinâmico */}
          <button type="submit" className="botao-editar">
            {textosAtivos.botao}
          </button>
        </form>
      </div>
    </div>
  );
}

// Exporta o componente para uso em outras partes da aplicação
export default FormEditarConta;
