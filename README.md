# Miguel Moreira — Portfólio Profissional

> Construo produtos digitais do zero. Do visual ao sistema.

<table>
  <tr>
    <td width="720px">
      <div align="justify">
        Este repositório é o código do meu portfólio pessoal — construído com a mesma seriedade com que desenvolvo produtos reais. Não é um template. Cada decisão de design, cada linha de código e cada animação foi pensada para representar quem eu sou como desenvolvedor e criador. <b>Design que vira sistema. Ideia que vira produto.</b>
      </div>
    </td>
    <td align="center">
      <b style="font-size:48px">MM</b><br/>
      <sub>Miguel Moreira</sub>
    </td>
  </tr>
</table>

---

## 🚀 Status

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mmoreira41.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GitHub last commit](https://img.shields.io/github/last-commit/mmoreira41/portfolio?style=for-the-badge&logo=clockify&color=c8f04a)

---

## 🌐 Acesse

**[→ mmoreira41.vercel.app](https://portfolio-sand-ten-35.vercel.app/)**

---

## ✦ O que tem aqui dentro

Não é um portfólio de lista de projetos.
É uma apresentação de como eu penso, construo e entrego.

| Seção | O que você encontra |
|---|---|
| **Hero** | Nome em tipografia editorial, animações de entrada, ticker de techs |
| **Projetos** | Lista com nomes gigantes, preview ao hover, dados vivos via GitHub API |
| **Trajetória** | Evolução real — do design ao sistema — sem fingir empregos |
| **Sobre** | Uma frase. Dados que provam. Toggle PT · EN |
| **Contato** | Fundo verde `#c8f04a`, formulário funcional via EmailJS |

---

## 🛠 Stack

### Interface
- **Next.js 16** — App Router, Server Components
- **TypeScript** — strict mode
- **Tailwind CSS** — estilização utilitária

### Dados & Integrações
- **GitHub API** — projetos, commits, linguagens em tempo real
- **Claude API (Haiku)** — análise de README e geração de descrições
- **EmailJS** — formulário de contato 100% frontend
- **Zod** — validação de dados

### Deploy
- **Vercel** — CI/CD automático a cada push

---

## 📦 Rodando localmente

```bash
# Clone
git clone https://github.com/mmoreira41/portfolio.git
cd portfolio

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas chaves

# Rode
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

---

## 🔑 Variáveis de Ambiente

Crie `.env.local` na raiz com:

```bash
# GitHub API — aumenta rate limit (opcional, mas recomendado)
GITHUB_TOKEN=ghp_...

# Claude API — análise de README dos projetos
ANTHROPIC_API_KEY=sk-ant-...

# EmailJS — formulário de contato
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

> `GITHUB_TOKEN` e `ANTHROPIC_API_KEY` são server-side — nunca expostos ao cliente.

---

## 📂 Estrutura

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout, fontes, metadata
│   ├── page.tsx                # Single-page — todas as seções
│   └── projetos/[slug]/        # Página de detalhe por projeto
│       └── page.tsx            # Server Component — GitHub API + Claude API
├── components/
│   └── sections/
│       ├── Hero.jsx            # Headline editorial animada
│       ├── Projects.tsx        # Lista com hover preview
│       ├── About.tsx           # Toggle PT · EN
│       ├── Trajectory.tsx      # Trajetória em tabela editorial
│       └── Contact.tsx         # Formulário no verde
├── lib/
│   ├── github.ts               # Fetch GitHub API (server-side)
│   ├── projects.ts             # Dados base dos projetos
│   └── ai-analysis.ts          # Análise de README via Claude
└── types/
    └── github.ts               # Tipagem da GitHub API
```

---

## 🎥 Preview

| Hero | Projetos |
|:---:|:---:|
| ![Hero](https://github.com/user-attachments/assets/ce7a3c53-f5bd-4b05-b32b-2198026a5e3d) | ![Projetos](https://github.com/user-attachments/assets/4c28a118-ebe6-4d78-9793-01d7ee7837af) |

| Trajetória | Contato |
|:---:|:---:|
| ![Trajetória](https://github.com/user-attachments/assets/b259aee2-372d-4509-8834-89cebf3b8ce5) | ![Contato](https://github.com/user-attachments/assets/f46a557b-bc51-49df-be58-3171240eb552) |

---

## 👤 Autor

<table>
  <tr>
    <td align="center" width="160px">
      <b>Miguel Moreira</b><br/>
      <sub>Eng. Software · PUC Minas</sub><br/>
      <sub>5º período · BH, Brasil</sub>
    </td>
    <td>
      <a href="https://github.com/mmoreira41">
        <img src="https://img.shields.io/badge/GitHub-mmoreira41-181717?style=for-the-badge&logo=github" />
      </a><br/><br/>
      <a href="mailto:miguelmmc08@gmail.com">
        <img src="https://img.shields.io/badge/Gmail-miguelmmc08-EA4335?style=for-the-badge&logo=gmail&logoColor=white" />
      </a>
    </td>
  </tr>
</table>

---

## 🙏 Referências

- [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — pela orientação no LAB01 e pelo template de README que serviu de base estrutural
- [**oriol.design**](https://oriol.design) — referência visual do Hero
- [**bpowell.co**](https://bpowell.co) — referência visual da seção de Projetos
- [**minimal.gallery**](https://minimal.gallery) — curadoria de inspiração visual

---

## 📄 Licença

MIT — use como quiser, mas não esqueça de construir algo seu.

---

<div align="center">
  <sub>Feito com Next.js, TypeScript e muita atenção aos detalhes.</sub><br/>
  <sub>© 2025 Miguel Moreira Chaves Maciel</sub>
</div>
