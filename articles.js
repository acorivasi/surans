// Surans — articole si ghiduri despre parfumerie
const ARTICLES = [
  {
    slug: "cat-tine-un-parfum-pe-piele",
    category: "Ghid",
    title: "Cât ține un parfum pe piele? Ghid despre longevitate",
    excerpt: "Longevitatea unui parfum nu depinde doar de cât de „tare” miroase la aplicare. Iată ce influențează de fapt cât rezistă un parfum pe pielea ta.",
    readMinutes: 6,
    publishedLabel: "2026",
    body: `
      <p>Ai simțit probabil diferența: același parfum ține ore întregi pe o prietenă și dispare în două ore pe tine. Nu e o impresie — longevitatea unui parfum e influențată de mai mulți factori care țin atât de compoziția lui, cât și de tine.</p>

      <h3>1. Concentrația de ulei parfumat</h3>
      <p>Primul factor, și cel mai ușor de verificat, e concentrația: Eau de Cologne (2-5% ulei parfumat), Eau de Toilette (5-15%), Eau de Parfum (15-20%) și Parfum/Extrait (20-40%). Cu cât concentrația e mai mare, cu atât molecule mai multe rămân pe piele mai mult timp — de-asta un Extrait de Parfum poate ține 8-10 ore, iar un EDT similar ca profil olfactiv doar 3-4.</p>

      <h3>2. Tipul tău de piele</h3>
      <p>Pielea uscată reține parfumul mai puțin bine decât pielea grasă sau bine hidratată — uleiurile naturale din piele „prind” moleculele parfumului și le eliberează treptat. De-asta parfumul aplicat pe piele proaspăt hidratată (cremă neutră, fără miros) ține vizibil mai mult decât pe piele uscată.</p>

      <h3>3. Unde și cum aplici</h3>
      <p>Punctele pulsatile (încheieturi, gât, spatele urechilor, interiorul coatelor) sunt mai calde și ajută parfumul să se difuzeze constant pe parcursul zilei. Frecarea încheieturilor una de alta după aplicare (un obicei foarte răspândit) rupe de fapt structura moleculelor de vârf și poate reduce longevitatea — mai bine lași parfumul să se usuce natural pe piele.</p>

      <h3>4. Structura notelor din parfum</h3>
      <p>Un parfum bogat în note de bază grele — oud, chihlimbar, mosc, vanilie, patchouli, lemn de santal — ține în mod natural mai mult decât unul dominat de note de vârf ușoare (citrice, verzi, acvatice), care se evaporă rapid indiferent de concentrație. De-asta multe parfumuri arăbești/orientale (bogate în oud și rășini) au reputația de longevitate mare.</p>

      <h3>5. Clima și temperatura corpului</h3>
      <p>Căldura accelerează evaporarea — vara, un parfum „arde” mai repede decât iarna, la aceeași concentrație. Temperatura corporală proprie joacă și ea un rol: cine are temperatura corpului puțin mai ridicată tinde să simtă parfumul „mai tare”, dar și să-l consume mai rapid.</p>

      <h3>Câteva sfaturi practice</h3>
      <ul>
        <li>Aplică parfumul imediat după duș, pe piele curată și hidratată.</li>
        <li>Țintește punctele pulsatile, nu doar hainele.</li>
        <li>Nu freca încheieturile una de alta.</li>
        <li>Pentru longevitate maximă, ia în calcul o concentrație mai mare (EDP/Extrait) sau un parfum cu bază grea.</li>
        <li>Păstrează sticla ferită de lumină directă și căldură — parfumul se degradează în timp și pierde din intensitate.</li>
      </ul>

      <p>Pe Surans poți vedea pentru fiecare parfum piramida completă de note (vârf, inimă, bază) — un indiciu bun despre cât de „grea” și, implicit, cât de persistentă e compoziția, înainte să cumperi.</p>
    `
  },
  {
    slug: "de-ce-unele-parfumuri-persista-mai-mult",
    category: "Explicat",
    title: "De ce unele parfumuri persistă mai mult: concentrație, note de bază și fixatori",
    excerpt: "Doi parfumi pot avea „intensitate” similară la prima mirosire și totuși unul să dispară în 2 ore, iar celălalt să reziste toată ziua. Explicăm de ce.",
    readMinutes: 5,
    publishedLabel: "2026",
    body: `
      <p>Persistența unui parfum e, în mare parte, chimie — molecule mai grele și mai puțin volatile evaporă mai încet. Iată factorii concreți care fac diferența.</p>

      <h3>Concentrația contează mai mult decât crezi</h3>
      <p>Diferența dintre un Eau de Toilette (5-15% ulei parfumat) și un Eau de Parfum (15-20%) al aceleiași formule poate însemna diferența dintre 3-4 ore și 6-8 ore de longevitate. Nu e doar despre „cât de tare miroase” la aplicare, ci despre câtă substanță e fizic disponibilă să se evapore treptat pe parcursul zilei.</p>

      <h3>Volatilitatea moleculelor</h3>
      <p>Fiecare notă olfactivă e formată din molecule cu greutăți diferite, care se evaporă în ritmuri diferite:</p>
      <ul>
        <li><b>Notele de vârf</b> (citrice, note verzi, ierburi aromatice) au molecule mici și ușoare — se simt primele, dar dispar în 15-30 de minute.</li>
        <li><b>Notele de inimă</b> (florale, condimente, fructe) au molecule medii — apar după ce vârful se estompează și rezistă 1-3 ore.</li>
        <li><b>Notele de bază</b> (chihlimbar, mosc, oud, lemn de santal, vanilie, patchouli) au molecule mari și grele — se evaporă cel mai încet, uneori pe parcursul a 6-10+ ore, și dau parfumului „coada” pe care o mai simți seara.</li>
      </ul>

      <h3>Rolul fixatorilor</h3>
      <p>Fixatorii sunt ingrediente — de obicei din familia notelor de bază — care încetinesc evaporarea întregii compoziții, nu doar a lor înșiși. Chihlimbarul, moscul (natural sau sintetic), rășinile (labdanum, benzoică, tămâie) și lemnul de santal sunt fixatori clasici. Un parfumier care vrea un parfum persistent va construi baza compoziției pe astfel de ingrediente, indiferent cât de proaspăt e vârful.</p>

      <h3>De ce parfumurile orientale/arăbești au reputația de longevitate mare</h3>
      <p>Multe parfumuri din stilul arăbesc/oriental (oud, ambră, mosc, condimente calde) sunt construite aproape integral pe note de bază grele, cu foarte puțin sau deloc vârf citric-volatil. Rezultatul: se simt intens ore în șir, uneori și a doua zi pe haine. E o alegere de compoziție, nu „magie” — aceeași logică se poate aplica oricărui parfum bogat în note de bază.</p>

      <h3>Ce înseamnă asta practic pentru tine</h3>
      <p>Dacă cauți un parfum care ține toată ziua, uită-te la două lucruri înainte să cumperi: concentrația (EDP sau Extrait, nu EDT/EDC) și componența bazei — cu cât apar mai multe note grele (oud, chihlimbar, mosc, lemn, vanilie, patchouli), cu atât persistența va fi mai mare. Pe fiecare pagină de produs de pe Surans găsești exact piramida asta, ca să poți compara înainte de cumpărare.</p>
    `
  },
  {
    slug: "piramida-olfactiva-explicata",
    category: "Explicat",
    title: "Piramida olfactivă: cum influențează notele de vârf, inimă și bază experiența parfumului",
    excerpt: "Vârf, inimă, bază — termenii apar pe orice etichetă de parfum, dar ce înseamnă mai exact și de ce contează pentru cum alegi și cum porți un parfum?",
    readMinutes: 5,
    publishedLabel: "2026",
    body: `
      <p>Orice parfum bine construit nu miroase la fel din prima secundă până la ultima oră. Se schimbă, evoluează, „se deschide” — și tocmai asta descrie piramida olfactivă.</p>

      <h3>Ce este piramida olfactivă</h3>
      <p>E un model clasic din parfumerie care împarte notele unui parfum în trei etaje, în funcție de cât de repede se evaporă și când devin dominante pe piele:</p>

      <h3>Notele de vârf (primele 15-30 de minute)</h3>
      <p>Sunt prima impresie — de obicei citrice (bergamotă, lămâie, grapefruit), note verzi, aromatice sau ușor fructate. Sunt molecule mici, volatile, care se simt intens la aplicare și apoi dispar rapid, lăsând loc notelor de inimă. Nu judeca niciodată un parfum definitiv doar din flaconul mirosit în magazin — asta e doar vârful.</p>

      <h3>Notele de inimă (30 de minute - 2-3 ore)</h3>
      <p>Sunt „sufletul” parfumului — de obicei florale (trandafir, iasomie, flori de portocal), condimente (scorțișoară, cardamom, șofran) sau fructe mai grele. Apar pe măsură ce vârful se estompează și definesc caracterul principal al parfumului pentru cea mai mare parte a purtării lui în timpul zilei.</p>

      <h3>Notele de bază (de la 1-2 ore până seara/a doua zi)</h3>
      <p>Sunt fundația — chihlimbar, mosc, lemn de santal, oud, vanilie, patchouli, rășini. Molecule grele, cu evaporare lentă, care dau parfumului adâncime, căldură și longevitate. „Coada” pe care o mai simți pe haine seara sau a doua zi vine aproape întotdeauna din notele de bază.</p>

      <h3>De ce contează pentru tine, practic</h3>
      <ul>
        <li><b>Alegere informată:</b> dacă vrei un parfum de zi, discret, caută unul cu vârf și inimă dominante și bază ușoară. Pentru seară sau iarnă, caută baze grele (oud, chihlimbar, vanilie).</li>
        <li><b>Testare corectă:</b> un parfum trebuie purtat minimum 2-3 ore înainte să-ți dai verdictul — abia atunci ajungi la nota de inimă, care e de obicei caracterul real al parfumului.</li>
        <li><b>Compatibilitate sezonieră:</b> parfumurile cu vârf citric/verde funcționează bine vara; cele cu bază grea (oud, vanilie, condimente) se simt mai bine iarna — exact convenția pe care o folosim și noi pentru eticheta de „sezon” de pe fiecare produs.</li>
        <li><b>Găsirea de dupe-uri corecte:</b> două parfumuri „similare” trebuie comparate mai ales pe notele de inimă și bază, nu doar pe vârf — de-asta comparăm parfumurile pe Surans după toată piramida, nu doar după un singur ingredient comun.</li>
      </ul>

      <p>Data viitoare când te uiți la un parfum pe Surans, piramida de Vârf / Inimă / Bază de pe pagina de produs nu e doar o listă de ingrediente — e practic un program al modului în care parfumul o să evolueze pe pielea ta, oră de oră.</p>
    `
  }
];
