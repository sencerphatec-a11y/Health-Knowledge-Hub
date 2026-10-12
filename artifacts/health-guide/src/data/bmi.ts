export type BmiCategory = 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese' | 'Morbid obesity';
export interface BmiInput {
  age: string;
  pregnant: '' | 'no' | 'yes' | 'unsure';
  units: 'metric' | 'us';
  heightCm: string;
  weightKg: string;
  feet: string;
  inches: string;
  weightLb: string;
}
export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  explanation: string;
  nextStep: string;
}
export interface BmiCalculation {
  errors: Partial<Record<keyof BmiInput, string>>;
  result?: BmiResult;
}
export const emptyBmiInput: BmiInput = {
  age: '', pregnant: '', units: 'us', heightCm: '', weightKg: '', feet: '', inches: '', weightLb: '',
};
export const bmiSources = {
  categories: 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html',
  adults: 'https://www.cdc.gov/bmi/adult-calculator/index.html',
  children: 'https://www.cdc.gov/bmi/child-teen-calculator/index.html',
};

/** Classification uses the unrounded value; rounding is only for display. */
export function classifyBmi(bmi: number): BmiCategory {
  if (!Number.isFinite(bmi) || bmi <= 0) throw new Error('BMI must be a positive, finite number.');
  return bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : bmi < 40 ? 'Obese' : 'Morbid obesity';
}

const guidance: Record<BmiCategory, Pick<BmiResult, 'explanation' | 'nextStep'>> = {
  Underweight: {
    explanation: 'BMI below 18.5 falls in the adult underweight category.',
    nextStep: 'Discuss nutrition, any unintentional weight loss, and possible health causes with a clinician. Avoid assuming that BMI alone explains your health.',
  },
  'Normal weight': {
    explanation: 'BMI from 18.5 to below 25 is called “healthy weight” by the CDC. It does not certify overall health.',
    nextStep: 'Continue accessible nutrition, appropriate activity, and preventive care suited to your needs. Seek advice for symptoms or unintentional weight changes regardless of BMI.',
  },
  Overweight: {
    explanation: 'BMI from 25 to below 30 falls in the adult overweight category.',
    nextStep: 'Ask a clinician to consider BMI alongside blood pressure, lab results, medical history, and body composition. Discuss sustainable habits rather than using this number to prescribe a diet.',
  },
  Obese: {
    explanation: 'BMI from 30 to below 40 falls in the obesity category: class 1 is 30–<35 and class 2 is 35–<40.',
    nextStep: 'Consider a nonjudgmental health review with your care team. Nutrition, activity, sleep, medicines, and other treatment options should be individualized; this tool does not recommend medication or surgery.',
  },
  'Morbid obesity': {
    explanation: 'BMI of 40 or higher is class 3, also called severe obesity. “Morbid obesity” is an older term included here for recognition; class 3/severe obesity is the preferred wording.',
    nextStep: 'Arrange an individualized health assessment and ask about appropriate support and treatment options. This category is not a judgment of personal worth or a diagnosis based on this tool alone.',
  },
};

export function calculateBmi(input: BmiInput): BmiCalculation {
  const errors: BmiCalculation['errors'] = {};
  const read = (key: keyof BmiInput, label: string, min: number, max: number, integer = false) => {
    const raw = input[key].trim();
    const value = raw === '' ? NaN : Number(raw);
    if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
      errors[key] = `${label}: enter ${integer ? 'a whole number' : 'a number'} from ${min} to ${max}.`;
    }
    return value;
  };
  read('age', 'Age in years', 20, 130, true);
  if (errors.age) errors.age = 'This adult tool is for ages 20–130. Ages 2–19 need age- and sex-specific child/teen BMI interpretation; contact a clinician for other ages.';
  if (input.pregnant !== 'no') {
    errors.pregnant = input.pregnant === '' ? 'Please answer the pregnancy question.' : 'This tool does not interpret BMI during pregnancy or when pregnancy status is uncertain. Ask your care team about an appropriate assessment.';
  }
  let meters: number;
  let kg: number;
  if (input.units === 'metric') {
    meters = read('heightCm', 'Height in centimeters', 40, 300) / 100;
    kg = read('weightKg', 'Weight in kilograms', 1, 1000);
  } else if (input.units === 'us') {
    const feet = read('feet', 'Height in feet', 1, 9, true);
    const inches = read('inches', 'Additional inches', 0, 11.99);
    meters = (feet * 12 + inches) * 0.0254;
    kg = read('weightLb', 'Weight in pounds', 1, 2204) * 0.45359237;
    if (!errors.feet && !errors.inches && (meters < 0.4 || meters > 3)) {
      errors.feet = 'Check your combined height: this tool accepts heights from 40 to 300 centimeters (about 16 to 118 inches).';
    }
  } else {
    errors.units = 'Choose U.S. or metric units.';
    return { errors };
  }
  if (Object.keys(errors).length) return { errors };
  const bmi = kg / (meters * meters);
  const category = classifyBmi(bmi);
  return { errors, result: { bmi, category, ...guidance[category] } };
}
