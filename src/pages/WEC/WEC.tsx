// ─── WEC 2026 — 100% gebaseerd op echte bestandsnamen ─────────────────────────
import { useState, useEffect } from 'react'
import SeriesBadge from '@/components/SeriesBadge'

interface Driver { id: string; naam: string; nationaliteit: string; vlag: string }
interface Team {
  id: string; nr: number; nrPad?: string; naam: string; fabrikant: string
  carModel: string; klasse: 'Hypercar' | 'GT3 (LMGT3)'; kleur: string; info: string; drivers: Driver[]
}

const KLASSE_KLEUR: Record<string, string> = { 'Hypercar': '#3b82f6', 'GT3 (LMGT3)': '#22c55e' }
const KLASSE_MAP:   Record<string, string> = { 'Hypercar': 'hypercar', 'GT3 (LMGT3)': 'gt3' }

const MERK_KLEUR: Record<string, string> = {
  Toyota: '#e8002d', 'Aston Martin': '#006b5b', Cadillac: '#a0001c', BMW: '#1c69d4',
  Genesis: '#c0a020', Alpine: '#0093cc', Ferrari: '#e8002d', Peugeot: '#00aaff',
  McLaren: '#ff8000', Corvette: '#ffcc00', Ford: '#003e99', Lexus: '#e8002d',
  Mercedes: '#00d2be', Lamborghini: '#d4a017', Porsche: '#c0a060',
}

// nrPad = bestandsnaam prefix (007, 009 etc.)
// carModel = exact wat na het nummer staat in de bestandsnaam
const TEAMS: Team[] = [
  // ── Hypercar ──
  { id:'wec-35',  nr:35,  naam:'Alpine Endurance Team',    fabrikant:'Alpine',       carModel:'Alpine-A424',           klasse:'Hypercar', kleur:'#0093cc', info:'Alpine A424 — Alpine Endurance Team.',
    drivers:[{id:'antonio-felix-da-costa',naam:'António Félix da Costa',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'charles-milesi',naam:'Charles Milesi',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'ferdinand-habsburg',naam:'Ferdinand Habsburg',nationaliteit:'Oostenrijk',vlag:'🇦🇹'}] },
  { id:'wec-36',  nr:36,  naam:'Alpine Endurance Team',    fabrikant:'Alpine',       carModel:'Alpine-A424',           klasse:'Hypercar', kleur:'#0093cc', info:'Alpine A424 — Alpine Endurance Team.',
    drivers:[{id:'frederic-makowiecki',naam:'Frédéric Makowiecki',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'jules-gounon',naam:'Jules Gounon',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'victor-martins',naam:'Victor Martins',nationaliteit:'Monaco',vlag:'🇲🇨'}] },
  { id:'wec-007', nr:7,   nrPad:'007', naam:'Aston Martin Thor Team',  fabrikant:'Aston Martin', carModel:'Aston-Martin-Valkyrie', klasse:'Hypercar', kleur:'#006b5b', info:'Aston Martin Valkyrie — Aston Martin Thor Team.',
    drivers:[{id:'harry-tincknell',naam:'Harry Tincknell',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'tom-gamble',naam:'Tom Gamble',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'wec-009', nr:9,   nrPad:'009', naam:'Aston Martin Thor Team',  fabrikant:'Aston Martin', carModel:'Aston-Martin-Valkyrie', klasse:'Hypercar', kleur:'#006b5b', info:'Aston Martin Valkyrie — Aston Martin Thor Team.',
    drivers:[{id:'alex-riberas',naam:'Alex Riberas',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'marco-sorensen',naam:'Marco Sørensen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'wec-15',  nr:15,  naam:'BMW M Team WRT',           fabrikant:'BMW',          carModel:'BMW-M-hybrid-v8',        klasse:'Hypercar', kleur:'#1c69d4', info:'BMW M Hybrid V8 — BMW M Team WRT.',
    drivers:[{id:'dries-vanthoor',naam:'Dries Vanthoor',nationaliteit:'België',vlag:'🇧🇪'},{id:'kevin-magnussen',naam:'Kevin Magnussen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'raffaele-marciello',naam:'Raffaele Marciello',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'wec-20',  nr:20,  naam:'BMW M Team WRT',           fabrikant:'BMW',          carModel:'BMW-M-hybrid-v8',        klasse:'Hypercar', kleur:'#1c69d4', info:'BMW M Hybrid V8 — BMW M Team WRT.',
    drivers:[{id:'rene-rast',naam:'René Rast',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'robin-frijns',naam:'Robin Frijns',nationaliteit:'Nederland',vlag:'🇳🇱'},{id:'sheldon-van-der-linde',naam:'Sheldon van der Linde',nationaliteit:'Z. Afrika',vlag:'🇿🇦'}] },
  { id:'wec-12',  nr:12,  naam:'Cadillac Hertz Team Jota', fabrikant:'Cadillac',     carModel:'Cadillac-V-Serie.R',              klasse:'Hypercar', kleur:'#a0001c', info:'Cadillac V-Series.R — Cadillac Hertz Team Jota.',
    drivers:[{id:'norman-nato',naam:'Norman Nato',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'will-stevens',naam:'Will Stevens',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'wec-38',  nr:38,  naam:'Cadillac Hertz Team Jota', fabrikant:'Cadillac',     carModel:'Cadillac-V-Serie.R',              klasse:'Hypercar', kleur:'#a0001c', info:'Cadillac V-Series.R — Cadillac Hertz Team Jota.',
    drivers:[{id:'earl-bamber',naam:'Earl Bamber',nationaliteit:'N. Zeeland',vlag:'🇳🇿'},{id:'jack-aitken',naam:'Jack Aitken',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'sebastien-bourdais',naam:'Sébastien Bourdais',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'wec-50',  nr:50,  naam:'Ferrari AF Corse',         fabrikant:'Ferrari',      carModel:'Ferrari-499-P',           klasse:'Hypercar', kleur:'#e8002d', info:'Ferrari 499P — Ferrari AF Corse.',
    drivers:[{id:'antonio-fuoco',naam:'Antonio Fuoco',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'miguel-molina',naam:'Miguel Molina',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'nicklas-nielsen',naam:'Nicklas Nielsen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'wec-51',  nr:51,  naam:'Ferrari AF Corse',         fabrikant:'Ferrari',      carModel:'Ferrari-499-P',           klasse:'Hypercar', kleur:'#e8002d', info:'Ferrari 499P — Ferrari AF Corse.',
    drivers:[{id:'alessandro-pier-guidi',naam:'Alessandro Pier Guidi',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'antonio-giovinazzi',naam:'Antonio Giovinazzi',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'james-calado',naam:'James Calado',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'wec-83',  nr:83,  naam:'AF Corse',                 fabrikant:'Ferrari',      carModel:'Ferrari-499-P',           klasse:'Hypercar', kleur:'#e8002d', info:'Ferrari 499P — AF Corse.',
    drivers:[{id:'philip-hanson',naam:'Philip Hanson',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'robert-kubica',naam:'Robert Kubica',nationaliteit:'Polen',vlag:'🇵🇱'},{id:'yifei-ye',naam:'Yifei Ye',nationaliteit:'China',vlag:'🇨🇳'}] },
  { id:'wec-17',  nr:17,  naam:'Genesis Magma Racing',     fabrikant:'Genesis',      carModel:'Genesis-GMR-001',               klasse:'Hypercar', kleur:'#c0a020', info:'Genesis GMR-001 Hypercar — Genesis Magma Racing.',
    drivers:[{id:'andre-lotterer',naam:'André Lotterer',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'luis-felipe-derani',naam:'Luis Felipe Derani',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'mathys-jaubert',naam:'Mathys Jaubert',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'wec-19',  nr:19,  naam:'Genesis Magma Racing',     fabrikant:'Genesis',      carModel:'Genesis-GMR-001',               klasse:'Hypercar', kleur:'#c0a020', info:'Genesis GMR-001 Hypercar — Genesis Magma Racing.',
    drivers:[{id:'daniel-juncadella',naam:'Daniel Juncadella',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'mathieu-jaminet',naam:'Mathieu Jaminet',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'paul-loup-chatin',naam:'Paul-Loup Chatin',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'wec-93',  nr:93,  naam:'Peugeot TotalEnergies',    fabrikant:'Peugeot',      carModel:'Peugeot-9X8',           klasse:'Hypercar', kleur:'#00aaff', info:'Peugeot 9X8 — Peugeot TotalEnergies.',
    drivers:[{id:'nick-cassidy',naam:'Nick Cassidy',nationaliteit:'N. Zeeland',vlag:'🇳🇿'},{id:'paul-di-resta',naam:'Paul Di Resta',nationaliteit:'Schotland',vlag:'🇬🇧'},{id:'stoffel-vandoorne',naam:'Stoffel Vandoorne',nationaliteit:'België',vlag:'🇧🇪'}] },
  { id:'wec-94',  nr:94,  naam:'Peugeot TotalEnergies',    fabrikant:'Peugeot',      carModel:'Peugeot-9X8',           klasse:'Hypercar', kleur:'#00aaff', info:'Peugeot 9X8 — Peugeot TotalEnergies.',
    drivers:[{id:'loic-duval',naam:'Loïc Duval',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'malthe-jakobsen',naam:'Malthe Jakobsen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'theo-pourchaire',naam:'Théo Pourchaire',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'wec-7',   nr:7,   naam:'Toyota Racing',            fabrikant:'Toyota',       carModel:'Toyota-TR010',          klasse:'Hypercar', kleur:'#e8002d', info:'Toyota GR010 Hybrid — Toyota Racing.',
    drivers:[{id:'kamui-kobayashi',naam:'Kamui Kobayashi',nationaliteit:'Japan',vlag:'🇯🇵'},{id:'mike-conway',naam:'Mike Conway',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'nyck-de-vries',naam:'Nyck de Vries',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'wec-8',   nr:8,   naam:'Toyota Racing',            fabrikant:'Toyota',       carModel:'Toyota-TR010',          klasse:'Hypercar', kleur:'#e8002d', info:'Toyota GR010 Hybrid — Toyota Racing.',
    drivers:[{id:'sebastien-buemi',naam:'Sébastien Buemi',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'brendon-hartley',naam:'Brendon Hartley',nationaliteit:'N. Zeeland',vlag:'🇳🇿'},{id:'ryo-hirakawa',naam:'Ryo Hirakawa',nationaliteit:'Japan',vlag:'🇯🇵'}] },
  // ── GT3 (LMGT3) — carModel exact = wat na nummer staat in bestandsnaam ──
  { id:'wec-gt3-23', nr:23, naam:'Heart of Racing Team',   fabrikant:'Aston Martin', carModel:'Aston-Martin-Vantage-AMR-LMGT3',      klasse:'GT3 (LMGT3)', kleur:'#006b5b', info:'Aston Martin Vantage AMR LMGT3 — Heart of Racing Team.',
    drivers:[{id:'eduardo-barrichello',naam:'Eduardo Barrichello',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'gray-newell',naam:'Gray Newell',nationaliteit:'VS',vlag:'🇺🇸'},{id:'jonny-adam',naam:'Jonny Adam',nationaliteit:'Schotland',vlag:'🇬🇧'}] },
  { id:'wec-gt3-27', nr:27, naam:'Heart of Racing Team',   fabrikant:'Aston Martin', carModel:'Aston-Martin-Vantage-AMR-LMGT3',      klasse:'GT3 (LMGT3)', kleur:'#006b5b', info:'Aston Martin Vantage AMR LMGT3 — Heart of Racing Team.',
    drivers:[{id:'ian-james',naam:'Ian James',nationaliteit:'VS',vlag:'🇺🇸'},{id:'mattia-drudi',naam:'Mattia Drudi',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'zacharie-robichon',naam:'Zacharie Robichon',nationaliteit:'Canada',vlag:'🇨🇦'}] },
  { id:'wec-gt3-32', nr:32, naam:'Team WRT',               fabrikant:'BMW',          carModel:'BMW-M4-LMGT3-Evo-LMGT3',            klasse:'GT3 (LMGT3)', kleur:'#1c69d4', info:'BMW M4 LMGT3 Evo — Team WRT.',
    drivers:[{id:'augusto-farfus',naam:'Augusto Farfus',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'darren-leung',naam:'Darren Leung',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'sean-gelael',naam:'Sean Gelael',nationaliteit:'Indonesië',vlag:'🇮🇩'}] },
  { id:'wec-gt3-69', nr:69, naam:'Team WRT',               fabrikant:'BMW',          carModel:'BMW-M4-LMGT3-Evo-LMGT3',            klasse:'GT3 (LMGT3)', kleur:'#1c69d4', info:'BMW M4 LMGT3 Evo — Team WRT.',
    drivers:[{id:'anthony-mcintosh',naam:'Anthony McIntosh',nationaliteit:'Canada',vlag:'🇨🇦'},{id:'daniel-harper',naam:'Daniel Harper',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'parker-thompson',naam:'Parker Thompson',nationaliteit:'Canada',vlag:'🇨🇦'}] },
  { id:'wec-gt3-33', nr:33, naam:'TF Sport',               fabrikant:'Corvette',     carModel:'Corvette-Z06-R-LMGT3',      klasse:'GT3 (LMGT3)', kleur:'#ffcc00', info:'Corvette Z06 LMGT3.R — TF Sport.',
    drivers:[{id:'ben-keating',naam:'Ben Keating',nationaliteit:'VS',vlag:'🇺🇸'},{id:'jonny-edgar',naam:'Jonny Edgar',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'nicky-catsburg',naam:'Nicky Catsburg',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'wec-gt3-34', nr:34, naam:'Racing Team Turkey By TF',fabrikant:'Corvette',    carModel:'Corvette-Z06-R-LMGT3',    klasse:'GT3 (LMGT3)', kleur:'#ffcc00', info:'Corvette Z06 LMGT3.R — Racing Team Turkey By TF.',
    drivers:[{id:'charlie-eastwood',naam:'Charlie Eastwood',nationaliteit:'Ierland',vlag:'🇮🇪'},{id:'salih-yoluc',naam:'Salih Yoluc',nationaliteit:'Turkije',vlag:'🇹🇷'}] },
  { id:'wec-gt3-21', nr:21, naam:'Vista AF Corse',         fabrikant:'Ferrari',      carModel:'Ferrari-296-Evo-LMGT3',       klasse:'GT3 (LMGT3)', kleur:'#e8002d', info:'Ferrari 296 LMGT3 Evo — Vista AF Corse.',
    drivers:[{id:'alessio-rovera',naam:'Alessio Rovera',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'francois-heriau',naam:'François Heriau',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'simon-mann',naam:'Simon Mann',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'wec-gt3-54', nr:54, naam:'Vista AF Corse',         fabrikant:'Ferrari',      carModel:'Ferrari-296-Evo-LMGT3',       klasse:'GT3 (LMGT3)', kleur:'#e8002d', info:'Ferrari 296 LMGT3 Evo — Vista AF Corse.',
    drivers:[{id:'davide-rigon',naam:'Davide Rigon',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'francesco-castellacci',naam:'Francesco Castellacci',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'thomas-flohr',naam:'Thomas Flohr',nationaliteit:'Zwitserland',vlag:'🇨🇭'}] },
  { id:'wec-gt3-77', nr:77, naam:'Proton Competition',     fabrikant:'Ford',         carModel:'Ford-Mustang-LMGT3',          klasse:'GT3 (LMGT3)', kleur:'#003e99', info:'Ford Mustang LMGT3 — Proton Competition.',
    drivers:[{id:'ben-tuck',naam:'Ben Tuck',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'eric-powell',naam:'Eric Powell',nationaliteit:'VS',vlag:'🇺🇸'},{id:'sebastian-priaulx',naam:'Sebastian Priaulx',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'wec-gt3-88', nr:88, naam:'Proton Competition',     fabrikant:'Ford',         carModel:'Ford-Mustang-LMGT3',          klasse:'GT3 (LMGT3)', kleur:'#003e99', info:'Ford Mustang LMGT3 — Proton Competition.',
    drivers:[{id:'giammarco-levorato',naam:'Giammarco Levorato',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'logan-sargeant',naam:'Logan Sargeant',nationaliteit:'VS',vlag:'🇺🇸'},{id:'stefano-gattuso',naam:'Stefano Gattuso',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'wec-gt3-78', nr:78, naam:'Akkodis ASP Team',       fabrikant:'Lexus',        carModel:'Lexus-RC-F-LMGT3',      klasse:'GT3 (LMGT3)', kleur:'#e8002d', info:'Lexus RC F LMGT3 — Akkodis ASP Team.',
    drivers:[{id:'esteban-masson',naam:'Esteban Masson',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'hadrien-david',naam:'Hadrien David',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'tom-van-rompuy',naam:'Tom van Rompuy',nationaliteit:'België',vlag:'🇧🇪'}] },
  { id:'wec-gt3-87', nr:87, naam:'Akkodis ASP Team',       fabrikant:'Lexus',        carModel:'Lexus-RC-F-LMGT3',      klasse:'GT3 (LMGT3)', kleur:'#e8002d', info:'Lexus RC F LMGT3 — Akkodis ASP Team.',
    drivers:[{id:'clemens-schmid',naam:'Clemens Schmid',nationaliteit:'Oostenrijk',vlag:'🇦🇹'},{id:'jose-maria-lopez',naam:'José María López',nationaliteit:'Argentinië',vlag:'🇦🇷'},{id:'petru-umbrarescu',naam:'Petru Umbrarescu',nationaliteit:'Roemenië',vlag:'🇷🇴'}] },
  { id:'wec-gt3-10', nr:10, naam:'Garage 59',              fabrikant:'McLaren',      carModel:'MClaren-720S-Evo-LMGT3',          klasse:'GT3 (LMGT3)', kleur:'#ff8000', info:'McLaren 720S LMGT3 Evo — Garage 59.',
    drivers:[{id:'antares-au',naam:'Antares Au',nationaliteit:'Hong Kong',vlag:'🇭🇰'},{id:'marvin-kirchhofer',naam:'Marvin Kirchhöfer',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'thomas-fleming',naam:'Thomas Fleming',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'wec-gt3-58', nr:58, naam:'Garage 59',              fabrikant:'McLaren',      carModel:'MClaren-720S-Evo-LMGT3',          klasse:'GT3 (LMGT3)', kleur:'#ff8000', info:'McLaren 720S LMGT3 Evo — Garage 59.',
    drivers:[{id:'alexander-west',naam:'Alexander West',nationaliteit:'Zweden',vlag:'🇸🇪'},{id:'benjamin-goethe',naam:'Benjamin Goethe',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'finn-gehrsitz',naam:'Finn Gehrsitz',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  { id:'wec-gt3-61', nr:61, naam:'Iron Lynx',              fabrikant:'Mercedes',     carModel:'Mercedes-AMG-LMGT3',        klasse:'GT3 (LMGT3)', kleur:'#00d2be', info:'Mercedes AMG LMGT3 — Iron Lynx.',
    drivers:[{id:'martin-berry',naam:'Martin Berry',nationaliteit:'Australië',vlag:'🇦🇺'},{id:'maxime-martin',naam:'Maxime Martin',nationaliteit:'België',vlag:'🇧🇪'},{id:'rui-andrade',naam:'Rui Andrade',nationaliteit:'Portugal',vlag:'🇵🇹'}] },
  { id:'wec-gt3-79', nr:79, naam:'Iron Lynx',              fabrikant:'Mercedes',     carModel:'Mercedes-AMG-LMGT3',        klasse:'GT3 (LMGT3)', kleur:'#00d2be', info:'Mercedes AMG LMGT3 — Iron Lynx.',
    drivers:[{id:'johannes-zelger',naam:'Johannes Zelger',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'lin-hodenius',naam:'Lin Hodenius',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'matteo-cressoni',naam:'Matteo Cressoni',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'wec-gt3-91', nr:91, naam:'Manthey DK Engineering', fabrikant:'Porsche',      carModel:'Porsche-911-GT3-R-LMGT3',       klasse:'GT3 (LMGT3)', kleur:'#c0a060', info:'Porsche 911 GT3 R LMGT3 — Manthey DK Engineering.',
    drivers:[{id:'ayhancan-guven',naam:'Ayhancan Güven',nationaliteit:'Turkije',vlag:'🇹🇷'},{id:'james-cottingham',naam:'James Cottingham',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'timur-boguslavskiy',naam:'Timur Boguslavskiy',nationaliteit:'Rusland',vlag:'🇷🇺'}] },
  { id:'wec-gt3-92', nr:92, naam:'The Bend Manthey',       fabrikant:'Porsche',      carModel:'Porsche-911-GT3-R-LMGT3',       klasse:'GT3 (LMGT3)', kleur:'#c0a060', info:'Porsche 911 GT3 R LMGT3 — The Bend Manthey.',
    drivers:[{id:'riccardo-pera',naam:'Riccardo Pera',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'richard-lietz',naam:'Richard Lietz',nationaliteit:'Oostenrijk',vlag:'🇦🇹'},{id:'yasser-shahin',naam:'Yasser Shahin',nationaliteit:'Australië',vlag:'🇦🇺'}] },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const VLAG_CODES: Record<string, string> = {
  '🇯🇵':'jp','🇬🇧':'gb','🇳🇱':'nl','🇨🇭':'ch','🇳🇿':'nz','🇪🇸':'es','🇩🇰':'dk','🇧🇪':'be','🇩🇪':'de',
  '🇫🇷':'fr','🇮🇹':'it','🇵🇹':'pt','🇦🇹':'at','🇲🇨':'mc','🇧🇷':'br','🇺🇸':'us','🇵🇱':'pl','🇨🇳':'cn',
  '🇿🇦':'za','🇦🇺':'au','🇸🇪':'se','🇹🇷':'tr','🇷🇴':'ro','🇦🇷':'ar','🇮🇪':'ie','🇨🇦':'ca','🇮🇩':'id',
  '🇷🇺':'ru','🇭🇰':'hk',
}
function VlagImg({ emoji, size = 14 }: { emoji: string; size?: number }) {
  const code = VLAG_CODES[emoji]
  if (!code) return <span style={{ fontSize: size * 0.7 }}>{emoji}</span>
  return <img src={`/wec/flags/${code}.webp`} alt={code} width={Math.round(size*4/3)} height={size}
    className="inline-block object-cover rounded-sm flex-shrink-0" style={{ height: size }}
    onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }} />
}
function nrStr(t: Team) { return t.nrPad ?? String(t.nr) }
function carSrc(t: Team) { return `/wec/${KLASSE_MAP[t.klasse]}/cars/2026-wec-${nrStr(t)}-${t.carModel}.webp` }
function drvSrc(t: Team, d: Driver) { return `/wec/${KLASSE_MAP[t.klasse]}/drivers/2026-wec-${nrStr(t)}-${d.id}.webp` }

function KlasseBadge({ klasse }: { klasse: string }) {
  const c = KLASSE_KLEUR[klasse] ?? '#888'
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-ui font-bold uppercase tracking-widest"
    style={{ background:`${c}22`, color:c, border:`1px solid ${c}44` }}>{klasse}</span>
}

function TeamRij({ team, isEven, onKlik }: { team: Team; isEven: boolean; onKlik: () => void }) {
  const kk = KLASSE_KLEUR[team.klasse] ?? '#888'
  const mk = MERK_KLEUR[team.fabrikant] ?? kk
  return (
    <div className="relative flex items-center group cursor-pointer overflow-hidden transition-all duration-300"
      style={{ background: isEven ? 'rgba(255,255,255,0.025)' : 'transparent', borderBottom:'1px solid rgba(255,255,255,0.06)', minHeight:88 }}
      onClick={onKlik}
      onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.06)'}}
      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background=isEven?'rgba(255,255,255,0.025)':'transparent'}}>
      <div className="absolute left-0 top-0 h-full w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r" style={{background:kk}}/>
      <div className="absolute font-head font-black select-none pointer-events-none"
        style={{fontSize:96,color:mk,opacity:0.07,left:'55%',top:'50%',transform:'translate(-50%,-50%)',lineHeight:1}}>{nrStr(team)}</div>
      <div className="flex-shrink-0 flex items-center justify-center pl-4" style={{width:80}}>
        <KlasseBadge klasse={team.klasse}/>
      </div>
      <div className="flex-shrink-0 flex items-center" style={{width:88,height:88,overflow:'hidden'}}>
        {team.drivers.slice(0,1).map(d=>(
          <img key={d.id} src={drvSrc(team,d)} alt={d.naam}
            style={{width:88,height:100,objectFit:'cover',objectPosition:'top center',marginTop:-4,filter:'drop-shadow(2px 0 8px rgba(0,0,0,0.5))'}}
            onError={e=>{(e.currentTarget as HTMLImageElement).style.visibility='hidden'}}/>
        ))}
      </div>
      <div className="flex-1 flex flex-col justify-center px-5 min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="font-head font-black text-2xl leading-none" style={{color:kk}}>#{nrStr(team)}</span>
          <span className="font-head font-black text-lg uppercase text-white tracking-wide truncate">{team.naam}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-0.5 h-3 rounded-full flex-shrink-0" style={{background:mk}}/>
          <span className="font-ui text-xs font-bold uppercase tracking-wider flex-shrink-0" style={{color:mk,opacity:0.85}}>{team.fabrikant}</span>
          <span className="font-ui text-xs text-white/25">·</span>
          <span className="font-ui text-xs text-white/30 truncate">{team.carModel.replace(/-/g,' ')}</span>
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {team.drivers.map((d,i)=>(
            <span key={d.id} className="flex items-center gap-1">
              <VlagImg emoji={d.vlag} size={14}/>
              <span className="font-ui text-[10px] text-white/25 group-hover:text-white/50 transition-colors">
                {d.naam.split(' ').pop()}{i<team.drivers.length-1?' ·':''}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 relative flex items-center justify-center" style={{width:300,height:88,overflow:'hidden'}}>
        <div className="absolute inset-y-2 left-2 right-2 rounded-xl"
          style={{background:`linear-gradient(135deg,${mk}22,${mk}08)`,border:`1px solid ${mk}40`}}/>
        <img src={carSrc(team)} alt={team.carModel}
          style={{position:'relative',width:280,height:72,objectFit:'contain',objectPosition:'center',filter:`drop-shadow(0 2px 14px ${mk}50)`}}
          onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.15'}}/>
      </div>
    </div>
  )
}

// ─── Logo helpers ─────────────────────────────────────────────────────────────

// Exacte bestandsnamen per team-id (public/wec/all_team_logos/)
const TEAM_LOGO: Record<string, string> = {
  // Hypercar
  'wec-35':      'alpine-endurance-team-no35.webp',
  'wec-36':      'alpine-endurance-team-no36.webp',
  'wec-007':     'aston-martin-thor-team-no007.webp',
  'wec-009':     'aston-martin-thor-team-no009.webp',
  'wec-15':      'bmw-m-team-wrt-no15.webp',
  'wec-20':      'bmw-m-team-wrt-no20.webp',
  'wec-12':      'cadillac-hertz-team-jota-no12.webp',
  'wec-38':      'cadillac-hertz-team-jota-no38.webp',
  'wec-50':      'ferrari-af-corse-no50.webp',
  'wec-51':      'ferrari-af-corse-no51.webp',
  'wec-83':      'af-corse-no83.webp',
  'wec-17':      'genesis-magma-racing-no17.webp',
  'wec-19':      'genesis-magma-racing-no19.webp',
  'wec-93':      'peugeot-totalenergies-no93.webp',
  'wec-94':      'peugeot-totalenergies-no94.webp',
  'wec-7':       'toyota-racing-no7.webp',
  'wec-8':       'toyota-racing-no8.webp',
  // LMGT3
  'wec-gt3-23':  'heart-of-racing-team-no23.webp',
  'wec-gt3-27':  'heart-of-racing-team-no27.webp',
  'wec-gt3-32':  'team-wrt-no32.webp',
  'wec-gt3-69':  'team-wrt-no69.webp',
  'wec-gt3-33':  'tf-sport-no33.webp',
  'wec-gt3-34':  'racing-team-turkey-by-tf-no34.webp',
  'wec-gt3-21':  'vista-af-corse-no21.webp',
  'wec-gt3-54':  'vista-af-corse-no54.webp',
  'wec-gt3-77':  'proton-competition-no77.webp',
  'wec-gt3-88':  'proton-competition-no88.webp',
  'wec-gt3-78':  'akkodis-asp-team-no78.webp',
  'wec-gt3-87':  'akkodis-asp-team-no87.webp',
  'wec-gt3-10':  'garage-59-no10.webp',
  'wec-gt3-58':  'garage-59-no58.webp',
  'wec-gt3-61':  'iron-lynx-no61.webp',
  'wec-gt3-79':  'iron-lynx-no79.webp',
  'wec-gt3-91':  'manthey-dk-engineering-no91.webp',
  'wec-gt3-92':  'the-bend-manthey-no92.webp',
}

function TeamLogo({ id, naam }: { id: string; naam: string }) {
  const [err, setErr] = useState(false)
  if (err) return null
  const file = TEAM_LOGO[id]
  if (!file) return null
  return <img src={`/wec/all_team_logos/${file}`} alt={naam} onError={()=>setErr(true)}
    style={{maxWidth:'100%',maxHeight:'100%',width:'auto',height:'auto',objectFit:'contain'}}/>
}

function TeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const c  = KLASSE_KLEUR[team.klasse] ?? '#888'
  const mk = MERK_KLEUR[team.fabrikant] ?? c
  const [tab, setTab] = useState<'overzicht'|'rijders'|'auto'>('overzicht')
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key==='Escape') onClose() }
    window.addEventListener('keydown', fn); document.body.style.overflow='hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow='' }
  }, [onClose])
  const tabs = [{id:'overzicht' as const,label:'Overzicht'},{id:'rijders' as const,label:'Rijders'},{id:'auto' as const,label:'Auto'}]
  const nr = nrStr(team)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.88)'}} onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex"
        style={{background:'#0f0f0f',border:`1px solid ${c}50`,maxHeight:'90vh',minHeight:520}} onClick={e=>e.stopPropagation()}>

        {/* ── LINKER PANEEL ── */}
        <div className="relative flex-shrink-0 flex flex-col"
          style={{width:230,background:`linear-gradient(180deg,${c}20 0%,#080808 55%)`,overflowY:'auto',maxHeight:'90vh'}}>

          {/* Team logo */}
          <div className="px-4 pt-5 pb-3">
            <div className="w-full flex items-center justify-center"
              style={{height:110,background:'rgba(255,255,255,0.04)',borderRadius:12,border:`1px solid ${c}25`,padding:'12px'}}>
              <TeamLogo id={team.id} naam={team.naam}/>
            </div>
          </div>

          {/* Nummer + naam */}
          <div className="px-4 pb-2">
            <div className="font-head font-black leading-none" style={{fontSize:52,color:c}}>#{nr}</div>
            <div className="font-head font-black text-base uppercase text-white leading-tight mt-0.5">{team.naam}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-0.5 h-3 rounded-full" style={{background:mk}}/>
              <span className="font-ui text-[11px] font-bold uppercase tracking-wider" style={{color:mk}}>{team.fabrikant}</span>
            </div>
            <div className="mt-2"><KlasseBadge klasse={team.klasse}/></div>
          </div>

          {/* Auto foto */}
          <div className="mx-3 mt-2 mb-3 rounded-xl flex items-center justify-center"
            style={{background:`linear-gradient(135deg,${mk}18,rgba(255,255,255,0.02))`,border:`1px solid ${mk}35`,height:120}}>
            <img src={carSrc(team)} alt={team.carModel}
              style={{width:'100%',height:'100%',objectFit:'contain',padding:10,filter:`drop-shadow(0 4px 12px ${mk}55)`}}
              onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
          </div>

          {/* Info rijen */}
          <div className="px-4 pb-3 space-y-2">
            {[
              {icon:'🏎️',label:'Auto',   val:team.carModel.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())},
              {icon:'🏁',label:'Klasse', val:team.klasse},
              {icon:'🔢',label:'Nummer', val:`#${nr}`},
              {icon:'👥',label:'Rijders',val:`${team.drivers.length} coureurs`},
            ].map(({icon,label,val})=>(
              <div key={label} className="flex items-start gap-2">
                <span className="text-xs mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                  <div className="font-ui text-xs text-white/75">{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-5 mt-auto">
            <p className="font-ui text-[10px] text-white/35 leading-relaxed">{team.info}</p>
          </div>
        </div>

        {/* ── RECHTER PANEEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0" style={{borderBottom:`1px solid ${c}22`}}>
            <div className="flex gap-0">
              {tabs.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} className="font-ui text-xs font-bold uppercase tracking-wider px-5 py-3 transition-all"
                  style={tab===t.id?{color:c,borderBottom:`2px solid ${c}`}:{color:'rgba(255,255,255,0.3)',borderBottom:'2px solid transparent'}}>{t.label}</button>
              ))}
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-all text-sm mb-1">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* OVERZICHT */}
            {tab==='overzicht' && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/35">{team.fabrikant} · 2026</span>
                  </div>
                  <div className="rounded-xl flex items-center justify-center"
                    style={{background:`linear-gradient(135deg,${mk}14,rgba(255,255,255,0.02))`,border:`1px solid ${mk}28`,height:160}}>
                    <img src={carSrc(team)} alt={team.naam}
                      style={{width:'100%',height:'100%',objectFit:'contain',padding:16,filter:`drop-shadow(0 6px 20px ${mk}60)`}}
                      onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-0.5 rounded-full" style={{background:c}}/>
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/35">Rijders</span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {team.drivers.map(d=>(
                      <div key={d.id} className="flex flex-col items-center gap-1.5">
                        <div className="rounded-xl overflow-hidden" style={{width:76,height:95,background:'rgba(255,255,255,0.04)',border:`1px solid ${c}30`}}>
                          <img src={drvSrc(team,d)} alt={d.naam} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.06'}}/>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5"><VlagImg emoji={d.vlag} size={12}/></div>
                          <div className="font-head font-bold text-[11px] text-white leading-tight">{d.naam.split(' ').pop()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[{label:'Team',val:team.naam},{label:'Nummer',val:`#${nr}`},{label:'Fabrikant',val:team.fabrikant},
                    {label:'Klasse',val:team.klasse},{label:'Coureurs',val:String(team.drivers.length)},{label:'Seizoen',val:'2026'}]
                    .map(({label,val})=>(
                    <div key={label} className="rounded-xl p-3" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                      <div className="font-ui text-[9px] uppercase tracking-wider text-white/28 mb-1">{label}</div>
                      <div className="font-ui text-xs font-semibold text-white truncate">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RIJDERS */}
            {tab==='rijders' && (
              <div className="space-y-3">
                {team.drivers.map((d,i)=>(
                  <div key={d.id} className="flex items-center gap-0 rounded-xl overflow-hidden"
                    style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}20`}}>
                    <div className="flex-shrink-0" style={{width:90,height:110,background:`linear-gradient(135deg,${c}15,rgba(255,255,255,0.02))`}}>
                      <img src={drvSrc(team,d)} alt={d.naam} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.06'}}/>
                    </div>
                    <div className="flex-1 px-4 py-3">
                      <div className="font-ui text-xs text-white/40">{d.naam.split(' ').slice(0,-1).join(' ')}</div>
                      <div className="font-head font-black text-2xl uppercase text-white leading-tight">{d.naam.split(' ').pop()}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <VlagImg emoji={d.vlag} size={18}/>
                        <div className="w-0.5 h-3 rounded-full" style={{background:c}}/>
                        <span className="font-ui text-xs text-white/40">{d.nationaliteit}</span>
                      </div>
                    </div>
                    <div className="pr-5 font-head font-black text-5xl select-none" style={{color:c,opacity:0.15}}>{i+1}</div>
                  </div>
                ))}
              </div>
            )}

            {/* AUTO */}
            {tab==='auto' && (
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-head font-black text-2xl text-white leading-tight">
                      {team.carModel.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}
                    </div>
                    <div className="font-ui text-xs text-white/35 uppercase tracking-wider mt-0.5">2026 · {team.klasse}</div>
                  </div>
                </div>
                <div className="rounded-2xl flex items-center justify-center"
                  style={{background:`linear-gradient(135deg,${mk}16,rgba(255,255,255,0.02))`,border:`1px solid ${mk}32`,height:200}}>
                  <img src={carSrc(team)} alt={team.naam}
                    style={{width:'100%',height:'100%',objectFit:'contain',padding:20,filter:`drop-shadow(0 8px 24px ${mk}70)`}}
                    onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
                </div>
                <div className="rounded-xl p-4" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                  <p className="font-ui text-sm text-white/55 leading-relaxed">{team.info}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{label:'Fabrikant',val:team.fabrikant},{label:'Klasse',val:team.klasse},{label:'Nummer',val:`#${nr}`},{label:'Seizoen',val:'2026'}]
                    .map(({label,val})=>(
                    <div key={label} className="rounded-xl p-3 flex items-center gap-3" style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}18`}}>
                      <div className="w-0.5 h-6 rounded-full flex-shrink-0" style={{background:mk}}/>
                      <div>
                        <div className="font-ui text-[9px] uppercase tracking-wider text-white/28">{label}</div>
                        <div className="font-ui text-sm font-semibold text-white">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WEC() {
  const [geselecteerd, setGeselecteerd] = useState<Team|null>(null)
  const [filterKlasse, setFilterKlasse] = useState('Alle')
  const [zoek, setZoek] = useState('')
  const klassen = ['Alle','Hypercar','GT3 (LMGT3)']
  const gefilterd = TEAMS.filter(t =>
    (filterKlasse==='Alle'||t.klasse===filterKlasse) &&
    (!zoek||[t.naam,t.fabrikant,...t.drivers.map(d=>d.naam)].some(s=>s.toLowerCase().includes(zoek.toLowerCase())))
  )
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <div className="mb-1" style={{color:'#3b82f6'}}><span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span></div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none flex items-center gap-3">
          <span style={{color:'#3b82f6'}}>WEC</span><SeriesBadge series="wec" size="md"/>
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">World Endurance Championship · {TEAMS.length} teams</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {klassen.map(k=>{const ac=filterKlasse===k;const kl=KLASSE_KLEUR[k]??'#3b82f6';return(
          <button key={k} onClick={()=>setFilterKlasse(k)} className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all"
            style={ac?{background:(k==='Alle'?'#333':kl)+'22',borderColor:k==='Alle'?'#555':kl,color:k==='Alle'?'#aaa':kl}:{background:'transparent',borderColor:'#333',color:'#555'}}>{k}</button>
        )})}
      </div>
      <div className="mb-5">
        <div className="relative inline-block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Zoek team, fabrikant, rijder..." value={zoek} onChange={e=>setZoek(e.target.value)}
            className="font-ui text-sm pl-8 pr-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-light placeholder-brand-muted focus:outline-none w-72"/>
        </div>
      </div>
      {(['Hypercar','GT3 (LMGT3)'] as const).map(klasse=>{
        const teams=gefilterd.filter(t=>t.klasse===klasse);if(!teams.length)return null;const kl=KLASSE_KLEUR[klasse]
        return(
          <div key={klasse} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-full" style={{background:kl}}/><h2 className="font-head font-black text-xl uppercase tracking-wide" style={{color:kl}}>{klasse}</h2>
              <div className="flex-1 h-px bg-brand-border"/><span className="font-ui text-xs text-brand-muted">{teams.length} teams</span>
            </div>
            <div className="rounded-xl overflow-hidden" style={{background:'#111',border:'1px solid #1e1e1e'}}>
              <div className="flex items-center" style={{background:'#0a0a0a',borderBottom:'1px solid #222'}}>
                <div style={{width:80}}/><div style={{width:88}}/>
                <div className="flex-1 px-5 py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Team</span></div>
                <div className="py-3" style={{width:300}}><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Auto</span></div>
              </div>
              {teams.map((t,i)=><TeamRij key={t.id} team={t} isEven={i%2===0} onKlik={()=>setGeselecteerd(t)}/>)}
            </div>
          </div>
        )
      })}
      {gefilterd.length===0&&<div className="py-16 text-center font-ui text-sm text-white/30">Geen teams gevonden.</div>}
      {geselecteerd&&<TeamModal team={geselecteerd} onClose={()=>setGeselecteerd(null)}/>}
    </div>
  )
}
