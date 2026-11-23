import { bundledThemes, codeToHtml, type BundledLanguage } from 'shiki';

type CodeThemeName = 'github-light' | 'github-dark';

// GitHub's palettes are tuned for their own canvas (#ffffff and #0d1117). The docs render code
// on a sunken surface, which pushes a few tokens below the 4.5:1 contrast minimum. These
// replacements keep each token's hue while clearing AA on the light and dark code backgrounds.
const accessibleTokenColors: Record<CodeThemeName, Record<string, string>> = {
  'github-light': {
    '#D73A49': '#B31D28',
    '#22863A': '#17692F',
    '#E36209': '#A04100',
    '#6A737D': '#5A626B',
  },
  'github-dark': {
    '#6A737D': '#8B949E',
  },
};

function replaceColor(value: string | undefined, replacements: Record<string, string>) {
  if (!value) {
    return value;
  }

  return replacements[value.toUpperCase()] ?? value;
}

async function loadTheme(name: CodeThemeName) {
  // Bundled themes resolve to a module namespace whose default export is the theme.
  const { default: theme } = await bundledThemes[name]();
  const replacements = accessibleTokenColors[name];

  return {
    ...theme,
    tokenColors: theme.tokenColors?.map((rule) =>
      typeof rule === 'string'
        ? rule
        : {
            ...rule,
            settings: {
              ...rule.settings,
              foreground: replaceColor(rule.settings.foreground, replacements),
            },
          },
    ),
  };
}

// Themes load once per process; both are needed for every highlighted block.
const themes = Promise.all([loadTheme('github-light'), loadTheme('github-dark')]);

/** Contrast-safe palettes for the rehype pipeline, which needs the themes up front. */
export async function getHighlightThemes() {
  const [light, dark] = await themes;

  return { light, dark };
}

export async function highlightCode(
  code: string,
  language: BundledLanguage = 'tsx',
): Promise<string> {
  const { light, dark } = await getHighlightThemes();

  return codeToHtml(code.replace(/\n+$/, ''), {
    lang: language,
    themes: { light, dark },
    defaultColor: 'light',
  });
}
