import { codeToHtml, type BundledLanguage } from 'shiki';

export async function highlightCode(
  code: string,
  language: BundledLanguage = 'tsx',
): Promise<string> {
  return codeToHtml(code.replace(/\n+$/, ''), {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: 'light',
  });
}
