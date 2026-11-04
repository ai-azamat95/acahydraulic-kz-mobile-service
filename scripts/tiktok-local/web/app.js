const $ = id => document.getElementById(id);
let csrf, selected, previewUrl;
let uploading = false;
const messages = {
  credentials_not_saved: 'Тестовые ключи ещё не сохранены на Mac.',
  open_companion_first: 'Откройте локальную панель заново и повторите вход.',
  oauth_denied: 'Доступ не предоставлен. Можно повторить вход.',
  oauth_state_expired: 'Срок входа истёк. Начните подключение заново.',
  invalid_oauth_state: 'Проверка входа не пройдена. Начните подключение заново.',
  connect_tiktok_first: 'Сначала подключите TikTok.',
  tiktok_reauthorization_required: 'Срок доступа истёк. Войдите через TikTok заново.',
  only_aca_profile_allowed: 'Для загрузки нужен профиль @acaservice01 и разрешение user.info.profile.',
  draft_already_attempted_check_status: 'Этот файл уже отправлялся. Проверьте историю и входящие TikTok.',
  need_15_gib_free_disk_space: 'После копирования ролика на Mac нужно оставить не менее 15 ГиБ свободного места.',
  unsupported_video_use_mp4_h264_3_to_600_seconds: 'Нужен MP4 H.264/HEVC, 3–600 секунд, размеры от 360 до 4096 пикселей.',
  restart_to_clear_video_previews: 'Уже выбраны три ролика. Перезапустите панель, чтобы очистить временные копии.',
  video_size_outside_app_limit: 'Выберите видео размером от 1 КиБ до 128 МиБ.',
};
function message(text) { $('message').textContent = text; }
function failure(error) { message(messages[error.message] || 'Не удалось выполнить действие: ' + error.message + '.'); }
async function api(route, { method = 'GET', data, file } = {}) {
  const response = await fetch('/api/v1/' + route, {
    method, headers: method === 'POST' ? { 'Content-Type': file ? 'video/mp4' : 'application/json', 'X-CSRF-Token': csrf } : {},
    ...(method === 'POST' ? { body: file || JSON.stringify(data || {}) } : {}),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.code || 'request_failed');
  return result.data;
}
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function number(value) { return Number.isFinite(value) ? value.toLocaleString('ru-RU') : 'нет доступа'; }
function link(text, raw) {
  const node = element('a', text);
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || !['tiktok.com', 'www.tiktok.com'].includes(url.hostname)) return element('span', text);
    node.href = url.href; node.target = '_blank'; node.rel = 'noreferrer noopener';
    return node;
  } catch { return element('span', text); }
}
async function status() {
  const data = await api('status'); csrf = data.csrf;
  $('environment').textContent = data.environment === 'sandbox' ? 'Sandbox · тестовая среда' : 'Production';
  $('connection').textContent = data.connected ? 'TikTok подключён. Разрешения: ' + data.scopes.join(', ') :
    data.credentialsReady ? 'Ключи сохранены. Подключите свой профиль TikTok.' : 'Ключи ещё не сохранены на Mac.';
  $('connect').disabled = !data.credentialsReady || uploading || data.busy;
  $('refresh').disabled = !data.connected || uploading; $('file').disabled = !data.connected || uploading;
  if (data.oauthError) failure(new Error(data.oauthError));
  $('operations').replaceChildren();
  for (const item of [...data.operations].reverse()) {
    const row = element('div', undefined, 'operation');
    row.append(element('p', new Date(item.createdAt).toLocaleString('ru-RU') + ' · ' + item.status + (item.tiktokStatus ? ' · TikTok: ' + item.tiktokStatus : '')));
    if (item.error) row.append(element('p', messages[item.error] || item.error));
    if (item.publishId) {
      const button = element('button', 'Проверить статус в TikTok');
      button.addEventListener('click', async () => {
        button.disabled = true;
        try { await api('drafts/' + item.id + '/status', { method: 'POST' }); await status(); }
        catch (error) { failure(error); button.disabled = false; }
      }); row.append(button);
    } $('operations').append(row);
  } return data;
}
async function refresh() {
  const { user } = await api('profile');
  const profile = $('profile');
  profile.replaceChildren(element('h3', (user.username ? '@' + user.username + ' · ' : '') + (user.display_name || 'TikTok')));
  const metrics = element('div', undefined, 'metrics');
  for (const [name, value] of [['Подписчики', user.follower_count], ['Лайки', user.likes_count], ['Ролики', user.video_count], ['Подписки', user.following_count]]) {
    const item = element('div', undefined, 'metric'); item.append(element('strong', number(value)), element('span', name)); metrics.append(item);
  } profile.append(metrics, element('p', user.bio_description || ''));
  const data = await api('videos');
  $('videos').replaceChildren(element('h3', 'Последние публичные ролики'));
  for (const video of data.videos || []) {
    const row = element('div', undefined, 'video-row');
    row.append(link(video.title || 'Ролик TikTok', video.share_url), element('p',
      'Просмотры: ' + number(video.view_count) + ' · Лайки: ' + number(video.like_count) + ' · Комментарии: ' + number(video.comment_count) + ' · Репосты: ' + number(video.share_count)));
    $('videos').append(row);
  } if (!data.videos?.length) $('videos').append(element('p', 'Публичные ролики не получены.'));
}
$('connect').addEventListener('click', async () => {
  try {
    const data = await api('authorizations', { method: 'POST' }); const url = new URL(data.authorizationUrl);
    if (url.origin !== 'https://www.tiktok.com' || url.pathname !== '/v2/auth/authorize/') throw new Error('invalid_authorization_url');
    location.assign(url.href);
  } catch (error) { failure(error); }
});
$('refresh').addEventListener('click', () => refresh().catch(failure));
$('file').addEventListener('change', async () => {
  selected = null; $('confirm').checked = false; $('confirm').disabled = true; $('upload').disabled = true;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  const file = $('file').files[0]; $('preview').hidden = !file; if (!file) return;
  previewUrl = URL.createObjectURL(file); $('preview').src = previewUrl;
  message('Проверяем выбранный ролик на Mac…'); $('file').disabled = true;
  try {
    selected = await api('media', { method: 'POST', file });
    $('media-details').textContent = selected.width + ' × ' + selected.height + ' · ' + selected.duration.toFixed(1) + ' с · ' + (selected.size / 1024 ** 2).toFixed(1) + ' МиБ';
    $('confirm').disabled = false; message('Проверьте ролик и подтвердите отправку в черновики.');
  } catch (error) { failure(error); } finally { $('file').disabled = false; }
});
$('confirm').addEventListener('change', () => { $('upload').disabled = !$('confirm').checked || !selected || uploading; });
$('upload').addEventListener('click', async () => {
  if (!selected || !$('confirm').checked || uploading) return;
  uploading = true; $('upload').disabled = true; $('file').disabled = true; $('connect').disabled = true;
  message('Передаём ролик TikTok. Дождитесь результата; повторно отправлять файл не нужно.');
  try {
    await api('drafts', { method: 'POST', data: { mediaId: selected.id, confirmDraft: true } });
    message('Файл передан TikTok. Проверьте статус ниже и уведомление во входящих TikTok. Публикацию завершает владелец профиля.');
  } catch (error) { failure(error); }
  finally { uploading = false; $('confirm').checked = false; await status().catch(failure); }
});
status().then(data => { if (data.connected) return refresh(); }).catch(failure);
