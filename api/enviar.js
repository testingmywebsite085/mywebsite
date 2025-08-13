// arquivo: api/enviar.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).send("Método não permitido");
    }

    const { tipo, descricao, local, data, urgencia } = req.body;

    const botToken = "SEU_TOKEN_DO_BOT";
    const chatId = "SEU_CHAT_ID";

    const mensagem = `
🚨 Nova Denúncia Anônima 🚨
📄 Tipo: ${tipo}
📝 Descrição: ${descricao}
📍 Local: ${local}
📅 Data: ${data || "Não informado"}
⚠ Urgência: ${urgencia}
    `;

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: mensagem,
                parse_mode: "Markdown"
            })
        });

        res.status(200).send("Denúncia enviada com sucesso!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao enviar denúncia");
    }
}
