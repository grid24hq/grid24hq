// ─── Michelin Le Mans Cup 2026 — 100% gebaseerd op echte bestandsnamen ─────────
import { useState, useEffect } from 'react'
import SeriesBadge from '@/components/SeriesBadge'

interface Driver { id: string; naam: string; nationaliteit: string; vlag: string }
interface Team { id: string; nr: number; naam: string; fabrikant: string; carModel: string; klasse: 'GT3'|'LMP3'|'LMP3 Pro/Am'; kleur: string; info: string; drivers: Driver[] }

const KLASSE_KLEUR: Record<string,string> = { 'GT3':'#22c55e','LMP3':'#a855f7','LMP3 Pro/Am':'#f59e0b' }
const KLASSE_MAP:   Record<string,string> = { 'GT3':'gt3','LMP3':'lmp3','LMP3 Pro/Am':'lmp3_pro_am' }
const MERK_KLEUR:   Record<string,string> = {
  'Aston Martin':'#006b5b',Ferrari:'#e8002d',McLaren:'#ff8000',Porsche:'#c0a060',
  Ligier:'#a855f7',Duqueine:'#6366f1',BMW:'#1c69d4',Mercedes:'#00d2be',
}

function carSrc(t: Team)   { return `/wec/lemanscup/${KLASSE_MAP[t.klasse]}/cars/2026-mlmc-${t.nr}-${t.carModel}.webp` }
function drvSrc(t: Team, d: Driver) { return `/wec/lemanscup/${KLASSE_MAP[t.klasse]}/drivers/2026-mlmc-${t.nr}-${d.id}.webp` }

const VLAG_CODES: Record<string,string> = {
  '🇯🇵':'jp','🇬🇧':'gb','🇳🇱':'nl','🇨🇭':'ch','🇳🇿':'nz','🇪🇸':'es','🇩🇰':'dk','🇧🇪':'be','🇩🇪':'de',
  '🇫🇷':'fr','🇮🇹':'it','🇵🇹':'pt','🇦🇹':'at','🇲🇨':'mc','🇧🇷':'br','🇺🇸':'us','🇵🇱':'pl','🇨🇳':'cn',
  '🇿🇦':'za','🇦🇺':'au','🇸🇪':'se','🇹🇷':'tr','🇷🇴':'ro','🇦🇷':'ar','🇮🇪':'ie','🇫🇮':'fi',
  '🇮🇳':'in','🇮🇱':'il','🇶🇦':'qa','🏴󠁧󠁢󠁳󠁣󠁴󠁿':'gb','🇸🇰':'sk','🇸🇬':'sg','🇳🇴':'no','🇧🇬':'bg','🇲🇽':'mx',
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
  // ── GT3 — exact uit lemanscup/gt3/cars ──
  { id:'m-10', nr:10, naam:'TF Sport',           fabrikant:'Aston Martin', carModel:'aston-martin-gt3', klasse:'GT3', kleur:'#006b5b', info:'Aston Martin GT3 — TF Sport #10.',
    drivers:[{id:'philipp-sager',naam:'Philipp Sager',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'valentin-hasse-clot',naam:'Valentin Hasse-Clot',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'m-11', nr:11, naam:'TF Sport',           fabrikant:'Aston Martin', carModel:'aston-martin-gt3', klasse:'GT3', kleur:'#006b5b', info:'Aston Martin GT3 — TF Sport #11.',
    drivers:[{id:'sebastian-moreno',naam:'Sebastian Moreno',nationaliteit:'Spanje',vlag:'🇪🇸'}] },
  { id:'m-17', nr:17, naam:'AF Corse',           fabrikant:'Ferrari',      carModel:'ferrari-296',      klasse:'GT3', kleur:'#e8002d', info:'Ferrari 296 GT3 — AF Corse #17.',
    drivers:[{id:'david-cleto-fumanelli',naam:'David Cleto Fumanelli',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'lorenzo-ferdinando-innocenti',naam:'L.F. Innocenti',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'m-21', nr:21, naam:'Iron Lynx',          fabrikant:'Ferrari',      carModel:'ferrari-296',      klasse:'GT3', kleur:'#e8002d', info:'Ferrari 296 GT3 — Iron Lynx #21.',
    drivers:[{id:'giacomo-altoe',naam:'Giacomo Altoè',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'oscar-ryndziewicz',naam:'Oscar Ryndziewicz',nationaliteit:'Polen',vlag:'🇵🇱'}] },
  { id:'m-23', nr:23, naam:'Scuderia Praha',     fabrikant:'Ferrari',      carModel:'ferrari-296',      klasse:'GT3', kleur:'#e8002d', info:'Ferrari 296 GT3 — Scuderia Praha.',
    drivers:[{id:'josep-mayola-comadira',naam:'Josep Mayola Comadira',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'marc-carol-ybarra',naam:'Marc Carol Ybarra',nationaliteit:'Spanje',vlag:'🇪🇸'}] },
  { id:'m-51', nr:51, naam:'Iron Lynx',          fabrikant:'Ferrari',      carModel:'ferrari-296',      klasse:'GT3', kleur:'#e8002d', info:'Ferrari 296 GT3 — Iron Lynx #51.',
    drivers:[{id:'alessandro-cozzi',naam:'Alessandro Cozzi',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'eliseo-donno',naam:'Eliseo Donno',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'m-54', nr:54, naam:'Dinamic GT',         fabrikant:'Porsche',      carModel:'porsche-911-gt3',  klasse:'GT3', kleur:'#c0a060', info:'Porsche 911 GT3 R — Dinamic GT.',
    drivers:[{id:'matteo-cressoni',naam:'Matteo Cressoni',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'m-77', nr:77, naam:'United Autosports',  fabrikant:'McLaren',      carModel:'mclaren-720s',     klasse:'GT3', kleur:'#ff6600', info:'McLaren 720S GT3 — United Autosports.',
    drivers:[{id:'gonzalo-de-andres-martin',naam:'Gonzalo de Andrés Martín',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'jean-baptiste-simmenauer',naam:'Jean-Baptiste Simmenauer',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'m-88', nr:88, naam:'Formula Racing',     fabrikant:'Ferrari',      carModel:'ferrari-296',      klasse:'GT3', kleur:'#e8002d', info:'Ferrari 296 GT3 — Formula Racing.',
    drivers:[{id:'marco-erminio-bonanomi',naam:'Marco E. Bonanomi',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'rey-acosta-iii',naam:'Rey Acosta III',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'m-91', nr:91, naam:'TF Sport',           fabrikant:'Aston Martin', carModel:'aston-martin-gt3', klasse:'GT3', kleur:'#006b5b', info:'Aston Martin GT3 — TF Sport #91.',
    drivers:[{id:'claude-bovet',naam:'Claude Bovet',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'thomas-canning',naam:'Thomas Canning',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  // ── LMP3 — exact uit lemanscup/lmp3/cars ──
  { id:'m-12', nr:12,  naam:'RLR MSport',         fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#c0a060', info:'Ligier JS P325 — RLR MSport #12.',
    drivers:[{id:'arthur-rogeon',naam:'Arthur Rogeon',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'august-raber',naam:'August Räber',nationaliteit:'Zwitserland',vlag:'🇨🇭'}] },
  { id:'m-15', nr:15,  naam:'RLR MSport',         fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#c0a060', info:'Ligier JS P325 — RLR MSport #15.',
    drivers:[{id:'colin-noble',naam:'Colin Noble',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'geronimo-gomez-azza',naam:'Gerónimo Gómez Azza',nationaliteit:'Argentinië',vlag:'🇦🇷'}] },
  { id:'m-19', nr:19,  naam:'Cool Racing',        fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#00aaff', info:'Ligier JS P325 — Cool Racing #19.',
    drivers:[{id:'lucas-fluxa-cross',naam:'Lucas Fluxá Cross',nationaliteit:'Spanje',vlag:'🇪🇸'},{id:'matus-ryba',naam:'Matus Ryba',nationaliteit:'Slowakije',vlag:'🇸🇰'}] },
  { id:'m-20', nr:20,  naam:'Racing Team Turkey', fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#e30a17', info:'Ligier JS P325 — Racing Team Turkey.',
    drivers:[{id:'lenny-ried',naam:'Lenny Ried',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'philip-lindberg',naam:'Philip Lindberg',nationaliteit:'Zweden',vlag:'🇸🇪'}] },
  { id:'m-22', nr:22,  naam:'United Autosports',  fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#ff6600', info:'Ligier JS P325 — United Autosports #22.',
    drivers:[{id:'andre-vieira',naam:'André Vieira',nationaliteit:'Portugal',vlag:'🇵🇹'},{id:'mathis-poulet',naam:'Mathis Poulet',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'m-26', nr:26,  naam:'G-Drive Racing',     fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#cc0000', info:'Ligier JS P325 — G-Drive Racing.',
    drivers:[{id:'ewan-thomas',naam:'Ewan Thomas',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'kristian-brookes',naam:'Kristian Brookes',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'m-29', nr:29,  naam:'CD Sport',           fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#888888', info:'Ligier JS P325 — CD Sport #29.',
    drivers:[{id:'luciano-morano',naam:'Luciano Morano',nationaliteit:'Italië',vlag:'🇮🇹'},{id:'roee-meyuhas',naam:'Roee Meyuhas',nationaliteit:'Israël',vlag:'🇮🇱'}] },
  { id:'m-36', nr:36,  naam:'Namib Racing',       fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#666666', info:'Ligier JS P325 — Namib Racing.',
    drivers:[{id:'aditya-patel',naam:'Aditya Patel',nationaliteit:'India',vlag:'🇮🇳'},{id:'narain-karthikeyan',naam:'Narain Karthikeyan',nationaliteit:'India',vlag:'🇮🇳'}] },
  { id:'m-4',  nr:4,   naam:'DKR Engineering',    fabrikant:'Duqueine', carModel:'duqueine-d09',     klasse:'LMP3', kleur:'#666666', info:'Duqueine D09 — DKR Engineering #4.',
    drivers:[{id:'jules-caranta',naam:'Jules Caranta',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'mikaeel-pitamber',naam:'Mikaeel Pitamber',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'m-42', nr:42,  naam:'Duqueine Team',      fabrikant:'Duqueine', carModel:'duqueine-m30-d08', klasse:'LMP3', kleur:'#6366f1', info:'Duqueine M30-D08 — Duqueine Team.',
    drivers:[{id:'sergio-sette-camara',naam:'Sergio Sette Câmara',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'ameerh-naran',naam:'Ameerh Naran',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'m-43', nr:43,  naam:'NM Racing Team',     fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#003366', info:'Ligier JS P325 — NM Racing Team.',
    drivers:[{id:'christian-jorgensen',naam:'Christian Jørgensen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'william-karlsson',naam:'William Karlsson',nationaliteit:'Zweden',vlag:'🇸🇪'}] },
  { id:'m-5',  nr:5,   naam:'MV2S Racing',        fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#003366', info:'Ligier JS P325 — MV2S Racing #5.',
    drivers:[{id:'isaac-barashi',naam:'Isaac Barashi',nationaliteit:'VS',vlag:'🇺🇸'},{id:'matteo-segre',naam:'Matteo Segre',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'m-50', nr:50,  naam:'Cool Racing',        fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#00aaff', info:'Ligier JS P325 — Cool Racing #50.',
    drivers:[{id:'colin-queen',naam:'Colin Queen',nationaliteit:'VS',vlag:'🇺🇸'},{id:'giovanni-maschio',naam:'Giovanni Maschio',nationaliteit:'Italië',vlag:'🇮🇹'}] },
  { id:'m-6',  nr:6,   naam:'Graff Racing',       fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#cc0000', info:'Ligier JS P325 — Graff Racing #6.',
    drivers:[{id:'arthur-pavie',naam:'Arthur Pavie',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'mikkel-illan-kristensen',naam:'Mikkel Kristensen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'m-68', nr:68,  naam:'CD Sport',           fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#888888', info:'Ligier JS P325 — CD Sport #68.',
    drivers:[{id:'haydn-chance',naam:'Haydn Chance',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'nazareno-lopez-cesaratto',naam:'Nazareno Lopez Cesaratto',nationaliteit:'Argentinië',vlag:'🇦🇷'}] },
  { id:'m-70', nr:70,  naam:'V de V Motorsports', fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#a855f7', info:'Ligier JS P325 — V de V Motorsports #70.',
    drivers:[{id:'jude-peters',naam:'Jude Peters',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'vic-stevens',naam:'Vic Stevens',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'m-8',  nr:8,   naam:'DKR Engineering',    fabrikant:'Duqueine', carModel:'duqueine-d09',     klasse:'LMP3', kleur:'#666666', info:'Duqueine D09 — DKR Engineering #8.',
    drivers:[{id:'maksymilian-angelard',naam:'Maksymilian Angelard',nationaliteit:'Polen',vlag:'🇵🇱'},{id:'mattis-pluschkell',naam:'Mattis Pluschkell',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  { id:'m-85', nr:85,  naam:'RLR MSport',         fabrikant:'Duqueine', carModel:'duqueine-d09',     klasse:'LMP3', kleur:'#c0a060', info:'Duqueine D09 — RLR MSport #85.',
    drivers:[{id:'danial-frost',naam:'Danial Frost',nationaliteit:'Singapore',vlag:'🇸🇬'},{id:'enzo-peugeot',naam:'Enzo Peugeot',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'m-87', nr:87,  naam:'CD Sport',           fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#888888', info:'Ligier JS P325 — CD Sport #87.',
    drivers:[{id:'alexander-jacoby',naam:'Alexander Jacoby',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'kevin-rabin',naam:'Kevin Rabin',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'m-9',  nr:9,   naam:'Nielsen Racing',     fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#ff0000', info:'Ligier JS P325 — Nielsen Racing #9.',
    drivers:[{id:'louis-iglesias',naam:'Louis Iglesias',nationaliteit:'Frankrijk',vlag:'🇫🇷'},{id:'maxwell-dodds',naam:'Maxwell Dodds',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'m-92', nr:92,  naam:'RLR MSport',         fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#c0a060', info:'Ligier JS P325 — RLR MSport #92.',
    drivers:[{id:'lucas-fecury',naam:'Lucas Fecury',nationaliteit:'Brazilië',vlag:'🇧🇷'},{id:'sebastian-kirch-bach',naam:'Sebastian Kirchbach',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  { id:'m-97', nr:97,  naam:'CD Sport',           fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#888888', info:'Ligier JS P325 — CD Sport #97.',
    drivers:[{id:'cedric-oltramare',naam:'Cédric Oltramare',nationaliteit:'Zwitserland',vlag:'🇨🇭'},{id:'david-droux',naam:'David Droux',nationaliteit:'Zwitserland',vlag:'🇨🇭'}] },
  { id:'m-99', nr:99,  naam:'V de V Motorsports', fabrikant:'Ligier',   carModel:'ligier-js-p325',   klasse:'LMP3', kleur:'#a855f7', info:'Ligier JS P325 — V de V Motorsports #99.',
    drivers:[{id:'max-van-der-snel',naam:'Max van der Snel',nationaliteit:'Nederland',vlag:'🇳🇱'},{id:'tim-gerhards',naam:'Tim Gerhards',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  // ── LMP3 Pro/Am — exact uit lemanscup/lmp3_pro_am/cars ──
  { id:'m-pa-16', nr:16, naam:'Namib Racing',              fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#f59e0b', info:'Ligier JS P325 — Namib Racing Pro/Am.',
    drivers:[{id:'ajith-kumar',naam:'Ajith Kumar',nationaliteit:'India',vlag:'🇮🇳'},{id:'romain-vozniak',naam:'Romain Vozniak',nationaliteit:'Frankrijk',vlag:'🇫🇷'}] },
  { id:'m-pa-24', nr:24, naam:'Inter Europol Competition', fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#0057a8', info:'Ligier JS P325 — Inter Europol Pro/Am.',
    drivers:[{id:'christian-gisy',naam:'Christian Gisy',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'oskar-kristensen',naam:'Oskar Kristensen',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'m-pa-27', nr:27, naam:'CD Sport',                  fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#888888', info:'Ligier JS P325 — CD Sport Pro/Am #27.',
    drivers:[{id:'andrew-ferguson',naam:'Andrew Ferguson',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'louis-hamilton-smith',naam:'Louis Hamilton-Smith',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'m-pa-34', nr:34, naam:'Inter Europol Competition', fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#0057a8', info:'Ligier JS P325 — Inter Europol Pro/Am #34.',
    drivers:[{id:'alexander-bukhantsov',naam:'Alexander Bukhantsov',nationaliteit:'Bulgarije',vlag:'🇧🇬'},{id:'shawn-rashid',naam:'Shawn Rashid',nationaliteit:'VS',vlag:'🇺🇸'}] },
  { id:'m-pa-49', nr:49, naam:'RLR MSport',                fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#c0a060', info:'Ligier JS P325 — RLR MSport Pro/Am.',
    drivers:[{id:'andrew-rackstraw',naam:'Andrew Rackstraw',nationaliteit:'Engeland',vlag:'🇬🇧'},{id:'michael-hove',naam:'Michael Hove',nationaliteit:'Noorwegen',vlag:'🇳🇴'}] },
  { id:'m-pa-58', nr:58, naam:'CD Sport',                  fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#888888', info:'Ligier JS P325 — CD Sport Pro/Am #58.',
    drivers:[{id:'fraser-ross',naam:'Fraser Ross',nationaliteit:'Schotland',vlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},{id:'george-nakas',naam:'George Nakas',nationaliteit:'Griekenland',vlag:'🇬🇷'}] },
  { id:'m-pa-62', nr:62, naam:'G-Drive Racing',            fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#cc0000', info:'Ligier JS P325 — G-Drive Racing Pro/Am.',
    drivers:[{id:'jacek-zielonka',naam:'Jacek Zielonka',nationaliteit:'Polen',vlag:'🇵🇱'},{id:'leo-sami-robinson',naam:'Leo Sami Robinson',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'m-pa-66', nr:66, naam:'MV2S Racing',               fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#003366', info:'Ligier JS P325 — MV2S Racing Pro/Am.',
    drivers:[{id:'mikkel-gaarde-pedersen-',naam:'Mikkel Gaarde Pedersen',nationaliteit:'Denemarken',vlag:'🇩🇰'},{id:'steve-parrow',naam:'Steve Parrow',nationaliteit:'Denemarken',vlag:'🇩🇰'}] },
  { id:'m-pa-7',  nr:7,  naam:'DKR Engineering',           fabrikant:'Duqueine', carModel:'duqueine-d09',   klasse:'LMP3 Pro/Am', kleur:'#666666', info:'Duqueine D09 — DKR Engineering Pro/Am.',
    drivers:[{id:'matthew-bell',naam:'Matthew Bell',nationaliteit:'Engeland',vlag:'🇬🇧'}] },
  { id:'m-pa-71', nr:71, naam:'Graff Racing',              fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#cc0000', info:'Ligier JS P325 — Graff Racing Pro/Am.',
    drivers:[{id:'felipe-fernandez-laser',naam:'Felipe Fernandez Laser',nationaliteit:'Duitsland',vlag:'🇩🇪'},{id:'stefan-aust',naam:'Stefan Aust',nationaliteit:'Duitsland',vlag:'🇩🇪'}] },
  { id:'m-pa-98', nr:98, naam:'CD Sport',                  fabrikant:'Ligier',   carModel:'ligier-js-p325', klasse:'LMP3 Pro/Am', kleur:'#888888', info:'Ligier JS P325 — CD Sport Pro/Am #98.',
    drivers:[{id:'eric-de-doncker',naam:'Eric De Doncker',nationaliteit:'België',vlag:'🇧🇪'},{id:'gillian-henrion',naam:'Gillian Henrion',nationaliteit:'België',vlag:'🇧🇪'}] },
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
      <div className="flex-shrink-0 flex items-center justify-center pl-4" style={{width:80}}><KlasseBadge klasse={team.klasse}/></div>
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
        <div className="absolute inset-y-2 left-2 right-2 rounded-xl" style={{background:`linear-gradient(135deg,${mk}22,${mk}08)`,border:`1px solid ${mk}40`}}/>
        <img src={carSrc(team)} alt={team.carModel}
          style={{position:'relative',width:280,height:72,objectFit:'contain',objectPosition:'center',filter:`drop-shadow(0 2px 14px ${mk}50)`}}
          onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.15'}}/>
      </div>
    </div>
  )
}

function TeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const c = KLASSE_KLEUR[team.klasse]??'#888'
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
        style={{background:'#0f0f0f',border:`1px solid ${c}50`,maxHeight:'90vh',minHeight:500}} onClick={e=>e.stopPropagation()}>
        <div className="relative flex-shrink-0 flex flex-col" style={{width:240,background:`linear-gradient(180deg,${c}22 0%,#0a0a0a 60%)`,overflowY:'auto',maxHeight:'90vh'}}>
          <div className="px-5 pt-5 pb-1"><span className="font-ui text-[10px] font-bold uppercase tracking-[2px]" style={{color:c}}>{team.klasse}</span></div>
          <div className="px-5 pb-2">
            <div className="font-head font-black text-5xl leading-none" style={{color:c}}>#{team.nr}</div>
            <div className="font-head font-black text-lg uppercase text-white mt-1 leading-tight">{team.naam}</div>
            <div className="flex items-center gap-1.5 mt-2"><div className="w-0.5 h-3 rounded-full" style={{background:c}}/><span className="font-ui text-xs font-bold uppercase" style={{color:c}}>{team.fabrikant}</span></div>
            <div className="mt-2"><KlasseBadge klasse={team.klasse}/></div>
          </div>
          <div className="mx-3 my-3 rounded-xl flex items-center justify-center" style={{background:`linear-gradient(135deg,${c}15,rgba(255,255,255,0.02))`,border:`1px solid ${c}30`,height:140}}>
            <img src={carSrc(team)} alt={team.carModel} style={{width:'100%',height:'100%',objectFit:'contain',padding:12,filter:`drop-shadow(0 4px 16px ${c}50)`}} onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
          </div>
          <div className="px-4 pb-5"><p className="font-ui text-[11px] text-white/40 leading-relaxed">{team.info}</p></div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 flex-shrink-0" style={{borderBottom:`1px solid ${c}25`}}>
            <div className="flex gap-1">
              {tabs.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all"
                  style={tab===t.id?{color:c,borderBottom:`2px solid ${c}`}:{color:'rgba(255,255,255,0.35)',borderBottom:'2px solid transparent'}}>{t.label}</button>
              ))}
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm mb-1">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {tab==='rijders'&&(
              <div className="space-y-3">
                {team.drivers.map(d=>(
                  <div key={d.id} className="flex items-center gap-4 rounded-xl p-3" style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${c}20`}}>
                    <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{width:76,height:95}}>
                      <img src={drvSrc(team,d)} alt={d.naam} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
                    </div>
                    <div className="flex-1">
                      <div className="font-ui text-sm text-white/50">{d.naam.split(' ').slice(0,-1).join(' ')}</div>
                      <div className="font-head font-black text-2xl uppercase text-white leading-tight">{d.naam.split(' ').pop()}</div>
                      <div className="flex items-center gap-2 mt-1.5"><VlagImg emoji={d.vlag} size={18}/><div className="w-0.5 h-3 rounded-full" style={{background:c}}/><span className="font-ui text-xs text-white/40">{d.nationaliteit}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab==='auto'&&(
              <div className="space-y-5">
                <div><div className="font-head font-black text-2xl text-white mb-0.5">{team.carModel.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</div><div className="font-ui text-xs text-white/40 uppercase tracking-wider">2026 · {team.klasse}</div></div>
                <div className="rounded-2xl flex items-center justify-center p-6" style={{background:`linear-gradient(135deg,${c}15,rgba(255,255,255,0.02))`,border:`1px solid ${c}30`,height:190}}>
                  <img src={carSrc(team)} alt={team.naam} style={{width:'100%',height:'100%',objectFit:'contain',filter:`drop-shadow(0 8px 24px ${c}70)`}} onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
                </div>
                <div className="rounded-xl p-4" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                  <p className="font-ui text-sm text-white/60 leading-relaxed">{team.info}</p>
                </div>
              </div>
            )}
            {tab==='overzicht'&&(
              <div className="space-y-5">
                <div className="rounded-xl flex items-center justify-center p-4" style={{background:`linear-gradient(135deg,${c}12,rgba(255,255,255,0.02))`,border:`1px solid ${c}25`,height:150}}>
                  <img src={carSrc(team)} alt={team.naam} style={{width:'100%',height:'100%',objectFit:'contain',filter:`drop-shadow(0 6px 20px ${c}60)`}} onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {team.drivers.map(d=>(
                    <div key={d.id} className="flex flex-col items-center gap-1.5">
                      <div className="rounded-xl overflow-hidden" style={{width:72,height:90,background:'rgba(255,255,255,0.04)',border:`1px solid ${c}30`}}>
                        <img src={drvSrc(team,d)} alt={d.naam} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.opacity='0.08'}}/>
                      </div>
                      <div className="text-center"><VlagImg emoji={d.vlag} size={12}/><div className="font-head font-bold text-[11px] text-white leading-tight">{d.naam.split(' ').pop()}</div></div>
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

export default function LeMansCup() {
  const [geselecteerd, setGeselecteerd] = useState<Team|null>(null)
  const [filter, setFilter] = useState('Alle')
  const [zoek, setZoek] = useState('')
  const klassen = ['Alle','GT3','LMP3','LMP3 Pro/Am']
  const gefilterd = TEAMS.filter(t=>
    (filter==='Alle'||t.klasse===filter)&&
    (!zoek||[t.naam,t.fabrikant,...t.drivers.map(d=>d.naam)].some(s=>s.toLowerCase().includes(zoek.toLowerCase())))
  )
  return(
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <div className="mb-1" style={{color:'#f59e0b'}}><span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span></div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none flex items-center gap-3">
          <span style={{color:'#f59e0b'}}>Le Mans Cup</span><SeriesBadge series="lemanscup" size="md"/>
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">Michelin Le Mans Cup · {TEAMS.length} teams</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {klassen.map(k=>{const ac=filter===k;const kl=KLASSE_KLEUR[k]??'#f59e0b';return(
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
      {(['GT3','LMP3','LMP3 Pro/Am'] as const).map(klasse=>{
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
