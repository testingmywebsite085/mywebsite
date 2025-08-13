const fetch = require("node-fetch");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Método não permitido");
    }

    // Captura os dados do corpo da requisição
    const { tipo, descricao, local, data, urgencia } = req.body || {};

    // Monta a mensagem
const mensagem = "🚨 *NOVA DENÚNCIA ANÔNIMA* 🚨\n"
  + "📌 *TIPO DE DENÚNCIA:* " + tipo + "\n"
  + "⚠️ *URGÊNCIA:* " + urgencia + "\n"
  + "📍 *LOCALIZAÇÃO:* " + (local || "NÃO INFORMADO") + "\n"
  + "📝 *DETALHES:* " + descricao + "\n"
  + "📅 *DATA:* " + (data || "NÃO INFORMADA");

    try {
        // Envia para a API do Telegram
        const resp = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: process.env.CHAT_ID,
                text: mensagem,
                parse_mode: "Markdown"
            })
        });

        // Lê a resposta da API do Telegram
        const dataResp = await resp.json();
        console.log("Resposta do Telegram:", dataResp);

        if (!dataResp.ok) {
            // Se o Telegram retornou erro, responde para o frontend
            return res.status(500).send("Erro do Telegram: " + JSON.stringify(dataResp));
        }

        // Sucesso
        res.status(200).send("DENÚNCIA ENVIADA COM SUCESSO!");
    } catch (error) {
        console.error("Erro ao enviar denúncia:", error);
        res.status(500).send("ERRO AO ENVIAR DENÚNCIA!");
    }
};
