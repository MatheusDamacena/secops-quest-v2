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
│   └── db.js       # Helpers Firestore (saveUser, loadUser, leaderboard)
├── data/           # Conteúdo em JSON (módulos, questões, glossário)
├── styles/
│   └── tokens.js   # Design tokens — cores e fontes centralizadas
└── App.jsx         # Só roteamento (~40 linhas)
```

---

## Passo a passo: configuração inicial

### 1. Criar o repositório no GitHub

1. Acesse github.com → **New repository**
2. Nome: `secops-quest-v2`
3. Visibilidade: **Public**
4. Clique em **Create repository**
5. No terminal do seu Mac:

```bash
cd ~/Documents
git clone https://github.com/MatheusDamacena/secops-quest-v2.git
cd secops-quest-v2
```

---

### 2. Copiar os arquivos do projeto

Copie todos os arquivos deste projeto para a pasta clonada e faça o primeiro commit:

```bash
# Instalar dependências
npm install

# Testar localmente (vai funcionar mesmo sem Firebase ainda)
npm run dev
# Abre http://localhost:5173

# Primeiro commit
git add .
git commit -m "feat: estrutura inicial SecOps Quest v2"
git push origin main
```

---

### 3. Criar o projeto Firebase

1. Acesse **console.firebase.google.com**
2. Clique em **Adicionar projeto**
3. Nome: `secops-quest-v2`
4. Desative o Google Analytics (não precisa)
5. Clique em **Criar projeto**

#### 3.1 Ativar Authentication

1. No menu lateral: **Authentication → Primeiros passos**
2. Aba **Sign-in method**
3. Ative **E-mail/senha**
4. Ative **Google**

#### 3.2 Criar Firestore

1. No menu lateral: **Firestore Database → Criar banco de dados**
2. Selecione **Modo de produção**
3. Região: **southamerica-east1** (São Paulo)
4. Clique em **Ativar**

#### 3.3 Configurar Security Rules do Firestore

No Firestore → **Regras**, cole:

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

#### 3.4 Pegar as credenciais

1. Configurações do projeto (ícone ⚙️) → **Configurações do projeto**
2. Aba **Seus aplicativos** → clique em **</>** (Web)
3. Nome: `secops-quest-v2-web`
4. **Não** ative o Firebase Hosting
5. Copie o objeto `firebaseConfig`

#### 3.5 Criar o .env.local

Na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite o `.env.local` com os valores do Firebase:

```
VITE_FB_API_KEY=AIzaSy...
VITE_FB_AUTH_DOMAIN=secops-quest-v2.firebaseapp.com
VITE_FB_PROJECT_ID=secops-quest-v2
VITE_FB_STORAGE_BUCKET=secops-quest-v2.firebasestorage.app
VITE_FB_MESSAGING_SENDER_ID=524982818...
VITE_FB_APP_ID=1:524982818...:web:...
```

Teste local:
```bash
npm run dev
```

---

### 4. Criar conta na Vercel e conectar o repositório

1. Acesse **vercel.com** → **Sign up with GitHub**
2. Clique em **New Project**
3. Importe `MatheusDamacena/secops-quest-v2`
4. Framework: **Vite** (detecta automático)
5. **Environment Variables** — adicione todas do `.env.local`:
   - `VITE_FB_API_KEY`
   - `VITE_FB_AUTH_DOMAIN`
   - `VITE_FB_PROJECT_ID`
   - `VITE_FB_STORAGE_BUCKET`
   - `VITE_FB_MESSAGING_SENDER_ID`
   - `VITE_FB_APP_ID`
6. Clique em **Deploy**

Seu site estará em: `secops-quest-v2.vercel.app`

---

### 5. Configurar CI/CD com GitHub Actions

O deploy automático via GitHub Actions requer 3 secrets da Vercel.

#### 5.1 Pegar os tokens da Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Linkar o projeto (rode na pasta do projeto)
vercel link
# Isso cria .vercel/project.json com org-id e project-id
cat .vercel/project.json
```

Você vai ver algo como:
```json
{ "orgId": "team_xxx", "projectId": "prj_xxx" }
```

#### 5.2 Gerar token de acesso da Vercel

1. vercel.com → **Account Settings → Tokens**
2. Clique em **Create Token**
3. Nome: `github-actions`
4. Copie o token gerado

#### 5.3 Adicionar secrets no GitHub

Acesse: `github.com/MatheusDamacena/secops-quest-v2/settings/secrets/actions`

Adicione:

| Secret | Valor |
|--------|-------|
| `VERCEL_TOKEN` | token gerado no passo 5.2 |
| `VERCEL_ORG_ID` | `orgId` do project.json |
| `VERCEL_PROJECT_ID` | `projectId` do project.json |
| `VITE_FB_API_KEY` | sua API Key Firebase |
| `VITE_FB_AUTH_DOMAIN` | seu Auth Domain |
| `VITE_FB_PROJECT_ID` | `secops-quest-v2` |
| `VITE_FB_STORAGE_BUCKET` | seu Storage Bucket |
| `VITE_FB_MESSAGING_SENDER_ID` | seu Sender ID |
| `VITE_FB_APP_ID` | seu App ID |

#### 5.4 Testar o CI/CD

```bash
git commit --allow-empty -m "test: verificar CI/CD"
git push origin main
```

Acesse: `github.com/MatheusDamacena/secops-quest-v2/actions`

Deve aparecer o workflow rodando. Em ~60 segundos o deploy vai para a Vercel.

---

### 6. Proteção da API Key Firebase

No Firebase Console → **Configurações do projeto → Suas APIs**:

1. Clique em **API Key** → **Editar**
2. Em **Restrições de aplicativo**: selecione **Referenciadores HTTP**
3. Adicione:
   - `https://secops-quest-v2.vercel.app/*`
   - `http://localhost:5173/*` (para desenvolvimento)
4. Salve

---

## Fluxo de desenvolvimento

```
você edita um arquivo → git push → GitHub Actions roda → Vercel deploya
                                                        ↓
                                              em ~60 segundos online
```

Para desenvolvimento local:
```bash
npm run dev      # servidor local com hot-reload
npm run build    # gerar dist/ para testar o build
npm run preview  # testar o build localmente
```

---

## Adicionar novo conteúdo

Todo o conteúdo fica em `src/data/`. Para adicionar um módulo novo:

1. Edite `src/data/modules.json`
2. Adicione as questões em `src/data/questions/modulo-novo.json`
3. Faça o PR ou push direto no main

---

## Rollback de emergência

```bash
# Ver histórico de commits
git log --oneline -10

# Voltar para um commit específico
git reset --hard <hash>
git push origin main --force
```
