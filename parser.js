import { appendFileSync } from 'fs';

export function parse(stack) {
  let tabs = 0;
  stack.forEach((s) => {
    let line = '';
    if (s.endGroup) {
      if (s.hiddenArrow) {
        line = `${''.padStart(tabs * 2, '  ')}${s.hiddenArrow}
`;
        tabs--;
        line += ''.padStart(tabs * 2, '  ') + '}';
      } else {
        tabs--;
        line = ''.padStart(tabs * 2, '  ') + '}';
      }
    } else if (s.isGroup) {
      line = ''.padStart(tabs * 2, '  ') + `${s.reference}(${s.id.replace(/-/g, '_')}, "${s.title}") {`;
      tabs++;
    } else {
      line = ''.padStart(tabs * 2, '  ') + `rectangle "$${s.reference}()\\n${s.title}" as ${s.id.replace(/-/g, '_')}`;
    }
    appendFileSync(
      'output.puml',
      `
${line}`,
    );
  });
}
