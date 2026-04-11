
Mål

- Fikse mobil-spacingen i posisjonslisten uten å ødelegge desktop, som allerede ser bra ut.

Hva som faktisk skjer nå

- Koden ligger i `src/pages/Index.tsx`.
- Mobiloppsettet for seksjonen ligger i `GameSection` (`ca. linje 501–534`).
- Selve “havet av plass” kommer ikke fra containeren rundt lista. Mobil-listene bruker allerede `space-y-0`.
- Problemet sitter i `PositionCard` (`ca. linje 637–709`), som brukes likt på desktop og mobil.
- Den viktigste synderen er `tagline` på `ca. linje 687`: den er fortsatt synlig når kortet er lukket. På desktop ser det ut som bevisst kortinnhold. På mobil, i en smal og tett stack, leses den samme høyden som tomrom mellom elementene.
- På mobil blir dette ekstra stygt fordi:
  - teksten kan wrappe til flere linjer
  - kortene ikke har tydelig “boks”-bakgrunn i lukket state
  - samme desktop-orienterte komponent brukes i en helt annen mobilkontekst
- Strukturen er også skjør: hele kortet er en `<button>` som inneholder `div`, `h3` og `p`. Det er dårlig/fragil button-markup og kan gi ulik oppførsel i mobilnettlesere.

Plan for å fikse det

1. Skille mobil og desktop tydelig
- Ikke prøve flere mikrojuseringer i samme komponent.
- Lage en egen kompakt mobilvariant for posisjonskortene, eller en tydelig mobilgren i `PositionCard`.
- Desktop beholdes visuelt nesten urørt.

2. Gjøre lukket mobilkort mye enklere
- I lukket mobilstate skal kortet kun vise:
  - ikon
  - navn
  - forkortelse
  - chevron
- `tagline` flyttes inn i utvidet innhold på mobil.
- Dette kutter den falske høyden som nå oppleves som mellomrom.

3. Rydde HTML-strukturen
- Bytte fra “hele kortet er en button” til:
  - en ytre `article/div`
  - en intern `button` kun for toggle-header
  - et separat collapsible content-område under
- Dette gjør høyden mer forutsigbar og reduserer mobilspesifikke rendering-avvik.

4. Gjøre collapse-state helt flat
- Sørge for at lukket state ikke har noen synlig tekst, margin eller padding som fortsatt tar høyde.
- Beholde grid-basert animasjon, men bare på detaljinnholdet.
- Eventuell toppmargin på detaljinnhold skal kun eksistere når kortet er åpent.

5. Finjustere mobilvisuell rytme
- Stramme inn `py`, `gap` og line-height eksplisitt på mobil.
- Legge inn en svært subtil separator/border mellom mobilradene, så de oppleves som kompakte listeelementer i stedet for store luftlommer.
- Desktop-spacingen rundt kortene beholdes.

6. Verifisere på riktige størrelser
- Kontrollere mobil på minst:
  - 390px bredde
  - 320px bredde
- Teste både lukket og åpen state for alle posisjoner.
- Kontrollere at desktop fortsatt ser ut som nå.
- Sjekke at navn/forkortelser ikke wraper stygt.

Berørte kodeområder

- `src/pages/Index.tsx:501–534` — mobil-layout for “Dette er flaggfotball”
- `src/pages/Index.tsx:637–709` — `PositionCard`

Hva jeg ikke planlegger å endre i denne runden

- `FieldDiagram`
- global CSS i `src/index.css`
- desktop-layouten rundt diagrammet, utover å koble inn den riktige card-varianten

Forventet resultat

- Mobil får en tett, ryddig og tydelig posisjonsliste uten kunstig luft mellom elementene.
- Desktop beholder uttrykket som allerede fungerer.
- Åpnede kort blir fortsatt lesbare, men de lukkede kortene slutter å se ut som om de har store tomrom mellom seg.
