// Minimal local test server for the Surans AI chat widget.
// Serves the static site (repo root) and exposes POST /api/chat,
// which turns a free-text message into site filter criteria using Claude.

require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const ROOT = path.join(__dirname, "..");
const PORT = process.env.PORT || 3000;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY — copy .env.example to .env and fill it in.");
  process.exit(1);
}

const client = new Anthropic();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

const SYSTEM_PROMPT = `Ești asistentul de recomandare parfumuri de pe Surans.ro, un comparator de prețuri pentru parfumuri arăbești și de nișă.
Utilizatorul descrie ce fel de parfum caută (mirosuri preferate, ocazie, sezon, pentru cine e). Tu extragi criterii de filtrare din mesaj și dai un răspuns scurt și prietenos în română (1-2 propoziții), care confirmă ce ai înțeles.

Reguli:
- season, occasion, gender, type acceptă DOAR valorile din enum-urile date — nu inventa alte valori, lasă lista goală dacă nu se aplică.
- note: nume de note olfactive în engleză, vocabular standard de parfumerie (ex: Vanilla, Oud, Rose, Amber, Sandalwood, Jasmine, Musk, Patchouli, Bergamot, Saffron, Vetiver, Tonka Bean). Poți include note chiar dacă nu ești sigur că sunt exact în arhivă — site-ul face potrivire aproximativă.
- Dacă userul menționează un parfum anume pe care vrea unul similar (ex: "ceva ca Dior Sauvage"), NU deduce filtre din el — în reply spune-i să folosească secțiunea "Ai deja un parfum" de pe site.
- Dacă mesajul e prea vag ca să extragi ceva, lasă toate listele goale și în reply pune o întrebare scurtă de clarificare (ex: ce ocazie, ce fel de miros îi place).
- Nu inventa nume de produse sau prețuri — tu doar propui filtre, site-ul afișează rezultatele reale din catalog.`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string", description: "Răspuns scurt, prietenos, în română." },
    filters: {
      type: "object",
      properties: {
        season: { type: "array", items: { type: "string", enum: ["Spring", "Summer", "Autumn", "Winter"] } },
        occasion: { type: "array", items: { type: "string", enum: ["Day", "Evening", "Romantic"] } },
        gender: { type: "array", items: { type: "string", enum: ["Women", "Men", "Unisex"] } },
        type: { type: "array", items: { type: "string", enum: ["Niche", "Middle Eastern"] } },
        note: { type: "array", items: { type: "string" } },
      },
      required: ["season", "occasion", "gender", "type", "note"],
      additionalProperties: false,
    },
  },
  required: ["reply", "filters"],
  additionalProperties: false,
};

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);

  // Prevent path traversal outside the site root.
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

async function handleChat(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    try {
      const { messages } = JSON.parse(body || "{}");
      if (!Array.isArray(messages) || messages.length === 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "messages array required" }));
        return;
      }

      const response = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        output_config: { format: { type: "json_schema", schema: RESPONSE_SCHEMA } },
        messages,
      });

      const textBlock = response.content.find((b) => b.type === "text");
      const parsed = JSON.parse(textBlock.text);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(parsed));
    } catch (err) {
      console.error("Chat error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Ceva nu a mers bine. Încearcă din nou." }));
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    handleChat(req, res);
    return;
  }
  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }
  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Surans chat test server running: http://localhost:${PORT}`);
});
