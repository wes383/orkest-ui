const themeScript = `(function () {
  try {
    var stored = window.localStorage.getItem('orkest-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-orkest-theme', theme);
  } catch (error) {
    // The CSS system preference fallback still applies when storage is unavailable.
  }
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
