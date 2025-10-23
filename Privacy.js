document.addEventListener('DOMContentLoaded', () => {
  const lastUpdated = document.getElementById('lastUpdated');
  const contactLink = document.getElementById('contactLink');

  // 最終更新日の表示（必要に応じて静的日付に変更）
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  lastUpdated.textContent = `${y}-${m}-${d}`;
  lastUpdated.setAttribute('datetime', `${y}-${m}-${d}`);

  // お問い合わせ先（必要に応じて環境に合わせて変更）
  if (contactLink && contactLink.textContent === 'contact@example.com') {
    // 運用時は適切な連絡先に差し替えてください
  }
});

