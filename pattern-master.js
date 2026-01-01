

const dataPrefs = [...document.scripts].find(
  s => s.src && new URL(s.src, document.baseURI).href === import.meta.url
)?.dataset?.prefs || '{}';

const prefs = {
  ...{
    fix: 'nutz',
    svgNS: 'http://www.w3.org/2000/svg'
  },
  ...JSON.parse(dataPrefs)
};

const allDs = {

  dots:  'M1 .5a.5 .5 0 1 0 0.01 0Z',
  hatch: 'M0 0 V2H1V0Z',
  check: 'M0 0H1V2H2V1H0Z',
  cross: 'M0 0V2H2V1.75H.25V0Z',
  strip: 'M.5 0H1.5L0 1.5V.5ZM2 .5V1.5L1.5 2H.5Z',
  wave:  'M0 0H.5V.5H0ZM1 0H2V.5H1.5V1.5H.5V2H0V1H1V0Z',
  love:  'M1.5 1.5 h-.8 a.3 .3 0 0 1 0 -.8 a.3 .3 0 0 1 .8 0 z',
  stix:  'M.375 .375h.25v.5h.25v-.5h.75v.25h-.5v.25h.5v.75h-.25v-.5h-.25v.5h-.75v-.25h.5v-.25h-.5',
  stars: 'M.45 .45l.50 .25l.41 -.40l-.09 .57l.51 .26l-.57 .08l-.08 .57l-.26 -.51l-.57 .09l.40 -.41 z',
  curve: 'M.75 -.25A.75 .75 0 0 0 .25 .25A.75 .75 0 0 1 -.25 .75V-.25ZM1.25 2.25A.75 .75 0 0 0 1.75 1.75A.75 .75 0 0 1 2.25 1.25V2.25ZM-.25 1.75A.75 .75 0 0 1 .25 1.25A.75 .75 0 0 0 .75 .75A.75 .75 0 0 1 1.25 .25A.75 .75 0 0 0 1.75 -.25L2.25 .25A.75 .75 0 0 1 1.75 .75A.75 .75 0 0 0 1.25 1.25A.75 .75 0 0 1 .75 1.75A.75 .75 0 0 0 .25 2.25Z',
  scales:'M0 2V1.8A1.5 1.5 0 0 1 1.6 1.6A1.5 1.5 0 0 1 1.8 0H2V.2A1.3 1.3 0 0 0 2 1.8V2H1.8A1.3 1.3 0 0 0 .2 2ZM0 .2A1.3 1.3 0 0 1 .2 0H0Z',
  hound: 'M0 0H.5V1L.75 .75V.25L1 .5L1.25 .25V.75L1.5 1V0H2V.5L1.75 .25V.75L1.5 1V2L1.75 1.75V1.25L2 1.5V2H1.5L1.25 1.75V1.25L1 1.5L.75 1.25V1.75L.5 2H0V1.5L.25 1.25V1.75L.5 2V1L.25 .75V.25L0 .5Z',
  plaid: 'M0 1.2V0h1v.2l.2 -.2h.2l-.4 .4v.2l.6 -.6h.2l-.8 .8v.2l1 -1v.2l-.8 .8h-.2l-1 1v-.2l.8 -.8H.6l-.6 .6v-.2l.4 -.4h-.2zM.2 2h.6l.2 -.2v-.2l-.4 .4h-.2l.6 -.6v-.2zM1.4 1H2V.8l-.2 .2h-.2l.4 -.4V.4',
  clueless: `
     M.8 .8h.1l-.1 -.1v-.1l.2 .2h.1l-.3 -.3v-.1l.4 .4
     h.1l.4 .4h-.1l-.4 -.4v.1l.3 .3h-.1l-.2 -.2v.1l.1 .1h-.1
     v.1l-.1 -.1h-.1l.2 .2v.1l-.3 -.3h-.1l.4 .4v.1l-.4 -.4v-.1
     l-.4 -.4h.1l.3 .3v-.1l-.2 -.2h.1l.1 .1z

     M.1 .1h.7l.4 .4v-.1l-.3 -.3h.1l.2 .2v-.1l-.1 -.1h.8 
     v.7h-.1l.1 .1v.1l-.2 -.2h-.1l.3 .3v.1l-.4 -.4h-.1l.4 .4h.1v.7
     h-.7v-.1l-.4 -.4v.1l.4 .4h-.1l-.3 -.3v.1l.2 .2h-.1l-.1 -.1v.1h-.7v-.8
     l.1 .1h.1l-.2 -.2v-.1l.3 .3h.1l-.4 -.4
     L.1 .1L0 0V2H2V0H0z

     M.2 .8h.1l.4 .4h-.1z
     M.8 .3v-.1l.4 .4v.1z

  `
};

const makePath = (d, f) => `<path d="${d}" fill="${f}" fill-rule="evenodd" />`;

const MIG = (defs, [id, url, scl]) => defs.insertAdjacentHTML('beforeend',
  `<pattern id="${id}" width="1" height="1">
    <image href="${url}" transform="scale(${scl || 1})" />
   </pattern>`
);


const PAT = (
  defs, [id, typ, ...opts],
  [scl = 1.3, rot = 45] = [...opts.filter(a => !isNaN(Number(a)))],
  [col = 'currentColor', bak] = [...opts.filter(a => CSS.supports('color', a))]
) => defs.insertAdjacentHTML('beforeend',
  `<pattern id="${id}" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot}) scale(${scl})">` +
  (bak ? makePath("M0 0H2V2H0Z", bak) : '') +
  makePath(
    (/^x/i.test(typ) ? (typ = typ.replace(/^x/i, ''), 'M0 0H2V2H0Z') : '') +
    (allDs[typ] || typ), col
  ) +
  `</pattern>`
);

const makeURL = (defs, id, fill) => (/^ima?g\w*\(/.test(fill) ? (MIG(defs, [id, ...(fill.match(/\((.*)\)$/)[1].split(/,/))]), `url(#${id})`) : /^pat\w*\(/.test(fill) ? (PAT(defs, [id, ...(fill.match(/\((.*)\)$/)[1].split(/,(?![^(]*\))/))]), `url(#${id})`) : fill);
const makeID = v => btoa(encodeURIComponent(v)).replace(/[+/=]/g, '_');

const handleFill = obj => {

  const fill = obj.getAttribute('fill');

  const defs = obj.closest?.('svg')?.querySelector(`[data-${prefs.fix}]`);

  if (!/^(?:pat|ima?g)\w*\(/i.test(fill) || !defs) return;

  const id = obj.localName === 'pattern' ? obj.id : makeID(fill);

  obj.setAttribute('fill',
    defs.querySelector(`#${id}`)
      ? `url(#${id})`
      : makeURL(defs, id, fill)
  );

  if (id === obj.id) obj.remove();

};

const handleNode = n => {
  if (n.nodeType !== 1) return;
  if (n.localName === 'svg') processSVG(n);
  n.querySelectorAll?.('svg').forEach(processSVG);
  if (n.getAttribute('fill')) handleFill(n);
};

const processSVG = svg => {

  const defs = svg.querySelector(`[data-${prefs.fix}]`) ||
    svg.appendChild(document.createElementNS(prefs.svgNS, 'defs'));

  defs.setAttribute(`data-${prefs.fix}`, '');

  svg.querySelectorAll('[fill]').forEach(handleFill);
};

document.querySelectorAll('svg, object[type="image/svg+xml"]').forEach(obj => {
  obj.addEventListener('load', () => {
    processSVG(obj.contentDocument?.querySelector('svg') || obj);
  });
});

const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    if (m.type === 'attributes') handleFill(m.target);
    else m.addedNodes.forEach(handleNode);
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  childList: true,
  subtree: true,
  attributeFilter: ['fill']
});

