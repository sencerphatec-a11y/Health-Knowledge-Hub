import { strict as assert } from "node:assert";
import { test } from "node:test";
import { normalizePhysicians, validDirectoryPayload } from "./provider-directory";

const practice = {
  address_purpose: "LOCATION", country_code: "US", address_1: "100 TEST STREET",
  city: "WEST DES MOINES", state: "IA", postal_code: "502651234", telephone_number: "515-555-0100",
};
const fixture = () => ({
  number: "1234567890", enumeration_type: "NPI-1",
  basic: { status: "A", first_name: "TEST", last_name: "PHYSICIAN", credential: "MD", last_updated: "2026-10-09" },
  taxonomies: [{ code: "207Q00000X", desc: "Family Medicine" }],
  addresses: [practice], practiceLocations: [] as typeof practice[],
});

test("physician taxonomy includes letter-bearing family medicine codes", () => {
  const items = normalizePhysicians([fixture()], { zip: "50265" });
  assert.equal(items.length, 1);
  assert.deepEqual(items[0].specialties, ["Family Medicine"]);
  assert.equal(items[0].locations[0].postalCode, "50265-1234");
});
test("secondary matching practice is shown instead of a distant primary or local mailing address", () => {
  const row = fixture();
  row.addresses = [
    { ...practice, city: "ELDRIDGE", postal_code: "52748", telephone_number: "563-555-0100" },
    { ...practice, address_purpose: "MAILING", address_1: "PO BOX 10" },
  ];
  row.practiceLocations = [practice];
  const items = normalizePhysicians([row], { city: "west des moines", state: "IA", zip: "50265" });
  assert.equal(items.length, 1);
  assert.equal(items[0].locations.length, 1);
  assert.equal(items[0].locations[0].address, "100 TEST STREET");
  assert.equal(items[0].locations[0].phone, "515-555-0100");
});
test("mailing-only matches and out-of-area practices do not become local offices", () => {
  assert.equal(normalizePhysicians([{ ...fixture(), addresses: [{ ...practice, address_purpose: "MAILING" }] }], { zip: "50265" }).length, 0);
  assert.equal(normalizePhysicians([fixture()], { zip: "50309" }).length, 0);
  assert.equal(normalizePhysicians([fixture()], { city: "Des Moines", state: "IA" }).length, 0);
});
test("exclude nonphysicians, organizations, inactive records, and non-US addresses", () => {
  const row = fixture();
  for (const altered of [
    { ...row, taxonomies: [{ code: "363L00000X", desc: "Nurse Practitioner" }] },
    { ...row, enumeration_type: "NPI-2" },
    { ...row, basic: { ...row.basic, status: "D" } },
    { ...row, addresses: [{ ...practice, country_code: "CA" }] },
  ]) assert.equal(normalizePhysicians([altered], { zip: "50265" }).length, 0);
});
test("deduplicate records and addresses without inventing missing phone numbers", () => {
  const row = { ...fixture(), addresses: [{ ...practice, telephone_number: "" }] };
  row.practiceLocations = row.addresses;
  const items = normalizePhysicians([row, row], { zip: "50265" });
  assert.equal(items.length, 1);
  assert.equal(items[0].locations.length, 1);
  assert.equal(items[0].locations[0].phone, null);
});
test("upstream errors and malformed responses are not valid empty results", () => {
  assert.equal(validDirectoryPayload({ result_count: 0 }), true);
  assert.equal(validDirectoryPayload({ result_count: 1, results: [fixture()] }), true);
  for (const data of [null, { Errors: [{ description: "failed" }] }, {}, { result_count: 2, results: [fixture()] }, { result_count: 1, results: [{}] }, { result_count: 0, results: "broken" }]) assert.equal(validDirectoryPayload(data), false);
});
