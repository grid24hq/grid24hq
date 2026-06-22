// ─── European Le Mans Series 2026 ─────────────────────────────────────────────
import { useState, useEffect } from 'react'
import SeriesBadge from '@/components/SeriesBadge'

interface Driver { id: string; naam: string; nationaliteit: string; vlag: string }
interface Team { id: string; nr: number; naam: string; fabrikant: string; carModel: string; klasse: 'LMP2' | 'LMGT3' | 'LMP3'; kleur: string; info: string; drivers: Driver[] }

const KLASSE_KLEUR: Record<string,string> = { 'LMP2':'#f97316', 'LMGT3':'#22c55e', 'LMP3':'#a855f7' }
const KLASSE_MAP:  Record<string,string> = { 'LMP2':'lmp2', 'LMGT3':'lmgt3', 'LMP3':'lmp3' }

function nrStr(nr: number) { return String(nr) }
function carSrc(t: Team)   { return `/wec/europeanlemansseries/${KLASSE_MAP[t.klasse]}/cars/2026-elms-${t.nr}-${t.carModel}.webp` }
function drvSrc(t: Team, d: Driver) { return `/wec/europeanlemansseries/${KLASSE_MAP[t.klasse]}/drivers/2026-elms-${t.nr}-${d.id}.webp` }

const VLAG_CODES: Record<string,string> = {
  '🇯🇵':'jp','🇬🇧':'gb','🇳🇱':'nl','🇨🇭':'ch','🇳🇿':'nz','🇪🇸':'es','🇩🇰':'dk','🇧🇪':'be','🇩🇪':'de',
  '🇫🇷':'fr','🇮🇹':'it','🇵🇹':'pt','🇦🇹':'at','🇲🇨':'mc','🇧🇷':'br','🇺🇸':'us','🇵🇱':'pl','🇨🇳':'cn',
  '🇿🇦':'za','🇦🇺':'au','🇸🇪':'se','🇹🇷':'tr','🇷🇴':'ro','🇦🇷':'ar','🇬🇷':'gr','🇮🇪':'ie','🇧🇬':'bg',
  '🇷🇺':'ru','🇰🇷':'kr','🇲🇽':'mx','🇨🇦':'ca','🏴󠁧󠁢󠁳󠁣󠁴󠁿':'gb',
}
function VlagImg({ emoji, size=18 }: { emoji:string; size?:number }) {
  const code = VLAG_CODES[emoji]
  if (!code) return <span style={{fontSize:size*0.7}}>{emoji}</span>
  return <img src={`/wec/flags/${code}.webp`} alt={code} width={Math.round(size*4/3)} height={size} className="inline-block object-cover rounded-sm flex-shrink-0" style={{height:size}} onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />
}

function KlasseBadge({ klasse }: { klasse:string }) {
  const c = KLASSE_KLEUR[klasse]??'#888'
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-ui font-bold uppercase tracking-widest" style={{background:`${c}22`,color:c,border:`1px solid ${c}44`}}>{klasse}</span>
}

const TEAMS: Team[] = [
  // ── LMP2 ──
  { id:'elms-10', nr:10, naam:'Nielsen Racing',         fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff0000', info:'Oreca 07 Gibson — Nielsen Racing in ELMS LMP2.',
    drivers:[{id:'pietro-fittipaldi',naam:'Pietro Fittipaldi',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'ryan-cullen',naam:'Ryan Cullen',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'vladislav-lomko',naam:'Vladislav Lomko',nationaliteit:'Rusland',vlag:'🇷🇺'}] },
  { id:'elms-14', nr:14, naam:'Inter Europol Competition', fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#0057a8', info:'Oreca 07 Gibson — Inter Europol Competition.',
    drivers:[{id:'sami-meguetounif',naam:'Sami Meguetounif',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'scott-huffaker',naam:'Scott Huffaker',nationaliteit:'VS',vlag:'🇺🇸'},{id:'steven-thomas',naam:'Steven Thomas',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'elms-18', nr:18, naam:'IDEC Sport',             fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#004080', info:'Oreca 07 Gibson — IDEC Sport.',
    drivers:[{id:'jamie-chadwick',naam:'Jamie Chadwick',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'laurents-horr',naam:'Laurents Hörr',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'valerio-rinicella',naam:'Valerio Rinicella',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'elms-19', nr:19, naam:'Cool Racing',            fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#00aaff', info:'Oreca 07 Gibson — Cool Racing.',
    drivers:[{id:'john-falb',naam:'John Falb',nationaliteit:'VS',vlag:'🇺🇸'},{id:'manuel-espirito-santo',naam:'Manuel Espírito Santo',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'rik-koen',naam:'Rik Koen',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'elms-20', nr:20, naam:'Racing Team Turkey',     fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#e30a17', info:'Oreca 07 Gibson — Racing Team Turkey.',
    drivers:[{id:'enzo-trulli',naam:'Enzo Trulli',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'malthe-jakobsen',naam:'Malthe Jakobsen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'michael-jensen',naam:'Michael Jensen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'elms-21', nr:21, naam:'DragonSpeed',            fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#cc0000', info:'Oreca 07 Gibson — DragonSpeed.',
    drivers:[{id:'daniel-schneider',naam:'Daniel Schneider',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'marino-sato',naam:'Marino Sato',nationaliteit:'Japan',vlag:'🇯🇵'},{id:'oliver-jarvis',naam:'Oliver Jarvis',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'elms-22', nr:22, naam:'United Autosports',      fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff6600', info:'Oreca 07 Gibson — United Autosports.',
    drivers:[{id:'benjamin-hanley',naam:'Benjamin Hanley',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'gregoire-saucy',naam:'Grégoire Saucy',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'griffin-peebles',naam:'Griffin Peebles',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'elms-24', nr:24, naam:'Nielsen Racing',         fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff0000', info:'Oreca 07 Gibson — Nielsen Racing #24.',
    drivers:[{id:'edward-pearson',naam:'Edward Pearson',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'jack-doohan',naam:'Jack Doohan',nationaliteit:'Australië',vlag:'🇦🇺'},{id:'roy-nissany',naam:'Roy Nissany',nationaliteit:'Israël',vlag:'🇮🇱'}] },
  { id:'elms-25', nr:25, naam:'COOL Racing',            fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#00aaff', info:'Oreca 07 Gibson — Cool Racing #25.',
    drivers:[{id:'jake-hugues',naam:'Jake Hughes',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'matthias-kaiser',naam:'Matthias Kaiser',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'tristan-vautier',naam:'Tristan Vautier',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-27', nr:27, naam:'CD Sport',               fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#888888', info:'Oreca 07 Gibson — CD Sport.',
    drivers:[{id:'alex-quinn',naam:'Alex Quinn',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'james-allen',naam:'James Allen',nationaliteit:'Australië',vlag:'🇦🇺'},{id:'kriton-lentoudis',naam:'Kriton Lentoudis',nationaliteit:'Griekenland',vlag:'🇬🇷'}] },
  { id:'elms-28', nr:28, naam:'JOTA Sport',             fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#003087', info:'Oreca 07 Gibson — JOTA Sport.',
    drivers:[{id:'job-van-uitert',naam:'Job van Uitert',nationaliteit:'Nederland',vlag:'🇳🇱'},{id:'paul-lafargue',naam:'Paul Lafargue',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'paul-loup-chatin',naam:'Paul-Loup Chatin',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-29', nr:29, naam:'Racing Team India',      fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff9933', info:'Oreca 07 Gibson — Racing Team India.',
    drivers:[{id:'esteban-masson',naam:'Esteban Masson',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'louis-rousset',naam:'Louis Rousset',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'oliver-gray',naam:'Oliver Gray',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'elms-3', nr:3, naam:'DKR Engineering',          fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#666666', info:'Oreca 07 Gibson — DKR Engineering.',
    drivers:[{id:'jean-glorieux',naam:'Jean Glorieux',nationaliteit:'België',vlag:'🇧🇪'},{id:'marlon-hernandez',naam:'Marlon Hernandez',nationaliteit:'Mexico',vlag:'🇲🇽'},{id:'sebastian-alvarez',naam:'Sebastian Alvarez',nationaliteit:'Mexico',vlag:'🇲🇽'}] },
  { id:'elms-30', nr:30, naam:'Duqueine Team',          fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#cc0000', info:'Oreca 07 Gibson — Duqueine Team.',
    drivers:[{id:'doriane-pin',naam:'Doriane Pin',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'giorgio-roda',naam:'Giorgio Roda',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'richard-verschoor',naam:'Richard Verschoor',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'elms-34', nr:34, naam:'Inter Europol Competition', fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#0057a8', info:'Oreca 07 Gibson — Inter Europol Competition #34.',
    drivers:[{id:'bijoy-garg',naam:'Bijoy Garg',nationaliteit:'VS',vlag:'🇺🇸'},{id:'reshad-de-gerus',naam:'Reshad de Gerus',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-37', nr:37, naam:'ARC Bratislava',         fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#005bbb', info:'Oreca 07 Gibson — ARC Bratislava.',
    drivers:[{id:'adrien-closmenil',naam:'Adrien Closménil',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'ian-aguilera',naam:'Ian Aguilera',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'theodor-jensen',naam:'Theodor Jensen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'elms-43', nr:43, naam:'Inter Europol Competition', fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#0057a8', info:'Oreca 07 Gibson — Inter Europol Competition #43.',
    drivers:[{id:'jakub-smiechowski',naam:'Jakub Śmiechowski',nationaliteit:'Polen',vlag:'🇵🇱'},{id:'nicholas-yelloly',naam:'Nicholas Yelloly',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'tom-dillmann',naam:'Tom Dillmann',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-47', nr:47, naam:'Algarve Pro Racing',     fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#003366', info:'Oreca 07 Gibson — Algarve Pro Racing.',
    drivers:[{id:'charles-milesi',naam:'Charles Milesi',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'felipe-fraga',naam:'Felipe Fraga',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'georgios-kolovos',naam:'Georgios Kolovos',nationaliteit:'Griekenland',vlag:'🇬🇷'}] },
  { id:'elms-7', nr:7, naam:'Nielsen Racing',           fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff0000', info:'Oreca 07 Gibson — Nielsen Racing #7.',
    drivers:[{id:'cem-bolukbasi',naam:'Cem Bölükbaşı',nationaliteit:'Turkije',vlag:'🇹🇷'},{id:'jens-reno-moller',naam:'Jens Reno Møller',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'lorenzo-fluxa',naam:'Lorenzo Fluxá',nationaliteit:'Spanje',vlag:'🇪🇸'}] },
  { id:'elms-83', nr:83, naam:'AF Corse',               fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#e8002d', info:'Oreca 07 Gibson — AF Corse.',
    drivers:[{id:'antonio-fuoco',naam:'Antonio Fuoco',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'francois-perrodo',naam:'François Perrodo',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'matthieu-vaxiviere',naam:'Matthieu Vaxivière',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-88', nr:88, naam:'Felbermayr Proton Racing', fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#c0a060', info:'Oreca 07 Gibson — Felbermayr Proton Racing.',
    drivers:[{id:'horst-felbermayr',naam:'Horst Felbermayr',nationaliteit:'Oostenrijk',vlag:'🇦🇹'},{id:'horst-felix-felbermayr',naam:'Horst Felix Felbermayr',nationaliteit:'Oostenrijk',vlag:'🇦🇹'},{id:'rene-binder',naam:'René Binder',nationaliteit:'Oostenrijk',vlag:'🇦🇹'}] },
  { id:'elms-9', nr:9, naam:'Proton Competition',       fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#003e99', info:'Oreca 07 Gibson — Proton Competition.',
    drivers:[{id:'jonas-ried',naam:'Jonas Ried',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'mike-rockenfeller',naam:'Mike Rockenfeller',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'sebastian-priaulx',naam:'Sebastian Priaulx',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'elms-99', nr:99, naam:'Prema Racing',           fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff0000', info:'Oreca 07 Gibson — Prema Racing.',
    drivers:[{id:'dane-cameron',naam:'Dane Cameron',nationaliteit:'VS',vlag:'🇺🇸'},{id:'louis-deletraz',naam:'Louis Delétraz',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'pj-hyett',naam:'PJ Hyett',nationaliteit:'VS',vlag:'🇺🇸'}] },
  // ── LMGT3 ──
  { id:'elms-23', nr:23, naam:'United Autosports',      fabrikant:'McLaren', carModel:'mclaren-720s- LMGT3 Evo', klasse:'LMGT3', kleur:'#ff6600', info:'McLaren 720S LMGT3 Evo — United Autosports.',
    drivers:[{id:'garnet-patterson',naam:'Garnet Patterson',nationaliteit:'Canada',vlag:'🇨🇦'},{id:'michael-birch',naam:'Michael Birch',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'wayne-boyd',naam:'Wayne Boyd',nationaliteit:'N. Ierland',vlag:'🇬🇧'}] },
  { id:'elms-33', nr:33, naam:'Corvette Racing',        fabrikant:'Corvette', carModel:'corvette-z06- LMGT3.R', klasse:'LMGT3', kleur:'#ffcc00', info:'Corvette Z06 LMGT3.R — Corvette Racing.',
    drivers:[{id:'alec-udell',naam:'Alec Udell',nationaliteit:'VS',vlag:'🇺🇸'},{id:'blake-mcdonald',naam:'Blake McDonald',nationaliteit:'VS',vlag:'🇺🇸'},{id:'charlie-eastwood',naam:'Charlie Eastwood',nationaliteit:'Ierland',vlag:'🇮🇪'}] },
  { id:'elms-50', nr:50, naam:'Iron Lynx',              fabrikant:'Ferrari', carModel:'ferrari-296 LMGT3', klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — Iron Lynx #50.',
    drivers:[{id:'custodio-toledo',naam:'Custodio Toledo',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'lilou-wadoux',naam:'Lilou Wadoux',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'riccardo-agostini',naam:'Riccardo Agostini',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'elms-51', nr:51, naam:'AF Corse',               fabrikant:'Ferrari', carModel:'ferrari-296 LMGT3', klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — AF Corse.',
    drivers:[{id:'charles-henri-samani',naam:'Charles-Henri Samani',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'conrad-laursen',naam:'Conrad Laursen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'davide-rigon',naam:'Davide Rigon',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'elms-54', nr:54, naam:'Dinamic GT',             fabrikant:'Porsche', carModel:'porsche-911-GT3 R LMGT3', klasse:'LMGT3', kleur:'#c0a060', info:'Porsche 911 GT3 R LMGT3 — Dinamic GT.',
    drivers:[{id:'anders-fjordbach',naam:'Anders Fjordbach',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'dennis-andersen',naam:'Dennis Andersen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'laurin-heinrich',naam:'Laurin Heinrich',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  { id:'elms-55', nr:55, naam:'Spirit of Race',         fabrikant:'Ferrari', carModel:'ferrari-296 lmgt3', klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — Spirit of Race.',
    drivers:[{id:'david-perel',naam:'David Perel',nationaliteit:'Z. Afrika',vlag:'🇿🇦'},{id:'duncan-cameron',naam:'Duncan Cameron',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'matthew-griffin',naam:'Matthew Griffin',nationaliteit:'Ierland',vlag:'🇮🇪'}] },
  { id:'elms-57', nr:57, naam:'Kessel Racing',          fabrikant:'Ferrari', carModel:'ferrari-296-LMGT3', klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — Kessel Racing.',
    drivers:[{id:'daniel-serra',naam:'Daniel Serra',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'mathys-jaubert',naam:'Mathys Jaubert',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'takeshi-kimura',naam:'Takeshi Kimura',nationaliteit:'Japan',vlag:'🇯🇵'}] },
  { id:'elms-59', nr:59, naam:'Garage 59',              fabrikant:'Aston Martin', carModel:'aston-martin-AMR-LMGT3', klasse:'LMGT3', kleur:'#006b5b', info:'Aston Martin AMR LMGT3 — Garage 59.',
    drivers:[{id:'clement-mateu',naam:'Clement Mateu',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'marius-fossard',naam:'Marius Fossard',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'valentin-hasse',naam:'Valentin Hasse',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-62', nr:62, naam:'Akkodis ASP',            fabrikant:'Mercedes', carModel:'mercedes-AMG LMGT3', klasse:'LMGT3', kleur:'#00d2be', info:'Mercedes-AMG LMGT3 — Akkodis ASP #62.',
    drivers:[{id:'abdulla-ali-al-khelaifi',naam:'Abdulla Al Khelaifi',nationaliteit:'Qatar',vlag:'🇶🇦'},{id:'adam-christodoulou',naam:'Adam Christodoulou',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'julian-hanses',naam:'Julian Hanses',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  { id:'elms-63', nr:63, naam:'Akkodis ASP',            fabrikant:'Mercedes', carModel:'mercedes-AMG LMGT3', klasse:'LMGT3', kleur:'#00d2be', info:'Mercedes-AMG LMGT3 — Akkodis ASP #63.',
    drivers:[{id:'ameerh-naran',naam:'Ameerh Naran',nationaliteit:'Z. Afrika',vlag:'🇿🇦'},{id:'rui-andrade',naam:'Rui Andrade',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'sergio-sette-camara',naam:'Sergio Sette Câmara',nationaliteit:'Brazilië',vlag:'🇧🇷'}] },
  { id:'elms-74', nr:74, naam:'Iron Dames',             fabrikant:'Ferrari', carModel:'ferrari-296 lmgt3', klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — Iron Dames.',
    drivers:[{id:'andrew-gilbert',naam:'Andrew Gilbert',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'fran-rueda',naam:'Fran Rueda',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'romain-leroux',naam:'Romain Leroux',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-75', nr:75, naam:'Iron Lynx',              fabrikant:'Porsche', carModel:'porsche-911-GT3 R LMGT3', klasse:'LMGT3', kleur:'#c0a060', info:'Porsche 911 GT3 R LMGT3 — Iron Lynx #75.',
    drivers:[{id:'matt-kurzejewski',naam:'Matt Kurzejewski',nationaliteit:'VS',vlag:'🇺🇸'},{id:'richard-lietz',naam:'Richard Lietz',nationaliteit:'Oostenrijk',vlag:'🇦🇹'},{id:'thomas-sargent',naam:'Thomas Sargent',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'elms-77', nr:77, naam:'Racing Spirit of Leman', fabrikant:'Porsche', carModel:'porsche-911-GT3 R LMGT3', klasse:'LMGT3', kleur:'#c0a060', info:'Porsche 911 GT3 R LMGT3 — Racing Spirit of Leman.',
    drivers:[{id:'bankcy',naam:'Bankcy',nationaliteit:'Nederland',vlag:'🇳🇱'},{id:'harry-king',naam:'Harry King',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'huub-van-eijndhoven',naam:'Huub van Eijndhoven',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'elms-86', nr:86, naam:'GR Racing',              fabrikant:'Ferrari', carModel:'ferrari-296 LMGT3', klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — GR Racing.',
    drivers:[{id:'lorcan-hanafin',naam:'Lorcan Hanafin',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'mex-jansen',naam:'Mex Jansen',nationaliteit:'Nederland',vlag:'🇳🇱'},{id:'michael-wainwright',naam:'Michael Wainwright',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  // ── LMP3 ──
  { id:'elms-11', nr:11, naam:'V de V Motorsports',     fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#a855f7', info:'Ligier JS P325 — V de V Motorsports.',
    drivers:[{id:'douwe-dedecker',naam:'Douwe Dedecker',nationaliteit:'België',vlag:'🇧🇪'},{id:'matthew-richard-bell',naam:'Matthew Bell',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'max-van-der-snel',naam:'Max van der Snel',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'elms-13', nr:13, naam:'Inter Europol Competition', fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#0057a8', info:'Ligier JS P325 — Inter Europol Competition #13.',
    drivers:[{id:'alexander-bukhantsov',naam:'Alexander Bukhantsov',nationaliteit:'Bulgarije',vlag:'🇧🇬'},{id:'chun-ting-chou',naam:'Chun-Ting Chou',nationaliteit:'Taiwan',vlag:'🇹🇼'},{id:'henry-cubides-olarte',naam:'Henry Cubides Olarte',nationaliteit:'Colombia',vlag:'🇨🇴'}] },
  { id:'elms-17', nr:17, naam:'CD Sport',               fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#888888', info:'Ligier JS P325 — CD Sport #17.',
    drivers:[{id:'alexander-jacoby',naam:'Alexander Jacoby',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'bruno-ribeiro',naam:'Bruno Ribeiro',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'paul-lanchere',naam:'Paul Lanchère',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-31', nr:31, naam:'TF Sport',               fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#004080', info:'Ligier JS P325 — TF Sport.',
    drivers:[{id:'gregory-de-sybourg',naam:'Gregory de Sybourg',nationaliteit:'België',vlag:'🇧🇪'},{id:'lenny-ried',naam:'Lenny Ried',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'ralph-meichtry',naam:'Ralph Meichtry',nationaliteit:'Zwitserland',vlag:'🇨🇭'}] },
  { id:'elms-35', nr:35, naam:'RLR MSport',             fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#c0a060', info:'Ligier JS P325 — RLR MSport.',
    drivers:[{id:'lucas-fecury',naam:'Lucas Fecury',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'sebastian-gravlund',naam:'Sebastian Gravlund',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'terrence-woodward',naam:'Terrence Woodward',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'elms-4', nr:4, naam:'DKR Engineering',          fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#666666', info:'Ligier JS P325 — DKR Engineering #4.',
    drivers:[{id:'antti-rammo',naam:'Antti Rammo',nationaliteit:'Finland',vlag:'🇫🇮'},{id:'romain-favre',naam:'Romain Favre',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'wyatt-brichacek',naam:'Wyatt Brichacek',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'elms-5', nr:5, naam:'MV2S Racing',              fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#003366', info:'Ligier JS P325 — MV2S Racing.',
    drivers:[{id:'alvise-rodella',naam:'Alvise Rodella',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'jose-fernandes-cautela',naam:'José Fernandes Cautela',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'mikkel-gaarde-pedersen',naam:'Mikkel Gaarde Pedersen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'elms-68', nr:68, naam:'Graff Racing',           fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#cc0000', info:'Ligier JS P325 — Graff Racing.',
    drivers:[{id:'nick-adcock',naam:'Nick Adcock',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'quentin-antonel',naam:'Quentin Antonel',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'thomas-imbourg',naam:'Thomas Imbourg',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'elms-8', nr:8, naam:'Nielsen Racing',           fabrikant:'Ligier', carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#ff0000', info:'Ligier JS P325 — Nielsen Racing #8.',
    drivers:[{id:'daniel-nogales',naam:'Daniel Nogales',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'louis-stern',naam:'Louis Stern',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'matteo-quintarelli',naam:'Matteo Quintarelli',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'elms-85', nr:85, naam:'RLR MSport',             fabrikant:'Duqueine', carModel:'duqueine-D09', klasse:'LMP3', kleur:'#c0a060', info:'Duqueine D09 — RLR MSport #85.',
    drivers:[{id:'fabien-michal',naam:'Fabien Michal',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'hugo-schwarze',naam:'Hugo Schwarze',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'pierre-alexandre-provost',naam:'Pierre-Alexandre Provost',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
]

function TeamRij({ team, onClick }: { team:Team; onClick:()=>void }) {
  const c = KLASSE_KLEUR[team.klasse]??'#888'
  return (
    <button onClick={onClick} className="w-full text-left group flex items-center hover:bg-white/[0.03] transition-colors border-b border-brand-border/40 last:border-0 cursor-pointer min-h-[88px]">
      <div className="w-0.5 self-stretch flex-shrink-0" style={{background:c}} />
      <div className="w-20 flex-shrink-0 flex items-center justify-center">
        <span className="font-head text-2xl font-black text-brand-orange">#{nrStr(team.nr)}</span>
      </div>
      <div className="w-52 flex-shrink-0 px-3 hidden sm:block">
        <div className="overflow-hidden rounded-md flex items-center justify-center" style={{background:'#0d0d0d',height:'68px'}}>
          <img src={carSrc(team)} alt={team.carModel} className="w-full h-full object-contain p-1" onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.15'}} />
        </div>
      </div>
      <div className="w-64 flex-shrink-0 px-4">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-head font-bold text-sm text-brand-light group-hover:text-white transition-colors">{team.naam}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-ui font-bold uppercase tracking-widest" style={{background:`${c}22`,color:c,border:`1px solid ${c}44`}}>{team.klasse}</span>
        </div>
        <span className="font-ui text-xs text-brand-muted">{team.fabrikant}</span>
      </div>
      <div className="flex-1 flex items-center gap-4 px-4 hidden md:flex flex-wrap">
        {team.drivers.map(d => (
          <span key={d.id} className="font-ui text-sm text-brand-muted whitespace-nowrap flex items-center gap-1">
            <VlagImg emoji={d.vlag} /> {d.naam}
          </span>
        ))}
      </div>
      <div className="px-5 text-brand-muted group-hover:text-brand-orange transition-colors flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </button>
  )
}

function TeamModal({ team, onClose }: { team:Team; onClose:()=>void }) {
  const c = KLASSE_KLEUR[team.klasse]??'#888'
  const [tab, setTab] = useState<'overzicht'|'rijders'|'auto'>('overzicht')

  useEffect(() => {
    const fn = (e:KeyboardEvent) => { if(e.key==='Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose])

  const tabs = [
    { id: 'overzicht' as const, label: 'Overzicht' },
    { id: 'rijders'   as const, label: 'Rijders' },
    { id: 'auto'      as const, label: 'Auto' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{background:'rgba(0,0,0,0.88)'}} onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex"
        style={{background:'#0f0f0f', border:`1px solid ${c}50`, maxHeight:'90vh', minHeight:500}}
        onClick={e=>e.stopPropagation()}>

        {/* ── LINKER PANEEL ── */}
        <div className="relative flex-shrink-0 flex flex-col"
          style={{width:240, background:`linear-gradient(180deg,${c}22 0%,#0a0a0a 60%)`, overflowY:'auto', maxHeight:'90vh'}}>

          <div className="px-5 pt-5 pb-1">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[2px]" style={{color:c}}>{team.klasse}</span>
          </div>
          <div className="px-5 pb-2">
            <div className="font-head font-black text-5xl leading-none" style={{color:c}}>#{nrStr(team.nr)}</div>
            <div className="font-head font-black text-lg uppercase text-white mt-1 leading-tight">{team.naam}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-0.5 h-3 rounded-full" style={{background:c}} />
              <span className="font-ui text-xs font-bold uppercase" style={{color:c}}>{team.fabrikant}</span>
            </div>
            <div className="mt-2">
              <KlasseBadge klasse={team.klasse} />
            </div>
          </div>

          {/* Auto links */}
          <div className="mx-3 my-3 rounded-xl flex items-center justify-center"
            style={{background:`linear-gradient(135deg,${c}15,rgba(255,255,255,0.02))`, border:`1px solid ${c}30`, height:140}}>
            <img src={carSrc(team)} alt={team.carModel}
              style={{width:'100%',height:'100%',objectFit:'contain',padding:12,filter:`drop-shadow(0 4px 16px ${c}50)`}}
              onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}} />
          </div>

          {/* Info */}
          <div className="px-4 py-3 space-y-2.5">
            {[
              {icon:'🏎️', label:'Auto',    val:team.carModel.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())},
              {icon:'🏁', label:'Klasse',  val:team.klasse},
              {icon:'🔢', label:'Nummer',  val:`#${nrStr(team.nr)}`},
              {icon:'👥', label:'Rijders', val:`${team.drivers.length} coureurs`},
            ].map(({icon,label,val})=>(
              <div key={label} className="flex items-start gap-2">
                <span className="text-xs mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                  <div className="font-ui text-xs text-white/80">{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-5">
            <p className="font-ui text-[11px] text-white/40 leading-relaxed">{team.info}</p>
          </div>
        </div>

        {/* ── RECHTER PANEEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tabs + sluit */}
          <div className="flex items-center justify-between px-6 pt-5 flex-shrink-0"
            style={{borderBottom:`1px solid ${c}25`}}>
            <div className="flex gap-1">
              {tabs.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all"
                  style={tab===t.id
                    ?{color:c,borderBottom:`2px solid ${c}`}
                    :{color:'rgba(255,255,255,0.35)',borderBottom:'2px solid transparent'}}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm mb-1">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* OVERZICHT */}
            {tab==='overzicht' && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {label:'Team',     val:team.naam},
                    {label:'Nummer',   val:`#${nrStr(team.nr)}`},
                    {label:'Fabrikant',val:team.fabrikant},
                    {label:'Klasse',   val:team.klasse},
                    {label:'Auto',     val:team.carModel.split('-').slice(-2).join(' ').toUpperCase()},
                    {label:'Coureurs', val:String(team.drivers.length)},
                  ].map(({label,val})=>(
                    <div key={label} className="rounded-xl p-3"
                      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                      <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mb-1">{label}</div>
                      <div className="font-ui text-sm font-semibold text-white truncate">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Auto groot */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-0.5 rounded-full" style={{background:c}} />
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">{team.fabrikant} · 2026 ELMS</span>
                  </div>
                  <div className="rounded-xl flex items-center justify-center p-4"
                    style={{background:`linear-gradient(135deg,${c}12,rgba(255,255,255,0.02))`,border:`1px solid ${c}25`,height:150}}>
                    <img src={carSrc(team)} alt={team.naam}
                      style={{width:'100%',height:'100%',objectFit:'contain',filter:`drop-shadow(0 6px 20px ${c}60)`}}
                      onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}} />
                  </div>
                </div>

                {/* Rijders mini */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-0.5 rounded-full" style={{background:c}} />
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">Rijders</span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {team.drivers.map(d=>(
                      <div key={d.id} className="flex flex-col items-center gap-1.5">
                        <div className="rounded-xl overflow-hidden"
                          style={{width:72,height:90,background:'rgba(255,255,255,0.04)',border:`1px solid ${c}30`}}>
                          <img src={drvSrc(team,d)} alt={d.naam}
                            style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center'}}
                            onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}} />
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5"><VlagImg emoji={d.vlag} size={12} /></div>
                          <div className="font-head font-bold text-[11px] text-white leading-tight">{d.naam.split(' ').pop()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RIJDERS */}
            {tab==='rijders' && (
              <div className="space-y-3">
                {team.drivers.map(d=>(
                  <div key={d.id} className="flex items-center gap-4 rounded-xl p-3"
                    style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}20`}}>
                    <div className="flex-shrink-0 rounded-xl overflow-hidden"
                      style={{width:76,height:95,background:'rgba(255,255,255,0.03)'}}>
                      <img src={drvSrc(team,d)} alt={d.naam}
                        style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center'}}
                        onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}} />
                    </div>
                    <div className="flex-1">
                      <div className="font-ui text-sm text-white/50">{d.naam.split(' ').slice(0,-1).join(' ')}</div>
                      <div className="font-head font-black text-2xl uppercase text-white leading-tight">{d.naam.split(' ').pop()}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <VlagImg emoji={d.vlag} size={18} />
                        <div className="w-0.5 h-3 rounded-full" style={{background:c}} />
                        <span className="font-ui text-xs text-white/40">{d.nationaliteit}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-4xl opacity-20 select-none">{d.vlag}</div>
                  </div>
                ))}
              </div>
            )}

            {/* AUTO */}
            {tab==='auto' && (
              <div className="space-y-5">
                <div>
                  <div className="font-head font-black text-2xl text-white mb-0.5">
                    {team.carModel.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}
                  </div>
                  <div className="font-ui text-xs text-white/40 uppercase tracking-wider">2026 · {team.klasse}</div>
                </div>
                <div className="rounded-2xl flex items-center justify-center p-6"
                  style={{background:`linear-gradient(135deg,${c}15,rgba(255,255,255,0.02))`,border:`1px solid ${c}30`,height:190}}>
                  <img src={carSrc(team)} alt={team.naam}
                    style={{width:'100%',height:'100%',objectFit:'contain',filter:`drop-shadow(0 8px 24px ${c}70)`}}
                    onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {icon:'🏎️',label:'Model',    val:team.carModel.split('-').slice(-2).join(' ').toUpperCase()},
                    {icon:'🏗️',label:'Fabrikant',val:team.fabrikant},
                    {icon:'🏁',label:'Klasse',   val:team.klasse},
                    {icon:'🔢',label:'Nummer',   val:`#${nrStr(team.nr)}`},
                  ].map(({icon,label,val})=>(
                    <div key={label} className="rounded-xl p-3 flex items-center gap-3"
                      style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                      <span className="text-lg">{icon}</span>
                      <div>
                        <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                        <div className="font-ui text-sm font-semibold text-white">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                  <p className="font-ui text-sm text-white/60 leading-relaxed">{team.info}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ELMS() {
  const [geselecteerd, setGeselecteerd] = useState<Team|null>(null)
  const [filter, setFilter] = useState('Alle')
  const [zoek, setZoek] = useState('')
  const klassen = ['Alle','LMP2','LMGT3','LMP3']
  const gefilterd = TEAMS.filter(t => (filter==='Alle'||t.klasse===filter) && (!zoek||[t.naam,t.fabrikant,...t.drivers.map(d=>d.naam)].some(s=>s.toLowerCase().includes(zoek.toLowerCase()))))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="relative mb-8 overflow-hidden rounded-xl bg-brand-card border border-brand-border">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-40 pointer-events-none" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-head font-black text-3xl sm:text-4xl uppercase tracking-wide leading-none">European Le Mans Series</h1>
              <SeriesBadge series="elms" size="md" />
            </div>
            <p className="font-ui text-sm text-brand-muted">ELMS 2026 · LMP2 · LMGT3 · LMP3</p>
          </div>
          <div className="flex gap-6">
            {[{l:'Teams',v:TEAMS.length},{l:'Rijders',v:TEAMS.reduce((s,t)=>s+t.drivers.length,0)}].map(s=>(
              <div key={s.l} className="text-center">
                <div className="font-head text-3xl font-black text-brand-orange">{s.v}</div>
                <div className="font-ui text-xs text-brand-muted uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Zoek team of rijder…" value={zoek} onChange={e=>setZoek(e.target.value)} className="w-full bg-brand-card border border-brand-border rounded-lg pl-8 pr-4 py-2 font-ui text-sm text-brand-light placeholder:text-brand-muted focus:outline-none focus:border-brand-orange/50 transition-colors" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {klassen.map(k=>(
            <button key={k} onClick={()=>setFilter(k)}
              className={`px-3 py-2 rounded-lg font-ui text-xs font-semibold uppercase tracking-wider border transition-all duration-200 ${filter===k?'text-white border-transparent':'text-brand-muted border-brand-border hover:border-brand-border/80'}`}
              style={filter===k&&k!=='Alle'?{background:KLASSE_KLEUR[k],borderColor:KLASSE_KLEUR[k]}:filter===k?{background:'#333',borderColor:'#444'}:{}}>
              {k}
            </button>
          ))}
        </div>
      </div>
      {(['LMP2','LMGT3','LMP3'] as const).map(klasse => {
        const teams = gefilterd.filter(t=>t.klasse===klasse)
        if(teams.length===0) return null
        const kl = KLASSE_KLEUR[klasse]
        return (
          <div key={klasse} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-full" style={{background:kl}}/>
              <h2 className="font-head font-black text-xl uppercase tracking-wide" style={{color:kl}}>{klasse}</h2>
              <div className="flex-1 h-px bg-brand-border"/>
              <span className="font-ui text-xs text-brand-muted">{teams.length} teams</span>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
              {teams.map(team=><TeamRij key={team.id} team={team} onClick={()=>setGeselecteerd(team)}/>)}
            </div>
          </div>
        )
      })}
      {gefilterd.length===0&&<div className="text-center py-16 text-brand-muted"><p className="font-head text-xl">Geen teams gevonden</p></div>}
      {geselecteerd&&<TeamModal team={geselecteerd} onClose={()=>setGeselecteerd(null)}/>}
    </div>
  )
}
