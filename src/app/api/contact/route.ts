import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Client as NotionClient } from "@notionhq/client";
import {
  validateContact,
  type ContactPayload,
} from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTACT_TO = "contact@kinaya.wtf";
// Expéditeur : doit appartenir à un domaine vérifié dans Resend.
const CONTACT_FROM = process.env.CONTACT_FROM || "Kinaya <contact@kinaya.wtf>";

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

async function sendEmail(p: ContactPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const rows: [string, string][] = [
    ["Nom", p.nom],
    ["Email", p.email],
    ["Type de projet", p.type],
    ["Budget", p.budget || "—"],
  ];
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#171717">
      <h2 style="font-size:16px;margin:0 0 16px">Nouveau contact — ${esc(p.type)}</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#8a8a8a">${k}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`
          )
          .join("")}
      </table>
      <p style="margin:20px 0 6px;color:#8a8a8a">Message</p>
      <p style="white-space:pre-wrap;margin:0">${esc(p.message)}</p>
    </div>`;
  const text = `Nouveau contact — ${p.type}
Nom : ${p.nom}
Email : ${p.email}
Type de projet : ${p.type}
Budget : ${p.budget || "—"}

Message :
${p.message}`;

  const { error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: p.email,
    subject: `Nouveau contact — ${p.type}`,
    html,
    text,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

async function createNotionPage(p: ContactPayload) {
  const notion = new NotionClient({ auth: process.env.NOTION_API_KEY });
  const database_id = process.env.NOTION_DATABASE_ID;
  if (!database_id) throw new Error("NOTION_DATABASE_ID manquant");
  await notion.pages.create({
    parent: { database_id },
    properties: {
      Nom: { title: [{ text: { content: p.nom } }] },
      Email: { email: p.email },
      Type: { select: { name: p.type } },
      ...(p.budget ? { Budget: { select: { name: p.budget } } } : {}),
      Message: { rich_text: [{ text: { content: p.message.slice(0, 2000) } }] },
      Statut: { select: { name: "Nouveau" } },
    },
  });
}

export async function POST(req: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Honeypot : si rempli, on fait semblant d'accepter sans rien envoyer.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Formulaire incomplet.", errors }, { status: 400 });
  }

  const payload: ContactPayload = {
    nom: body.nom!.trim(),
    email: body.email!.trim(),
    type: body.type!,
    budget: body.budget || undefined,
    message: body.message!.trim(),
  };

  // Les deux actions partent en parallèle. Notion ne doit jamais bloquer
  // l'utilisateur : on logue son échec, mais seul l'email conditionne le succès.
  const [emailRes, notionRes] = await Promise.allSettled([
    sendEmail(payload),
    createNotionPage(payload),
  ]);

  if (notionRes.status === "rejected") {
    console.error("[contact] Notion échec :", notionRes.reason);
  }
  if (emailRes.status === "rejected") {
    console.error("[contact] Email échec :", emailRes.reason);
    return NextResponse.json(
      { error: "L’envoi a échoué. Réessayez ou écrivez à contact@kinaya.wtf." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
