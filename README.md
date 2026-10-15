# AI Filipe TTS (HTML)

Projeto simples em HTML/CSS/JS que permite adicionar/remover personagens e reproduzir texto usando a Web Speech API do navegador.

## Pré-requisitos
- Navegador com suporte à Web Speech API (Chrome, Edge, Safari/Firefox com suporte parcial).
- Não precisa de servidor — basta abrir `index.html` no navegador.
- Para melhor compatibilidade, pode servir a pasta com um servidor local, por exemplo:

```bash
npx http-server
```

## Arquivos
- `index.html` — interface principal.
- `styles.css` — layout e visual.
- `app.js` — lógica do CRUD de personagens e reprodução de voz.

## Como usar
1. Abra `index.html` no navegador.
2. Em "Adicionar personagem", escolha a voz, ajuste rate/pitch e clique em "Adicionar".
3. Selecione um personagem no Player, digite o texto e clique em "Falar".
4. Os personagens ficam salvos no `localStorage` do navegador.

## Observações
- As vozes disponíveis dependem do navegador e do sistema operacional.
- O projeto é totalmente estático e fácil de customizar.
- Para projetos mais avançados pode ser integrado com API de TTS externa, banco de dados ou backend.

## Licença
MIT
