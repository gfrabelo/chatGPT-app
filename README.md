# ChatGPT Clone com Angular e OpenAI API

Este projeto é uma réplica simples do ChatGPT, utilizando **Angular 17** e a **API da OpenAI**. Ele serve como estudo para integração de APIs de IA em uma aplicação web usando Angular.

## Funcionalidades

- Envio de perguntas e exibição das respostas da IA.
- Animação de "IA pensando" com pontos suspensos.
- Texto exibido dinamicamente, letra por letra.
- Avatares personalizados para o usuário e o bot.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v14+)
- [Angular CLI](https://angular.io/cli)
- Chave da API da [OpenAI](https://beta.openai.com/signup/)

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/chatgpt-angular-clone.git
    ```

2. Acesse o diretório do projeto:

    ```bash
    cd chatgpt-angular-clone
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Adicione sua chave da OpenAI em um arquivo `.env`:

    ```bash
    OPENAI_API_KEY=sua-chave-aqui
    ```

5. Inicie o servidor:

    ```bash
    ng serve
    ```

    Acesse a aplicação em `http://localhost:4200`.

## Uso

- Envie perguntas pelo campo de input e receba respostas da IA em tempo real.

## Tecnologias

- **Angular 17**
- **TypeScript**
- **SCSS**
- **OpenAI API**

## Contribuições

Contribuições são bem-vindas! Abra uma issue ou envie um pull request com melhorias.

## Licença

Este projeto está licenciado sob a licença MIT.
