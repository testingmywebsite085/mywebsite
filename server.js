const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

require("dotenv").config();
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/enviar", async (req, res) => {
    const { tipo, descricao, local, data, urgencia } = req.body;

    const mensagem = `
🚨 *NOVA DENÚNCIA ANÔNIMA* 🚨\n
📌 *TIPO DE DENÚNCIA:*  ${tipo}
⚠️ *URGÊNCIA:*  ${urgencia}
📍 *LOCALIZACAO:*  ${local || "NAO INFORMADO"}
📝 *DETALHES:*  ${descricao}
📅 *DATA:*  ${data || "NAO INFORMADA"}
    `;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: mensagem,
                parse_mode: "Markdown"
            })
        });

        res.send("DENÚNCIA ENVIADA COM SUCESSO!");
    } catch (error) {
        console.error(error);
        res.status(500).send("ERRO AO ENVIAR DENUNCIA!");
    }
});

app.use(express.static("."));

app.listen(3000, () => console.log("SERVER RUNNING: http://localhost:3000"));
