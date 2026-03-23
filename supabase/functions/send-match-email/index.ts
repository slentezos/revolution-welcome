import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = Deno.env.get("SITE_URL") || "https://rencontre-douce-france.lovable.app";

function generateMatchEmailHTML(data: {
  recipientName: string;
  matchName: string;
  matchAge: number;
  matchLocation: string;
  affinity: number;
  matchAvatar: string;
  matchId: number;
}) {
  const { recipientName, matchName, matchAge, matchLocation, affinity, matchAvatar, matchId } = data;
  const profileUrl = `${SITE_URL}/dashboard?match=${matchId}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle Proposition - Kalimera</title>
  <!--[if mso]><style>table,td{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f8f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f5f0;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

          <!-- Preheader -->
          <tr>
            <td style="display:none;font-size:1px;color:#f8f5f0;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
              ${recipientName}, nous avons selectionne un profil qui pourrait vous correspondre — ${affinity}% d affinite avec ${matchName}.
            </td>
          </tr>

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#c9a96e,transparent);margin-bottom:20px;"></div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:400;color:#283044;letter-spacing:1px;line-height:1.2;">
                Kalimera
              </div>
              <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#b0a596;letter-spacing:4px;text-transform:uppercase;padding-top:8px;">
                L'art de la rencontre
              </div>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(40,48,68,0.04),0 12px 48px rgba(40,48,68,0.06);">

                <!-- Hero Navy -->
                <tr>
                  <td style="background-color:#283044;padding:52px 48px 60px;text-align:center;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom:20px;">
                          <div style="width:40px;height:1px;background-color:#c9a96e;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:400;color:#c9a96e;letter-spacing:3px;text-transform:uppercase;padding-bottom:14px;">
                          Nouvelle proposition
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;color:#ffffff;line-height:1.25;letter-spacing:-0.3px;">
                          Une rencontre a ete<br>selectionnee pour vous
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top:18px;font-size:16px;color:rgba(255,255,255,0.6);line-height:1.6;font-weight:300;">
                          Bonjour ${recipientName}, notre equipe a identifie un profil<br>qui pourrait vous correspondre.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Profile Card -->
                <tr>
                  <td align="center" style="padding:0 40px;background-color:#ffffff;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:-32px;width:100%;max-width:440px;">
                      <tr>
                        <td style="background:#ffffff;border-radius:4px;box-shadow:0 2px 8px rgba(40,48,68,0.06),0 16px 40px rgba(40,48,68,0.08);border:1px solid #ede8e2;padding:36px 32px 32px;text-align:center;">

                          <!-- Avatar gold ring -->
                          <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                            <tr>
                              <td style="padding:4px;border-radius:50%;background:linear-gradient(135deg,#c9a96e,#e8d5a8,#c9a96e);">
                                <img src="${matchAvatar}" alt="Photo de ${matchName}" width="130" height="130" style="width:130px;height:130px;border-radius:50%;object-fit:cover;display:block;border:3px solid #ffffff;" />
                              </td>
                            </tr>
                          </table>

                          <!-- Name & Location -->
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td align="center" style="padding-top:22px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:#283044;letter-spacing:-0.3px;">
                                ${matchName}, ${matchAge} ans
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="padding-top:8px;font-size:15px;color:#9a8e82;font-weight:300;">
                                ${matchLocation}
                              </td>
                            </tr>
                          </table>

                          <!-- Gold divider -->
                          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:24px auto;">
                            <tr>
                              <td>
                                <div style="width:48px;height:1px;background:linear-gradient(90deg,transparent,#c9a96e,transparent);"></div>
                              </td>
                            </tr>
                          </table>

                          <!-- Affinity -->
                          <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                            <tr>
                              <td style="border:1px solid #283044;border-radius:2px;padding:12px 36px;">
                                <table role="presentation" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:#283044;padding-right:10px;line-height:1;">
                                      ${affinity}%
                                    </td>
                                    <td style="font-size:12px;color:#9a8e82;vertical-align:middle;letter-spacing:1px;text-transform:uppercase;">
                                      d affinite
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td align="center" style="padding:40px 40px 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#283044;border-radius:2px;">
                          <a href="${profileUrl}" target="_blank" style="display:inline-block;padding:18px 56px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;font-weight:500;color:#ffffff;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
                            Decouvrir son profil
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 40px 44px;font-size:13px;color:#293045;font-weight:300;">
                    Par souci de courtoisie, merci de l’accepter ou de la refuser à partir de votre espace personnel en clickant sur le lien ci-dessus ».
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td align="center" style="padding:0 56px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="border-top:1px solid #ede8e2;"></td>
                        <td style="padding:0 16px;white-space:nowrap;font-size:11px;color:#c9a96e;letter-spacing:2px;">&#10022;</td>
                        <td style="border-top:1px solid #ede8e2;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Tips -->
                <tr>
                  <td style="padding:36px 56px 44px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:400;color:#283044;padding-bottom:20px;letter-spacing:-0.2px;">
                          Nos conseils pour un premier echange reussi
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:10px 0;font-size:15px;color:#5a6275;line-height:1.7;font-weight:300;">
                                <span style="display:inline-block;width:24px;height:24px;background-color:#f8f5f0;border-radius:50%;text-align:center;line-height:24px;font-size:12px;color:#283044;font-weight:500;margin-right:12px;vertical-align:middle;">1</span>
                                Prenez le temps de decouvrir son profil en detail
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:10px 0;font-size:15px;color:#5a6275;line-height:1.7;font-weight:300;">
                                <span style="display:inline-block;width:24px;height:24px;background-color:#f8f5f0;border-radius:50%;text-align:center;line-height:24px;font-size:12px;color:#283044;font-weight:500;margin-right:12px;vertical-align:middle;">2</span>
                                Redigez un premier message personnel et chaleureux
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:10px 0;font-size:15px;color:#5a6275;line-height:1.7;font-weight:300;">
                                <span style="display:inline-block;width:24px;height:24px;background-color:#f8f5f0;border-radius:50%;text-align:center;line-height:24px;font-size:12px;color:#283044;font-weight:500;margin-right:12px;vertical-align:middle;">3</span>
                                Privilegiez les echanges via notre plateforme securisee
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:40px 24px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <div style="width:40px;height:1px;background:linear-gradient(90deg,transparent,#c9a96e,transparent);"></div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#283044;padding-bottom:12px;">
                    Kalimera
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:12px;color:#b0a596;line-height:2;font-weight:300;">
                    <a href="${SITE_URL}" style="color:#283044;text-decoration:none;border-bottom:1px solid #ede8e2;">Visiter le site</a>
                    &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                    <a href="${SITE_URL}/contact" style="color:#283044;text-decoration:none;border-bottom:1px solid #ede8e2;">Nous contacter</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:20px;font-size:11px;color:#c5bdb3;font-weight:300;letter-spacing:0.5px;">
                    &copy; 2026 Kalimera &mdash; Tous droits reserves
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, matchName, matchAge, matchLocation, affinity, matchAvatar, matchId } =
      await req.json();

    const emailHTML = generateMatchEmailHTML({
      recipientName,
      matchName,
      matchAge,
      matchLocation,
      affinity,
      matchAvatar,
      matchId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email template generated",
        html: emailHTML,
        to: recipientEmail,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
