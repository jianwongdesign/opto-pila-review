const message = document.querySelector('#status');

async function launch() {
  const fragment = location.hash.slice(1);
  if (!/^[A-Za-z0-9_-]{43}$/.test(fragment)) {
    message.textContent = 'Open the working review link supplied with the private project to load the clinic.';
    return;
  }
  const raw = Uint8Array.from(atob(fragment.replace(/-/g, '+').replace(/_/g, '/') + '='), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
  const response = await fetch('clinic.bin', {cache: 'no-cache'});
  if (!response.ok) throw Error('The review package could not be downloaded.');
  const encrypted = new Uint8Array(await response.arrayBuffer());
  const payload = await crypto.subtle.decrypt({name:'AES-GCM',iv:encrypted.slice(0,12)}, key, encrypted.slice(12));
  const blueprint = JSON.parse(new TextDecoder().decode(payload));
  const {startPlaygroundWeb} = await import('https://playground.wordpress.net/client/index.js');
  const client = await startPlaygroundWeb({
    iframe: document.querySelector('#clinic'),
    remoteUrl: 'https://playground.wordpress.net/remote.html',
    blueprint
  });
  document.querySelector('#splash').hidden = true;
  document.querySelector('#runtime').classList.remove('loading');
  for (const button of document.querySelectorAll('[data-path]')) {
    button.addEventListener('click', () => client.goTo(button.dataset.path));
  }
}
launch().catch(error => {
  console.error('Clinic review startup:', error);
  message.textContent = 'The working clinic could not open in this browser. Reload to try again or open the quick preview below.';
});
