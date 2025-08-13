const fetch = require("node-fetch");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Método não permitido");
    }

    const { tipo, descricao, local, data, urgencia } = req.body;

    const mensagem = `
🚨 *NOVA DENÚNCIA ANÔNIMA* 🚨
📌 *TIPO DE DENÚNCIA:*  ${tipo}
⚠️ *URGÊNCIA:*  ${urgencia}
📍 *LOCALIZAÇÃO:*  ${local || "NÃO INFORMADO"}
📝 *DETALHES:*  ${descricao}
📅 *DATA:*  ${data || "NÃO INFORMADA"}
    `;

    try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: process.env.CHAT_ID,
                text: mensagem,
                parse_mode: "Markdown"
            })
        });

        res.status(200).send("DENÚNCIA ENVIADA COM SUCESSO!");
    } catch (error) {
        console.error(error);
        res.status(500).send("ERRO AO ENVIAR DENÚNCIA!");
    }
};
