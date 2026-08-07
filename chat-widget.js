// Surans — AI perfume-finder chat widget (test build).
// Talks to POST /api/chat (see chat-test/server.js), then maps the
// extracted filters onto the site's existing activeFilters + render().
// Depends on globals defined in index.html: activeFilters, updateFilterUI,
// render, NOTE_LIST, currentPage.

(function () {
  const STYLE = `
    #suransChatBubble{
      position:fixed; bottom:24px; right:24px; z-index:999;
      width:72px; height:72px; border-radius:50%;
      background:#FFD100; color:#1C1813; border:none; cursor:pointer;
      box-shadow:0 10px 30px rgba(255,209,0,0.55), 0 4px 12px rgba(28,24,19,0.25);
      display:flex; align-items:center; justify-content:center; font-size:32px;
      transition:transform .15s ease, box-shadow .15s ease;
    }
    #suransChatBubble:hover{ background:#FFC300; transform:translateY(-2px) scale(1.05); box-shadow:0 14px 34px rgba(255,209,0,0.65), 0 6px 14px rgba(28,24,19,0.3); }
    #suransChatPanel{
      position:fixed; bottom:92px; right:22px; z-index:999;
      width:340px; max-width:calc(100vw - 32px); height:460px; max-height:70vh;
      background:#F7F7F5; border-radius:18px; box-shadow:0 14px 40px rgba(28,24,19,0.22);
      display:none; flex-direction:column; overflow:hidden; font-family:'Inter',sans-serif;
    }
    #suransChatPanel.open{ display:flex; }
    #suransChatHead{
      background:#1C1813; color:#fff; padding:16px 18px; display:flex; justify-content:space-between; align-items:center;
    }
    #suransChatHead .t{ font-weight:700; font-size:14px; }
    #suransChatHead .s{ font-size:11.5px; color:#c9c6bc; margin-top:2px; }
    #suransChatClose{ background:none; border:none; color:#fff; font-size:18px; cursor:pointer; opacity:.8; }
    #suransChatBody{ flex:1; overflow-y:auto; padding:14px 14px 6px; display:flex; flex-direction:column; gap:10px; }
    .scMsg{ max-width:85%; padding:10px 13px; border-radius:14px; font-size:13.5px; line-height:1.45; }
    .scMsg.bot{ background:#fff; color:#1C1813; align-self:flex-start; border-bottom-left-radius:4px; box-shadow:0 2px 8px rgba(28,24,19,0.06); }
    .scMsg.user{ background:#565436; color:#fff; align-self:flex-end; border-bottom-right-radius:4px; }
    .scMsg.typing{ color:#9599A0; font-style:italic; }
    #suransChatForm{ display:flex; gap:8px; padding:12px; border-top:1px solid #E8E7E3; background:#fff; }
    #suransChatInput{ flex:1; min-width:0; border:1px solid #E8E7E3; border-radius:20px; padding:9px 14px; font-size:13.5px; outline:none; font-family:'Inter',sans-serif; }
    #suransChatForm button{ background:#565436; color:#fff; border:none; border-radius:20px; padding:0 16px; font-weight:700; font-size:13px; cursor:pointer; }
    #suransChatForm button:hover{ background:#1C1813; }
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = STYLE;
  document.head.appendChild(styleTag);

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <button id="suransChatBubble" aria-label="Deschide asistentul de parfumuri">✦</button>
    <div id="suransChatPanel">
      <div id="suransChatHead">
        <div>
          <div class="t">Găsește-ți parfumul</div>
          <div class="s">Spune-mi ce cauți — te ajut să filtrez catalogul.</div>
        </div>
        <button id="suransChatClose" aria-label="Închide">✕</button>
      </div>
      <div id="suransChatBody"></div>
      <form id="suransChatForm">
        <input id="suransChatInput" type="text" placeholder="ex: ceva dulce, de seară, pentru femei..." autocomplete="off">
        <button type="submit">Trimite</button>
      </form>
    </div>
  `
  );

  const bubble = document.getElementById("suransChatBubble");
  const panel = document.getElementById("suransChatPanel");
  const closeBtn = document.getElementById("suransChatClose");
  const body = document.getElementById("suransChatBody");
  const form = document.getElementById("suransChatForm");
  const input = document.getElementById("suransChatInput");

  const history = []; // {role, content}

  function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = `scMsg ${who}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  addMessage(
    "Bună! Spune-mi ce fel de parfum cauți — note preferate, ocazie, sezon, pentru cine e — și îți filtrez catalogul pe loc.",
    "bot"
  );

  bubble.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) input.focus();
  });
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  function matchNote(aiNote) {
    if (typeof NOTE_LIST === "undefined") return null;
    const q = aiNote.toLowerCase().trim();
    let hit = NOTE_LIST.find((n) => n.toLowerCase() === q);
    if (!hit) hit = NOTE_LIST.find((n) => n.toLowerCase().includes(q) || q.includes(n.toLowerCase()));
    return hit || null;
  }

  function setCheckbox(panelId, value, checked) {
    const el = document.querySelector(`#${panelId} input[value="${CSS.escape(value)}"]`);
    if (el) el.checked = checked;
  }

  function applyFilters(filters) {
    if (typeof activeFilters === "undefined") return;

    const groups = [
      { key: "season", panelId: "seasonPanel" },
      { key: "occasion", panelId: "occasionPanel" },
      { key: "gender", panelId: "genderPanel" },
      { key: "type", panelId: "typePanel" },
    ];

    groups.forEach(({ key, panelId }) => {
      const values = filters[key] || [];
      if (values.length === 0) return;
      // Clear previous checkboxes in this group before applying the new set.
      (activeFilters[key] || []).forEach((v) => setCheckbox(panelId, v, false));
      activeFilters[key] = values;
      values.forEach((v) => setCheckbox(panelId, v, true));
    });

    const rawNotes = filters.note || [];
    if (rawNotes.length > 0) {
      const matched = rawNotes.map(matchNote).filter(Boolean);
      if (matched.length > 0) {
        (activeFilters.note || []).forEach((v) => setCheckbox("notePanel", v, false));
        activeFilters.note = [...new Set(matched)];
        activeFilters.note.forEach((v) => setCheckbox("notePanel", v, true));
      }
    }

    if (typeof updateFilterUI === "function") updateFilterUI();
    if (typeof currentPage !== "undefined") currentPage = 1;
    if (typeof render === "function") render();

    const entries = document.getElementById("entries");
    if (entries) entries.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function sendMessage(text) {
    addMessage(text, "user");
    history.push({ role: "user", content: text });

    const typingEl = addMessage("Caut...", "bot typing");

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await resp.json();

      typingEl.remove();

      if (data.error) {
        addMessage(data.error, "bot");
        return;
      }

      addMessage(data.reply, "bot");
      history.push({ role: "assistant", content: JSON.stringify(data) });
      applyFilters(data.filters || {});
    } catch (err) {
      typingEl.remove();
      addMessage("Nu am putut contacta asistentul chiar acum. Încearcă din nou în câteva secunde.", "bot");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });
})();
