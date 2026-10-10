import { MedicationLabelType } from '@workspace/api-client-react';

const fda = 'https://www.fda.gov';
export const medicationLabelTypeSource = `${fda}/industry/structured-product-labeling/document-type-including-content-labeling-type`;
const prescriptionOtc = `${fda}/drugs/frequently-asked-questions-popular-topics/prescription-drugs-and-over-counter-otc-drugs-questions-and-answers`;
const allergenSource = `${fda}/vaccines-blood-biologics/allergenics/injectable-allergen-extracts-non-standardized`;

// These summarize SPL document categories, not a product's approval or suitability.
export const medicationLabelTypeDefinitions: Record<MedicationLabelType, {
  name: string;
  description: string;
  source: string;
  sourceLabel: string;
}> = {
  prescription: {
    name: 'Prescription',
    description: 'Human medicines labeled for supply with a prescription from a licensed prescriber. A prescription label category alone does not confirm FDA approval.',
    source: prescriptionOtc, sourceLabel: 'FDA: prescription and OTC medicines',
  },
  otc: {
    name: 'Over the counter',
    description: 'Human medicines labeled for use without a prescription. Read the Drug Facts directions and warnings; nonprescription does not mean suitable or safe for everyone.',
    source: prescriptionOtc, sourceLabel: 'FDA: prescription and OTC medicines',
  },
  compounded: {
    name: 'Compounded medicine',
    description: 'Medicines prepared by combining, mixing, or altering ingredients to meet a medical need. Compounded drugs are not FDA-approved; FDA does not review their safety, effectiveness, or quality before marketing.',
    source: `${fda}/drugs/human-drug-compounding/compounding-and-fda-questions-and-answers`,
    sourceLabel: 'FDA: compounding questions and answers',
  },
  vaccine: {
    name: 'Vaccine',
    description: 'Biological products that stimulate an immune response, typically to protect against a specific infectious disease. This category does not determine which vaccine, age group, or schedule is appropriate for you.',
    source: `${fda}/vaccines-blood-biologics/development-approval-process-cber/vaccine-development-101`,
    sourceLabel: 'FDA: how vaccines work',
  },
  'plasma-derivative': {
    name: 'Plasma-derived medicine',
    description: 'Medicines manufactured from components of human blood plasma, such as immune globulins and some clotting factors. These are manufactured medicines, not the same as a whole-blood transfusion; uses depend on the specific product.',
    source: `${fda}/vaccines-blood-biologics/blood-blood-products`,
    sourceLabel: 'FDA: blood and blood products',
  },
  'cellular-therapy': {
    name: 'Cellular therapy',
    description: 'Products using cells from the patient or a donor for specific therapeutic purposes, including cellular immunotherapies. This broad label type does not establish approval of a particular stem-cell or regenerative treatment.',
    source: `${fda}/vaccines-blood-biologics/cellular-gene-therapy-products`,
    sourceLabel: 'FDA: cellular and gene therapy products',
  },
  'licensed-cell-product': {
    name: 'Licensed cell product',
    description: 'FDA’s separate label category named “licensed minimally manipulated cells,” such as certain cord-blood cell products. It is distinct from the broader cellular-therapy category, not a blanket endorsement of stem-cell treatments. Verify the exact product and its approved use with FDA.',
    source: `${fda}/vaccines-blood-biologics/cellular-gene-therapy-products/approved-cellular-and-gene-therapy-products`,
    sourceLabel: 'FDA: licensed cellular and gene therapy products',
  },
  allergenic: {
    name: 'Allergy product',
    description: 'Non-standardized allergen extracts used for allergy testing or immunotherapy, depending on the product label. “Non-standardized” means no U.S. reference standard for that extract’s potency; it does not by itself mean unlicensed or unapproved.',
    source: allergenSource, sourceLabel: 'FDA: standardized vs. non-standardized extracts',
  },
  'standardized-allergenic': {
    name: 'Standardized allergy product',
    description: 'Allergen extracts whose potency manufacturers compare against a U.S. reference standard maintained by FDA. Standardization describes potency measurement—not freedom from allergic reactions, interchangeable dosing, or suitability for every patient.',
    source: allergenSource, sourceLabel: 'FDA: standardized vs. non-standardized extracts',
  },
};
