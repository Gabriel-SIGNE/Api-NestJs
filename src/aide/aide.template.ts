function methodColor(method: string): string {
    switch (method) {
        case 'GET': return '#22c55e';
        case 'POST': return '#3b82f6';
        case 'PUT': return '#f59e0b';
        case 'DELETE': return '#ef4444';
        default: return '#9ca3af';
    }
}

function renderJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
}

function renderFieldTable(champs: { nom: string; type: string; description: string }[]): string {
    return `
        <table class="fields">
            <thead>
                <tr><th>Champ</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody>
                ${champs.map(c => `
                <tr>
                    <td><code>${c.nom}</code></td>
                    <td><span class="type">${c.type}</span></td>
                    <td>${c.description}</td>
                </tr>`).join('')}
            </tbody>
        </table>`;
}

function renderModelCard(model: { nom: string; description: string; champs: any[] }): string {
    return `
    <div class="card">
        <h3>${model.nom}</h3>
        <p class="muted">${model.description}</p>
        ${renderFieldTable(model.champs)}
    </div>`;
}

function renderAuthBlock(title: string, block: any): string {
    return `
    <div class="card">
        <div class="route-head">
            <span class="badge" style="background:${methodColor(block.methode)}">${block.methode}</span>
            <code class="url">${block.url}</code>
        </div>
        <h3>${title}</h3>
        <p class="muted">${block.description}</p>

        <p class="label">Corps attendu</p>
        <pre>${renderJson(block.corpsAttendu)}</pre>

        ${block.exempleCorps ? `
        <p class="label">Exemple</p>
        <pre>${renderJson(block.exempleCorps)}</pre>` : ''}

        <div class="responses">
            <div class="resp resp-ok">
                <p class="label">Réponse succès · ${block.reponseSucces.statusCode}</p>
                <pre>${renderJson(block.reponseSucces.body)}</pre>
            </div>
            <div class="resp resp-err">
                <p class="label">Réponse erreur · ${block.reponseErreur.statusCode}</p>
                <pre>${renderJson(block.reponseErreur.body)}</pre>
            </div>
        </div>
    </div>`;
}

function renderRoute(route: any): string {
    const authBadge = route.authentificationRequise
        ? `<span class="auth-badge auth-required">🔒 Authentification requise</span>`
        : `<span class="auth-badge auth-open">🔓 Accès libre</span>`;

    return `
    <details class="route">
        <summary>
            <span class="badge" style="background:${methodColor(route.methode)}">${route.methode}</span>
            <code class="url">${route.url}</code>
            ${authBadge}
        </summary>
        <div class="route-body">
            <p>${route.description}</p>
            ${route.corps ? `
            <p class="label">Corps attendu</p>
            <pre>${renderJson(route.corps)}</pre>` : ''}
            <p class="label">Réponse succès · ${route.reponseSucces.statusCode}</p>
            <pre>${renderJson(route.reponseSucces.body)}</pre>
            ${route.reponseErreur ? `
            <p class="label">Réponse erreur · ${route.reponseErreur.statusCode}</p>
            <pre>${renderJson(route.reponseErreur.body)}</pre>` : ''}
        </div>
    </details>`;
}

export function getAideHtml(data: ReturnType<any>): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Documentation API — Stuff</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
    :root {
        --bg: #0b0b0d;
        --bg-card: #16171b;
        --border: #2a2b31;
        --text: #e8e9ec;
        --muted: #9195a1;
        --accent: #6366f1;
    }
    * { box-sizing: border-box; }
    body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', system-ui, sans-serif;
        line-height: 1.6;
    }
    code, pre { font-family: 'JetBrains Mono', ui-monospace, monospace; }
    a { color: var(--accent); }

    header.hero {
        padding: 64px 24px 40px;
        text-align: center;
        border-bottom: 1px solid var(--border);
        background: radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent 60%);
    }
    header.hero h1 {
        font-size: 2.2rem;
        margin: 0 0 12px;
        font-weight: 700;
    }
    header.hero p {
        color: var(--muted);
        max-width: 620px;
        margin: 0 auto;
        font-size: 1rem;
    }

    nav.toc {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        gap: 24px;
        padding: 14px;
        background: rgba(11,11,13,0.9);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--border);
    }
    nav.toc a {
        color: var(--muted);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
    }
    nav.toc a:hover { color: var(--text); }

    main {
        max-width: 880px;
        margin: 0 auto;
        padding: 48px 20px 100px;
    }

    section { margin-bottom: 56px; }
    section h2 {
        font-size: 1.4rem;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border);
    }

    .card {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
    }
    .card h3 { margin: 8px 0 4px; font-size: 1.1rem; }
    .muted { color: var(--muted); font-size: 0.92rem; }
    .label {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--muted);
        margin: 16px 0 6px;
        font-weight: 600;
    }

    pre {
        background: #0f1013;
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 14px 16px;
        overflow-x: auto;
        font-size: 0.85rem;
        color: #c9cdd6;
        margin: 0;
    }

    .responses {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 8px;
    }
    @media (max-width: 640px) {
        .responses { grid-template-columns: 1fr; }
    }

    .badge {
        display: inline-block;
        color: #0b0b0d;
        font-weight: 700;
        font-size: 0.72rem;
        padding: 3px 9px;
        border-radius: 6px;
        letter-spacing: 0.03em;
        min-width: 52px;
        text-align: center;
    }

    .route-head {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
    }
    .url {
        color: #d1d5db;
        font-size: 0.95rem;
    }

    table.fields {
        width: 100%;
        border-collapse: collapse;
        margin-top: 14px;
        font-size: 0.88rem;
    }
    table.fields th {
        text-align: left;
        color: var(--muted);
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        padding: 6px 10px;
        border-bottom: 1px solid var(--border);
    }
    table.fields td {
        padding: 8px 10px;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
    }
    table.fields code {
        color: #93c5fd;
    }
    .type {
        color: #fbbf24;
        font-size: 0.82rem;
    }

    details.route {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 10px;
        margin-bottom: 12px;
        overflow: hidden;
    }
    details.route summary {
        list-style: none;
        cursor: pointer;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        font-weight: 500;
    }
    details.route summary::-webkit-details-marker { display: none; }
    details.route summary::after {
        content: '＋';
        margin-left: auto;
        color: var(--muted);
        font-size: 1rem;
    }
    details.route[open] summary::after { content: '－'; }
    details.route .route-body {
        padding: 0 20px 20px;
        border-top: 1px solid var(--border);
        padding-top: 16px;
    }

    .auth-badge {
        font-size: 0.75rem;
        padding: 3px 10px;
        border-radius: 999px;
        font-weight: 500;
    }
    .auth-required { background: rgba(239,68,68,0.15); color: #fca5a5; }
    .auth-open { background: rgba(34,197,94,0.15); color: #86efac; }

    footer {
        text-align: center;
        padding: 32px;
        color: var(--muted);
        font-size: 0.85rem;
        border-top: 1px solid var(--border);
    }
</style>
</head>
<body>

<header class="hero">
    <h1>API Stuff — Documentation</h1>
    <p>${data.bienvenue}</p>
</header>

<nav class="toc">
    <a href="#authentification">Authentification</a>
    <a href="#modeles">Modèles</a>
    <a href="#routes">Routes</a>
</nav>

<main>

    <section id="authentification">
        <h2>🔑 Authentification</h2>
        <p class="muted">${data.authentification.description}</p>
        ${renderAuthBlock('Créer un compte', data.authentification.commentCreerUnCompte)}
        ${renderAuthBlock('Se connecter', data.authentification.commentSeConnecter)}
    </section>

    <section id="modeles">
        <h2>🗂️ Modèles de données</h2>
        ${data.modeles.map(renderModelCard).join('')}
    </section>

    <section id="routes">
        <h2>🚦 Routes disponibles</h2>
        ${data.routes.map(renderRoute).join('')}
    </section>

</main>

<footer>
    ${data.documentationInteractive}<br>
    <a href="/api-doc">Ouvrir la documentation Swagger →</a>
</footer>

</body>
</html>`;
}