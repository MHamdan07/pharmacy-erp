import { useState } from 'react';
import { RefreshCw, DollarSign, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, Button, Badge } from '../ui';

const BioEquivalentRecommender = ({ medicines = [], onApplySubstitute }) => {
  const [selectedAlternatives, setSelectedAlternatives] = useState({});

  const alternativesList = [
    {
      originalDrug: 'Augmentin 625mg Tablet',
      brandPrice: 48.0,
      genericName: 'Amoxicillin + Clavulanic Acid 625mg',
      suggestedBrand: 'Generic-AmoxClav 625mg',
      genericPrice: 18.5,
      savings: 29.5,
      inStock: true,
      bioEquivalenceRating: 'AB (FDA Certified Equivalent)'
    },
    {
      originalDrug: 'Lipitor 20mg Tablet',
      brandPrice: 65.0,
      genericName: 'Atorvastatin Calcium 20mg',
      suggestedBrand: 'Atorva Generic 20mg',
      genericPrice: 22.0,
      savings: 43.0,
      inStock: true,
      bioEquivalenceRating: 'AB (USP Standard Approved)'
    }
  ];

  const handleSubstituteClick = (alt) => {
    setSelectedAlternatives((prev) => ({ ...prev, [alt.originalDrug]: true }));
    if (onApplySubstitute) {
      onApplySubstitute(alt);
    }
  };

  return (
    <Card variant="glass" className="p-4 space-y-4 border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Generic Bio-Equivalent Alternative Recommender
              <Badge variant="success" size="sm">1-Click Substitution</Badge>
            </h3>
            <p className="text-[11px] text-slate-400">
              In-stock therapeutic generic equivalents with verified bio-equivalence ratings
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-1.5 custom-scrollbar">
        {alternativesList.map((alt, idx) => {
          const applied = selectedAlternatives[alt.originalDrug];
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                applied
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-200'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{alt.originalDrug}</span>
                    <span className="text-slate-400 text-xs font-mono">(${alt.brandPrice.toFixed(2)})</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Generic Equivalent: <strong>{alt.suggestedBrand}</strong></span>
                    <Badge variant="secondary" size="sm">{alt.bioEquivalenceRating}</Badge>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Active Ingredient: {alt.genericName}
                  </p>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">${alt.genericPrice.toFixed(2)}</div>
                    <div className="text-[10px] text-emerald-300 font-semibold flex items-center gap-0.5 justify-end">
                      <DollarSign className="w-3 h-3 inline" /> Save ${alt.savings.toFixed(2)} ({Math.round((alt.savings / alt.brandPrice) * 100)}%)
                    </div>
                  </div>

                  <Button
                    variant={applied ? 'secondary' : 'success'}
                    size="sm"
                    leftIcon={applied ? CheckCircle2 : RefreshCw}
                    onClick={() => handleSubstituteClick(alt)}
                    disabled={applied}
                  >
                    {applied ? 'Substituted' : '1-Click Replace'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BioEquivalentRecommender;
