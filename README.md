# Gerenciador de Apostas Automatizado

## Descrição do Projeto

Este projeto automatiza o gerenciamento de apostas em loteria para um grupo de jogadores. 
Ele permite cadastrar concursos, registrar apostas via frontend e automatizar o processo de entrada das apostas no site oficial utilizando Selenium. 
O fluxo do sistema é composto por um backend em Node.js com MongoDB, um frontend para facilitar a criação das apostas e um script Python que executa a automação do processo de registro das apostas.

O projeto foi dividido em dois ambientes: Linux e Windows.

- No **Linux**, estou executando o backend dentro do WSL utilizando Docker.
- No **Windows**, executo o script Python com Selenium, devido à necessidade de uma interface gráfica.
  
Caso opte por rodar o script de automação em Linux, será necessário utilizar um driver do Selenium compatível com o sistema. 
No exemplo do projeto, utilizo o driver do Selenium para o Firefox.

## Arquitetura do Projeto

O sistema é dividido em três principais componentes:

- Backend (Node.js + MongoDB): API para gerenciar concursos e apostas.

- Frontend (HTML + CSS + JS): Interface para os jogadores criarem apostas de forma intuitiva.

- Script Python + Selenium: Automatiza o processo de entrada das apostas no site oficial.

Fluxo de funcionamento:

1. O usuário executa o script Python.

2. O script inicia o driver do Selenium e acessa a URL do frontend, permitindo que o usuário cadastre as apostas.

3. No frontend, o usuário configura as apostas e cria um novo concurso.

4. Após a confirmação da criação do concurso, o frontend envia as informações para o backend.

5. O backend realiza as validações, salva o concurso no MongoDB e retorna a confirmação para o frontend.

6. Enquanto o usuário interage com a página, o script Python monitora o frontend, aguardando uma tag específica que sinaliza o início da automatização.

7. Assim que a tag é detectada, o script Python acessa o site da Caixa Econômica e inicia o processo de registro das apostas automaticamente.

## Tecnologias Utilizadas

- Backend: Node.js, MongoDB

- Frontend: HTML, CSS e Javascript

- Automatização: Python, Selenium

## Requisitos

- **Docker** e **docker-compose** instalado e em execução (Linux).
- **Python** versão 3.8 ou superior configurado no ambiente (Windows).

## Download do projeto:

1. Clone o projeto

    ```
    git clone https://github.com/MayconAlvesdeAlmeida/lottery-automation.git
    ```

2. Acesse a pasta do projeto
    ```
    cd lottery-automation
    ```
    Note que há 02 pastas: backend e automation

> Observação: Copie a pasta **backend** para o seu ambiente Linux e a pasta **automation** para o ambiente Windows. 


## Configurando backend

1. Acesse a pasta backend
    ```
    cd backend
    ```

2. Verifique se o docker está sendo executado.
    ```
    sudo service docker start
    ```
3. Inicie a aplicação com o seguinte comando:
    ```
    docker compose up -d
    ```
4. Verifique se as aplicações estão em execução:
    ```
    docker compose ps
    ```

## Configurando a automação

1. Utilizando o cmd, acesse a pasta automation
    ```
    cd automation
    ```

2. Crie um ambiente virtual
    ```bash
    python3 -m venv .venv
    ```

3. Ative o ambiente virtual
    ```
    .venv\Scripts\activate
    ```

4. Instale as dependências do projeto
    ```
    pip install -r requirements.txt
    ```

5. Inicie a aplicação
    ```
    python start_app.py
    ```

## Criando as apostas

O Selenium irá acessar a página inicial do **frontend**

![Image](https://github.com/user-attachments/assets/73d899e2-1164-46f2-9a21-6246e5c12d4d)

>Devido ser o seu primeiro acesso, o banco de dados está sem registro.
>Por esse motivo não é possível fazer uma busca por um concurso de refêrencia.

1. Clique no botão de **Adicionar Apostas**

    Adicione o Nome do Apostador e escolhe 15 números.

    ![Image](https://github.com/user-attachments/assets/ddb4f267-a243-4962-8c62-c2fa8c19616c)

    Adicione quantos apostadores quiser.

2. Preencha o formulário do **Novo Concurso** informando número e data.

    ![Image](https://github.com/user-attachments/assets/49a060d7-a6b9-492f-be2f-475dd2f927bc)

3. Confirme os dados e clique em **Confirmar**

4. A automação irá inserir suas apostas no site da Caixa

5. Agora basta logar em sua conta e pagar as apostas.

6. Para finalizar, acesse o cmd e pressione qualquer tecla.

## Contato

Criado por Maycon Almeida. Entre em contato para dúvidas e sugestões.
