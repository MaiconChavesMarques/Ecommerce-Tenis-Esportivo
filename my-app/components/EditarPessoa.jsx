import { useNavigate } from 'react-router-dom';
import './EditarPessoa.css';
import FormEditarConta from './FormEditarConta';

function EditarPessoa({ 
  dadosPessoa, 
  onLimparEdicao, 
  onAdicionarPessoa, 
  onAtualizarPessoa 
}) {
  const navigate = useNavigate();

  const handleSalvar = async (dadosFormulario) => {
    if (!dadosPessoa) return;
    
    const acao = dadosPessoa._acao;
    
    // Monta os dados para salvar
    const pessoaParaSalvar = {
      ...dadosFormulario,
      ativo: acao === 'adicionar' ? true : dadosPessoa.ativo,
      // Para edição, mantém o token original; para adição, será gerado no backend
      token: acao === 'editar' ? dadosPessoa.token : undefined
    };

    // Se for edição e senha estiver vazia, remove a senha
    if (acao === 'editar' && !dadosFormulario.senha?.trim()) {
      delete pessoaParaSalvar.senha;
    }

    // Endpoint baseado no tipo
    const endpoint = pessoaParaSalvar.tipo === 'administrador' ? '/api/administradores' : '/api/clientes';

    //Demonstração:
    // Atualiza a lista no componente pai
    if (acao === 'adicionar') {
      // Para adição, gera um token temporário (normalmente seria feito no backend)
      const tokenTemporario = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const pessoaComToken = { ...pessoaParaSalvar, token: tokenTemporario };
      onAdicionarPessoa(pessoaComToken);
    } else {
      onAtualizarPessoa(pessoaParaSalvar);
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pessoaParaSalvar,
          acao: acao
        })
      });

      if (response.ok) {
        console.log(`Pessoa ${acao === 'adicionar' ? 'adicionada' : 'editada'} com sucesso`);
        
        // Limpa os dados de edição
        onLimparEdicao();
        
        // Volta para a página anterior
        navigate(-1);
      } else {
        //alert('Erro ao salvar. Tente novamente.');
        //Erro:
        // Limpa os dados de edição
        onLimparEdicao();
        
        // Volta para a página anterior
        navigate(-1);
      }
    } catch (error) {
      console.error('Erro:', error);
      //alert('Erro ao salvar. Verifique sua conexão.');
      //Erro:
        // Limpa os dados de edição
        onLimparEdicao();
        
        // Volta para a página anterior
        navigate(-1);
    }
  };

  const handleCancelar = () => {
    // Limpa os dados de edição e volta
    onLimparEdicao();
    navigate(-1);
  };

  // Se não há dados da pessoa (acesso direto à URL ou dados não foram passados)
  if (!dadosPessoa) {
    return (
      <div className="container-editar">
        <div className="container-conteudo-editar">
          <div className="erro-acesso">
            <h2>Acesso Negado</h2>
            <p>Esta página só pode ser acessada através do painel administrativo.</p>
            <button 
              className="btn-erro"
              onClick={() => navigate('/admin')}
            >
              Voltar ao Painel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepara os dados iniciais para o formulário
  const dadosIniciais = {
    tipo: dadosPessoa.tipo || "cliente",
    nome: dadosPessoa.nome || "",
    email: dadosPessoa.email || "",
    senha: "",
    telefone: dadosPessoa.telefone || "",
    rua: dadosPessoa.rua || "",
    cidade: dadosPessoa.cidade || "",
    estado: dadosPessoa.estado || "",
    cep: dadosPessoa.cep || "",
    pais: dadosPessoa.pais || "",
    token: dadosPessoa.token || "" // Inclui o token nos dados iniciais
  };

  return (
    <div className="container-editar">
      <FormEditarConta
        dadosIniciais={dadosIniciais}
        onSubmit={handleSalvar}
        onCancel={handleCancelar}
        mostrarTipo={true}
        acao={dadosPessoa._acao}
      />
    </div>
  );
}

export default EditarPessoa;