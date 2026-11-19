let THREE;
let OrbitControls;
let threeLoadPromise;

async function loadThree() {
  if (!threeLoadPromise) {
    threeLoadPromise = Promise.all([
      import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'),
      import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js')
    ]).then(([threeModule, controlsModule]) => {
      THREE = threeModule;
      OrbitControls = controlsModule.OrbitControls;
      return true;
    }).catch(error => {
      console.warn('The 3D library could not be loaded. The learning site will still work.', error);
      return false;
    });
  }
  return threeLoadPromise;
}

function show3DFallback(container) {
  container.innerHTML = '<div class="three-fallback"><span>✳</span><b>3D molecule view unavailable</b><small>Connect to the internet and reload to load the interactive molecule viewer. The polymer details are still available.</small></div>';
}

const polymers = {
  kevlar: {
    name: 'Kevlar', fullName: 'Aromatic polyamide (aramid)', formula: '[–CO–C₆H₄–CO–NH–C₆H₄–NH–]ₙ', short: 'High-strength aramid fibre', category: 'High-performance fibre', symbol: 'Ar', number: '01', color: '#f4ddd2', symbolColor: '#a75e4e',
    description: 'Kevlar is a high-performance aramid fibre. Its rigid, aromatic chains and strong intermolecular hydrogen bonding help it deliver exceptional strength for its weight.',
    properties: ['High strength-to-weight ratio', 'Good cut resistance', 'Low thermal conductivity'],
    uses: 'Protective clothing, helmets, reinforcement in composites, aerospace components and fibre-optic cable strength members.',
    fact: 'Kevlar’s strength comes partly from hydrogen bonds between neighbouring polymer chains and interactions between its aromatic rings.',
    model: 'kevlar'
  },
  pani: {
    name: 'Polyaniline', fullName: 'Polyaniline (PANI)', formula: '[–C₆H₄–NH–]ₙ (simplified)', short: 'A tuneable conducting polymer', category: 'Conducting polymer', symbol: 'PANI', number: '02', color: '#e5e2f5', symbolColor: '#7665a5',
    description: 'Polyaniline is a conducting polymer. Its electrical behaviour changes with its oxidation state and acid doping, so it can range from relatively insulating to highly conducting.',
    properties: ['Tuneable conductivity', 'Air stability', 'Colour changes with oxidation state'],
    uses: 'Research and selected applications in sensors, antistatic coatings, corrosion protection, printed circuit technologies and rechargeable battery electrodes.',
    fact: 'The colour of polyaniline can change as its oxidation state changes, which makes it interesting for sensing and electrochromic devices.',
    model: 'pani'
  },
  pla: {
    name: 'PLA', fullName: 'Polylactic acid / polylactide', formula: '[–O–CH(CH₃)–CO–]ₙ', short: 'A compostable-grade bioplastic', category: 'Biodegradable polyester', symbol: 'PLA', number: '03', color: '#e3edce', symbolColor: '#64894e',
    description: 'PLA is a thermoplastic polyester commonly made from lactic acid produced by fermenting renewable carbohydrates. Suitable grades can biodegrade under controlled industrial composting conditions.',
    properties: ['Can be transparent and glossy', 'Good stiffness', 'Industrially compostable in suitable conditions'],
    uses: 'Food packaging, disposable cups and trays, 3D-printing filament, agricultural films and selected biomedical products.',
    fact: 'PLA can be made from lactic acid obtained by fermenting plant-derived sugars, such as those from corn or sugarcane.',
    model: 'pla'
  },
  ptfe: {
    name: 'PTFE', fullName: 'Polytetrafluoroethylene', formula: '[–CF₂–CF₂–]ₙ', short: 'A low-friction, chemically resistant polymer', category: 'Fluoropolymer', symbol: 'PTFE', number: '04', color: '#dce9ed', symbolColor: '#527e8a',
    description: 'PTFE contains very strong carbon–fluorine bonds. Its chemical resistance, thermal stability and very low coefficient of friction make it useful in demanding applications.',
    properties: ['Very low coefficient of friction', 'Excellent chemical resistance', 'High thermal stability'],
    uses: 'Non-stick coatings, seals, gaskets, chemical-handling equipment, low-friction guides and electrical insulation.',
    fact: 'PTFE’s low-friction surface is why it is used in non-stick coatings and in parts that need to slide smoothly.',
    model: 'ptfe'
  },
  pet: {
    name: 'PET', fullName: 'Polyethylene terephthalate', formula: '[–O–CH₂–CH₂–O–CO–C₆H₄–CO–]ₙ', short: 'Clear, tough packaging polyester', category: 'Thermoplastic polyester', symbol: 'PET', number: '05', color: '#dcebe5', symbolColor: '#4e8772',
    description: 'PET is a strong, lightweight thermoplastic polyester with useful clarity and barrier properties. It is widely used in packaging and can be mechanically recycled where collection and processing systems exist.',
    properties: ['Lightweight and tough', 'Clear in many grades', 'Good gas and moisture barrier'],
    uses: 'Water and soft-drink bottles, food trays, packaging films and polyester textile fibres.',
    fact: 'The same polymer family used in many drink bottles can also be spun into polyester fibres for clothing and textiles.',
    model: 'pet'
  },
  pvc: {
    name: 'PVC', fullName: 'Polyvinyl chloride', formula: '[–CH₂–CHCl–]ₙ', short: 'A versatile construction polymer', category: 'Vinyl polymer', symbol: 'PVC', number: '06', color: '#f3e8c9', symbolColor: '#9b7a36',
    description: 'PVC is a versatile polymer that can be made rigid or flexible depending on its formulation and additives. It is valued for durability and electrical insulation.',
    properties: ['Durable', 'Good electrical insulation', 'Rigid or flexible formulations'],
    uses: 'Cable insulation, pipes, window profiles, flooring, rainwear and other flexible products.',
    fact: 'Rigid PVC is used in pipes, while plasticised PVC can be flexible enough for cable insulation and some rainwear.',
    model: 'pvc'
  },
  nylon: {
    name: 'Nylon 6,6', fullName: 'Polyamide 6,6', formula: '[–NH–(CH₂)₆–NH–CO–(CH₂)₄–CO–]ₙ', short: 'A tough, abrasion-resistant polyamide', category: 'Engineering thermoplastic', symbol: 'PA', number: '07', color: '#eee0d7', symbolColor: '#9d7058',
    description: 'Nylon 6,6 is an engineering polyamide with good strength, toughness and abrasion resistance. Its properties make it useful in both fibres and moulded components.',
    properties: ['Good tensile strength', 'Abrasion resistance', 'Toughness'],
    uses: 'Backpack fabric, clothing, ropes, toothbrush bristles, gears, cable ties and other durable components.',
    fact: 'Nylon is used both as a textile fibre and as a hard engineering plastic, depending on how it is processed.',
    model: 'nylon'
  },
  pe: {
    name: 'Polyethylene', fullName: 'Polyethylene (PE)', formula: '[–CH₂–CH₂–]ₙ', short: 'A lightweight everyday plastic', category: 'Commodity thermoplastic', symbol: 'PE', number: '08', color: '#e8e6d4', symbolColor: '#7d8355',
    description: 'Polyethylene is one of the most widely used plastics. Its properties vary by grade and density, but it is generally lightweight, chemically resistant and easy to process.',
    properties: ['Lightweight', 'Moisture resistant', 'Flexible or rigid by grade'],
    uses: 'Shopping bags, squeeze bottles, food containers, storage bins, film packaging and household goods.',
    fact: 'Polyethylene can be made in different densities: lower-density grades are often flexible, while higher-density grades are more rigid.',
    model: 'pe'
  }
};

const objects = [
  { polymer: 'pet', name: 'Water bottle', item: 'A common clear drink bottle', detail: 'PET is light and tough, making it useful for many beverage bottles.' },
  { polymer: 'ptfe', name: 'Non-stick pan', item: 'A coated cooking surface', detail: 'PTFE coatings help food release from the pan surface.' },
  { polymer: 'pla', name: 'Compostable cup', item: 'A cup made from a suitable PLA grade', detail: 'Some PLA products are designed for industrial composting systems.' },
  { polymer: 'kevlar', name: 'Protective helmet', item: 'A fibre-reinforced protective product', detail: 'Kevlar fibres can reinforce composites used in protective equipment.' },
  { polymer: 'pvc', name: 'Wire insulation', item: 'The outer insulating layer of a cable', detail: 'Flexible PVC is widely used to insulate electrical wires.' },
  { polymer: 'nylon', name: 'Backpack fabric', item: 'A durable synthetic textile', detail: 'Nylon fibres are valued for strength and abrasion resistance.' }
];

const facts = [
  ['A single polymer molecule can contain thousands of repeating units linked together, like a microscopic chain made from the same building block.', 'Polymer basics'],
  ['A polymer’s properties depend on more than its name: chain structure, molecular weight, additives and processing all matter.', 'Materials science'],
  ['PET can be used as both a packaging plastic and a polyester textile fibre.', 'PET in daily life'],
  ['PTFE has a very low coefficient of friction, helping surfaces slide with less resistance.', 'Friction science'],
  ['Some PLA products need the controlled heat, moisture and microbial activity of industrial composting facilities to break down effectively.', 'Composting facts'],
  ['Kevlar’s rigid aromatic structure and strong inter-chain interactions contribute to its high strength.', 'High-performance fibres'],
  ['Polyaniline’s conductivity can be changed by doping, which alters how electrical charge moves through the material.', 'Conducting polymers'],
  ['PVC can be rigid or flexible. The formulation and additives help determine how it behaves.', 'PVC in everyday life'],
  ['Nylon can be spun into fibres or moulded into hard parts such as gears and cable ties.', 'Nylon uses'],
  ['Polyethylene is used in everything from flexible films to rigid containers because different grades have different properties.', 'Polyethylene uses']
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let currentPolymer = 'ptfe';
let currentScene = null;
let modalScene = null;
let factIndex = 0;
let toastTimer;

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderPolymerCards(filter = '') {
  const grid = $('#polymerGrid');
  const query = filter.trim().toLowerCase();
  const list = Object.entries(polymers).filter(([, p]) => `${p.name} ${p.fullName} ${p.category} ${p.short}`.toLowerCase().includes(query));
  grid.innerHTML = list.map(([id, p]) => `
    <button class="polymer-card" data-polymer="${id}" aria-label="Explore ${p.name}">
      <span class="polymer-card-top"><span class="polymer-symbol" style="background:${p.color};color:${p.symbolColor}">${p.symbol}</span><span class="polymer-index">${p.number} / 08</span></span>
      <h3>${p.name}</h3><p>${p.short}</p>
      <span class="polymer-card-bottom"><span class="polymer-category">${p.category}</span><span class="polymer-open">↗</span></span>
    </button>`).join('');
  $('#emptySearch').hidden = list.length !== 0;
  $$('.polymer-card', grid).forEach(card => card.addEventListener('click', () => openPolymer(card.dataset.polymer)));
}

function updateFact() {
  let next = Math.floor(Math.random() * facts.length);
  if (facts.length > 1 && next === factIndex) next = (next + 1) % facts.length;
  factIndex = next;
  $('#factText').textContent = facts[next][0];
  $('#factSource').textContent = facts[next][1];
}

function populateModal(id) {
  const p = polymers[id];
  currentPolymer = id;
  $('#modalNumber').textContent = `FILE ${p.number} / 08`;
  $('#modalCategory').textContent = p.category.toUpperCase();
  $('#modalTitle').textContent = p.name;
  $('#modalFullname').textContent = p.fullName;
  $('#modalDescription').textContent = p.description;
  $('#modalUses').textContent = p.uses;
  $('#modalFormula').textContent = p.formula;
  $('#modalProperties').innerHTML = p.properties.map(x => `<span class="property-pill">${x}</span>`).join('');
}

function openPolymer(id) {
  if (!polymers[id]) return;
  populateModal(id);
  const modal = $('#polymerModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(async () => {
    if (modalScene) modalScene.dispose();
    modalScene = null;
    $('#zoomSlider').value = '10';
    if (await loadThree()) {
      modalScene = createMoleculeScene($('#modalCanvas'), id, { cameraZ: 10, autoRotate: true, background: 0xe8eee1 });
    } else {
      show3DFallback($('#modalCanvas'));
    }
  });
}

function closeModal() {
  const modal = $('#polymerModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (modalScene) { modalScene.dispose(); modalScene = null; }
}

function atomColor(element) {
  return ({ C: 0x46535b, H: 0xe8edf0, O: 0xef7869, N: 0x6587de, F: 0x60b9b1, Cl: 0x88a66b })[element] ?? 0x89969a;
}

function buildMolecule(type) {
  const atoms = [];
  const bonds = [];
  const add = (e, x, y, z = 0) => { const i = atoms.length; atoms.push({ e, x, y, z }); return i; };
  const bond = (a, b, order = 1) => bonds.push({ a, b, order });
  const connect = (a, b) => { if (a !== undefined && b !== undefined) bond(a, b); };
  const addRing = (cx, cy, cz = 0, radius = 0.76) => {
    const ids = [];
    for (let k = 0; k < 6; k++) { const a = Math.PI * 2 * k / 6; ids.push(add('C', cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, cz + (k % 2 ? .06 : -.06))); }
    for (let k = 0; k < 6; k++) bond(ids[k], ids[(k + 1) % 6], 1.5);
    return ids;
  };

  if (type === 'ptfe' || type === 'pe' || type === 'pvc') {
    let prev;
    for (let i = 0; i < 5; i++) {
      const x = i * 1.35;
      const c = add('C', x, (i % 2 ? .10 : -.10), 0); connect(prev, c); prev = c;
      if (type === 'ptfe') { const f1 = add('F', x, 1.0, .15); const f2 = add('F', x, -1.0, -.15); bond(c, f1); bond(c, f2); }
      if (type === 'pvc') { const h = add('H', x, .85, .12); const cl = add('Cl', x, -1.05, -.12); bond(c, h); bond(c, cl); }
      if (type === 'pe') { const h1 = add('H', x, .85, .16); const h2 = add('H', x, -.85, -.16); bond(c, h1); bond(c, h2); }
    }
  } else if (type === 'pla') {
    let prev;
    for (let i = 0; i < 4; i++) {
      const x = i * 2.45;
      const o1 = add('O', x, 0, 0); const ch = add('C', x + .78, 0, 0); const co = add('C', x + 1.58, 0, 0); const o2 = add('O', x + 2.25, 0, 0);
      connect(prev, o1); bond(o1, ch); bond(ch, co); bond(co, o2); prev = o2;
      const methyl = add('C', x + .75, 1.05, .1); bond(ch, methyl);
      const carbonyl = add('O', x + 1.58, -.95, .05); bond(co, carbonyl, 2);
      const h = add('H', x + .45, -.65, .3); bond(ch, h);
    }
  } else if (type === 'pet') {
    let prev;
    for (let i = 0; i < 3; i++) {
      const x = i * 5.7;
      const oA = add('O', x, 0, 0); const cA = add('C', x + .9, 0, 0); const cB = add('C', x + 1.8, 0, 0); const oB = add('O', x + 2.55, 0, 0); const co = add('C', x + 3.35, 0, 0);
      connect(prev, oA); bond(oA, cA); bond(cA, cB); bond(cB, oB); bond(oB, co);
      const oxy = add('O', x + 3.35, .9, .1); bond(co, oxy, 2);
      const ring = addRing(x + 4.4, 0, .05, .74); bond(co, ring[3]);
      const nextCo = add('C', x + 5.45, 0, 0); bond(ring[0], nextCo); const nextO = add('O', x + 6.05, .75, .05); bond(nextCo, nextO, 2);
      prev = add('O', x + 6.3, 0, 0); bond(nextCo, prev);
    }
  } else if (type === 'kevlar') {
    let prev;
    for (let i = 0; i < 3; i++) {
      const x = i * 5.2;
      const carbonyl = add('C', x, 0, 0); connect(prev, carbonyl);
      const oxy = add('O', x, .9, .05); bond(carbonyl, oxy, 2);
      const ring = addRing(x + 1.55, 0, 0, .78); bond(carbonyl, ring[3]);
      const amideC = add('C', x + 3.1, 0, 0); bond(ring[0], amideC);
      const n = add('N', x + 3.95, 0, 0); bond(amideC, n);
      const h = add('H', x + 3.95, .85, 0); bond(n, h);
      const ring2 = addRing(x + 5.1, 0, .03, .78); bond(n, ring2[3]);
      prev = add('C', x + 6.65, 0, 0); bond(ring2[0], prev);
    }
  } else if (type === 'pani') {
    let prevN;
    for (let i = 0; i < 4; i++) {
      const x = i * 2.3;
      const ring = addRing(x, 0, 0, .78);
      const n = add('N', x + 1.15, 0, .08);
      bond(ring[0], n); bond(ring[3], n);
      if (prevN !== undefined) bond(prevN, ring[3]);
      prevN = n;
      const h = add('H', x + 1.18, .9, .1); bond(n, h);
    }
  } else if (type === 'nylon') {
    let prev;
    for (let i = 0; i < 4; i++) {
      const x = i * 2.15;
      const n = add('N', x, 0, 0); connect(prev, n);
      const c1 = add('C', x + .8, 0, 0); bond(n, c1);
      const c2 = add('C', x + 1.6, 0, 0); bond(c1, c2);
      const o = add('O', x + 1.6, .9, .05); bond(c2, o, 2);
      const chainC = add('C', x + 2.35, 0, 0); bond(c2, chainC); prev = chainC;
      const h = add('H', x, -.85, .1); bond(n, h);
      const side = add('C', x + .8, -.85, .1); bond(c1, side);
    }
  }
  return { atoms, bonds };
}

function createMoleculeScene(container, polymerId, options = {}) {
  const { atoms, bonds } = buildMolecule(polymers[polymerId].model);
  const scene = new THREE.Scene();
  scene.background = options.background ? new THREE.Color(options.background) : null;
  const camera = new THREE.PerspectiveCamera(35, Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1), .1, 100);
  camera.position.set(0, 2.5, options.cameraZ ?? 10);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !options.background });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth || 400, container.clientHeight || 300);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute('aria-label', `Interactive 3D model of ${polymers[polymerId].name}`);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1.25));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2); keyLight.position.set(4, 7, 9); scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xb8d9c5, 1.1); fillLight.position.set(-7, -3, 2); scene.add(fillLight);

  const group = new THREE.Group();
  const atomGeometry = new THREE.SphereGeometry(.22, 22, 18);
  const atomMaterials = {};
  const atomMeshes = [];
  for (let i = 0; i < atoms.length; i++) {
    const a = atoms[i];
    if (!atomMaterials[a.e]) atomMaterials[a.e] = new THREE.MeshStandardMaterial({ color: atomColor(a.e), roughness: .34, metalness: .08 });
    const mesh = new THREE.Mesh(atomGeometry, atomMaterials[a.e]);
    mesh.position.set(a.x, a.y, a.z);
    mesh.scale.setScalar(a.e === 'H' ? .58 : a.e === 'Cl' ? 1.16 : a.e === 'F' ? .9 : 1);
    mesh.castShadow = true;
    group.add(mesh); atomMeshes.push(mesh);
  }
  const bondMaterial = new THREE.MeshStandardMaterial({ color: 0x87928d, roughness: .5, metalness: .12 });
  const bondGeometry = new THREE.CylinderGeometry(.065, .065, 1, 9);
  for (const b of bonds) {
    const start = new THREE.Vector3(atoms[b.a].x, atoms[b.a].y, atoms[b.a].z);
    const end = new THREE.Vector3(atoms[b.b].x, atoms[b.b].y, atoms[b.b].z);
    const diff = new THREE.Vector3().subVectors(end, start);
    const mesh = new THREE.Mesh(bondGeometry, bondMaterial);
    mesh.position.copy(start).add(end).multiplyScalar(.5);
    mesh.scale.set(1, diff.length(), 1);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), diff.normalize());
    group.add(mesh);
    if (b.order > 1) {
      const extra = mesh.clone();
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const offset = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 0, 1)).normalize().multiplyScalar(.11);
      extra.position.add(offset); extra.material = bondMaterial; group.add(extra);
    }
  }
  // Centre the molecule so that each polymer is easy to inspect.
  const bounds = new THREE.Box3().setFromObject(group);
  const center = bounds.getCenter(new THREE.Vector3());
  group.position.sub(center);
  scene.add(group);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = .06;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 23;
  controls.autoRotate = Boolean(options.autoRotate);
  controls.autoRotateSpeed = .65;
  controls.target.set(0, 0, 0);

  let frameId;
  let disposed = false;
  const resizeObserver = new ResizeObserver(() => {
    if (disposed) return;
    const w = Math.max(container.clientWidth, 1), h = Math.max(container.clientHeight, 1);
    camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
  });
  resizeObserver.observe(container);
  const animate = () => {
    if (disposed) return;
    frameId = requestAnimationFrame(animate);
    controls.update(); renderer.render(scene, camera);
  };
  animate();
  return {
    setZoom(distance) { camera.position.setLength(Math.max(4, Math.min(23, Number(distance)))); controls.update(); },
    reset() { camera.position.set(0, 2.5, options.cameraZ ?? 10); controls.target.set(0, 0, 0); controls.update(); },
    dispose() { disposed = true; cancelAnimationFrame(frameId); resizeObserver.disconnect(); controls.dispose(); renderer.dispose(); atomGeometry.dispose(); Object.values(atomMaterials).forEach(m => m.dispose()); bondGeometry.dispose(); bondMaterial.dispose(); container.innerHTML = ''; }
  };
}

function bindEvents() {
  $('#polymerSearch').addEventListener('input', e => renderPolymerCards(e.target.value));
  $('#randomFactButton').addEventListener('click', () => { updateFact(); document.querySelector('#factBand').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  $('#newFactButton').addEventListener('click', updateFact);
  $('#surpriseHero').addEventListener('click', () => {
    const ids = Object.keys(polymers); const id = ids[Math.floor(Math.random() * ids.length)];
    openPolymer(id);
    showToast(`Pico picked ${polymers[id].name} for you!`);
  });
  $$('.object-card').forEach(card => card.addEventListener('click', () => openPolymer(card.dataset.polymer)));
  $$('[data-scroll]').forEach(button => button.addEventListener('click', () => {
    const target = $(button.dataset.scroll); if (target) target.scrollIntoView({ behavior: 'smooth' });
    $('#mainNav').classList.remove('open'); $('#mobileMenuButton').setAttribute('aria-expanded', 'false');
  }));
  $$('.nav-link').forEach(link => link.addEventListener('click', () => {
    $$('.nav-link').forEach(x => x.classList.remove('active')); link.classList.add('active');
    $('#mainNav').classList.remove('open'); $('#mobileMenuButton').setAttribute('aria-expanded', 'false');
  }));
  $('#mobileMenuButton').addEventListener('click', () => {
    const nav = $('#mainNav'); nav.classList.toggle('open');
    $('#mobileMenuButton').setAttribute('aria-expanded', String(nav.classList.contains('open')));
  });
  $('#closeModal').addEventListener('click', closeModal);
  $('#polymerModal').addEventListener('click', e => { if (e.target === $('#polymerModal')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#polymerModal').classList.contains('open')) closeModal(); });
  $('#modalZoomButton').addEventListener('click', () => { $('#modalCanvas').scrollIntoView({ behavior: 'smooth', block: 'center' }); if (modalScene) modalScene.setZoom(6); $('#zoomSlider').value = '6'; });
  $('#zoomSlider').addEventListener('input', e => { if (modalScene) modalScene.setZoom(e.target.value); });
  $('#resetModelButton').addEventListener('click', () => { if (modalScene) modalScene.reset(); $('#zoomSlider').value = '10'; });
  $('#openLabButton').addEventListener('click', () => openPolymer('ptfe'));
}

async function bootScenes() {
  const loaded = await loadThree();
  let preview = null;
  if (loaded) {
    currentScene = createMoleculeScene($('#heroCanvas'), 'pet', { cameraZ: 9, autoRotate: true });
    // Render the dedicated molecule-lab preview using PTFE, matching its caption.
    preview = createMoleculeScene($('#labPreviewCanvas'), 'ptfe', { cameraZ: 8.7, autoRotate: true, background: 0x294940 });
  } else {
    show3DFallback($('#heroCanvas'));
    show3DFallback($('#labPreviewCanvas'));
  }
  window.addEventListener('pagehide', () => { if (currentScene) currentScene.dispose(); if (preview) preview.dispose(); if (modalScene) modalScene.dispose(); }, { once: true });
}

renderPolymerCards();
bindEvents();
updateFact();
bootScenes();
