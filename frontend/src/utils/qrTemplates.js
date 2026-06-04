/* src/utils/qrTemplates.js
   Preset color templates for QR Code Generator.
   Matches Snipra design palette.
*/
export const QR_TEMPLATES = [
  { name: 'Classic', bg: '#FFFFFF', fg: '#000000' },
  { name: 'Coral',   bg: '#FDF6EC', fg: '#E8553E' },
  { name: 'Night',   bg: '#1C1612', fg: '#FDF6EC' },
  { name: 'Ocean',   bg: '#E6F1FB', fg: '#185FA5' },
  { name: 'Forest',  bg: '#EAF3DE', fg: '#3B6D11' },
  { name: 'Candy',   bg: '#FBEAF0', fg: '#993556' },
  { name: 'Gold',    bg: '#FAEEDA', fg: '#854F0B' },
  { name: 'Slate',   bg: '#F1EFE8', fg: '#444441' },
];

/**
 * Helper to retrieve a template by name.
 * @param {string} name
 * @returns {{bg:string, fg:string}|null}
 */
export function getTemplateByName(name) {
  const tmpl = QR_TEMPLATES.find(t => t.name.toLowerCase() === name.toLowerCase());
  return tmpl ? { bg: tmpl.bg, fg: tmpl.fg } : null;
}
