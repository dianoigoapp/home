# Discipular UI (v0.2) — UI-first + Offline Mock + Capacitor-ready

Este projeto é uma refatoração UI-first (baseada no layout premium do app de referência), com:

- Estrutura de Cursos → Módulos → Aulas (placeholders)
- Reader mobile-first com Sidebar e navegação Anterior/Próximo
- Renderização de Markdown (placeholder)
- Botão **"Baixar para uso offline"** (mock)
  - No APK: usa `@capacitor/filesystem`
  - No Web: fallback em `localStorage`
- Preparação para build Android com **Capacitor**

## Rodar no Web

```bash
npm install
npm run dev
```

## Preparar Android (Capacitor)

1) Build do web app
```bash
npm run build
```

2) Adicionar plataforma Android
```bash
npm run cap:add:android
```

3) Sincronizar e abrir Android Studio
```bash
npm run cap:sync:android
npm run cap:open:android
```

> Observação: este repo vem "Capacitor-ready" (config + scripts). A pasta `android/` será criada quando você rodar `cap add android` na sua máquina.

## Próximos passos planejados

- Trocar o mock offline por **pacotes reais no GCS** (manifest + markdown + assets)
- Firebase Auth + Firestore (usuários, progresso, igrejas)
- Overlays institucionais (notas/anexos)


## Conteúdo via Packs (embedded)

- Coloque novos packs em `public/packs/<courseId>/<moduleSlug>/...`
- Atualize `public/packs/index.json`
- Rode:

```bash
pnpm gen:curriculum
```

Isso atualiza automaticamente `src/curriculum/fundamentos/course.ts` com os módulos/aulas do manifest.


## Markdown Sanitizer (Student Safe)

O app remove automaticamente notas internas/instruções que possam vir de IA no conteúdo markdown. Você pode esconder trechos usando um destes padrões:

- YAML frontmatter no topo
- Comentários HTML: `<!-- ... -->`
- Blocos: `:::internal ... :::`, `:::leader ... :::`, `:::instrucoes ... :::`
- Linhas comentário: `[//]: # (comentário)`

Por padrão o modo é `student`.
