/**
 * Editorial content for the pigment detail pages.
 *
 * The catalogue in `data.ts` holds the facts that can be tabulated: identifiers,
 * source, formulations and regulatory status. What an answer engine actually
 * quotes is prose — a direct answer, the difference between two routes that
 * share a CAS number, and the questions a buyer actually asks. That is what
 * lives here.
 *
 * The English edition is authored. The Chinese, Japanese and Korean editions
 * follow the same shape once the pages are translated; until then the detail
 * pages exist in English only and the catalogue index in every locale links
 * across to them.
 */

export interface PigmentFaq {
  q: string;
  a: string;
}

export interface PigmentContent {
  /** The answer-first summary that opens the page. */
  answer: string;
  /**
   * Why this production route differs from another route that carries the same
   * CAS number. This is the part that answers "which one should I buy", and it
   * is the part a tabulated catalogue cannot express.
   */
  route?: string;
  /** The pigment ids that share this CAS number. */
  sameCas?: string[];
  faq: PigmentFaq[];
}

export const pigmentContent: Record<string, PigmentContent> = {
  curcumin: {
    answer:
      "Curcumin is the golden-yellow pigment extracted from turmeric rhizome (Curcuma longa) and sold as oil-dispersible, water-dispersible or standard grades. It is authorised in the EU as E 100, holds FDA GRAS Notice 000131 status in the United States, and is listed in Japan and Korea. Its main procurement risk is stability: curcumin is a polyphenol rather than a carotenoid, and it degrades in alkaline conditions, above about 100 °C and under strong light, so the formulation and the packaging have to match the application.",
    faq: [
      {
        q: "What is the CAS number of curcumin?",
        a: "Curcumin is CAS 458-37-7, with EINECS number 207-280-5. That pair identifies it on a certificate of analysis and on a customs declaration, and it is the number to quote when a buyer asks which substance is being shipped.",
      },
      {
        q: "Is curcumin approved in the EU?",
        a: "Yes. Curcumin is authorised in the EU as E 100, a colour with no numerical maximum level in most food categories, and it is also permitted in pharmaceuticals and cosmetics. It holds FDA GRAS status in the United States and is listed in Japan and Korea.",
      },
      {
        q: "Is curcumin heat stable?",
        a: "Curcumin survives most oil-based processing, but it degrades with heat above roughly 100 °C, in alkaline conditions and under strong light. Water-dispersible grades are normally encapsulated or buffered to survive those conditions, which is why the grade matters as much as the pigment name.",
      },
      {
        q: "What is curcumin used for?",
        a: "Curcumin colours oil-based foods and beverages, and it is also used in cosmetics and as a colourant in supplements. Its colour is pH dependent: it holds a yellow-orange in acid and turns red-brown as the pH rises, which constrains it to formulations that stay on the acidic side of neutral.",
      },
    ],
  },

  "beet-red": {
    answer:
      "Beet red is the red pigment extracted from red beetroot (Beta vulgaris), sold as a powder, a liquid or a microencapsulated grade. It is authorised in the EU as E 162, holds FDA GRAS status in the United States and is listed in Japan and Korea. The procurement question is almost always heat: conventional beet red fades in acidic, hot applications, so heat-stable grades rely on a protective microencapsulated coating.",
    faq: [
      {
        q: "Is beet red heat stable?",
        a: "Not by default. Conventional beet red is sensitive to heat, light and low pH, and it fades in acidic applications such as fruit beverages. Heat-stable grades use a protective microencapsulated coating, which is why the grade on the specification matters more than the pigment name.",
      },
      {
        q: "What is the E number of beet red?",
        a: "E 162 in the EU. Both beetroot red and betanin are covered by E 162, so a supplier quoting betanin is supplying the same authorised colour in a different concentration.",
      },
      {
        q: "What is the CAS number of beet red?",
        a: "7659-50-9, with EINECS number 231-628-5.",
      },
      {
        q: "Is beet red suitable for vegan products?",
        a: "Yes. Beet red is derived from red beetroot, so it carries no animal-derived processing aids and is acceptable in vegan and vegetarian formulations. It is also one of the cheapest natural reds per unit of colour, which is why it is the default in European food manufacturing.",
      },
    ],
  },

  chlorophyll: {
    answer:
      "Chlorophyll is the green pigment found in alfalfa, Chlorella and mulberry leaves, supplied as an oil-soluble, water-dispersible or copper-complex grade. It is authorised in the EU as E 140, holds FDA GRAS status in the United States and is listed in Japan and Korea. The question most buyers ask is about copper: the copper complex is more stable, but the metal-free chlorophyll that clean-label formulators need is the version with the copper removed.",
    faq: [
      {
        q: "What is the difference between E 140 and E 141?",
        a: "E 140 covers chlorophylls and chlorophyllins; E 141 covers the copper complexes of the same molecules. The copper complex is more heat and light stable, which is why it is the traditional choice for baked goods, but it is unsuitable where a metal declaration is unwanted.",
      },
      {
        q: "Is chlorophyll heat stable?",
        a: "Chlorophyll degrades to pheophytin on heating and the green fades. That is why chlorophyll is usually added late in the process, or supplied as a stabilised granule, and why copper-complex grades are chosen for products that are baked.",
      },
      {
        q: "Is copper-free chlorophyll approved?",
        a: "Yes. Copper-free chlorophyll and its sodium and potassium salts are authorised in the EU under E 140, and they hold FDA GRAS status in the United States. They are listed in Japan and Korea.",
      },
      {
        q: "What is the CAS number of chlorophyll?",
        a: "479-61-8, with EINECS number 207-536-6. Some suppliers quote the chlorophyllin sodium salt instead, so check which salt the certificate of analysis actually covers before comparing two offers.",
      },
    ],
  },

  anthocyanin: {
    answer:
      "Anthocyanins are the red-to-purple pigments available from grape skin, black carrot and purple sweet potato, and they are what E 163 exists for. They are authorised in the EU, hold FDA GRAS status in the United States and are listed in Japan and Korea. Every anthocyanin product is pH dependent: the same material runs red at pH 3 and turns blue-purple or nearly colourless as the pH rises, so the target pH has to be fixed before the grade is chosen.",
    faq: [
      {
        q: "Why does my anthocyanin change colour?",
        a: "Anthocyanins are indicator molecules: the hue follows the pH and the presence of metal ions. The colour is red below about pH 3, moves towards purple and then nearly colourless as the pH rises, and shifts towards blue if the product contains copper or aluminium. Fix the pH and the metal content of the finished product before judging the pigment.",
      },
      {
        q: "What is the difference between grape, black carrot and purple sweet potato anthocyanins?",
        a: "Grape skin anthocyanins are mostly malvidin and hold the most stable red; black carrot anthocyanins are acylated and give a deeper, more orange-shifted red that survives pasteurisation better; purple sweet potato is heat tolerant and consistent but carries a distinctive earthy note. The source also changes the regulatory file and the colour yield per unit of raw material.",
      },
      {
        q: "Is anthocyanin approved in the EU?",
        a: "Yes, as E 163. Anthocyanins are authorised in the EU, hold FDA GRAS status in the United States, and are listed in Japan and Korea.",
      },
      {
        q: "What is the CAS number of anthocyanin?",
        a: "11088-48-9, with EINECS number 234-840-6.",
      },
    ],
  },

  carotenoid: {
    answer:
      "Natural carotenoids are the orange and yellow pigments covering a wide range of plant sources — palm oil, annatto, carrot — and of fermentation routes such as Blakeslea trispora. They are authorised in the EU as E 160a, hold FDA GRAS status in the United States and are listed in Japan and Korea. Two things decide the grade: the isomer profile, because natural carotenes carry a mix of alpha, beta and other isomers that shifts the shade, and the carrier, because carotenes are oil-soluble by nature.",
    route:
      "E 160a covers both carotenes obtained from plants and carotenes produced by fermentation, and the two share CAS 7235-40-7. The route matters commercially: a fermented carotene arrives with a documented, consistent isomer profile and a controlled supply chain, while a plant-derived carotene inherits the growing conditions of the crop — and, for palm-derived material, the sustainability questions that come with palm oil.",
    faq: [
      {
        q: "What is the difference between natural and synthetic beta-carotene?",
        a: "Synthetic beta-carotene is all-trans and consistent batch to batch. Natural beta-carotene, whether from a plant or from fermentation, carries a mixed isomer profile of alpha, beta and other isomers. The mixture is what makes the natural route worth specifying, because the isomer blend changes the hue and the biological activity.",
      },
      {
        q: "Is natural carotene approved in the EU?",
        a: "Yes, as E 160a. Carotenes are authorised in the EU, hold FDA GRAS status in the United States, and are listed in Japan and Korea.",
      },
      {
        q: "What is the CAS number of natural carotene?",
        a: "7235-40-7, with EINECS number 230-636-6. The same pair covers both the plant-derived and the fermentation-derived carotenes.",
      },
      {
        q: "Is natural carotene oil soluble?",
        a: "Carotenes are oil-soluble. Water-dispersible grades exist, but they are produced by emulsification or microencapsulation, and the use level in a water-based product is correspondingly higher.",
      },
    ],
  },

  "paprika-oleoresin": {
    answer:
      "Paprika oleoresin is the red-orange extract of Capsicum annuum, standardised on its colour value in ASTA units and on its capsanthin and capsorubin content. It is authorised in the EU as E 160c, holds FDA GRAS status in the United States and is listed in Japan and Korea. Unlike annatto it carries colour and a little heat at once, so the residual pungency has to be controlled when it is used as a colour rather than as a flavour.",
    faq: [
      {
        q: "What is an ASTA unit?",
        a: "ASTA units are the colour value scale used for paprika and paprika oleoresin, based on the absorbance of a solution at 460 nm. A supplier quoting ASTA units is quoting colour strength, and the number to compare is ASTA colour value — ASTA redness and ASTA pungency are separate measurements.",
      },
      {
        q: "Is paprika oleoresin spicy?",
        a: "It carries residual pungency from the capsicum matrix, and the more the oleoresin is decolorised to raise its colour value, the less heat it carries. Paprika oleoresin used purely as a colour is normally specified with a maximum residual capsaicin.",
      },
      {
        q: "Is paprika oleoresin approved in the EU?",
        a: "Yes, as E 160c. Paprika extract is authorised in the EU, holds FDA GRAS status in the United States, and is listed in Japan and Korea.",
      },
      {
        q: "What is the difference between paprika oleoresin and annatto?",
        a: "Both sit in the E 160 group, but they are not the same additive: paprika extract is E 160c, while annatto bixin and norbixin are E 160b(i) and E 160b(ii). Annatto gives a yellow-to-orange shade with no heat; paprika oleoresin gives a red-orange shade and residual pungency.",
      },
    ],
  },

  saffron: {
    answer:
      "Saffron carotenoids are the golden-yellow pigments from Crocus sativus, built on crocin, and they have the highest colour intensity of any natural yellow. The regulatory position is the part buyers get wrong: in the EU saffron is a food, not an additive, and has never carried an E number, so saffron-based colour is declared by name. It is listed in Japan and Korea and holds FDA GRAS status in the United States.",
    faq: [
      {
        q: "Does saffron have an E number in the EU?",
        a: "No. In EU and UK law saffron is a food used for its aroma and taste with a secondary colouring effect, not an additive, and no E number has ever been assigned to it. A saffron-based colour therefore appears on the label as saffron or saffron extract, not as an E code.",
      },
      {
        q: "Why is saffron the strongest natural yellow?",
        a: "Crocin is among the most intensely coloured molecules known: a molecule of crocin carries roughly 700 times the colour intensity of a molecule of curcumin. The practical consequence is that saffron gives a clean golden yellow at a low use level, and the cost of the raw material rather than the pigment performance is what limits it.",
      },
      {
        q: "Is saffron approved in the United States?",
        a: "Yes. Saffron and its extracts hold FDA GRAS status in the United States and are listed in Japan and Korea. The EU is the market where the classification differs, and that difference is worth stating in the specification rather than discovering at the customs broker.",
      },
      {
        q: "What is the CAS number of saffron?",
        a: "2022-79-5, with EINECS number 217-956-6.",
      },
    ],
  },

  "lutein-plant": {
    answer:
      "Marigold lutein is the yellow xanthophyll extracted from Tagetes erecta petals and supplied as an oil suspension, a water-dispersible powder or a beadlet grade. It is authorised in the EU as E 161b, holds FDA GRAS status in the United States and is listed in Japan and Korea. It is the reference form of lutein in the eye-health and blue-light-protection segment, and its commercial profile is tied to marigold cultivation.",
    route:
      "Marigold lutein and fermentation lutein share CAS 127-40-2 and the same E 161b authorisation, which is why they compete on identical paperwork. They do not compete on supply: marigold lutein depends on the flower crop and its growing season, while fermentation lutein is produced year-round in a closed reactor. The plant route also has to make a distinction the fermentation route does not, between free lutein and lutein esters.",
    faq: [
      {
        q: "What is the difference between marigold lutein and fermentation lutein?",
        a: "They are the same molecule under the same CAS number and the same E 161b authorisation, so they are interchangeable for most regulatory purposes. The differences are commercial: marigold lutein comes from the flower crop and follows its growing season, fermentation lutein is produced year-round in a closed fermenter with a controlled isomer profile, and the two are priced accordingly.",
      },
      {
        q: "Is lutein approved in the EU?",
        a: "Yes, as E 161b. Lutein is authorised in the EU, holds FDA GRAS status in the United States, and is listed in Japan and Korea.",
      },
      {
        q: "What is free lutein and why does it matter?",
        a: "Free lutein is the unbound xanthophyll; lutein esters are lutein bound to a fatty acid and are the dominant form in a marigold extract. Free lutein is the form used in eye-health formulations, so the specification has to state which one the certificate of analysis covers rather than just saying lutein.",
      },
      {
        q: "What is the CAS number of lutein?",
        a: "127-40-2, with EINECS number 204-840-0. This pair covers both the marigold-derived and the fermentation-derived material.",
      },
    ],
  },

  astaxanthin: {
    answer:
      "Natural astaxanthin from Haematococcus pluvialis is the red-orange carotenoid that gives wild salmon its colour, and one of the strongest antioxidants in nature. The regulatory position is narrow and worth stating precisely: astaxanthin carries the colour identifier E 161j but is not listed for general food colouring in the EU, where astaxanthin-rich oleoresin from H. pluvialis is authorised as a novel food for supplements and astaxanthin is authorised as a feed additive for salmonid fish. It holds FDA GRAS Notice 000450 status in the United States and is listed in Japan and Korea.",
    faq: [
      {
        q: "Is astaxanthin an authorised food colour in the EU?",
        a: "No. Astaxanthin carries the identifier E 161j, but it is not listed for general food colouring in the annexes of Regulation (EC) No 1333/2008. In the EU it enters through two other doors: as a novel food for use in supplements under Regulation (EU) 2015/2283, and as a feed additive for salmonid fish.",
      },
      {
        q: "Is astaxanthin from Haematococcus pluvialis the same as synthetic astaxanthin?",
        a: "The molecule is the same, but the stereochemistry and the ester profile are not. Haematococcus astaxanthin is naturally esterified with fatty acids and is a single stereoisomer at 3S,3′-S, whereas synthetic astaxanthin is a mix of stereoisomers. That difference is why the algal route is specified separately from the fermentation and synthetic routes.",
      },
      {
        q: "What is the CAS number of astaxanthin?",
        a: "472-61-7 for astaxanthin from Haematococcus pluvialis, with EINECS number 207-451-4. The yeast-derived material carries a different CAS number, 11024-84-7.",
      },
      {
        q: "What is astaxanthin used for?",
        a: "In human nutrition it is used as an antioxidant and a colourant in supplements, functional beverages and oil-based foods. Its largest commercial use is aquaculture feed, where it restores the pink colour of farmed salmon and trout.",
      },
    ],
  },

  "astaxanthin-synthetic-biological": {
    answer:
      "Phaffia astaxanthin, produced by Xanthophyllomyces dendrorhous, formerly Phaffia rhodozyma, is the yeast-derived route to astaxanthin and the dominant one in aquaculture feed. It is authorised as a feed additive for salmonid fish, and its oleoresin is used in some supplement applications. The EU position differs from the algal route: E 161j refers to astaxanthin from Haematococcus pluvialis, and Phaffia-derived material has no E number as a food colour.",
    route:
      "Both routes deliver astaxanthin with the same colour and the same antioxidant activity, and both are used in aquaculture feed, but they are not interchangeable on paper. The Haematococcus route is the one covered by E 161j and by the EU novel food authorisation for supplements, so a buyer selling into the EU should specify the algal material for a human food use and the yeast material for feed.",
    faq: [
      {
        q: "Can Phaffia astaxanthin be used in EU food?",
        a: "Not as a food colour. E 161j covers astaxanthin from Haematococcus pluvialis specifically, and the novel food authorisation for supplements is likewise written for Haematococcus-derived oleoresin. Phaffia-derived astaxanthin is used in feed and, in some jurisdictions, in supplements under separate provisions.",
      },
      {
        q: "What is the difference between Haematococcus and Phaffia astaxanthin?",
        a: "Haematococcus pluvialis is an alga that accumulates astaxanthin in its cysts and yields a natural 3S,3′-S stereoisomer with a high esterification. Xanthophyllomyces dendrorhous is a yeast that secretes astaxanthin into the growth medium, which makes extraction simpler and cheaper, and it carries a different stereoisomer mix. The Haematococcus route costs more and is preferred for human nutrition.",
      },
      {
        q: "What is the CAS number of Phaffia astaxanthin?",
        a: "11024-84-7, with EINECS number 234-248-9.",
      },
      {
        q: "Is yeast astaxanthin suitable for vegan products?",
        a: "Yes. Xanthophyllomyces dendrorhous is a yeast, so its astaxanthin is acceptable in vegan and vegetarian products, and it carries no animal-derived processing aids.",
      },
    ],
  },

  "beta-carotene-fermentation": {
    answer:
      "Fermentation beta-carotene is produced by Blakeslea trispora in a controlled fermenter and sold as crystalline material, a standardised powder, an oil suspension or an emulsion. It carries the same CAS number and the same EU authorisation as plant-derived beta-carotene: E 160a in the EU, FDA GRAS in the United States, listed in Japan and Korea. What changes with the route is consistency — a closed fermenter holds the isomer profile and the colour value steady across batches and removes the dependence on a crop.",
    route:
      "Fermentation beta-carotene and the natural carotenes share CAS 7235-40-7 and E 160a, so they are interchangeable for regulatory purposes. The commercial difference is consistency and supply: a fermenter runs year-round with a documented isomer profile, while a plant-derived carotene follows the crop. For a buyer who has had a batch-to-batch shift in hue on a natural carotene, that is usually the deciding argument.",
    faq: [
      {
        q: "Is fermentation beta-carotene the same as plant beta-carotene?",
        a: "Chemically it is the same substance, with the same CAS number 7235-40-7 and the same EU authorisation under E 160a. The difference is in how it is made and therefore in what the batch looks like: the fermented product holds a consistent isomer profile and colour value, and it is not exposed to the variability of a growing season.",
      },
      {
        q: "Is fermentation beta-carotene suitable for vegan products?",
        a: "Yes. Blakeslea trispora is a fungus, and the fermentation route uses no animal-derived processing aids, which makes it acceptable in vegan and vegetarian formulations.",
      },
      {
        q: "Is beta-carotene approved in the EU?",
        a: "Yes, as E 160a. Carotenes are authorised in the EU, hold FDA GRAS status in the United States, and are listed in Japan and Korea.",
      },
      {
        q: "Is beta-carotene heat stable?",
        a: "Beta-carotene is more heat stable than curcumin but is still light sensitive and oxidises over time. The standard commercial mitigation is the carrier: an oil suspension with added tocopherols, or a beadlet grade with a modified starch or gum shell, protects the pigment through the process and the shelf life.",
      },
    ],
  },

  "lutein-fermentation": {
    answer:
      "Fermentation lutein is produced by Chlorella vulgaris in a closed reactor and supplied as an oil suspension, a powder or a water-dispersible grade. It carries the same CAS number and EU authorisation as marigold lutein — E 161b — and holds FDA GRAS status in the United States with listings in Japan and Korea. The argument for the route is year-round availability and a documented isomer profile, independent of a flower harvest.",
    route:
      "Fermentation lutein and marigold lutein are the same substance under CAS 127-40-2 and E 161b, so a finished product does not have to declare which one it used unless a claim or a supply-chain policy requires it. The route does change what can be promised: fermentation is independent of the marigold crop and its season, and it produces a free-lutein-dominant profile rather than the ester-dominated profile of a petal extract.",
    faq: [
      {
        q: "Is fermentation lutein better than marigold lutein?",
        a: "Neither is better in the abstract — they are the same molecule with the same authorisation. Fermentation wins on supply consistency and on availability outside the crop season; marigold wins on the long history of use and, for some buyers, on the free-lutein content a petal extract can be standardised to. The right choice follows the supply risk actually being managed.",
      },
      {
        q: "Is fermentation lutein suitable for clean label?",
        a: "Yes. Chlorella vulgaris is a microalga, the fermentation route uses no animal-derived processing aids, and the finished material is a single pigment with a short ingredient declaration.",
      },
      {
        q: "Is lutein approved in the EU?",
        a: "Yes, as E 161b. Lutein is authorised in the EU, holds FDA GRAS status in the United States, and is listed in Japan and Korea.",
      },
      {
        q: "What is the CAS number of lutein?",
        a: "127-40-2, EINECS 204-840-0 — the same pair for the marigold and the fermentation route.",
      },
    ],
  },

  canthaxanthin: {
    answer:
      "Canthaxanthin is an orange-red carotenoid with one of the highest colour values available, and it is the pigment that makes farmed salmon flesh pink. Its regulatory position is restrictive and often misunderstood: E 161g is listed in the EU but is not authorised for food, remaining permitted in medicinal products only, and it is approved as a colour additive for animal feed in the United States under 21 CFR 73.95.",
    faq: [
      {
        q: "Is canthaxanthin allowed in food in the EU?",
        a: "No. E 161g is listed but not authorised for food in the EU; it remains permitted in medicinal products. In the United States canthaxanthin is a colour additive exempt from certification for use in animal feed under 21 CFR 73.95, and it is approved in Japan and Korea.",
      },
      {
        q: "What is canthaxanthin used for?",
        a: "Its main commercial use is aquaculture feed, where it gives salmon and trout their pink flesh colour. It also appears in cosmetic bronzers and in some food applications outside the EU.",
      },
      {
        q: "Is canthaxanthin heat stable?",
        a: "Compared with most natural colourants it is unusually stable, which is one of the reasons it performs well in feed that is extruded and pelleted. It is still light sensitive, and it is insoluble in water.",
      },
      {
        q: "What is the CAS number of canthaxanthin?",
        a: "514-78-3, with EINECS number 208-187-2.",
      },
    ],
  },

  torularhodin: {
    answer:
      "Torularhodin is the red carotenoid produced by red yeasts such as Rhodotorula glutinis, and it is an emerging alternative in the natural red category. It is the one pigment in this catalogue whose market access is still being built: it is self-affirmed GRAS in the United States, under evaluation in the EU, not listed in Japan and under review in Korea. A buyer looking for a red that is not beet-based is choosing a pigment whose regulatory file still has to be assembled market by market.",
    faq: [
      {
        q: "What is the regulatory status of torularhodin?",
        a: "It is self-affirmed GRAS in the United States, under evaluation in the EU, not listed in Japan, and under review in Korea. For a project that needs an authorised status today, torularhodin is not there yet; for a project looking for a natural red with a differentiated supply story, it is worth tracking.",
      },
      {
        q: "Where does torularhodin come from?",
        a: "It is produced by red yeasts of the genera Rhodotorula and Rhodosporidium. Because it is a yeast the material is suitable for vegan products, and the fermentation route is straightforward, which is part of its appeal as a non-beet alternative.",
      },
      {
        q: "Is torularhodin heat stable?",
        a: "It is more stable than beet red but less stable than a synthetic or a carotenoid pigment. It oxidises in light and at elevated temperature, so the same packaging and antioxidant rules that apply to other carotenoids apply here.",
      },
      {
        q: "What is the CAS number of torularhodin?",
        a: "547-74-6, with EINECS number 208-943-9.",
      },
    ],
  },

  "monascus-red": {
    answer:
      "Monascus red is the pigment from Monascus purpureus, the mould that gives red rice and red yeast rice its colour, and it has been used in Asian cuisine for centuries. The commercial grades are citrinin-free, which is the decisive specification point because the wild organism produces citrinin, a nephrotoxic mycotoxin. In the EU it is used as a colouring food rather than as an authorised additive.",
    faq: [
      {
        q: "What is citrinin and why does it matter?",
        a: "Citrinin is a nephrotoxic mycotoxin that Monascus purpureus can produce. Consuming red rice or red yeast rice products that have not been controlled for it has caused documented cases of kidney failure. Every commercial monascus red grade should therefore carry a citrinin limit on its certificate of analysis, and the citrinin-free grades are the only ones used in food.",
      },
      {
        q: "Does monascus red have an E number in the EU?",
        a: "No. In the EU monascus red is used as a colouring food rather than as an authorised additive, so it has no E number; E 160c is paprika extract, and E 161c is the old code for the same pigment. It is listed in Japan and Korea and holds FDA GRAS status in the United States for citrinin-free grades.",
      },
      {
        q: "What colour does monascus red give?",
        a: "A deep red to red-orange, depending on the monacolin content and the drying conditions of the rice substrate. It is redder than paprika oleoresin and, unlike paprika, carries no pungency.",
      },
      {
        q: "What is the CAS number of monascus red?",
        a: "6852-11-7, with EINECS number 229-912-6.",
      },
    ],
  },

  "arrankin-red": {
    answer:
      "Arpink Red is a natural red pigment produced by Penicillium oxalicum, and it is the newest pigment in this catalogue. It is a genuinely novel colour: no CAS number has been assigned, the EU novel food application is still pending, and Japan and Korea are under review, while the United States status is self-affirmed GRAS. Its technical profile is attractive — heat, pH and light stability — but it is a pigment for projects that can manage a regulatory file that is still being built.",
    faq: [
      {
        q: "What is Arpink Red?",
        a: "It is a natural red pigment produced by fermentation of Penicillium oxalicum. It is a novel colour with no assigned CAS number, and it sits in the part of the market where the pigment performance is excellent and the regulatory file is still being assembled.",
      },
      {
        q: "Is Arpink Red approved in the EU?",
        a: "Not yet. A novel food application is pending in the EU, the status in the United States is self-affirmed GRAS, and Japan and Korea are under review. For a launch into the EU it needs the authorisation and, before that, the data package behind it.",
      },
      {
        q: "Is Arpink Red heat stable?",
        a: "Yes, and that is the reason it is interesting. It is described as stable to heat, pH and light, which places it closer to a synthetic azo dye in performance than to beet red or paprika extract. It also carries no pungency.",
      },
      {
        q: "Why does Arpink Red have no CAS number?",
        a: "A CAS number is assigned to a defined substance, and this pigment is still being defined: the fermentation route, the strain and the purification steps are what determine the material, so the registry has not settled on an identifier. Suppliers quote their own grade codes instead.",
      },
    ],
  },

  phycocyanin: {
    answer:
      "Phycocyanin is the blue pigment-protein complex from Arthrospira platensis, and it is the only natural blue of commercial significance in food. In the EU it is not an authorised additive and carries no E number: it is used as a colouring food, and whether a grade stays on the ingredient side of that line turns on the enrichment factor of the extraction. It holds FDA GRAS status in the United States and is listed in Japan and Korea.",
    route:
      "Phycocyanin and spirulina blue are the same pigment from the same organism, and they share CAS 11024-84-7 with yeast-derived astaxanthin — a CAS number that covers several quite different materials. What separates them commercially is the grade and the formulation: phycocyanin is sold as a standardised extract quoted on purity, while spirulina blue is sold as a colour product built around it.",
    faq: [
      {
        q: "Does spirulina have an E number in the EU?",
        a: "No. Spirulina extract is not an authorised food colour in the EU and carries no E number. It is handled as a colouring food, and whether a concentrated phycocyanin stays on the ingredient side of that line depends on the enrichment factor of the extraction: above 6 the extraction counts as selective and the product is an additive. A supplier who has never heard of the enrichment factor has inherited the classification rather than made it.",
      },
      {
        q: "Why is phycocyanin heat sensitive?",
        a: "It is a protein, so heat denatures it and the blue fades; colour loss above roughly 45 to 50 °C is normal, and prolonged light exposure fades it as well. Stabilised grades use sugars, ascorbate or trehalose, and encapsulated grades extend the process window further.",
      },
      {
        q: "What is the stability window for phycocyanin?",
        a: "It is stable from about pH 5 to 7, and the protein precipitates below roughly pH 4, so acidic beverages are unsuitable. It is heat and light sensitive rather than acid-sensitive, which is the reverse of most plant natural colours.",
      },
      {
        q: "What is the CAS number of phycocyanin?",
        a: "11024-84-7, with EINECS number 234-248-9. The same pair is used for yeast-derived astaxanthin, so the CAS number on its own does not identify the pigment.",
      },
    ],
  },

  phycoerythrin: {
    answer:
      "Phycoerythrin is the pink-red phycobiliprotein from the red alga Porphyridium cruentum, and its distinguishing property is fluorescence — it is one of the few food pigments that emits visibly under excitation. That makes it useful well beyond colour: as a fluorescent label in flow cytometry and diagnostics, and as a natural pink in food. It holds FDA GRAS status in the United States and is approved in Japan and Korea.",
    faq: [
      {
        q: "What makes phycoerythrin special?",
        a: "It is intensely fluorescent, which no other food pigment is. The protein carries an open-chain tetrapyrrole chromophore that absorbs in the green and emits in the orange-red, and the emission is visible to the naked eye under the right excitation. That is what puts it into diagnostics and flow cytometry as a label.",
      },
      {
        q: "Is phycoerythrin stable?",
        a: "It is more stable than phycocyanin because the red alga it comes from has no cellulose cell wall, but it is still a protein: heat and acid both denature it, and it fades in strong light. It is used where the temperature is low and the light exposure is short.",
      },
      {
        q: "What is phycoerythrin used for?",
        a: "In food it is a natural pink colourant for confectionery, drinks and desserts. Its second market is analytical: as a fluorescent label in flow cytometry, immunohistochemistry and diagnostics, where the brightness matters more than the hue.",
      },
      {
        q: "What is the CAS number of phycoerythrin?",
        a: "11024-48-7. It has no EINECS number, because it is not registered as a substance in the European inventory.",
      },
    ],
  },

  violaxanthin: {
    answer:
      "Violaxanthin is a yellow carotenoid produced by the microalga Nannochloropsis gaditana, and it is one of the routes being developed as a sustainable alternative to synthetic zeaxanthin. Its market access is still partial: it holds FDA GRAS status in the United States, it is handled in the EU through the novel food framework, and it is not listed in Japan and under review in Korea.",
    faq: [
      {
        q: "What is violaxanthin used for?",
        a: "It is used as a yellow pigment and as a macular pigment nutrient. In the EU it enters through the novel food framework, which is why its permitted uses carry conditions that differ from those of an authorised colour.",
      },
      {
        q: "How is violaxanthin produced?",
        a: "It is produced by the microalga Nannochloropsis gaditana, which accumulates the pigment in its cells. The route is a closed-culture microalgal fermentation, which means no crop and no agricultural seasonality, and the biomass is harvested and the pigment extracted from it.",
      },
      {
        q: "What is the regulatory status of violaxanthin?",
        a: "FDA GRAS in the United States, novel food status in the EU, not listed in Japan, and under review in Korea. It is one of the pigments in this catalogue whose regulatory file is still being assembled market by market.",
      },
      {
        q: "What is the CAS number of violaxanthin?",
        a: "74434-36-9. It has no EINECS number, because it is not registered in the European substance inventory.",
      },
    ],
  },

  "zeaxanthin-microbial": {
    answer:
      "Zeaxanthin is the yellow carotenoid that, with lutein, makes up the macular pigment of the eye, and it is also a food ingredient and a supplement active in its own right. Microbial production from Flavobacterium breve and Paracoccus zeaxanthinifaciens gives a consistent isomer profile without a crop. It holds FDA GRAS status in the United States and is listed in Japan and Korea; in the EU it is not an authorised food colour and is used as a food ingredient.",
    faq: [
      {
        q: "Is zeaxanthin an authorised food colour in the EU?",
        a: "No. Zeaxanthin is not authorised as a food colour additive in the EU or the UK; it is used as a food ingredient and a supplement active. It holds FDA GRAS status in the United States and is listed in Japan and Korea.",
      },
      {
        q: "What is the difference between zeaxanthin and lutein?",
        a: "They are the two carotenoids that build macular pigment, and a standard eye-health formula carries both, typically 10 mg of lutein with 2 mg of zeaxanthin. Structurally they are isomers, and the microbial route is chosen when a consistent isomer ratio matters more than the raw material cost.",
      },
      {
        q: "Is microbial zeaxanthin suitable for vegan products?",
        a: "Yes. Flavobacterium breve and Paracoccus zeaxanthinifaciens are bacteria, and the fermentation route uses no animal-derived processing aids.",
      },
      {
        q: "What is the CAS number of zeaxanthin?",
        a: "144-68-3, with EINECS number 205-648-2.",
      },
    ],
  },

  "spirulina-blue": {
    answer:
      "Spirulina blue is the blue colour product built on phycocyanin from Arthrospira platensis, and it is the only natural blue with real commercial scale in food. The regulatory position is the thing to get right in Europe: spirulina extract is not an authorised additive and carries no E number, it is used as a colouring food, and the enrichment factor of the extraction decides whether a grade stays on that side. It holds FDA GRAS status in the United States and is listed in Japan and Korea.",
    route:
      "Spirulina blue and phycocyanin are the same pigment from the same organism and share CAS 11024-84-7. The difference is in what is being bought: phycocyanin is sold as a standardised extract quoted on purity, while spirulina blue is sold as a colour product with the pigment, the carrier and the stabilisation already built in.",
    faq: [
      {
        q: "Is spirulina blue an E number in the EU?",
        a: "No. Spirulina blue is not an authorised food colour in the EU and has no E number; it is a colouring food. Whether a concentrated grade crosses into additive territory depends on the enrichment factor of the extraction, calculated on the primary extract and with any carrier deducted.",
      },
      {
        q: "What colours can spirulina blue make?",
        a: "On its own it gives a clean, bright blue. Combined with yellow pigments it makes greens, which is the most common use in beverages and confectionery, and it is the base of most natural blue systems because no other natural colourant covers that range.",
      },
      {
        q: "What is the difference between spirulina blue and phycocyanin?",
        a: "They are the same pigment from Arthrospira platensis. Phycocyanin is sold as an extract quoted on purity and lets you build your own system; spirulina blue is sold as a finished colour product with carrier and stabilisation already chosen for the application.",
      },
      {
        q: "Is spirulina blue heat stable?",
        a: "No. The protein denatures above roughly 45 to 50 °C and the colour is lost, so it is used in products that are cold-filled or pasteurised gently. Stabilised and encapsulated grades exist for applications with a wider process window.",
      },
    ],
  },

  "iron-oxide": {
    answer:
      "Iron oxides give the earth tones — yellow, red, brown and black — and they are the most stable colourants in this catalogue: heat, light and pH are all non-issues next to a botanical pigment. They are authorised in the EU as E 172, exempt from certification in the United States under 21 CFR 73.1200, and listed in Japan under CI 77491, 77492 and 77499. The procurement discussion is about particle size, surface treatment and the natural versus synthetic-identical question.",
    faq: [
      {
        q: "Why is iron oxide so stable?",
        a: "It is a mineral. Unlike a botanical pigment it has no organic chromophore to degrade, so heat, light, acid and alkali barely touch it. That stability is why it is the benchmark against which every other natural colourant is measured for shelf life.",
      },
      {
        q: "What is the difference between natural and synthetic iron oxide?",
        a: "Both have the same CAS number and the same regulatory status, because the pigment itself is identical. The difference is in the contaminant profile and the impurity signature: a natural oxide carries trace elements from the ore, and some buyers specify the synthetic-identical grade for that reason.",
      },
      {
        q: "Is iron oxide approved in the EU?",
        a: "Yes, as E 172, which covers iron oxides and iron hydroxides. It is exempt from certification in the United States under 21 CFR 73.1200 and is approved in Japan and Korea.",
      },
      {
        q: "Is iron oxide suitable for vegan products?",
        a: "Yes. The pigment is a mineral and the grades used in food and cosmetics are not processed with animal-derived aids. It is also the workhorse of mineral make-up, where iron oxides give the entire skin-tone range.",
      },
    ],
  },

  "titanium-dioxide": {
    answer:
      "Titanium dioxide is the white pigment behind the opacity in everything from sunscreen to coated tablets, and it comes in two crystal forms, rutile and anatase. Its regulatory status differs sharply by market: it is not authorised as a food additive in the EU since 7 August 2022, it remains permitted there in medicinal products, it holds FDA GRAS status in the United States under 21 CFR 73.1, and it is approved in Japan and Korea.",
    faq: [
      {
        q: "Is titanium dioxide still allowed in EU food?",
        a: "No. Commission Regulation (EU) 2022/63 removed E 171 from the list of authorised food additives with effect from 7 August 2022, and the ban covers dietary supplements as well as conventional food. Titanium dioxide remains permitted in medicinal products in the EU, and it is still authorised as a food colour in the United States, Japan and Korea.",
      },
      {
        q: "What is the difference between rutile and anatase titanium dioxide?",
        a: "Rutile has the higher refractive index and better opacity, which is why it is the grade used in sunscreens and coatings; anatase is more reactive on the surface and is the grade used when photocatalytic activity is wanted. Surface treatment, not the crystal form alone, decides the performance.",
      },
      {
        q: "Is titanium dioxide safe?",
        a: "The 2025 judgment in the Court of Justice upheld the annulment of the EU classification of titanium dioxide powder containing 1% or more of particles of 10 micrometres or less as a suspected carcinogen by inhalation, removing the label from the powder itself. That judgment did not revive it as a food additive in the EU, and the EFSA assessment that led to the ban still stands.",
      },
      {
        q: "What is the CAS number of titanium dioxide?",
        a: "13463-67-7, with EINECS number 236-675-5.",
      },
    ],
  },

  "mica-pearl": {
    answer:
      "Mica pearl is natural muscovite mica coated with titanium dioxide to produce a pearlescent effect, and it is the colourant that gives lipsticks, eyeshadows and decorative food coatings their sheen. It is authorised in the EU and Japan under CI 77019 and holds FDA GRAS status in the United States under 21 CFR 73.1. Particle size and the coating ratio set the effect: fine grain gives a soft satin sheen, larger flakes give a distinct sparkle.",
    faq: [
      {
        q: "What is mica pearl?",
        a: "It is natural muscovite mica whose surface is coated with titanium dioxide and, depending on the grade, with iron oxides or other oxides that set the tint. The coating is what creates the interference effect that reads as pearl.",
      },
      {
        q: "What is the difference between fine grain and pearl flake?",
        a: "The particle size. Fine grain mica produces a soft, satin-like effect that stays subtle at high loading, while larger pearl flake produces a distinct sparkle. The choice is a visual decision, but it changes the use level needed to achieve it.",
      },
      {
        q: "Is mica pearl approved in the EU?",
        a: "Yes, under CI 77019, which covers natural mica and its titanium dioxide and iron oxide coatings. It is listed in Japan under the same CI number and holds FDA GRAS status in the United States.",
      },
      {
        q: "Is mica pearl suitable for vegan products?",
        a: "Yes. Mica is a mineral, and the grades used in cosmetics and food are not processed with animal-derived aids.",
      },
    ],
  },
};
