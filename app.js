/* MU companion loader — focus view + UCL fixtures */
const PARTS = 3;
async function load() {
  const parts = [];
  for (let i = 0; i < PARTS; i++) {
    const r = await fetch('./c' + i + '.txt', { cache: 'no-store' });
    if (!r.ok) throw new Error('chunk ' + i);
    parts.push(await r.text());
  }
  const b64 = parts.join('');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const ds = new DecompressionStream('gzip');
  const stream = new Blob([bytes]).stream().pipeThrough(ds);
  const html = await new Response(stream).text();
  document.open();
  document.write(html);
  document.close();
}
load().catch(e => {
  document.getElementById('boot').innerHTML = 'Could not load companion. <a style="color:#C6A15B" href="https://github.com/kuzzzzz/mu-matchday-tracker">Repo</a><br><small>' + e + '</small>';
});
