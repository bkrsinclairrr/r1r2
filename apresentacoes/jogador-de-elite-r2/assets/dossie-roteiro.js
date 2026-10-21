/* Roteiro do dossiê do atleta e do inimigo comum (18/10/2026), os dois slides logo depois da IA na Prática, pro R2 anterior e as
   variações dele: o ordem-garantia.js lê window.ROTEIROS_EXTRAS pelo data-roteiro do slide (dossie e inimigo). Versão padrão.
   A fala é a mesma do R2 novo (roteiro.js de lá), sem número de slide. Carrega antes do ordem-garantia.js. */
(function () {
  'use strict';
  window.ROTEIROS_EXTRAS = Object.assign(window.ROTEIROS_EXTRAS || {}, {
    "dossie": {
      "nome": "O dossiê do atleta",
      "min": 3,
      "fala": [
        "Ponte, logo depois da IA na Prática: \"[atleta], agora é o teu jogo na tela, do jeito que nenhum avaliador parou pra olhar.\"",
        "Com o vídeo analisado na tela (\"Tenho o vídeo do jogador\" ligado no painel): dê o play (espaço ou o botão; o vídeo começa mudo e o Som liga o áudio) e deixe a análise falar. Depois do vídeo: \"Isso aqui é o teu jogo lido pela IA. Ninguém numa peneira para pra fazer isso.\"",
        "O mapa de calor, embaixo do vídeo (ou ao lado, com o vídeo em pé), se estiver na tela. O da lista do painel, que a tela chama \"onde atua um [posição]\", é o mapa típico da posição: \"Esse é o mapa de onde atua um [posição]: é nessa faixa do campo que um clube procura esse perfil.\" Só o mapa enviado como imagem antes de 20/10, que a tela chama \"onde o seu jogo acontece\", é do jogo dele: \"E esse é o teu mapa de calor.\"",
        "As oportunidades, à direita: \"Aqui estão clubes que procuram um perfil como o teu, mapeados pela nossa equipe a partir do teu jogo: [oportunidades]. Quem decide é o clube. O nosso trabalho é colocar o teu perfil na frente de quem procura.\"",
        "O plano de carreira, embaixo das oportunidades: \"E o caminho é este: agora, a leitura e o primeiro foco; depois, a vitrine; e o destino é o teu: [sonho].\"",
        "Pro atleta, olhando pra ele: \"[atleta], em algum lugar tem um clube precisando de um jogador exatamente como você. A gente vai trabalhar pra colocar o teu jogo na frente dele.\""
      ],
      "perguntas": [
        "[atleta], qual dessas oportunidades mais mexeu com você?",
        "[pai], [mãe], vocês já tinham visto o jogo dele lido desse jeito?"
      ],
      "crm": [
        "A oportunidade que mais animou o atleta e a reação da família ao vídeo analisado e ao mapa, com as palavras deles."
      ],
      "atencao": "Só aparece com \"Tenho o vídeo do jogador\" ligado no painel (o vídeo analisado ou o mapa de calor) ou com oportunidades preenchidas; sem nada disso, as setas passam direto. Com o vídeo analisado e sem lances marcados, a IA na Prática é a ponte e o vídeo entra aqui. As oportunidades são clubes que a equipe mapeou pro perfil: nunca diga que o clube já pediu o [atleta], que existe vaga, nem prometa clube, prazo ou contrato; diga \"clubes que procuram esse perfil\" e \"quem decide é o clube\". No Scout PRO, o encaminhamento pra clubes vem a partir da Assessoria PRO: fale da estrutura, não do plano. Leia o vídeo como ele é: não acrescente nota, ranking ou comparação que a análise não mostra. Vídeo de menor: só com a autorização do responsável registrada no painel. Teste antes da call: play, som e o mapa. O mapa de calor da lista do painel é referência da posição, não dado do jogo dele (a tela diz \"onde atua um [posição]\"): nunca diga \"o teu mapa\", nem leia a mancha como o que ele fez."
    },
    "inimigo": {
      "nome": "O inimigo em comum",
      "min": 2,
      "fala": [
        "Direto, olhando pra família: \"[pai], [mãe], deixa eu dizer uma coisa que pouca gente fala: o [atleta] não foi mal nas peneiras por falta de talento. Foi falta de quem olhasse.\"",
        "\"Numa peneira, é um avaliador pra vinte e dois em campo. Ele olha quem está perto da bola, em vinte minutos de coletivo. O lance que ele não viu, pra ele, não existiu. E a resposta vem sempre igual: a gente te liga.\"",
        "A frase do meio, devagar: \"Em algum lugar, em algum time, tem alguém precisando de um jogador exatamente como o [atleta]. Só não era quem estava na beira daquele campo.\"",
        "O quadro da direita, com os números do painel: \"Vocês me contaram: [nº de peneiras], [gasto com peneiras] e [anos tentando] nisso. E cada peneira que passa é tempo de base que não volta.\" Sem os números, leia o quadro: a inscrição, a viagem, o dia de trabalho, os meses esperando uma resposta.",
        "Fecho: \"Por isso a peneira não deu certo. O problema nunca foi o jogo dele. É por isso que a gente não deixa o jogo dele na mão de um olhômetro.\""
      ],
      "perguntas": [
        "Quantas peneiras ele já fez? E quanto vocês já gastaram com isso, somando viagem e tudo?",
        "Quanto tempo mais vocês querem procurar no escuro?"
      ],
      "crm": [
        "As peneiras, o gasto e o tempo que a família contou, com as palavras deles (anote no painel, em As peneiras dele)."
      ],
      "atencao": "O inimigo é o método, o olhômetro: nunca uma pessoa, um avaliador pelo nome, um clube ou um concorrente. Os números do quadro vêm do painel (peneiras, gasto e anos tentando) e são os que a família contou: não arredonde pra cima, não aumente e não invente estatística do mercado; vazio, o quadro mostra a conta sem números. Não diga que o [atleta] seria aprovado se tivesse sido visto: diga que ele não foi visto. Depois da pergunta, espere a resposta."
    }
  });
})();
