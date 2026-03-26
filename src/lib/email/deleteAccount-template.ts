export function buildAccountDeletionEmail(username: string, magicLink: string, credits: number): string {
  const year = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sua conta foi encerrada · Anti-Tédio</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <div style="display:inline-block;margin-bottom:16px;">
                <img src="https://anti-tedio.com/public/logo.png" style="width:100px;" alt="Anti-Tédio" />
              </div>
              <p style="margin:0;line-height:1;">
                <span style="color:#000000;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;opacity:0.8;display:block;margin-bottom:6px;">
                  Até logo,
                </span>
                <span style="color:#000000;font-size:28px;font-weight:900;letter-spacing:-0.5px;">
                  Anti-Tédio
                </span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:44px 40px 32px;">

              <div style="text-align:center;margin-bottom:24px;">
                <span style="font-size:52px;line-height:1;">😢</span>
              </div>

              <h1 style="margin:0 0 12px;color:#18181b;font-size:24px;font-weight:800;line-height:1.2;text-align:center;">
                Sentiremos sua falta, ${username}.
              </h1>

              <p style="margin:0 0 8px;color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;text-align:center;">
                Conta encerrada
              </p>

              <p style="margin:24px 0 32px;color:#52525b;font-size:16px;line-height:1.6;text-align:center;">
                Sua conta no <strong style="color:#6b3af5;">Anti-Tédio</strong> foi encerrada.
                Foi um prazer ajudar você a encontrar novas formas de se divertir. Esperamos que nossas recomendações tenham sido úteis! ✨
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#fafafa;border-radius:16px;padding:24px;border:1px solid #f1f1f4;">
                    <p style="margin:0 0 16px;color:#18181b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                      📦 Resumo do encerramento
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr>
                        <td style="width:32px;vertical-align:top;">
                          <span style="font-size:18px;">🎬</span>
                        </td>
                        <td>
                          <p style="margin:0;color:#52525b;font-size:14px;line-height:1.5;">
                            Seu <strong>histórico de recomendações</strong> foi programado para exclusão permanente.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;">
                          <span style="font-size:18px;">⚡</span>
                        </td>
                        <td>
                          <p style="margin:0;color:#52525b;font-size:14px;line-height:1.5;">
                            ${credits > 0
                              ? `Seus <strong style="color:#6b3af5;">${credits} crédito${credits !== 1 ? 's' : ''}</strong> foram invalidados conforme os termos de uso.`
                              : `Você não possuía créditos ativos no momento do encerramento.`
                            }
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#f8faff;border-radius:16px;padding:20px;border:1px solid #ddd6fe;text-align:center;">
                    <p style="margin:0 0 6px;color:#6b3af5;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
                      🗓️ Arrependeu-se?
                    </p>
                    <p style="margin:0;color:#52525b;font-size:14px;line-height:1.6;">
                      Você tem até <strong>30 dias</strong> para recuperar sua conta. Após esse prazo, todos os dados serão <strong>deletados definitivamente</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="border-top:2px dashed #e4e4e7;"></td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#fffaf5;border-radius:16px;padding:24px;border-left:4px solid #f97316;">
                    <p style="margin:0 0 8px;color:#c2410c;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
                      ⚠️ Não foi você?
                    </p>
                    <p style="margin:0 0 20px;color:#7c2d12;font-size:14px;line-height:1.6;">
                      Se você não solicitou a exclusão, sua conta pode estar em risco. Reative-a agora mesmo:
                    </p>

                    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="background-color:#f97316;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(249,115,22,0.2);">
                          <a href="${magicLink}"
                            style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.3px;"
                          >
                            Recuperar minha conta
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#a1a1aa;font-size:13px;line-height:1.6;text-align:center;">
                Sentiremos sua falta por aqui. Até a próxima!<br/>
                <strong>Equipe Anti-Tédio</strong> 💜
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 36px;border-top:1px solid #f1f1f4;background-color:#fafafa;">
              <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-align:center;line-height:1.6;">
                Criado para acabar com o tédio de uma vez por todas.
              </p>
              <p style="margin:0;color:#c4c4c4;font-size:11px;text-align:center;">
                © ${year} Anti-Tédio · Todos os direitos reservados
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}