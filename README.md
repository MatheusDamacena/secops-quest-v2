# SecOps Quest v2 🔒

Jogo educacional estilo Duolingo para Google SecOps, YARA-L e UDM.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite |
| Auth | Firebase Auth |
| Banco de dados | Firestore |
| Hospedagem | Vercel |
| CI/CD | GitHub Actions |

---

## Estrutura do projeto

```
src/
├── components/     # UI reutilizável (Button, Card, ProgressBar...)
├── screens/        # Uma tela por arquivo
│   ├── AuthScreen.jsx
│   ├── SetupScreen.jsx
│   ├── HomeScreen.jsx
│   ├── LeaderboardScreen.jsx
│   ├── ProfileScreen.jsx
│   └── LoadingScreen.jsx
├── hooks/
│   ├── useAuth.js      # Autenticação + carregamento de perfil
│   └── useProgress.js  # Progresso, XP, streak
├── firebase/
│   ├── config.js   # Inicialização Firebase
│   └── db.js       # Helpers Firestore
├── data/           # Conteúdo em JSON (módulos, questões, glossário)
├── styles/
│   └── tokens.js   # Design tokens — cores e fontes centralizadas
└── App.jsx         # Só roteamento (~40 linhas)
```

---

## Passo a passo: do zero ao deploy

### PASSO 1 — Criar o projeto Firebase

> ⚠️ Faça isso ANTES de rodar o projeto localmente.

1. Acesse **console.firebase.google.com**
2. Clique em **Adicionar projeto**
3. Nome: `secops-quest-v2`
4. Desative o Google Analytics
5. Clique em **Criar projeto**

#### 1.1 — Ativar Authentication

1. Menu lateral → **Authentication → Primeiros passos**
2. Aba **Sign-in method**
3. Ative **E-mail/senha**
4. Ative **Google**

#### 1.2 — Criar Firestore

1. Menu lateral → **Firestore Database → Criar banco de dados**
2. Selecione **Modo de produção**
3. Região: **southamerica-east1** (São Paulo)
4. Clique em **Ativar**

#### 1.3 — Configurar Security Rules

No Firestore → aba **Regras**, substitua o conteúdo por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /leaderboard/{userId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Clique em **Publicar**.

#### 1.4 — Pegar as credenciais do Firebase

1. Clique no ícone ⚙️ → **Configurações do projeto**
2. Aba **Seus aplicativos** → clique em **</>** (Web)
3. Nome do app: `secops-quest-v2-web`
4. **Não** marque "Firebase Hosting"
5. Clique em **Registrar app**
6. Você vai ver um objeto assim — **copie os valores**:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "secops-quest-v2.firebaseapp.com",
  projectId: "secops-quest-v2",
  storageBucket: "secops-quest-v2.firebasestorage.app",
  messagingSenderId: "524982...",
  appId: "1:524982...:web:..."
};
```

---

### PASSO 2 — Configurar o projeto local

1. Descompacte o zip do projeto
2. Entre na pasta:

```bash
cd ~/Documents/secops-quest-v2
```

3. Crie o arquivo `.env.local` a partir do template:

```bash
cp .env.example .env.local
```

4. Abra o `.env.local` no VSCode e preencha com os valores do Firebase:

```
VITE_FB_API_KEY=AIzaSy...
VITE_FB_AUTH_DOMAIN=secops-quest-v2.firebaseapp.com
VITE_FB_PROJECT_ID=secops-quest-v2
VITE_FB_STORAGE_BUCKET=secops-quest-v2.firebasestorage.app
VITE_FB_MESSAGING_SENDER_ID=524982...
VITE_FB_APP_ID=1:524982...:web:...
```

5. Instale as dependências:

```bash
npm install
```

6. Rode localmente:

```bash
npm run dev
```

Acesse **http://localhost:5173** — deve aparecer a tela de login.

---

### PASSO 3 — Criar o repositório no GitHub

1. Acesse **github.com → New repository**
2. Nome: `secops-quest-v2`
3. Visibilidade: **Private** (pode mudar depois)
4. **Não** inicialize com README
5. Clique em **Create repository**

6. No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "feat: estrutura inicial SecOps Quest v2"
git remote add origin https://github.com/MatheusDamacena/secops-quest-v2.git
git branch -M main
git push -u origin main
```

---

### PASSO 4 — Criar conta na Vercel e fazer o deploy

1. Acesse **vercel.com**
2. Clique em **Sign up → Continue with GitHub**
3. Clique em **New Project**
4. Importe `MatheusDamacena/secops-quest-v2`
5. Framework: **Vite** (detectado automaticamente)
6. Em **Environment Variables**, adicione as 6 variáveis do `.env.local`:

| Nome | Valor |
|------|-------|
| `VITE_FB_API_KEY` | sua API Key |
| `VITE_FB_AUTH_DOMAIN` | seu Auth Domain |
| `VITE_FB_PROJECT_ID` | `secops-quest-v2` |
| `VITE_FB_STORAGE_BUCKET` | seu Storage Bucket |
| `VITE_FB_MESSAGING_SENDER_ID` | seu Sender ID |
| `VITE_FB_APP_ID` | seu App ID |

7. Clique em **Deploy**

Seu site estará disponível em: `https://secops-quest-v2.vercel.app`

---

### PASSO 5 — Configurar CI/CD com GitHub Actions

A partir daqui, todo `git push` na branch `main` faz deploy automático na Vercel.

#### 5.1 — Instalar o Vercel CLI e linkar o projeto

```bash
npm i -g vercel
vercel login
vercel link
```

O comando `vercel link` vai perguntar qual projeto linkar — selecione `secops-quest-v2`. Isso cria o arquivo `.vercel/project.json`.

Veja os IDs gerados:

```bash
cat .vercel/project.json
```

Você vai ver:
```json
{
  "orgId": "team_xxx",
  "projectId": "prj_xxx"
}
```

#### 5.2 — Gerar token da Vercel

1. **vercel.com → Account Settings → Tokens**
2. Clique em **Create Token**
3. Nome: `github-actions`
4. Copie o token gerado

#### 5.3 — Adicionar secrets no GitHub

Acesse: `github.com/MatheusDamacena/secops-quest-v2/settings/secrets/actions`

Clique em **New repository secret** e adicione um por um:

| Secret | Valor |
|--------|-------|
| `VERCEL_TOKEN` | token do passo 5.2 |
| `VERCEL_ORG_ID` | `orgId` do project.json |
| `VERCEL_PROJECT_ID` | `projectId` do project.json |
| `VITE_FB_API_KEY` | sua API Key Firebase |
| `VITE_FB_AUTH_DOMAIN` | seu Auth Domain |
| `VITE_FB_PROJECT_ID` | `secops-quest-v2` |
| `VITE_FB_STORAGE_BUCKET` | seu Storage Bucket |
| `VITE_FB_MESSAGING_SENDER_ID` | seu Sender ID |
| `VITE_FB_APP_ID` | seu App ID |

#### 5.4 — Testar o CI/CD

```bash
git commit --allow-empty -m "test: verificar CI/CD"
git push origin main
```

Acesse: `github.com/MatheusDamacena/secops-quest-v2/actions`

Em ~60 segundos o deploy aparece na Vercel.

---

### PASSO 6 — Proteger a API Key do Firebase

1. Firebase Console → **Configurações do projeto**
2. Aba **Geral** → role até **Suas APIs**
3. Clique na **API Key** → **Editar restrições**
4. Em **Restrições de aplicativo**: selecione **Referenciadores HTTP**
5. Adicione:
   - `https://secops-quest-v2.vercel.app/*`
   - `http://localhost:5173/*`
6. Salve

---

## Fluxo de desenvolvimento no dia a dia

```
editar arquivo → git add . → git commit -m "..." → git push → deploy automático
```

```bash
npm run dev      # desenvolvimento local com hot-reload
npm run build    # gerar build de produção
npm run preview  # testar o build localmente antes de publicar
```

---

## Rollback de emergência

```bash
# Ver histórico
git log --oneline -10

# Voltar para commit específico
git reset --hard <hash>
git push origin main --force
```

---

## Adicionar novo conteúdo (módulos, questões)

Todo conteúdo fica em `src/data/`. Para adicionar:

1. Edite ou crie arquivos JSON em `src/data/`
2. Importe no screen correspondente
3. Faça o push — deploy automático

Não precisa tocar em lógica de jogo nem em componentes.