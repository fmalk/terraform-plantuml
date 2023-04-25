import { appendFileSync } from 'fs';

export function parse(stack) {
  let tabs = 0;
  stack.forEach((s) => {
    let line = '';
    if (s.endGroup) {
      tabs--;
      line = ''.padStart(tabs * 2, '  ') + '}';
    } else if (s.isGroup) {
      line = ''.padStart(tabs * 2, '  ') + `${s.reference}("${s.id.replace(/[-\s]/g, '_')}", "${s.title}") {`;
      tabs++;
    } else if (s.arrow) {
      line = ''.padStart(tabs * 2, '  ') + `${s.from.replace(/[-\s]/g, '_')} ${s.arrow} ${s.to.replace(/[-\s]/g, '_')}`;
    } else {
      line = ''.padStart(tabs * 2, '  ') + `rectangle "$${s.reference}()\\n${s.title}" as ${s.id.replace(/[-\s]/g, '_')}`;
    }
    appendFileSync(
      'output.puml',
      `
${line}`,
    );
  });
}
