// Importa hooks do React e função de navegação do React Router
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importa os arquivos de estilo
import '../Pessoas/EditarPessoa.css';
import './EditarProduto.css';

// Componente EditarProduto recebe props de dados e funções de controle
function EditarProduto({ 
  dadosProduto, 
  onLimparEdicao, 
  onAdicionarProduto, 
  onAtualizarProduto 
}) {
  const navigate = useNavigate();
  
  // Estado para armazenar dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    imagem: '',
    descricao: '',
    preco: '',
    quantidade: [0, 0, 0, 0, 0, 0, 0] // Array de quantidades por tamanho
  });

  // Atualiza o estado formData ao receber dadosProduto por props
  useEffect(() => {
    if (dadosProduto) {
      setFormData({
        nome: dadosProduto.nome || '',
        imagem: dadosProduto.imagem || '',
        descricao: dadosProduto.descricao || '',
        preco: dadosProduto.preco || '',
        quantidade: dadosProduto.quantidade || [0, 0, 0, 0, 0, 0, 0]
      });
    }
  }, [dadosProduto]);

  // Atualiza campos do formulário (exceto quantidade)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Atualiza quantidade de estoque por tamanho
  const handleQuantidadeChange = (index, valor) => {
    setFormData(prev => {
      const novaQuantidade = [...prev.quantidade];
      novaQuantidade[index] = parseInt(valor) || 0;
      return {
        ...prev,
        quantidade: novaQuantidade
      };
    });
  };

  // Função para salvar produto (adicionar ou atualizar)
  const handleSalvar = async (e) => {
    e.preventDefault();
    
    if (!dadosProduto) return;
    
    const acao = dadosProduto._acao;
    
    // Validações básicas antes de enviar
    if (!formData.nome.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    
    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      alert('Preço deve ser maior que zero');
      return;
    }

    // Monta objeto com dados para envio
    const produtoParaSalvar = {
      nome: formData.nome.trim(),
      imagem: formData.imagem.trim(),
      descricao: formData.descricao.trim(),
      preco: parseFloat(formData.preco),
      quantidade: formData.quantidade
    };

    // Se for edição, mantém o ID original
    if (acao === 'editar' && dadosProduto.id) {
      produtoParaSalvar.id = dadosProduto.id;
    }

    // Chama função de adicionar ou atualizar no componente pai
    if (acao === 'adicionar') {
      onAdicionarProduto(produtoParaSalvar);
    } else {
      onAtualizarProduto(produtoParaSalvar);
    }

    try {
      // Envia os dados para a API
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...produtoParaSalvar,
          acao: acao
        })
      });

      if (response.ok) {
        // Log de sucesso no console
        console.log(`Produto ${acao === 'adicionar' ? 'adicionado' : 'editado'} com sucesso`);
        // Limpa os dados de edição
        onLimparEdicao();
        // Volta para a página anterior
        navigate(-1);
      } else {
        // Caso de erro — ainda assim limpa e volta
        onLimparEdicao();
        navigate(-1);
      }
    } catch (error) {
      // Log de erro
      console.error('Erro:', error);
      // Em caso de exceção, limpa e volta
      onLimparEdicao();
      navigate(-1);
    }
  };

  // Função para cancelar edição/adicionar e voltar
  const handleCancelar = () => {
    onLimparEdicao();
    navigate(-1);
  };

  // Se não houver dados do produto, bloqueia acesso e exibe mensagem
  if (!dadosProduto) {
    return (
      <div className="container-editar">
        <div className="container-conteudo-editar">
          <div className="erro-acesso">
            <h2>Acesso Negado</h2>
            <p>Esta página só pode ser acessada através do painel de estoque.</p>
            <button 
              className="btn-erro"
              onClick={() => navigate('/admin/estoque')}
            >
              Voltar ao Estoque
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Array com os tamanhos disponíveis
  const tamanhos = [38, 39, 40, 41, 42, 43, 44];
  // Determina ação (editar ou adicionar)
  const acao = dadosProduto._acao;
  
  // Textos personalizados para cada ação
  const textos = {
    editar: {
      titulo: 'Editar produto',
      subtitulo: 'Atualize as informações do produto',
      icone: '🔄 Atualizar produto Velox!',
      botao: 'Atualizar produto'
    },
    adicionar: {
      titulo: 'Adicionar produto',
      subtitulo: 'Cadastre um novo produto',
      icone: '➕ Novo produto Velox!',
      botao: 'Adicionar produto'
    }
  };

  // Define os textos ativos com base na ação
  const textosAtivos = textos[acao] || textos.editar;

  // Renderização do componente
  return (
    <div className="container-editar">
      <div className="container-conteudo-editar">
        <div className="cabecalho-editar">
          <div className="titulo-pagina">
            <h1>{textosAtivos.titulo}</h1>
            <span className="subtitulo">{textosAtivos.subtitulo}</span>
          </div>
        </div>

        <div className="conteudo-editar">
          <div className="formulario-wrapper">
            <form onSubmit={handleSalvar} className="formulario-produto">
              <div className="cabecalho-formulario">
                <div className="icone-novo-produto">
                  {textosAtivos.icone}
                </div>
              </div>

              {/* Campo Nome */}
              <div className="campo-formulario">
                <label className="label-campo">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="input-campo"
                  required
                />
              </div>

              {/* Campo Imagem */}
              <div className="campo-formulario">
                <label className="label-campo">URL da imagem</label>
                <input
                  type="text"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleInputChange}
                  className="input-campo"
                />
              </div>

              {/* Campo Descrição */}
              <div className="campo-formulario">
                <label className="label-campo">Descrição do produto</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={4}
                  className="textarea-campo"
                />
              </div>

              {/* Campo Preço */}
              <div className="campo-formulario">
                <label className="label-campo">Preço</label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="input-campo"
                  required
                />
              </div>

              {/* Estoque por tamanho */}
              <div className="secao-tamanhos">
                <h3 className="titulo-tamanhos">Estoque por Tamanho</h3>
                <div className="grid-tamanhos">
                  {tamanhos.map((tamanho, index) => (
                    <div key={tamanho} className="item-tamanho">
                      <span className="numero-tamanho">{tamanho}</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.quantidade[index] || ''}
                        onChange={(e) => handleQuantidadeChange(index, e.target.value)}
                        placeholder="0"
                        className="input-tamanho"
                      />
                    </div>
                  ))}
                </div>
                <div className="info-estoque">
                  {/* Exibe o total de itens somando todas as quantidades */}
                  <p>Total em estoque: {formData.quantidade.reduce((total, qtd) => total + (qtd || 0), 0)} unidades</p>
                </div>
              </div>

              {/* Botão de ação */}
              <div className="acoes-formulario">
                <button type="submit" className="btn-atualizar-produto">
                  {textosAtivos.botao}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exporta o componente
export default EditarProduto;
