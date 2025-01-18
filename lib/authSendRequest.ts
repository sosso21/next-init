import { Lang } from "./use-translation/types";

export async function CustomSendVerificationRequest(params: {
  identifier: string;
  url: string;
  expires: Date;
  provider: any;
  token: string;
  theme: any;
  request: Request;
  locale: Lang;
}) {
  const { identifier: to, provider, url, theme, locale } = params;

  const { host } = new URL(url);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: provider.from,
      to,
      subject: getTranslation(locale, "subject", { host }),
      html: html({ url, host, theme, locale }),
      text: text({ url, host, locale }),
    }),
  });

  if (!res.ok)
    throw new Error("Resend error: " + JSON.stringify(await res.json()));
}

function getTranslation(locale: string, key: string, params: any = {}) {
  const translations: any = {
    en: {
      subject: `Sign in to ${params.host}`,
      signInText: "Sign in",
      ignoreText:
        "If you did not request this email, you can safely ignore it.",
    },
    fr: {
      subject: `Connexion à ${params.host}`,
      signInText: "Se connecter",
      ignoreText:
        "Si vous n'avez pas demandé cet email, vous pouvez l'ignorer.",
    },
    ar: {
      subject: `تسجيل الدخول إلى ${params.host}`,
      signInText: "تسجيل الدخول",
      ignoreText: "إذا لم تطلب هذا البريد الإلكتروني، يمكنك تجاهله بأمان.",
    },
    es: {
      subject: `Iniciar sesión en ${params.host}`,
      signInText: "Iniciar sesión",
      ignoreText:
        "Si no solicitaste este correo electrónico, puedes ignorarlo.",
    },
  };

  return translations[locale]?.[key] || translations["en"][key];
}

function html(params: {
  url: string;
  host: string;
  theme: any;
  locale: string;
}) {
  const { url, host, theme, locale } = params;
  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.primary || "#8C30E8";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  const signInText = getTranslation(locale, "signInText");
  const ignoreText = getTranslation(locale, "ignoreText");

  return `
    <body style="background: ${color.background};">
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: ${
          color.mainBackground
        }; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center"
            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${
              color.text
            };">
            ${getTranslation(locale, "subject", { host })}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${
                  color.buttonBackground
                }">
                  <a href="${url}"
                    target="_blank"
                    style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${
                      color.buttonText
                    }; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${
    color.buttonBorder
  }; display: inline-block; font-weight: bold;">
                    ${signInText}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${
              color.text
            };">
            ${ignoreText}
          </td>
        </tr>
      </table>
    </body>
    `;
}

function text({
  url,
  host,
  locale,
}: {
  url: string;
  host: string;
  locale: string;
}) {
  return `${getTranslation(locale, "subject", {
    host,
  })}\n${url}\n\n${getTranslation(locale, "ignoreText")}\n`;
}
