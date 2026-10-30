// Standalone interaction harness: substitutes only asset relative_url expressions.
// This does not replace the production Jekyll integration build.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const prefix = "/Wiredu2020";
http
  .createServer((req, res) => {
    const route = decodeURIComponent(req.url.split("?")[0]);
    if (route === prefix + "/projects/multivector-incidence-routing/") {
      let page = fs
        .readFileSync(path.join(root, "_projects/multivector-incidence-routing.md"), "utf8")
        .replace(/^\uFEFF?---[\s\S]*?---/, "")
        .replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, (_, asset) => prefix + asset);
      page = page
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\[Open the animation\]\(([^)]+)\)/g, '<a href="$1">Open the animation</a>');
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(
        '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MVF interaction fixture</title><body>' +
          page +
          "</body></html>"
      );
      return;
    }
    const filename = path.resolve(root, "." + route.slice(prefix.length));
    if (!route.startsWith(prefix + "/") || !filename.startsWith(root + path.sep)) {
      res.writeHead(404);
      res.end();
      return;
    }
    fs.readFile(filename, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.setHeader(
        "Content-Type",
        filename.endsWith(".mjs")
          ? "text/javascript"
          : filename.endsWith(".css")
            ? "text/css"
            : filename.endsWith(".gif")
              ? "image/gif"
              : "text/plain"
      );
      res.end(data);
    });
  })
  .listen(4190, "127.0.0.1");
