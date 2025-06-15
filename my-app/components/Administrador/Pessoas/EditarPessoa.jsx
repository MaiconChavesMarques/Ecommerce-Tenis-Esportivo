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

  // FETCH POST - Função para criar nova pessoa
  async function criarPessoa(dadosPessoa) {
    try {
      const response = await fetch('http://localhost:3000/users/administrador/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...dadosPessoa,
          tipo: dadosPessoa.tipo
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar usuário');
      }

      const data = await response.json();
      console.log(`${dadosPessoa.tipo} criado com sucesso:`, data);
      
      return { sucesso: true, data };
      
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      return { sucesso: false, erro: error.message };
    }
  }

  // FETCH PUT - Função para atualizar pessoa existente
  async function atualizarPessoa(dadosPessoa) {
    console.log(dadosPessoa);
    try {
      const response = await fetch(`http://localhost:3000/users/administrador/users/${dadosPessoa.token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosPessoa)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar usuário');
      }

      const data = await response.json();
      console.log(`${dadosPessoa.tipo} atualizado com sucesso:`, data);
      
      return { sucesso: true, data };
      
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error);
      return { sucesso: false, erro: error.message };
    }
  }

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

    let resultado;

    try {
      if (acao === 'adicionar') {
        // Cria nova pessoa
        resultado = await criarPessoa(pessoaParaSalvar);
        
        if (resultado.sucesso) {
          // Atualiza estado local do componente pai com dados retornados do servidor
          onAdicionarPessoa(resultado.data);
          alert(`${pessoaParaSalvar.tipo} adicionado com sucesso!`);
        }
      } else {
        // Atualiza pessoa existente
        resultado = await atualizarPessoa(pessoaParaSalvar);
        
        if (resultado.sucesso) {
          // Atualiza estado local do componente pai com dados atualizados
          onAtualizarPessoa(resultado.data);
          alert(`${pessoaParaSalvar.tipo} atualizado com sucesso!`);
        }
      }

      if (resultado.sucesso) {
        // Limpa dados de edição no estado pai
        onLimparEdicao();
        // Navega para a página anterior
        navigate(-1);
      } else {
        // Mostra erro específico retornado pela API
        alert(`Erro ao ${acao === 'adicionar' ? 'adicionar' : 'atualizar'}: ${resultado.erro}`);
      }

    } catch (error) {
      // Em caso de erro na requisição, loga no console
      console.error('Erro inesperado:', error);
      alert('Erro inesperado. Verifique sua conexão e tente novamente.');
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