// ─── MotoGP 2026 — MotoGP / Moto2 / Moto3 grid pagina ────────────────────────
//
// MAPPENSTRUCTUUR AFBEELDINGEN:
//
// public/motogp/
//   flags/          ← landvlaggen SVG  (zelfde als F1: nl.svg, es.svg etc.)
//   motogp/
//     riders/       ← rijder foto's    (320×240 px WebP, bv: marquez.webp)
//     bikes/        ← motor per merk   (400×200 px WebP, bv: ducati.webp)
//   moto2/
//     riders/       ← rijder foto's    (320×240 px WebP)
//     bikes/        ← motor per merk   (400×200 px WebP, bv: kalex.webp)
//   moto3/
//     riders/       ← rijder foto's    (320×240 px WebP)
//     bikes/        ← motor per merk   (400×200 px WebP, bv: ktm_moto3.webp)
//
// MERK IDs (voor bikes map):
//   MotoGP: ducati, aprilia, ktm, yamaha, honda
//   Moto2:  kalex, boscoscuro, forward
//   Moto3:  ktm_moto3, honda_moto3
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

const MGP_ORANJE = '#f97316'

// ─── Klasse kleuren ───────────────────────────────────────────────────────────
const KLASSE_CONFIG = {
  MotoGP: { kleur: '#f97316', label: 'MotoGP',  sub: 'Koningsklasse' },
  Moto2:  { kleur: '#3b82f6', label: 'Moto2',   sub: 'Intermediaire klasse' },
  Moto3:  { kleur: '#22c55e', label: 'Moto3',   sub: 'Lichtste klasse' },
}

// ─── Merk kleuren ─────────────────────────────────────────────────────────────
const MERK_KLEUREN: Record<string, string> = {
  Ducati:     '#cc0000',
  Aprilia:    '#1a1aff',
  KTM:        '#ff6600',
  Yamaha:     '#0033cc',
  Honda:      '#cc0000',
  Kalex:      '#3b82f6',
  Boscoscuro: '#8b5cf6',
  Forward:    '#f59e0b',
}

// ─── MOTOGP GRID ─────────────────────────────────────────────────────────────
const MOTOGP_GRID = [
  { id: 'bagnaia',        voornaam: 'Francesco', naam: 'BAGNAIA',         landCode: 'it', nummer: 63, merk: 'Ducati',   team: 'Ducati Lenovo Team'           },
  { id: 'mmarquez',       voornaam: 'Marc',      naam: 'MÁRQUEZ',         landCode: 'es', nummer: 93, merk: 'Ducati',   team: 'Ducati Lenovo Team'           },
  { id: 'martin',         voornaam: 'Jorge',     naam: 'MARTÍN',          landCode: 'es', nummer: 89, merk: 'Aprilia',  team: 'Aprilia Racing'               },
  { id: 'bezzecchi',      voornaam: 'Marco',     naam: 'BEZZECCHI',       landCode: 'it', nummer: 72, merk: 'Aprilia',  team: 'Aprilia Racing'               },
  { id: 'acosta',         voornaam: 'Pedro',     naam: 'ACOSTA',          landCode: 'es', nummer: 37, merk: 'KTM',      team: 'Red Bull KTM Factory Racing'  },
  { id: 'binder',         voornaam: 'Brad',      naam: 'BINDER',          landCode: 'za', nummer: 33, merk: 'KTM',      team: 'Red Bull KTM Factory Racing'  },
  { id: 'quartararo',     voornaam: 'Fabio',     naam: 'QUARTARARO',      landCode: 'fr', nummer: 20, merk: 'Yamaha',   team: 'Monster Energy Yamaha'        },
  { id: 'rins',           voornaam: 'Alex',      naam: 'RINS',            landCode: 'es', nummer: 42, merk: 'Yamaha',   team: 'Monster Energy Yamaha'        },
  { id: 'morbidelli',     voornaam: 'Franco',    naam: 'MORBIDELLI',      landCode: 'it', nummer: 21, merk: 'Ducati',   team: 'Pertamina VR46 Racing Team'   },
  { id: 'digiannantonio', voornaam: 'Fabio',     naam: 'DI GIANNANTONIO', landCode: 'it', nummer: 49, merk: 'Ducati',   team: 'Pertamina VR46 Racing Team'   },
  { id: 'aldeguer',       voornaam: 'Fermin',    naam: 'ALDEGUER',        landCode: 'es', nummer: 54, merk: 'Ducati',   team: 'Gresini Racing'               },
  { id: 'amarquez',       voornaam: 'Alex',      naam: 'MÁRQUEZ',         landCode: 'es', nummer: 73, merk: 'Ducati',   team: 'Gresini Racing'               },
  { id: 'rfernanez',      voornaam: 'Raul',      naam: 'FERNÁNDEZ',       landCode: 'es', nummer: 25, merk: 'Aprilia',  team: 'Trackhouse Racing'            },
  { id: 'ogura',          voornaam: 'Ai',        naam: 'OGURA',           landCode: 'jp', nummer: 79, merk: 'Aprilia',  team: 'Trackhouse Racing'            },
  { id: 'vinales',        voornaam: 'Maverick',  naam: 'VIÑALES',         landCode: 'es', nummer: 12, merk: 'KTM',      team: 'Red Bull KTM Tech3'           },
  { id: 'bastianini',     voornaam: 'Enea',      naam: 'BASTIANINI',      landCode: 'it', nummer: 23, merk: 'KTM',      team: 'Red Bull KTM Tech3'           },
  { id: 'miller',         voornaam: 'Jack',      naam: 'MILLER',          landCode: 'au', nummer: 43, merk: 'Yamaha',   team: 'Prima Pramac Yamaha'          },
  { id: 'razgatlioglu',   voornaam: 'Toprak',    naam: 'RAZGATLIOĞLU',    landCode: 'tr', nummer: 7,  merk: 'Yamaha',   team: 'Prima Pramac Yamaha'          },
  { id: 'zarco',          voornaam: 'Johann',    naam: 'ZARCO',           landCode: 'fr', nummer: 5,  merk: 'Honda',    team: 'LCR Honda'                    },
  { id: 'moreira',        voornaam: 'Diogo',     naam: 'MOREIRA',         landCode: 'br', nummer: 11, merk: 'Honda',    team: 'LCR Honda'                    },
  { id: 'marini',         voornaam: 'Luca',      naam: 'MARINI',          landCode: 'it', nummer: 10, merk: 'Honda',    team: 'Honda HRC Castrol'            },
  { id: 'mir',            voornaam: 'Joan',      naam: 'MIR',             landCode: 'es', nummer: 36, merk: 'Honda',    team: 'Honda HRC Castrol'            },
]

// ─── MOTO2 GRID ───────────────────────────────────────────────────────────────
const MOTO2_GRID = [
  { id: 'garcia',      voornaam: 'Sergio',   naam: 'GARCIA',      landCode: 'es', nummer: 3,  merk: 'Boscoscuro', team: 'MSI Racing Team'              },
  { id: 'alonso',      voornaam: 'David',    naam: 'ALONSO',      landCode: 'co', nummer: 80, merk: 'Kalex',      team: 'Aspar Team'                   },
  { id: 'holgado',     voornaam: 'Daniel',   naam: 'HOLGADO',     landCode: 'es', nummer: 96, merk: 'Kalex',      team: 'Aspar Team'                   },
  { id: 'guevara',     voornaam: 'Izan',     naam: 'GUEVARA',     landCode: 'es', nummer: 28, merk: 'Kalex',      team: 'Aspar Team'                   },
  { id: 'baltus',      voornaam: 'Barry',    naam: 'BALTUS',      landCode: 'be', nummer: 7,  merk: 'Kalex',      team: 'Fantic Racing'                },
  { id: 'arbolino',    voornaam: 'Tony',     naam: 'ARBOLINO',    landCode: 'it', nummer: 14, merk: 'Kalex',      team: 'Fantic Racing'                },
  { id: 'canet',       voornaam: 'Aron',     naam: 'CANET',       landCode: 'es', nummer: 44, merk: 'Kalex',      team: 'Fantic Racing'                },
  { id: 'veijer',      voornaam: 'Collin',   naam: 'VEIJER',      landCode: 'nl', nummer: 95, merk: 'Kalex',      team: 'Red Bull KTM Ajo'             },
  { id: 'rueda',       voornaam: 'Jose A.',  naam: 'RUEDA',       landCode: 'es', nummer: 98, merk: 'Kalex',      team: 'Red Bull KTM Ajo'             },
  { id: 'roberts',     voornaam: 'Joe',      naam: 'ROBERTS',     landCode: 'us', nummer: 16, merk: 'Kalex',      team: 'American Racing Team'         },
  { id: 'gonzalez',    voornaam: 'Manuel',   naam: 'GONZALEZ',    landCode: 'es', nummer: 18, merk: 'Kalex',      team: 'Intact GP'                    },
  { id: 'agius',       voornaam: 'Senna',    naam: 'AGIUS',       landCode: 'au', nummer: 81, merk: 'Kalex',      team: 'Intact GP'                    },
  { id: 'salac',       voornaam: 'Filip',    naam: 'SALAC',       landCode: 'cz', nummer: 12, merk: 'Boscoscuro', team: 'Marc VDS Racing'              },
  { id: 'oncu',        voornaam: 'Deniz',    naam: 'ÖNCÜ',        landCode: 'tr', nummer: 53, merk: 'Boscoscuro', team: 'Marc VDS Racing'              },
  { id: 'vietti',      voornaam: 'Celestino',naam: 'VIETTI',      landCode: 'it', nummer: 13, merk: 'Boscoscuro', team: 'Beta Tools SpeedRS Team'      },
  { id: 'lopezm2',     voornaam: 'Alonso',   naam: 'LOPEZ',       landCode: 'es', nummer: 21, merk: 'Boscoscuro', team: 'MSI Racing Team'              },
  { id: 'escrig',      voornaam: 'Alex',     naam: 'ESCRIG',      landCode: 'es', nummer: 11, merk: 'Forward',    team: 'KLINT Forward Factory Team'   },
  { id: 'ferrandez',   voornaam: 'Alberto',  naam: 'FERRANDEZ',   landCode: 'es', nummer: 54, merk: 'Forward',    team: 'Forward Factory Team'         },
  { id: 'munoz',       voornaam: 'Daniel',   naam: 'MUNOZ',       landCode: 'co', nummer: 17, merk: 'Kalex',      team: 'Preicanos Racing Team'        },
  { id: 'aji',         voornaam: 'Mario',    naam: 'AJI',         landCode: 'id', nummer: 64, merk: 'Kalex',      team: 'Idemitsu Honda Team Asia'     },
  { id: 'furusato',    voornaam: 'Taiyo',    naam: 'FURUSATO',    landCode: 'jp', nummer: 72, merk: 'Kalex',      team: 'Honda Team Asia'              },
  { id: 'sasaki',      voornaam: 'Ayumu',    naam: 'SASAKI',      landCode: 'jp', nummer: 71, merk: 'Kalex',      team: 'RW Racing GP'                 },
  { id: 'vandengoorbergh', voornaam: 'Zonta', naam: 'VAN DEN GOORBERGH', landCode: 'nl', nummer: 84, merk: 'Kalex', team: 'RW Racing GP'              },
  { id: 'huertas',     voornaam: 'Adrian',   naam: 'HUERTAS',     landCode: 'es', nummer: 99, merk: 'Kalex',      team: 'Italtrans Racing Team'        },
]

// ─── MOTO3 GRID ───────────────────────────────────────────────────────────────
const MOTO3_GRID = [
  { id: 'moodley',     voornaam: 'Ruche',    naam: 'MOODLEY',     landCode: 'za', nummer: 21, merk: 'KTM',   team: 'BOE Motorsports'           },
  { id: 'buchanan',    voornaam: 'Cormac',   naam: 'BUCHANAN',    landCode: 'nz', nummer: 14, merk: 'KTM',   team: 'BOE Motorsports'           },
  { id: 'rammerstorfer',voornaam: 'Leo',     naam: 'RAMMERSTORFER',landCode: 'at',nummer: 5,  merk: 'KTM',   team: 'CIP Green Power'           },
  { id: 'cruces',      voornaam: 'Adrian',   naam: 'CRUCES',      landCode: 'es', nummer: 11, merk: 'KTM',   team: 'CIP Green Power'           },
  { id: 'ogden',       voornaam: 'Scott',    naam: 'OGDEN',       landCode: 'gb', nummer: 19, merk: 'KTM',   team: 'CIP Green Power'           },
  { id: 'bertelle',    voornaam: 'Matteo',   naam: 'BERTELLE',    landCode: 'it', nummer: 18, merk: 'KTM',   team: 'LEVELUP-MTA'               },
  { id: 'ogorman',     voornaam: 'Casey',    naam: "O'GORMAN",    landCode: 'ie', nummer: 67, merk: 'KTM',   team: 'LEVELUP-MTA'               },
  { id: 'quiles',      voornaam: 'Maximo',   naam: 'QUILES',      landCode: 'es', nummer: 28, merk: 'KTM',   team: 'Aspar Team'                },
  { id: 'rios',        voornaam: 'Jesus',    naam: 'RIOS',        landCode: 'es', nummer: 54, merk: 'KTM',   team: 'Aspar Team'                },
  { id: 'esteban',     voornaam: 'Joel',     naam: 'ESTEBAN',     landCode: 'es', nummer: 78, merk: 'KTM',   team: 'Aspar Team'                },
  { id: 'uriarte',     voornaam: 'Brian',    naam: 'URIARTE',     landCode: 'es', nummer: 51, merk: 'KTM',   team: 'Red Bull KTM Ajo'          },
  { id: 'carpe',       voornaam: 'Alvaro',   naam: 'CARPE',       landCode: 'es', nummer: 83, merk: 'KTM',   team: 'Red Bull KTM Ajo'          },
  { id: 'perrone',     voornaam: 'Valentin', naam: 'PERRONE',     landCode: 'ar', nummer: 73, merk: 'KTM',   team: 'Red Bull KTM Tech3'        },
  { id: 'munozm3',     voornaam: 'David',    naam: 'MUNOZ',       landCode: 'co', nummer: 64, merk: 'KTM',   team: 'Intact GP'                 },
  { id: 'oshea',       voornaam: 'Eddie',    naam: "O'SHEA",      landCode: 'gb', nummer: 8,  merk: 'Honda', team: 'MLav Racing'               },
  { id: 'salmela',     voornaam: 'Rico',     naam: 'SALMELA',     landCode: 'fi', nummer: 27, merk: 'Honda', team: 'MLav Racing'               },
  { id: 'kelso',       voornaam: 'Joel',     naam: 'KELSO',       landCode: 'au', nummer: 66, merk: 'Honda', team: 'MLav Racing'               },
  { id: 'pratama',     voornaam: 'Veda',     naam: 'PRATAMA',     landCode: 'id', nummer: 9,  merk: 'Honda', team: 'Honda Team Asia'           },
  { id: 'carraro',     voornaam: 'Nicola',   naam: 'CARRARO',     landCode: 'it', nummer: 10, merk: 'Honda', team: 'Rivacold Snipers Team'     },
  { id: 'morelli',     voornaam: 'Marco',    naam: 'MORELLI',     landCode: 'it', nummer: 97, merk: 'Honda', team: 'Snipers Team'              },
  { id: 'almansa',     voornaam: 'David',    naam: 'ALMANSA',     landCode: 'es', nummer: 22, merk: 'Honda', team: 'Leopard Racing'            },
  { id: 'afernandez',  voornaam: 'Adrian',   naam: 'FERNÁNDEZ',   landCode: 'es', nummer: 31, merk: 'Honda', team: 'Leopard Racing'            },
  { id: 'pini',        voornaam: 'Guido',    naam: 'PINI',        landCode: 'it', nummer: 94, merk: 'Honda', team: 'Leopard Racing'            },
  { id: 'danish',      voornaam: 'Hakim',    naam: 'DANISH',      landCode: 'my', nummer: 13, merk: 'Honda', team: 'SIC58 Squadra Corse'       },
  { id: 'yamanaka',    voornaam: 'Ryusei',   naam: 'YAMANAKA',    landCode: 'jp', nummer: 6,  merk: 'KTM',   team: 'MT Helmets MSI'            },
]

type Rijder = { id: string; voornaam: string; naam: string; landCode: string; nummer: number; merk: string; team: string }
type Klasse = 'MotoGP' | 'Moto2' | 'Moto3'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function merkMapId(merk: string, klasse: Klasse) {
  if (klasse === 'Moto3') return merk === 'KTM' ? 'ktm_moto3' : 'honda_moto3'
  return merk.toLowerCase()
}

function BikeImg({ merk, klasse, style }: { merk: string; klasse: Klasse; style?: React.CSSProperties }) {
  const id = merkMapId(merk, klasse)
  const pad = `/motogp/${klasse.toLowerCase()}/bikes/${id}`
  return (
    <img src={`${pad}.webp`} alt={merk} style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `${pad}.svg`
        else if (img.src.includes('.svg')) img.src = `${pad}.png`
        else img.style.visibility = 'hidden'
      }} />
  )
}

function RiderImg({ rijder, klasse, style }: { rijder: Rijder; klasse: Klasse; style?: React.CSSProperties }) {
  const pad = `/motogp/${klasse.toLowerCase()}/riders/${rijder.id}`
  return (
    <img src={`${pad}.webp`} alt={rijder.naam} style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `${pad}.png`
        else img.style.visibility = 'hidden'
      }} />
  )
}

// ─── Popup ────────────────────────────────────────────────────────────────────
function RijderPopup({ rijder, klasse, onSluit }: { rijder: Rijder; klasse: Klasse; onSluit: () => void }) {
  const klasseKleur = KLASSE_CONFIG[klasse].kleur
  const merkKleur   = MERK_KLEUREN[rijder.merk] ?? klasseKleur

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onSluit}>
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden flex"
        style={{ background: '#0f0f0f', border: `1px solid ${klasseKleur}50`, maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}>

        {/* ── Linker paneel ── */}
        <div className="relative flex-shrink-0 flex flex-col" style={{ width: 220, background: `linear-gradient(180deg, ${klasseKleur}25 0%, #0a0a0a 55%)` }}>
          {/* Klasse badge */}
          <div className="px-4 pt-4 pb-1">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[2px] px-2 py-1 rounded"
              style={{ background: klasseKleur + '22', color: klasseKleur, border: `1px solid ${klasseKleur}44` }}>
              {klasse}
            </span>
          </div>
          {/* Naam + nummer */}
          <div className="px-4 pb-2">
            <div className="font-ui text-sm text-white/60">{rijder.voornaam}</div>
            <div className="font-head font-black text-2xl uppercase text-white leading-tight">{rijder.naam}</div>
            <div className="flex items-center gap-2 mt-1">
              <img src={`/motogp/flags/${rijder.landCode}.svg`} alt={rijder.landCode}
                className="rounded-sm" style={{ width: 24, height: 16, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              <span className="font-ui text-xs text-white/40 uppercase">{rijder.landCode}</span>
            </div>
          </div>

          {/* Rijder foto */}
          <div className="relative flex-1 mx-3 rounded-xl overflow-hidden" style={{ minHeight: 180 }}>
            <RiderImg rijder={rijder} klasse={klasse}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
            <div className="absolute bottom-0 left-0 right-0 h-16"
              style={{ background: 'linear-gradient(transparent, #0a0a0a)' }} />
            {/* Groot nummer overlay */}
            <div className="absolute bottom-2 right-3 font-head font-black text-5xl leading-none"
              style={{ color: klasseKleur, opacity: 0.35 }}>
              {rijder.nummer}
            </div>
          </div>

          {/* Info */}
          <div className="px-4 py-4 space-y-2">
            {[
              { icon: '#️⃣', label: 'Racenummer', val: `#${rijder.nummer}` },
              { icon: '🏭', label: 'Merk',       val: rijder.merk },
              { icon: '🏁', label: 'Team',       val: rijder.team },
            ].map(({ icon, label, val }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-xs mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-ui text-[9px] uppercase tracking-wider text-white/25">{label}</div>
                  <div className="font-ui text-xs text-white/75 leading-tight">{val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rechter paneel ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4"
            style={{ borderBottom: `1px solid ${klasseKleur}25` }}>
            <div>
              <div className="font-ui text-[10px] uppercase tracking-[2px] mb-1" style={{ color: klasseKleur }}>
                {rijder.team}
              </div>
              <div className="font-head font-black text-xl uppercase text-white">{rijder.voornaam} {rijder.naam}</div>
            </div>
            <button onClick={onSluit}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Stats blokjes */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Klasse',      val: klasse },
                { label: 'Racenummer', val: `#${rijder.nummer}` },
                { label: 'Merk',       val: rijder.merk },
                { label: 'Nationaliteit', val: rijder.landCode.toUpperCase() },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mb-1">{label}</div>
                  <div className="font-ui text-sm font-semibold text-white">{val}</div>
                </div>
              ))}
            </div>

            {/* Motor */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-0.5 rounded-full" style={{ background: klasseKleur }} />
                <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">
                  {rijder.merk} · 2026 Motor
                </span>
              </div>
              <div className="rounded-xl flex items-center justify-center p-4"
                style={{ background: `linear-gradient(135deg, ${merkKleur}15, rgba(255,255,255,0.02))`, border: `1px solid ${merkKleur}30`, height: 130 }}>
                <BikeImg merk={rijder.merk} klasse={klasse}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 4px 16px ${merkKleur}50)` }} />
              </div>
            </div>

            {/* Team */}
            <div className="rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${klasseKleur}10, rgba(255,255,255,0.02))`, border: `1px solid ${klasseKleur}20` }}>
              <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mb-1">Team 2026</div>
              <div className="font-ui text-sm font-semibold text-white">{rijder.team}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Rijder rij ───────────────────────────────────────────────────────────────
function RijderRij({ rijder, klasse, isEven, onKlik }: { rijder: Rijder; klasse: Klasse; isEven: boolean; onKlik: () => void }) {
  const klasseKleur = KLASSE_CONFIG[klasse].kleur
  const merkKleur   = MERK_KLEUREN[rijder.merk] ?? klasseKleur

  return (
    <div className="relative grid items-center group transition-all cursor-pointer hover:brightness-110"
      style={{ gridTemplateColumns: '40px 96px 260px 60px 200px 1fr', background: isEven ? 'rgba(255,255,255,0.03)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 80 }}
      onClick={onKlik}>
      <div className="absolute left-0 top-0 h-full w-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-r" style={{ background: klasseKleur }} />

      {/* Vlag */}
      <div className="flex items-center justify-center pl-3">
        <img src={`/motogp/flags/${rijder.landCode}.svg`} alt={rijder.landCode}
          className="rounded-sm" style={{ width: 28, height: 18, objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
      </div>

      {/* Rijder foto */}
      <div className="flex items-center justify-center py-2">
        <div className="overflow-hidden rounded-lg" style={{ width: 96, height: 72 }}>
          <RiderImg rijder={rijder} klasse={klasse}
            style={{ width: 96, height: 72, objectFit: 'cover', objectPosition: 'top center' }} />
        </div>
      </div>

      {/* Naam */}
      <div className="flex items-center gap-2 px-4">
        <span className="font-ui text-sm text-white/40 group-hover:text-white/70 transition-colors whitespace-nowrap">{rijder.voornaam}</span>
        <span className="font-head font-black text-lg uppercase text-white tracking-wide whitespace-nowrap">{rijder.naam}</span>
      </div>

      {/* Nummer */}
      <div className="flex items-center justify-center">
        <span className="font-head font-black text-sm w-11 h-8 flex items-center justify-center rounded"
          style={{ background: klasseKleur + '33', color: klasseKleur, border: `1px solid ${klasseKleur}55` }}>
          {rijder.nummer}
        </span>
      </div>

      {/* Motor */}
      <div className="flex items-center justify-center rounded-lg mx-2"
        style={{ height: 56, background: `linear-gradient(135deg, ${merkKleur}15, rgba(255,255,255,0.03))`, border: `1px solid ${merkKleur}25` }}>
        <BikeImg merk={rijder.merk} klasse={klasse}
          style={{ width: 190, height: 46, objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.7))' }} />
      </div>

      {/* Team */}
      <div className="flex items-center gap-2 px-4">
        <div className="w-0.5 self-stretch my-3 rounded-full flex-shrink-0" style={{ background: klasseKleur }} />
        <span className="font-ui text-sm text-white/40 group-hover:text-white transition-colors truncate">{rijder.team}</span>
      </div>
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function MotoGP() {
  const [klasse, setKlasse]         = useState<Klasse>('MotoGP')
  const [zoek, setZoek]             = useState('')
  const [merkFilter, setMerkFilter] = useState<string | null>(null)
  const [popup, setPopup]           = useState<Rijder | null>(null)

  const grid = klasse === 'MotoGP' ? MOTOGP_GRID : klasse === 'Moto2' ? MOTO2_GRID : MOTO3_GRID
  const cfg  = KLASSE_CONFIG[klasse]

  const merken = Array.from(new Set(grid.map(r => r.merk)))

  const gefilterd = grid.filter(r => {
    const matchMerk = !merkFilter || r.merk === merkFilter
    const matchZoek = !zoek || `${r.voornaam} ${r.naam} ${r.team} ${r.merk}`.toLowerCase().includes(zoek.toLowerCase())
    return matchMerk && matchZoek
  })

  // Reset filter bij wisselen klasse
  function wisselKlasse(k: Klasse) {
    setKlasse(k); setMerkFilter(null); setZoek('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">

      {/* ── Header ── */}
      <div className="mb-1" style={{ color: MGP_ORANJE }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none">
          Moto<span style={{ color: MGP_ORANJE }}>GP</span>
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">
          {cfg.sub} · {grid.length} rijders
        </span>
      </div>

      {/* ── Klasse tabs ── */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(KLASSE_CONFIG) as Klasse[]).map(k => {
          const c      = KLASSE_CONFIG[k]
          const actief = klasse === k
          return (
            <button key={k} onClick={() => wisselKlasse(k)}
              className="font-head font-black text-sm uppercase tracking-wider px-6 py-2.5 rounded-lg border transition-all"
              style={actief
                ? { background: c.kleur + '22', borderColor: c.kleur, color: c.kleur }
                : { background: 'transparent', borderColor: '#333', color: '#555' }}>
              {k}
            </button>
          )
        })}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input type="text" placeholder="Zoek rijder of team..."
          value={zoek} onChange={e => setZoek(e.target.value)}
          className="font-ui text-sm px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-light placeholder-brand-muted focus:outline-none transition-colors w-full md:w-64"
          style={{ '--tw-ring-color': cfg.kleur } as any} />
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setMerkFilter(null)}
            className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
            style={!merkFilter ? { background: cfg.kleur + '22', borderColor: cfg.kleur, color: cfg.kleur } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
            Alle
          </button>
          {merken.map(m => {
            const mk = MERK_KLEUREN[m] ?? cfg.kleur
            const ac = merkFilter === m
            return (
              <button key={m} onClick={() => setMerkFilter(ac ? null : m)}
                className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
                style={ac ? { background: mk + '22', borderColor: mk, color: mk } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
                {m}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tabel ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
        {/* Header */}
        <div className="grid items-center"
          style={{ gridTemplateColumns: '40px 96px 260px 60px 200px 1fr', background: '#0a0a0a', borderBottom: '1px solid #222' }}>
          <div /><div />
          <div className="px-4 py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Rijder</span></div>
          <div className="flex justify-center py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">#</span></div>
          <div className="px-2 py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Motor</span></div>
          <div className="px-4 py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Team</span></div>
        </div>

        {gefilterd.map((r, i) => (
          <RijderRij key={r.id} rijder={r} klasse={klasse} isEven={i % 2 === 0} onKlik={() => setPopup(r)} />
        ))}

        {gefilterd.length === 0 && (
          <div className="py-16 text-center font-ui text-sm text-white/30">Geen rijders gevonden.</div>
        )}
      </div>

      {popup && <RijderPopup rijder={popup} klasse={klasse} onSluit={() => setPopup(null)} />}
    </div>
  )
}
