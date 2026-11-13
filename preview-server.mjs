import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
const root = resolve('.');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png' };
const port=Number(process.env.PORT||5502);
createServer((req,res)=>{ const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); const file=resolve(root,`.${pathname}`); if(!file.startsWith(root+sep)&&file!==resolve(root,'index.html')){res.writeHead(403).end();return;} const target=existsSync(file)&&!pathname.endsWith('/')?file:resolve(root,'index.html'); if(!existsSync(target)){res.writeHead(404).end();return;} res.setHeader('Content-Type',types[extname(target)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');createReadStream(target).pipe(res); }).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}`));
