import { MemeTemplate } from './types';

// Let's design beautiful, humorous, and high-fidelity SVG graphics for iconic templates.
// This preserves the full context of the meme and is 100% CORS-safe during Canvas rendering.

const drakeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <!-- Grid -->
  <line x1="250" y1="0" x2="250" y2="500" stroke="#111827" stroke-width="4" />
  <line x1="0" y1="250" x2="500" y2="250" stroke="#111827" stroke-width="4" />
  
  <!-- Panel 1: Disapproval/Reject (Top Left) -->
  <rect x="0" y="0" width="250" height="250" fill="#f97316" />
  <!-- Reject Graphic Face -->
  <g transform="translate(125, 125)">
    <!-- Hand pushing away -->
    <path d="M-60,40 Q-80,10 -50,-10 Q-30,-25 -10,-10" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
    <circle cx="0" cy="0" r="45" fill="#fef08a" stroke="#111827" stroke-width="6" />
    <!-- Disgusted face -->
    <path d="M-15,-10 L-5,-10 L-10,-5" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M5,-10 L15,-10 L10,-5" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M-15,15 Q0,0 15,15" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round" />
    <!-- Hand block -->
    <path d="M-40,25 L-80,5 Q-90,20 -70,35 Z" fill="#fef08a" stroke="#111827" stroke-width="4" />
  </g>
  <text x="25" y="225" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#000" opacity="0.3">REJECTS</text>

  <!-- Panel 2: Blank for top caption (Top Right) -->
  <rect x="250" y="0" width="250" height="250" fill="#ffffff" />
  <circle cx="375" cy="125" r="30" fill="#f3f4f6" />
  <text x="375" y="130" font-family="'Inter', sans-serif" font-weight="bold" font-size="20" fill="#9ca3af" text-anchor="middle">TOP TEXT</text>

  <!-- Panel 3: Approval/Accept (Bottom Left) -->
  <rect x="0" y="250" width="250" height="250" fill="#eab308" />
  <!-- Accept Graphic Face -->
  <g transform="translate(125, 375)">
    <circle cx="0" cy="0" r="45" fill="#fef08a" stroke="#111827" stroke-width="6" />
    <!-- Smiling pleased face -->
    <circle cx="-15" cy="-10" r="5" fill="#111827" />
    <circle cx="15" cy="-10" r="5" fill="#111827" />
    <path d="M-20,10 Q0,25 20,10" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round" />
    <!-- Finger pointing in approval -->
    <path d="M15,30 L45,20 L55,35 L20,45 Z" fill="#fef08a" stroke="#111827" stroke-width="4" />
  </g>
  <text x="25" y="475" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#000" opacity="0.3">APPROVES</text>

  <!-- Panel 4: Blank for bottom caption (Bottom Right) -->
  <rect x="250" y="250" width="250" height="250" fill="#f9fafb" />
  <circle cx="375" cy="375" r="30" fill="#e5e7eb" />
  <text x="375" y="380" font-family="'Inter', sans-serif" font-weight="bold" font-size="20" fill="#9ca3af" text-anchor="middle">BOTTOM TEXT</text>
</svg>
`;

const distractedBoyfriendSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="500" height="350">
  <!-- Sky background -->
  <rect width="500" height="350" fill="#cbd5e1" />
  <!-- Sidewalk -->
  <path d="M0,280 L500,240 L500,350 L0,350 Z" fill="#94a3b8" />
  <line x1="0" y1="280" x2="500" y2="240" stroke="#64748b" stroke-width="4" />

  <!-- Person 1: Jealous Girlfriend (Left, Pink color theme) -->
  <g transform="translate(100, 200)">
    <!-- Body -->
    <path d="M-20,90 C-20,40 -10,30 0,30 C10,30 20,40 20,90" fill="#ec4899" stroke="#1e293b" stroke-width="4" />
    <!-- Head -->
    <circle cx="0" cy="10" r="22" fill="#fed7aa" stroke="#1e293b" stroke-width="4" />
    <!-- Mad Eyes -->
    <path d="M-12,-2 L-4,2" stroke="#1e293b" stroke-width="3" stroke-linecap="round" />
    <path d="M12,-2 L4,2" stroke="#1e293b" stroke-width="3" stroke-linecap="round" />
    <circle cx="-6" cy="6" r="3" fill="#1e293b" />
    <circle cx="6" cy="6" r="3" fill="#1e293b" />
    <!-- Angry Mouth -->
    <path d="M-10,18 Q0,10 10,18" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round" />
    <!-- Danger steam / anger marks -->
    <path d="M-25,-10 L-15,-20" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
    <path d="M25,-10 L15,-20" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
    
    <!-- Label Placeholder -->
    <rect x="-40" y="45" width="80" height="25" rx="5" fill="#fdf2f8" stroke="#ec4899" stroke-width="2" />
    <text x="0" y="62" font-family="sans-serif" font-size="11" font-weight="bold" fill="#be185d" text-anchor="middle">Jealous GF</text>
  </g>

  <!-- Person 2: Boyfriend (Center, Blue color theme looking back) -->
  <g transform="translate(240, 180)">
    <!-- Body -->
    <path d="M-25,110 C-25,50 -10,40 0,40 C10,40 25,50 25,110" fill="#3b82f6" stroke="#1e293b" stroke-width="4" />
    <!-- Head turned back (looking left-ish towards the other girl on the right) -->
    <circle cx="0" cy="15" r="24" fill="#fed7aa" stroke="#1e293b" stroke-width="4" />
    <!-- Eye glancing right -->
    <ellipse cx="6" cy="10" rx="4" ry="6" fill="#ffffff" stroke="#1e293b" stroke-width="1" />
    <circle cx="8" cy="10" r="2" fill="#1e293b" />
    <ellipse cx="-12" cy="10" rx="4" ry="6" fill="#ffffff" stroke="#1e293b" stroke-width="1" />
    <circle cx="-10" cy="10" r="2" fill="#1e293b" />
    <!-- Smile of awe -->
    <path d="M-4,24 Q2,28 8,22" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round" />
    <!-- Left Hand held by girlfriend -->
    <path d="M-20,80 Q-60,75 -100,10" fill="none" stroke="#1e293b" stroke-width="3" />
    
    <!-- Label Placeholder -->
    <rect x="-35" y="55" width="70" height="25" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
    <text x="0" y="72" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8" text-anchor="middle">Boyfriend</text>
  </g>

  <!-- Person 3: The New Girl walking by (Right, Green/Red theme) -->
  <g transform="translate(390, 190)">
    <!-- Red overlay walking hair -->
    <path d="M22,10 Q40,30 30,70" fill="none" stroke="#1e293b" stroke-width="3" />
    <!-- Body -->
    <path d="M-15,100 C-15,40 -5,35 10,35 C25,35 30,45 25,100" fill="#10b981" stroke="#1e293b" stroke-width="4" />
    <!-- Head -->
    <circle cx="5" cy="10" r="22" fill="#fecdd3" stroke="#1e293b" stroke-width="4" />
    <!-- Casual eyes -->
    <circle cx="-2" cy="6" r="3" fill="#1e293b" />
    <circle cx="10" cy="6" r="3" fill="#1e293b" />
    <path d="M0,16 Q4,20 8,16" fill="none" stroke="#1e293b" stroke-width="3" />
    
    <!-- Label Placeholder -->
    <rect x="-30" y="50" width="75" height="25" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="2" />
    <text x="7" y="67" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">New Girl</text>
  </g>
</svg>
`;

const twoButtonsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="500" height="350">
  <rect width="500" height="350" fill="#1e293b" />
  
  <!-- Metallic console panel -->
  <path d="M30,50 L470,50 L420,300 L80,300 Z" fill="#475569" stroke="#94a3b8" stroke-width="8" />

  <!-- Button A (Left) -->
  <g transform="translate(160, 160)">
    <ellipse cx="0" cy="20" rx="55" ry="25" fill="#991b1b" stroke="#000" stroke-width="4" />
    <ellipse cx="0" cy="12" rx="50" ry="22" fill="#ef4444" stroke="#ff8787" stroke-width="2" />
    <text x="0" y="-18" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">OPTION A</text>
  </g>

  <!-- Button B (Right) -->
  <g transform="translate(340, 160)">
    <ellipse cx="0" cy="20" rx="55" ry="25" fill="#991b1b" stroke="#000" stroke-width="4" />
    <ellipse cx="0" cy="12" rx="50" ry="22" fill="#ef4444" stroke="#ff8787" stroke-width="2" />
    <text x="0" y="-18" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">OPTION B</text>
  </g>
  
  <!-- Distressed Sweating Person's Hand -->
  <g transform="translate(250, 270)">
    <path d="M-80,80 Q0,-50 80,80" fill="#334155" stroke="#475569" stroke-width="4" />
    <!-- Finger pointing, sweating drops -->
    <path d="M-10,-5 L-5,-25 Q0,-35 10,-25 L10,-5 Z" fill="#fed7aa" stroke="#000" stroke-width="3" />
    <path d="M-25,10 Q0,-5 25,10" fill="#fed7aa" stroke="#000" stroke-width="3" />
    <!-- Water sweat drops -->
    <path d="M-60,-120 Q-60,-100 -50,-100 Q-40,-100 -40,-120 Z" fill="#38bdf8" />
    <path d="M80,-80 Q80,-60 90,-60 Q100,-60 100,-80 Z" fill="#38bdf8" />
  </g>
  
  <text x="250" y="35" font-family="sans-serif" font-weight="900" font-size="18" fill="#f8fafc" text-anchor="middle">THE TOUGHEST CHOICE</text>
</svg>
`;

const womanYellingCatSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" width="500" height="250">
  <!-- Split boundary -->
  <line x1="250" y1="0" x2="250" y2="250" stroke="#0f172a" stroke-width="6" />

  <!-- Panel 1: Angry Screaming Woman (Left) -->
  <rect x="0" y="0" width="250" height="250" fill="#fee2e2" />
  <g transform="translate(90, 130)">
    <!-- Crying/screaming woman face -->
    <circle cx="0" cy="-10" r="45" fill="#fca5a5" stroke="#dc2626" stroke-width="5" />
    <!-- Tears -->
    <path d="M-20,-5 C-25,15 -18,20 -15,10" fill="#38bdf8" />
    <path d="M20,-5 C25,15 18,20 15,10" fill="#38bdf8" />
    <!-- Angered eyes -->
    <path d="M-25,-15 L-5,-8" stroke="#7f1d1d" stroke-width="4" stroke-linecap="round" />
    <path d="M25,-15 L5,-8" stroke="#7f1d1d" stroke-width="4" stroke-linecap="round" />
    <!-- Screaming open mouth -->
    <ellipse cx="0" cy="18" rx="20" ry="12" fill="#7f1d1d" stroke="#dc2626" stroke-width="2" />
    <!-- Supportive friend arm behind her -->
    <path d="M-60,30 Q-40,-40 20,-30" fill="none" stroke="#f472b6" stroke-width="12" stroke-linecap="round" />
  </g>
  <!-- Pointing finger -->
  <g transform="translate(190, 160)">
    <path d="M-40,10 L10,-10 L15,10 Z" fill="#fca5a5" stroke="#dc2626" stroke-width="4" />
    <line x1="10" y1="-10" x2="35" y2="-20" stroke="#dc2626" stroke-width="5" stroke-linecap="round" />
  </g>
  <text x="20" y="30" font-family="sans-serif" font-weight="bold" font-size="12" fill="#991b1b">YELLING LADY</text>

  <!-- Panel 2: Confused Salad Cat (Right) -->
  <rect x="250" y="0" width="250" height="250" fill="#f0fdf4" />
  <!-- Dining table background -->
  <path d="M250,180 L500,180 L500,250 L250,250 Z" fill="#bbf7d0" />
  <!-- Salad Bowl -->
  <ellipse cx="375" cy="190" rx="45" ry="15" fill="#e2e8f0" stroke="#64748b" stroke-width="3" />
  <path d="M350,185 Q375,170 400,185 Z" fill="#22c55e" /> <!-- Lettuce -->
  
  <g transform="translate(375, 110)">
    <!-- Cat Ears -->
    <polygon points="-30,-20 -20,-50 -5,-35" fill="#ffffff" stroke="#475569" stroke-width="4" />
    <polygon points="30,-20 20,-50 5,-35" fill="#ffffff" stroke="#475569" stroke-width="4" />
    <!-- Cat Face -->
    <circle cx="0" cy="0" r="35" fill="#f8fafc" stroke="#475569" stroke-width="5" />
    <!-- Confused slanted eyes -->
    <path d="M-18,-8 Q-12,-4 -6,-8" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round" />
    <path d="M18,-8 Q12,-4 6,-8" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round" />
    <!-- Pink nose & whiskers -->
    <polygon points="-4,2 4,2 0,6" fill="#f43f5e" />
    <line x1="-15" y1="6" x2="-35" y2="2" stroke="#475569" stroke-width="2" />
    <line x1="-15" y1="12" x2="-35" y2="15" stroke="#475569" stroke-width="2" />
    <line x1="15" y1="6" x2="35" y2="2" stroke="#475569" stroke-width="2" />
    <line x1="15" y1="12" x2="35" y2="15" stroke="#475569" stroke-width="2" />
    <!-- Confused flat mouth -->
    <path d="M-5,14 Q0,10 5,14" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round" />
  </g>
  <text x="270" y="30" font-family="sans-serif" font-weight="bold" font-size="12" fill="#166534">SMUG CONFUSED CAT</text>
</svg>
`;

const brainExpansionSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <line x1="0" y1="250" x2="500" y2="250" stroke="#000000" stroke-width="4" />
  <line x1="250" y1="0" x2="250" y2="500" stroke="#000000" stroke-width="4" />

  <!-- Quadrant 1: Tiny Brain (Top Left) -->
  <rect x="0" y="0" width="250" height="250" fill="#0f172a" />
  <g transform="translate(125, 110)">
    <circle cx="0" cy="0" r="45" fill="#1e293b" />
    <!-- Tiny simplistic brain shapes -->
    <path d="M-20,-10 Q-30,-25 0,-25 Q30,-25 20,-10 Q30,10 10,25 Q0,15 -10,25 Q-30,10 -20,-10 Z" fill="#fda4af" stroke="#f43f5e" stroke-width="3" />
    <text x="0" y="80" fill="#f8fafc" font-family="sans-serif" font-size="12" text-anchor="middle">Normal Brain</text>
  </g>

  <!-- Quadrant 2: Glowing Brain (Top Right) -->
  <rect x="250" y="0" width="250" height="250" fill="#0f172a" />
  <g transform="translate(375, 110)">
    <!-- Glow effect -->
    <circle cx="0" cy="0" r="60" fill="#e0f2fe" opacity="0.15" />
    <path d="M-20,-10 Q-30,-25 0,-25 Q30,-25 20,-10 Q30,10 10,25 Q0,15 -10,25 Q-30,10 -20,-10 Z" fill="#fda4af" stroke="#38bdf8" stroke-width="4" />
    <!-- Glow lines -->
    <line x1="-40" y1="-40" x2="-25" y2="-25" stroke="#38bdf8" stroke-width="3" />
    <line x1="40" y1="-40" x2="25" y2="-25" stroke="#38bdf8" stroke-width="3" />
    <line x1="0" y1="-50" x2="0" y2="-35" stroke="#38bdf8" stroke-width="3" />
    <text x="0" y="80" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Enlightened Brain</text>
  </g>

  <!-- Quadrant 3: Cosmic Brain Expansion (Bottom Left) -->
  <rect x="0" y="250" width="250" height="250" fill="#090d16" />
  <g transform="translate(125, 360)">
    <!-- Cosmic Rays -->
    <circle cx="0" cy="0" r="75" fill="#fae8ff" opacity="0.2" />
    <circle cx="0" cy="0" r="50" fill="#d946ef" opacity="0.4" />
    <path d="M-20,-10 Q-30,-25 0,-25 Q30,-25 20,-10 Q30,10 10,25 Q0,15 -10,25 Q-30,10 -20,-10 Z" fill="#fae8ff" stroke="#a21caf" stroke-width="4" />
    <!-- Expanding energy vectors -->
    <path d="M-50,0 L-70,-10 M50,0 L70,10 M0,-40 L0,-65" stroke="#d946ef" stroke-width="4" stroke-linecap="round" />
    <text x="0" y="80" fill="#e9d5ff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Cosmic Brain</text>
  </g>

  <!-- Quadrant 4: Multiverse God Mode (Bottom Right) -->
  <rect x="250" y="250" width="250" height="250" fill="#030712" />
  <g transform="translate(375, 360)">
    <!-- Hypernova explosion shapes -->
    <polygon points="0,-80 20,-20 80,0 20,20 0,80 -20,20 -80,0 -20,-20" fill="#eff6ff" opacity="0.4" />
    <circle cx="0" cy="0" r="40" fill="#facc15" />
    <path d="M-15,-5 Q-20,-15 0,-15 Q20,-15 15,-5 Q20,5 5,15 Q0,10 -5,15 Q-20,5 -15,-5 Z" fill="#ffffff" stroke="#eab308" stroke-width="4" />
    <circle cx="0" cy="0" r="80" fill="none" stroke="#22d3ee" stroke-width="2" stroke-dasharray="5,5" />
    <text x="0" y="80" fill="#facc15" font-family="sans-serif" font-size="12" font-weight="extrabold" text-anchor="middle">MULTIVERSE GOD</text>
  </g>
</svg>
`;

const thisIsFineSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="500" height="350">
  <!-- Room backdrop -->
  <rect width="500" height="350" fill="#78350f" />
  
  <!-- Fire Background flames -->
  <path d="M0,350 L20,250 Q40,200 60,250 L80,350 L100,220 Q130,180 160,240 L180,350 L220,190 Q250,150 280,220 L310,350 L350,210 Q380,170 410,240 L440,350 L470,250 Q490,210 500,270 L500,350 Z" fill="#f97316" stroke="#ef4444" stroke-width="4" />
  <path d="M10,350 L30,280 Q50,240 70,280 L90,350 L120,260 Q140,210 170,280 L190,350 L230,240 Q260,200 290,260 L320,350 L360,250 L400,280 L430,350 Z" fill="#fbbf24" opacity="0.8" />

  <!-- Table & Coffee Mug -->
  <rect x="50" y="270" width="120" height="80" fill="#d97706" stroke="#451a03" stroke-width="4" />
  <rect x="80" y="240" width="35" height="30" rx="3" fill="#cbd5e1" stroke="#475569" stroke-width="3" />
  <path d="M115,247 Q125,247 125,255 Q125,263 115,263" fill="none" stroke="#475569" stroke-width="3" />

  <!-- The "Fine" Dog in Hat sitting calmly -->
  <g transform="translate(300, 220)">
    <!-- Dog Body -->
    <path d="M-30,100 Q-30,40 0,40 Q30,40 30,100" fill="#eab308" stroke="#451a03" stroke-width="4" />
    
    <!-- Dog Head -->
    <circle cx="0" cy="15" r="32" fill="#facc15" stroke="#451a03" stroke-width="4" />
    <!-- Dog Floppy Ears -->
    <path d="M-28,5 Q-40,25 -25,35 Z" fill="#ca8a04" stroke="#451a03" stroke-width="3" />
    <path d="M28,5 Q40,25 25,35 Z" fill="#ca8a04" stroke="#451a03" stroke-width="3" />

    <!-- Calm Derp Eyes -->
    <circle cx="-10" cy="10" r="7" fill="#ffffff" stroke="#451a03" stroke-width="2" />
    <circle cx="-8" cy="10" r="3" fill="#000000" />
    <circle cx="10" cy="10" r="7" fill="#ffffff" stroke="#451a03" stroke-width="2" />
    <circle cx="12" cy="10" r="3" fill="#000000" />
    
    <!-- Nose snout -->
    <ellipse cx="0" cy="22" rx="8" ry="5" fill="#451a03" />
    <!-- Smiling mouth -->
    <path d="M-8,24 Q0,32 8,24" fill="none" stroke="#451a03" stroke-width="3" stroke-linecap="round" />

    <!-- Cute bowler hat -->
    <path d="M-25,-12 L25,-12 L22,-35 L-22,-35 Z" fill="#475569" stroke="#1e293b" stroke-width="3" />
    <ellipse cx="0" cy="-12" rx="35" ry="5" fill="#1e293b" />
  </g>

  <!-- Speech bubble "This is fine." -->
  <g transform="translate(190, 80)">
    <rect x="-90" y="-30" width="135" height="50" rx="15" fill="#ffffff" stroke="#000000" stroke-width="4" />
    <polygon points="10,20 25,35 25,20" fill="#ffffff" stroke="#000000" stroke-width="4" />
    <!-- cover line connection -->
    <polygon points="8,18 27,18 20,22" fill="#ffffff" />
    <text x="-22" y="3" font-family="'Courier New', monospace" font-weight="bold" font-size="14" fill="#000000">This is fine.</text>
  </g>
</svg>
`;

// Simple conversion helper to convert Raw SVG elements to Base64 data URLs
function svgToUri(svgString: string): string {
  const cleaned = svgString.trim();
  const encoded = encodeURIComponent(cleaned)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;utf8,${encoded}`;
}

export const TRENDING_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Approves / Rejects',
    description: 'A classic comparison style template. The top half shows panel reactions rejecting or disapproving something, while the bottom panel embraces or approves something.',
    imageUrl: svgToUri(drakeSvg),
    defaultTop: 'WRITING 100 LINES OF CUSTOM CSS',
    defaultBottom: 'USING 4 TAILWIND UTILITY CLASSES'
  },
  {
    id: 'distracted_boyfriend',
    name: 'Distracted Boyfriend',
    description: 'The iconic distracted boyfriend meme featuring a jealous girlfriend on the left, the distracted boyfriend in the center, and a beautiful passing girl on the right.',
    imageUrl: svgToUri(distractedBoyfriendSvg),
    defaultTop: 'NEW FANCY JAVASCRIPT FRAMEWORK',
    defaultBottom: 'MY FULLY FUNCTIONAL JQUERY SCRIPT WORKING FINE'
  },
  {
    id: 'two_buttons',
    name: 'Two Buttons Dilemma',
    description: 'A sweating character faces a grueling emotional crisis choosing between two highly conflictive choices represented by two shiny red buttons.',
    imageUrl: svgToUri(twoButtonsSvg),
    defaultTop: 'FIX BUG IN PRODUCTION WITHOUT TESTING',
    defaultBottom: 'GO TO SLEEP AND PRETEND EVERYTHING IS OK'
  },
  {
    id: 'woman_yelling_cat',
    name: 'Woman Yelling at Smug Cat',
    description: 'An angry, crying red-faced lady yells and points an accusatory finger on the left side, whilst a confused white cat sits smugly behind its vegetable plate on the right.',
    imageUrl: svgToUri(womanYellingCatSvg),
    defaultTop: 'YOU PROMISED REFACTORING WOULD TAKE TWO HOURS!',
    defaultBottom: 'npm install --force'
  },
  {
    id: 'brain_expansion',
    name: 'Brain Expansion Evolution',
    description: 'Four panels displaying a brain evolving and expanding from a tiny simple format to enlightened glowing rays, cosmic power, and ultimate multiverse deity level.',
    imageUrl: svgToUri(brainExpansionSvg),
    defaultTop: 'READING THE DOCUMENTATION | COPYING FROM STACKOVERFLOW | ASKING AI TO WRITE IT | LETTING CO-PILOT AUTODESTROY IT IN PROD',
    defaultBottom: ''
  },
  {
    id: 'this_is_fine',
    name: 'This Is Fine Dog',
    description: 'The classic cartoon meme of a dog wearing a bowler hat, sitting inside a flaming room drinking coffee while calmly asserting "This is fine."',
    imageUrl: svgToUri(thisIsFineSvg),
    defaultTop: 'THE SERVER HAS 20,000 ACTIVE UNHANDLED PROMISE REJECTIONS',
    defaultBottom: 'IT STILL RENDERS THE LANDING PAGE SUCCESSFULLY'
  }
];
