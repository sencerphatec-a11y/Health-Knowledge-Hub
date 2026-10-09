"""Import patient-education sections from every English fact sheet in CDC's VIS index.

Run: python scripts/import-vaccine-facts.py
Schedule-specific dosing sections are not copied: use CDC's current schedules/notes.
"""
import concurrent.futures
import collections
import json
import re
import runpy
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

INDEX = "https://www.cdc.gov/vaccines/hcp/current-vis/"
OUTPUT = Path("artifacts/health-guide/src/data/vaccine-facts.json")
Parser = runpy.run_path("scripts/import-condition-summaries.py")["SummaryParser"]
EDUCATION_HEADING = r"^(?:\d+\.\s*)?(Why|Talk with|Risks|What if)"


class VISParser(Parser):
    """Keep subordinate disease headings within their parent education section."""
    def __init__(self):
        super().__init__()
        self.education_scope = False
        self.heading_level = None

    def handle_starttag(self, tag, attrs):
        super().handle_starttag(tag, attrs)
        if tag in ["h2", "h3", "h4", "h5"]:
            self.heading_level = tag

    def finish(self):
        is_heading = self.mode == "heading"
        heading = re.sub(r"\s+", " ", "".join(self.buffer)).strip()
        if is_heading and self.heading_level == "h2":
            self.education_scope = bool(re.search(EDUCATION_HEADING, heading, re.I))
        super().finish()
        if is_heading:
            self.sections[-1]["education_scope"] = self.education_scope


class SourceTextAudit(HTMLParser):
    """Independent source-text check, excluding illustrations and their captions."""
    def __init__(self):
        super().__init__()
        self.header = False
        self.header_text = []
        self.enabled = False
        self.figure = False
        self.text = []

    def handle_starttag(self, tag, attrs):
        if tag == "figure":
            self.figure = True
        if tag == "h2":
            self.header = True
            self.enabled = False
            self.header_text = []

    def handle_endtag(self, tag):
        if tag == "figure":
            self.figure = False
        if tag == "h2":
            self.header = False
            heading = "".join(self.header_text)
            self.enabled = bool(re.search(EDUCATION_HEADING, heading, re.I))
            if self.enabled:
                self.text.append(heading)

    def handle_data(self, data):
        if self.figure:
            return
        if self.header:
            self.header_text.append(data)
        elif self.enabled:
            self.text.append(data)

TOPICS = [
    ("childs-first", "Multiple childhood vaccines", "Combined"),
    ("covid-19", "COVID-19", "Routine"),
    ("dengue", "Dengue", "Risk-specific"),
    ("dtap", "DTaP (diphtheria, tetanus, pertussis)", "Routine"),
    ("hepatitis-a", "Hepatitis A", "Routine"),
    ("hepatitis-b", "Hepatitis B", "Routine"),
    ("hib", "Hib (Haemophilus influenzae type b)", "Routine"),
    ("hpv", "HPV (human papillomavirus)", "Routine"),
    ("influenza-live-intranasal", "Influenza — live, intranasal", "Routine"),
    ("influenza-inactivated", "Influenza — inactivated", "Routine"),
    ("mmr", "MMR (measles, mumps, rubella)", "Routine"),
    ("mmrv", "MMRV (MMR and varicella)", "Routine"),
    ("meningococcal-acwy", "Meningococcal ACWY", "Routine"),
    ("meningococcal-b", "Meningococcal B", "Risk-specific"),
    ("pneumococcal-conjugate", "Pneumococcal conjugate (PCV)", "Routine"),
    ("pneumococcal-polysaccharide", "Pneumococcal polysaccharide (PPSV23)", "Risk-specific"),
    ("polio", "Polio", "Routine"),
    ("rotavirus", "Rotavirus", "Routine"),
    ("rsv", "RSV vaccine", "Routine"),
    ("rsv-iis", "RSV preventive antibody (nirsevimab)", "Preventive antibody"),
    ("tdap", "Tdap (tetanus, diphtheria, pertussis)", "Routine"),
    ("td", "Td (tetanus, diphtheria)", "Routine"),
    ("varicella", "Varicella (chickenpox)", "Routine"),
    ("shingles", "Shingles (recombinant zoster)", "Routine"),
    ("adenovirus", "Adenovirus", "Travel & special use"),
    ("anthrax", "Anthrax", "Travel & special use"),
    ("cholera", "Cholera", "Travel & special use"),
    ("ebola", "Ebola", "Travel & special use"),
    ("japanese-encephalitis", "Japanese encephalitis", "Travel & special use"),
    ("rabies", "Rabies", "Travel & special use"),
    ("smallpox-monkeypox", "Smallpox / mpox (JYNNEOS)", "Risk-specific"),
    ("tbe", "Tick-borne encephalitis", "Travel & special use"),
    ("typhoid", "Typhoid", "Travel & special use"),
    ("yellow-fever", "Yellow fever", "Travel & special use"),
]


def download(url):
    request = urllib.request.Request(url)
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read().decode("utf-8")


def import_topic(topic):
    slug, title, category = topic
    url = f"https://www.cdc.gov/vaccines/hcp/current-vis/{slug}.html"
    html = download(url)
    parser = VISParser()
    parser.feed(html)
    parser.finish()
    sections = [
        {key: value for key, value in section.items() if key != "education_scope"}
        for section in parser.sections
        if section.get("education_scope")
        and section["blocks"]
    ]
    assert sections and any("Why" in s["heading"] for s in sections), f"No education sections for {slug}"
    overview = sections[0]["paragraphs"]
    assert overview, f"No overview for {slug}"
    audit = SourceTextAudit()
    audit.feed(html)
    imported_text = []
    for section in sections:
        imported_text.append(section["heading"])
        for block in section["blocks"]:
            if block["kind"] == "table":
                imported_text.extend(block["headers"])
                imported_text.extend(cell for row in block["rows"] for cell in row)
            else:
                imported_text.extend(block["items"] if block["kind"] == "list" else [block["text"]])
    expected = collections.Counter(re.findall(r"\w+", "".join(audit.text).lower()))
    actual = collections.Counter(re.findall(r"\w+", "\n".join(imported_text).lower()))
    assert expected == actual, f"Source content changed for {slug}: missing {expected - actual}; extra {actual - expected}"
    # This is retrieval date, NOT a medical review or CDC publication date.
    return {"id": slug, "title": title, "category": category, "sourceUrl": url,
            "summary": overview[0], "sections": sections}


def main():
    index = download(INDEX)
    links = set(re.findall(r'current-vis/([a-z0-9-]+)\.html', index))
    expected = {slug for slug, _, _ in TOPICS}
    # Stop for review if the official directory gains a new fact sheet.
    unexpected = links - expected - {"index"}
    assert not unexpected, f"Review new CDC fact sheets: {unexpected}"
    assert expected <= links, f"Missing CDC index links: {expected - links}"
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        records = list(pool.map(import_topic, TOPICS))
    records.append({
        "id": "smallpox-acam2000", "title": "Smallpox (ACAM2000)", "category": "Travel & special use",
        "sourceUrl": "https://www.fda.gov/media/75800/download",
        "summary": "CDC directs patients to FDA's ACAM2000 medication guide instead of a Vaccine Information Statement. Read the complete guide with your vaccination provider.",
        "sections": [],
    })
    result = {"checked": "October 9, 2026", "sourceIndex": INDEX, "records": records}
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(records)} CDC-indexed vaccine / immunization references; {len(records)-1} with patient-education sections.")


if __name__ == "__main__":
    main()
