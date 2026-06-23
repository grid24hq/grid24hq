// ─── IMSA WeatherTech SportsCar Championship 2026 ────────────────────────────
//
// MAPPENSTRUCTUUR AFBEELDINGEN:
//
// public/imsa/
//   acura-meyer-shank-racing-w-curb-agajanian-no-60/
//     acura-meyer-shank-racing-w-curb-agajanian-no-60.webp  ← auto (mapnaam.webp)
//     AJAllmendinger.webp                                    ← driver foto's
//     ColinBraun.webp
//     ScottDixon.webp
//     TomBlomqvist.webp
//   ...
//
// Auto bestand = altijd mapnaam.webp
// Driver bestanden = VoornaamAchternaam.webp
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

const IMSA_BLAUW  = '#0057b8'
const IMSA_GROEN  = '#00a651'

// ─── Klasse kleuren ───────────────────────────────────────────────────────────
const KLASSE_KLEUR: Record<string, string> = {
  GTP:     '#e4002b',
  GTD_PRO: '#f97316',
  GTD:     '#0057b8',
  LMP2:    '#8b5cf6',
}

const KLASSE_LABEL: Record<string, string> = {
  GTP:     'GTP',
  GTD_PRO: 'GTD PRO',
  GTD:     'GTD',
  LMP2:    'LMP2',
}

// ─── Merk kleuren ─────────────────────────────────────────────────────────────
const MERK_KLEUR: Record<string, string> = {
  Acura:        '#cc0000',
  BMW:          '#1c69d4',
  Cadillac:     '#b8960c',
  Porsche:      '#c8a000',
  Ferrari:      '#dc0000',
  Lamborghini:  '#d4a017',
  Corvette:     '#ffd700',
  Ford:         '#003478',
  McLaren:      '#ff8000',
  Aston:        '#006644',
  Mercedes:     '#00d2be',
}

// ─── Driver landcodes ──────────────────────────────────────────────────────────
const DRIVER_FLAGS: Record<string, string> = {
  AJAllmendinger:'us', ColinBraun:'us', ScottDixon:'nz', TomBlomqvist:'gb',
  AlexPalou:'es', KakuOhta:'jp', NickYelloly:'gb', RengervanderZande:'nl',
  DriesVanthoor:'be', ReneRast:'de', RobinFrijns:'nl', SheldonvanderLinde:'za',
  KevinMagnussen:'dk', MarcoWittmann:'de', PhilippEng:'at', RaffaeleMarciello:'ch',
  FilipeAlbuquerque:'pt', RickyTaylor:'us', WillStevens:'gb',
  ColtonHerta:'us', JordanTaylor:'us', LouisDeletraz:'ch',
  AlexanderSims:'gb', AntonioGarcia:'es', MarvinKirchhofer:'de',
  NickyCatsburg:'nl', NicoVarrone:'ar', TommyMilner:'us',
  KevinEstre:'fr', LaurensVanthoor:'be', MattCampbell:'au',
  FelipeNasr:'br', JulienAndlauer:'fr', LaurinHeinrich:'de',
  ChrisCumming:'gb', EnzoFittipaldi:'br', ManuelEspiritoSanto:'pt', PietroFittipaldi:'br',
  ConnorZilisch:'us', EarlBamber:'nz', FrederikVesti:'dk', JackAitken:'gb',
  FerdinandHabsburg:'at', JacobAbel:'us', LoganSargeant:'us', NaveenRao:'us',
  GeorgeKolovos:'us', JakubSmiechowski:'pl', NickCassidy:'nz', NolanSiegel:'us',
  AntonioFelixdaCosta:'pt', BijoyGarg:'us', JeremyClarke:'ie', TomDillman:'fr',
  BenKeating:'us', HarryTincknell:'gb', MishaGoikhberg:'us', ParkerThompson:'ca',
  JohnFarano:'ca', KyffinSimpson:'ky', SebastianAlvarez:'mx', SebastienBourdais:'fr',
  BenHanley:'gb', HunterMcElrea:'au', MikkelJensen:'dk', PhilFayer:'us',
  DylanMurr:'us', FrancoisPerrodo:'fr', MatthieuVaxiviere:'fr', NicklasNielsen:'dk',
  BenBarker:'gb', DennisOlsen:'no', MikeRockenfeller:'de',
  ChristopherMies:'de', FredericVervisch:'be', SebastianPraulx:'de',
  DuduBarrichello:'br', MattiaDrudi:'it', TomGamble:'gb', ZacharieRobichon:'ca',
  AyhancanGuven:'tr', KlausBachler:'at', RicardoFeller:'ch', ThomasPreining:'at',
  AndreaCaldarelli:'it', JamesHinchcliffe:'ca', MirkoBortolotti:'it', SandyMitchell:'gb',
  AlessandroPierGuidi:'it', DanielSerra:'br', DavideRigon:'it',
  DeanMacDonald:'gb', JuirVips:'ee', MaxEsterson:'us', NikitaJohnson:'us',
  ChazMostert:'au', KennyHabul:'no', MaroEngel:'de', WillPower:'au',
  AntonioFuoco:'it', LilouWadoux:'fr', SimonMann:'us', TommasoMosca:'it',
  AlessioPicariello:'be', HarryKing:'gb', NickTandy:'gb',
  ChristianRasmussen:'dk', DaneCameron:'us', JonnyEdgar:'gb', PJHyett:'us',
  AlexRiberas:'es', MarcoSorensen:'dk', RomanDeAngelis:'ca', RossGunn:'gb',
  BenGreen:'gb', LarsKern:'de', MatthewBell:'gb', OreyFidani:'ca',
  AlbertCosta:'es', LorenzoPatrese:'it', MannyFranco:'us', ThierryVermeulen:'nl',
  AlexQuinn:'us', GeorgeKurtz:'us', MaltheJakobsen:'dk', TobySowery:'gb',
  CasperStevenson:'gb', GIacomoAltoe:'mc', HenrickHedman:'se', MatteoCairoli:'it',
  CharlieEastwood:'ie', MasonFilippi:'us', SalihYoluc:'tr', ScottMcLaughlin:'nz',
  AnthonyBartone:'us', FabianSchiller:'de', JulesGounon:'fr', MaximilianGoetz:'de',
  TillBechtolsheimer:'gb', CoreyLewis:'us', JakeWalker:'us', JoeyHand:'us',
  BrendanIribe:'us', DavidFumanelli:'it', FrederikSchandorff:'dk', OllieMillroy:'gb',
  JobVanUitert:'nl', JonField:'us', OliverJarvis:'gb', SethLucas:'us',
  KaylenFrederick:'us', NicoPino:'cl', TijmenvanderHelm:'nl',
  JamesRoe:'ie', LinHodenius:'se', RalfAron:'ee', ScottAndrews:'au',
  JohnPotter:'us', MadisonSnow:'us', NickiThiim:'dk', SpencerPumpelly:'us',
  MorrisSchuring:'nl', RiccardoPera:'it', RichardLietz:'at', RyanHardwick:'us',
  DaveMusial:'us', DaveMusialJr:'us', PeterLudwig:'de', RyanYardley:'gb',
  FelipeFraga:'br', JensonAltzman:'us', RomainGrosjean:'fr', SheenaMonk:'us',
  ConnorDePhillippi:'us', DanHarper:'gb', MaxHesse:'de', NeilVerhagen:'us',
  DillonMachavern:'us', EricZitza:'us', JanHeylen:'be', SvenMuller:'de',
  CharlesMilesi:'fr', DavidHeinemeierHansson:'dk', MathiasBeche:'ch', TobiLutke:'de',
  KentonKoch:'us', OnofrioTriarsi:'it', RobertMegennis:'us', YifeiYe:'cn',
  FrancisSelldorff:'us', JensKlingmann:'de', PatrickGallagher:'us', RobbyFoley:'us',
  DanGoldburg:'us', GregoireSaucy:'ch', PaulDiResta:'gb', RasmusLindh:'se',
  CarlBennett:'au', RoryvanderSteur:'us', SebastienBaud:'fr', ValentinHasseClot:'fr',
  AaronTelitz:'us', BenjaminPedersen:'dk', EstebanMasson:'fr',
  BenBarnicoat:'gb', JackHawksworth:'gb', KyleKirkwood:'us',
  DannyFormal:'us', GrahamDoyle:'ie', MarcusEricsson:'se', TrentHindman:'us',
  JasonHart:'gb', LucaStolz:'de', MaximiMartin:'be',
  IndyDontje:'nl', LucasAuer:'at', PhilipEllis:'ch', RussellWard:'us',
  AdamAdelson:'us', CallumIlott:'gb', ElliottSkeer:'us', TomSargent:'us',
}


// ─── Team interface ───────────────────────────────────────────────────────────
interface Team {
  id: string           // map-naam = bestandspad
  nr: number           // racenummer
  klasse: string       // GTP / GTD_PRO / GTD / LMP2
  merk: string         // Porsche, BMW, etc.
  auto: string         // auto model
  team: string         // team display naam
  drivers: string[]    // ['VoornaamAchternaam', ...]
  land: string         // hoofdland team
}

// ─── IMSA 2026 Teams ──────────────────────────────────────────────────────────
const TEAMS: Team[] = [
  // ── GTP ──────────────────────────────────────────────────────────────────
  { id: 'acura-meyer-shank-racing-w-curb-agajanian-no-60',  nr: 60,  klasse: 'GTP',     merk: 'Acura',       auto: 'Acura ARX-06',        team: 'Meyer Shank Racing w/ Curb-Agajanian',  drivers: ['AJAllmendinger','ColinBraun','ScottDixon','TomBlomqvist'],              land: 'us' },
  { id: 'acura-meyer-shank-racing-w-curb-agajanian-no-93',  nr: 93,  klasse: 'GTP',     merk: 'Acura',       auto: 'Acura ARX-06',        team: 'Meyer Shank Racing w/ Curb-Agajanian',  drivers: ['AlexPalou','KakuOhta','NickYelloly','RengervanderZande'],               land: 'us' },
  { id: 'bmw-team-rll-no-24',                               nr: 24,  klasse: 'GTP',     merk: 'BMW',         auto: 'BMW M Hybrid V8',     team: 'BMW Team RLL',                          drivers: ['DriesVanthoor','ReneRast','RobinFrijns','SheldonvanderLinde'],           land: 'de' },
  { id: 'bmw-team-rll-no-25',                               nr: 25,  klasse: 'GTP',     merk: 'BMW',         auto: 'BMW M Hybrid V8',     team: 'BMW Team RLL',                          drivers: ['KevinMagnussen','MarcoWittmann','PhilippEng','RaffaeleMarciello'],       land: 'de' },
  { id: 'cadillac-wayne-taylor-racing-no-10',               nr: 10,  klasse: 'GTP',     merk: 'Cadillac',    auto: 'Cadillac V-LMDh',     team: 'Cadillac Wayne Taylor Racing',          drivers: ['FilipeAlbuquerque','RickyTaylor','WillStevens'],                         land: 'us' },
  { id: 'cadillac-wayne-taylor-racing-no-40',               nr: 40,  klasse: 'GTP',     merk: 'Cadillac',    auto: 'Cadillac V-LMDh',     team: 'Cadillac Wayne Taylor Racing',          drivers: ['ColtonHerta','JordanTaylor','LouisDeletraz'],                            land: 'us' },
  { id: 'corvette-racing-no-3',                             nr: 3,   klasse: 'GTP',     merk: 'Corvette',    auto: 'Chevrolet Corvette Z06R GT3', team: 'Corvette Racing',              drivers: ['AlexanderSims','AntonioGarcia','MarvinKirchhofer'],                      land: 'us' },
  { id: 'corvette-racing-no-4',                             nr: 4,   klasse: 'GTP',     merk: 'Corvette',    auto: 'Chevrolet Corvette Z06R GT3', team: 'Corvette Racing',              drivers: ['NickyCatsburg','NicoVarrone','TommyMilner'],                             land: 'us' },
  { id: 'porsche-penske-motorsport-no-6',                   nr: 6,   klasse: 'GTP',     merk: 'Porsche',     auto: 'Porsche 963',         team: 'Porsche Penske Motorsport',             drivers: ['KevinEstre','LaurensVanthoor','MattCampbell'],                           land: 'de' },
  { id: 'porsche-penske-motorsport-no-7',                   nr: 7,   klasse: 'GTP',     merk: 'Porsche',     auto: 'Porsche 963',         team: 'Porsche Penske Motorsport',             drivers: ['FelipeNasr','JulienAndlauer','LaurinHeinrich'],                          land: 'de' },
  { id: 'pratt-miller-motorsports-no-73',                   nr: 73,  klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'Pratt Miller Motorsports',              drivers: ['ChrisCumming','EnzoFittipaldi','ManuelEspiritoSanto','PietroFittipaldi'],land: 'us' },
  { id: 'whelen-engineering-racing-no-31',                  nr: 31,  klasse: 'GTP',     merk: 'Cadillac',    auto: 'Cadillac V-Series.R',  team: 'Cadillac Whelen',                       drivers: ['ConnorZilisch','EarlBamber','FrederikVesti','JackAitken'],               land: 'us' },

  // ── LMP2 ─────────────────────────────────────────────────────────────────
  { id: 'crowdstrike-racing-by-apr-04',                     nr: 4,   klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'CrowdStrike Racing by APR',             drivers: ['AlexQuinn','GeorgeKurtz','MaltheJakobsen','TobySowery'],                 land: 'us' },
  { id: 'era-motorsport-no-18',                             nr: 18,  klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'Era Motorsport',                        drivers: ['FerdinandHabsburg','JacobAbel','LoganSargeant','NaveenRao'],            land: 'us' },
  { id: 'inter-europol-competition-no-343',                 nr: 343, klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'Inter Europol Competition',             drivers: ['GeorgeKolovos','JakubSmiechowski','NickCassidy','NolanSiegel'],          land: 'pl' },
  { id: 'inter-europol-competition-no-43',                  nr: 43,  klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'Inter Europol Competition',             drivers: ['AntonioFelixdaCosta','BijoyGarg','JeremyClarke','TomDillman'],           land: 'pl' },
  { id: 'intersport-racing-no-37',                          nr: 37,  klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'Intersport Racing',                     drivers: ['JobVanUitert','JonField','OliverJarvis','SethLucas'],                    land: 'us' },
  { id: 'pr1-mathiasen-motorsports-no-52',                  nr: 52,  klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'Bryan Herta Autosport with PR1/Mathiasen', drivers: ['BenKeating','HarryTincknell','MishaGoikhberg','ParkerThompson'],   land: 'us' },
  { id: 'tower-motorsport-no-8',                            nr: 8,   klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'Tower Motorsport',                      drivers: ['JohnFarano','KyffinSimpson','SebastianAlvarez','SebastienBourdais'],     land: 'us' },
  { id: 'united-autosports-usa-no-2',                       nr: 2,   klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'United Autosports USA',                 drivers: ['BenHanley','HunterMcElrea','MikkelJensen','PhilFayer'],                  land: 'gb' },
  { id: 'united-autosports-no-22',                          nr: 22,  klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'United Autosports USA',                 drivers: ['DanGoldburg','GregoireSaucy','PaulDiResta','RasmusLindh'],                land: 'gb' },

  // ── GTD PRO ───────────────────────────────────────────────────────────────
  { id: 'af-corse-no-83',                                   nr: 83,  klasse: 'GTD_PRO', merk: 'Ferrari',     auto: 'Ferrari 296 GT3 Evo', team: 'AF Corse USA',                          drivers: ['DylanMurr','FrancoisPerrodo','MatthieuVaxiviere','NicklasNielsen'],      land: 'it' },
  { id: 'ao-racing-no-77',                                  nr: 77,  klasse: 'GTD_PRO', merk: 'Porsche',     auto: 'Porsche 911 GT3 R',   team: 'AO Racing',                             drivers: ['AlessioPicariello','HarryKing','NickTandy'],                             land: 'us' },
  { id: 'ford-multimatic-motorsports-no-64',                nr: 64,  klasse: 'GTD_PRO', merk: 'Ford',        auto: 'Ford Mustang GT3 Evo', team: 'Ford Racing',                           drivers: ['BenBarker','DennisOlsen','MikeRockenfeller'],                            land: 'us' },
  { id: 'ford-multimatic-motorsports-no-65',                nr: 65,  klasse: 'GTD_PRO', merk: 'Ford',        auto: 'Ford Mustang GT3 Evo', team: 'Ford Racing',                           drivers: ['ChristopherMies','FredericVervisch','SebastianPraulx'],                  land: 'us' },
  { id: 'heart-of-racing-team-no-27',                       nr: 27,  klasse: 'GTD_PRO', merk: 'Aston',       auto: 'Aston Martin Vantage GT3', team: 'Heart of Racing Team',            drivers: ['DuduBarrichello','MattiaDrudi','TomGamble','ZacharieRobichon'],          land: 'us' },
  { id: 'manthey-no-911',                                   nr: 911, klasse: 'GTD_PRO', merk: 'Porsche',     auto: 'Porsche 911 GT3 R',   team: 'Manthey Racing',                        drivers: ['AyhancanGuven','KlausBachler','RicardoFeller','ThomasPreining'],          land: 'de' },
  { id: 'paul-miller-racing-no-1',                          nr: 1,   klasse: 'GTD_PRO', merk: 'BMW',         auto: 'BMW M4 GT3 Evo',      team: 'Paul Miller Racing',                    drivers: ['ConnorDePhillippi','DanHarper','MaxHesse','NeilVerhagen'],                land: 'us' },
  { id: 'pfaff-motorsports-no-9',                           nr: 9,   klasse: 'GTD_PRO', merk: 'Lamborghini', auto: 'Lamborghini Huracán GT3 Evo 2', team: 'Pfaff Motorsports',           drivers: ['AndreaCaldarelli','FranckPerera','JamesHinchcliffe','MirkoBortolotti','SandyMitchell'], land: 'ca' },
  { id: 'risi-competizione-no-62',                          nr: 62,  klasse: 'GTD_PRO', merk: 'Ferrari',     auto: 'Ferrari 296 GT3 Evo', team: 'Risi Competizione',                     drivers: ['AlessandroPierGuidi','DanielSerra','DavideRigon'],                       land: 'it' },
  { id: 'rll-team-mclaren-no-59',                           nr: 59,  klasse: 'GTD_PRO', merk: 'McLaren',     auto: 'McLaren 720S GT3 Evo', team: 'RLL Team McLaren',                     drivers: ['DeanMacDonald','JuriVips','MaxEsterson','NikitaJohnson'],                land: 'gb' },
  { id: 'sun-energy-1-no-75',                               nr: 75,  klasse: 'GTD_PRO', merk: 'Mercedes',    auto: 'Mercedes-AMG GT3 Evo', team: '75 Express',                           drivers: ['ChazMostert','KennyHabul','MaroEngel','WillPower'],                      land: 'us' },
  { id: 'triarsi-competizione-no-033',                      nr: 33,  klasse: 'GTD_PRO', merk: 'Ferrari',     auto: 'Ferrari 296 GT3 Evo', team: 'Triarsi Competizione',                  drivers: ['AlessioRovera','JamesCalado','MiguelMolina','RiccardoAgostini'],         land: 'it' },
  { id: 'winward-racing-no-48',                             nr: 48,  klasse: 'GTD_PRO', merk: 'Mercedes',    auto: 'Mercedes-AMG GT3 Evo', team: 'Winward Racing',                       drivers: ['JasonHart','LucaStolz','MaximeMartin','ScottNoble'],                     land: 'us' },

  // ── GTD ───────────────────────────────────────────────────────────────────
  { id: 'af-corse-no-21',                                   nr: 21,  klasse: 'GTD',     merk: 'Ferrari',     auto: 'Ferrari 296 GT3 Evo', team: 'AF Corse USA',                          drivers: ['AntonioFuoco','LilouWadoux','SimonMann','TommasoMosca'],                 land: 'it' },
  { id: 'ao-racing-no-99',                                  nr: 99,  klasse: 'LMP2',    merk: 'ORECA',       auto: 'ORECA 07 Gibson',     team: 'AO Racing',                             drivers: ['ChristianRasmussen','DaneCameron','JonnyEdgar','PJHyett'],               land: 'us' },
  { id: 'conquest-racing-no-34',                            nr: 34,  klasse: 'GTD',     merk: 'Ferrari',     auto: 'Ferrari 296 GT3 Evo', team: 'Conquest Racing',                       drivers: ['AlbertCosta','LorenzoPatrese','MannyFranco','ThierryVermeulen'],          land: 'us' },
  { id: 'dragonspeed-no-81',                                nr: 81,  klasse: 'GTD',     merk: 'Chevrolet',   auto: 'Chevrolet Corvette Z06 GT3.R', team: 'DragonSpeed',                   drivers: ['CasperStevenson','GiacomoAltoe','HenrikHedman','MatteoCairoli'],         land: 'us' },
  { id: 'dxdt-racing-no-36',                                nr: 36,  klasse: 'GTD',     merk: 'Chevrolet',   auto: 'Chevrolet Corvette Z06 GT3.R', team: 'DXDT Racing',                   drivers: ['CharlieEastwood','MasonFilippi','RobertWickens','SalihYoluc','ScottMcLaughlin'], land: 'us' },
  { id: 'gradient-racing-no-66',                            nr: 66,  klasse: 'GTD',     merk: 'Ford',        auto: 'Ford Mustang GT3 Evo', team: 'Gradient Racing',                      drivers: ['TillBechtolsheimer','CoreyLewis','JakeWalker','JoeyHand'],               land: 'us' },
  { id: 'inception-racing-no-70',                           nr: 70,  klasse: 'GTD',     merk: 'Ferrari',     auto: 'Ferrari 296 GT3 Evo', team: 'Inception Racing',                      drivers: ['BrendanIribe','DavidFumanelli','FrederikSchandorff','OllieMillroy'],     land: 'gb' },
  { id: 'lone-star-racing-no-80',                           nr: 80,  klasse: 'GTD',     merk: 'Mercedes',    auto: 'Mercedes-AMG GT3 Evo', team: 'Lone Star Racing',                     drivers: ['JamesRoe','LinHodenius','RalfAron','ScottAndrews'],                      land: 'us' },
  { id: 'magnus-racing-no-44',                              nr: 44,  klasse: 'GTD',     merk: 'Aston',       auto: 'Aston Martin Vantage AMR GT3 Evo', team: 'Magnus Racing',            drivers: ['JohnPotter','MadisonSnow','NickiThiim','SpencerPumpelly'],               land: 'us' },
  { id: 'manthey-1st-phorm-no-912',                         nr: 912, klasse: 'GTD',     merk: 'Porsche',     auto: 'Porsche 911 GT3 R',   team: 'Manthey 1st Phorm',                     drivers: ['MorrisSchuring','RiccardoPera','RichardLietz','RyanHardwick'],            land: 'de' },
  { id: 'muehlner-motorsports-america-no-123',              nr: 123, klasse: 'GTD',     merk: 'Porsche',     auto: 'Porsche 911 GT3 R',   team: 'Mühlner Motorsports America',           drivers: ['DaveMusial','DaveMusialJr','PeterLudwig','RyanYardley'],                  land: 'us' },
  { id: 'myers-riley-motorsports-no-16',                    nr: 16,  klasse: 'GTD',     merk: 'Ford',        auto: 'Ford Mustang GT3 Evo', team: 'Myers Riley Motorsports',              drivers: ['FelipeFraga','JensonAltzman','RomainGrosjean','SheenaMonk'],              land: 'us' },
  { id: 'rs1-no-28-iwsc',                                   nr: 28,  klasse: 'GTD',     merk: 'Porsche',     auto: 'Porsche 911 GT3 R',   team: 'RS1',                                   drivers: ['DillonMachavern','EricZitza','JanHeylen','SpencerPumpelly','SvenMuller'], land: 'us' },
  { id: 'the-13-autosport-no-13',                           nr: 13,  klasse: 'GTD',     merk: 'Chevrolet',   auto: 'Chevrolet Corvette Z06 GT3.R', team: '13 Autosport',                  drivers: ['BenGreen','LarsKern','MatthewBell','OreyFidani'],                        land: 'us' },
  { id: 'triarsi-competizione-no-023',                      nr: 23,  klasse: 'GTD',     merk: 'Ferrari',     auto: 'Ferrari 296 GT3 Evo', team: 'Triarsi Competizione',                  drivers: ['KentonKoch','OnofrioTriarsi','RobertMegennis','YifeiYe'],                land: 'it' },
  { id: 'turner-motorsport-no-96',                          nr: 96,  klasse: 'GTD',     merk: 'BMW',         auto: 'BMW M4 GT3 Evo',      team: 'Turner Motorsport',                     drivers: ['FrancisSelldorff','JensKlingmann','PatrickGallagher','RobbyFoley'],       land: 'us' },
  { id: 'van-der-steur-racing-no-19-2',                     nr: 19,  klasse: 'GTD',     merk: 'Aston',       auto: 'Aston Martin Vantage AMR GT3 Evo', team: 'van der Steur Racing',     drivers: ['CarlBennett','RoryvanderSteur','SebastienBaud','ValentinHasseClot'],      land: 'us' },
  { id: 'vasser-sullivan-no-12',                            nr: 12,  klasse: 'GTD',     merk: 'Lexus',       auto: 'Lexus RC F GT3',      team: 'Vasser Sullivan Racing',                drivers: ['AaronTelitz','BenjaminPedersen','EstebanMasson','FrankieMontecalvo'],    land: 'us' },
  { id: 'vasser-sullivan-no-14',                            nr: 14,  klasse: 'GTD_PRO', merk: 'Lexus',       auto: 'Lexus RC F GT3',      team: 'Vasser Sullivan Racing',                drivers: ['AaronTelitz','BenBarnicoat','ChazMostert','JackHawksworth','KyleKirkwood'], land: 'us' },
  { id: 'wayne-taylor-racing-no-45',                        nr: 45,  klasse: 'GTD',     merk: 'Lamborghini', auto: 'Lamborghini Huracán GT3 Evo 2', team: 'Wayne Taylor Racing',         drivers: ['DannyFormal','GrahamDoyle','MarcusEricsson','TrentHindman'],              land: 'us' },
  { id: 'winward-racing-no-57',                             nr: 57,  klasse: 'GTD',     merk: 'Mercedes',    auto: 'Mercedes-AMG GT3 Evo', team: 'Winward Racing',                       drivers: ['IndyDontje','LucasAuer','PhilipEllis','RussellWard'],                     land: 'us' },
  { id: 'wright-motorsports-no-120',                        nr: 120, klasse: 'GTD',     merk: 'Porsche',     auto: 'Porsche 911 GT3 R',   team: 'Wright Motorsports',                    drivers: ['AdamAdelson','CallumIlott','ElliottSkeer','TomSargent'],                  land: 'us' },
]

// Deduplicate (awa-no-13 zat dubbel)
const TEAMS_CLEAN = TEAMS.filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i)
  .sort((a, b) => {
    const volgorde = ['GTP', 'LMP2', 'GTD_PRO', 'GTD']
    const av = volgorde.indexOf(a.klasse)
    const bv = volgorde.indexOf(b.klasse)
    if (av !== bv) return av - bv
    return a.nr - b.nr
  })

// ─── Vlag helper ─────────────────────────────────────────────────────────────
function DriverFlag({ driver, style, className }: { driver: string; style?: React.CSSProperties; className?: string }) {
  const code = DRIVER_FLAGS[driver]
  if (!code) return null
  return (
    <img src={`/imsa/flags/${code}.svg`} alt={code}
      className={className} style={style}
      onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
  )
}


// ─── Afbeelding helpers ───────────────────────────────────────────────────────
function AutoImg({ team, style }: { team: Team; style?: React.CSSProperties }) {
  const src = `/imsa/${team.id}/${team.id}.webp`
  return (
    <img src={src} alt={`#${team.nr}`} style={style}
      onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }} />
  )
}

function DriverImg({ team, driver, style }: { team: Team; driver: string; style?: React.CSSProperties }) {
  const src = `/imsa/${team.id}/${driver}.webp`
  return (
    <img src={src} alt={driver} style={style}
      onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
  )
}

// ─── Driver naam splitsen (VoornaamAchternaam → Voornaam Achternaam) ──────────
function formatDriverNaam(raw: string): { voornaam: string; achternaam: string } {
  // Split op hoofdletter na kleine letter: "ColinBraun" → "Colin Braun"
  const spaced = raw.replace(/([a-z])([A-Z])/g, '$1 $2')
  const parts = spaced.trim().split(' ')
  if (parts.length === 1) return { voornaam: '', achternaam: parts[0] }
  const achternaam = parts[parts.length - 1]
  const voornaam = parts.slice(0, -1).join(' ')
  return { voornaam, achternaam }
}

// ─── Popup ────────────────────────────────────────────────────────────────────
function TeamPopup({ team, onSluit }: { team: Team; onSluit: () => void }) {
  const kleur     = KLASSE_KLEUR[team.klasse] ?? IMSA_BLAUW
  const merkKleur = MERK_KLEUR[team.merk] ?? kleur
  const [tab, setTab] = useState<'overzicht' | 'drivers'>('overzicht')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onSluit}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex"
        style={{ background: '#0f0f0f', border: `1px solid ${kleur}50`, maxHeight: '90vh', minHeight: 480 }}
        onClick={e => e.stopPropagation()}>

        {/* ── LINKER PANEEL ── */}
        <div className="relative flex-shrink-0 flex flex-col"
          style={{ width: 240, background: `linear-gradient(180deg, ${kleur}22 0%, #0a0a0a 60%)`, overflowY: 'auto', maxHeight: '90vh' }}>

          <div className="px-5 pt-5 pb-2">
            <div className="font-ui text-[10px] font-bold uppercase tracking-[2px] mb-1" style={{ color: kleur }}>
              {KLASSE_LABEL[team.klasse]}
            </div>
            <div className="font-head font-black text-4xl leading-none" style={{ color: kleur }}>
              #{team.nr}
            </div>
            <div className="font-head font-black text-lg uppercase text-white mt-1 leading-tight">
              {team.team}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-0.5 h-3 rounded-full" style={{ background: merkKleur }} />
              <span className="font-ui text-xs font-bold uppercase" style={{ color: merkKleur }}>{team.merk}</span>
            </div>
          </div>

          {/* Auto groot */}
          <div className="mx-3 my-2 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${merkKleur}15, rgba(255,255,255,0.02))`, border: `1px solid ${merkKleur}30`, height: 160 }}>
            <AutoImg team={team} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12, filter: `drop-shadow(0 4px 16px ${merkKleur}50)` }} />
          </div>

          {/* Info */}
          <div className="px-4 py-3 space-y-2.5">
            {[
              { icon: '🏎️', label: 'Auto',     val: team.auto },
              { icon: '🏁', label: 'Klasse',   val: KLASSE_LABEL[team.klasse] },
              { icon: '🔢', label: 'Nummer',   val: `#${team.nr}` },
              { icon: '👥', label: 'Drivers',  val: `${team.drivers.length} rijders` },
            ].map(({ icon, label, val }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-xs mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                  <div className="font-ui text-xs text-white/80">{val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RECHTER PANEEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tabs */}
          <div className="flex items-center justify-between px-6 pt-5 flex-shrink-0"
            style={{ borderBottom: `1px solid ${kleur}25` }}>
            <div className="flex gap-1">
              {(['overzicht', 'drivers'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all"
                  style={tab === t
                    ? { color: kleur, borderBottom: `2px solid ${kleur}` }
                    : { color: 'rgba(255,255,255,0.35)', borderBottom: '2px solid transparent' }}>
                  {t === 'overzicht' ? 'Overzicht' : 'Rijders'}
                </button>
              ))}
            </div>
            <button onClick={onSluit}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm mb-1">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* OVERZICHT */}
            {tab === 'overzicht' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Team',    val: team.team },
                    { label: 'Nummer',  val: `#${team.nr}` },
                    { label: 'Klasse',  val: KLASSE_LABEL[team.klasse] },
                    { label: 'Merk',    val: team.merk },
                    { label: 'Auto',    val: team.auto },
                    { label: 'Rijders', val: `${team.drivers.length}` },
                  ].map(({ label, val }) => (
                    <div key={label} className="rounded-xl p-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mb-1">{label}</div>
                      <div className="font-ui text-sm font-semibold text-white truncate">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Auto groot */}
                <div className="rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${merkKleur}12, rgba(255,255,255,0.02))`, border: `1px solid ${merkKleur}25`, height: 200 }}>
                  <AutoImg team={team} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 20, filter: `drop-shadow(0 6px 20px ${merkKleur}60)` }} />
                </div>

                {/* Driver thumbnails */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-0.5 rounded-full" style={{ background: kleur }} />
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">Rijders</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {team.drivers.map(d => {
                      const { voornaam, achternaam } = formatDriverNaam(d)
                      return (
                        <div key={d} className="flex flex-col items-center gap-1">
                          <div className="rounded-xl overflow-hidden"
                            style={{ width: 64, height: 80, background: 'rgba(255,255,255,0.04)', border: `1px solid ${kleur}30` }}>
                            <DriverImg team={team} driver={d}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <DriverFlag driver={d} style={{ width: 14, height: 10, objectFit: 'cover', borderRadius: 1 }} />
                            <span className="font-ui text-[9px] text-white/80 font-bold">{achternaam}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* RIJDERS */}
            {tab === 'drivers' && (
              <div className="space-y-3">
                {team.drivers.map(d => {
                  const { voornaam, achternaam } = formatDriverNaam(d)
                  return (
                    <div key={d} className="flex items-center gap-4 rounded-xl p-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${kleur}20` }}>
                      <div className="flex-shrink-0 rounded-xl overflow-hidden"
                        style={{ width: 72, height: 88, background: 'rgba(255,255,255,0.03)' }}>
                        <DriverImg team={team} driver={d}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                      </div>
                      <div>
                        <div className="font-ui text-sm text-white/50">{voornaam}</div>
                        <div className="font-head font-black text-xl uppercase text-white">{achternaam}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <DriverFlag driver={d} style={{ width: 22, height: 15, objectFit: 'cover', borderRadius: 2 }} />
                          <div className="w-0.5 h-3 rounded-full" style={{ background: kleur }} />
                          <span className="font-ui text-xs text-white/40">{team.team}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Team rij ─────────────────────────────────────────────────────────────────
function TeamRij({ team, isEven, onKlik }: { team: Team; isEven: boolean; onKlik: () => void }) {
  const kleur     = KLASSE_KLEUR[team.klasse] ?? IMSA_BLAUW
  const merkKleur = MERK_KLEUR[team.merk] ?? kleur

  return (
    <div className="relative flex items-center group cursor-pointer overflow-hidden transition-all duration-300"
      style={{ background: isEven ? 'rgba(255,255,255,0.025)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 88 }}
      onClick={onKlik}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isEven ? 'rgba(255,255,255,0.025)' : 'transparent' }}>

      {/* Linkerkant balk */}
      <div className="absolute left-0 top-0 h-full w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r"
        style={{ background: kleur }} />

      {/* Groot nummer achtergrond */}
      <div className="absolute font-head font-black select-none pointer-events-none"
        style={{ fontSize: 96, color: merkKleur, opacity: 0.07, left: '55%', top: '50%', transform: 'translate(-50%, -50%)', lineHeight: 1, letterSpacing: '-4px' }}>
        {team.nr}
      </div>

      {/* Klasse badge */}
      <div className="flex-shrink-0 flex items-center justify-center pl-4" style={{ width: 72 }}>
        <span className="font-ui text-[9px] font-black uppercase px-2 py-1 rounded"
          style={{ background: kleur + '22', color: kleur, border: `1px solid ${kleur}44`, whiteSpace: 'nowrap' }}>
          {KLASSE_LABEL[team.klasse]}
        </span>
      </div>

      {/* Driver foto's — klein rij */}
      <div className="flex-shrink-0 flex items-center" style={{ width: 88, height: 88, overflow: 'hidden' }}>
        {team.drivers.slice(0, 1).map(d => (
          <DriverImg key={d} team={team} driver={d}
            style={{ width: 88, height: 100, objectFit: 'cover', objectPosition: 'top center', marginTop: -4, filter: 'drop-shadow(2px 0 8px rgba(0,0,0,0.5))' }} />
        ))}
      </div>

      {/* Team info */}
      <div className="flex-1 flex flex-col justify-center px-5 min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="font-head font-black text-2xl leading-none" style={{ color: kleur }}>#{team.nr}</span>
          <span className="font-head font-black text-lg uppercase text-white tracking-wide truncate">{team.team}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-0.5 h-3 rounded-full flex-shrink-0" style={{ background: merkKleur }} />
          <span className="font-ui text-xs font-bold uppercase tracking-wider flex-shrink-0" style={{ color: merkKleur, opacity: 0.85 }}>{team.merk}</span>
          <span className="font-ui text-xs text-white/25">·</span>
          <span className="font-ui text-xs text-white/30 truncate">{team.auto}</span>
        </div>
        {/* Driver namen preview met vlaggetjes */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {team.drivers.map((d, i) => {
            const { achternaam } = formatDriverNaam(d)
            return (
              <span key={d} className="flex items-center gap-1">
                <DriverFlag driver={d} style={{ width: 16, height: 11, objectFit: 'cover', borderRadius: 2, opacity: 0.7 }} />
                <span className="font-ui text-[10px] text-white/25 group-hover:text-white/50 transition-colors">
                  {achternaam}{i < team.drivers.length - 1 ? ' ·' : ''}
                </span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Auto */}
      <div className="flex-shrink-0 relative flex items-center justify-center"
        style={{ width: 320, height: 88, overflow: 'hidden' }}>
        <div className="absolute inset-y-2 left-2 right-2 rounded-xl"
          style={{ background: `linear-gradient(135deg, ${merkKleur}22, ${merkKleur}08)`, border: `1px solid ${merkKleur}40` }} />
        <AutoImg team={team} style={{ position: 'relative', width: 300, height: 76, objectFit: 'contain', objectPosition: 'center', filter: `drop-shadow(0 2px 14px ${merkKleur}50)`, transition: 'transform 0.3s ease' }} />
      </div>
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function IMSA() {
  const [klasseFilter, setKlasseFilter] = useState<string | null>(null)
  const [merkFilter,   setMerkFilter]   = useState<string | null>(null)
  const [zoek,         setZoek]         = useState('')
  const [popup,        setPopup]        = useState<Team | null>(null)

  const klassen = ['GTP', 'LMP2', 'GTD_PRO', 'GTD']
  const merken  = Array.from(new Set(TEAMS_CLEAN.map(t => t.merk))).sort()

  const gefilterd = TEAMS_CLEAN.filter(t => {
    const matchKlasse = !klasseFilter || t.klasse === klasseFilter
    const matchMerk   = !merkFilter   || t.merk   === merkFilter
    const matchZoek   = !zoek         || `${t.team} ${t.merk} ${t.auto} ${t.nr} ${t.drivers.join(' ')}`.toLowerCase().includes(zoek.toLowerCase())
    return matchKlasse && matchMerk && matchZoek
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">

      {/* Header */}
      <div className="mb-1" style={{ color: IMSA_GROEN }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none">
          <span style={{ color: IMSA_GROEN }}>IMSA</span> WeatherTech
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">
          SportsCar Championship · {TEAMS_CLEAN.length} teams
        </span>
      </div>

      {/* Klasse tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setKlasseFilter(null)}
          className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all"
          style={!klasseFilter ? { background: IMSA_GROEN + '22', borderColor: IMSA_GROEN, color: IMSA_GROEN } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
          Alle
        </button>
        {klassen.map(k => {
          const kl = KLASSE_KLEUR[k]; const ac = klasseFilter === k
          return (
            <button key={k} onClick={() => setKlasseFilter(ac ? null : k)}
              className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all"
              style={ac ? { background: kl + '22', borderColor: kl, color: kl } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
              {KLASSE_LABEL[k]}
            </button>
          )
        })}
      </div>

      {/* Zoek + merk filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input type="text" placeholder="Zoek team, merk, driver..." value={zoek}
          onChange={e => setZoek(e.target.value)}
          className="font-ui text-sm px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-light placeholder-brand-muted focus:outline-none w-full md:w-72" />
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setMerkFilter(null)}
            className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
            style={!merkFilter ? { background: IMSA_GROEN + '22', borderColor: IMSA_GROEN, color: IMSA_GROEN } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
            Alle
          </button>
          {merken.map(m => {
            const mk = MERK_KLEUR[m] ?? IMSA_BLAUW; const ac = merkFilter === m
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

      {/* Grid tabel */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
        <div className="flex items-center" style={{ background: '#0a0a0a', borderBottom: '1px solid #222' }}>
          <div style={{ width: 72 }} />
          <div style={{ width: 88 }} />
          <div className="flex-1 px-5 py-3">
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Team</span>
          </div>
          <div className="py-3" style={{ width: 320 }}>
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Auto</span>
          </div>
        </div>

        {gefilterd.map((t, i) => (
          <TeamRij key={t.id} team={t} isEven={i % 2 === 0} onKlik={() => setPopup(t)} />
        ))}
        {gefilterd.length === 0 && (
          <div className="py-16 text-center font-ui text-sm text-white/30">Geen teams gevonden.</div>
        )}
      </div>

      {popup && <TeamPopup team={popup} onSluit={() => setPopup(null)} />}
    </div>
  )
}
