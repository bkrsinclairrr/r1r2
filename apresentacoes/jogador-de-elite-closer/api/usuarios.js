// Usuários do painel (só o admin). GET lista; POST cria ou atualiza { login, nome, papel, senha? }; DELETE ?login= remove.
// Papéis: sdr (monta os R1 dele), closer (monta os R2 dele) e admin (vê todos, troca de dono, cuida dos usuários).
import { exige, manda, corpo, leUsuarios, mudaUsuarios, hashSenha, normLogin, loginValido, semHash, PAPEIS, registraErro } from './_base.js';

export default async function handler(req, res) {
  try {
    const eu = await exige(req, res, { admin: true });
    if (!eu) return;
    if (req.method === 'GET') {
      const lista = (await leUsuarios()).map(semHash).sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR'));
      return manda(res, 200, { usuarios: lista, papeis: PAPEIS });
    }
    if (req.method === 'POST') {
      const b = await corpo(req);
      const login = normLogin(b.login);
      const nome = String(b.nome || '').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
      const papel = String(b.papel || '');
      const senha = String(b.senha || '');
      if (!loginValido(login)) return manda(res, 400, { erro: 'Login com 3 a 32 caracteres: letras minúsculas, números, ponto, hífen ou sublinhado.' });
      if (!nome) return manda(res, 400, { erro: 'Coloque o nome da pessoa.' });
      if (!PAPEIS[papel]) return manda(res, 400, { erro: 'Escolha o papel: SDR (R1), Closer (R2) ou Admin.' });
      if (senha && senha.length < 10) return manda(res, 400, { erro: 'A senha precisa de pelo menos 10 caracteres.' });
      if (login === eu.login && papel !== 'admin') return manda(res, 400, { erro: 'Você não pode tirar o seu próprio acesso de admin.' });
      const hash = senha ? hashSenha(senha) : null;
      const r = await mudaUsuarios(lista => {
        const i = lista.findIndex(u => u.login === login);
        if (i < 0 && !hash) return { erro: 'Pra criar um usuário novo, defina a senha.' };
        const u = i < 0 ? { login, criadoEm: new Date().toISOString() } : lista[i];
        Object.assign(u, { nome, papel }, hash ? { hash } : {});
        if (i < 0) lista.push(u);
        return { usuario: semHash(u) };
      });
      return r.erro ? manda(res, 400, r) : manda(res, 200, r);
    }
    if (req.method === 'DELETE') {
      const login = normLogin(req.query && req.query.login);
      if (login === eu.login) return manda(res, 400, { erro: 'Você não pode remover a si mesmo.' });
      const r = await mudaUsuarios(lista => {
        const i = lista.findIndex(u => u.login === login);
        if (i < 0) return { erro: 'Esse usuário não está na lista (o admin principal fica nas variáveis do Vercel).' };
        lista.splice(i, 1);
        return { ok: true };
      });
      return r.erro ? manda(res, 400, r) : manda(res, 200, r);
    }
    manda(res, 405, { erro: 'Pedido não aceito.' });
  } catch (e) {
    registraErro('usuarios', e);
    manda(res, 500, { erro: 'O painel não conseguiu salvar agora. Tente de novo em instantes.' });
  }
}
