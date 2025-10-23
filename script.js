/* 設定: Google Apps Script の Web アプリ URL を入れてください */
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxk-4OzG5Ea6SJkOGETr9TktC-2cEc9QdppC94VPnEmr1gYtRmwb36MBuN4n9bQtCo3_g/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const emailInput = document.getElementById('email');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('status');
  const TIMEOUT_MS = 12000;
  let submitTimeoutId = null;

  function setStatus(kind, message) {
    statusEl.className = `status ${kind}`;
    statusEl.textContent = message;
  }

  function setStatusHtml(kind, html) {
    statusEl.className = `status ${kind}`;
    statusEl.innerHTML = html;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
  }

  function updateButtonState() {
    const valid = isValidEmail(emailInput.value);
    submitBtn.disabled = !valid;
    emailInput.classList.toggle('invalid', emailInput.value && !valid);
  }

  emailInput.addEventListener('input', updateButtonState);
  updateButtonState();

  // iframe 経由の完了通知を受け取る
  window.addEventListener('message', (event) => {
    try {
      const data = event.data || {};
      if (typeof data !== 'object') return;
      if (data.source !== 'gas-web-app') return;

      if (submitTimeoutId) {
        clearTimeout(submitTimeoutId);
        submitTimeoutId = null;
      }

      submitBtn.disabled = false;
      submitBtn.textContent = '登録する';

      if (data.status === 'ok') {
        setStatus('success', '登録が完了しました。ご協力ありがとうございます！');
        form.reset();
        updateButtonState();
      } else if (data.status === 'duplicate') {
        setStatus('info', 'すでに登録済みのメールアドレスです。');
      } else {
        const msg = (data && data.message) ? String(data.message) : '送信に失敗しました。時間をおいて再度お試しください。';
        setStatus('error', msg);
      }
    } catch (err) {
      // 何もしない
    }
  });

  form.addEventListener('submit', (e) => {
    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('REPLACE_WITH')) {
      e.preventDefault();
      setStatus('error', '管理者設定が未完了です。GAS の URL を設定してください。');
      return;
    }

    // 送信先を設定（hidden iframe 宛に POST）
    form.action = GAS_WEB_APP_URL;
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中…';
    setStatus('info', '送信しています…');

    // 応答がない場合のフォールバック
    if (submitTimeoutId) clearTimeout(submitTimeoutId);
    submitTimeoutId = setTimeout(() => {
      submitTimeoutId = null;
      submitBtn.disabled = false;
      submitBtn.textContent = '登録する';
      setStatusHtml('error', `応答がありません。GAS の公開設定を確認して再度お試しください。<br>
<a href="${GAS_WEB_APP_URL}" target="_blank" rel="noopener">GAS の公開URLを開いて状態を確認</a>`);
    }, TIMEOUT_MS);
  });
});

