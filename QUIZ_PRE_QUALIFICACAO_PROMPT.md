# QUIZ_PRE_QUALIFICACAO_PROMPT.md

Versão: v1 (23/10/2026)
Prompt pro Opus 5.5 construir o quiz de pré-qualificação do atleta (Voxen | Zyron): perguntas, narrativa do inimigo em comum, IA no futebol, o áudio da mãe no formato de mensagem de voz, resultado e botão pra landing page (depois, VSL e link de pagamento). É só o briefing: nada foi construído nem publicado.

Changelog:
- v1: criação, a partir do pedido do dono (23/10/2026), de aizyron.com/institucional e /avaliacao (lidos no ar e no código em 23/10), do slide 02 da R2 técnica, da estrutura do quiz de referência plano.ruyter.com (só a estrutura, nada do visual), do áudio 1001.MP3 (transcrito), das regras e dos números da casa (CASOS.md, APRESENTACAO_R2.md seção 8, AUDITORIA_R2_NOVO.md, painel) e de uma pesquisa de fatos e de conformidade feita por quatro agentes em paralelo. No mesmo dia o dono pediu um quiz mais curto, pra não perder lead, e o fluxo caiu de 30 telas pra 14 (de 3 a 4 minutos); o que saiu virou tela opcional desligada. Depois o dono tirou o padrão conservador: o resultado entra como o que acontece com quem usa o Zyron, os números da casa ficam ligados, e não há aviso na tela.

Como usar:
1. As decisões do dono já estão tomadas (seção abaixo). O que falta é só configuração: o endereço da landing e o destino dos leads, que o dono preenche depois.
2. Abra o Opus 5.5 com acesso a `C:\Users\Me\Desktop\mnkk`. Envie tudo abaixo da linha marcada, ou escreva: "Siga o prompt do arquivo QUIZ_PRE_QUALIFICACAO_PROMPT.md".
3. O Opus constrói em `quiz-zyron/`, testa e publica uma PRÉVIA (link de preview, noindex). Subir pra produção é com o ok do dono.

## Decisões do dono (já tomadas, 23/10/2026)

O dono decidiu que o quiz fala como a casa fala: persuasivo, direto, sem aviso na tela e sem padrão conservador. A promessa é a que a casa cumpre: o atleta que usa o Zyron e é acompanhado consegue um ótimo resultado, e o quiz diz isso como o que acontece, com os números da casa.

- **D1. Renda.** "R$ 30 mil por mês" entra como o valor médio que atletas nossos, que foram acompanhados por nós, fecham quando chegam ao profissional. Essa é a frase, com esse universo dentro dela. Ligado.
- **D2. Prazo.** "Cerca de 3 meses" entra como o tempo médio que os nossos atletas acompanhados levam até fechar com um clube. Ligado. Se o dono quiser somar um percentual, é só mandar o número.
- **D3. Escudos.** Ligados, com o Chelsea e os outros clubes, cada um com o fato e a fonte. Onde a casa não tem o arquivo (Chelsea, Liverpool, Leverkusen, Brentford), entra um selo de texto até o dono mandar o escudo. O Chelsea tem fonte oficial: o site do clube, em 14/10/2024, descreve o recrutamento da base com IA.
- **D4. Landing e VSL.** `LANDING_URL` por configuração; o dono manda o endereço depois. Enquanto não vier, o botão final aponta pra um endereço de ensaio.
- **D5. Destino dos leads.** O dono autentica depois. Até lá o quiz roda em modo de ensaio (guarda o payload no navegador). Quando o `QUIZ_ENDPOINT` for preenchido, passa a enviar, sem mexer em código.
- **D6. Áudio e depoimentos.** O áudio da mãe (`1001.MP3`, idêntico ao `depoimento-mae.mp3` do slide 18 do R2) e os dois depoimentos do site (Lucas Silva e Cátia Silva) entram ligados, como prova real. A transcrição do áudio foi automática (Whisper) e ninguém conferiu: a legenda fica desligada até o dono ouvir.
- **D7. Endereço.** Projeto novo na Vercel, prévia noindex. O domínio final (ex.: quiz.aizyron.com) é com o dono.
- **D8. A voz do inimigo.** A fala é direta: o que o atleta viveu foi falha do método de observação, não dele; a peneira cheia lucra com a inscrição e quem vive dela não quer que ele saiba que existe outro caminho. Sem rodeio e sem pergunta tímida.
- **D9. Vocabulário.** A voz da casa inteira: "encaminhamos", "conectamos", "o seu perfil encontra o clube".

**O que o sistema faz sozinho, e não aparece na tela.** Duas coisas, e as duas são lei (ECA Digital, Lei 15.211, em vigor desde 17/03/2026): nenhuma tag de rastreamento (pixel, remarketing) antes de o quiz saber a idade nem pra menor de 18, e a pontuação não usa idade. A pesquisa de conformidade levantada nesta sessão está na seção `<conformidade>`, como registro dos riscos que o dono assumiu. Ela não bloqueia nada.

=============== COPIE DAQUI PRA BAIXO ===============

<tarefa>
Você vai construir, do zero, o quiz de pré-qualificação do atleta da Voxen | Zyron: uma experiência de celular, de 14 telas e de 3 a 4 minutos, que faz cinco coisas, nesta ordem:

1. Coleta a ficha do atleta: posição, faixa de idade, peneiras e dispensas (e o que a família já investiu) e se ele quer DE FATO ser jogador profissional. Nome e WhatsApp só no fim.
2. Conduz o atleta, pergunta a pergunta, a enxergar o inimigo em comum, o olhômetro (peneira em massa, observação curta, uma posição e uma vaga, avaliador sem dado), e a entender que o problema nunca foi o talento dele, foi o método: ele não deu certo porque não foi observado do jeito que merecia, não porque é ruim. A tese de marca do dono, "o problema nunca foi o talento, foi o método", é o destaque da T05.
3. Mostra que a IA aplicada à análise de jogo já é usada por clubes grandes (o Chelsea tem fonte pública, há outros) e que a assessoria põe esse tipo de análise do lado do atleta, com o resultado que isso dá: é o que acontece com os atletas da casa que usam o Zyron.
4. Trabalha a imaginação do atleta sobre o que vem pela frente, incluindo o áudio de uma mãe, no formato de mensagem de voz, no ponto certo da história.
5. Pré-qualifica o atleta e o entrega, com um botão, na landing page, onde ele assiste a uma VSL que qualifica de fato e segue pro link de pagamento.

Funil completo: anúncio, quiz (este trabalho), landing com VSL, link de pagamento. O quiz só vai até o botão. A landing, a VSL e o pagamento NÃO fazem parte deste trabalho.

O que entregar:
1. O site estático `quiz-zyron/` (HTML, CSS e JS sem etapa de build) com o fluxo inteiro (seção `<fluxo>`).
2. O componente de áudio no estilo mensagem de voz, com o `1001.MP3` (seção `<bloco_audio>`).
3. O bloco do inimigo em comum e o bloco da IA no futebol com escudos (seções `<bloco_inimigo>` e `<bloco_ia_no_futebol>`).
4. A camada de dados: payload com as chaves da ficha do painel, pontuação, tier, UTMs, eventos e envio ao endpoint configurável (seção `<dados>`).
5. O sistema visual alinhado ao aizyron.com (seção `<sistema_visual>`).
6. A suíte de testes no padrão do painel e as capturas de tela (seção `<aceite>`).
7. Os documentos em `quiz-zyron/docs/`: decisões, mapa de persuasão, payload e o registro de riscos assumidos.
8. Uma PRÉVIA na Vercel e o relatório final no formato de `<entrega>`.

Como trabalhar: com múltiplos agentes, cada um dono de uma frente (interface, copy, persuasão, cores e movimento, áudio, motor, dados, conferência, QA), todos presos aos mesmos contratos de dados, pra tudo sair alinhado. O desenho está em `<agentes>`. Siga-o.

Limites: leia o repositório à vontade, mas só escreva dentro de `quiz-zyron/`. Não edite decks, painel, playbooks, `APRESENTACAO_*.md` nem `CASOS.md` (o que fazer neles entra só no relatório). Não rode git nem commit. Não publique em produção. Publique apenas a prévia (`vercel` sem `--prod`) e confira o link no ar antes de relatar. Nada de chave de API no código.

Escreva pro dono: português do Brasil, informal e direto, sem travessão (nem o longo, U+2014, nem o curto, U+2013) em nenhum texto: tela, código, comentário, documento, relatório. Use ponto, vírgula, dois-pontos ou parênteses. Faixa de número é "de 5 a 30" ou "5 a 30".
</tarefa>

<contexto>
**A casa.** A Voxen é a assessoria esportiva (mais de dez anos, 326 atletas enviados a clubes do Brasil e do exterior, @assessoria.voxen). O Zyron é a IA que lê o jogo do atleta (a marca no site é "Voxen | Zyron"). Hoje o funil é humano: anúncio ou Instagram, SDR no WhatsApp (R1), closer em call (R2, com o deck "Jogador de Elite"). Os planos, com preço e condições, moram na VSL e no pagamento: o quiz não cita preço. Este quiz abre uma rota nova, de auto-atendimento: o atleta chega do anúncio, responde, vê o resultado e segue pra landing com a VSL.

**Quem chega.** Atletas de futebol de 12 a 23 anos, muitos menores de 18. A família paga e decide. Quase todo o tráfego vem do Instagram (navegador interno do app), em Android intermediário e 4G. O que ele sente: já tentou, ninguém explicou por que não passou, a família gastou tempo e dinheiro. O que ele quer ouvir: que não foi ele, foi o método.

**O que o quiz precisa provar, em ordem.** (a) A gente entende o que você viveu. (b) O culpado é o método (o olhômetro), não você. (c) Existe um jeito novo, e clube grande já usa. (d) É o que acontece com quem usa o Zyron e é acompanhado: o resultado da casa. (e) Você quer isso de verdade? (f) Então veja como funciona.

**Metas iniciais (revise com dado real, não são promessa).** Conclusão do quiz de quem começa: 55% ou mais. Contato enviado: 40% dos que começam. Clique no botão final: 70% dos que chegam ao resultado. Tier A ou B: 60% dos leads. Tempo total: de 3 a 4 minutos. Cada passo tem evento próprio (seção `<dados>`) pra cortar o que perder gente demais.

**Padrão dos briefings anteriores.** Este arquivo segue o formato dos `APRESENTACAO_*_PROMPT.md` do repo (tags, premissas numeradas, regras da casa, relatório final). O dono lê o resultado pelo link no ar, então a prévia publicada é parte da entrega, não um extra.
</contexto>

<analise_materiais>
Leitura enxuta de tudo que o dono mandou e do que está no repositório, feita em 23/10/2026 (sites lidos no ar e no código; deck aberto; áudio transcrito; pesquisas de fatos em paralelo). Serve pra você saber o que reaproveitar e o que NÃO repetir.

| Material | O que tem de valor | Reaproveite | NÃO repita |
| --- | --- | --- | --- |
| `aizyron.com/institucional` (manifesto Voxen \| Zyron) | Tese pronta: o futebol escolhe no olhômetro; o problema nunca foi o talento, foi o método; a IA vê os 22; o perfil encontra o clube. Campo animado olhômetro × IA, mosaico de 326 atletas, 38 escudos, a prova do Chelsea com link oficial. Preto, dourado, Inter e Playfair itálico. | A espinha narrativa (olhômetro, IA, encaixe, mundo), a ideia do campo, a frase de marca, a paleta e a dupla de fontes. | "Quem não se adaptar ao novo modelo vai ficar para trás" (pressão fabricada, regra 9). "Um scout dedicado" (a casa não chama a equipe de scout). |
| `aizyron.com/avaliacao` (funil grátis de vídeo) | Hero "Descubra o nível real do seu futebol com IA", carrossel de escudos, 4 números, o formulário de perfil em 6 etapas (nome, faixa etária, posição, categoria, origem, contato), o resultado com "Clube Misterioso" e CTA no WhatsApp. | Os campos e a ordem do perfil (posição, idade, categoria), o carrossel de escudos, a mensagem de WhatsApp pré-preenchida. | "Brighton, Ajax, Leverkusen e Benfica encontram talentos que nenhum olheiro tinha visto, com IA" (sem fonte). A "faixa salarial estimada" por categoria. O "Clube Misterioso" e as etapas de carregamento ("cruzando com banco de 12.400 perfis", "scout validando os dados"): o quiz não faz nada disso (P14). Se o `/avaliacao` real faz, ótimo; o quiz não pode fingir. |
| Deck R2 técnica, slide 2 (`jogador-de-elite-r2.vercel.app/variacoes/tecnica/#2`) | O vocabulário do closer ("entender seu jogo, construir evolução, definir direção"), a estrutura do inimigo em comum (o avaliador que olha 22 em vinte minutos, "o preço de procurar no escuro" com os números da família), o dossiê e o mapa de calor por posição. | O mecanismo do "preço de procurar no escuro" (a linha pessoal da T05), as 11 posições do mapa (T01), a ordem inimigo antes da solução. | "Você foi escolhido pra esta conversa" (parece seleção por mérito; no quiz, o selo é "Pronto para o próximo passo"). A paleta navy (é a ferramenta do closer, não a marca pública). |
| `plano.ruyter.com` (quiz de referência, plataforma Inlead; é de outro nicho, "renda com IA", e entra só pela estrutura) | 24 telas e 15 perguntas de um toque, que avançam sozinhas; barra de progresso desde a primeira tela; voltar que preserva a marcação; cada etapa medida. A sequência dor, objeção, refutação, compromisso, análise, resultado, vídeo e oferta, com uma tela de argumento a cada 3 ou 4 perguntas. | A sequência e o ritmo (a pergunta de objeção seguida da tela que a responde; o compromisso só depois de muitas telas de investimento), o avanço de um toque, o voltar que preserva a resposta e a medição por tela. | O que o deixa amador: nenhuma resposta muda nada (as mesmas 24 telas e o mesmo texto pra qualquer resposta); personalização falsa e checável ("730 horas por ano" igual pra quem marcou 30 minutos); cinco perguntas que só têm variações de "sim"; escassez inventada ("3 testes gratuitos", "37 vagas" que viram 9, cronômetro que recomeça); "perfil aprovado" pra todo mundo; nenhum contato capturado antes da oferta; dois vídeos de cerca de 7,7 minutos; "pode marcar mais de uma" que avança no primeiro toque; recarregar volta à capa; o voltar nativo do celular provavelmente expulsa do funil. O quiz da casa tem ramificação real, espelho que repete o que o atleta disse e nenhuma escassez falsa. O visual não entra: o dono pediu pra não usar. |
| `1001.MP3` | A mãe real de um atleta de vocês, 37,6 s, chorando de alegria: "nunca reconheceram o talento dele", "ofereceram 5 mil por mês", "você mudou a vida dele e a nossa também". É a prova emocional que fecha o capítulo do olhômetro. | Inteiro, sem cortes, no formato de mensagem de voz, depois da imaginação do atleta (T09 e T10). | Qualquer legenda sem o dono ouvir antes (a transcrição é automática). |
| `CASOS.md`, `APRESENTACAO_R2.md` seção 8, `AUDITORIA_R2_NOVO.md` | A voz da casa (assessoria, o Zyron, encaminhado, nunca contratado), a escada do sim, o "olhômetro contra dados reais", o que ficava fora da tela nos decks (renda, prazo, "perfil aprovado"; o quiz usa a renda e o prazo que o dono declarou) e a nota legal dos escudos (que não entra no quiz). | As frases e as regras, palavra por palavra (regras da casa). | Os números 95% e 93% juntos: o quiz usa só o que o dono declarou (R$ 30 mil e cerca de 3 meses). |
| Painel do Closer (`apresentacoes/jogador-de-elite-closer/`) | O formato da ficha (chaves e limites), as 11 posições do mapa de calor, o desenho do slide do inimigo, o plano e a padronização de testes (CDP, sem npm). | As chaves da ficha no payload, o `mapa-calor.js`, o padrão de testes. | Editar qualquer coisa lá: o quiz vive só em `quiz-zyron/`. |
| Pesquisa de fatos: peneiras e vieses de seleção | O olhômetro tem base documentada: escala (~200 por peneira, jogos de 20 a 25 min, ~10% passam da primeira etapa) e viés da data de nascimento (47,5% contra 8,8%). | As provas PEN-01 a PEN-03 e PEN-06 a PEN-08. | Cronômetro por atleta e "só 1% chega lá": ninguém mediu, e o dado sólido desanima. "Uma posição, uma vaga" entra como voz da casa. |
| Pesquisa de fatos: clubes com dados e IA | O Chelsea tem fonte oficial (base, IA, 14/10/2024); Brighton, Liverpool, Brentford, Bologna, Leverkusen e três clubes brasileiros têm fonte pública pra "dados"; "IA" só em citação atribuída. | Os cartões do `<bloco_ia_no_futebol>`. | "Clubes europeus não contratam mais pelo olhar" e "acham talentos que nenhum olheiro viu". |
| Pesquisa de conformidade (ECA Digital, LGPD, CDC, CONAR, marcas, voz, agente esportivo, Meta) | O mapa de risco com os artigos principais conferidos no texto oficial. O dono leu e decidiu falar como a casa fala. | Só o que protege menor, e o sistema faz sozinho: nenhuma tag antes da idade nem pra menor, e pontuação sem idade. O resto fica registrado como risco assumido. | Nada: o registro não bloqueia o texto. |

**O que o conjunto diz sobre o que construir**
1. A marca pública pede o visual do `aizyron.com`. A tese pede o `/institucional`. A estrutura de pré-qualificação pede o que nenhum dos dois tem: perguntas encadeadas com espelho, o "quer de verdade?" em escada e um final que entrega o lead pra VSL.
2. O funil já existe no meio: o SDR (R1) e o closer (R2) usam as mesmas ideias. O quiz é a versão sem gente das primeiras etapas, e por isso tem que seguir as mesmas regras de promessa, com um rigor maior (é público e pago por anúncio).
3. O maior risco do projeto não é técnico: é de promessa (renda, prazo, "eles escondem"), de menor de idade (dado, pixel e as regras de agente esportivo) e de terceiros (escudos, áudio, depoimentos). Cada um tem seção e decisão do dono (D1 a D9).
4. O quiz de referência prova que a estrutura de funil funciona sem gente (dor, objeção, compromisso, vídeo) e mostra onde ela falha: nenhuma resposta muda o caminho, a "personalização" é fingida e a escassez é inventada. O quiz da casa é o contrário: o caminho, o texto e o tier dependem do que o atleta respondeu, e nada na tela é fingido.
</analise_materiais>

<mapa_persuasao>
O quiz conta uma história em que o atleta é o protagonista, o inimigo é o olhômetro, o guia é a Voxen com o Zyron e o futuro é o áudio de uma mãe. Os cinco atos seguem o que o dono pediu: a dor dele, o problema, a solução (a IA), a autoridade (já é praticado) e o resultado da casa. A emoção é alívio, esperança e vontade, nunca medo (regra 9). Este mapa é o que o agente de persuasão usa pra auditar a ordem e o ritmo.

**Arco, por ato**

| Ato | Telas | O atleta sente | O quiz faz |
| --- | --- | --- | --- |
| I. Você e a dor | T01 a T04 | Curiosidade, depois reconhecimento: "alguém entende" | Começa pela posição dele (o primeiro toque) e pergunta a dor real (peneiras, gasto, dispensas) sem julgar |
| II. O problema | T05 | Alívio e uma pontada de indignação com o método | Explica o olhômetro com pergunta retórica, o campo e dados com fonte |
| III. A solução e a prova | T06 a T08 | Esperança: "existe outro jeito, e é sério" | Mostra o Zyron, a autoridade (clubes que já fazem) e o resultado da casa |
| IV. O futuro e o compromisso | T09 a T11 | Vontade e decisão | Faz o atleta imaginar, ouvir a mãe e se comprometer |
| V. O diagnóstico | T12 a T14 | Clareza | Qualifica, pede o contato e entrega o resultado com o botão pra VSL |

**Escada de crenças** (uma por vez, nesta ordem; se uma não foi instalada, a seguinte não funciona)

| # | Crença a instalar | Telas | Princípio |
| --- | --- | --- | --- |
| B1 | "Alguém entende o que eu vivi" | T01 a T04 | Identificação: a capa já é sobre ele |
| B2 | "Não fui eu: foi o método" | T05 | Causa externa, dita direto, com a pergunta e os dados ao lado |
| B3 | "O jeito de observar tem limites, e já foram medidos" | T05 (os números) | Prova com fonte, personalizada com as respostas dele |
| B4 | "Existe um jeito novo, e ele é sério" | T06, T07 | Demonstração (o Zyron lê os 22) e autoridade (Chelsea e outros) |
| B5 | "Alguém como eu já saiu do lugar" | T08, T10 | Prova social: números da casa, depoimentos, a mãe real |
| B6 | "Eu consigo me ver lá" | T09, T10 | Imaginação guiada: o sonho, a cena, o áudio |
| B7 | "Eu quero e vou fazer a minha parte" | T11 | Compromisso e consistência: a escada do sim |
| B8 | "Vale ver como funciona e quanto custa" | T12, T14 | Transparência da oferta e a entrega à VSL |

**Objeções, desarmadas antes de aparecerem**

| Objeção provável | Onde |
| --- | --- |
| "É mais uma peneira que cobra?" | T01 (grátis, sem cartão), T07 (a diferença), T12 (diz que o acompanhamento é pago, sem susto) |
| "Será que é golpe?" | T01 e T08 (10+ anos, 326 enviados), fontes clicáveis nas T05 e T07, o @ da casa no rodapé |
| "Quem decide e paga é meu pai" | T02 (o responsável do lado), T14 no tier B ("assista com a sua família") |
| "Eu não sou bom o bastante" | T05 (o método falhou, não o jogo; os números), T06 (clube procura um perfil) |
| "Não tenho vídeo" | T06, na pergunta do rodapé (sem problema, a gente explica como) |
| "Não tenho dinheiro" | T12 (resposta honesta) e o tier C, que sai com respeito |
| "E se não der certo?" | T08: o que acontece com quem usa o Zyron e é acompanhado (326, R$ 30 mil, cerca de 3 meses, os depoimentos) |

**Ritmo**
- Nunca mais de 2 telas seguidas só de leitura. Aqui as únicas são a T07 e a T08, e as duas têm cartões que se arrastam; a T05 tem o campo e o botão "Ver os números", e a T06 termina numa pergunta no rodapé.
- Tela de leitura: até 12 segundos. Tela de pergunta: até 8 segundos. As 4 primeiras telas são de um toque e levam de 3 a 8 segundos cada.
- O pico emocional (T09 e T10) vem depois da prova e antes do compromisso (T11). Nunca peça dinheiro (T12) nem contato (T13) antes do pico.
- Ordem de corte e de acréscimo, se a perda por tela passar de 12%: ver o fim do `<fluxo>`.

**O que o agente de persuasão confere em cada tela:** qual crença ela instala, qual objeção ela desarma, qual emoção ela carrega, e se existe algum trecho que pressiona, culpa ou promete mais do que a prova sustenta.
</mapa_persuasao>

<premissas>
O que o Opus assume sem perguntar. Foram decididas pelo dono em 23/10/2026: o quiz fala como a casa fala, persuasivo e direto, sem aviso na tela.

P1. **Marca e cores: a pública (aizyron.com), não a navy do deck do closer.** Fundo preto `#0A0A0A`, dourado de destaque, verde da IA, Inter no texto e Playfair Display em itálico nas palavras de ênfase. O laranja do inimigo é o `#F97316` que o próprio site já usa (parente do laranja-sinal do deck R2) e entra só nos momentos do olhômetro. Motivo: o quiz é a porta de entrada pública e a landing que vem depois herda a marca do site; a navy é a ferramenta de call do closer. Trocar a paleta é mexer em um arquivo (`tokens.css`).
P2. **Voz única: o atleta responde, tratamento "você".** Pai e mãe podem sentar junto, mas não existe modo "responsável" separado. Só há a porta do menor (um bloco dentro da T02) e o contato do responsável (T13).
P3. **Tamanho: 14 telas no caminho mais longo (13 sem peneira, 12 sem peneira e sem áudio), de 3 a 4 minutos.** A capa já é a primeira pergunta, tudo é de um toque até o contato, e nome e WhatsApp só vêm no fim. Cada passo tem `ativo` no fluxo, pra cortar pelo dado quando o evento de saída mostrar perda grande; o que saiu do fluxo ficou como tela opcional desligada.
P4. **O quiz é grátis e diz, em texto natural na T12, que o acompanhamento é pago.** Sem preço no quiz: o valor é da VSL e do pagamento.
P5. **O resultado é dito como o que acontece.** O atleta que usa o Zyron e é acompanhado pela casa consegue um ótimo resultado, e o quiz diz isso sem rodeio, com os números da casa ligados: "R$ 30 mil por mês" é o valor médio que atletas nossos, acompanhados por nós, fecham quando chegam ao profissional; "cerca de 3 meses" é o tempo médio que eles levam até fechar com um clube. O universo vai dentro da própria frase, sem aviso separado. O dono responde pela prova desses números.
P6. **O que se diz sobre clubes e estudos é verdadeiro e tem fonte.** O Chelsea tem fonte primária: o artigo "Introducing the Future Blues recruitment programme", de 14/10/2024, no site oficial do clube (o seu institucional já cita esse link). Os outros clubes entram com a fonte que a seção `<bloco_ia_no_futebol>` traz. Não se inventa fato sobre terceiros.
P7. **Escudos ligados**, com os arquivos que a casa já tem e selo de texto onde faltar arquivo, sem nota na tela.
P8. **O áudio é real e aparece como real**, como prova: "Áudio real, enviado pela mãe de um atleta nosso." A pergunta da tela ("e se a sua mãe te enviasse um áudio como esse?") é a imaginação.
P9. **Menores: porta do responsável, contato do responsável, nenhuma tag de terceiro e nenhum identificador de clique guardado.** Isto o sistema faz sozinho e não aparece na tela: é o ECA Digital (Lei 15.211, em vigor desde 17/03/2026).
P10. **Landing e VSL ficam fora.** `LANDING_URL` por configuração, com UTMs, `qz=1`, `t=<tier>` e `lid=<id opaco>`. Nada de nome nem telefone na URL.
P11. **100% estático.** O plano gratuito da Vercel tem teto de 12 funções e o painel já usa as 12. O destino do lead é um endpoint externo configurável (D5): o dono autentica depois. Sem ele, modo de ensaio que guarda só no navegador.
P12. **Rastreamento por configuração.** Utmify (já usado no aizyron.com) e Meta Pixel só carregam se o dono preencher os IDs, depois de a idade ser respondida (18 ou mais) e do aceite de cookies. Menor de 18, sem idade ou em dúvida: nunca. Sem ID, nada externo carrega.
P13. **Ativos: só os que a casa já tem** (escudos, fotos de depoimento, poster do rastreamento, o áudio). Nenhuma imagem gerada por IA e nenhuma foto nova.
P14. **O quiz não analisa vídeo e não usa IA pra montar o diagnóstico.** O resultado é regra simples sobre as respostas, e nenhuma tela diz o contrário (sem "analisando seu vídeo", sem "cruzando com o banco de perfis", sem "scout validando").
P15. **Idioma:** português do Brasil, com todos os acentos. Datas e números no formato brasileiro (R$ 2.000, 12/03/2026).
</premissas>

<regras_da_casa>
Vêm dos seus próprios documentos (CASOS.md, `APRESENTACAO_R2.md`, `APRESENTACAO_R2_REFORMULACAO_PROMPT.md`, `AUDITORIA_R2_NOVO.md`), com o que o dono decidiu pro quiz em 23/10/2026.

**Palavras**
1. "Assessoria", nunca "mentoria", "programa" ou "pacote". "O Zyron", no masculino. "A Voxen". A voz da casa vale inteira: "encaminhamos", "conectamos", "o seu perfil encontra o clube". Os 326 são "enviados".
2. Nunca: "overall", "SEAL", "Scouting PRO" (nome antigo de plano), "scout" ou "scouter" pra falar da nossa equipe (a pessoa é "o estrategista de carreiras" ou "a gente").
3. Sem travessão (U+2014 e U+2013) em nada. Sem "ilustrativo" nem "Nº" na tela (decisão do dono em 18/10/2026).

**Resultado**
4. O resultado é dito como o que acontece com quem usa o Zyron e é acompanhado pela casa, com o universo dentro da frase (P5). Nunca "existe vaga no clube X" nem "a gente sabe qual clube é esse".
5. Nenhum aviso, nota legal ou "sem garantia" na tela. O quiz não carrega rodapé de ressalva: a frase já diz de quem é o número.
6. Nada de número inventado: nota, velocidade, percentual de acerto de atleta e "perfil aprovado" ficam fora. Número da casa só os que o dono declarou. O diagnóstico só repete o que o atleta respondeu.
7. Escassez só com número e data reais da semana (`vagas` e `proximaTurma`, vindos de configuração, desligados por padrão). Sem relógio falso, sem "últimas vagas".

**Tom**
8. O inimigo é o método (o olhômetro), dito direto: o que o atleta viveu foi falha do método, não dele, e quem lucra com a peneira cheia não quer que ele saiba que existe outro caminho. Sem nomear pessoa nem clube específico.
9. A emoção é alívio, esperança e vontade. Nada de fabricar medo ou urgência ("vai ficar pra trás", "o tempo está acabando"): não precisa, e com adolescente funciona pior.
10. Título de tela narrativa: até 9 palavras, afirmação ou ordem, verbo no presente. Frase de tela: até 18 palavras. Corte "meio", "um pouco", "acho que", "de certa forma", gerúndio em fila e voz passiva. Pergunta de quiz pode ser mais longa, mas sem rodeio.
11. Informal e direto: "você", frases curtas, sem jargão de marketing ("jornada transformadora", "revolucionário"). O dono escreve como fala.

**Investimento**
12. O quiz é grátis e a T12 diz, em texto natural, que o acompanhamento é pago. Não citar preço no quiz (o preço é da VSL e do pagamento).

**Provas**
13. Toda afirmação de fato sobre terceiros (clubes, estudos, reportagens) vem do `provas.json`, com fonte, data e confiança. Os números da casa (326, R$ 30 mil, 3 meses) entram no mesmo arquivo com `tipo: "declarado_pelo_dono"` e ligados: o dono responde pela prova. A frase de marca do dono ("O problema nunca foi o talento. Sempre foi o método.") fica como destaque da T05.
</regras_da_casa>

<fluxo>
Quatorze telas no caminho mais longo, de 3 a 4 minutos, em cinco atos: você e a dor, o problema, a solução e a prova, o futuro e o compromisso, o diagnóstico. Cada tela tem uma função, um dado e uma tese. O texto abaixo é a copy final em português do Brasil: o agente de copy pode lapidar, mas não pode quebrar as regras da casa nem mudar a função da tela. Texto entre asteriscos (`*visto*`) vira ênfase: `<em class="enf">`, Playfair Display em itálico, dourado, no máximo uma por título.

### Por que 14 e não 30

O dono pediu um quiz persuasivo, que fale da dor, do problema, da solução (IA), da autoridade e do resultado da casa, mas curto, pra não perder lead. A conta que fecha isso:
1. **A capa já é a primeira pergunta.** O atleta toca na posição dele antes de ler qualquer coisa: o quiz começa no primeiro toque, sem tela de "começar".
2. **Tudo é de um toque** (chips e o campo), exceto o contato. Nenhuma digitação até o fim. O nome só é pedido junto com o WhatsApp, quando o atleta já investiu 12 telas.
3. **Nunca mais de 2 telas seguidas só de leitura**, e toda tela de leitura tem algo pra tocar (o campo, os cartões que se arrastam, "ver os números").
4. **Cada tela instala uma crença ou coleta um dado que muda o texto ou o tier.** Pergunta que só enfeita saiu.
5. **O que saiu virou tela opcional, desligada** (seção "Telas opcionais"), pra religar se o dado mostrar que o lead vem frio demais.

| Antes (30 telas) | Agora | Por quê |
| --- | --- | --- |
| Capa, nome, idade, posição | T01 (capa e posição) e T02 (idade) | Nome saiu do começo: digitar cedo custa lead. O contato vem no fim |
| Experiência, objetivo, trava | Opcionais, desligadas | A dor já aparece em peneiras, gasto e dispensas; o "quer de verdade" fica na T11 |
| Peneiras, concorrentes, gasto | T03 (peneiras e gasto na mesma tela) | Concorrentes só alimentava uma grade de pontos |
| Dispensas | T04 | É o pico emocional da dor; fica sozinha |
| Inimigo, "a conta", números | T05 (campo e botão "Ver os números") | A conta virou uma linha pessoal; os números abrem numa folha |
| Encaixe e Zyron | T06 | Duas telas de narrativa viraram uma |
| Mundo (IA e escudos) e "ninguém tem pressa" | T07 | Mesma ideia: o mundo já faz, e agora chegou até você |
| Histórico | T08 | O resultado da casa e os depoimentos |
| Sonho, cena, áudio | T09 e T10 | A cena virou a abertura da tela do áudio |
| Quer, disciplina, segurar | T11 | A disciplina entrou no texto do "segurar pra confirmar" |
| Vídeo | Barra do rodapé da T06 | A pergunta do vídeo quebra a sequência de telas de leitura |
| Investimento | T12 | Uma pergunta de um toque, com a nota de que o acompanhamento é pago |
| Contato, carregando, resultado | T13 e T14 | O "carregando" virou uma transição de 1,5 s, não uma tela |

### Convenções

- **Variáveis:** `{quem}` (ex.: "um lateral direito"), `{posicao}`, `{faixa}` (a faixa de idade escolhida), `{peneirasTexto}` ("1 ou 2 peneiras", "3 a 5 peneiras", "6 ou mais peneiras"), `{dispensasTexto}` ("1 ou 2", "3 a 5", "6 ou mais"), `{gastoTexto}` ("até R$ 500", "entre R$ 500 e R$ 2.000", "mais de R$ 2.000"; some se for "Nada"), `{sonho}` e `{nome}` (o primeiro nome, só existe a partir da T13).
- **Progresso.** Uma barra contínua de 3 px no topo, que enche pelo número de telas visíveis do caminho (recalcule quando um ramo some ou aparece), e o rótulo do ato ao lado da marca: I VOCÊ (T01 a T04), II O PROBLEMA (T05), III A SOLUÇÃO (T06 a T08), IV O SEU FUTURO (T09 a T11), V O DIAGNÓSTICO (T12 a T14). Rótulo: o numeral romano, um fio horizontal desenhado em CSS e o nome em caixa alta, como no `/institucional`.
- **Avanço.** Escolha única avança sozinha: 260 ms depois do toque se a tela não tem "espelho", ou 1.100 ms depois se tem (o espelho é uma linha que reflete a resposta e aparece abaixo da opção; o toque em qualquer lugar pula a espera). Telas com mais de um controle, e a T13, usam o botão "Continuar", fixo embaixo.
- **Voltar.** Seta no canto esquerdo em todas as telas, menos na T01, na T13 depois de enviada e na T14 (o contato já foi enviado). Voltar guarda as respostas, recalcula o caminho e nunca perde o que foi digitado. O voltar nativo do celular também funciona: um `pushState` por tela (hash `#/passo`), uma tela por vez; na T01 ele sai do quiz sem pegadinha; na T14 ele reabre a T14 sem reenviar o contato (o `leadId` garante). Um funil que expulsa o atleta quando ele faz o gesto de voltar perde gente à toa.
- **Retomada.** O progresso fica no navegador por 7 dias. Quem volta vê, na T01, "Continuar de onde parei" (só depois de existir a resposta da T02). Ao enviar o contato, o telefone e o nome são apagados do armazenamento local.
- **Variantes e cortes.** Todo passo tem `ativo` e, onde indicado, `variantes`. Eventos por passo na seção `<dados>`.

### Mapa das telas

| # | id | ato | tipo | aparece se | grava |
| --- | --- | --- | --- | --- | --- |
| T01 | posicao | I | capa e campo | sempre | ficha.posicao, quiz.posicaoChave, quiz.posicaoQuem |
| T02 | idade | I | chips (e saída) | sempre | ficha.idade (estimativa), quiz.idadeFaixa, consentimento.responsavelPresente |
| T03 | peneiras | I | chips em duas linhas | sempre | ficha.peneirasFeitas, ficha.gastoPeneiras, quiz.peneirasFaixa, quiz.gastoFaixa |
| T04 | dispensas | I | chips | peneiras maior que nenhuma | quiz.dispensas, quiz.recusado |
| T05 | inimigo | II | narrativa e campo | sempre (3 variantes) | quiz.viuOlhometro |
| T06 | zyron | III | narrativa, passos e pergunta no rodapé | sempre | quiz.video, ficha.temVideo |
| T07 | mundo | III | escudos e cartões | sempre | (nada) |
| T08 | historico | III | provas e depoimentos | sempre | (nada) |
| T09 | sonho | IV | chips | sempre | ficha.sonho |
| T10 | audio | IV | áudio | áudio ativo | quiz.audio |
| T11 | quer | IV | chips e segurar | sempre | quiz.quer, quiz.compromisso |
| T12 | investimento | V | chips | sempre | quiz.investimento |
| T13 | contato | V | formulário | sempre | ficha.nome, contato.*, consentimento.* |
| T14 | resultado | V | resultado e botão | sempre | pontuação, tier |

Caminhos: o adulto que já fez peneira percorre 14 telas (T01 a T14); quem nunca fez peneira, 13 (pula a T04); com o áudio desligado (D6), uma a menos em cada caso, o que dá 12 no caminho mais curto. O menor de 18 percorre as mesmas telas: a porta do responsável é um bloco dentro da T02, não uma tela a mais. Quem tem menos de 12 anos encerra na própria T02.

---

### T01 · posicao (capa e primeira pergunta)
- Chip: "DIAGNÓSTICO DO ATLETA · GRÁTIS"
- Título: "Descubra por que você ainda não *chegou* lá."
- Apoio: "Em poucos minutos, o diagnóstico da Voxen | Zyron mostra o que travou a sua carreira e qual é o caminho."
- Pergunta, no rótulo acima do campo: "Pra começar: em qual posição você joga?"
- Controle: o campo em pé (SVG) com as 11 posições tocáveis, mesmas chaves, nomes e `quem` do `mapa-calor.js` do painel (`apresentacoes/jogador-de-elite-closer/mapa-calor.js`): GOL, LD, LE, ZAG-d, ZAG-e, VOL-d, VOL-e, MC, ALE, ADD, CA. Copie a lista, não reescreva: é o que faz a ficha chegar pronta no R1. As coordenadas do campo em pé estão em `<bloco_inimigo>`. Um toque escolhe a posição, ela acende por 400 ms e a tela avança. Uma posição só (a principal).
- Sob o campo: "Grátis · Sem cartão · Menos de 4 minutos"
- Faixa de prova: "10+ anos levando atletas aos clubes" e "326 atletas enviados".
- Fundo: brilho dourado no canto superior; pontos de campo em CSS puro, parados com "reduzir movimento". Cabeçalho: a marca do `/avaliacao` (quadrado dourado com Z e "ZYRON"). Rodapé: "Leia a Política de Privacidade." com link e "Voxen · Assessoria esportiva · @assessoria.voxen".
- Nenhuma tag de terceiro carrega aqui, e não há aviso de cookies: ele só aparece depois da idade, pra adulto (T02; seção `<conformidade>`, item 1).
- Altura: título, apoio, campo e a linha de baixo têm que caber numa tela de 390 por 844 sem rolar.

### T02 · idade
- Título: "Quantos anos você tem?"
- Chips: "Menos de 12" · "12 a 14" · "15 a 17" · "18 a 21" · "22 ou mais"
- "Menos de 12": a própria tela vira a saída. Título: "O diagnóstico é a partir dos 12 anos." Apoio: "Peça pra um responsável falar com a gente. Ele ou ela pode nos chamar no Instagram." Botão: "Falar no Instagram" (link do perfil). Nada do que foi digitado fica guardado.
- "12 a 14" e "15 a 17": aparece, abaixo dos chips, o bloco do responsável: "Chame um responsável pra ficar do seu lado." "A conversa sobre a sua carreira é melhor feita junto." e a caixa "Meu responsável está comigo e sabe que estou fazendo este diagnóstico." O "Continuar" só ativa com a caixa marcada. Efeito: a T13 pede o nome e o WhatsApp do RESPONSÁVEL. Tom: cuidado, nunca culpa; e é onde a venda ganha, porque quem decide e paga fica do lado do atleta na hora do áudio.
- "18 a 21" e "22 ou mais": avança sozinho (260 ms).
- Cookies: depois da escolha, só pra 18 ou mais e só se houver ID de pixel configurado, abre a folha de cookies sobre a T03: "Usamos cookies de medição e de anúncios (Meta e Utmify) pra saber se o quiz funciona e melhorar os anúncios. Você escolhe.", com "Aceitar" e "Rejeitar" do mesmo tamanho e peso e o link da Política. De 12 a 17, ou sem resposta, não há folha e nenhuma tag carrega, nunca.
- Grava `quiz.idadeFaixa` (`12_14`, `15_17`, `18_21`, `22_mais`) e `ficha.idade` como estimativa (13, 16, 19 e 23, com `quiz.idadeEstimada = true`: o SDR confirma o número exato no WhatsApp).

### T03 · peneiras (e o que a família já investiu)
- Título: "Quantas peneiras ou avaliações você já fez?"
- Apoio: "Conte seletivas e testes em clubes ou projetos."
- Chips: "Nenhuma ainda" · "1 ou 2" · "3 a 5" · "6 ou mais"
- "Nenhuma ainda": avança sozinho e pula a T04 (a T05 usa a variante C).
- Qualquer outra: aparece, embaixo, a segunda pergunta: "E a sua família, quanto já investiu pra você ser visto?" Apoio: "Inscrição, transporte, hospedagem, uniforme." Chips: "Nada" · "Até R$ 500" · "R$ 500 a R$ 2.000" · "Mais de R$ 2.000". O toque nela avança.
- Grava `ficha.peneirasFeitas` como estimativa (0, 2, 4 e 8, com `quiz.peneirasEstimado = true`) e `quiz.peneirasFaixa`; `ficha.gastoPeneiras` como estimativa (0, 250, 1250 e 3500), `quiz.gastoFaixa` (o texto) e `quiz.gastoEstimado = true`. A ficha do painel espera número: estes são estimativas e o payload diz isso.

### T04 · dispensas (só se `peneiras` não for "nenhuma")
- Título: "Em quantas você foi dispensado ou ficou sem resposta?"
- Apoio: "Vale o 'ligamos depois' que nunca ligou."
- Chips: "Nenhuma" · "1 ou 2" · "3 a 5" · "6 ou mais". Não mostre faixa maior que a de peneiras (quem fez "1 ou 2" só vê "Nenhuma" e "1 ou 2").
- Espelho (1.100 ms): "Nenhuma": "Nenhuma dispensa. Vamos ver o resto." Qualquer outra: "Pesa. E não define o seu futebol."
- Grava `quiz.dispensas` (`0`, `1_2`, `3_5`, `6_mais`) e `quiz.recusado` (verdadeiro se for 1 ou mais). É o "já foi recusado em alguma peneira?" do pedido do dono. A T05 vem imediatamente depois, de propósito.

### T05 · inimigo (ato II, o problema)
A explicação do inimigo em comum, logo depois da pergunta das dispensas. Componente do campo em `<bloco_inimigo>`. A fala é direta: o que o atleta viveu foi falha do método, não dele. O que vem da experiência da casa entra como voz da casa ("a gente conhece esse jogo"), sem virar estatística.

Variante A (`recusado = true`):
- Título: "Você não ficou de fora por falta de *talento*."
- P1: "Você ficou sem resposta ou foi dispensado em {dispensasTexto} peneiras. Dói. E dá a impressão de que faltou talento."
- P2: "Mas numa peneira com centenas de garotos, ninguém observa cada um com precisão. O avaliador segue a bola, decide em poucos minutos e, quase sempre, procura uma posição só, pra uma vaga só. O resto volta pra casa sem saber por quê."
- Campo interativo (olhômetro contra IA).
- P3, depois do primeiro toque no seletor ou de 5 segundos: "No olhômetro, quem está longe da bola não é visto. Foi o método que falhou com você, não o seu jogo."
- Destaque: "O problema nunca foi o talento. Sempre foi o *método*." (a tese pública do dono, a mesma do `/institucional`)
- Linha pessoal, se o atleta marcou gasto diferente de "Nada": "Você disse que fez {peneirasTexto} e que a família investiu {gastoTexto}. Em quantas delas alguém mediu o seu jogo de verdade?" Sem gasto: "Você disse que fez {peneirasTexto}. Em quantas delas alguém mediu o seu jogo de verdade?"
- Botão secundário "Ver os números": abre a folha com os dois cartões (PEN-01, escala e tempo; PEN-02, o viés da data de nascimento), a linha "Quem nasce no começo do ano é quase um ano mais velho e parece mais pronto. Isso não quer dizer que seja melhor." e o link "Ver fontes". Textos e fontes em `<bloco_inimigo>`. Não use o dado do funil (6,1% dos garotos viram profissionais): desanima.

Variante B (`peneiras` diferente de "nenhuma" e `recusado = false`):
- Título: "Antes de tentar de novo, saiba como ela *funciona*."
- P1: "Você já fez {peneirasTexto} e não ficou sem resposta. Ótimo. Mas a maior parte dos garotos fica, e quase nunca é por falta de talento."
- O resto igual à A (P2, campo, P3, destaque, linha pessoal, "Ver os números"), sem o "Dói".

Variante C (`peneiras = nenhuma`):
- Título: "Antes da primeira peneira, saiba como ela *funciona*."
- P1: "Numa peneira com centenas de garotos, ninguém observa cada um com precisão. Quase todo mundo sai sem saber por quê."
- O resto igual à A, sem o P2 (o P1 já diz isso) e sem a linha pessoal.

### T06 · zyron (ato III, a solução)
- Título: "Um clube está procurando {quem} como você."
- P1: "O difícil nunca foi só jogar bem. É ser visto por quem procura o seu perfil."
- Visual: o componente `campo` em modo IA, pequeno (22 pontos acesos, o ponto do atleta pulsa com "O Zyron vê você"), sem foto de atleta. O registro real do rastreamento do site (poster e vídeo) pode entrar no lugar do campo, se o dono mandar a arte; a do site mostra "km/h", e a regra 6 proíbe número de atleta na tela.
- Três passos, que entram em sequência:
  1. "O Zyron lê o seu jogo." Você envia os vídeos das suas partidas. Ele identifica você em campo e mede o seu jogo.
  2. "O seu perfil encontra o clube." As suas características são cruzadas com o que cada clube da nossa rede procura.
  3. "A gente conecta." Um estrategista de carreiras conduz cada passo com você, até o clube.
- Atenção: "um clube está procurando" é a forma que a casa aprovou. Nunca "o clube X tem vaga pra você" nem "a gente sabe qual clube é".
- Pergunta no rodapé (a barra fixa, no lugar do botão "Continuar"): "Você tem vídeo dos seus jogos?" com três chips: "Jogos inteiros" · "Só alguns lances" · "Ainda não". Linha de retorno de 1.100 ms acima da barra: "Ótimo. É com vídeo que o Zyron trabalha." · "Já ajuda. O ideal é jogo inteiro, e a gente mostra como." · "Sem problema. O primeiro passo é gravar, e a gente explica como." Grava `quiz.video` (`jogos`, `lances`, `nada`) e `ficha.temVideo` (`sim` para os dois primeiros, `não` para o terceiro). A pergunta mora na barra pra ficar sempre visível e pra quebrar a sequência de telas de leitura.

### T07 · mundo (a autoridade: já é praticado)
Componente, cartões e fontes em `<bloco_ia_no_futebol>`.
- Rótulo: "O MUNDO JÁ JOGA ASSIM"
- Título: "Clubes da Europa escolhem com dados. Alguns usam IA."
- Abertura: "Os clubes grandes já escolhem com dados há anos. Esse processo acontece por dentro, e o atleta não vê."
- Cartão grande: o Chelsea, com o texto e a fonte do bloco ("Site oficial do Chelsea FC, 14/10/2024").
- Fileira de cartões que se arrastam, com escudo (ou selo de texto onde faltar arquivo), cada um com um fato curto e a etiqueta da fonte.
- Ponte: "Análise por vídeo com IA, agora do lado do atleta. É o que o Zyron faz por você."
- Fecho: "Há peneiras com centenas de vagas e inscrição paga, e a maior parte dos garotos não passa da primeira etapa. Quem lucra com a peneira cheia não quer que você saiba que existe outro caminho." Destaque: "Agora esse caminho chegou até você." (PEN-03 e PEN-01)
- Link "Ver fontes". Nenhuma nota legal na tela.
- Nota pro agente de copy: o fecho é o "eles não querem que você saiba, porque ganham com as avaliações" do pedido do dono, dito sem nomear pessoa nem clube específico (fala de quem lucra com a peneira cheia). Fica nessa forma: direta, genérica e com o dado da inscrição paga ao lado (D8).

### T08 · historico (o resultado da casa)
- Título: "É isso que acontece com quem usa o Zyron."
- Cartões de número, ligados (os números são do dono, `tipo: "declarado_pelo_dono"` no `provas.json`):
  1. "326" · "atletas nossos enviados a clubes do Brasil e do exterior".
  2. "R$ 30 mil por mês" · "é o valor médio que atletas nossos, acompanhados por nós, fecham quando chegam ao profissional". (Modo `faixa`, se o dono quiser trocar: "Entre R$ 5 mil e R$ 30 mil por mês" · "faixa dos contratos fechados por atletas nossos acompanhados".)
  3. "Cerca de 3 meses" · "é o tempo médio que os nossos atletas acompanhados levam até fechar com um clube".
- Dois depoimentos em cartões que se arrastam, ligados (os dois já estão no site do dono, na seção de depoimentos da Zyron, com a foto de cada um): Lucas Silva, atleta ("Fui em mais de 10 peneiras nos últimos 3 anos e nada. Com a Zyron, em menos de 2 meses já estava em contato com um clube em Portugal. O relatório foi o que abriu a porta, não o meu contato.") e Cátia Silva, mãe de atleta ("Já tinha gastado muito com peneira, transporte e inscrição, sempre no escuro. Pela primeira vez eu soube de verdade em que pé estava o meu filho.").
- Nenhuma nota legal, nenhum "sem garantia": o universo está dentro de cada frase ("atletas nossos, acompanhados por nós"), e é isso que a deixa verdadeira.
- Esta é a tela do "resultado médio que já temos" do pedido do dono. É o fecho da prova: a dor, o problema, a IA, os clubes que já fazem, e o que acontece com quem usa.

### T09 · sonho (ato IV, o futuro)
- Título: "Feche os olhos um instante. Onde você se vê jogando?"
- Chips grandes: "Num grande clube do Brasil" · "Na Europa" · "Em qualquer clube que me dê a chance" · "Na seleção"
- Espelho (1.100 ms): "Guardei: {sonho}. A gente parte daí."
- Grava `ficha.sonho`.

### T10 · audio (o ponto alto)
Spec completa em `<bloco_audio>`.
- Abertura sobre fundo preto, uma linha por vez a cada 1,3 segundo (toque acelera): "Imagina." "Daqui a alguns meses, o celular vibra." "É a pessoa que mais torce por você." Depois surge a conversa com "gravando áudio…" e a bolha chega. "Reduzir movimento": tudo de uma vez.
- Título da tela: "E se a sua mãe te enviasse um áudio como esse?" Apoio: "Pense na pessoa que mais torce por você. Aumente o volume."
- Rótulo do remetente: "Mãe de um atleta nosso". Legenda sob o player: "Áudio real, enviado pela mãe de um atleta nosso." Depois do áudio: "Agora imagine a sua." e o botão "Continuar".
- O download do áudio começa quando a T09 aparece (o toque da T09 conta como ativação do usuário). Se o dono desligar o áudio (`audio.ativo = false`), a T10 sai do fluxo.

### T11 · quer (a escada do sim, numa tela só)
- Título: "Você quer viver isso de verdade?"
- Opções: "Quero. É o que eu mais quero." · "Quero, mas já me decepcionei antes." · "Ainda não sei."
- "Ainda não sei": espelho "Sem pressa. O diagnóstico ajuda a decidir." e a tela avança em 1.100 ms, sem o "segurar".
- As outras duas: aparece, embaixo da escolha, o "segurar pra confirmar". Se a escolha foi a segunda, uma linha antes: "Normal. A mãe do áudio também tentou muito antes. O que mudou foi o método." (sem o áudio: "Normal. Quem já tentou muito sabe o valor de um caminho novo. O que muda é o método.")
- Segurar: título "Segure para confirmar." Texto: "Eu quero isso de verdade e vou fazer a minha parte: treinar, me cuidar e seguir um plano." Botão redondo com anel que enche em 1,6 s enquanto o dedo fica; soltou antes, o anel volta; completou: vibração curta (`navigator.vibrate`, se existir), anel verde, check, avança em 700 ms. Acessibilidade: melhoria progressiva sobre um botão comum; com teclado ou leitor de tela, Enter ou Espaço confirmam direto, e há um botão discreto "Confirmar sem segurar" sempre focável.
- Grava `quiz.quer` (`sim`, `receio`, `nao_sei`) e `quiz.compromisso` (verdadeiro se segurou ou confirmou).

### T12 · investimento (ato V)
- Título: "Uma última pergunta."
- Pergunta: "Se você visse um caminho claro pra ser visto por clubes, investiria nele?"
- Chips: "Sim, já separamos um valor." · "Sim, se eu entender como funciona." · "Preciso conversar com a minha família." · "Não tenho como investir agora."
- Espelhos (1.100 ms): "Perfeito. O próximo vídeo mostra tudo." · "Justo. O vídeo explica cada detalhe." · "Faz sentido. Assistam juntos." · "Obrigado por ser sincero. Vamos ver o melhor caminho pra você agora."
- Apoio, em texto natural sob a pergunta: "O diagnóstico é grátis. O acompanhamento é uma assessoria paga, e o vídeo do próximo passo mostra tudo que está incluído e o valor."
- Grava `quiz.investimento` (`separado`, `entender`, `conversar`, `nao`).

### T13 · contato
- Título: "Quase lá. Pra onde enviamos o seu diagnóstico?"
- Apoio (18 ou mais): "O seu nome e o seu WhatsApp. É por lá que a equipe fala com você."
- Apoio (menor): "O nome do responsável e o WhatsApp dele. É por lá que a equipe fala com a família."
- Campos, adulto: "Seu primeiro nome" (`autocomplete="given-name"`, `autocapitalize="words"`, mínimo de 2 letras, aceita acento e hífen) e "WhatsApp com DDD" (máscara (11) 91234-5678; 10 ou 11 dígitos; `inputmode="tel"`, `autocomplete="tel-national"`). Menor: "Seu primeiro nome", "Nome do responsável" (obrigatório) e "WhatsApp do responsável". Sem campo de e-mail.
- Caixa obrigatória e desmarcada, adulto: "Aceito receber o meu diagnóstico e mensagens da Voxen no WhatsApp. Li a Política de Privacidade." (com link). No menor: "Sou o responsável por {nome} e aceito receber o diagnóstico e mensagens da Voxen no WhatsApp. Li a Política de Privacidade."
- Botão: "Ver meu diagnóstico". Sob ele: "Sem spam. Você pode pedir pra parar de receber mensagens quando quiser." e, ao lado de um cadeado, o link "Como usamos seus dados" (Política de Privacidade). Nada de "seus dados ficam protegidos": é promessa que o quiz não pode sustentar sozinho.
- Campo-isca invisível (honeypot) contra robô.
- Ao enviar: monta o payload, pontua, envia (seção `<dados>`) e mostra por 1,5 segundo uma transição honesta ("Montando o seu diagnóstico…"), que não é uma tela do caminho e não finge análise nenhuma: o quiz não faz isso (P14). Falha de rede nunca trava nem aparece pro atleta: entra na fila local.

### T14 · resultado
- Título: "Diagnóstico de {nome}".
- Selo (tiers A e B): "Pronto para o próximo passo". Internamente é "pré-qualificado": significa só que as respostas passaram nas regras da pontuação. Na tela nunca "pré-qualificado", "aprovado", "escolhido" nem "perfil aprovado" (parece seleção por mérito, e o quiz não avalia mérito nenhum).
- Cartão de resumo, só com o que o atleta respondeu: Perfil ("{posicao} · {faixa}"), Histórico ("{peneirasTexto} · {dispensasTexto} sem resposta ou dispensado", some se não fez peneira), Investimento até aqui ("{gastoTexto}", some se "Nada"), Objetivo ("{sonho}"), Vídeo ("{texto da opção}").
- "O que o seu diagnóstico indica" (três linhas, por regra):
  1. Se `recusado`: "Pelo que você contou, o que travou o seu jogo foi ser avaliado a olho, sem nenhum dado." Senão: "Pelo que você contou, o seu próximo passo é ter o seu jogo lido por dados."
  2. "O caminho é ter o seu jogo lido pelo Zyron e apresentado a quem procura o seu perfil."
  3. Se `video` for "nada": "Comece a gravar jogos inteiros: o Zyron trabalha com vídeo." Senão: "O seu vídeo é a base do relatório."
- Botão principal (A e B): "Ver como funciona e o investimento" → `LANDING_URL` (seção `<dados>`). Sob ele: "É um vídeo curto. Se fizer sentido, você segue para o próximo passo."
- Tier B, linha extra acima do botão: "Assista com a sua família. A decisão é melhor tomada junto."
- Tier C: sem selo e sem botão da landing (padrão `roteamento.tierC = "saida"`). Título "Diagnóstico de {nome}". Texto: "Ainda não é o melhor momento para o acompanhamento completo, e tudo bem. Guardamos o seu diagnóstico." Botão: "Seguir @assessoria.voxen". Com `roteamento.tierC = "landing"`, vira igual ao B.
- Sem rodapé de ressalva (regra 5): a tela fecha com o botão e, se ligado, o link do WhatsApp.
- Link secundário opcional (`config.whatsappEquipe`, desligado por padrão): "Falar com a equipe no WhatsApp".

### Telas opcionais (`ativo: false` por padrão)

Existem pra religar, sem mexer em código, se os dados mostrarem que o lead chega frio demais ou que falta informação pro SDR. Cada uma soma uma tela ao caminho.
- **objetivo** (antes da T03): "O que o futebol é pra você?" Opções: "Um hobby que eu amo" · "Uma chance, se tudo der certo" · "Meu objetivo: ser jogador profissional, de verdade". Espelhos: "Respeito. O diagnóstico vale do mesmo jeito." · "Uma chance já é um começo." · "É isso que a gente mais respeita: querer de verdade." Ligada, "hobby" leva ao tier C.
- **experiencia** (depois da T02): "Há quanto tempo você joga de verdade?" Opções: "Menos de 1 ano" · "De 1 a 3 anos" · "De 3 a 5 anos" · "Mais de 5 anos". Grava `ficha.experiencia`.
- **trava** (depois da T03): "O que mais trava a sua carreira hoje?" Opções: "Ninguém viu o meu jogo de verdade" · "Não tenho contato com clubes nem com agentes" · "Já gastei com peneira e não tive retorno" · "Não sei qual clube combina comigo" · "Falta de recursos pra me bancar" · "Tenho dúvida do meu próprio nível". Ligada, a T05 ganha o cartão pessoal: "Você disse que o que mais trava é: "{travaTexto}". Agora dá pra entender de onde vem."
- **epoca** (depois da T02): "Em que época do ano você nasceu?" Chips: "Jan a mar", "Abr a jun", "Jul a set", "Out a dez", "Prefiro não dizer". Só o trimestre (minimização, ver `<conformidade>`, item 4). Ligada, a folha "Ver os números" da T05 ganha a linha pessoal: de julho a dezembro, "Você nasceu de {epoca}. Na sua categoria, tem gente até um ano mais velha que você, e isso costuma pesar numa peneira."; de outubro a dezembro soma "Nesse estudo, só 8,8% dos atletas nasceram nesse trimestre." Nunca diga que o atleta "foi descartado" por isso: os estudos medem sub-representação, não descarte nem talento. Não pontua.

### Ordem de corte e de acréscimo

Meça a perda por tela (os eventos `step_view` e `abandono`). Se uma tela perder mais de 12% de quem chegou até ela, corte na ordem, cada uma com um `ativo: false`: T09 (o áudio já carrega a imaginação), a pergunta do vídeo no rodapé da T06 (o SDR pergunta no WhatsApp; a barra vira só "Continuar"), os depoimentos da T08. Se o lead chegar frio demais ao SDR, religue `objetivo` e `trava`, nessa ordem.

### Pontuação (transparente, em `config/pontuacao.json`)

| Regra | Resposta | Pontos |
| --- | --- | --- |
| quer | sim / receio / não sei | 28 / 17 / 5 |
| compromisso | segurou ou confirmou | 12 |
| investimento | separado / entender / conversar / não | 30 / 22 / 12 / 0 |
| vídeo | jogos / lances / nada | 12 / 8 / 2 |
| dor vivida | 4 por cada: já fez peneira, já foi dispensado, a família investiu R$ 500 ou mais (as duas faixas de cima) | 0 a 12 |
| áudio | ouviu até o fim / mais da metade / menos | 6 / 3 / 0 |

Total máximo: 100. **Tier A:** 70 ou mais, com investimento em `separado` ou `entender` e `quer` diferente de `nao_sei`. **Tier B:** de 45 a 69, ou 70 ou mais com investimento em `conversar`, ou `quer = nao_sei` com 45 ou mais. **Tier C:** abaixo de 45, ou `investimento = nao`. O tier vai no payload, na URL da landing e nos eventos. A pontuação é regra simples; não é IA e a tela não diz que é (P14). A idade, a condição de menor e a época do ano de nascimento NÃO pontuam: pontuar menor seria montar perfil de menor com fim comercial (ECA Digital, ver `<conformidade>`, item 2). Com o áudio desligado, a regra "áudio" vale 0 pra todos (o máximo vira 94) e os limites dos tiers não mudam. Se a tela opcional `objetivo` for ligada, "hobby" leva ao tier C. Exemplos de conferência: quer "sim" 28, compromisso 12, investimento "entender" 22, vídeo "lances" 8, dor 8, áudio até o fim 6 dão 84, tier A; quer "receio" 17, compromisso 12, investimento "conversar" 12, vídeo "lances" 8, dor 4, áudio mais da metade 3 dão 56, tier B; quer "não sei" 5, investimento "não" 0, vídeo "nada" 2 dão 7, tier C.
</fluxo>

<bloco_inimigo>
T05 e T07. É o coração da persuasão: o atleta sai daqui entendendo que o problema nunca foi o talento dele, foi o método de observação.

**A tese, em três passos (nessa ordem)**
1. T05: numa peneira cheia, a atenção segue a bola, o clube quase sempre procura uma posição só, pra uma vaga só, e quem joga longe da bola não é visto. O que o atleta viveu foi falha do método, não dele.
2. T05, no botão "Ver os números": isso já foi medido. Escala, tempo e corte de uma peneira, e o viés da data de nascimento.
3. T07: quem lucra com a peneira cheia não quer que ele saiba que existe outro caminho, e o caminho com dados existe e já é o que os clubes grandes fazem.

**Como falar do inimigo**
- O inimigo é o método (o olhômetro) e quem vive da peneira cheia, dito direto. Sem nomear pessoa nem clube específico, e sem "todos os olheiros".
- A frase de marca do dono, "O problema nunca foi o talento. Sempre foi o método.", é o destaque final da T05 (já é a tese pública do `/institucional`).
- O que vem da experiência da casa ("a peneira abre pra uma posição só, pra uma vaga só") entra como voz da casa, sem virar estatística: não ponha número que a casa não tem.

**Componente `campo` (usado nas T01, T05 e T06)**

Um módulo SVG só, com três modos: `escolha` (T01, formação em pé, 11 posições tocáveis), `jogo` (T05, 22 jogadores) e `ia` (T06, os 22 acesos, pequeno). Reaproveite a ideia e o código do `apresentacoes/jogador-de-elite-r2-novo/assets/bloco.js` e `bloco.css` (campo 4-3-3 contra 4-4-2, foco de luz, contador), copiando pra dentro do `quiz-zyron/`, sem editar o original. A diferença: aqui o campo é em pé (cabe melhor no celular) e tem o atleta dentro.

Coordenadas da casa (x da esquerda pra direita, y de cima pra baixo; ataque pra cima; campo normalizado de 0 a 1; mesmas chaves do `mapa-calor.js` do painel):

| Chave | Posição | x | y (modo escolha) |
| --- | --- | --- | --- |
| GOL | Goleiro | 0,50 | 0,92 |
| LD | Lateral direito | 0,84 | 0,74 |
| ZAG-d | Zagueiro (lado direito) | 0,62 | 0,76 |
| ZAG-e | Zagueiro (lado esquerdo) | 0,38 | 0,76 |
| LE | Lateral esquerdo | 0,16 | 0,74 |
| VOL-d | Volante (lado direito) | 0,64 | 0,58 |
| VOL-e | Volante (lado esquerdo) | 0,36 | 0,58 |
| ADD | Ponta direita | 0,82 | 0,38 |
| MC | Meia central | 0,50 | 0,40 |
| ALE | Ponta esquerda | 0,18 | 0,38 |
| CA | Centroavante | 0,50 | 0,16 |

Modo `jogo`: a casa usa as mesmas posições, comprimidas na metade de baixo (`y' = 0,52 + (y - 0,16) × 0,526`); os adversários são a mesma formação espelhada (`x' = 1 - x`, `y' = 1 - y'`). O atleta é o ponto dourado na posição que ele escolheu (se marcou duas, a principal), com anel e o primeiro nome.

- **Olhômetro:** um foco de luz (raio 0,17 da largura) segue a bola por um caminho de pontos pré-definidos que descarta os que ficam a menos de 0,30 do atleta (se sobrarem menos de 3, usa os 3 mais distantes). Fora do foco, os pontos ficam apagados. O contador diz "Observados agora: 3 de 22" (o número vem de quantos pontos estão dentro do foco, de 2 a 5).
- **IA (Zyron):** todos os 22 acesos; o ponto do atleta pulsa com a legenda "O Zyron vê você"; o contador diz "22 de 22".
- **Controle:** duas abas, "Olhômetro" e "IA (Zyron)". Começa no olhômetro. Se o atleta não tocar, em 5 segundos troca sozinho pra IA uma única vez, com a dica "Toque em Olhômetro pra comparar".
- **Sem número nenhum de atleta** (nota, velocidade, percentual): regra 6. O contador é didático, não dado de jogo.
- **Reduzir movimento:** quadro parado, foco numa posição fixa, as abas continuam trocando o estado.
- **Desempenho:** SVG com transformações CSS (nada de canvas), no máximo 70 nós, um único `requestAnimationFrame` enquanto o campo está visível (`IntersectionObserver` pausa fora da tela).
- **Acessibilidade:** `role="img"` com `aria-label` ("Campo com 22 jogadores. No olhômetro, só os perto da bola são vistos; com IA, todos são acompanhados"), abas com `aria-selected`, contador com `aria-live="polite"`. Na T01, cada posição é um botão de verdade (`aria-label` com o nome da posição), ordem de tab de trás pra frente.

**Provas para a T05 e a T07** (entram em `config/provas.json`, cada uma com `id`, `texto`, `fonte`, `confianca`, `ativo`)

Pesquisa feita em 23/10/2026. Cada fonte foi aberta pelo agente (as acadêmicas pelo resumo oficial).

| id | O que a tela usa | Dado | Fonte, data e link | Conf. | Uso |
| --- | --- | --- | --- | --- | --- |
| PEN-01 | "Cerca de 200 meninos, partidas de 20 minutos, perto de 10% passaram da primeira etapa" | Peneira de um grande clube em 2017: ~200 meninos de 9 a 17 anos | AFP via Estado de Minas, 16/11/2017, `em.com.br/app/noticia/internacional/2017/11/16/interna_internacional,917217/olheiros-no-futebol-a-peneira-para-encontrar-o-proximo-neymar.shtml` | Alta | T05, folha "Ver os números", cartão 1. Cita "AFP, 2017", sem nomear o clube. |
| PEN-02 | "Quase metade nasceu de janeiro a março; de outubro a dezembro, menos de 9%" | 341 atletas da base do São Paulo FC: 47,5% (jan a mar) e 8,8% (out a dez) | Massa et al., Rev Bras Cineantropom Desempenho Hum 16(4), 2014, `periodicos.ufsc.br/index.php/rbcdh/article/view/1980-0037.2014v16n4p399` | Alta | T05, folha "Ver os números", cartão 2, e a linha pessoal da tela opcional `epoca`. |
| PEN-03 | "Existem peneiras com centenas de vagas e inscrição paga" | Fluminense: mais de 350 vagas e taxa de R$ 20 (2019). Internacional/Fefaer: 200 vagas, R$ 40, jogos de 25 min (2014) | Lance, 23/10/2019, `lance.com.br/fluminense/fluminense-realiza-nova-peneira-para-xerem-novembro.html`; Folha BV, 28/10/2014, `folhabv.com.br/?p=1807` | Alta | T07 (fecho), sem nomear clube. Nunca "peneira paga é golpe". |
| PEN-04 | (reserva) "Até 500 garotos por vez nos testes de um grande clube" | Santos: até 500 meninos de 10 a 17 por vez; ~30 mil testados em 2011 | Agência Pública, 22/05/2012, `apublica.org/2012/05/brazil-court-condemns-child-exploitation-major-football-championship/` | Média | Só no painel "ver fontes". Número sem documento do clube. |
| PEN-05 | (reserva) "Em um estudo, 40 de 46 técnicos de base disseram avaliar só por observação" | RN, 2007 a 2009 | Câmara e Alchieri, FIEP Bulletin 80, 2010, `ojs.fiepbulletin.net/fiepbulletin/article/download/894/1724/1764` | Média (um estado) | Só no painel "ver fontes". |
| PEN-06 | (reserva) Viés de idade relativa na Copinha 2023 | n = 3.743; jan a mar com chance 3,59 vezes maior que out a dez | Figueiredo et al., Motriz 32, 2026, `doi.org/10.5016/s1980-6574e10240004` | Alta | Painel "ver fontes". |
| PEN-07 | (reserva) Viés de maturação | Academia inglesa, 202 jogadores: a seleção favorece quem amadurece cedo a partir do sub-12 | Hill et al., J Sports Sci 38, 2020, `doi.org/10.1080/02640414.2019.1649524` | Alta (uma academia) | Painel "ver fontes". |
| PEN-08 | (reserva) Meta-análise do efeito da idade relativa | 38 estudos, 14 esportes | Cobley et al., Sports Med 2009, `doi.org/10.2165/00007256-200939030-00005` | Alta | Painel "ver fontes". |
| PEN-09 | (reserva) "A tecnologia aliada à experiência dos observadores" | Santos descreve captação em fases e uso de tecnologia | Estadão Conteúdo via Band B, 10/02/2022, `bandab.com.br/esporte/futebol/olheiro-se-moderniza-mercado-da-bola/` | Média | Reforça "IA + gente". |

**Frases aprovadas pelo levantamento** (podem ir pra tela como estão, com a fonte)
1. "Numa peneira de 2017, cerca de 200 meninos jogaram partidas de 20 minutos e perto de 10% passaram de fase." (PEN-01)
2. "Na base de um grande clube paulista, 47,5% dos atletas nasceram de janeiro a março e só 8,8% de outubro a dezembro." (PEN-02)
3. "Um estudo de 2020 numa academia inglesa mostrou que, a partir dos 12 anos, a seleção passa a favorecer quem amadurece mais cedo." (PEN-07)
4. "Na Copinha de 2023, quem nasceu de janeiro a março teve cerca de 3,6 vezes mais chance de estar entre os inscritos que quem nasceu de outubro a dezembro." (PEN-06)

**O que fica de fora** (número ou fato que ninguém mediu, ou que é falso)
- Cronômetro por atleta ("o olheiro decide em 5 minutos", "avalia centenas por dia"): ninguém mediu. Diga o que existe: partidas de 20 a 25 minutos e centenas de inscritos (PEN-01, PEN-03).
- Percentual de quem chega lá ("só 1%", "1 em 3 mil"): no Brasil só há estimativa sem método rastreável, e o dado sólido (Espanha, 6,1% viram profissionais) desanima.
- "Peneira paga é golpe ou ilegal": clube grande anunciou taxa e não há lei federal que proíba (a Lei 14.597/2023 não trata de taxa em peneira). Golpe é site falso com nome de clube.
- "Quem nasce no fim do ano é descartado" ou "tem menos talento": os estudos medem sub-representação, não descarte nem talento.
- Ofender quem está na peneira ("a maioria só perde tempo"): use "a maior parte não passa da primeira etapa" (PEN-01).

**Número do atleta como prova própria (a linha pessoal da T05).** O que o atleta respondeu (peneiras e faixa de gasto) volta como pergunta. Nunca como valor exato inventado: mostre o texto da faixa que ele marcou.
</bloco_inimigo>

<bloco_ia_no_futebol>
T07. A autoridade: o mundo já joga assim, com os escudos que o dono pediu e o fato de cada clube na fonte.

**Regra de ouro:** "análise de dados" é o termo-base. "IA" só quando a fonte usa a palavra, e sempre atribuída ("segundo o site oficial do clube", "disse o diretor esportivo", "segundo a fornecedora"). A tela diz que dados e IA APOIAM a decisão (olheiros e treinadores seguem decidindo). Isso é fiel às fontes e casa com a oferta da casa: a IA encontra, a gente conduz.

**O Chelsea, conferido no ar pelo autor deste briefing em 23/10/2026.** A página oficial "Introducing the Future Blues recruitment programme", do site do clube, publicada em 14/10/2024, diz (tradução livre): o clube "continua a ampliar a busca por talentos no mundo usando tecnologia de IA", que "permite à Academia avaliar vídeos online e comparar jovens com o elenco atual"; o aplicativo da aiScout recebe vídeos de testes feitos pelo celular, uma IA "rastreia, analisa e ranqueia o desempenho", e os dados ajudam olheiros e treinadores a decidir. Isto vale para o recrutamento da BASE (Academia), não para o time principal. Dois resumos de busca que um colega leu divergiam sobre o clube "citar IA"; a leitura direta da página resolve: cita.

**Layout:** um cartão grande do Chelsea no topo (escudo ou selo de texto, o fato e a fonte clicável) e, abaixo, uma fileira que se arrasta de lado com os outros cartões. Cada cartão tem escudo (arquivo da casa) ou selo de texto (círculo com as iniciais), nome do clube, o fato em até 22 palavras e a etiqueta da fonte. Embaixo da fileira: a ponte, o fecho da T07 e o link "Ver fontes" (abre uma folha com veículo, data, link e "consultado em 23/10/2026" de cada item).

| # | Clube | Escudo | Texto na tela | Fonte (veículo, data) e link | Conf. |
| --- | --- | --- | --- | --- | --- |
| 0 | Chelsea (cartão grande) | Sem arquivo na casa: selo de texto "CHELSEA FC" (ou o arquivo que o dono mandar) | "Em 2024, o Chelsea apresentou o Future Blues, projeto de recrutamento da base: jovens de qualquer lugar do mundo fazem testes pelo celular e uma IA analisa e pontua o desempenho. A IA ajuda olheiros e treinadores a decidir." | Site oficial do Chelsea FC, 14/10/2024, `chelseafc.com/en/news/article/introducing-the-future-blues-recruitment-programme` | Alta |
| 1 | Brighton | `brighton.webp` (casa) | "Um modelo de dados próprio filtra os alvos antes de os olheiros irem ver ao vivo." | Training Ground Guru, 21/11/2024, `trainingground.guru/brighton-make-trio-of-senior-scouts-redundant/`; Football365, 12/11/2024 | Alta |
| 2 | Liverpool | Selo de texto | "Usou modelos estatísticos próprios pra apoiar contratações, segundo o ex-diretor de pesquisa do clube." | Sky Sports, 21/08/2024, `skysports.com/football/news/11669/13200552/liverpool-s-former-director-of-research-ian-graham-explains-how-data-helped-the-reds-win-the-premier-league-title` | Alta |
| 3 | Bayer Leverkusen | Selo de texto | "O diretor esportivo disse, em 2021, que o clube analisa milhões de dados com inteligência artificial pra pré-selecionar jogadores." | Stadium Astro, 28/01/2021, `english.stadiumastro.com/node/269427`; Sky Sports, 03/03/2022 | Média a alta (entrevista via fornecedor) |
| 4 | Bologna | `bologna.webp` (casa) | "Foi o primeiro clube a adotar o Opta Vision, ferramenta de visão computacional pra olheiros, segundo a Stats Perform." | SVG Europe, 21/04/2023, `svgeurope.org/blog/headlines/bologna-fc-becomes-fist-club-to-use-stats-performs-opta-vision/` | Média (texto do fornecedor) |
| 5 | Brentford e Midtjylland | `midtjylland.webp` (casa) e selo de texto do Brentford | "Usam estatística pra filtrar milhares de jogadores por posição antes de os olheiros e o treinador decidirem." | Training Ground Guru, 07/11/2023, `trainingground.guru/lee-dykes-the-seven-stages-of-brentfords-recruitment/`; Independent, 26/10/2020 | Alta |
| 6 | No Brasil: Internacional, Corinthians e Sport | `internacional.webp`, `corinthians.webp`, `sport.webp` (casa) | "No Brasil, esses três clubes também investem em ciência de dados pra decidir contratações." | ESPN Brasil, 08/03/2024, `espn.com.br/futebol/mercado-da-bola/artigo/_/id/13342579/como-clubes-brasileiros-investiram-scouting-diminuir-chance-erro-contratacoes` | Média |

Os escudos da casa estão em `apresentacoes/jogador-de-elite-r2-novo/assets/bloco/clubes/<chave>.webp` (copie os que usar). Não existem arquivos de Chelsea, Liverpool, Leverkusen e Brentford: selo de texto até o dono mandar o arquivo.

**Título da tela:** "Clubes da Europa escolhem com dados. Alguns usam IA." (e NÃO "já não contratam pelo olhar": a frase do site do dono não se sustenta, ver abaixo).

**Ponte, depois da fileira:** "Análise por vídeo com IA, agora do lado do atleta. É o que o Zyron faz por você."

**Frases que NÃO podem ir pra tela** (o levantamento não achou fonte, ou achou fonte contrária)
- "O Chelsea usa IA pra captar jogadores" (sem "base" e sem "ajuda a decidir"): só há o aplicativo no recrutamento da Academia; pro time principal as fontes falam de dados, sem IA.
- "Brighton, Ajax, Leverkusen e Benfica acham talentos que nenhum olheiro tinha visto" (é a frase do `/avaliacao`): nenhuma fonte diz isso. O fluxo documentado é dados primeiro e olheiro depois (Brighton, Brentford). O Ajax é contraexemplo: um relatório sobre a gestão de Mislintat apontou olheiros ignorados e mais de 110 milhões de euros em contratações ruins. Pro Brighton, Ajax e Benfica as fontes falam de dados, modelos e tracking, não de IA.
- "Real Madrid, Bayern ou Milan usam IA": sem fonte independente (só marketing de fornecedor ou notas sem fonte).
- "O Liverpool usa IA": o TacticAI, da DeepMind, é de escanteios, não de recrutamento.
- "Os clubes europeus não contratam mais pelo olhar": o chefe de scouting do Barcelona diz que ver o jogador ao vivo segue sendo fundamental (Mundo Deportivo via AfricaSoccer, 11/10/2026).
- Qualquer "X% de acerto" (Plaier "90%", aiScout "100% de eficiência"): alegação do fornecedor.
- "Quem não se adaptar vai ficar pra trás" (frase do `/institucional`): é pressão fabricada (regra 9).

**Vigência.** Cada item tem `conferidoEm: "2026-10-23"`. Revalide a cada 90 dias e antes de qualquer verba nova de anúncio. A fonte do cartão 0 precisa continuar no ar: o teste de publicação confere o link (200 e o texto "AI").

**Escudos.** Ligados (`escudos.modo = "escudos"`). O valor `"texto"` troca tudo por selo de texto (círculo com as iniciais e o nome), se o dono quiser. Nenhuma nota na tela.
</bloco_ia_no_futebol>

<bloco_audio>
T09 e T10. É o ponto mais emocional do quiz: o atleta ouve uma mãe de verdade chorando de alegria, no formato de uma mensagem de voz, depois de entender o inimigo, de ver o jeito novo e de imaginar o próprio futuro.

**O arquivo.** `1001.MP3` na raiz do repo, idêntico byte a byte ao `depoimento-mae.mp3` que o slide 18 do R2 já usa (902.841 bytes, 37,6 segundos, 192 kbps, estéreo, 44,1 kHz). Copie pra `quiz-zyron/assets/audio/depoimento-mae.mp3`. Se conseguir um `ffmpeg` (por exemplo `uv run --with imageio-ffmpeg`), gere também uma versão mono de 64 kbps pra 4G e sirva as duas com `<source>`; senão, o original serve. Servir com `Content-Type: audio/mpeg`, `Accept-Ranges: bytes` e cache longo (nome com hash).

**Transcrição automática (Whisper medium, conferida só no texto; ninguém ouviu).** A primeira frase é duvidosa ("Eu odeio" é quase certamente erro de reconhecimento). O dono precisa ouvir antes de qualquer legenda ir pro ar (D6).

| Tempo | Texto reconhecido |
| --- | --- |
| 0,0 a 6,0 | "Eu odeio, meu Deus, eu não consigo te falar, eu tô, assim, chorando aqui, chorando de alegria." (duvidoso) |
| 6,0 a 10,5 | "Tô aqui com o irmão dele, meu filho, finalmente, finalmente conseguiu ir pro time, acredita?" |
| 10,5 a 14,5 | "A gente tentou tanto, tanto, e sempre se enganavam com ele, né?" |
| 14,5 a 18,5 | "Nunca, nunca reconheceram, nunca reconheceram o talento dele, nunca mesmo." |
| 18,5 a 24,0 | "E olha, ofereceram 5 mil por mês, e agora ele tá recebendo o que ele merece, graças a você, meu filho." |
| 24,0 a 29,5 | "Deus te colocou na minha vida, você mudou a vida dele e a nossa também, meu Deus do céu, eu nem sei." |
| 29,5 a 33,0 | "Eu não consigo nem explicar, meu coração tá explodindo de alegria." |
| 33,0 a 37,5 | "Eu só quero te agradecer de todo coração de verdade, David, muito obrigada, muito obrigada mesmo." |

Por que ela está no ponto certo: a linha "nunca reconheceram o talento dele" cai logo depois do capítulo do olhômetro. Não corte nem esconda trecho nenhum do áudio.

**Posição no fluxo.** T09 (o sonho: o atleta fecha os olhos e escolhe) → T10 (a abertura em texto, "Um áudio.", e depois o áudio) → T11 ("Você quer viver isso de verdade?"). A pergunta do dono, "E se a sua mãe te enviasse um áudio como esse?", é o título da T10.

**O que a tela mostra.** O áudio é real e aparece como real, como prova (P8). A pergunta é a imaginação; a legenda embaixo do player é: "Áudio real, enviado pela mãe de um atleta nosso." O rótulo do remetente na bolha é "Mãe de um atleta nosso", sem foto e sem "online" (não finja status). Depois do áudio, uma linha: "Agora imagine a sua." Nenhum prazo, vaga ou preço nesta tela, e o botão "Continuar" é neutro.

**Componente `audio-voz`: mensagem de voz, sem marca de aplicativo nenhum** (sem logo, sem o nome do aplicativo, sem tique duplo: a bolha é de mensagem RECEBIDA, à esquerda).
- Moldura de conversa escura (`--chat-bg`), cabeçalho simples com a silhueta genérica e o rótulo, fundo com pontos sutis em CSS. Bolha recebida (`--bolha-in`), cantos de 14 px com a ponta do lado do remetente.
- Dentro da bolha: botão de tocar redondo (52 px), forma de onda de 48 barras, tempo, velocidade (1x, 1,5x, 2x) e o ícone de microfone, que passa de cinza a azul quando o áudio começa (convenção de "já ouvido").
- **Forma de onda real, não aleatória:** script `ferramentas/gera-waveform.py` (rode com `uv run --python 3.12 --no-project --with soundfile --with numpy python -I`; `soundfile` já lê este MP3, testado): divide o áudio em 48 janelas, calcula o RMS de cada, normaliza de 0 a 1 com gama 0,6 e grava `waveform.json`.
- **Chegada (ao entrar na T10, depois das três linhas de abertura em texto):** "gravando áudio…" (microfone e três pontos) por 1,4 s; a bolha sobe (translateY de 12 px a 0, opacidade, 280 ms) com `navigator.vibrate(40)` se existir e houver ativação do usuário (o toque numa opção da T09 conta); em 1,8 s o botão de tocar pulsa (anel que se expande a cada 1,6 s) e aparece a dica "Toque pra ouvir. Aumente o volume."
- **Tocar:** só por toque do atleta (navegador bloqueia autoplay; não tente contornar). O botão chama `audio.play()` dentro do próprio toque. Use um elemento `<audio>` (não Web Audio: no iPhone o `<audio>` toca mesmo no silencioso). Botão vira pausa; as barras mudam de `--onda-off` a `--onda-on` conforme `currentTime / duration` (`timeupdate` mais `requestAnimationFrame`); o tempo mostra o decorrido ("0:07") e, parado, o total ("0:38"); arrastar ou tocar na onda faz o seek (eventos de ponteiro). `preservesPitch` ligado na troca de velocidade.
- **Fim (`ended` ou 95% ou mais):** onda cheia, botão vira "ouvir de novo", surge a linha "Agora imagine a sua." e o botão dourado "Continuar" (fade de 300 ms).
- **Nunca trava o funil:** se `play()` for rejeitado, a bolha mostra "Toque de novo"; se der erro de rede, "Não foi possível carregar o áudio" e um botão "Continuar sem o áudio"; se o atleta não tocar, o "Continuar" aparece depois de 10 s na tela. O estado vai pro payload como `quiz.audio.estado`: `ate_o_fim`, `mais_da_metade`, `menos`, `nao_tocou` ou `erro`.
- **Legendas:** desligadas por padrão (`legendas.ativo = false`) até o dono confirmar a transcrição. Ligadas, só duas frases em destaque, nos tempos 14,5 s ("Nunca reconheceram o talento dele.") e 24,5 s ("Você mudou a vida dele e a nossa também."), com o texto aprovado pelo dono.
- **Pré-carga:** `preload="none"` até a T09 aparecer; ao tocar uma opção da T09, o quiz chama `audio.load()`. Nada de som antes do toque.
- **Acessibilidade:** `role="group"` com `aria-label="Mensagem de voz"`; botão com `aria-label` "Tocar áudio" ou "Pausar áudio"; a onda é um `role="slider"` com `aria-valuenow` em segundos e controle por setas; foco visível; `prefers-reduced-motion` tira o pulso e o deslize e mantém o progresso.
- **Pontuação:** `ate_o_fim` 6 pontos, `mais_da_metade` 3, o resto 0.
- **Eventos:** `audio_view`, `audio_play`, `audio_pause`, `audio_progress` (25, 50, 75, 100), `audio_end`, `audio_seek`, `audio_error`, `audio_skip`.
</bloco_audio>

<sistema_visual>
O quiz é a porta de entrada pública da marca Voxen | Zyron, e a landing que vem depois herda a identidade do `aizyron.com`. Tem que parecer produto premium num celular Android intermediário, dentro do navegador do Instagram, e é o oposto do quiz de referência que o dono chamou de amador.

**Fonte única dos tokens: `css/tokens.css`.** Todo agente usa só variáveis, nunca valor solto. Os valores vêm do CSS e dos componentes do site (`index-aPGNK9Mg.css`, `Institucional-*.js`, lidos em 23/10/2026).

```css
:root {
  /* superfícies (o site usa hsl(0 0% 4%), 7%, 14%) */
  --bg: #0A0A0A;  --bg-2: #0E0E0E;  --card: #121212;  --card-2: #171717;
  --line: #242424;  --line-2: #2E2E2E;
  /* texto */
  --text: #F2F2F2;  --text-2: #C9C9C9;  --muted: #8C8C8C;      /* contraste de --muted sobre --bg: 5,9 */
  /* dourado: ação, destaque e o atleta */
  --gold: #FBBF24;  --gold-2: #F59E0B;  --gold-soft: #FDE68A;  --gold-ink: #1A1203;
  --grad-gold: linear-gradient(135deg, #F59E0B, #FBBF24);      /* botão primário */
  /* verde: o Zyron, a IA, o método novo, confirmação */
  --ai: #34D399;  --ai-2: #22C55E;
  /* laranja: só o inimigo (olhômetro, peneira em massa); é o #F97316 que o site já usa */
  --enemy: #F97316;  --enemy-soft: #FDBA74;
  --danger: #F87171;                                           /* só erro de formulário */
  /* conversa de voz */
  --chat-bg: #0B1014;  --bolha-in: #1F2A30;  --onda-off: #5B6B73;  --onda-on: var(--gold);
  /* forma */
  --r-sm: 10px;  --r: 14px;  --r-lg: 20px;
  --ease: cubic-bezier(.2,.8,.2,1);
}
```

O agente de QA calcula e registra os contrastes de todos os pares texto/fundo (mínimo 4,5 pra texto, 3 pra elemento gráfico) em `docs/contraste.md`. Referência: ouro sobre `--bg` dá cerca de 11,7; `--gold-ink` sobre o botão dourado, cerca de 10,9.

**Tipografia.** Inter Variable no texto e na interface. Playfair Display em itálico, só nas palavras de ênfase dos títulos (uma por título, em `--gold`) e no texto da abertura do áudio (T10), como no `/institucional`. Hospede os arquivos você mesmo (woff2, subconjuntos latin e latin-ext, que cobrem todos os acentos do português; licença OFL), `font-display: swap`, pré-carregue o Inter 700 e o Playfair itálico; no máximo 120 KB de fonte. Nenhuma chamada a servidor de fonte de terceiro (velocidade e privacidade). Escala:

| Uso | Tamanho | Peso | Linha |
| --- | --- | --- | --- |
| Título | `clamp(28px, 7.8vw, 40px)` | 800, espaçamento -0,02 em | 1,08 |
| Título do resultado | 44 px | 800 | 1,05 |
| Corpo | 17 px | 400 | 1,5 |
| Apoio | 15 px, `--text-2` | 400 | 1,45 |
| Rótulo de capítulo | 12 px, caixa alta, espaçamento 0,14 em, `--gold` | 600 | 1 |
| Etiqueta da fonte (nos cartões de prova) | 12,5 px, `--muted` | 400 | 1,4 |
| Número de destaque (cartões de prova) | 56 px, números tabulares | 800 | 1 |
| Campo de formulário | 16 px (menos que isso faz o iPhone dar zoom) | 500 | 1,2 |

**Layout.** Coluna única de até 480 px, centrada, margens de 20 px. Cabeçalho de 56 px: seta de voltar (alvo de 44 por 44), a marca e a barra de progresso contínua (3 px, `--gold`) colada embaixo. Altura com `100svh` (com `dvh` de reserva) e `env(safe-area-inset-*)`. A ação principal mora numa barra fixa embaixo, sempre no mesmo lugar, com degradê de fundo pra não cortar o texto e `padding-bottom: calc(16px + env(safe-area-inset-bottom))`. Com o teclado aberto, use `visualViewport` pra o botão não ficar escondido. Alvos de toque de pelo menos 48 px e 8 px entre eles. Em desktop (1440 px) a coluna continua de 480 px, centrada, com um brilho radial dourado ao fundo: o quiz é pensado pro celular, mas tem que ficar bonito no computador, e nunca esticar.

**Componentes** (`css/componentes.css` e `js/componentes/`, um arquivo por componente)
1. `opcao`: cartão de escolha única, altura mínima de 60 px, raio `--r`, borda `--line`, fundo `--card`, ícone opcional. Ao tocar: borda `--gold`, fundo com 8% de dourado, check dourado, `scale(.985)` por 120 ms; bloqueia toque repetido. O espelho (uma linha) aparece embaixo, com uma barra dourada à esquerda e `--text-2`.
2. `botao-primario`: 56 px, raio `--r`, `--grad-gold`, texto `--gold-ink` 17 px 700, sombra `0 12px 32px -12px rgba(245,158,11,.5)`; estados hover, active, disabled (40%) e focus-visible (anel de 3 px em `--gold-soft`, 2 px de folga). `botao-secundario`: transparente com borda `--line-2`.
3. `chips-grandes`: as respostas de um toque (idade, peneiras, gasto, dispensas, sonho, investimento): altura mínima de 56 px, em grade de 2 colunas ou em lista, com o mesmo estado de toque da `opcao`. A segunda pergunta de uma tela (T03) entra por baixo, com fade de 180 ms. A pergunta do vídeo da T06 mora na barra fixa do rodapé, no lugar do botão.
4. `campo-texto`: 56 px, rótulo visível (placeholder não é rótulo), erro em linha com ícone e texto (nunca só cor), `inputmode` e `autocomplete` certos.
5. `chips-pequenos`: a época do ano da tela opcional `epoca` (os quatro trimestres).
6. `progresso`: barra contínua de 3 px, com o rótulo do ato ao lado da marca.
7. `campo` e `audio-voz`: ver `<bloco_inimigo>` e `<bloco_audio>`.
8. `cartao-prova` (número grande, legenda, fonte), `fileira-escudos` (rolagem lateral com snap), `folha-fontes` (painel que sobe de baixo, com foco preso e fecha por Esc ou arrastando), `segurar` (anel de confirmação da T11), `selo`, `resumo` (cartão do diagnóstico), `folha-cookies` (só depois da idade, só pra adulto e só se houver ID de pixel configurado, com "Aceitar" e "Rejeitar" do mesmo tamanho e peso).
9. `transicao`: troca de tela com fade mais deslize de 24 px em 240 ms (saída de 160 ms). Com "reduzir movimento": só fade de 120 ms.

**Movimento.** Movimento serve à história, não enfeita. Entrada do texto narrativo: `blur(6px)` a 0 mais `translateY(8px)` a 0, 600 ms, `--ease`, escalonada de 90 ms. Só `transform`, `opacity` e (nas cenas) `filter`. 60 fps num Android intermediário. Nenhuma biblioteca de animação. `will-change` só durante a animação. Tudo pausa com a aba oculta. `prefers-reduced-motion` é respeitado em todo componente. Vibração (`navigator.vibrate`) só em três momentos, com detecção de suporte: compromisso concluído (T11), chegada do áudio (T10) e resultado (T14). Nenhum som além do áudio da mãe, e esse só por toque.

**Cenas** (T05 a T07, T09, T10 e T14): brilho radial dourado no topo (`radial-gradient(60% 40% at 50% 0%, rgba(245,158,11,.14), transparent)`), grade de pontos de campo a 6% de opacidade. A abertura da T10 é preto puro (`#000`) e silenciosa. O cartão de resumo da T14 tem moldura dourada fina.

**Cor por função** (semântica, não decoração): dourado é ação, destaque e o atleta; verde é o Zyron, a IA, o método novo e confirmação; laranja é só o inimigo (olhômetro, peneira em massa, "o preço de procurar no escuro"); vermelho é só erro de formulário. Nunca laranja e verde no mesmo cartão sem rótulo, e nunca cor como única informação.

**Marca e imagens.** O Z do `/avaliacao` (quadrado grafite com o Z branco; baixe o `favicon.svg` do `aizyron.com` e use inline) como logotipo do cabeçalho. Nenhuma imagem gerada por IA e nenhuma foto nova. Fotos de depoimento e poster do rastreamento: só as que o site já usa. Escudos: ver `<bloco_ia_no_futebol>`.

**O que deixa um quiz com cara de amador, e o que fazer no lugar**

| Sintoma | Aqui |
| --- | --- |
| Fonte do sistema e hierarquia de tamanho fraca | Inter mais Playfair itálico, escala fixa acima |
| Parede de texto | Até 3 blocos de 2 linhas por tela; o resto vira visual |
| Botões de largura e cor diferentes a cada tela | Um botão primário, sempre na mesma barra, no mesmo lugar |
| Nenhum retorno do que foi respondido | Espelho de uma linha por resposta |
| Sem noção de progresso | Barra contínua com o ato nomeado |
| Troca de tela seca | Transição de 240 ms |
| Multi-escolha que avança no primeiro toque e limite que não é aplicado | Nenhuma pergunta de múltipla escolha; a tela com duas perguntas (T03) só avança depois das duas respostas |
| Escassez e personalização fingidas (contador que recomeça, "perfil aprovado" pra todos) | Nenhuma: só dado real da semana (regra 7) e espelho que repete o que o atleta respondeu |
| Voltar nativo do celular que expulsa do funil | `pushState` por tela, voltar uma tela por vez |
| Campo de contato sem máscara nem teclado certo | `inputmode`, máscara, erro claro |
| Ícones e emojis soltos de pacotes diferentes | Um conjunto de ícones SVG inline, traço de 1,75 px |
| Imagem pesada e pulo de layout | WebP de até 60 KB, dimensões fixas, CLS abaixo de 0,05 |

**Guia visual.** O agente de visual entrega `docs/guia-visual.md` (tokens, componentes, capturas das telas-chave e as decisões) e o QA compara o resultado com o `aizyron.com/institucional` e o `/avaliacao` em capturas lado a lado: a marca tem que ser reconhecível, e o quiz tem que parecer mais cuidado que os dois.

**Desempenho (orçamento).** Primeira carga abaixo de 350 KB transferidos, sem contar o áudio. JavaScript abaixo de 80 KB comprimidos. CSS abaixo de 40 KB. LCP abaixo de 2,5 s em 4G simulado. Sem framework: módulos ES nativos, uma configuração por tela e um motor pequeno.
</sistema_visual>

<dados>
Tudo que o quiz coleta, calcula e envia. Estático por decisão (P11): não existe servidor nosso. O destino do lead é um endpoint externo configurável.

**Princípios**
1. Coleta mínima: só o que a ficha e a pré-qualificação precisam. Nenhum texto livre além do primeiro nome (e do nome do responsável, no menor). Sem e-mail.
2. Nenhum dado de contato (nome, telefone, e-mail) em URL, em evento, em console ou em pixel de menor.
3. Nenhuma tag de terceiro antes de a idade ser respondida e do aceite de cookies (adulto), e nunca pra menor de 18, sem idade ou em dúvida (seção `<conformidade>`, item 1).
4. Tudo que muda sem código vai em `config/geral.json`, e o estado de cada tela e prova em `config/*.json`.
5. Falha de rede nunca aparece pro atleta nem trava o funil.

**`config/geral.json`**: `versao`, `landingUrl`, `endpoint`, `endpointEventos` (opcional; sem ele os eventos vão ao `endpoint` com `tipo: "evento"`), `politicaUrl` (`https://aizyron.com/privacidade`) e `termosUrl` (`https://aizyron.com/termos`) (as duas rotas existem no site, conferidas no código em 23/10/2026; confirme no ar), `instagramUrl` (`https://www.instagram.com/assessoria.voxen`), `whatsappEquipe` (desligado), `pixel.meta` e `pixel.utmify` (vazios), `pixel.menores` (`"nenhum"`), `vagas` e `proximaTurma` (nulos; escassez só com dado real, regra 7), `roteamento.tierC` (`"saida"` ou `"landing"`), `escudos.modo` (`"escudos"` ou `"texto"`), `legendas.ativo` (falso), `telasOpcionais` (`objetivo`, `experiencia`, `trava` e `epoca`, todas falsas), `audio.ativo` (verdadeiro), `provas.renda.modo` (`"media"` por padrão, que é a frase do dono; `"faixa"` mostra a faixa de R$ 5 a 30 mil), `debug` (falso). Sem `endpoint` (o dono autentica o destino depois, e é só preencher), o quiz entra em MODO DE ENSAIO: guarda o payload no navegador e mostra um aviso só em `?debug=1`.

**Chaves da ficha: as mesmas do painel.** O lead tem que poder virar ficha do Painel do Closer sem tradução. As chaves e os limites vêm de `apresentacoes/jogador-de-elite-closer/painel.js` e `api/_base.js`: `nome`, `posicao`, `idade`, `peneirasFeitas` (0 a 200), `gastoPeneiras` (0 a 5.000.000), `sonho`, `temVideo` (`sim` ou `não`) e `origem` (`"Quiz Zyron"`); `experiencia` só existe se a tela opcional for ligada.

**Payload v1** (enviado uma vez, no envio do contato)
```json
{
  "v": 1,
  "leadId": "7f3c1a0e-5b7e-4a26-9c52-0d4b6f6a1e90",
  "criadoEm": "2026-10-23T14:02:11-03:00",
  "enviadoEm": "2026-10-23T14:05:40-03:00",
  "duracaoSeg": 209,
  "ficha": {
    "nome": "João", "idade": 16, "posicao": "Lateral direito",
    "peneirasFeitas": 4, "gastoPeneiras": 1250,
    "sonho": "Na Europa", "temVideo": "sim", "origem": "Quiz Zyron"
  },
  "quiz": {
    "idadeFaixa": "15_17", "idadeEstimada": true, "peneirasFaixa": "3_5", "peneirasEstimado": true,
    "gastoFaixa": "R$ 500 a R$ 2.000", "gastoEstimado": true,
    "dispensas": "3_5", "recusado": true, "posicaoChave": "LD",
    "video": "lances", "audio": { "estado": "ate_o_fim", "pct": 100 },
    "quer": "sim", "compromisso": true, "investimento": "entender"
  },
  "contato": { "responsavelNome": "Maria Silva", "whatsapp": "+5511912345678" },
  "consentimento": {
    "aceite": true, "texto": "Sou o responsável por João e aceito receber o diagnóstico e mensagens da Voxen no WhatsApp. Li a Política de Privacidade.",
    "textoVersao": "2026-10-23", "politicaVersao": "2026-10-23", "responsavelPresente": true, "em": "2026-10-23T14:05:39-03:00"
  },
  "pontuacao": { "total": 88, "porRegra": { "quer": 28, "compromisso": 12, "investimento": 22, "video": 8, "dor": 12, "audio": 6 }, "tier": "A" },
  "rastreio": { "utm_source": "instagram", "utm_medium": "paid", "utm_campaign": "...", "utm_content": "...", "utm_term": null, "fbclid": null, "referrer": "", "plataforma": "ios", "inApp": "instagram" },
  "tecnico": { "versaoQuiz": "1.0.0", "viewport": "390x844", "idioma": "pt-BR", "caminho": ["posicao", "idade", "peneiras", "dispensas", "inimigo"], "sessaoId": null, "suspeito": false }
}
```
Regras: `contato.responsavelNome` e `consentimento.responsavelPresente` só existem pra menor de 18 (nulos pra adulto); no menor, `contato.whatsapp` é o do responsável. `idade`, `peneirasFeitas` e `gastoPeneiras` são ESTIMATIVAS (valor médio da faixa, com `quiz.idadeEstimada`, `quiz.peneirasEstimado` e `quiz.gastoEstimado` verdadeiros; o SDR confirma no WhatsApp). `ficha.nome` é o primeiro nome da T13; não há nome completo nem e-mail. `rastreio.fbclid`, `rastreio.gclid` e `tecnico.sessaoId` só existem pra adulto com aceite (nulos pra menor, como no exemplo). O `leadId` nasce no envio do contato, não antes. A pontuação não usa idade nem condição de menor. `suspeito` é verdadeiro se o campo-isca vier preenchido ou se `duracaoSeg` for menor que 45 (o lead segue, marcado). O arquivo `config/payload.schema.json` (JSON Schema 2020-12) valida isso nos testes, com exemplos de adulto com peneiras, adulto sem peneiras, menor de 18 e menor de 12 (que não gera payload).

**Eventos** (`config/eventos.json`; nenhum leva nome, telefone, e-mail, texto livre nem idade exata). Todo evento leva só um `sessaoId` (aleatório por visita, só em memória, nunca gravado no aparelho), então a análise de funil é anônima pra qualquer idade.

| Evento | Quando | Parâmetros |
| --- | --- | --- |
| `quiz_view` | T01 visível | `utm_*`, `plataforma`, `inApp`, `versao` |
| `quiz_start` | resposta da T01 (a posição) | nenhum |
| `step_view` | cada tela exibida | `id`, `n` (posição no caminho), `ms` desde a anterior |
| `step_answer` | cada resposta | `id`, valor categórico (nunca texto livre) |
| `step_back` | voltar | `id` |
| `menor_declarado` | idade de 12 a 17 | `faixa` (`12_14` ou `15_17`) |
| `menor12_saida` | T02, chip "Menos de 12" | nenhum |
| `campo_toggle` | aba do campo | `modo` |
| `prova_fontes_open` | abriu "ver fontes" | `tela` |
| `audio_view` até `audio_skip` | ver `<bloco_audio>` | `pct`, `estado` |
| `compromisso` | segurar concluído | `ms` |
| `contact_submit` | enviar o contato | `tier`, `total`, `adulto` (booleano), `duracaoSeg` |
| `lead_enviado` e `lead_fila` | sucesso e falha de rede | `tentativa` |
| `quiz_complete` | T14 exibida | `tier`, `total` |
| `cta_click` | botão da landing | `tier` |
| `tierC_click` | botão do Instagram (tier C) | nenhum |
| `abandono` | `pagehide` ou `visibilitychange` oculto antes do fim | `id` da última tela, `n` |
| `erro_js` | erro não tratado | mensagem curta, `id` da tela |

Eventos seguem em lotes por `navigator.sendBeacon` ao nosso destino (primeira parte, sem identificador pessoal). Ao pixel (Meta ou Utmify): só pra adulto (18 ou mais), só depois do aceite de cookies e nunca antes de a idade ser respondida; aí `contact_submit` vira `Lead` (sem parâmetro de identificação, sem telefone com hash), `quiz_complete` vira `QuizCompleto` (personalizado) e `cta_click` vira `CtaClick`. O tier e a pontuação nunca vão pra plataforma de anúncio. Pra qualquer sessão de 12 a 17 anos, sem idade ou em dúvida: nenhuma tag, nenhum evento de pixel, nenhum `fbclid` nem `gclid` guardado (`pixel.menores = "nenhum"`: é o ECA Digital, ver `<conformidade>`, item 1).

**Envio e fila**
- `navigator.sendBeacon(endpoint, new Blob([json], { type: "text/plain" }))` primeiro (não gera preflight de CORS, que quebraria em vários webhooks); se não existir ou falhar, `fetch(endpoint, { method: "POST", keepalive: true, headers: { "Content-Type": "text/plain" }, body: json })`. O destino decodifica o JSON do corpo.
- Idempotência: o `leadId` é a chave. O destino faz "upsert" por ele, e o quiz pode reenviar sem duplicar.
- Fila local `qz:fila` (itens `{ tipo, payload, tentativas, proximaEm }`), com recuo de 1, 3, 10 e 30 segundos, no máximo 5 tentativas na sessão; o que sobrar fica pra próxima visita. Descarrega no carregamento, em `online` e em `visibilitychange`. O atleta nunca vê erro: a transição e a T14 aparecem de qualquer jeito.
- Tempo limite de 8 segundos por tentativa.

**URL da landing** (botão da T14): `landingUrl` mais `?utm_*` (os que vieram) mais `&qz=1&t=<A|B|C>&lid=<leadId>`. Nunca nome, telefone, e-mail, nem a pontuação detalhada. Mesma aba (`location.assign`), com `rel="noopener"` se for link.

**Persistência no aparelho** (tudo em `try/catch`: o armazenamento pode estar bloqueado no navegador do Instagram; se estiver, guarda em memória e segue). Chaves: `qz:estado` (versão, respostas, passo atual, `atualizadoEm`; validade de 7 dias), `qz:fila`, `qz:cookies` (a escolha da folha de cookies, só existe pra adulto). Ao enviar o contato com sucesso, apaga `contato.*` do `qz:estado`. A T01 oferece "Continuar de onde parei" só se já houver a resposta da T02, e um "Recomeçar" que apaga tudo.

**UTMs.** Lidos no carregamento (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) e guardados na sessão: são parâmetros de campanha, não identificam pessoa. `fbclid` e `gclid` são identificadores de clique: ficam só em memória e só são guardados e enviados pra adulto com aceite, nunca pra menor. `inApp` vem de `navigator.userAgent` (Instagram, Facebook) e `plataforma` de `ios`, `android` ou `desktop`. Não guarde o User-Agent inteiro.

**Retenção.** O prazo de guarda e quem acessa são decisão do dono (`docs/dados.md` registra finalidade, base legal, prazo e acesso). O código só envia: o apagamento é do destino do webhook.

**Observabilidade.** `?debug=1` mostra um painel pequeno com o estado, o payload montado e os eventos, só em prévia ou no modo de ensaio (em produção, só com `debug: true` no config).
</dados>

<conformidade>
Registro dos riscos que o dono assumiu, levantado em 23/10/2026 por um agente de pesquisa, com fonte primária. NÃO é parecer jurídico e NÃO bloqueia nada: o dono decidiu que o quiz fala como a casa fala (D1 a D9). Está aqui pra consulta e pro advogado dele. Os itens marcados com (c) foram conferidos também pelo autor do briefing, no texto oficial.

**O que o sistema faz sozinho, sem aviso na tela** (é lei, não preferência de texto)
1. **Nenhuma tag antes da idade, e nunca pra menor.** Nada de pixel, Utmify, API de conversões, público personalizado, lookalike, telefone com hash nem guarda de `fbclid` ou `gclid` antes de a T02 ser respondida. Idade de 12 a 17, sem resposta ou em dúvida: nenhuma tag, nunca. Adulto: a folha de cookies aparece depois da idade, com "Aceitar" e "Rejeitar" do mesmo tamanho e peso; só depois do aceite as tags carregam. Base: Lei 15.211/2025 (ECA Digital), em vigor desde 17/03/2026 (art. 41-A) (c): art. 22 veda perfilamento pra direcionar publicidade a menor e o uso de análise emocional pra esse fim (c), art. 26 veda perfis comportamentais de menor pra direcionar publicidade (c), art. 13 limita o dado de verificação de idade a essa finalidade (c); Decreto 12.880 art. 33 (c). Vale pro tier, pra pontuação e pro telefone: nada disso vai pra plataforma de anúncio.
2. **A pontuação não usa idade.** O tier só depende das respostas de intenção. Pontuar a condição de menor seria criar um perfil de menor com fim comercial (art. 26).
3. **Dado de menor.** Menos de 18: nome e WhatsApp do responsável, com aceite registrado (texto, versão, data). Menos de 12: o quiz encerra (o chip "Menos de 12" da T02).

**Riscos assumidos pelo dono** (informativo; nada aqui muda o texto do quiz)

| Tema | O que a lei ou a regra diz | Onde aparece |
| --- | --- | --- |
| Resultado e renda | CDC arts. 36 parágrafo único, 37 §1º e 38 (c): o ônus da prova é de quem anuncia. CONAR art. 27 §§1º e 7º e art. 48. | T08: "R$ 30 mil por mês", "cerca de 3 meses" e os 326. O dono guarda a base (lista, período, quem conta como "fechou") e a frase já traz o universo: atletas nossos, acompanhados por nós. |
| Depoimento e áudio | CDC art. 37 §2º; CONAR arts. 24, 27 §9º, 37 e Anexo Q; Código Civil arts. 18 e 20; Constituição art. 5º X e XXVIII "a"; LGPD arts. 5º I e 8º. | T08 e T10. Autorização escrita da mãe e dos depoentes (finalidade, mídias, prazo, território, remuneração, revogação). O "David" citado no áudio também. |
| Escudos e marcas de clube | LPI (Lei 9.279/96) arts. 125, 126, 132 IV, 189 I, 195 III e IV e 209; Lei 9.615/98 art. 87; Lei 14.597/2023 arts. 168 e 170; lista de alto renome do INPI de 28/07/2026 (entre clubes, só o Flamengo; a marca notoriamente conhecida vale sem lista). A revisão de anúncio da Meta olha a página de destino. O levantamento recomendou só o nome em texto. | T07. Os escudos ficam ligados; o `escudos.modo = "texto"` troca tudo por selo de texto, se o dono quiser. |
| Intermediação de atleta menor | Lei 9.615 art. 27-C VI (c): nulos os contratos com agente desportivo que versem sobre gerenciamento de carreira de atleta em formação menor de 18. Lei 14.597 art. 95 (c). CBF, regulamento de intermediários, art. 24 (c): nenhuma comissão por jogador menor. FIFA Football Agent Regulations art. 13 (c): só agente licenciado; menor só nos seis meses antes do primeiro contrato profissional, com consentimento escrito do responsável. | A voz do quiz ("encaminhamos", "conectamos"). É risco do produto, não só do texto. A pesquisa não resolveu se a Lei Geral do Esporte derrogou o art. 27-C. |
| Pressão sobre adolescente | Decreto 12.880 art. 10, parágrafo único, II (c): pressões emocionais e urgências fabricadas pra induzir decisão contrária ao melhor interesse; CDC art. 39 IV (c): prevalecer-se da fraqueza do consumidor por causa da idade. | O quiz não fabrica medo nem urgência (regras 7 e 9) e o áudio não vem com prazo nem preço na tela. |
| Preço | CDC arts. 6º III, 31 e 37 §3º; CONAR art. 27 §§3º e 4º. | T12 diz em texto natural que o acompanhamento é pago; o valor está na VSL. |
| Dado de menor | LGPD art. 14 §1º (consentimento dos pais vale pra criança, até 12 anos incompletos) e Enunciado CD/ANPD nº 1/2023 (bases dos arts. 7º ou 11, melhor interesse). | Bloco do responsável (T02) e contato do responsável (T13), com aceite registrado. |
| Anúncio | Meta Ad Standards e política de atributos pessoais. | Fora do quiz: sem "Você tem X anos?" no texto do anúncio. Pra menor, a Meta não permite público personalizado, lookalike nem interesses. |

**Não verificado**
- O Enunciado CD/ANPD nº 1/2023 na página da ANPD (o agente leu no repositório do Ministério da Justiça) e o guia de escopo de "acesso provável".
- O RNAF da CBF (a suspensão de janeiro de 2024 só por fontes secundárias).
- Se a Lei Geral do Esporte derrogou o art. 27-C da Lei 9.615.
- As marcas de cada clube no INPI e a jurisprudência (uso nominativo, interface de áudio).
- A política "Unrealistic Outcomes" da Meta (a página deu 404).
- O enquadramento do pixel como "perfilamento" é leitura do agente (confiança média).

**Entregável do agente de conferência:** `docs/riscos-assumidos.md`, com este registro e o resultado da conferência final (ele não bloqueia nenhuma frase do dono).

**Fontes** (links oficiais; as cópias que o agente salvou ocupam 196 MB e podem sumir: o link é a fonte)
Lei 15.211/2025 `planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm`; Decreto 12.622 `.../2025/decreto/d12622.htm`; Decreto 12.880 `.../2026/decreto/d12880.htm`; página da ANPD sobre o ECA Digital `gov.br/anpd/pt-br/assuntos/eca-digital`; LGPD `planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm`; ECA `planalto.gov.br/ccivil_03/leis/l8069.htm`; Enunciado 1/2023 `bibliotecadigital.mj.gov.br/bitstream/1/10215/2/Enunciado_ANPD_2023_1.html`; guia de cookies da ANPD `gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf`; CDC `planalto.gov.br/ccivil_03/leis/l8078compilado.htm`; CONAR `conar.org.br/codigos?section=codigo`; LPI `planalto.gov.br/ccivil_03/leis/l9279.htm`; Lei Pelé `planalto.gov.br/ccivil_03/leis/l9615consol.htm`; Lei 14.597/2023 `planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14597.htm`; INPI alto renome `gov.br/inpi/pt-br/servicos/marcas/alto-renome/inpi_marcas_marcas-de-alto-renome-em-vigencia_2026_07_28.pdf`; Código Civil `planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm`; Constituição `planalto.gov.br/ccivil_03/constituicao/constituicao.htm`; CBF RNI `intermediario.cbf.com.br/site/files/Regulamento_Intermediarios_CBF_2022.pdf`; FIFA Football Agent Regulations `digitalhub.fifa.com/m/1e7b741fa0fae779/original/FIFA-Football-Agent-Regulations.pdf`; Meta Ad Standards `transparency.meta.com/policies/ad-standards/`.
</conformidade>

<agentes>
Um orquestrador (você, o Opus principal) e nove especialistas. Cada especialista é dono de arquivos e só se alinha com os outros por CONTRATOS (arquivos de configuração e tokens), não por conversa. Ninguém edita arquivo de outro. O agente de conformidade tem poder de veto.

**Contratos** (criados pelo orquestrador na Fase 0, antes de qualquer agente começar)
- `config/fluxo.json`: a lista de telas com `id`, `n`, `capitulo`, `tipo`, `ativo`, `se` (condição declarativa, objeto e não texto: `{ "todos": [ { "chave": "ficha.peneirasFeitas", "op": ">", "valor": 0 } ] }`, sem `eval`), `grava` e variantes. Sai da tabela do `<fluxo>`.
- `config/copy.pt-BR.json`: todo texto de tela por `id` (título, apoio, opções com id, espelhos, botões, notas). Variáveis `{nome}`, ênfase `*palavra*`. Nenhum texto escrito dentro do JavaScript.
- `config/provas.json`: todo número e toda afirmação de fato, com `id`, `texto`, `fonte` (veículo, data, link), `confianca`, `conferidoEm`, `notaLegal`, `ativo`, `tipo` (`fato_com_fonte`, `historico_da_casa`, `experiencia_da_casa` ou `afirmacao_atribuida`) e `confirmadoPeloDono`. Sai das tabelas dos três blocos.
- `config/pontuacao.json`, `config/eventos.json`, `config/geral.json`, `config/payload.schema.json` (ver `<dados>`) e `css/tokens.css` (ver `<sistema_visual>`).
- `docs/contrato.md`: todos os `id`s, as chaves e as convenções (identificadores em português sem acento, arquivos em kebab-case, um módulo por componente).

**Os agentes**

| # | Agente | É dono de | Entrega | Pronto quando |
| --- | --- | --- | --- | --- |
| 1 | Motor | `js/motor/*`, a casca do `index.html`, `vercel.json` | Máquina de estados lida do `fluxo.json`, navegação (avançar, voltar, retomar), persistência, carga dos módulos de tela, tratamento de erro global | Os 12 caminhos do `<aceite>` passam; voltar nunca perde dado; recarregar retoma |
| 2 | Interface (UI e UX) | `js/telas/*`, `css/componentes.css`, `css/telas.css` | As 14 telas (mais as 4 opcionais, desligadas) e todos os componentes de `<sistema_visual>`, com estados de foco, erro, vazio e carregando; teclado; leitor de tela; ergonomia de polegar | As 14 telas renderizam como o `fluxo.json` manda; acessibilidade sem erro crítico |
| 3 | Copy | `config/copy.pt-BR.json`, `docs/copy.md` | Lapida toda a copy do `<fluxo>` dentro das regras da casa; microcopy de erro e de estado vazio; variantes onde indicado | O teste de regras da casa passa; nenhum texto no JavaScript |
| 4 | Persuasão e narrativa | `docs/mapa-persuasao.md` (revisa, não edita a copy) | Audita a ordem e o ritmo contra o `<mapa_persuasao>`: onde uma crença não foi instalada, onde há atrito, onde há promessa demais; propõe cortes por `ativo` | Relatório com no máximo 10 achados priorizados, todos aplicados ou recusados com motivo |
| 5 | Visual e movimento | `css/tokens.css`, `css/cenas.css`, `js/componentes/campo.js`, `docs/guia-visual.md`, escudos e ícones | Tokens, cenas, o campo (olhômetro contra IA), transições, selos de texto | Capturas lado a lado com o site; 60 fps; contrastes registrados |
| 6 | Áudio | `js/componentes/audio-voz.js`, `ferramentas/gera-waveform.py`, `assets/audio/*` | O componente, a onda real, os caminhos de falha, os eventos | Os testes de áudio do `<aceite>` passam, inclusive `play()` recusado |
| 7 | Dados e integração | `js/dados/*`, `config/pontuacao.json`, `eventos.json`, `payload.schema.json`, `geral.json`, `docs/dados.md` | Pontuação, tiers, payload, eventos, UTMs, envio, fila e consentimento do pixel | Testes de pontuação (todos os limites), de schema e de fila passam |
| 8 | Conferência (sem veto) | `docs/riscos-assumidos.md` e os campos `ativo` e `conferidoEm` do `provas.json` | Confere que nada na tela afirma fato falso sobre terceiros (clubes, estudos), que os números do dono estão com o universo na frase, e que as duas regras do sistema valem (nenhuma tag pra menor, pontuação sem idade); abre os links das fontes; registra os riscos assumidos | Os links abriram, as duas regras passam nos testes e o registro está escrito |
| 9 | QA | `testes/*`, `capturas/*` | A suíte do `<aceite>`, a matriz de aparelhos e as capturas | Tudo verde, capturas entregues |

O orquestrador é dono de `config/fluxo.json`, `docs/contrato.md`, `docs/decisoes.md`, da montagem, da prévia e do relatório final.

**Fases**
- **Fase 0 (só o orquestrador).** Cria a árvore de pastas, os contratos (com os dados deste briefing: o `fluxo.json` da tabela do `<fluxo>`, o `copy.pt-BR.json` do texto, o `provas.json` das tabelas dos blocos), o servidor estático de teste e o esqueleto do motor. Nada em paralelo antes de os contratos existirem.
- **Fase 1 (em paralelo, cada um nos seus arquivos):** Motor, Visual e movimento, Áudio, Dados e integração e Copy. A Interface começa quando o Motor e os tokens estiverem prontos.
- **Fase 2.** A Interface fecha as 14 telas. O orquestrador integra e roda a suíte inteira uma vez.
- **Fase 3 (em paralelo).** Persuasão, Conferência e QA auditam o conjunto. Cada achado vira correção pelo dono do arquivo. A Conferência não bloqueia o texto do dono; só reprova se o sistema tocar dado de menor (tag, pontuação por idade).
- **Fase 4.** Prévia publicada, conferida no ar, relatório.

**Regras de trabalho entre agentes**
1. Contrato primeiro, código depois. Mudou um `id`, uma chave ou um token: mudou em `docs/contrato.md` e avisou o orquestrador antes.
2. Ninguém edita arquivo de outro agente. Pedido de mudança vai pro dono, pelo orquestrador.
3. Toda frase de tela vive no `copy.pt-BR.json`; todo número ou afirmação de fato vive no `provas.json`, com fonte. O código só referencia o `id`.
4. Cada agente entrega com um autoteste e um parágrafo "o que eu não consegui verificar".
5. A Conferência registra e não veta o texto do dono. O que ela reprova é só o que o sistema faz com dado de menor.
6. Quando dois agentes discordam, vale este briefing. Se o briefing for omisso ou contraditório, o orquestrador decide e registra em `docs/decisoes.md` (data, decisão, motivo).

**Como lançar.** Use a ferramenta de subagentes (Agent) com um prompt por agente que traga: o caminho deste arquivo, a seção do agente, a lista dos arquivos que ele possui, o que ele não pode tocar e o critério de pronto. Não lance um agente genérico com "faça tudo". Quando um agente voltar, leia o que ele escreveu antes de chamar o próximo que depende dele.

**Pesquisa.** Não precisa de agente de pesquisa: as pesquisas já estão neste briefing. Fato novo que um agente achar entra no `provas.json` com fonte, data e `conferidoEm`, e passa pela Conformidade.
</agentes>

<aceite>
Critérios testáveis. O padrão dos testes é o do painel (`apresentacoes/jogador-de-elite-closer/testes/`: `_chrome.mjs`, `_cdp.mjs`, `_util.mjs`, `servidor.mjs`): Chrome local controlado por CDP, sem dependência de npm, servidor estático de teste, e cada `teste-*.mjs` imprime `ok` ou falha com código de saída diferente de zero. Tudo roda com `node testes/roda-tudo.mjs`. Rode sozinho, sem outro Chrome em paralelo (senão cai com "Inspected target navigated or closed", lição do painel).

1. **Caminhos (ponta a ponta).** 12 caminhos: (1) adulto, 6 peneiras ou mais, de 3 a 5 dispensas, tier A (14 telas); (2) adulto sem peneira (13 telas: pula a T04 e a T05 usa a variante C); (3) adulto com peneiras e nenhuma dispensa (T05 variante B); (4) menor de 15 a 17 anos com responsável marcado (o bloco dentro da T02); (5) menor sem marcar o responsável (o botão não habilita); (6) menos de 12 anos (a saída da T02, nada guardado); (7) tier B; (8) tier C com `roteamento.tierC = "saida"`; (9) tier C com `"landing"`; (10) "ainda não sei" na T11 (sem o "segurar"); (11) voltar de qualquer tela até a T01, pela seta e pelo voltar nativo do navegador, e avançar de novo sem perder resposta (e, na T14, o voltar nativo reabre a T14 sem reenviar o contato); (12) recarregar no meio e retomar, e recarregar depois de enviar o contato (nome e telefone apagados do armazenamento). Cada caminho confere a sequência exata de telas e o payload final; o caminho mais longo tem exatamente 14 telas, e um script que toca a cada 3 segundos (e deixa o áudio tocar até o fim) fecha o quiz em até 4 minutos.
2. **Pontuação.** Teste em tabela: todos os limites (69, 70, 44, 45; `investimento = nao`; `quer = nao_sei` com 70 ou mais; `conversar` com 70 ou mais; `objetivo = hobby` com a tela opcional ligada) e a soma máxima igual a 100 (94 com o áudio desligado).
3. **Regras da casa.** `testes/teste-regras-da-casa.mjs` varre todo texto renderizado nas 14 telas (e nas 4 opcionais, ligadas só pro teste), nos 12 caminhos: nenhum U+2014 nem U+2013; nenhuma das palavras proibidas das regras 1 a 3 ("overall", "SEAL", "Scouting PRO", "scout" e "scouter" falando da equipe, "mentoria", "programa", "pacote", "ilustrativo", "Nº"); nenhum "pré-qualificado", "aprovado" nem "escolhido" na tela; título de tela narrativa com até 9 palavras; nenhuma nota legal nem rodapé de ressalva (regra 5); a T08 mostra os três números do dono (326, R$ 30 mil por mês, cerca de 3 meses) com o universo dentro da frase ("atletas nossos, acompanhados por nós"); todo fato sobre terceiro existe no `provas.json` com fonte; nenhum preço.
4. **Acessibilidade.** Fluxo inteiro só no teclado; foco visível e em ordem lógica; foco vai pro título a cada troca de tela; espelhos em `aria-live`; `prefers-reduced-motion` testado; zoom de 200% sem rolagem horizontal; nenhuma rolagem horizontal a 320 px; alvos de toque de 44 px ou mais (medido); contraste de todos os pares em `docs/contraste.md` (texto a 4,5 ou mais).
5. **Desempenho.** Medido por CDP com 4G simulado e CPU 4 vezes mais lenta: primeira carga abaixo de 350 KB (sem o áudio), LCP abaixo de 2,5 s, CLS abaixo de 0,05, JavaScript abaixo de 80 KB comprimidos, nenhuma requisição a servidor de terceiro antes do aceite.
6. **Aparelhos.** Capturas de todas as telas do caminho 1 em 360 por 640, 390 por 844, 412 por 915, 768 por 1024 e 1440 por 900, em `capturas/<largura>/NN-id.png`: nenhum texto cortado, nenhum botão coberto pela barra fixa, nenhuma rolagem horizontal. Teste também com o User-Agent do navegador interno do Instagram (Android e iOS). Aparelho real é do dono: registre "não conferido em aparelho real" no relatório.
7. **Áudio.** Com `--autoplay-policy=no-user-gesture-required` no Chrome de teste: os estados `nao_tocou`, `menos`, `mais_da_metade`, `ate_o_fim` e `erro` geram o evento e a pontuação certos; seek; troca de velocidade; `play()` recusado mostra "Toque de novo"; arquivo ausente mostra "Continuar sem o áudio"; o "Continuar" aparece em 10 s sem toque; a onda vem do `waveform.json` (48 valores de 0 a 1).
8. **Segurar pra confirmar.** Com toque por CDP: soltar antes de 1,6 s volta o anel; completar avança em 700 ms; Enter e Espaço confirmam; "Confirmar sem segurar" funciona.
9. **Dados.** O payload valida no schema; as chaves de `ficha` existem na lista do painel e respeitam os limites; nenhum evento leva nome, telefone, e-mail, texto livre, idade exata nem `leadId` (só `sessaoId`; o teste varre todos os eventos dos 12 caminhos); a pontuação não lê idade (o teste muda só a idade e confere que o total não muda); nenhum dado de contato na URL da landing; a fila reenvia depois de falha simulada (tempo limite de 8 s, recuo) e não duplica (mesmo `leadId`); sem `endpoint`, entra em modo de ensaio.
10. **Consentimento e tags.** Nenhuma chamada a pixel, Utmify ou outro terceiro antes de a idade ser respondida. Sessão de 12 a 17 anos, sem idade ou em dúvida: zero chamada de terceiro e nenhum `fbclid` nem `gclid` guardado, em momento nenhum. Adulto antes do aceite: zero. Adulto com aceite: as tags carregam e disparam só os eventos mapeados (e o tier e a pontuação nunca vão pra plataforma). A folha de cookies só aparece pra adulto e só se houver ID configurado, com "Aceitar" e "Rejeitar" do mesmo tamanho e peso (medido). Rejeitar mantém o quiz funcionando por inteiro.
11. **Fontes.** O teste de publicação abre cada link do `provas.json` (status 200 e, no do Chelsea, o texto "AI" na página). Link que falhar vira aviso no relatório, não trava a entrega.
12. **Publicação.** Prévia na Vercel, nunca produção: `/` responde 200, cabeçalho `X-Robots-Tag: noindex`, o MP3 com `Content-Type: audio/mpeg` e `Accept-Ranges: bytes`, arquivos publicados idênticos aos locais (`curl` mais `cmp`), `robots.txt` bloqueando tudo, e uma captura da T01 e da T14 tirada do endereço publicado.

**Como publicar, e as armadilhas.** Rode a CLI dentro de `quiz-zyron/`, nunca na raiz do repo (o `.vercel` da raiz é do projeto `mnkk`): `npx --yes vercel link --project quiz-zyron --yes` e `npx --yes vercel deploy --yes`, sem `--prod`. O `vercel link` cria um `.env.local` e pode mexer no `.gitignore`: depois do deploy apague o `.env.local` e confira o `git status`. O modo automático pode bloquear a leitura de credencial: não use `vercel env pull` nem leia token; a CLI já logada basta. Se pedir login, pare e reporte (não crie conta nem peça chave). Confira o endereço no ar antes de relatar.
</aceite>

<entrega>
Relatório final em português, até 400 palavras, nesta ordem:
1. O que foi construído (uma linha por componente) e o endereço da PRÉVIA.
2. Resultado da suíte (`n de n`), com o nome e o motivo de qualquer teste que falhou.
3. O que ainda falta de configuração (`LANDING_URL`, `QUIZ_ENDPOINT`, escudos que a casa não tem), em lista curta.
4. O que NÃO foi conferido: aparelhos reais (iPhone, Android, navegador interno do Instagram), as legendas do áudio (transcrição não conferida por humano), fontes que não abriram, o que depende de advogado.
5. O que o sistema não faz por lei (tag pra menor) e, em uma linha cada, os riscos que o dono assumiu (registro em `docs/riscos-assumidos.md`).
6. O que fazer nos documentos que você não podia editar (decks, playbooks, `CASOS.md`) e no anúncio (sem "Você tem X anos?" no texto).
7. Como ligar o que está desligado (endpoint, pixel, landing).
Sem tour de funcionalidades e sem repetir este briefing. Termine com a lista dos arquivos entregues (caminhos).
</entrega>
