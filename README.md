# 💬 Desafio backend BTG Pactual

## ✳️ Sobre

O **Desafio backend anota ai** é um desafio backend feito pela instituição.

---

## 🚀 Objetivo

A tarefa é desenvolver uma API usando Node.js para um sistema de gerenciamento de catálogo de produtos em um aplicativo de mercado. Você deve analisar e converter as seguintes histórias de usuário em rotas para o aplicativo:

Histórias de usuário:

Como usuário, desejo registrar um produto com seu proprietário, para que eu possa acessar seus dados no futuro (título, descrição, preço, categoria, ID do proprietário).

Como usuário, desejo registrar uma categoria com seu proprietário, para que eu possa acessar seus dados no futuro (título, descrição, ID do proprietário).

Como usuário, desejo associar um produto a uma categoria.

Como usuário, desejo atualizar os dados de um produto ou categoria.

Como usuário, desejo excluir um produto ou categoria do meu catálogo.

Um produto só pode ser associado a uma categoria por vez.

Suponha que produtos e categorias pertençam a apenas um proprietário.

Lembre-se de que este é um catálogo de produtos on-line, o que significa que haverá várias solicitações para edição de itens/categorias por segundo, bem como acesso ao ponto de extremidade de pesquisa do catálogo.

Considere o catálogo de produtos como uma compilação JSON de todas as categorias e itens disponíveis de propriedade de um usuário. Dessa forma, o ponto de extremidade de pesquisa do catálogo não precisa buscar informações do banco de dados.

Sempre que houver uma alteração no catálogo de produtos, publique essa alteração no tópico "catalog-emit" no serviço AWS SQS.

Implemente um consumidor que ouça as alterações do catálogo para um proprietário específico.

Quando o consumidor receber uma mensagem, pesquise no banco de dados o catálogo desse proprietário, gere o JSON do catálogo e publique-o em um bucket de serviço AWS S3.

Você precisa desenvolver este teste usando as seguintes tecnologias:

AWS SQS para as notificações de alteração do catálogo.
AWS S3 para armazenar o JSON do catálogo.
Node.js para o backend.
Express.js como a estrutura da web.

---

## 🛠 Ferramentas Utilizadas

- [Node](https://nodejs.dev)
- [Express](https://expressjs.com/pt-br/)
- [Mysql](https://www.mysql.com/)
- [Prisma](https://www.prisma.io/)
- [Jest](https://jestjs.io)

---

## 💻 Clonando o repositório

- Clone o projeto

  ```bash
  git clone https://github.com/filipedev040990/desafio-anota-ai
  ```

---

## 🏠 Adicionando variáveis de ambiente (.env)

Existe o arquivo `.env.example` com todas as variáveis utilizadas para rodar o sistema. Faça uma cópia desse arquivo e renomeie a cópia para `.env` antes de executar o comando para iniciar a aplicação.

---

## ▶️ Executando o projeto

- Execute o seguinte comando.

  ```bash
    docker compose up -d
  ```

- Utilize o comandos abaixo para verificar se os containers (order, rabbitmq, database) estão todos rodando.

  ```bash
    docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
  ```

- Utilize o comandos abaixo para acompanhar os logs do serviço order.
  ```bash
    docker logs -f desafio_anota_ai
  ```

---

## Dependências para a execução

Basta ter o docker instalado em sua máquina para executar os containers.

---

## Logs 🖥

Sempre que o serviço ler uma mensagem da fila, ele emitirá um log com informações sobre.
![alt text](image-2.png)

---

## 🧪 Testes:

- Rodar todos os testes
  ```bash
  npm t
  ```

---

## c Commits no projeto

1. Aplicar correções relacionadas à **Lint**;
2. Validação da mensagem de commit conforme as regras do [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/);

- Padrão no desenvolvimento de um card:
  > tipo(#numero_do_card): descrição em inglês (em letras minúsculas)
- Padrão de desenvolvimento não relacionado a cards
  > tipo(escopo): descrição em inglês (em letras minúsculas)

Exemplos de tipos:

- feat: introduz uma nova funcionalidade à base de código;
- fix: correção de um bug na base de código;
- build: Introduz uma mudança que afeta o build do sistema ou alguma dependência externa (exemplos de escopos: gulp, broccoli, npm);
- chore: atualização de ferramentas, configurações e bibliotecas
- ci: Introduz uma mudança aos arquivos e scripts de configuração do CI/CD (exemplos de escopos: Travis, Circle, BrowserStack, SauceLabs)
- docs: Alterações na documentação
- style: Introduz uma mudança que não afeta o significado do código (remoção de espaços em branco, formatação, ponto e virgula faltando, etc)
- refactor: Uma mudança no código que nem corrige um bug nem adiciona uma nova funcionalidade
- perf: Um mundança no código que melhora a performance
- test: Adicionar testes faltando ou corrigir testes existentes

Exemplos de commits válidos:

```bash
git commit -m "feat(#300): creating auth service"
git commit -m "fix(#30): correcting product type"
git commit -m "style(lint): removing some lint warnings"
git commit -m "docs(readme): removing deploy section from readme"
```

---
