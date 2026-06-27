// ─── ELMS 2026 — 100% gebaseerd op echte bestandsnamen ────────────────────────
import { useState, useEffect } from 'react'
import SeriesBadge from '@/components/SeriesBadge'

interface Driver { id: string; naam: string; nationaliteit: string; vlag: string }
interface Team { id: string; nr: number; naam: string; fabrikant: string; carModel: string; klasse: 'LMP2'|'LMP2 Pro/Am'|'LMGT3'|'LMP3'; kleur: string; info: string; drivers: Driver[] }

const KLASSE_KLEUR: Record<string,string> = { 'LMP2':'#f97316','LMP2 Pro/Am':'#fb923c','LMGT3':'#22c55e','LMP3':'#a855f7' }
const KLASSE_MAP:   Record<string,string> = { 'LMP2':'lmp2','LMP2 Pro/Am':'lmp2_pro_am','LMGT3':'lmgt3','LMP3':'lmp3' }
const MERK_KLEUR:   Record<string,string> = {
  Oreca:'#f97316',Ferrari:'#e8002d',McLaren:'#ff8000',Corvette:'#ffcc00',
  Porsche:'#c0a060',Mercedes:'#00d2be','Aston Martin':'#006b5b',
  Ford:'#003e99',Ligier:'#a855f7',Duqueine:'#6366f1',
}

function carSrc(t: Team)   { return `/wec/europeanlemansseries/${KLASSE_MAP[t.klasse]}/cars/2026-elms-${t.nr}-${t.carModel}.webp` }
function drvSrc(t: Team, d: Driver) { return `/wec/europeanlemansseries/${KLASSE_MAP[t.klasse]}/drivers/2026-elms-${t.nr}-${d.id}.webp` }

const VLAG_CODES: Record<string,string> = {
  '🇯🇵':'jp','🇬🇧':'gb','🇳🇱':'nl','🇨🇭':'ch','🇳🇿':'nz','🇪🇸':'es','🇩🇰':'dk','🇧🇪':'be','🇩🇪':'de',
  '🇫🇷':'fr','🇮🇹':'it','🇵🇹':'pt','🇦🇹':'at','🇲🇨':'mc','🇧🇷':'br','🇺🇸':'us','🇵🇱':'pl','🇨🇳':'cn',
  '🇿🇦':'za','🇦🇺':'au','🇸🇪':'se','🇹🇷':'tr','🇷🇴':'ro','🇦🇷':'ar','🇬🇷':'gr','🇮🇪':'ie','🇷🇺':'ru',
  '🇨🇦':'ca','🇫🇮':'fi','🇮🇱':'il','🇶🇦':'qa','🇸🇰':'sk','🇸🇬':'sg','🇳🇴':'no','🇧🇬':'bg','🇹🇼':'tw','🇨🇴':'co',
}
function VlagImg({ emoji, size=14 }: { emoji: string; size?: number }) {
  const code = VLAG_CODES[emoji]
  if (!code) return <span style={{fontSize:size*0.7}}>{emoji}</span>
  return <img src={`/wec/flags/${code}.webp`} alt={code} width={Math.round(size*4/3)} height={size}
    className="inline-block object-cover rounded-sm flex-shrink-0" style={{height:size}}
    onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
}
function KlasseBadge({ klasse }: { klasse: string }) {
  const c = KLASSE_KLEUR[klasse]??'#888'
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-ui font-bold uppercase tracking-widest"
    style={{background:`${c}22`,color:c,border:`1px solid ${c}44`}}>{klasse}</span>
}

const TEAMS: Team[] = [
  // ── LMP2 ──
  { id:'e-10', nr:10, naam:'Vector Sport',            fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff0000', info:'Oreca 07 Gibson — Nielsen Racing.',
    drivers:[{id:'pietro-fittipaldi',naam:'Pietro Fittipaldi',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'ryan-cullen',naam:'Ryan Cullen',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'vladislav-lomko',naam:'Vladislav Lomko',nationaliteit:'Rusland',vlag:'🇷🇺'}] },
  { id:'e-18', nr:18, naam:'IDEC Sport',                fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#004080', info:'Oreca 07 Gibson — IDEC Sport.',
    drivers:[{id:'jamie-chadwick',naam:'Jamie Chadwick',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'laurents-horr',naam:'Laurents Hörr',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'valerio-rinicella',naam:'Valerio Rinicella',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'e-22', nr:22, naam:'United Autosports',         fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff6600', info:'Oreca 07 Gibson — United Autosports.',
    drivers:[{id:'benjamin-hanley',naam:'Benjamin Hanley',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'gregoire-saucy',naam:'Grégoire Saucy',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'griffin-peebles',naam:'Griffin Peebles',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'e-24', nr:24, naam:'Nielsen Racing',            fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff0000', info:'Oreca 07 Gibson — Nielsen Racing #24.',
    drivers:[{id:'edward-pearson',naam:'Edward Pearson',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'jack-doohan',naam:'Jack Doohan',nationaliteit:'Australië',vlag:'🇦🇺'},{id:'roy-nissany',naam:'Roy Nissany',nationaliteit:'Israël',vlag:'🇮🇱'}] },
  { id:'e-25', nr:25, naam:'Algarve Pro Racing',               fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#00aaff', info:'Oreca 07 Gibson — Cool Racing #25.',
    drivers:[{id:'jake-hugues',naam:'Jake Hughes',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'matthias-kaiser',naam:'Matthias Kaiser',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'tristan-vautier',naam:'Tristan Vautier',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-28', nr:28, naam:'IDEC Sport',                fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#003087', info:'Oreca 07 Gibson — JOTA Sport.',
    drivers:[{id:'job-van-uitert',naam:'Job van Uitert',nationaliteit:'Nederland',vlag:'🇳🇱'},{id:'paul-lafargue',naam:'Paul Lafargue',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'paul-loup-chatin',naam:'Paul-Loup Chatin',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-29', nr:29, naam:'Forestier Racing By Panis',         fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#ff9933', info:'Oreca 07 Gibson — Racing Team India.',
    drivers:[{id:'esteban-masson',naam:'Esteban Masson',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'louis-rousset',naam:'Louis Rousset',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'oliver-gray',naam:'Oliver Gray',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'e-34', nr:34, naam:'Inter Europol Competition', fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#0057a8', info:'Oreca 07 Gibson — Inter Europol #34.',
    drivers:[{id:'bijoy-garg',naam:'Bijoy Garg',nationaliteit:'VS',vlag:'🇺🇸'},{id:'reshad-de-gerus',naam:'Reshad de Gerus',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-37', nr:37, naam:'CLX Motorsport',            fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#005bbb', info:'Oreca 07 Gibson — ARC Bratislava.',
    drivers:[{id:'adrien-closmenil',naam:'Adrien Closménil',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'ian-aguilera',naam:'Ian Aguilera',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'theodor-jensen',naam:'Theodor Jensen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'e-43', nr:43, naam:'Inter Europol Competition', fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#0057a8', info:'Oreca 07 Gibson — Inter Europol #43.',
    drivers:[{id:'jakub-smiechowski',naam:'Jakub Śmiechowski',nationaliteit:'Polen',vlag:'🇵🇱'},{id:'nicholas-yelloly',naam:'Nicholas Yelloly',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'tom-dillmann',naam:'Tom Dillmann',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-47', nr:47, naam:'Algarve Pro Racing',        fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2', kleur:'#003366', info:'Oreca 07 Gibson — Algarve Pro Racing.',
    drivers:[{id:'charles-milesi',naam:'Charles Milesi',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'felipe-fraga',naam:'Felipe Fraga',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'georgios-kolovos',naam:'Georgios Kolovos',nationaliteit:'Griekenland',vlag:'🇬🇷'}] },
  // ── LMP2 Pro/Am — exact zelfde nummers maar uit lmp2_pro_am map ──
  { id:'e-pa-14', nr:14, naam:'TDS Racing', fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#0057a8', info:'Oreca 07 Gibson — Inter Europol Pro/Am #14.',
    drivers:[{id:'sami-meguetounif',naam:'Sami Meguetounif',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'scott-huffaker',naam:'Scott Huffaker',nationaliteit:'VS',vlag:'🇺🇸'},{id:'steven-thomas',naam:'Steven Thomas',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'e-pa-19', nr:19, naam:'Rossa Racing By Virage',               fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#00aaff', info:'Oreca 07 Gibson — Cool Racing Pro/Am.',
    drivers:[{id:'john-falb',naam:'John Falb',nationaliteit:'VS',vlag:'🇺🇸'},{id:'manuel-espirito-santo',naam:'Manuel Espírito Santo',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'rik-koen',naam:'Rik Koen',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'e-pa-20', nr:20, naam:'Algarve Pro Racing',         fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#e30a17', info:'Oreca 07 Gibson — Racing Team Turkey Pro/Am.',
    drivers:[{id:'enzo-trulli',naam:'Enzo Trulli',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'malthe-jakobsen',naam:'Malthe Jakobsen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'michael-jensen',naam:'Michael Jensen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'e-pa-21', nr:21, naam:'DragonSpeed',                fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#cc0000', info:'Oreca 07 Gibson — DragonSpeed Pro/Am.',
    drivers:[{id:'daniel-schneider',naam:'Daniel Schneider',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'marino-sato',naam:'Marino Sato',nationaliteit:'Japan',vlag:'🇯🇵'},{id:'oliver-jarvis',naam:'Oliver Jarvis',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'e-pa-27', nr:27, naam:'CD Sport',                   fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#888888', info:'Oreca 07 Gibson — CD Sport Pro/Am.',
    drivers:[{id:'alex-quinn',naam:'Alex Quinn',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'james-allen',naam:'James Allen',nationaliteit:'Australië',vlag:'🇦🇺'},{id:'kriton-lentoudis',naam:'Kriton Lentoudis',nationaliteit:'Griekenland',vlag:'🇬🇷'}] },
  { id:'e-pa-3',  nr:3,  naam:'DKR Engineering',            fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#666666', info:'Oreca 07 Gibson — DKR Engineering Pro/Am.',
    drivers:[{id:'jean-glorieux',naam:'Jean Glorieux',nationaliteit:'België',vlag:'🇧🇪'},{id:'marlon-hernandez',naam:'Marlon Hernandez',nationaliteit:'Mexico',vlag:'🇲🇽'},{id:'sebastian-alvarez',naam:'Sebastian Alvarez',nationaliteit:'Mexico',vlag:'🇲🇽'}] },
  { id:'e-pa-30', nr:30, naam:'Duqueine Team',               fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#cc0000', info:'Oreca 07 Gibson — Duqueine Team Pro/Am.',
    drivers:[{id:'doriane-pin',naam:'Doriane Pin',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'giorgio-roda',naam:'Giorgio Roda',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'richard-verschoor',naam:'Richard Verschoor',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'e-pa-47', nr:47, naam:'CLX Motorsport',          fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#003366', info:'Oreca 07 Gibson — Algarve Pro Racing Pro/Am.',
    drivers:[{id:'charles-milesi',naam:'Charles Milesi',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'felipe-fraga',naam:'Felipe Fraga',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'georgios-kolovos',naam:'Georgios Kolovos',nationaliteit:'Griekenland',vlag:'🇬🇷'}] },
  { id:'e-pa-7',  nr:7,  naam:'Nielsen Racing',              fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#ff0000', info:'Oreca 07 Gibson — Nielsen Racing Pro/Am #7.',
    drivers:[{id:'cem-bolukbasi',naam:'Cem Bölükbaşı',nationaliteit:'Turkije',vlag:'🇹🇷'},{id:'jens-reno-moller',naam:'Jens Reno Møller',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'lorenzo-fluxa',naam:'Lorenzo Fluxá',nationaliteit:'Spanje',vlag:'🇪🇸'}] },
  { id:'e-pa-83', nr:83, naam:'AF Corse',                    fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#e8002d', info:'Oreca 07 Gibson — AF Corse Pro/Am.',
    drivers:[{id:'antonio-fuoco',naam:'Antonio Fuoco',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'francois-perrodo',naam:'François Perrodo',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'matthieu-vaxiviere',naam:'Matthieu Vaxivière',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-pa-88', nr:88, naam:'Felbermayr Proton Racing',    fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#c0a060', info:'Oreca 07 Gibson — Felbermayr Proton Pro/Am.',
    drivers:[{id:'horst-felbermayr',naam:'Horst Felbermayr',nationaliteit:'Oostenrijk',vlag:'🇦🇹'},{id:'horst-felix-felbermayr',naam:'Horst Felix Felbermayr',nationaliteit:'Oostenrijk',vlag:'🇦🇹'},{id:'rene-binder',naam:'René Binder',nationaliteit:'Oostenrijk',vlag:'🇦🇹'}] },
  { id:'e-pa-99', nr:99, naam:'Prema Racing',                fabrikant:'Oreca', carModel:'oreca-07', klasse:'LMP2 Pro/Am', kleur:'#ff0000', info:'Oreca 07 Gibson — Prema Racing Pro/Am.',
    drivers:[{id:'dane-cameron',naam:'Dane Cameron',nationaliteit:'VS',vlag:'🇺🇸'},{id:'louis-deletraz',naam:'Louis Delétraz',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'pj-hyett',naam:'PJ Hyett',nationaliteit:'VS',vlag:'🇺🇸'}] },
  // ── LMGT3 ──
  { id:'e-23', nr:23, naam:'United Autosports',   fabrikant:'McLaren',      carModel:'mclaren-720s-lmgt3-evo',    klasse:'LMGT3', kleur:'#ff6600', info:'McLaren 720S LMGT3 Evo — United Autosports.',
    drivers:[{id:'garnet-patterson',naam:'Garnet Patterson',nationaliteit:'Canada',vlag:'🇨🇦'},{id:'michael-birch',naam:'Michael Birch',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'wayne-boyd',naam:'Wayne Boyd',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'e-33', nr:33, naam:'Corvette Racing',     fabrikant:'Corvette',     carModel:'corvette-z06-lmgt3',        klasse:'LMGT3', kleur:'#ffcc00', info:'Corvette Z06 LMGT3.R.',
    drivers:[{id:'alec-udell',naam:'Alec Udell',nationaliteit:'VS',vlag:'🇺🇸'},{id:'blake-mcdonald',naam:'Blake McDonald',nationaliteit:'VS',vlag:'🇺🇸'},{id:'charlie-eastwood',naam:'Charlie Eastwood',nationaliteit:'Ierland',vlag:'🇮🇪'}] },
  { id:'e-50', nr:50, naam:'Iron Lynx',           fabrikant:'Ferrari',      carModel:'ferrari-296-lmgt3',         klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — Iron Lynx #50.',
    drivers:[{id:'custodio-toledo',naam:'Custodio Toledo',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'lilou-wadoux',naam:'Lilou Wadoux',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'riccardo-agostini',naam:'Riccardo Agostini',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'e-51', nr:51, naam:'AF Corse',            fabrikant:'Ferrari',      carModel:'ferrari-296-lmgt3',         klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — AF Corse.',
    drivers:[{id:'charles-henri-samani',naam:'Charles-Henri Samani',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'conrad-laursen',naam:'Conrad Laursen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'davide-rigon',naam:'Davide Rigon',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'e-54', nr:54, naam:'Dinamic GT',          fabrikant:'Porsche',      carModel:'porsche-911-gt3-r-lmgt3',   klasse:'LMGT3', kleur:'#c0a060', info:'Porsche 911 GT3 R LMGT3 — Dinamic GT.',
    drivers:[{id:'anders-fjordbach',naam:'Anders Fjordbach',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'dennis-andersen',naam:'Dennis Andersen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'laurin-heinrich',naam:'Laurin Heinrich',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  { id:'e-55', nr:55, naam:'Spirit of Race',      fabrikant:'Ferrari',      carModel:'ferrari-296-lmgt3',         klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — Spirit of Race.',
    drivers:[{id:'david-perel',naam:'David Perel',nationaliteit:'Z. Afrika',vlag:'🇿🇦'},{id:'duncan-cameron',naam:'Duncan Cameron',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'matthew-griffin',naam:'Matthew Griffin',nationaliteit:'Ierland',vlag:'🇮🇪'}] },
  { id:'e-57', nr:57, naam:'Kessel Racing',       fabrikant:'Ferrari',      carModel:'ferrari-296-lmgt3',         klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — Kessel Racing.',
    drivers:[{id:'daniel-serra',naam:'Daniel Serra',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'mathys-jaubert',naam:'Mathys Jaubert',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'takeshi-kimura',naam:'Takeshi Kimura',nationaliteit:'Japan',vlag:'🇯🇵'}] },
  { id:'e-59', nr:59, naam:'Garage 59',           fabrikant:'Aston Martin', carModel:'aston-martin-amr-lmgt3',    klasse:'LMGT3', kleur:'#006b5b', info:'Aston Martin AMR LMGT3 — Garage 59.',
    drivers:[{id:'clement-mateu',naam:'Clement Mateu',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'marius-fossard',naam:'Marius Fossard',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'valentin-hasse',naam:'Valentin Hasse',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-62', nr:62, naam:'Akkodis ASP',         fabrikant:'Mercedes',     carModel:'mercedes-amg-lmgt3',        klasse:'LMGT3', kleur:'#00d2be', info:'Mercedes-AMG LMGT3 — Akkodis ASP #62.',
    drivers:[{id:'abdulla-ali-al-khelaifi',naam:'Abdulla Al Khelaifi',nationaliteit:'Qatar',vlag:'🇶🇦'},{id:'adam-christodoulou',naam:'Adam Christodoulou',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'julian-hanses',naam:'Julian Hanses',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  { id:'e-63', nr:63, naam:'Akkodis ASP',         fabrikant:'Mercedes',     carModel:'mercedes-amg-lmgt3',        klasse:'LMGT3', kleur:'#00d2be', info:'Mercedes-AMG LMGT3 — Akkodis ASP #63.',
    drivers:[{id:'ameerh-naran',naam:'Ameerh Naran',nationaliteit:'Z. Afrika',vlag:'🇿🇦'},{id:'rui-andrade',naam:'Rui Andrade',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'sergio-sette-camara',naam:'Sergio Sette Câmara',nationaliteit:'Brazilië',vlag:'🇧🇷'}] },
  { id:'e-74', nr:74, naam:'GR Racing',           fabrikant:'Ferrari',      carModel:'ferrari-296-lmgt3',         klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — GR Racing.',
    drivers:[{id:'andrew-gilbert',naam:'Andrew Gilbert',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'fran-rueda',naam:'Fran Rueda',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'romain-leroux',naam:'Romain Leroux',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-75', nr:75, naam:'Iron Lynx',           fabrikant:'Porsche',      carModel:'porsche-911-gt3-r-lmgt3',   klasse:'LMGT3', kleur:'#c0a060', info:'Porsche 911 GT3 R LMGT3 — Iron Lynx #75.',
    drivers:[{id:'matt-kurzejewski',naam:'Matt Kurzejewski',nationaliteit:'VS',vlag:'🇺🇸'},{id:'richard-lietz',naam:'Richard Lietz',nationaliteit:'Oostenrijk',vlag:'🇦🇹'},{id:'thomas-sargent',naam:'Thomas Sargent',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'e-77', nr:77, naam:'Racing Spirit of Leman',fabrikant:'Porsche',    carModel:'porsche-911-gt3-r-lmgt3',   klasse:'LMGT3', kleur:'#c0a060', info:'Porsche 911 GT3 R LMGT3 — Racing Spirit of Leman.',
    drivers:[{id:'bankcy',naam:'Bankcy',nationaliteit:'Nederland',vlag:'🇳🇱'},{id:'harry-king',naam:'Harry King',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'huub-van-eijndhoven',naam:'Huub van Eijndhoven',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'e-86', nr:86, naam:'GR Racing',           fabrikant:'Ferrari',      carModel:'ferrari-296-lmgt3',         klasse:'LMGT3', kleur:'#e8002d', info:'Ferrari 296 LMGT3 — GR Racing #86.',
    drivers:[{id:'lorcan-hanafin',naam:'Lorcan Hanafin',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'mex-jansen',naam:'Mex Jansen',nationaliteit:'Nederland',vlag:'🇳🇱'},{id:'michael-wainwright',naam:'Michael Wainwright',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  // ── LMP3 ──
  { id:'e-11', nr:11, naam:'V de V Motorsports',        fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#a855f7', info:'Ligier JS P325 — V de V Motorsports.',
    drivers:[{id:'douwe-dedecker',naam:'Douwe Dedecker',nationaliteit:'België',vlag:'🇧🇪'},{id:'matthew-richard-bell',naam:'Matthew Bell',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'max-van-der-snel',naam:'Max van der Snel',nationaliteit:'Nederland',vlag:'🇳🇱'}] },
  { id:'e-13', nr:13, naam:'Inter Europol Competition', fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#0057a8', info:'Ligier JS P325 — Inter Europol #13.',
    drivers:[{id:'alexander-bukhantsov',naam:'Alexander Bukhantsov',nationaliteit:'Bulgarije',vlag:'🇧🇬'},{id:'chun-ting-chou',naam:'Chun-Ting Chou',nationaliteit:'Taiwan',vlag:'🇹🇼'},{id:'henry-cubides-olarte',naam:'Henry Cubides Olarte',nationaliteit:'Colombia',vlag:'🇨🇴'}] },
  { id:'e-17', nr:17, naam:'CD Sport',                  fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#888888', info:'Ligier JS P325 — CD Sport #17.',
    drivers:[{id:'alexander-jacoby',naam:'Alexander Jacoby',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'bruno-ribeiro',naam:'Bruno Ribeiro',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'paul-lanchere',naam:'Paul Lanchère',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-31', nr:31, naam:'TF Sport',                  fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#004080', info:'Ligier JS P325 — TF Sport.',
    drivers:[{id:'gregory-de-sybourg',naam:'Gregory de Sybourg',nationaliteit:'België',vlag:'🇧🇪'},{id:'lenny-ried',naam:'Lenny Ried',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'ralph-meichtry',naam:'Ralph Meichtry',nationaliteit:'Zwitserland',vlag:'🇨🇭'}] },
  { id:'e-35', nr:35, naam:'RLR MSport',                fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#c0a060', info:'Ligier JS P325 — RLR MSport.',
    drivers:[{id:'lucas-fecury',naam:'Lucas Fecury',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'sebastian-gravlund',naam:'Sebastian Gravlund',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'terrence-woodward',naam:'Terrence Woodward',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'e-4',  nr:4,  naam:'DKR Engineering',           fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#666666', info:'Ligier JS P325 — DKR Engineering #4.',
    drivers:[{id:'antti-rammo',naam:'Antti Rammo',nationaliteit:'Finland',vlag:'🇫🇮'},{id:'romain-favre',naam:'Romain Favre',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'wyatt-brichacek',naam:'Wyatt Brichacek',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'e-5',  nr:5,  naam:'MV2S Racing',               fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#003366', info:'Ligier JS P325 — MV2S Racing.',
    drivers:[{id:'alvise-rodella',naam:'Alvise Rodella',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'jose-fernandes-cautela',naam:'José Fernandes Cautela',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'mikkel-gaarde-pedersen',naam:'Mikkel Gaarde Pedersen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'e-68', nr:68, naam:'Graff Racing',              fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#cc0000', info:'Ligier JS P325 — Graff Racing.',
    drivers:[{id:'nick-adcock',naam:'Nick Adcock',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'quentin-antonel',naam:'Quentin Antonel',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'thomas-imbourg',naam:'Thomas Imbourg',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'e-8',  nr:8,  naam:'Nielsen Racing',            fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3', kleur:'#ff0000', info:'Ligier JS P325 — Nielsen Racing #8.',
    drivers:[{id:'daniel-nogales',naam:'Daniel Nogales',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'louis-stern',naam:'Louis Stern',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'matteo-quintarelli',naam:'Matteo Quintarelli',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'e-85', nr:85, naam:'RLR MSport',                fabrikant:'Duqueine', carModel:'duqueine-d09',   klasse:'LMP3', kleur:'#c0a060', info:'Duqueine D09 — RLR MSport #85.',
    drivers:[{id:'fabien-michal',naam:'Fabien Michal',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'hugo-schwarze',naam:'Hugo Schwarze',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'pierre-alexandre-provost',naam:'Pierre-Alexandre Provost',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
]

function TeamRij({ team, isEven, onKlik }: { team: Team; isEven: boolean; onKlik: () => void }) {
  const kk = KLASSE_KLEUR[team.klasse]??'#888'
  const mk = MERK_KLEUR[team.fabrikant]??kk
  return (
    <div className="relative flex items-center group cursor-pointer overflow-hidden transition-all duration-300"
      style={{background:isEven?'rgba(255,255,255,0.025)':'transparent',borderBottom:'1px solid rgba(255,255,255,0.06)',minHeight:88}}
      onClick={onKlik}
      onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.06)'}}
      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background=isEven?'rgba(255,255,255,0.025)':'transparent'}}>
      <div className="absolute left-0 top-0 h-full w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r" style={{background:kk}}/>
      <div className="absolute font-head font-black select-none pointer-events-none"
        style={{fontSize:96,color:mk,opacity:0.07,left:'55%',top:'50%',transform:'translate(-50%,-50%)',lineHeight:1}}>{team.nr}</div>
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
          <span className="font-head font-black text-2xl leading-none" style={{color:kk}}>#{team.nr}</span>
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


function TeamLogo({ naam, size=48 }: { naam: string; size?: number }) {
  const [err, setErr] = useState(false)
  if (err) return null
  return <img src={`/wec/all_team_logos/${naam.toLowerCase().replace(/\s+/g,'-')}.webp`} alt={naam}
    onError={()=>setErr(true)} style={{width:size,height:size,objectFit:'contain'}}/>
}

function TeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const c  = KLASSE_KLEUR[team.klasse]??'#888'
  const mk = MERK_KLEUR[team.fabrikant]??c
  const [tab, setTab] = useState<'overzicht'|'rijders'|'auto'>('overzicht')
  useEffect(()=>{
    const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()}
    window.addEventListener('keydown',fn);document.body.style.overflow='hidden'
    return()=>{window.removeEventListener('keydown',fn);document.body.style.overflow=''}
  },[onClose])
  const tabs=[{id:'overzicht' as const,label:'Overzicht'},{id:'rijders' as const,label:'Rijders'},{id:'auto' as const,label:'Auto'}]
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.88)'}} onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex"
        style={{background:'#0f0f0f',border:`1px solid ${c}50`,maxHeight:'90vh',minHeight:520}} onClick={e=>e.stopPropagation()}>

        {/* ── LINKER PANEEL ── */}
        <div className="relative flex-shrink-0 flex flex-col"
          style={{width:230,background:`linear-gradient(180deg,${c}20 0%,#080808 55%)`,overflowY:'auto',maxHeight:'90vh'}}>
          <div className="relative px-4 pt-5 pb-2">
            <div className="w-full flex items-center justify-center"
              style={{height:100,background:'rgba(255,255,255,0.03)',borderRadius:12,border:`1px solid ${c}20`,padding:'10px 16px'}}>
              <TeamLogo naam={team.naam} size={160}/>
            </div>
          </div>
          <div className="px-4 pb-2">
            <div className="font-head font-black leading-none" style={{fontSize:52,color:c}}>#{team.nr}</div>
            <div className="font-head font-black text-base uppercase text-white leading-tight mt-0.5">{team.naam}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-0.5 h-3 rounded-full" style={{background:mk}}/>
              <span className="font-ui text-[11px] font-bold uppercase tracking-wider" style={{color:mk}}>{team.fabrikant}</span>
            </div>
            <div className="mt-2"><KlasseBadge klasse={team.klasse}/></div>
          </div>
          <div className="mx-3 mt-2 mb-3 rounded-xl flex items-center justify-center"
            style={{background:`linear-gradient(135deg,${mk}18,rgba(255,255,255,0.02))`,border:`1px solid ${mk}35`,height:120}}>
            <img src={carSrc(team)} alt={team.carModel}
              style={{width:'100%',height:'100%',objectFit:'contain',padding:10,filter:`drop-shadow(0 4px 12px ${mk}55)`}}
              onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
          </div>
          <div className="px-4 pb-3 space-y-2">
            {[
              {icon:'🏎️',label:'Auto',   val:team.carModel.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())},
              {icon:'🏁',label:'Klasse', val:team.klasse},
              {icon:'🔢',label:'Nummer', val:`#${team.nr}`},
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
            {tab==='overzicht'&&(
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
                  {[{label:'Team',val:team.naam},{label:'Nummer',val:`#${team.nr}`},{label:'Fabrikant',val:team.fabrikant},
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
            {tab==='rijders'&&(
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
            {tab==='auto'&&(
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
                  {[{label:'Fabrikant',val:team.fabrikant},{label:'Klasse',val:team.klasse},{label:'Nummer',val:`#${team.nr}`},{label:'Seizoen',val:'2026'}]
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

export default function ELMS() {
  const [geselecteerd, setGeselecteerd] = useState<Team|null>(null)
  const [filter, setFilter] = useState('Alle')
  const [zoek, setZoek] = useState('')
  const klassen = ['Alle','LMP2','LMP2 Pro/Am','LMGT3','LMP3']
  const gefilterd = TEAMS.filter(t=>
    (filter==='Alle'||t.klasse===filter)&&
    (!zoek||[t.naam,t.fabrikant,...t.drivers.map(d=>d.naam)].some(s=>s.toLowerCase().includes(zoek.toLowerCase())))
  )
  return(
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <div className="mb-1" style={{color:'#f97316'}}><span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span></div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none flex items-center gap-3">
          <span style={{color:'#f97316'}}>ELMS</span><SeriesBadge series="elms" size="md"/>
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">European Le Mans Series · {TEAMS.length} teams</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {klassen.map(k=>{const ac=filter===k;const kl=KLASSE_KLEUR[k]??'#f97316';return(
          <button key={k} onClick={()=>setFilter(k)} className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all"
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
      {(['LMP2','LMP2 Pro/Am','LMGT3','LMP3'] as const).map(klasse=>{
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
