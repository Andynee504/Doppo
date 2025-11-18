export function initEmulator() {
  const select = document.getElementById('deviceSelect');
  const emulator = document.getElementById('emulator');
  if (!select || !emulator) return;

  select.addEventListener('change', (e) => {
    const value = e.target.value || 'device-default';
    emulator.className = 'emulator ' + value;
  });

  select.value = 'device-default';
  emulator.className = 'emulator device-default';
}