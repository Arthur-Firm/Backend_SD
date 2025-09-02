// Função serverless na Vercel (Node.js)
// Lida com CORS e com JSON vindo do front

const url_permitido = "*"; 
const EMAIL = "admin@email.com";
const SENHA = "1234";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", url_permitido); // ou "*" se for demo
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  // Responde o preflight do navegador
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Só aceitamos POST" });
  }

  // Tenta obter o JSON do body (Vercel normalmente já parseia com content-type correto)
  let body = req.body;
  if (!body) {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString("utf8");
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return res.status(400).json({ message: "JSON inválido" });
    }
  }

  const { email, senha } = body || {};
  if (email === EMAIL && senha === SENHA) {
    return res.status(200).json({ message: "Login OK" });
  } else {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }
}
