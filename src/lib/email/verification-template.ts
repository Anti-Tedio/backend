export function buildVerificationEmail(code: string, username: string): string {
  const year = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verificação de E-mail · Anti-Tédio</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 25px rgba(107,58,245,0.1);">

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

              <h1 style="margin:0 0 12px;color:#18181b;font-size:24px;font-weight:800;line-height:1.2;text-align:left;">
                Olá, ${username}! 👋
              </h1>

              <p
                style="margin:0 0 8px;color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
                Verificação de conta
              </p>

              <p style="margin:24px 0 32px;color:#52525b;font-size:16px;line-height:1.6;">
                Você está a um passo de começar a combater o tédio de um jeito inteligente! 🎉<br />
                Use o código abaixo para confirmar seu e-mail e ativar sua conta.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center"
                    style="background:#f8faff;border-radius:16px;padding:32px 24px;border:2px dashed #c4b0ff;">
                    <p
                      style="margin:0 0 12px;color:#6b3af5;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">
                      🔐 Seu código de verificação
                    </p>
                    <p
                      style="margin:0;color:#18181b;font-size:48px;font-weight:900;letter-spacing:10px;font-family:monospace;line-height:1;">
                      ${code}
                    </p>
                    <p style="margin:16px 0 0;color:#71717a;font-size:13px;font-weight:500;">
                      Válido por <strong>15 minutos</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#a1a1aa;font-size:13px;line-height:1.6;text-align:center;">
                Se você não criou uma conta no Anti-Tédio, pode ignorar este e-mail com segurança. 
                Nenhuma alteração será feita na sua conta.
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 36px;border-top:1px solid #f1f1f4;background-color:#fafafa;">
              <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-align:center;line-height:1.6;">
                Criado para acabar com o tédio de uma vez por todas.
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