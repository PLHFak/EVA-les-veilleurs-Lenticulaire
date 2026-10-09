/* Les Veilleurs, vitrine lenticulaire : boussole solaire et graphiques.
   Les valeurs viennent des scripts du dossier calcul/ (journée du 20 juillet, ciel clair). */
(() => {
  'use strict';

  // Journée de canicule : heure d'été, soleil par face (W/m²), air (°C),
  // lenticulaire en A et B sans vent (0) et par 2 m/s (2), azimut et hauteur du soleil (°).
  const JOUR = [{"h":5.0,"terre":0,"mer":0,"air":21.1,"A0":21.1,"A2":21.1,"B0":21.1,"B2":21.1,"az":43,"el":-8},{"h":5.5,"terre":0,"mer":0,"air":21.2,"A0":21.2,"A2":21.2,"B0":21.2,"B2":21.2,"az":49,"el":-4},{"h":6.0,"terre":0,"mer":0,"air":21.5,"A0":21.5,"A2":21.5,"B0":21.5,"B2":21.5,"az":55,"el":0},{"h":6.5,"terre":16,"mer":6,"air":21.9,"A0":22.3,"A2":22.2,"B0":22.4,"B2":22.3,"az":61,"el":4},{"h":7.0,"terre":83,"mer":19,"air":22.4,"A0":24.2,"A2":23.5,"B0":24.6,"B2":23.9,"az":66,"el":8},{"h":7.5,"terre":177,"mer":31,"air":23.1,"A0":26.7,"A2":25.1,"B0":27.5,"B2":25.9,"az":72,"el":12},{"h":8.0,"terre":276,"mer":42,"air":23.7,"A0":29.2,"A2":26.9,"B0":30.4,"B2":28.1,"az":78,"el":17},{"h":8.5,"terre":371,"mer":53,"air":24.5,"A0":31.7,"A2":28.7,"B0":33.4,"B2":30.4,"az":83,"el":21},{"h":9.0,"terre":458,"mer":64,"air":25.3,"A0":34.2,"A2":30.5,"B0":36.1,"B2":32.5,"az":89,"el":26},{"h":9.5,"terre":532,"mer":74,"air":26.2,"A0":36.4,"A2":32.2,"B0":38.6,"B2":34.5,"az":95,"el":31},{"h":10.0,"terre":593,"mer":84,"air":27.1,"A0":38.4,"A2":33.7,"B0":40.9,"B2":36.3,"az":101,"el":35},{"h":10.5,"terre":639,"mer":93,"air":28.0,"A0":40.1,"A2":35.2,"B0":42.8,"B2":37.9,"az":108,"el":40},{"h":11.0,"terre":670,"mer":101,"air":28.9,"A0":41.6,"A2":36.4,"B0":44.4,"B2":39.3,"az":115,"el":44},{"h":11.5,"terre":684,"mer":108,"air":29.8,"A0":42.8,"A2":37.5,"B0":45.6,"B2":40.4,"az":123,"el":48},{"h":12.0,"terre":682,"mer":114,"air":30.7,"A0":43.7,"A2":38.4,"B0":46.5,"B2":41.3,"az":133,"el":52},{"h":12.5,"terre":664,"mer":118,"air":31.5,"A0":44.2,"A2":39.1,"B0":47.0,"B2":42.0,"az":143,"el":55},{"h":13.0,"terre":631,"mer":122,"air":32.3,"A0":44.5,"A2":39.6,"B0":47.1,"B2":42.3,"az":155,"el":58},{"h":13.5,"terre":583,"mer":124,"air":32.9,"A0":44.4,"A2":39.8,"B0":46.9,"B2":42.4,"az":168,"el":59},{"h":14.0,"terre":521,"mer":124,"air":33.6,"A0":44.0,"A2":39.8,"B0":46.3,"B2":42.1,"az":182,"el":59},{"h":14.5,"terre":448,"mer":123,"air":34.1,"A0":43.3,"A2":39.6,"B0":45.3,"B2":41.7,"az":196,"el":59},{"h":15.0,"terre":364,"mer":121,"air":34.5,"A0":42.3,"A2":39.2,"B0":44.1,"B2":40.9,"az":209,"el":57},{"h":15.5,"terre":272,"mer":117,"air":34.8,"A0":41.1,"A2":38.5,"B0":42.5,"B2":40.0,"az":220,"el":54},{"h":16.0,"terre":174,"mer":112,"air":34.9,"A0":39.6,"A2":37.7,"B0":40.6,"B2":38.8,"az":230,"el":51},{"h":16.5,"terre":106,"mer":139,"air":35.0,"A0":39.0,"A2":37.4,"B0":39.9,"B2":38.3,"az":239,"el":47},{"h":17.0,"terre":98,"mer":227,"air":34.9,"A0":40.2,"A2":38.1,"B0":41.4,"B2":39.3,"az":247,"el":43},{"h":17.5,"terre":90,"mer":310,"air":34.8,"A0":41.3,"A2":38.6,"B0":42.7,"B2":40.1,"az":254,"el":38},{"h":18.0,"terre":80,"mer":385,"air":34.5,"A0":42.0,"A2":39.0,"B0":43.7,"B2":40.7,"az":261,"el":34},{"h":18.5,"terre":71,"mer":448,"air":34.1,"A0":42.5,"A2":39.1,"B0":44.3,"B2":41.0,"az":267,"el":29},{"h":19.0,"terre":60,"mer":493,"air":33.6,"A0":42.6,"A2":38.9,"B0":44.5,"B2":40.9,"az":273,"el":24},{"h":19.5,"terre":49,"mer":512,"air":32.9,"A0":42.1,"A2":38.4,"B0":44.1,"B2":40.4,"az":279,"el":20},{"h":20.0,"terre":38,"mer":492,"air":32.3,"A0":41.0,"A2":37.4,"B0":42.9,"B2":39.4,"az":284,"el":15},{"h":20.5,"terre":27,"mer":415,"air":31.5,"A0":38.8,"A2":35.8,"B0":40.4,"B2":37.4,"az":290,"el":11},{"h":21.0,"terre":15,"mer":254,"air":30.7,"A0":35.2,"A2":33.3,"B0":36.2,"B2":34.3,"az":295,"el":6},{"h":21.5,"terre":3,"mer":50,"air":29.8,"A0":30.7,"A2":30.3,"B0":30.9,"B2":30.5,"az":301,"el":2},{"h":22.0,"terre":0,"mer":0,"air":28.9,"A0":28.9,"A2":28.9,"B0":28.9,"B2":28.9,"az":307,"el":-2},{"h":22.5,"terre":0,"mer":0,"air":28.0,"A0":28.0,"A2":28.0,"B0":28.0,"B2":28.0,"az":313,"el":-5}];

  const AXE_DIGUE = 56.16;            // azimut de la digue, degrés depuis le nord
  const C = { a: '#0B7FA0', b: '#C7781A', encre: '#12303A', gris: '#7D97A1', air: '#8FA4AA', soleil: '#C99200' };

  const rad = d => d * Math.PI / 180;
  const fr1 = v => v.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const heure = h => `${Math.floor(h)} h ${h % 1 ? '30' : '00'}`;
  const el = (id) => document.getElementById(id);
  const bulle = el('bulle');

  function montrerBulle(html, evt) {
    bulle.innerHTML = html;
    bulle.hidden = false;
    const marge = 14, l = bulle.offsetWidth, hgt = bulle.offsetHeight;
    let x = evt.clientX + marge, y = evt.clientY + marge;
    if (x + l > window.innerWidth - 8) x = evt.clientX - l - marge;
    if (y + hgt > window.innerHeight - 8) y = evt.clientY - hgt - marge;
    bulle.style.left = `${Math.max(8, x)}px`;
    bulle.style.top = `${Math.max(8, y)}px`;
  }
  const cacherBulle = () => { bulle.hidden = true; };

  /* ---------- Boussole solaire ---------- */
  const cx = 210, cy = 208, R = 150;
  const pol = (az, r) => [cx + r * Math.sin(rad(az)), cy - r * Math.cos(rad(az))];
  const rayonSoleil = e => R * (90 - Math.max(e, 0)) / 90;
  const rot = -(90 - AXE_DIGUE);       // l'axe x local suit la digue

  function dessinerBoussole() {
    const svg = el('boussole-svg');
    const course = JOUR.filter(r => r.el > 0).map(r => pol(r.az, rayonSoleil(r.el)).map(v => v.toFixed(1)).join(',')).join(' ');
    const reperes = [7, 10, 13, 16, 19].map(h => {
      const r = JOUR.find(d => d.h === h);
      const [x, y] = pol(r.az, rayonSoleil(r.el));
      const [tx, ty] = pol(r.az, rayonSoleil(r.el) + 15);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="${C.soleil}"/><text class="b-heure" x="${tx.toFixed(1)}" y="${(ty + 4).toFixed(1)}" text-anchor="middle">${h} h</text>`;
    }).join('');
    const [vx1, vy1] = pol(263, 200), [vx2, vy2] = pol(263, 158);
    svg.innerHTML = `
      <defs>
        <clipPath id="b-disque"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
        <marker id="b-fleche" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#48626B"/></marker>
      </defs>
      <g clip-path="url(#b-disque)">
        <g transform="rotate(${rot.toFixed(2)} ${cx} ${cy})">
          <rect class="b-mer" x="-100" y="-100" width="620" height="${cy - 46 + 100}"/>
          <rect class="b-plage" x="-100" y="${cy - 46}" width="620" height="30"/>
          <rect class="b-digue" x="-100" y="${cy - 16}" width="620" height="32"/>
          <rect class="b-terre" x="-100" y="${cy + 16}" width="620" height="400"/>
          <text class="b-txt-2" x="${cx - 142}" y="${cy - 26}">plage</text>
          <text class="b-txt-2" x="${cx - 142}" y="${cy + 5}">digue</text>
        </g>
      </g>
      <circle class="b-cercle" cx="${cx}" cy="${cy}" r="${R}"/>
      <text class="b-txt" x="${cx - 70}" y="${cy - 82}" text-anchor="middle">Mer du Nord</text>
      <text class="b-txt" x="${cx + 62}" y="${cy + 96}" text-anchor="middle">terre</text>
      <path d="M${cx} ${cy - R - 16}l5 10h-10z" fill="${C.encre}"/><text class="b-txt" x="${cx}" y="${cy - R - 22}" text-anchor="middle" font-weight="650">N</text>
      <polyline class="b-course" points="${course}"/>
      ${reperes}
      <line id="b-rayon" class="b-rayon" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy}"/>
      <g transform="rotate(${rot.toFixed(2)} ${cx} ${cy})">
        <line id="b-eclaire" x1="${cx - 38}" x2="${cx + 38}" y1="${cy}" y2="${cy}" stroke="${C.soleil}" stroke-width="4"/>
        <line class="b-vitre" x1="${cx - 38}" x2="${cx + 38}" y1="${cy}" y2="${cy}"/>
        <text class="b-txt-2" x="${cx + 46}" y="${cy - 8}">face mer</text>
        <text class="b-txt-2" x="${cx + 46}" y="${cy + 16}">face terre</text>
      </g>
      <circle id="b-soleil" class="b-soleil" cx="${cx}" cy="${cy}" r="9"/>
      <line class="b-vent" x1="${vx1.toFixed(1)}" y1="${vy1.toFixed(1)}" x2="${vx2.toFixed(1)}" y2="${vy2.toFixed(1)}" marker-end="url(#b-fleche)"/>
      <text class="b-txt-2" x="4" y="${(vy1 + 20).toFixed(1)}">vent</text>
      <text class="b-txt-2" x="4" y="${(vy1 + 34).toFixed(1)}">dominant</text>
      <text id="b-couche" class="b-txt-2" x="${cx}" y="${cy + R + 22}" text-anchor="middle"></text>`;
  }

  function majBoussole() {
    const i = Number(el('heure').value);
    const r = JOUR.at(i);
    const vent = document.querySelector('input[name="vent"]:checked').value;
    el('heure-lue').textContent = heure(r.h);
    el('l-terre').textContent = `${r.terre} W/m²`;
    el('l-mer').textContent = `${r.mer} W/m²`;
    el('l-air').textContent = `${fr1(r.air)} °C`;
    el('l-a').textContent = `${fr1(vent === '2' ? r.A2 : r.A0)} °C`;
    el('l-b').textContent = `${fr1(vent === '2' ? r.B2 : r.B0)} °C`;
    const jourLeve = r.el > 0;
    const [sx, sy] = pol(r.az, rayonSoleil(r.el));
    const soleil = el('b-soleil'), rayon = el('b-rayon'), eclaire = el('b-eclaire');
    soleil.setAttribute('cx', sx.toFixed(1)); soleil.setAttribute('cy', sy.toFixed(1));
    soleil.style.display = jourLeve ? '' : 'none';
    rayon.setAttribute('x2', sx.toFixed(1)); rayon.setAttribute('y2', sy.toFixed(1));
    rayon.style.display = jourLeve ? '' : 'none';
    // côté éclairé : produit scalaire entre la direction du soleil et la normale vers la mer (azimut digue + 270°)
    const versMer = Math.cos(rad(r.az - (AXE_DIGUE + 270)));
    const decal = versMer > 0 ? -6 : 6;
    eclaire.setAttribute('y1', cy + decal); eclaire.setAttribute('y2', cy + decal);
    eclaire.style.display = jourLeve && Math.abs(versMer) > 0.08 ? '' : 'none';
    el('b-couche').textContent = jourLeve ? `Soleil à ${r.el}° de hauteur, azimut ${r.az}°` : 'Soleil sous l’horizon';
    el('heure').setAttribute('aria-valuetext', heure(r.h));
  }

  /* ---------- Graphique de la journée ---------- */
  function grapheJour() {
    const W = 760, H = 430, g = 56, d = 716;
    const X = h => g + (h - 5) / 17.5 * (d - g);
    const p1 = { haut: 74, bas: 196, min: 0, max: 800 }, p2 = { haut: 262, bas: 386, min: 20, max: 75 };
    const Y = (p, v) => p.bas - (v - p.min) / (p.max - p.min) * (p.bas - p.haut);
    const ligne = (cle, p) => 'M' + JOUR.map(r => `${X(r.h).toFixed(1)} ${Y(p, r[cle]).toFixed(1)}`).join('L');
    const grille = (p, pas, unite) => {
      let s = '';
      for (let v = p.min; v <= p.max; v += pas) s += `<line class="g-grille" x1="${g}" x2="${d}" y1="${Y(p, v)}" y2="${Y(p, v)}"/><text class="g-txt" x="${g - 8}" y="${Y(p, v) + 4}" text-anchor="end">${v}${unite}</text>`;
      return s;
    };
    const heures = [6, 8, 10, 12, 14, 16, 18, 20, 22].map(h => `<text class="g-txt" x="${X(h)}" y="${p2.bas + 18}" text-anchor="middle">${h} h</text>`).join('');
    const cle = (x, y, coul, nom) => `<line x1="${x}" x2="${x + 18}" y1="${y - 4}" y2="${y - 4}" stroke="${coul}" stroke-width="2.5" stroke-linecap="round"/><text class="g-txt" x="${x + 24}" y="${y}">${nom}</text>`;
    const pic = (cleD, p, dy) => { const r = JOUR.reduce((a, b) => (b[cleD] > a[cleD] ? b : a)); return { r, x: X(r.h), y: Y(p, r[cleD]) + dy }; };
    const pt = pic('terre', p1, -9), pm = pic('mer', p1, -9), pa = pic('A0', p2, 16), pb = pic('B0', p2, -9), pair = pic('air', p2, -9);
    el('g-jour').innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Soleil reçu par chaque face et températures au fil de la journée du 20 juillet">
      <text class="g-titre" x="${g - 40}" y="24">Calcul heure par heure : le maximum de soleil (11 h 30) précède le maximum de l’air (16 h 30)</text>
      <text class="g-txt" x="${g - 40}" y="52">Soleil reçu par face, en W/m²</text>
      ${cle(d - 196, 52, C.encre, 'face terre')}${cle(d - 96, 52, C.gris, 'face mer')}
      ${grille(p1, 200, '')}
      <text class="g-txt" x="${g - 40}" y="240">Températures, en °C</text>
      ${cle(d - 330, 240, C.air, 'air')}${cle(d - 270, 240, C.a, 'lenticulaire A')}${cle(d - 140, 240, C.b, 'lenticulaire B')}
      ${grille(p2, 10, '')}
      <line class="g-repere" x1="${g}" x2="${d}" y1="${Y(p2, 70)}" y2="${Y(p2, 70)}"/>
      <text class="g-val" x="${g + 6}" y="${Y(p2, 70) - 6}">Limite de service du PMMA extrudé : 70 °C</text>
      <line class="g-axe" x1="${X(16.5)}" x2="${X(16.5)}" y1="${p1.haut}" y2="${p2.bas}"/>
      <text class="g-txt" x="${X(16.5) + 6}" y="${p1.haut + 10}">16 h 30</text>
      <path d="${ligne('mer', p1)}" fill="none" stroke="${C.gris}" stroke-width="2" stroke-linejoin="round"/>
      <path d="${ligne('terre', p1)}" fill="none" stroke="${C.encre}" stroke-width="2" stroke-linejoin="round"/>
      <path d="${ligne('air', p2)}" fill="none" stroke="${C.air}" stroke-width="2" stroke-linejoin="round"/>
      <path d="${ligne('B0', p2)}" fill="none" stroke="${C.b}" stroke-width="2" stroke-linejoin="round"/>
      <path d="${ligne('A0', p2)}" fill="none" stroke="${C.a}" stroke-width="2" stroke-linejoin="round"/>
      <text class="g-val" x="${pt.x}" y="${pt.y}" text-anchor="middle">${pt.r.terre}</text>
      <text class="g-val" x="${pm.x}" y="${pm.y}" text-anchor="middle">${pm.r.mer}</text>
      <text class="g-val" x="${pb.x}" y="${pb.y}" text-anchor="middle">${fr1(pb.r.B0)}</text>
      <text class="g-val" x="${pa.x}" y="${pa.y}" text-anchor="middle">${fr1(pa.r.A0)}</text>
      <text class="g-val" x="${pair.x + 8}" y="${pair.y + 26}">${fr1(pair.r.air)}</text>
      <line class="g-axe" x1="${g}" x2="${d}" y1="${p1.bas}" y2="${p1.bas}"/>
      <line class="g-axe" x1="${g}" x2="${d}" y1="${p2.bas}" y2="${p2.bas}"/>
      ${heures}
      <g id="viseur" style="display:none"><line class="g-viseur" y1="${p1.haut}" y2="${p2.bas}"/>
        <circle r="4.5" fill="${C.encre}" stroke="#F8FAFA" stroke-width="2" data-k="terre"/><circle r="4.5" fill="${C.gris}" stroke="#F8FAFA" stroke-width="2" data-k="mer"/>
        <circle r="4.5" fill="${C.air}" stroke="#F8FAFA" stroke-width="2" data-k="air"/><circle r="4.5" fill="${C.b}" stroke="#F8FAFA" stroke-width="2" data-k="B0"/><circle r="4.5" fill="${C.a}" stroke="#F8FAFA" stroke-width="2" data-k="A0"/></g>
      <rect id="zone-jour" x="${g}" y="${p1.haut}" width="${d - g}" height="${p2.bas - p1.haut}" fill="transparent"/>
    </svg>`;
    const svg = el('g-jour').querySelector('svg'), viseur = svg.querySelector('#viseur'), zone = svg.querySelector('#zone-jour');
    const suivre = evt => {
      const b = svg.getBoundingClientRect();
      const h = 5 + ((evt.clientX - b.left) / b.width * W - g) / (d - g) * 17.5;
      const r = JOUR.reduce((a, c) => (Math.abs(c.h - h) < Math.abs(a.h - h) ? c : a));
      viseur.style.display = '';
      viseur.querySelector('line').setAttribute('x1', X(r.h)); viseur.querySelector('line').setAttribute('x2', X(r.h));
      viseur.querySelectorAll('circle').forEach(c => { const k = c.dataset.k; c.setAttribute('cx', X(r.h)); c.setAttribute('cy', Y(k === 'terre' || k === 'mer' ? p1 : p2, r[k])); });
      montrerBulle(`<b>${heure(r.h)}</b><br><i style="background:${C.encre};outline:1px solid #fff"></i>Face terre : ${r.terre} W/m²<br><i style="background:${C.gris}"></i>Face mer : ${r.mer} W/m²<br><i style="background:${C.air}"></i>Air : ${fr1(r.air)} °C<br><i style="background:${C.a}"></i>Lenticulaire A : ${fr1(r.A0)} °C<br><i style="background:${C.b}"></i>Lenticulaire B : ${fr1(r.B0)} °C`, evt);
    };
    zone.addEventListener('pointermove', suivre);
    zone.addEventListener('pointerdown', suivre);
    zone.addEventListener('pointerleave', () => { viseur.style.display = 'none'; cacherBulle(); });

    el('t-jour').innerHTML = '<table><thead><tr><th scope="col">Heure</th><th scope="col">Face terre (W/m²)</th><th scope="col">Face mer (W/m²)</th><th scope="col">Air (°C)</th><th scope="col">A sans vent</th><th scope="col">A à 2 m/s</th><th scope="col">B sans vent</th><th scope="col">B à 2 m/s</th></tr></thead><tbody>' +
      JOUR.filter(r => r.h % 1 === 0).map(r => `<tr><th scope="row">${heure(r.h)}</th><td>${r.terre}</td><td>${r.mer}</td><td>${fr1(r.air)}</td><td>${fr1(r.A0)}</td><td>${fr1(r.A2)}</td><td>${fr1(r.B0)}</td><td>${fr1(r.B2)}</td></tr>`).join('') + '</tbody></table>';
  }

  /* ---------- Barres : température par cas ---------- */
  function grapheTemp() {
    const cas = [
      { nom: ['Journée réelle', 'sans vent'], a: 44.5, b: 47.1 },
      { nom: ['Journée réelle', 'vent de 2 m/s'], a: 39.8, b: 42.4 },
      { nom: ['Cas enveloppe', 'sans vent'], a: 49.3, b: 52.4 },
      { nom: ['Cas enveloppe', 'vent de 2 m/s'], a: 43.7, b: 46.8 }
    ];
    const W = 760, H = 360, g = 56, d = 716, haut = 78, bas = 300, e = 24;
    const Y = v => bas - v / 80 * (bas - haut);
    const pas = (d - g) / cas.length;
    const barre = (x, v, coul, info) => `<path class="barre" data-info="${info}" d="M${x} ${bas}V${Y(v) + 4}a4 4 0 0 1 4 -4h${e - 8}a4 4 0 0 1 4 4V${bas}z" fill="${coul}"/><text class="g-val" x="${x + e / 2}" y="${Y(v) - 7}" text-anchor="middle">${fr1(v)}</text>`;
    let s = '';
    cas.forEach((c, i) => {
      const xc = g + pas * (i + 0.5);
      s += barre(xc - e - 1, c.a, C.a, `${c.nom.join(', ')}|A, sandwich étanche : ${fr1(c.a)} °C`);
      s += barre(xc + 1, c.b, C.b, `${c.nom.join(', ')}|B, lames ventilées : ${fr1(c.b)} °C`);
      s += `<text class="g-txt" x="${xc}" y="${bas + 18}" text-anchor="middle">${c.nom.at(0)}</text><text class="g-txt" x="${xc}" y="${bas + 33}" text-anchor="middle">${c.nom.at(1)}</text>`;
    });
    let grille = '';
    for (let v = 0; v <= 80; v += 20) grille += `<line class="g-grille" x1="${g}" x2="${d}" y1="${Y(v)}" y2="${Y(v)}"/><text class="g-txt" x="${g - 8}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`;
    el('g-temp').innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Température du lenticulaire selon le cas de calcul, pour les solutions A et B">
      <text class="g-titre" x="${g - 40}" y="24">Températures calculées : 40 à 52 °C, pour une limite de service de 70 °C</text>
      <text class="g-txt" x="${g - 40}" y="52">Température du lenticulaire, en °C</text>
      <rect x="${d - 330}" y="42" width="12" height="12" rx="2" fill="${C.a}"/><text class="g-txt" x="${d - 312}" y="52">A, sandwich étanche</text>
      <rect x="${d - 160}" y="42" width="12" height="12" rx="2" fill="${C.b}"/><text class="g-txt" x="${d - 142}" y="52">B, lames ventilées</text>
      ${grille}
      ${s}
      <line class="g-axe" x1="${g}" x2="${d}" y1="${bas}" y2="${bas}"/>
      <line class="g-repere" x1="${g}" x2="${d}" y1="${Y(70)}" y2="${Y(70)}"/>
      <text class="g-val" x="${g + 6}" y="${Y(70) - 6}">Limite de service du PMMA extrudé : 70 °C</text>
    </svg>`;
    el('g-temp').querySelectorAll('.barre').forEach(b => {
      const [t, v] = b.dataset.info.split('|');
      const voir = evt => montrerBulle(`<b>${t}</b><br>${v}`, evt);
      b.addEventListener('pointermove', voir); b.addEventListener('pointerdown', voir); b.addEventListener('pointerleave', cacherBulle);
    });
  }

  /* ---------- Lignes : seuil de rosée ---------- */
  function grapheRosee() {
    const series = [
      { nom: 'Nuit à 15 °C', coul: C.encre, pts: [[0, 76], [0.5, 80], [1, 84], [2, 88], [3, 90], [4, 92], [6, 94]] },
      { nom: 'Nuit à 5 °C', coul: C.gris, pts: [[0, 69], [0.5, 75], [1, 79], [2, 84], [3, 87], [4, 89], [6, 92]] }
    ];
    const W = 760, H = 380, g = 92, d = 620, haut = 80, bas = 320;
    const X = v => g + v / 6 * (d - g), Y = h => bas - (h - 60) / 40 * (bas - haut);
    const chemin = s => 'M' + s.pts.map(p => `${X(p.at(0))} ${Y(p.at(1))}`).join('L');
    let grille = '';
    for (let v = 60; v <= 100; v += 10) grille += `<line class="g-grille" x1="${g - 36}" x2="${d}" y1="${Y(v)}" y2="${Y(v)}"/><text class="g-txt" x="${g - 44}" y="${Y(v) + 4}" text-anchor="end">${v} %</text>`;
    const s15 = series.at(0), s5 = series.at(1);
    const points = series.map(s => s.pts.map(p => `<circle class="pt" data-info="${s.nom}, vent de ${String(p.at(0)).replace('.', ',')} m/s|Rosée au-dessus de ${p.at(1)} % d’humidité" cx="${X(p.at(0))}" cy="${Y(p.at(1))}" r="4.5" fill="${s.coul}" stroke="#F8FAFA" stroke-width="2"/>`).join('')).join('');
    el('g-rosee').innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Humidité relative à partir de laquelle la rosée se dépose sur le verre, selon le vent">
      <text class="g-titre" x="16" y="24">Seuil de rosée calculé : 76 % d’humidité sans vent, 92 % à 4 m/s</text>
      <text class="g-txt" x="16" y="52">Humidité relative seuil, par nuit claire</text>
      ${grille}
      <path d="${chemin(s15)}L${X(6)} ${Y(100)}L${X(0)} ${Y(100)}Z" fill="${C.a}" fill-opacity="0.1"/>
      <text class="g-val" x="${X(0) + 18}" y="${Y(96)}">Rosée sur le verre</text>
      <text class="g-txt" x="${X(4.3)}" y="${Y(72)}">Verre sec</text>
      <path d="${chemin(s5)}" fill="none" stroke="${s5.coul}" stroke-width="2" stroke-linejoin="round"/>
      <path d="${chemin(s15)}" fill="none" stroke="${s15.coul}" stroke-width="2" stroke-linejoin="round"/>
      ${points}
      <text class="g-val" x="${X(6) + 12}" y="${Y(94) - 1}">${s15.nom}</text>
      <text class="g-txt" x="${X(6) + 12}" y="${Y(92) + 13}">${s5.nom}</text>
      <text class="g-val" x="${X(0) - 10}" y="${Y(76) + 4}" text-anchor="end">76 %</text>
      <text class="g-val" x="${X(4)}" y="${Y(92) - 12}" text-anchor="middle">92 %</text>
      <line class="g-axe" x1="${g - 36}" x2="${d}" y1="${bas}" y2="${bas}"/>
      ${s15.pts.map(p => `<text class="g-txt" x="${X(p.at(0))}" y="${bas + 18}" text-anchor="middle">${String(p.at(0)).replace('.', ',')}</text>`).join('')}
      <text class="g-txt" x="${d}" y="${bas + 40}" text-anchor="end">Vent au niveau du panneau, en m/s</text>
    </svg>`;
    el('g-rosee').querySelectorAll('.pt').forEach(c => {
      const [t, v] = c.dataset.info.split('|');
      const voir = evt => montrerBulle(`<b>${t}</b><br>${v}`, evt);
      c.addEventListener('pointermove', voir); c.addEventListener('pointerdown', voir); c.addEventListener('pointerleave', cacherBulle);
    });
  }

  /* ---------- Sommaire : section en cours ---------- */
  function suivreSommaire() {
    const liens = new Map([...document.querySelectorAll('.sommaire a')].map(a => [a.getAttribute('href').slice(1), a]));
    const obs = new IntersectionObserver(entrees => {
      entrees.forEach(e => {
        if (!e.isIntersecting) return;
        liens.forEach(a => a.removeAttribute('aria-current'));
        const a = liens.get(e.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    document.querySelectorAll('.note > section').forEach(s => obs.observe(s));
  }

  function demarrer() {
    dessinerBoussole();
    majBoussole();
    el('heure').addEventListener('input', majBoussole);
    document.querySelectorAll('input[name="vent"]').forEach(i => i.addEventListener('change', majBoussole));
    grapheJour(); grapheTemp(); grapheRosee();
    suivreSommaire();
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, { delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }], throwOnError: false });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
