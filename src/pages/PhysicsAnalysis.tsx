import { useState, useEffect } from "react";
import { Atom, HelpCircle, Zap, RotateCcw, Eye, Gauge, Radio } from "lucide-react";
import { ClaimCard } from "@/components/ClaimCard";
import { supabase, Observable, Claim } from "@/lib/supabase";

// Fallback observables
const fallbackObservables: Observable[] = [
  {
    id: '1',
    name: 'Instantaneous Acceleration',
    measurement: '5,000+ g forces observed on radar',
    mechanism: 'Unknown propulsion without apparent reaction mass',
    gap: 'Violates known inertia limits; no visible propulsion system'
  },
  {
    id: '2',
    name: 'Hypersonic Velocities',
    measurement: 'Speeds exceeding Mach 10 without sonic boom',
    mechanism: 'Possible field propulsion or medium displacement',
    gap: 'No heating signature despite hypersonic speeds'
  },
  {
    id: '3',
    name: 'Low Observability',
    measurement: 'Intermittent radar returns despite visual contact',
    mechanism: 'Active or passive stealth beyond current technology',
    gap: 'Selective visibility across EM spectrum'
  },
  {
    id: '4',
    name: 'Trans-medium Travel',
    measurement: 'Observed transition from air to water without deceleration',
    mechanism: 'Unknown method of medium displacement',
    gap: 'No splash, cavitation, or medium transition effects'
  },
  {
    id: '5',
    name: 'Anti-Gravity Lift',
    measurement: 'Hovering with no visible means of support',
    mechanism: 'Hypothesized field effect or mass cancellation',
    gap: 'No downwash, no visible propulsion exhaust'
  }
];

const observableIcons: Record<string, any> = {
  'Instantaneous Acceleration': Zap,
  'Hypersonic Velocities': Gauge,
  'Low Observability': Eye,
  'Trans-medium Travel': RotateCcw,
  'Anti-Gravity Lift': Atom,
};

export default function PhysicsAnalysis() {
  const [observables, setObservables] = useState<Observable[]>(fallbackObservables);
  const [physicsClaims, setPhysicsClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch observables
      const { data: obsData } = await supabase
        .from('observables')
        .select('*');
      
      if (obsData && obsData.length > 0) {
        setObservables(obsData);
      }

      // Fetch physics-related claims (sections C and J)
      const { data: claimsData } = await supabase
        .from('claims')
        .select('*')
        .in('section_id', ['c', 'j']);
      
      setPhysicsClaims(claimsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Atom className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Physics Analysis</h1>
            <p className="text-muted-foreground">Observable characteristics and propulsion research</p>
          </div>
        </div>
      </div>

      {/* Five Observables */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 animate-fade-in">The Five Observables</h2>
        <p className="text-muted-foreground mb-6 animate-fade-in">
          These are the five key characteristics repeatedly observed in UAP encounters, 
          documented by military pilots and sensor systems.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {observables.map((obs, i) => {
            const Icon = observableIcons[obs.name] || Radio;
            return (
              <div 
                key={obs.id} 
                className="card-elevated p-5 animate-fade-in" 
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">{obs.name}</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Measurement
                    </div>
                    <p>{obs.measurement}</p>
                  </div>
                  
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Proposed Mechanism
                    </div>
                    <p className="text-muted-foreground">{obs.mechanism}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-primary mb-1">
                      <HelpCircle className="w-3 h-3" />
                      Physics Gap
                    </div>
                    <p className="text-sm italic text-muted-foreground">{obs.gap}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Physics Claims */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Key Physics Claims</h2>
        <p className="text-muted-foreground mb-6">
          Claims from Sections C (Physics-Defying Capabilities) and J (Physics R&D).
        </p>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-elevated p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-3" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {physicsClaims.map((claim, i) => (
              <div key={claim.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <ClaimCard 
                  claim={claim} 
                  sectionLetter={claim.section_id.toUpperCase()}
                />
              </div>
            ))}

            {physicsClaims.length === 0 && (
              <div className="card-elevated p-12 text-center text-muted-foreground">
                No physics claims available. Connect your Supabase database to load data.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
