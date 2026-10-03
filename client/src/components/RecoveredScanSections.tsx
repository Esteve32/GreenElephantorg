// Recovered from 2a029447065922649ed4391a275221694a7ad424:client/src/pages/ScanPage.tsx.
// Keep the original wheel geometry, Lucide icons, brand colours and controls.
// Adaptations: recovered EN/FR copy, keyboard labels, scoped layout and resize handling.
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ArrowDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LENSES as BASE_LENSES, type LensType } from '@/constants/lenses';
import { restoredScan, scanLensNames, scanLabels } from '@shared/scan-restored';
import type { ScanLanguage } from '@shared/scan-literacy';
const logoUrl = '/ge-logo-512.png';
const LENS_ORDER: LensType[] = ['influence','attitude','chaordic','flow','alignment','needs','ego','dynamics'];
const frenchDescriptions = ['Exercer votre influence avec intégrité','Votre attitude face au changement','Trouver une structure dans le chaos créatif','Repérer la fluidité dans vos échanges','Développer l’empathie et la compréhension mutuelle','Respecter votre énergie et vos besoins','Reconnaître vos réactions liées à l’ego','Comprendre les dynamiques relationnelles'];
function localLenses(language: ScanLanguage) {
  return Object.fromEntries(LENS_ORDER.map((key,index)=>[key, {...BASE_LENSES[key], name:scanLensNames[language][index], description:language==='fr'?frenchDescriptions[index]:BASE_LENSES[key].description}])) as typeof BASE_LENSES;
}

export function RecoveredScanBenefits({language}: {language: ScanLanguage}) {
  const c = scanLabels[language], LENSES = localLenses(language);
  const PERSONAS = restoredScan[language].PERSONAS as {id:string;title:string;description:string;lenses:LensType[]}[];
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);

  return (
    <section 
      id="benefits" 
      className="ge-band ge-scan-recovered"
      data-testid="section-benefits"
    >
      <div className="section wrap">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">{language==='fr'?'Pour votre activité':'Your work'}</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-benefits-title">
            {c.people}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {c.peopleIntro}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONAS.map((persona, i) => (
            <motion.div
              key={persona.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 ${expandedPersona === persona.id ? 'ring-2 ring-needs' : ''}`}
                
                data-testid={`card-persona-${persona.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <label htmlFor={`persona-switch-${persona.id}`} className="flex items-center gap-3 cursor-pointer">
                      <CheckCircle2 className="w-6 h-6 text-needs flex-shrink-0" />
                      <h3 id={`persona-title-${persona.id}`} className="font-semibold text-lg text-white">{persona.title}</h3>
                    </label>
                    <Switch
                      id={`persona-switch-${persona.id}`}
                      aria-labelledby={`persona-title-${persona.id}`}
                      aria-controls={`persona-detail-${persona.id}`}
                      checked={expandedPersona === persona.id}
                      onCheckedChange={() => setExpandedPersona(expandedPersona === persona.id ? null : persona.id)}
                      className="data-[state=checked]:!bg-needs data-[state=unchecked]:!bg-white/20"
                      data-testid={`switch-persona-${persona.id}`}
                    />
                  </div>
                  
                  {expandedPersona === persona.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      id={`persona-detail-${persona.id}`} className="pt-4 border-t border-white/10"
                    >
                      <p className="text-sm text-white/70 mb-4">{persona.description}</p>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{c.keyLenses}</p>
                      <div className="flex flex-wrap gap-2">
                        {persona.lenses.map(lens => (
                          <Badge 
                            key={lens} 
                            className={`${LENSES[lens].color} text-white`}
                          >
                            {LENSES[lens].name}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecoveredScanLenses({language}: {language: ScanLanguage}) {
  const c = scanLabels[language], LENSES = localLenses(language);
  const {LENS_DETAILS, LENS_BENEFITS} = restoredScan[language];
  const [openLens, setOpenLens] = useState<LensType | null>(null);
  const [viewMode, setViewMode] = useState<"circular" | "stacked">("circular");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Preserve the original compact-screen list, without resetting a person's
  // chosen view on every resize or mobile browser toolbar change.
  useEffect(() => {
    const media = window.matchMedia('(max-width: 479px)');
    const update = () => { setIsSmallScreen(media.matches); if(media.matches) setViewMode('stacked'); };
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const getCirclePosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360 / total) - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  return (
    <section 
      id="lenses"
      onKeyDown={event => { if(event.key === 'Escape') setOpenLens(null); }} 
      className="ge-scan-recovered"
      data-testid="section-lenses"
    >
      <div className="section wrap">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <Badge className="mb-6 bg-needs/20 text-needs border-needs/30">{language==='fr'?'Le cadre':'The framework'}</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-lenses-title">
            {c.lenses}
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
            {c.lensesIntro}
          </p>
          
          {/* View toggle - hidden on small phones where circular view doesn't work well */}
          {!isSmallScreen && (
            <div className="flex items-center justify-center gap-3">
              <Label htmlFor="view-toggle" className="text-white/70 text-sm">{language==='fr'?'Circulaire':'Circular'}</Label>
              <Switch
                id="view-toggle"
                aria-label={language==='fr'?'Afficher la liste verticale des perspectives':'Show stacked lens list'}
                checked={viewMode === "stacked"}
                onCheckedChange={(checked) => { setOpenLens(null); setViewMode(checked ? "stacked" : "circular"); }}
                className="data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-white/20"
                data-testid="switch-view-mode"
              />
              <Label htmlFor="view-toggle" className="text-white/70 text-sm">{language==='fr'?'Liste verticale':'Stacked'}</Label>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === "circular" ? (
            <motion.div
              key="circular"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Circular lens wheel */}
              <div className="relative flex items-center justify-center" style={{ zIndex: 1 }}>
                {/* Circle container */}
                <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
                  {/* Decorative ring */}
                  <div className="absolute inset-4 sm:inset-6 md:inset-8 rounded-full border border-white/10" />
                  <div className="absolute inset-8 sm:inset-12 md:inset-16 rounded-full border border-white/5" />
                  
                  {/* Center content - Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <img 
                        src={logoUrl} 
                        alt={language==='fr'?'Logo GreenElephant':'GreenElephant logo'} 
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto opacity-80"
                      />
                    </div>
                  </div>
                  
                  {/* Lens items positioned in a circle */}
                  {LENS_ORDER.map((lensKey, index) => {
                    const lens = LENSES[lensKey];
                    const Icon = lens.icon;
                    const isOpen = openLens === lensKey;
                    const details = LENS_DETAILS[lensKey];
                    
                    const mobileRadius = 120;
                    const smRadius = 150;
                    const mdRadius = 190;
                    
                    const mobilePos = getCirclePosition(index, 8, mobileRadius);
                    const smPos = getCirclePosition(index, 8, smRadius);
                    const mdPos = getCirclePosition(index, 8, mdRadius);
                    
                    return (
                      <motion.div
                        key={lens.value}
                        initial={false}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          transform: `translate(calc(-50% + ${mobilePos.x}px), calc(-50% + ${mobilePos.y}px))`,
                          zIndex: isOpen ? 100 : 10,
                        }}
                        data-testid={`lens-station-${lens.value}`}
                      >
                        <style>
                          {`
                            @media (min-width: 640px) {
                              #lenses [data-testid="lens-station-${lens.value}"] {
                                transform: translate(calc(-50% + ${smPos.x}px), calc(-50% + ${smPos.y}px)) !important;
                              }
                            }
                            @media (min-width: 768px) {
                              #lenses [data-testid="lens-station-${lens.value}"] {
                                transform: translate(calc(-50% + ${mdPos.x}px), calc(-50% + ${mdPos.y}px)) !important;
                              }
                            }
                          `}
                        </style>
                        
                        <Collapsible open={isOpen} onOpenChange={(open) => setOpenLens(open ? lensKey : null)}>
                          <CollapsibleTrigger asChild>
                            <button 
                              className="group flex flex-col items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                              data-testid={`button-lens-${lens.value}`}
                            >
                              <div className={`${lens.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${isOpen ? 'ring-2 ring-white/40 scale-110' : ''}`}>
                                <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                              </div>
                              <span className="text-xs sm:text-xs md:text-sm font-medium text-foreground mt-1 whitespace-nowrap">{lens.name}</span>
                              <span className="text-xs sm:text-xs md:text-xs text-muted-foreground">{lens.code}</span>
                            </button>
                          </CollapsibleTrigger>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <CollapsibleContent forceMount>
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="ge-scan-lens-popover absolute left-1/2 -translate-x-1/2 mt-2 p-3 sm:p-4 rounded-xl bg-background/95 border border-white/20 backdrop-blur-md w-[200px] sm:w-[240px] md:w-[280px] text-left shadow-xl"
                                  style={{ zIndex: 200 }}
                                >
                                  <button type="button" onClick={() => setOpenLens(null)} aria-label={language==='fr'?'Fermer la perspective':'Close lens details'} className="float-right -mr-2 -mt-2 flex h-11 w-11 items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><X className="h-4 w-4" /></button>
                                  <p className="text-xs sm:text-sm text-white/90 mb-3 italic leading-relaxed">{lens.description}</p>
                                  <div className="mb-2">
                                    <p className="text-xs sm:text-xs text-destructive font-semibold mb-1 uppercase tracking-wider">{c.pattern}</p>
                                    <p className="text-xs sm:text-xs text-muted-foreground leading-relaxed">{details.painSignal}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs sm:text-xs text-needs font-semibold mb-1 uppercase tracking-wider">{c.practice}</p>
                                    <p className="text-xs sm:text-xs text-muted-foreground leading-relaxed">{details.benefit}</p>
                                  </div>
                                </motion.div>
                              </CollapsibleContent>
                            )}
                          </AnimatePresence>
                        </Collapsible>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stacked"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {/* Stacked lens list with accordions */}
              <div className="space-y-3">
                {LENS_ORDER.map((lensKey, index) => {
                  const lens = LENSES[lensKey];
                  const Icon = lens.icon;
                  const isOpen = openLens === lensKey;
                  const details = LENS_DETAILS[lensKey];
                  
                  return (
                    <motion.div
                      key={lens.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Collapsible 
                        open={isOpen} 
                        onOpenChange={(open) => setOpenLens(open ? lensKey : null)}
                      >
                        <CollapsibleTrigger asChild>
                          <button 
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border ${
                              isOpen 
                                ? 'bg-white/10 border-white/20' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            data-testid={`button-lens-stacked-${lens.value}`}
                          >
                            <div 
                              className={`${lens.color} w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}
                            >
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{lens.name}</span>
                                <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                  {lens.code}
                                </Badge>
                              </div>
                              <p className="text-sm text-white/60 mt-0.5 ">{lens.description}</p>
                            </div>
                            <ArrowDown className={`h-5 w-5 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </CollapsibleTrigger>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <CollapsibleContent forceMount>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 pt-2 ml-0 sm:ml-16 border-l-2 border-white/10">
                                  <div className="grid gap-3">
                                    <div><h4 className="font-semibold">{c.pattern}</h4><p>{details.painSignal}</p><h4 className="font-semibold">{c.practice}</h4><p>{details.benefit}</p></div>
                                    {LENS_BENEFITS[lensKey].map((item, idx) => (
                                      <div 
                                        key={idx}
                                        className="rounded-lg p-3 border"
                                        style={{ 
                                          backgroundColor: `${lens.hexColor}15`,
                                          borderColor: `${lens.hexColor}30`
                                        }}
                                      >
                                        <p 
                                          className="text-xs font-semibold mb-1 uppercase tracking-wider flex items-center gap-2"
                                          style={{ color: lens.hexColor }}
                                        >
                                          <CheckCircle2 className="w-3 h-3" />
                                          {item.benefit}
                                        </p>
                                        <p className="text-sm text-white/70">{item.insight}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            </CollapsibleContent>
                          )}
                        </AnimatePresence>
                      </Collapsible>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8 md:mt-12"
        >
          <Button asChild variant="outline" className="max-w-full whitespace-normal border-needs/50 text-needs hover:bg-needs/10" data-testid="button-explore-table"><a href="/periodic-table">
              {language==='fr'?'Explorer le Tableau périodique (en anglais)':'Explore the Periodic Table'}
              <ArrowRight className="ml-2 h-4 w-4" />
          </a></Button>
        </motion.div>
      </div>
    </section>
  );
}
