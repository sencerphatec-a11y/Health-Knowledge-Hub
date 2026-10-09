import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  assistanceLocationQuery, localSearchLinks, locationError, parseAssistanceLocation,
  type SearchLocation,
} from './local-assistance-search';
import { foodPrograms, housingPrograms } from './assistance-resources';

const city: SearchLocation = { mode: 'city', city: 'West Des Moines', state: 'IA', zip: '' };
const zip: SearchLocation = { mode: 'zip', city: '', state: '', zip: '02115' };

test('ZIP searches preserve leading zeros and produce real location-specific directory URLs', () => {
  assert.equal(assistanceLocationQuery(zip), 'zip=02115');
  assert.deepEqual(parseAssistanceLocation('?zip=02115'), zip);
  const food = localSearchLinks('food', zip);
  assert.equal(food.find(l => l.id === 'findhelp-pantries')?.url, 'https://www.findhelp.org/food/food-pantry?postal=02115');
  const housing = localSearchLinks('housing', zip);
  assert.equal(housing.find(l => l.id === 'findhelp-housing')?.url, 'https://www.findhelp.org/housing/help-pay-for-housing?postal=02115');
});
test('city and state links use the selected location, not a hardcoded Iowa location', () => {
  const california = { ...city, city: 'Los Angeles', state: 'CA' };
  const url = localSearchLinks('food', california).find(l => l.id === 'pantry-maps')!.url;
  assert.equal(new URL(url).searchParams.get('query'), 'food pantries near Los Angeles, CA');
  assert.equal(new URL(url).searchParams.get('api'), '1');
  const housing = localSearchLinks('housing', california);
  assert.equal(housing.find(l => l.id === 'state-pha')?.url, 'https://www.hud.gov/sites/dfiles/PIH/documents/PHA_Contact_Report_CA.pdf');
  assert.match(housing.find(l => l.id === 'state-pha')!.description, /statewide.*not a city-only/);
});
test('invalid and wildcard searches fail explicitly without generating external links', () => {
  for (const input of [
    { ...city, city: '' }, { ...city, state: 'ZZ' }, { ...city, city: '*' },
    { ...zip, zip: '1234' }, { ...zip, zip: 'abcde' }, { ...zip, zip: '50265&postal=90210' },
  ]) {
    assert.ok(locationError(input));
    assert.deepEqual(localSearchLinks('food', input), []);
    assert.deepEqual(localSearchLinks('housing', input), []);
  }
  assert.equal(parseAssistanceLocation('?city=Town&state=ZZ'), null);
});
test('state selection normalizes and does not invent an unavailable territory report', () => {
  assert.equal(parseAssistanceLocation('?city=West%20Des%20Moines&state=ia')?.state, 'IA');
  assert.ok(localSearchLinks('housing', city).some(l => l.id === 'state-pha'));
  assert.ok(!localSearchLinks('housing', { ...city, state: 'AS' }).some(l => l.id === 'state-pha'));
  assert.ok(localSearchLinks('housing', { ...city, state: 'AS' }).some(l => l.id === 'official-pha'));
});
test('URL round trips discard unused form fields and safely encode city names', () => {
  assert.equal(assistanceLocationQuery({ ...zip, city: 'Wrong Town', state: 'IA' }), 'zip=02115');
  const special = { ...city, city: "O'Fallon", state: 'MO' };
  assert.deepEqual(parseAssistanceLocation(assistanceLocationQuery(special)), special);
  assert.equal(localSearchLinks('food', special).every(l => new URL(l.url).protocol === 'https:'), true);
});
test('all requested meal programs and distinct housing assistance paths have source links and practical steps', () => {
  assert.deepEqual(foodPrograms.map(p => p.id), ['moms-meals', 'meals-from-heartland', 'meals-on-wheels']);
  assert.equal(housingPrograms.length, 5);
  for (const p of [...foodPrograms, ...housingPrograms]) {
    assert.ok(p.eligibility && p.cost && p.nextSteps.length >= 3 && p.links.length >= 2);
  }
});
