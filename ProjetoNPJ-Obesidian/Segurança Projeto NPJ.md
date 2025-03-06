
## Backend
	Spring Security
	Criptografia simétrica com JWT
	Access e Refresh Token


## Frontend
Dado que sua aplicação utiliza uma API stateless e tokens armazenados no `localStorage`, aqui estão as melhores abordagens e boas práticas para gerenciar esses tokens com segurança e eficiência:

### 1. **Uso Controlado do LocalStorage**

- O `localStorage` é vulnerável a ataques XSS (Cross-Site Scripting). Como sua aplicação é privada e com poucas interações externas, o risco é reduzido, mas ainda assim, evite expor o token no console ou logs.
- Sempre valide e sanitize qualquer entrada de usuário para reduzir a superfície de ataque.

### 2. **Gerenciamento de Tokens**

- Criar um **módulo centralizado** (como o `GerenciaToken.js`) para encapsular todas as operações relacionadas aos tokens.
- Funções essenciais:
    - `getAccessToken()`: Recupera o access token do `localStorage`.
    - `getRefreshToken()`: Recupera o refresh token.
    - `validateToken()`: Verifica se o access token ainda é válido antes de cada requisição.
    - `refreshAccessToken()`: Se o access token expirou, utiliza o refresh token para obter um novo.
    - `removeTokens()`: Remove ambos os tokens do `localStorage` ao fazer logout.

### 3. **Interceptação das Requisições**

- Criar um interceptor para requisições HTTP, garantindo que:
    - O access token seja incluído no cabeçalho `Authorization`.
    - Caso o access token expire, a requisição seja pausada até que um novo token seja obtido.
    - Se o refresh token também expirar, redirecionar o usuário para a tela de login.

### 4. **Fluxo Seguro de Atualização**

- Sempre validar o token antes de usá-lo.
- Se a API retornar erro 401 (`Unauthorized`), chamar `refreshAccessToken()`.
- Se o refresh token falhar, forçar logout e remover os tokens.

### 5. **Mitigação de Riscos**

- Evitar expor tokens no console.
- Configurar o `localStorage` de forma segura, evitando acessos desnecessários.
- Avaliar o uso de `sessionStorage` para sessões mais seguras, dependendo do comportamento esperado da aplicação.

Essa abordagem mantém a aplicação funcional e segura dentro do contexto definido. Caso a aplicação cresça ou tenha mais interações externas, pode ser necessário migrar para soluções mais seguras, como o armazenamento dos tokens em cookies `HttpOnly`.


