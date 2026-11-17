# AuroraClub

Estúdio de personalização de roupas em React 19, TypeScript e Vite. Interface em português, monocromática, sem autenticação na aplicação, pagamento ou servidor de processamento de imagens.

## Executar

Requer Node.js 22 ou superior.

```sh
npm install
npm run dev
```

```sh
npm test
npm run build
```

A pasta `dist` pode ser publicada em qualquer hospedagem estática. A navegação por hash dispensa regras de reescrita.

## Uso

Abra Personalizar, escolha peça, modelo, face, cor e tamanho. Envie PNG/JPG/JPEG de até 10.485.760 bytes. Arraste a arte e use os cantos para escala, alça superior para rotação ou campos numéricos para ajustes independentes. Duas pontas de toque redimensionam a camada. O zoom usa controles próprios e não altera o projeto.

Textos, formas e imagens têm camadas independentes, visibilidade, bloqueio, duplicação, ordem, opacidade e espelhamento. Imagens possuem recorte não destrutivo, brilho, contraste, saturação e inversão. Frente e costas são independentes. Desfazer: Ctrl+Z; refazer: Ctrl+Shift+Z ou Ctrl+Y; setas movem seleção; Delete remove. Atalhos não capturam digitação em campos.

Salvar guarda um rascunho no IndexedDB deste navegador, somente após ação explícita. Retomar recupera esse rascunho. Exportar JSON cria um arquivo portável com as imagens originais incorporadas. Importar valida estrutura, tipos, assinatura das imagens e referências. Não há salvamento automático: salve antes de navegar ou fechar a página.

Finalizar abre a revisão frente/costas. Prévias PNG/JPEG e composição transparente são exportadas em 1800 × 2400 px, sem alças. A arte exportada corresponde à face ativa e ao espaço normalizado completo do projeto. Imagens originais também podem ser baixadas pelo painel de ajustes. Os pixels originais são preservados no projeto, mas exportações compostas usam a resolução documentada; não são arquivos certificados para impressão.

## Catálogo e renderização

Três peças iniciais: oversized (Noah e Yuna), polo (Theo), baby look (Lia). Quatro modelos adultos gerados por IA, em frente e costas. O catálogo é extensível em `src/catalog.ts`. Tamanhos são escolhas conceituais do projeto, não estoque comercial. Ângulos laterais, três quartos, outras peças e fotografias sem modelo não são oferecidos nesta versão.

O atlas original está em `public/images/models.png`. Cada foto tem um contorno próprio de máscara com curvas e uma região de referência. Os contornos incluem a gola e acompanham as bordas do tecido; a recoloração e o recorte da arte usam a mesma máscara, escalada para a resolução de edição ou exportação. Canvas 2D aplica transformações, recorte pela superfície e sombreamento amostrado da foto. A cor preta é uma recoloração digital da roupa branca, não uma fotografia separada. A prévia não simula perspectiva 3D, dobras por malha, deslocamento do tecido ou oclusões dinâmicas. Os braços ficam fora da área central nas fotos preparadas. A posição da arte permanece no espaço normalizado da fotografia ao trocar modelos; não há medidas físicas de vestuário.

As máscaras são contornos em curvas calibrados visualmente; verificar bordas e cabelo antes de usar como material comercial. É possível mover e ampliar além da região de referência; o mockup recorta à roupa e a exportação transparente ao canvas. A viabilidade de fabricação deve ser confirmada com a confecção.

## Estrutura

- `App.tsx`: navegação, apresentação, catálogo e galeria editorial.
- `Editor.tsx`: ferramentas, histórico, projetos e revisão.
- `Canvas.tsx`: seleção e interação de ponteiro/toque.
- `render.ts`: compositor Canvas 2D e exportação.
- `core.ts`: tipos, validações, persistência e downloads.
- `catalog.ts`: compatibilidade, fotografias e referências às máscaras.
- `garment-fronts.ts` e `garment-backs.ts`: contornos das oito fotos nas coordenadas originais do atlas (384 × 512 px).
- `core.test.ts`: testes de assinatura/limites, serialização, faces, conteúdo inválido e coordenadas.

## Verificação realizada

Compilação TypeScript/Vite e cinco testes automatizados. No navegador desktop: criação e edição de texto, rotação, troca de modelo, independência de faces, salvamento no IndexedDB, exportação PNG com download concluído e revisão. Layout responsivo implementado em CSS; gestos móveis não foram verificados em aparelho físico. Testes de regressão visual automatizados e simulação têxtil avançada não foram implementados.

## Recursos visuais

Banners editoriais próprios para desktop, celular e duas campanhas de galeria estão em `public/images/banners/`. Os PNGs originais foram gerados com a ferramenta integrada de imagens; o site usa versões WebP (aproximadamente 63–96 KB cada). Composições, dimensões e prompts estão em [`docs/banners.md`](docs/banners.md). Textos e chamadas são HTML para manter legibilidade e adaptação entre telas.

Fotografia original gerada para este projeto. Resumo do prompt: contato fotográfico monocromático com quatro colunas e duas linhas, quatro modelos adultos distintos, frente na linha superior e costas na inferior, camisetas oversized, polo e baby look brancas sem estampa; câmera frontal, braços afastados do tronco, fundo cinza, textura de tecido realista. Ferramenta de geração de imagens integrada utilizada. Logotipo tipográfico e favicon SVG próprios. Fontes Barlow Condensed, DM Sans e IBM Plex Mono via Google Fonts, com alternativas de sistema. A aplicação funciona sem as fontes remotas, mas sua aparência pode variar.
