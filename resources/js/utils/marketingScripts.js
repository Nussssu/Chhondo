/**
 * Injects Marketing tool custom code on client-side (Inertia) navigation.
 *
 * The initial page load is served by Blade, which already prints every snippet
 * that targets that URL. After that the app never reloads, so a snippet aimed at
 * (say) the checkout page would never appear if the visitor reached checkout via
 * an in-app link. This listens for navigation and injects any snippet that now
 * matches and has not been injected yet.
 *
 * A snippet is injected at most once per page load — tracking pixels are meant
 * to initialise once, and re-running them would double-count.
 */

const injected = new Set();

/** Laravel-style path: '/' for the home page, no leading slash otherwise. */
function currentPath() {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
    return path === "" ? "/" : path;
}

/** Mirrors Str::is() — '*' is the only wildcard. */
function matchesPattern(pattern, path) {
    if (pattern === "*") return true;
    if (pattern === path) return true;

    const escaped = pattern
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*");

    return new RegExp(`^${escaped}$`).test(path);
}

function matches(script, path) {
    return (script.patterns || []).some((p) => matchesPattern(p, path));
}

/**
 * Parse the snippet's HTML and append it. Script tags created by innerHTML do
 * not execute, so each one is rebuilt as a real element.
 */
function inject(script) {
    const holder = document.createElement("div");
    holder.innerHTML = script.script;

    const target =
        script.location === "head" ? document.head : document.body;

    Array.from(holder.childNodes).forEach((node) => {
        if (node.tagName === "SCRIPT") {
            const el = document.createElement("script");
            Array.from(node.attributes).forEach((attr) =>
                el.setAttribute(attr.name, attr.value)
            );
            el.text = node.text;
            el.setAttribute("data-mt-id", script.id);
            target.appendChild(el);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.setAttribute("data-mt-id", script.id);
            target.appendChild(node);
        }
    });
}

function run(scripts) {
    if (!Array.isArray(scripts) || scripts.length === 0) return;

    const path = currentPath();

    scripts.forEach((script) => {
        if (injected.has(script.id)) return;
        if (!matches(script, path)) return;

        try {
            inject(script);
        } catch (e) {
            console.error("Marketing script failed to inject:", script.title, e);
        }

        injected.add(script.id);
    });
}

/**
 * Seed the "already injected" set from what Blade printed, then handle every
 * subsequent navigation.
 */
export function setupMarketingScripts(router) {
    document.querySelectorAll("[data-mt-id]").forEach((el) => {
        injected.add(Number(el.getAttribute("data-mt-id")));
    });

    router.on("navigate", (event) => {
        run(event.detail?.page?.props?.marketingScripts);
    });
}
