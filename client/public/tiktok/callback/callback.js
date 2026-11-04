export function localCallback(raw) {
  const url = new URL(raw);
  const params = url.searchParams;
  if (url.hash || url.search.length > 4096 || [...params.keys()].some(key => !['code', 'state', 'scopes', 'error', 'error_description'].includes(key))
    || ['code', 'state', 'scopes', 'error', 'error_description'].some(key => params.getAll(key).length > 1)
    || !/^[A-Za-z0-9_-]{43}$/.test(params.get('state') || '')) throw new Error('invalid_callback');
  const code = params.get('code'); const error = params.get('error');
  if (error ? !/^[a-z0-9_.-]{1,100}$/i.test(error) : !code || code.length > 2048 || /[\x00-\x20\x7f]/.test(code)) throw new Error('invalid_callback');
  const destination = new URL('http://127.0.0.1:8789/oauth/callback');
  destination.searchParams.set('state', params.get('state'));
  destination.searchParams.set(error ? 'error' : 'code', error || code);
  return destination.href;
}

if (typeof window !== 'undefined') {
  const raw = location.href;
  history.replaceState(null, '', '/tiktok/callback/');
  try {
    const destination = localCallback(raw); const link = document.getElementById('continue');
    link.href = destination; link.rel = 'noreferrer'; link.hidden = false;
    document.getElementById('status').textContent = 'Ответ получен. Возвращаемся в локальную панель ACA TikTok…';
    location.replace(destination);
  } catch {
    document.getElementById('status').textContent = 'Нет действительного ответа TikTok. Начните подключение из локальной панели ACA TikTok заново.';
  }
}
