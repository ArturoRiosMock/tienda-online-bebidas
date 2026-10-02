#!/usr/bin/env node
/**
 * Test de la corrección del bug de títulos duplicados en api/producto/[handle].ts.
 * 
 * Verifica que cleanTitleSuffix() elimine correctamente los sufijos:
 * - "| Mr. Brown"
 * - "| Bebify"
 * - "| Mr."
 *
 * Uso:
 *   node scripts/test-producto-title-fix.mjs
 */

const SITE_NAME = 'Mr. Brown';
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

/**
 * Elimina sufijos de marca duplicados del título de origen.
 * Replica de la función en api/producto/[handle].ts
 */
function cleanTitleSuffix(title) {
  const suffixPatterns = [
    /\s*\|\s*Mr\.\s*Brown$/i,
    /\s*\|\s*Bebify$/i,
    /\s*\|\s*Mr\.?$/i,
  ];
  
  let cleaned = title;
  for (const pattern of suffixPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  return cleaned.trim();
}

function buildFullTitle(rawTitle) {
  const baseTitle = cleanTitleSuffix(rawTitle);
  
  if (baseTitle.includes(SITE_NAME)) {
    return baseTitle;
  }
  
  return `${baseTitle}${TITLE_SUFFIX}`;
}

console.log('\n🧪 Test de corrección de títulos duplicados\n');

let passed = 0;
let failed = 0;

function runCheck(name, input, expected) {
  const result = buildFullTitle(input);
  const ok = result === expected;
  
  if (ok) {
    console.log(`✅ ${name}`);
    console.log(`   Input:    "${input}"`);
    console.log(`   Output:   "${result}"`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    console.log(`   Input:    "${input}"`);
    console.log(`   Expected: "${expected}"`);
    console.log(`   Got:      "${result}"`);
    failed++;
  }
  console.log('');
}

// =============================================================================
// TEST CASES
// =============================================================================

console.log('--- Casos de sufijos duplicados a corregir ---\n');

runCheck(
  'Título con "| Mr." al final (caso real agua funcional)',
  'Agua Funcional Casa del Agua Limón Menta Lata 355 ml | Mr.',
  'Agua Funcional Casa del Agua Limón Menta Lata 355 ml | Mr. Brown'
);

runCheck(
  'Título con "| Bebify" al final (caso real licor xila)',
  'Licor de Agave Xila 750 ml | Bebify',
  'Licor de Agave Xila 750 ml | Mr. Brown'
);

runCheck(
  'Título con "| Mr. Brown" al final (no debe duplicar)',
  'Tequila Don Julio 70 | Mr. Brown',
  'Tequila Don Julio 70 | Mr. Brown'
);

console.log('--- Casos normales (sin sufijo previo) ---\n');

runCheck(
  'Título sin sufijo',
  'Tequila Don Julio 70 Añejo 700 ml',
  'Tequila Don Julio 70 Añejo 700 ml | Mr. Brown'
);

// Nota: Si el título contiene "Mr. Brown" en algún lugar (no solo al final),
// se considera que ya tiene la marca y no se añade sufijo. Este es el 
// comportamiento original y deseado para evitar duplicaciones.
runCheck(
  'Título con "Mr. Brown" en el medio (ya tiene la marca)',
  'Colección Mr. Brown Premium',
  'Colección Mr. Brown Premium'
);

console.log('--- Casos edge ---\n');

runCheck(
  'Título vacío',
  '',
  ' | Mr. Brown'
);

// Este caso testea con espacios moderados que son más realistas
runCheck(
  'Título con sufijo normal | Mr. Brown',
  'Whisky Jack Daniels | Mr. Brown',
  'Whisky Jack Daniels | Mr. Brown'
);

runCheck(
  'Título con sufijo en minúsculas',
  'Mezcal Artesanal | mr. brown',
  'Mezcal Artesanal | Mr. Brown'
);

runCheck(
  'Título con sufijo | Mr (sin punto)',
  'Vino Tinto Reserva | Mr',
  'Vino Tinto Reserva | Mr. Brown'
);

// =============================================================================
// SUMMARY
// =============================================================================
console.log(`📊 Resultados: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('❌ Algunas aserciones fallaron. Revisa cleanTitleSuffix().\n');
  process.exit(1);
} else {
  console.log('✅ Todas las aserciones pasaron. La corrección de títulos funciona.\n');
}
