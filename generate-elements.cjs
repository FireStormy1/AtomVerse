const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const elements = json.elements.map(el => {
      let category = "Unknown";
      if (el.category.includes("alkali metal")) category = "Alkali Metal";
      else if (el.category.includes("alkaline earth metal")) category = "Alkaline Earth Metal";
      else if (el.category.includes("transition metal")) category = "Transition Metal";
      else if (el.category.includes("post-transition metal")) category = "Post-Transition Metal";
      else if (el.category.includes("metalloid")) category = "Metalloid";
      else if (el.category.includes("noble gas")) category = "Noble Gas";
      else if (el.category.includes("halogen")) category = "Halogen";
      else if (el.category.includes("lanthanide")) category = "Lanthanide";
      else if (el.category.includes("actinide")) category = "Actinide";
      else if (el.category.includes("nonmetal")) category = "Nonmetal";

      // Override categories by atomic number for groups the source JSON may mislabel
      const halogens = new Set([9, 17, 35, 53, 85, 117]);
      const postTransitionMetals = new Set([13, 31, 49, 50, 81, 82, 83, 113, 114, 115, 116]);
      if (halogens.has(el.number)) category = "Halogen";
      if (postTransitionMetals.has(el.number)) category = "Post-Transition Metal";

      // Calculate groups and periods accurately
      let group = el.group;
      let period = el.period;
      let block = el.block;

      return {
        atomicNumber: el.number,
        symbol: el.symbol,
        name: el.name,
        atomicMass: el.atomic_mass,
        period: period,
        group: group,
        category: category,
        stateAtSTP: el.phase,
        meltingPoint: el.melt,
        boilingPoint: el.boil,
        density: el.density,
        electronConfiguration: el.electron_configuration,
        electrons: el.shells,
        protons: el.number,
        neutrons: Math.round(el.atomic_mass) - el.number,
        valenceElectrons: el.shells.length > 0 ? el.shells[el.shells.length - 1] : 0,
        electronegativity: el.electronegativity_pauling || 0,
        atomicRadius: el.atomic_radius || 0,
        ionizationEnergy: el.ionization_energy || 0,
        oxidationStates: typeof el.oxidation_states === 'number' ? el.oxidation_states.toString() : (el.oxidation_states || ""),
        yearDiscovered: el.discovered_by ? 1800 : "Ancient", 
        discoverer: el.discovered_by || "Unknown",
        namedAfter: el.named_by || "Unknown",
        crystalStructure: el.crystal_structure || "Unknown",
        block: block || "Unknown",
        isRadioactive: el.number > 82 || [43, 61].includes(el.number),
        isNatural: el.number <= 94,
        abundance: el.abundance_crust || 0,
        uses: [],
        interestingFacts: [el.summary || ""],
        biologicalImportance: "Unknown",
        industrialApplications: "Unknown",
        hazards: "Unknown"
      };
    });

    const fileContent = `import { ElementData } from '../types/element';

export const elements: ElementData[] = ${JSON.stringify(elements, null, 2)};
`;
    fs.mkdirSync('src/data', { recursive: true });
    fs.writeFileSync('src/data/elements.ts', fileContent);
  });
});
