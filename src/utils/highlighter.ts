import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';

export function highlightCode(code: string, language: string): string {
  try {
    const langMap: Record<string, string> = {
      c: 'c',
      cpp: 'cpp',
      python: 'python',
      java: 'java',
      javascript: 'javascript',
      js: 'javascript',
      html_css: 'markup',
      html: 'markup',
      css: 'css',
    };

    const targetLang = langMap[language] || 'javascript';
    const grammar = Prism.languages[targetLang] || Prism.languages.javascript;
    
    if (grammar) {
      return Prism.highlight(code, grammar, targetLang);
    }
    return escapeHtml(code);
  } catch (err) {
    console.warn('Prism highlight error, falling back to escaped HTML:', err);
    return escapeHtml(code);
  }
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
