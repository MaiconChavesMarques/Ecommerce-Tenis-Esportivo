# Loja de Tênis Esportivos

**Grupo 16:**

- Maicon Chaves Marques - 14593530
- Karl Cruz Altenhofen – 14585976

## 1. Requisitos

- O sistema deve ter 2 tipos de usuários: Clientes e Administradores. Os Administradores são responsáveis por cadastrar e gerenciar administradores, clientes e produtos/serviços oferecidos. A aplicação já vem com uma conta de administrador com login "admin" e senha "admin". Os Clientes são usuários que acessam o sistema para comprar produtos ou serviços.

- O cadastro de administradores deve incluir, no mínimo: nome, ID, telefone e e-mail.

- O cadastro de clientes deve incluir, no mínimo: nome, ID, endereço, telefone e e-mail.

- O cadastro de produtos/serviços deve incluir, no mínimo: nome, ID, foto, descrição, preço, quantidade em estoque e quantidade vendida.

- A loja pode vender produtos, serviços ou ambos (essa escolha fica a critério do desenvolvedor).

- Venda de Produtos/Serviços: Os produtos/serviços são selecionados, a quantidade é escolhida e eles são incluídos em um carrinho de compras. A compra é realizada usando um número de cartão de crédito (qualquer número é aceito pelo sistema). A quantidade vendida é subtraída do estoque e adicionada ao total de vendidos. Os carrinhos só são esvaziados no momento do pagamento ou pelo próprio cliente.

- Gerenciamento de Produtos/Serviços: Os administradores podem criar, atualizar, visualizar e excluir produtos e serviços.  

- Funcionalidade própria: A aplicação deve conter uma funcionalidade específica, pensada para a sua loja.  

- O sistema deve atender a requisitos de acessibilidade e oferecer boa usabilidade. Deve ser responsivo, ou seja, completar as tarefas atribuídas dentro de um tempo razoável.

## 2. Descrição do Projeto
A página retrata uma loja de tênis esportivos chamada Velox. Criamos uma logo e fizemos alguns modelos de tênis para complementar a visualização da aplicação web.

O diagrama que descreve o fluxo dá página foi feito no Figma e pode ser encontrado aqui: <a href="https://www.figma.com/design/2H69M86ifX8UPAAc8rZcsv/Diagrama-Velox?node-id=0-1&t=j3J7S76tPs53cWrc-1">Figma</a>
<br><br>
<img src="Imagens/Captura de tela de 2025-04-27 23-25-19.png">

Todos os Mockups estão também no figma com nomes iguais aqueles encontrados no fluxo da página, também há uma versão que representa o design esperado para dispositivos mobile, ambos aqui: <a href="https://www.figma.com/design/D2fQcvvULSxNALH4bq2tBS/Site-Velox?t=lchPhaToMe8u2zAN-1">Figma</a>
<br><br>
<img src="Imagens/Captura de tela de 2025-04-27 23-15-51.png">

## 3. Comentários sobre o Código
<!-- Insira comentários que ajudem a entender melhor a estrutura e as decisões do código. -->
Sem comentários.

## 4. Plano de Testes

Este projeto implementa o **Método 3** descrito no documento de especificação, utilizando **Armazenamento Local**.

## Visão Geral

Utilizamos um objeto JavaScript para salvar dados no formato **JSON**, que futuramente será lido e gravado no servidor na versão final. Atualmente, simulamos chamadas de servidor com uso de `fetch` assíncrono (`await fetch(...)`).

**Importante:** Muitas funcionalidades do site ainda rodam localmente de forma proposital, para melhor visualização e teste. Na versão final, o tratamento de buscas e a renderização de páginas será migrado para o servidor, deixando de fazer parte do código React.

## Testes

Todos os testes foram realizados manualmente, verificando o funcionamento completo de todas as páginas. Estes testes são **facilmente reprodutíveis** na versão atual.

Abaixo está a distribuição das páginas e os respectivos `fetch` utilizados:

## Estrutura e Chamadas

### Raiz
**Arquivo:** `App.jsx`  
```js
await fetch('/usuarios.json')
```
- Carrega dados do carrinho utilizando o token do usuário.

### Gerenciar Estoque
**Arquivo:** `DashEstoque.jsx`  
```js
await fetch(config.arquivo)
```
- Busca os produtos que estão no estoque.

### Gerenciar Clientes
**Arquivo:** `DashAdmin.jsx`  
```js
await fetch(currentConfig.arquivo)
```
- Busca usuários e verifica quais são clientes.

### Gerenciar Administradores
**Arquivo:** `DashAdmin.jsx`  
```js
await fetch(currentConfig.arquivo)
```
- Busca usuários e verifica quais são administradores.

### Editar Cliente
**Arquivo:** `EditarPessoa.jsx`  
```js
await fetch(config.arquivo);
```
- Envia para o servidor o cliente editado.
- Também envia objetos novos, editados ou excluídos.

### Editar Administrador
**Arquivo:** `EditarPessoa.jsx`  
```js
await fetch(config.arquivo);
```
- Envia para o servidor o administrador editado.
- Também envia objetos novos, editados ou excluídos.

### Carrinho
**Arquivo:** `Carrinho.jsx`  
```js
await fetch('bd.json')
```
- Busca os IDs do carrinho e carrega informações dos produtos.

**Arquivo:** `FormCartao.jsx`  
```js
await fetch('/api/comprar')
```
- Envia as compras com os respectivos valores para o servidor.

### Chat
**Arquivo:** `Chat.jsx`  
```js
await fetch('bd.json')
await fetch("https://openrouter.ai/api/v1/chat/completions")
```
- Usa o banco de dados para enviar dados à API do DeepSeek.
- Envia dados solicitando uma recomendação.

### Home
**Arquivo:** `Home.jsx`  
```js
await fetch('/bd.json');
```
- Busca os tênis do servidor para exibição na página inicial.

### Página de Login
**Arquivo:** `Login.jsx`  
```js
await fetch('/usuarios.json')
```
- Busca os dados do usuário e retorna um token.
- Preenche os IDs dos produtos que estão no carrinho.

### Página de Registro
**Arquivo:** `Registro.jsx`  
```js
await fetch('/api/usuarios')
```
- Envia os dados do novo usuário e recebe o token correspondente.

### Perfil
**Arquivo:** `Perfil.jsx`  
```js
await fetch('/usuarios.json');
```
- Busca as informações do usuário correspondente ao token.
- Também envia as atualizações ao servidor.

### Produto Detalhe
**Arquivo:** `ProdutoDetalhe.jsx`  
```js
await fetch('/bd.json');
```
- Busca as informações do produto selecionado.
- Também carrega produtos para recomendação relacionada.


## 5. Resultados dos Testes
### Resultados dos Testes

### Gerenciar Estoque
**Arquivo:** `DashEstoque.jsx`  
- Busca-se os produtos que estão no estoque.

![Gerenciar Estoque](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2020-06-24.png)

---

### Editar Produto
**Arquivo:** `EditarProduto.jsx`  
- Editar e adicionar um produto.
![Editar Produto](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-46-47.png)
![Editar Produto](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-47-10.png)

---

### Gerenciar Administradores e Clientes
**Arquivo:** `DashAdmin.jsx`  
- Busca-se os usuários e verifica-se quais deles são Administradores ou Clientes.
![Dash Admin](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-57-05.png)

---

### Editar Administrador ou Cliente
**Arquivo:** `EditarPessoa.jsx`  
- Editar e adicionar uma pessoa.
![Editar Pessoa](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-57-56.png)

---

### Carrinho
**Arquivo:** `Carrinho.jsx`  
- Pega os IDs que estão no carrinho do usuário e busca mais informações do servidor.
![Carrinho](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-18-42.png)
![Carrinho](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-19-21.png)
![Carrinho](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-14-03.png)

---

### Chat
**Arquivo:** `Chat.jsx`  
- Busca-se o banco de dados para enviar para a API do DeepSeek.  
- Envia-se os dados para o DeepSeek pedindo a recomendação.
![Chat](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-33-21.png)

---

### Home
**Arquivo:** `Home.jsx`  
- Busca os tênis do servidor para mostrar na página inicial.
![Home](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-24-28.png)

---

### Página de Login
**Arquivo:** `Login.jsx`  
- Busca-se os dados dos usuários, verifica o e-mail e a senha e retorna um token que representa o usuário.  
- Também preenche os IDs dos produtos que estão no carrinho do usuário.
![Login](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-01-47.png)

---

### Perfil
**Arquivo:** `Perfil.jsx`  
- Busca as informações do usuário com o token em uso.  
- Também há um `fetch` para enviar as atualizações ao servidor.
![Perfil](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2016-26-20.png)

---

### Produto Detalhe
**Arquivo:** `ProdutoDetalhe.jsx`  
- Busca as informações tanto do produto desejado quanto dos produtos relacionados.
![Produto Detalhe](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/Captura%20de%20tela%20de%202025-05-30%2017-05-53.png)

# 🧪 Testes de API - Sistema de Produtos e Usuários

Este projeto implementa rotas públicas, administrativas e de usuário para manipulação de produtos, autenticação e carrinho de compras.

---

## 👤 Usuários

### 🔹 POST `/login/entrar`
**Descrição:** Login de usuário.  
![POST /login/entrar](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste1.png)

---

### 🔹 POST `/login/registro`
**Descrição:** Cadastro de novo usuário.  
![POST /login/registro](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste2.png)

---

### 🔹 GET `/administrador/users`
**Descrição:** Lista de todos os usuários.  
![GET /admin/users](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste3.png)

---

### 🔹 POST `/administrador/users`
**Descrição:** Adiciona usuário manualmente.  
![POST /admin/users](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste4.png)

---

### 🔹 PUT `/administrador/users/:token`
**Descrição:** Edita dados de um usuário.  
![PUT /admin/users](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste5.png)

---

### 🔹 DELETE `/administrador/users/:token`
**Descrição:** Exclui usuário.  
![DELETE /admin/users](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste6.png)

---

### 🔹 GET `/perfil/:token`
**Descrição:** Busca dados do perfil do usuário autenticado.  
![GET /perfil](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste7.png)

---

### 🔹 PUT `/perfil/:token`
**Descrição:** Atualiza o perfil do usuário.  
![PUT /perfil](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste8.png)

---

### 🔹 GET `/user/carrinho/:token`
**Descrição:** Recupera os itens do carrinho do usuário autenticado.  
![GET /user/carrinho](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste9.png)

---

### 🔹 PUT `/user/carrinho/:token`
**Descrição:** Atualiza os itens do carrinho do usuário.  
![PUT /user/carrinho](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste10.png)

---

## 📦 Produtos

### 🔹 GET `/home`
**Descrição:** Página inicial com listagem de produtos.  
![GET /home](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste11.png)

---

### 🔹 GET `/productPage/:id_interno`
**Descrição:** Página de um produto específico.  
![GET /productPage](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste12.png)

---

### 🔹 POST `/carrinho`
**Descrição:** Retorna detalhes dos produtos no carrinho via array de IDs.  
![POST /carrinho](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste13.png)

---

### 🔹 GET `/administrador/products`
**Descrição:** Lista todos os produtos (admin).  
![GET /admin/products](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste14.png)

---

### 🔹 POST `/administrador/products`
**Descrição:** Cadastra um novo produto.  
![POST /admin/products](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste15.png)

---

### 🔹 PUT `/administrador/products/:id_interno`
**Descrição:** Atualiza um produto existente.  
![PUT /admin/products](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste16.png)

---

### 🔹 DELETE `/administrador/products/:id_interno`
**Descrição:** Remove um produto existente.  
![DELETE /admin/products](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste17.png)

---

### 🔹 POST `/pagamento`
**Descrição:** Processa o pagamento do carrinho.  
![POST /pagamento](https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo/blob/main/Imagens/teste18.png)

## 6. Procedimentos de Build
### Como Rodar o Projeto (React + Vite + Node.js/Express)

Siga os passos abaixo para rodar o projeto localmente.

---

### 1. Instale o Node.js (caso ainda não tenha)

```bash
sudo apt update
sudo apt install nodejs npm
```

> Recomendado: use o [nvm](https://github.com/nvm-sh/nvm) para instalar a versão mais recente do Node.js.

---

### 2. Clone o repositório

```bash
git clone https://github.com/MaiconChavesMarques/Ecommerce-Tenis-Esportivo.git
cd Ecommerce-Tenis-Esportivo
```

---

### 3. Instale as dependências

#### 3.1 Frontend

```bash
cd my-app
npm install
```

#### 3.2 Backend (servidor)

```bash
cd ../servidor
npm install
```

---

### 4. Rode o projeto localmente

#### 4.1 Frontend

```bash
cd ../my-app
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

#### 4.2 Backend

Abra outro terminal:

```bash
cd Ecommerce-Tenis-Esportivo/my-app/servidor/bin
node server.js
```

Servidor disponível em: [http://localhost:3000](http://localhost:3000)

---

### 5. Contas de Acesso

- **Administrador**  
  Email: a@gmail.com  
  Senha: 1

- **Cliente**  
  Email: b@gmail.com  
  Senha: 2

---

### 6. Observações

- No arquivo `my-app\components\Chat\chat.jsx`, substitua a **chave da API real**.  
  Remova o texto `"dilvan moreira"` e junte as partes sem deixar espaço.

## 7. Problemas Encontrados
Não foram encontrados problemas até o momento.

## 8. Comentários Finais
Sem comentários.
