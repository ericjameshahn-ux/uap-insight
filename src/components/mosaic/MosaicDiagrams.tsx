import React from 'react';

// Financial Services Mosaic Diagram - Shows how analysts assemble fragments
export const FinancialMosaicDiagram = () => (
  <svg viewBox="0 0 400 280" className="w-full max-w-md mx-auto">
    <rect width="400" height="280" className="fill-slate-900" rx="8" />
    
    {/* Information fragments */}
    <g className="animate-pulse">
      <rect x="30" y="25" width="40" height="22" className="fill-blue-500" rx="3" opacity="0.8" />
      <rect x="90" y="40" width="35" height="18" className="fill-blue-500" rx="3" opacity="0.6" />
      <rect x="150" y="22" width="45" height="20" className="fill-blue-500" rx="3" opacity="0.7" />
      <rect x="220" y="35" width="38" height="22" className="fill-amber-500" rx="3" opacity="0.7" />
      <rect x="280" y="45" width="42" height="18" className="fill-amber-500" rx="3" opacity="0.6" />
      <rect x="340" y="28" width="35" height="22" className="fill-amber-500" rx="3" opacity="0.8" />
      <rect x="50" y="70" width="30" height="16" className="fill-blue-500" rx="3" opacity="0.5" />
      <rect x="120" y="65" width="40" height="20" className="fill-amber-500" rx="3" opacity="0.6" />
      <rect x="200" y="72" width="35" height="18" className="fill-blue-500" rx="3" opacity="0.7" />
      <rect x="270" y="78" width="45" height="16" className="fill-amber-500" rx="3" opacity="0.5" />
    </g>
    
    {/* Analyst figure with magnifying glass */}
    <g transform="translate(165, 100)">
      <circle cx="20" cy="12" r="12" className="fill-slate-500" />
      <rect x="8" y="26" width="24" height="32" className="fill-slate-600" rx="4" />
      <circle cx="52" cy="18" r="10" fill="none" className="stroke-cyan-400" strokeWidth="2.5" />
      <line x1="59" y1="25" x2="68" y2="34" className="stroke-cyan-400" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    
    {/* Arrow down */}
    <path d="M200 165 L200 182 L188 182 L200 198 L212 182 L200 182" className="fill-cyan-400" />
    
    {/* Material Insight box */}
    <rect x="100" y="210" width="200" height="45" className="fill-slate-800" rx="5" stroke="currentColor" strokeWidth="2" />
    <text x="200" y="238" textAnchor="middle" className="fill-cyan-400 text-sm font-bold">
      MATERIAL INSIGHT
    </text>
    
    {/* Labels */}
    <text x="40" y="100" className="fill-blue-400 text-xs">Public</text>
    <text x="300" y="100" className="fill-amber-400 text-xs">Non-Public</text>
  </svg>
);

// Operation Fortitude Ground Truth Map
export const FortitudeGroundTruthMap = ({ isVisible = true }: { isVisible?: boolean }) => (
  <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
    <svg viewBox="0 0 500 320" className="w-full max-w-2xl mx-auto">
      <rect width="500" height="320" className="fill-slate-800" rx="8" />
      
      {/* English Channel */}
      <ellipse cx="250" cy="160" rx="180" ry="70" className="fill-slate-700" opacity="0.5" />
      <text x="250" y="165" textAnchor="middle" className="fill-slate-500 text-xs italic">English Channel</text>
      
      {/* England */}
      <path d="M50 90 Q150 70 250 80 Q350 70 450 90 L450 40 L50 40 Z" className="fill-slate-600" />
      <text x="250" y="60" textAnchor="middle" className="fill-slate-300 text-sm font-bold">ENGLAND</text>
      
      {/* France */}
      <path d="M50 235 Q150 225 250 230 Q350 225 450 235 L450 320 L50 320 Z" className="fill-slate-600" />
      <text x="250" y="290" textAnchor="middle" className="fill-slate-300 text-sm font-bold">FRANCE</text>
      
      {/* Calais (Decoy) */}
      <circle cx="350" cy="255" r="22" className="fill-red-500" opacity="0.3" />
      <circle cx="350" cy="255" r="22" fill="none" className="stroke-red-500" strokeWidth="2" strokeDasharray="5,3" />
      <text x="350" y="252" textAnchor="middle" className="fill-red-300 text-xs font-bold">PAS-DE-</text>
      <text x="350" y="263" textAnchor="middle" className="fill-red-300 text-xs font-bold">CALAIS</text>
      <text x="350" y="285" textAnchor="middle" className="fill-red-500 text-xs">(DECOY)</text>
      
      {/* FUSAG box */}
      <rect x="300" y="48" width="75" height="30" className="fill-red-500" opacity="0.2" rx="3" />
      <text x="337" y="67" textAnchor="middle" className="fill-red-300 text-xs">"FUSAG"</text>
      
      {/* Decoy arrow */}
      <path d="M337 82 Q342 160 350 230" fill="none" className="stroke-red-500" strokeWidth="2" strokeDasharray="8,4" />
      
      {/* Normandy (Real) */}
      <circle cx="150" cy="255" r="26" className="fill-green-500" opacity="0.3" />
      <circle cx="150" cy="255" r="26" fill="none" className="stroke-green-500" strokeWidth="3" />
      <text x="150" y="252" textAnchor="middle" className="fill-green-300 text-sm font-bold">NORMANDY</text>
      <text x="150" y="265" textAnchor="middle" className="fill-green-500 text-xs">(REAL TARGET)</text>
      
      {/* Real invasion arrows */}
      <path d="M120 85 Q125 160 142 225" fill="none" className="stroke-green-500" strokeWidth="3" />
      <path d="M158 85 Q156 160 153 225" fill="none" className="stroke-green-500" strokeWidth="3" />
      
      {/* Ghost Army box */}
      <g transform="translate(15, 110)">
        <rect width="115" height="85" className="fill-slate-900" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <text x="57" y="15" textAnchor="middle" className="fill-amber-500 text-xs font-bold">GHOST ARMY</text>
        
        {/* Tank icon */}
        <rect x="12" y="24" width="25" height="12" className="fill-slate-600" rx="2" />
        <circle cx="18" cy="40" r="4" className="fill-slate-700 stroke-slate-500" />
        <circle cx="32" cy="40" r="4" className="fill-slate-700 stroke-slate-500" />
        <text x="52" y="35" className="fill-slate-400 text-xs">Inflatable</text>
        <text x="52" y="44" className="fill-slate-400 text-xs">tanks</text>
        
        {/* Camp icon */}
        <line x1="12" y1="54" x2="48" y2="54" className="stroke-slate-500" strokeWidth="1" />
        <rect x="16" y="56" width="7" height="9" className="fill-slate-500" />
        <rect x="26" y="56" width="7" height="9" className="fill-slate-500" />
        <rect x="36" y="56" width="7" height="9" className="fill-slate-500" />
        <text x="62" y="64" className="fill-slate-400 text-xs">Fake camps</text>
        
        {/* Radio icon */}
        <rect x="12" y="70" width="12" height="10" className="fill-slate-600" rx="1" />
        <path d="M18 70 L18 67 L24 64" className="stroke-cyan-400" strokeWidth="1" fill="none" />
        <text x="35" y="78" className="fill-slate-400 text-xs">False radio</text>
      </g>
      
      {/* Stats */}
      <text x="485" y="25" textAnchor="end" className="fill-slate-500 text-xs">1,100 soldiers</text>
      <text x="485" y="36" textAnchor="end" className="fill-slate-500 text-xs">played 30,000</text>
    </svg>
    
    <p className="text-center text-muted-foreground mt-3 text-sm italic">
      The complete picture: Real invasion at Normandy, elaborate deception pointing to Calais
    </p>
  </div>
);

// German Reconnaissance View (The Filter)
export const FortitudeFilterView = ({ isVisible = true }: { isVisible?: boolean }) => (
  <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
    <svg viewBox="0 0 500 320" className="w-full max-w-2xl mx-auto">
      <defs>
        <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
          <line x1="0" y1="0" x2="4" y2="0" stroke="#000" strokeWidth="1" opacity="0.1" />
        </pattern>
      </defs>
      
      <rect width="500" height="320" fill="#1a1a1a" rx="8" />
      <rect x="15" y="15" width="470" height="250" fill="#2a2a2a" />
      <rect x="15" y="15" width="470" height="250" fill="url(#scanlines)" />
      
      {/* Tank formations */}
      <g transform="translate(140, 60)">
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`tank-${row}-${col}`}
              x={col * 38}
              y={row * 32}
              width="22"
              height="10"
              fill="#4a4a4a"
              rx="2"
            />
          ))
        )}
      </g>
      
      {/* Barracks */}
      <g transform="translate(40, 80)">
        <rect x="0" y="0" width="55" height="35" fill="#3a3a3a" rx="2" />
        <line x1="8" y1="10" x2="45" y2="10" stroke="#5a5a5a" strokeWidth="1" />
        <line x1="8" y1="18" x2="45" y2="18" stroke="#5a5a5a" strokeWidth="1" />
        <text x="27" y="48" textAnchor="middle" className="fill-slate-500 text-xs">Barracks</text>
      </g>
      
      {/* Intel circle */}
      <g>
        <circle cx="245" cy="135" r="55" fill="none" className="stroke-red-500" strokeWidth="2" />
        <text x="245" y="205" textAnchor="middle" className="fill-red-500 text-sm">ARMORED DIVISION</text>
        <text x="245" y="218" textAnchor="middle" className="fill-red-500 text-sm">~200 TANKS CONFIRMED</text>
      </g>
      
      {/* Radio intercept box */}
      <rect x="355" y="45" width="115" height="65" fill="#1e1e1e" rx="3" className="stroke-amber-500" strokeWidth="1" />
      <text x="412" y="62" textAnchor="middle" className="fill-amber-500 text-xs">RADIO INTERCEPT</text>
      <text x="412" y="76" textAnchor="middle" className="fill-slate-300 text-xs">Heavy traffic from</text>
      <text x="412" y="87" textAnchor="middle" className="fill-slate-300 text-xs">FUSAG HQ</text>
      <text x="412" y="98" textAnchor="middle" className="fill-slate-300 text-xs">Gen. Patton commanding</text>
      
      {/* GEHEIM stamp */}
      <g transform="translate(25, 220)">
        <rect width="85" height="22" fill="none" className="stroke-red-500" strokeWidth="2" />
        <text x="42" y="15" textAnchor="middle" className="fill-red-500 text-sm font-bold">GEHEIM</text>
      </g>
      
      <text x="400" y="255" className="fill-slate-500 text-xs">Luftwaffe Recon - May 1944</text>
      
      {/* What's missing box */}
      <rect x="15" y="275" width="470" height="28" className="fill-slate-900" rx="3" />
      <text x="250" y="293" textAnchor="middle" className="fill-slate-500 text-sm italic">
        ❌ No indication tanks are rubber  ❌ No context this is theater
      </text>
    </svg>
    
    <p className="text-center text-muted-foreground mt-3 text-sm italic">
      German aerial reconnaissance: Everything looks real. The filter worked perfectly.
    </p>
  </div>
);

// Manhattan Project Map
export const ManhattanProjectMap = ({ isVisible = true }: { isVisible?: boolean }) => (
  <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
    <svg viewBox="0 0 500 320" className="w-full max-w-2xl mx-auto">
      <rect width="500" height="320" className="fill-slate-800" rx="8" />
      
      {/* US map outline (simplified) */}
      <ellipse cx="250" cy="140" rx="170" ry="95" className="fill-slate-700" opacity="0.3" />
      
      {/* Sites */}
      <g>
        <circle cx="310" cy="150" r="18" className="fill-green-500" opacity="0.4" />
        <circle cx="310" cy="150" r="7" className="fill-green-500" />
        <text x="310" y="178" textAnchor="middle" className="fill-green-300 text-xs">Oak Ridge, TN</text>
        <text x="310" y="188" textAnchor="middle" className="fill-slate-500 text-xs">75,000 workers</text>
        
        <circle cx="145" cy="160" r="18" className="fill-green-500" opacity="0.4" />
        <circle cx="145" cy="160" r="7" className="fill-green-500" />
        <text x="145" y="188" textAnchor="middle" className="fill-green-300 text-xs">Los Alamos, NM</text>
        <text x="145" y="198" textAnchor="middle" className="fill-slate-500 text-xs">Secret Lab</text>
        
        <circle cx="115" cy="85" r="16" className="fill-green-500" opacity="0.4" />
        <circle cx="115" cy="85" r="6" className="fill-green-500" />
        <text x="115" y="108" textAnchor="middle" className="fill-green-300 text-xs">Hanford, WA</text>
        <text x="115" y="118" textAnchor="middle" className="fill-slate-500 text-xs">Plutonium</text>
      </g>
      
      {/* Connection lines */}
      <line x1="145" y1="160" x2="310" y2="150" className="stroke-green-500" strokeWidth="1" strokeDasharray="5,3" opacity="0.5" />
      <line x1="115" y1="85" x2="145" y2="160" className="stroke-green-500" strokeWidth="1" strokeDasharray="5,3" opacity="0.5" />
      
      {/* Stats box */}
      <rect x="315" y="35" width="155" height="85" className="fill-slate-900 stroke-green-500" rx="5" strokeWidth="1" />
      <text x="392" y="52" textAnchor="middle" className="fill-green-500 text-xs font-bold">MANHATTAN PROJECT</text>
      <text x="392" y="70" textAnchor="middle" className="fill-slate-400 text-xs">125,000+ workers</text>
      <text x="392" y="84" textAnchor="middle" className="fill-slate-400 text-xs">$2 billion ($28B today)</text>
      <text x="392" y="98" textAnchor="middle" className="fill-slate-400 text-xs">30+ sites nationwide</text>
      <text x="392" y="112" textAnchor="middle" className="fill-amber-400 text-xs font-bold">0 leaks for 3+ years</text>
      
      {/* Who didn't know */}
      <rect x="15" y="225" width="470" height="80" className="fill-slate-900" rx="5" />
      <text x="250" y="248" textAnchor="middle" className="fill-amber-500 text-sm font-bold">WHO DIDN'T KNOW:</text>
      <text x="95" y="272" textAnchor="middle" className="fill-slate-400 text-sm">VP Truman</text>
      <text x="95" y="286" textAnchor="middle" className="fill-slate-500 text-xs">(82 days as VP)</text>
      <text x="250" y="272" textAnchor="middle" className="fill-slate-400 text-sm">Most of Congress</text>
      <text x="250" y="286" textAnchor="middle" className="fill-slate-500 text-xs">(incl. oversight chairs)</text>
      <text x="405" y="272" textAnchor="middle" className="fill-slate-400 text-sm">The Workers</text>
      <text x="405" y="286" textAnchor="middle" className="fill-slate-500 text-xs">(compartmentalized)</text>
    </svg>
    
    <p className="text-center text-muted-foreground mt-3 text-sm italic">
      Scale doesn't prevent secrecy—it enables it through compartmentalization.
    </p>
  </div>
);

// UAP Application Diagram
export const UAPApplicationDiagram = ({ isVisible = true }: { isVisible?: boolean }) => (
  <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
    <svg viewBox="0 0 500 380" className="w-full max-w-2xl mx-auto">
      <rect width="500" height="380" className="fill-slate-900" rx="8" />
      
      <text x="250" y="28" textAnchor="middle" className="fill-cyan-400 text-sm font-bold">
        APPLYING MOSAIC THEORY TO UAP
      </text>
      
      {/* Ground Truth (bottom) */}
      <rect x="25" y="280" width="450" height="75" className="fill-slate-800 stroke-green-500" rx="5" strokeWidth="2" />
      <text x="250" y="302" textAnchor="middle" className="fill-green-500 text-sm font-bold">GROUND TRUTH (Unknown)</text>
      <text x="250" y="320" textAnchor="middle" className="fill-slate-400 text-xs">What actually exists: craft, programs, materials, knowledge</text>
      <text x="250" y="340" textAnchor="middle" className="fill-slate-500 text-xs italic">This is what we're trying to approximate</text>
      
      {/* Filters (middle) */}
      <rect x="25" y="155" width="450" height="105" className="fill-slate-800 stroke-amber-500" rx="5" strokeWidth="2" />
      <text x="250" y="178" textAnchor="middle" className="fill-amber-500 text-sm font-bold">THE FILTERS</text>
      
      {/* Filter boxes */}
      <g transform="translate(40, 188)">
        <rect width="75" height="22" className="fill-red-900" rx="3" />
        <text x="37" y="15" textAnchor="middle" className="fill-red-300 text-xs">Classification</text>
      </g>
      <g transform="translate(125, 188)">
        <rect width="75" height="22" className="fill-red-900" rx="3" />
        <text x="37" y="15" textAnchor="middle" className="fill-red-300 text-xs">Stigma/Ridicule</text>
      </g>
      <g transform="translate(210, 188)">
        <rect width="75" height="22" className="fill-red-900" rx="3" />
        <text x="37" y="15" textAnchor="middle" className="fill-red-300 text-xs">Compartments</text>
      </g>
      <g transform="translate(295, 188)">
        <rect width="75" height="22" className="fill-red-900" rx="3" />
        <text x="37" y="15" textAnchor="middle" className="fill-red-300 text-xs">NDAs/Threats</text>
      </g>
      <g transform="translate(380, 188)">
        <rect width="85" height="22" className="fill-red-900" rx="3" />
        <text x="42" y="15" textAnchor="middle" className="fill-red-300 text-xs">Disinformation</text>
      </g>
      <g transform="translate(125, 218)">
        <rect width="95" height="22" className="fill-red-900" rx="3" />
        <text x="47" y="15" textAnchor="middle" className="fill-red-300 text-xs">Media Gatekeeping</text>
      </g>
      <g transform="translate(280, 218)">
        <rect width="95" height="22" className="fill-red-900" rx="3" />
        <text x="47" y="15" textAnchor="middle" className="fill-red-300 text-xs">Career Consequences</text>
      </g>
      
      {/* Your Mosaic (top) */}
      <rect x="25" y="45" width="450" height="95" className="fill-slate-800 stroke-blue-500" rx="5" strokeWidth="2" />
      <text x="250" y="65" textAnchor="middle" className="fill-blue-500 text-sm font-bold">YOUR MOSAIC (What Reaches You)</text>
      
      {/* Evidence tiles */}
      <g transform="translate(40, 75)">
        <rect width="65" height="18" className="fill-blue-600" rx="2" opacity="0.8" />
        <text x="32" y="13" textAnchor="middle" className="fill-white text-xs">Testimony</text>
      </g>
      <g transform="translate(115, 78)">
        <rect width="55" height="16" className="fill-green-600" rx="2" opacity="0.7" />
        <text x="27" y="12" textAnchor="middle" className="fill-white text-xs">Videos</text>
      </g>
      <g transform="translate(180, 72)">
        <rect width="72" height="20" className="fill-violet-600" rx="2" opacity="0.8" />
        <text x="36" y="14" textAnchor="middle" className="fill-white text-xs">FOIA Docs</text>
      </g>
      <g transform="translate(262, 78)">
        <rect width="65" height="16" className="fill-amber-600" rx="2" opacity="0.7" />
        <text x="32" y="12" textAnchor="middle" className="fill-white text-xs">Legislation</text>
      </g>
      <g transform="translate(337, 74)">
        <rect width="75" height="18" className="fill-red-600" rx="2" opacity="0.6" />
        <text x="37" y="13" textAnchor="middle" className="fill-white text-xs">Whistleblowers</text>
      </g>
      <g transform="translate(70, 100)">
        <rect width="60" height="16" className="fill-slate-600" rx="2" opacity="0.5" />
        <text x="30" y="12" textAnchor="middle" className="fill-white text-xs">Leaks</text>
      </g>
      <g transform="translate(145, 103)">
        <rect width="85" height="15" className="fill-slate-600" rx="2" opacity="0.4" />
        <text x="42" y="11" textAnchor="middle" className="fill-white text-xs">Academic Papers</text>
      </g>
      <g transform="translate(250, 100)">
        <rect width="70" height="16" className="fill-slate-600" rx="2" opacity="0.5" />
        <text x="35" y="12" textAnchor="middle" className="fill-white text-xs">Interviews</text>
      </g>
      <g transform="translate(335, 103)">
        <rect width="70" height="15" className="fill-slate-600" rx="2" opacity="0.4" />
        <text x="35" y="11" textAnchor="middle" className="fill-white text-xs">Sensor Data</text>
      </g>
    </svg>
    
    <p className="text-center text-cyan-400 mt-3 text-sm font-medium">
      Your task: Work backward from fragments, through the filters, to approximate ground truth
    </p>
  </div>
);

// Observer Lens Diagram
export const ObserverLensDiagram = ({ isVisible = true }: { isVisible?: boolean }) => (
  <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
    <svg viewBox="0 0 500 280" className="w-full max-w-2xl mx-auto">
      <rect width="500" height="280" className="fill-slate-900" rx="8" />
      
      {/* Background fragments */}
      <g opacity="0.6">
        {[...Array(25)].map((_, i) => (
          <rect
            key={i}
            x={25 + (i % 8) * 58}
            y={25 + Math.floor(i / 8) * 35}
            width={18 + (i % 3) * 8}
            height={12 + (i % 2) * 5}
            className={['fill-blue-500', 'fill-amber-500', 'fill-green-500', 'fill-red-500', 'fill-violet-500'][i % 5]}
            rx="2"
            opacity={0.3 + (i % 4) * 0.15}
          />
        ))}
      </g>
      
      {/* Observer silhouette with glasses */}
      <g transform="translate(195, 155)">
        <circle cx="55" cy="28" r="32" className="fill-slate-800" />
        <ellipse cx="55" cy="88" rx="55" ry="28" className="fill-slate-800" />
        
        {/* Glasses */}
        <g>
          <ellipse cx="35" cy="22" rx="18" ry="13" className="fill-cyan-500" opacity="0.3" />
          <ellipse cx="35" cy="22" rx="18" ry="13" fill="none" className="stroke-cyan-500" strokeWidth="2" />
          <ellipse cx="75" cy="22" rx="18" ry="13" className="fill-cyan-500" opacity="0.3" />
          <ellipse cx="75" cy="22" rx="18" ry="13" fill="none" className="stroke-cyan-500" strokeWidth="2" />
          <line x1="17" y1="22" x2="0" y2="18" className="stroke-cyan-500" strokeWidth="2" />
          <line x1="93" y1="22" x2="110" y2="18" className="stroke-cyan-500" strokeWidth="2" />
        </g>
      </g>
      
      {/* Assumption bubbles */}
      <g>
        <rect x="25" y="180" width="125" height="22" className="fill-slate-800 stroke-slate-600" rx="11" strokeWidth="1" />
        <text x="87" y="195" textAnchor="middle" className="fill-slate-400 text-xs">"Governments don't lie at scale"</text>
        
        <rect x="350" y="180" width="130" height="22" className="fill-slate-800 stroke-slate-600" rx="11" strokeWidth="1" />
        <text x="415" y="195" textAnchor="middle" className="fill-slate-400 text-xs">"Someone would have talked"</text>
        
        <rect x="165" y="210" width="170" height="22" className="fill-slate-800 stroke-slate-600" rx="11" strokeWidth="1" />
        <text x="250" y="225" textAnchor="middle" className="fill-slate-400 text-xs">"Experts would have figured it out"</text>
      </g>
      
      {/* Key question */}
      <text x="250" y="260" textAnchor="middle" className="fill-amber-500 text-sm font-bold">
        What filters exist today that you haven't questioned?
      </text>
    </svg>
  </div>
);
