import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { calculateBmi, classifyBmi, emptyBmiInput, type BmiInput } from './bmi';

const metric = (weightKg: string): BmiInput => ({
  ...emptyBmiInput, age: '30', pregnant: 'no', units: 'metric', heightCm: '200', weightKg,
});

test('adult BMI thresholds use unrounded values and every requested category', () => {
  for (const [bmi, category] of [
    [18.499, 'Underweight'], [18.5, 'Normal weight'], [24.999, 'Normal weight'],
    [25, 'Overweight'], [29.999, 'Overweight'], [30, 'Obese'],
    [35, 'Obese'], [39.999, 'Obese'], [40, 'Morbid obesity'], [60, 'Morbid obesity'],
  ] as const) {
    assert.equal(classifyBmi(bmi), category);
    const calc = calculateBmi(metric(String(bmi * 4)));
    assert.deepEqual(calc.errors, {});
    assert.equal(calc.result?.category, category);
    assert.ok(Math.abs(calc.result!.bmi - bmi) < 1e-9);
  }
  assert.equal(calculateBmi(metric('73.9996')).result?.bmi.toFixed(2), '18.50');
  assert.equal(calculateBmi(metric('73.9996')).result?.category, 'Underweight');
  assert.match(calculateBmi(metric('160')).result!.explanation, /class 3|severe obesity/);
});

test('U.S. inputs convert exactly and agree with equivalent metric measurements', () => {
  const us: BmiInput = { ...emptyBmiInput, age: '25', pregnant: 'no', feet: '5', inches: '10', weightLb: '200' };
  const metricCalc = calculateBmi({ ...metric(String(200 * 0.45359237)), heightCm: String(70 * 2.54) });
  const usCalc = calculateBmi(us);
  assert.ok(Math.abs(usCalc.result!.bmi - metricCalc.result!.bmi) < 1e-10);
  assert.equal(usCalc.result?.category, metricCalc.result?.category);
  assert.equal(calculateBmi({ ...us, inches: '0' }).result?.category, 'Obese');
});

test('BMI cannot silently fill missing or nonsensical measurements', () => {
  assert.equal(calculateBmi(emptyBmiInput).result, undefined);
  assert.deepEqual(Object.keys(calculateBmi(emptyBmiInput).errors), ['age', 'pregnant', 'feet', 'inches', 'weightLb']);
  for (const key of ['heightCm', 'weightKg'] as const) for (const value of ['', ' ', '0', '-1', 'NaN', 'Infinity', 'abc']) {
    const calc = calculateBmi({ ...metric('90'), [key]: value });
    assert.equal(calc.result, undefined);
    assert.ok(calc.errors[key]);
  }
  const us = { ...emptyBmiInput, age: '40', pregnant: 'no' as const, feet: '5', inches: '8', weightLb: '150' };
  for (const change of [{ feet: '5.5' }, { inches: '12' }, { inches: '' }, { weightLb: '0' }, { feet: '9', inches: '11.99' }]) {
    assert.equal(calculateBmi({ ...us, ...change }).result, undefined);
  }
});

test('adult BMI cannot classify teens, missing age, or pregnancy', () => {
  for (const age of ['', '19', '18', '2', '20.5', '131']) {
    const calc = calculateBmi({ ...metric('80'), age });
    assert.equal(calc.result, undefined);
    assert.match(calc.errors.age!, /child\/teen/);
  }
  assert.ok(calculateBmi({ ...metric('80'), age: '20' }).result);
  for (const pregnant of ['', 'yes', 'unsure'] as const) {
    const calc = calculateBmi({ ...metric('80'), pregnant });
    assert.equal(calc.result, undefined);
    assert.ok(calc.errors.pregnant);
  }
});

test('classification helper rejects invalid values rather than defaulting to a category', () => {
  for (const value of [NaN, Infinity, -Infinity, -1, 0]) assert.throws(() => classifyBmi(value));
});
