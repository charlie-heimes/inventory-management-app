const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Canvas Tote Bag', sku: 'BAG-1042', barcode: '850000104201', category: 'Accessories', quantity: 42, reorder: 10, price: 18.5, icon: '👜', tint: '#f5eadf' },
  { id: 'p2', name: 'Ceramic Coffee Mug', sku: 'MUG-2088', barcode: '850000208805', category: 'Kitchen', quantity: 8, reorder: 12, price: 12, icon: '☕', tint: '#f2e8df' },
  { id: 'p3', name: 'Everyday Notebook', sku: 'STN-3015', barcode: '850000301507', category: 'Stationery', quantity: 126, reorder: 20, price: 6.75, icon: '📓', tint: '#e8eef5' },
  { id: 'p4', name: 'Insulated Water Bottle', sku: 'BOT-4190', barcode: '850000419004', category: 'Accessories', quantity: 6, reorder: 10, price: 24.99, icon: '🧴', tint: '#e4eff0' },
  { id: 'p5', name: 'Soy Candle — Cedar', sku: 'HOM-5521', barcode: '850000552107', category: 'Home', quantity: 31, reorder: 8, price: 16, icon: '🕯️', tint: '#f3eddf' },
  { id: 'p6', name: 'Linen Tea Towel', sku: 'KIT-6603', barcode: '850000660307', category: 'Kitchen', quantity: 4, reorder: 8, price: 14.5, icon: '🧺', tint: '#e9efe5' },
  { id: 'p7', name: 'Gel Pen Set (5 pack)', sku: 'STN-7712', barcode: '850000771201', category: 'Stationery', quantity: 58, reorder: 15, price: 9.25, icon: '🖊️', tint: '#eee8f5' },
  { id: 'p8', name: 'Woven Storage Basket', sku: 'HOM-8830', barcode: '850000883005', category: 'Home', quantity: 0, reorder: 5, price: 32, icon: '🧺', tint: '#f2e9df' },
  { id: 'p9', name: 'Stainless Lunch Box', sku: 'KIT-9024', barcode: '850000902401', category: 'Kitchen', quantity: 19, reorder: 6, price: 27.5, icon: '🍱', tint: '#e6eceb' }
];
const STORAGE_KEY = 'stockroom-inventory-v1';
let products = loadProducts();
const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) { console.warn('Could not read saved inventory:', error); }
  return SAMPLE_PRODUCTS.map((product) => ({ ...product }));
}
function saveProducts() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); $('#saved-label')?.classList.remove('unsaved'); }
  catch (error) { console.warn('Could not save inventory:', error); }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
function render() {
  const query = $('#product-search').value.trim().toLowerCase();
  const category = $('#category-filter').value;
  const filtered = products.filter((p) => `${p.name} ${p.sku} ${p.barcode} ${p.category}`.toLowerCase().includes(query) && (category === 'all' || p.category === category));
  const units = products.reduce((sum, p) => sum + Number(p.quantity), 0);
  const value = products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.price), 0);
  const low = products.filter((p) => Number(p.quantity) <= Number(p.reorder));
  $('#total-products').textContent = products.length.toLocaleString();
  $('#total-units').textContent = units.toLocaleString();
  $('#stock-value').textContent = money(value);
  $('#low-stock-count').textContent = low.length.toLocaleString();
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const filter = $('#category-filter');
  const currentCategory = filter.value;
  filter.innerHTML = '<option value="all">All categories</option>' + categories.map((item) => `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`).join('');
  if (categories.includes(currentCategory)) filter.value = currentCategory;
  $('#product-rows').innerHTML = filtered.map((p) => `<tr><td class="product-cell"><div class="product-name-wrap"><span class="product-thumb" style="background:${escapeHTML(p.tint || '#edf0ea')}">${escapeHTML(p.icon || '📦')}</span>${escapeHTML(p.name)}</div></td><td class="sku">${escapeHTML(p.sku)}<br>${escapeHTML(p.barcode || '')}</td><td><span class="category-pill">${escapeHTML(p.category)}</span></td><td><span class="stock-pill ${Number(p.quantity) <= Number(p.reorder) ? 'low' : ''}">${Number(p.quantity) === 0 ? 'Out of stock' : `${Number(p.quantity)} units`}</span></td><td class="price">${money(Number(p.price))}</td><td><button class="row-menu" data-adjust="${escapeHTML(p.id)}" aria-label="Adjust quantity for ${escapeHTML(p.name)}">···</button></td></tr>`).join('');
  $('#empty-state').hidden = filtered.length !== 0;
  $('#result-count').textContent = `Showing ${filtered.length} of ${products.length} products`;
  $('#low-stock-list').innerHTML = low.length ? low.slice(0, 4).map((p) => `<div class="low-stock-item"><span class="low-stock-thumb" style="background:${escapeHTML(p.tint || '#edf0ea')}">${escapeHTML(p.icon || '📦')}</span><div class="low-stock-detail"><strong>${escapeHTML(p.name)}</strong><span>Reorder at ${Number(p.reorder)} units</span></div><span class="low-qty">${Number(p.quantity)} left</span></div>`).join('') : '<p class="empty-state">Everything is well stocked ✨</p>';
}
function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('visible');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('visible'), 2500);
}
function lookupBarcode(code) {
  const product = products.find((item) => item.barcode === code || item.sku.toLowerCase() === code.toLowerCase());
  $('#scanner-message').textContent = product ? `${product.name} · ${product.quantity} units in stock.` : `No product found for “${code}”. Add it using the Add product button.`;
  if (product) { $('#product-search').value = code; render(); }
}
function answerQuestion(question) {
  const q = question.toLowerCase();
  const low = products.filter((p) => Number(p.quantity) <= Number(p.reorder));
  const out = products.filter((p) => Number(p.quantity) === 0);
  const units = products.reduce((sum, p) => sum + Number(p.quantity), 0);
  const matched = products.filter((p) => p.name.toLowerCase().split(/\s+/).some((word) => word.length > 2 && q.includes(word)) || p.sku.toLowerCase() === q.trim());
  if (!question.trim()) return 'Type a question about your inventory to get started.';
  if (matched.length) return matched.map((p) => `${p.name}: ${p.quantity} units in stock${Number(p.quantity) <= Number(p.reorder) ? ` (reorder level: ${p.reorder})` : ''}.`).join(' ');
  if (/low|reorder|attention|running out/.test(q)) return low.length ? `There ${low.length === 1 ? 'is' : 'are'} ${low.length} product${low.length === 1 ? '' : 's'} at or below reorder level: ${low.map((p) => `${p.name} (${p.quantity} left, reorder at ${p.reorder})`).join('; ')}.` : 'Nothing is currently at or below its reorder level. Nice work!';
  if (/out of stock|sold out|zero/.test(q)) return out.length ? `Out of stock: ${out.map((p) => p.name).join(', ')}.` : 'You do not have any products with zero stock.';
  if (/how many|total|units|items|inventory|stock value|worth|value/.test(q)) return `You have ${products.length} different products and ${units.toLocaleString()} units in stock, worth ${money(products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.price), 0))} at unit prices.`;
  if (/help|what can|question/.test(q)) return 'Try asking “What’s running low?”, “How many units do we have?”, or the name of a product.';
  return 'I can answer questions about current quantities, low stock, and product value. Try asking “What’s running low?” or entering a product name.';
}

$('#product-search').addEventListener('input', render);
$('#category-filter').addEventListener('change', render);
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#product-search').focus(); } });
$('#product-rows').addEventListener('click', (event) => {
  const button = event.target.closest('[data-adjust]'); if (!button) return;
  const product = products.find((p) => p.id === button.dataset.adjust); if (!product) return;
  const next = window.prompt(`Adjust stock for ${product.name}. Enter the new quantity:`, product.quantity);
  if (next === null) return;
  const quantity = Number(next);
  if (!Number.isInteger(quantity) || quantity < 0) return showToast('Enter a whole number of 0 or more.');
  product.quantity = quantity; saveProducts(); render(); showToast('Stock quantity updated.');
});
$('#reset-data').addEventListener('click', () => {
  if (!window.confirm('Reset your inventory to the original sample products? This removes changes saved in this browser.')) return;
  products = SAMPLE_PRODUCTS.map((product) => ({ ...product })); localStorage.removeItem(STORAGE_KEY); $('#product-search').value = ''; $('#category-filter').value = 'all'; render(); showToast('Sample inventory restored.');
});
$('#add-product').addEventListener('click', () => $('#product-dialog').showModal());
$('#product-form').addEventListener('submit', (event) => {
  event.preventDefault(); const data = new FormData(event.currentTarget); const name = String(data.get('name')).trim();
  products.unshift({ id: `p${Date.now()}`, name, sku: String(data.get('sku')).trim(), barcode: String(data.get('sku')).trim(), category: String(data.get('category')).trim(), quantity: Number(data.get('quantity')), reorder: Number(data.get('reorder')), price: Number(data.get('price')), icon: '📦', tint: '#e9efe5' });
  saveProducts(); render(); event.currentTarget.reset(); $('#product-dialog').close(); showToast(`${name} added to inventory.`);
});
$('#assistant-form').addEventListener('submit', (event) => {
  event.preventDefault(); const question = $('#assistant-question').value; const answer = $('#assistant-answer');
  answer.textContent = answerQuestion(question); answer.hidden = false; $('#assistant-question').value = '';
});
document.querySelectorAll('.suggestion').forEach((button) => button.addEventListener('click', () => {
  $('#assistant-answer').textContent = answerQuestion(button.textContent); $('#assistant-answer').hidden = false;
}));

let scannerStream = null; let scanLoop = null;
async function openScanner() {
  const dialog = $('#scanner-dialog'); dialog.showModal(); $('#scanner-message').textContent = 'Starting camera…';
  const video = $('#scanner-video');
  if (!('BarcodeDetector' in window)) { $('#scanner-message').textContent = 'Automatic scanning is not supported by this browser. You can still look up a barcode manually below.'; return; }
  if (!navigator.mediaDevices?.getUserMedia) { $('#scanner-message').textContent = 'Camera access requires HTTPS or localhost. Enter a barcode manually below.'; return; }
  try {
    const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'] });
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
    video.srcObject = scannerStream; $('#scanner-placeholder').hidden = true; await video.play();
    $('#scanner-message').textContent = 'Hold the barcode inside the frame.';
    const detect = async () => {
      if (!scannerStream || video.readyState < 2) return;
      try { const codes = await detector.detect(video); if (codes.length && codes[0].rawValue) { const code = codes[0].rawValue; $('#barcode-input').value = code; lookupBarcode(code); stopScanner(); return; } } catch (error) { /* Continue scanning the next frame. */ }
      scanLoop = requestAnimationFrame(detect);
    };
    detect();
  } catch (error) { $('#scanner-message').textContent = error.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access or enter a barcode manually.' : 'Could not start the camera. Enter a barcode manually below.'; }
}
function stopScanner() {
  if (scanLoop) cancelAnimationFrame(scanLoop); scanLoop = null;
  if (scannerStream) scannerStream.getTracks().forEach((track) => track.stop()); scannerStream = null;
  $('#scanner-video').srcObject = null; $('#scanner-placeholder').hidden = false;
}
$('#scan-open').addEventListener('click', openScanner);
$('#scanner-dialog').addEventListener('close', stopScanner);
$('#lookup-barcode').addEventListener('click', () => { const code = $('#barcode-input').value.trim(); if (code) lookupBarcode(code); else $('#scanner-message').textContent = 'Enter a barcode or SKU first.'; });
$('#barcode-input').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); $('#lookup-barcode').click(); } });

render();
