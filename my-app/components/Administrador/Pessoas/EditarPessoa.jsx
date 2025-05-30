// Importa hook para navegação entre rotas
import { useNavigate } from 'react-router-dom';
// Importa arquivo CSS específico deste componente
import './EditarPessoa.css';
// Importa componente do formulário de edição
import FormEditarConta from './FormEditarConta';

// Componente principal para editar pessoa, recebe props com dados e callbacks
function EditarPessoa({ 
  dadosPessoa, 
  onLimparEdicao, 
  onAdicionarPessoa, 
  onAtualizarPessoa 
}) {
  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Função para salvar os dados do formulário
  const handleSalvar = async (dadosFormulario) => {
    // Se não houver dados da pessoa, não faz nada
    if (!dadosPessoa) return;
    
    // Define ação (editar ou adicionar)
    const acao = dadosPessoa._acao;
    
    // Monta os dados para salvar, mantendo token original para edição
    const pessoaParaSalvar = {
      ...dadosFormulario,
      estadoConta: dadosFormulario.estadoConta, // Usa o valor atual do formulário
      token: acao === 'editar' ? dadosPessoa.token : undefined // Token só para edição
    };

    // Se estiver editando e senha estiver vazia, remove a senha para não alterar
    if (acao === 'editar' && !dadosFormulario.senha?.trim()) {
      delete pessoaParaSalvar.senha;
    }

    // Define o endpoint da API baseado no tipo da pessoa
    const endpoint = pessoaParaSalvar.tipo === 'administrador' ? '/api/administradores' : '/api/clientes';

    // Atualiza a lista no componente pai dependendo da ação
    if (acao === 'adicionar') {
      // Gera um token temporário para a nova pessoa (normalmente backend faz isso)
      const tokenTemporario = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const pessoaComToken = { ...pessoaParaSalvar, token: tokenTemporario };
      onAdicionarPessoa(pessoaComToken);
    } else {
      // Atualiza pessoa existente
      onAtualizarPessoa(pessoaParaSalvar);
    }

    try {
      // Envia os dados para o backend via fetch com método POST
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pessoaParaSalvar,
          acao: acao
        })
      });

      // Se a resposta for OK, sucesso
      if (response.ok) {
        console.log(`Pessoa ${acao === 'adicionar' ? 'adicionada' : 'editada'} com sucesso`);
        
        // Limpa dados de edição no estado pai
        onLimparEdicao();
        
        // Navega para a página anterior
        navigate(-1);
      } else {
        // Caso erro, limpa dados e volta (comentado alerta)
        //alert('Erro ao salvar. Tente novamente.');
        onLimparEdicao();
        navigate(-1);
      }
    } catch (error) {
      // Em caso de erro na requisição, loga no console e trata igual ao erro acima
      console.error('Erro:', error);
      //alert('Erro ao salvar. Verifique sua conexão.');
      onLimparEdicao();
      navigate(-1);
    }
  };

  // Função para cancelar edição, limpa dados e retorna página anterior
  const handleCancelar = () => {
    onLimparEdicao();
    navigate(-1);
  };

  // Se não existem dados da pessoa, mostra mensagem de acesso negado
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

  // Prepara os dados iniciais para o formulário, usando valores de dadosPessoa ou padrões
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
    token: dadosPessoa.token || "", // Token usado no formulário para edição
    estadoConta: dadosPessoa.estadoConta || "ativo" // Status da conta padrão "ativo"
  };

  // Renderiza o componente de formulário com os dados iniciais e handlers
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

// Exporta o componente para uso em outros módulos
export default EditarPessoa;
