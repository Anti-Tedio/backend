export function buildPasswordResetEmail(username: string, magicLink: string): string {
  const year = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperação de Senha · Anti-Tédio</title>
</head>

<body style="margin:0;padding:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow: 0 10px 25px rgba(0,0,0,0.05);">

          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <div style="display:inline-block;margin-bottom:16px;">
                <img src="https://anti-tedio.com/public/logo.png" style="width:100px;" alt="Anti-Tédio" />
              </div>
              <p style="margin:0;line-height:1;">
                <span style="color:#000000;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;opacity:0.8;display:block;margin-bottom:6px;">
                  Segurança da Conta,
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
                <span style="font-size:52px;line-height:1;">🔑</span>
              </div>

              <h1
                style="margin:0 0 12px;color:#18181b;font-size:24px;font-weight:800;line-height:1.2;text-align:center;">
                Esqueceu sua senha, ${username}?
              </h1>

              <p
                style="margin:0 0 8px;color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;text-align:center;">
                Solicitação de Recuperação
              </p>

              <p style="margin:24px 0 32px;color:#52525b;font-size:16px;line-height:1.6;text-align:center;">
                Recebemos um pedido para redefinir a senha da sua conta no
                <strong style="color:#6b3af5;">Anti-Tédio</strong>. Tudo bem, acontece com os melhores! <br />
                Basta clicar no botão abaixo para escolher uma nova senha.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td
                          style="background:#6b3af5;border-radius:12px;text-align:center;box-shadow:0 6px 18px rgba(107,58,245,0.3);">
                          <a href="${magicLink}"
                          style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:0.3px;"
                          >
                          Redefinir minha senha
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td
                    style="background-color:#f8faff;border-radius:14px;padding:16px 20px;border:1px solid #ddd6fe;text-align:center;">
                    <p style="margin:0;color:#6b3af5;font-size:13px;font-weight:600;">
                      ⏱️ Este link é válido por <strong>2 horas</strong> e só pode ser usado uma única vez.
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
                  <td
                    style="background-color:#fffaf5;border-radius:14px;padding:20px 24px;border-left:4px solid #f97316;">
                    <p
                      style="margin:0 0 6px;color:#c2410c;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
                      ⚠️ Não foi você?
                    </p>
                    <p style="margin:0;color:#7c2d12;font-size:14px;line-height:1.6;">
                      Se você <strong>não solicitou</strong> essa alteração, pode ignorar este e-mail com total segurança. Sua senha atual permanecerá a mesma.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.6;text-align:center;">
                Se o botão não funcionar, copie e cole o link abaixo no seu navegador:<br />
                <a href="${magicLink}" style="color:#6b3af5;word-break:break-all;font-size:11px;text-decoration:none;">
                  ${magicLink}
                </a>
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 36px;border-top:1px solid #f1f1f4;background-color:#fafafa;">
              <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-align:center;line-height:1.6;">
                Enviado com ❤️ pela equipe do Anti-Tédio.
              </p>
              <p style="margin:0;color:#c4c4c4;font-size:11px;text-align:center;">
                © ${year} Anti Tédio · Todos os direitos reservados
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