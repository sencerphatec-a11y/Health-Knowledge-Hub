"""Import the selected MedlinePlus health-topic summaries from its public XML.

Usage: python scripts/import-condition-summaries.py INPUT.zip OUTPUT.json
The input archive is downloaded separately from https://medlineplus.gov/xml.html.
"""
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

# This is a curated set for everyday U.S. health relevance, not a prevalence rank.
# Stable slugs retain the original three guide URLs.
SELECTION = [
    ("high-blood-pressure", "High blood pressure", "High Blood Pressure", "Heart health", "med-hbp"),
    ("asthma", "Asthma", "Asthma", "Breathing", "med-asthma"),
    ("type-2-diabetes", "Type 2 diabetes", "Diabetes Type 2", "Metabolic health", "med-t2d"),
    ("high-cholesterol", "High cholesterol", "Cholesterol", "Heart health", None),
    ("coronary-artery-disease", "Coronary artery disease", "Coronary Artery Disease", "Heart health", None),
    ("heart-failure", "Heart failure", "Heart Failure", "Heart health", None),
    ("atrial-fibrillation", "Atrial fibrillation", "Atrial Fibrillation", "Heart health", None),
    ("stroke", "Stroke", "Stroke", "Brain & nerves", None),
    ("obesity", "Obesity", "Obesity", "Metabolic health", None),
    ("prediabetes", "Prediabetes", "Prediabetes", "Metabolic health", None),
    ("hypothyroidism", "Hypothyroidism", "Hypothyroidism", "Metabolic health", None),
    ("hyperthyroidism", "Hyperthyroidism", "Hyperthyroidism", "Metabolic health", None),
    ("chronic-kidney-disease", "Chronic kidney disease", "Chronic Kidney Disease", "Kidney & urinary health", None),
    ("fatty-liver-disease", "Steatotic (fatty) liver disease", "Steatotic Liver Disease", "Digestive health", None),
    ("gerd", "Acid reflux (GERD)", "GERD", "Digestive health", None),
    ("irritable-bowel-syndrome", "Irritable bowel syndrome (IBS)", "Irritable Bowel Syndrome", "Digestive health", None),
    ("constipation", "Constipation", "Constipation", "Digestive health", None),
    ("hemorrhoids", "Hemorrhoids", "Hemorrhoids", "Digestive health", None),
    ("osteoarthritis", "Osteoarthritis", "Osteoarthritis", "Joints & muscles", None),
    ("rheumatoid-arthritis", "Rheumatoid arthritis", "Rheumatoid Arthritis", "Joints & muscles", None),
    ("osteoporosis", "Osteoporosis", "Osteoporosis", "Joints & muscles", None),
    ("back-pain", "Back pain", "Back Pain", "Joints & muscles", None),
    ("gout", "Gout", "Gout", "Joints & muscles", None),
    ("fibromyalgia", "Fibromyalgia", "Fibromyalgia", "Joints & muscles", None),
    ("migraine", "Migraine", "Migraine", "Brain & nerves", None),
    ("headache", "Headache (including tension headaches)", "Headache", "Brain & nerves", None),
    ("depression", "Depression", "Depression", "Mental health", None),
    ("anxiety", "Anxiety disorders", "Anxiety", "Mental health", None),
    ("insomnia", "Insomnia", "Insomnia", "Sleep health", None),
    ("sleep-apnea", "Sleep apnea", "Sleep Apnea", "Sleep health", None),
    ("adhd", "Attention-deficit/hyperactivity disorder (ADHD)", "Attention Deficit Hyperactivity Disorder", "Mental health", None),
    ("seasonal-allergies", "Allergies (including seasonal allergies)", "Allergy", "Allergies & breathing", None),
    ("sinusitis", "Sinusitis", "Sinusitis", "Allergies & breathing", None),
    ("copd", "Chronic obstructive pulmonary disease (COPD)", "COPD", "Breathing", None),
    ("common-cold", "Common cold", "Common Cold", "Infections", None),
    ("influenza", "Influenza (flu)", "Flu", "Infections", None),
    ("covid-19", "COVID-19", "COVID-19 (Coronavirus Disease 2019)", "Infections", None),
    ("pneumonia", "Pneumonia", "Pneumonia", "Infections", None),
    ("urinary-tract-infection", "Urinary tract infection (UTI)", "Urinary Tract Infections", "Kidney & urinary health", None),
    ("urinary-incontinence", "Urinary incontinence", "Urinary Incontinence", "Kidney & urinary health", None),
    ("enlarged-prostate", "Enlarged prostate (BPH)", "Enlarged Prostate (BPH)", "Kidney & urinary health", None),
    ("acne", "Acne", "Acne", "Skin health", None),
    ("eczema", "Eczema", "Eczema", "Skin health", None),
    ("psoriasis", "Psoriasis", "Psoriasis", "Skin health", None),
    ("cataracts", "Cataracts", "Cataract", "Vision & hearing", None),
    ("hearing-loss", "Hearing loss", "Hearing Disorders and Deafness", "Vision & hearing", None),
    ("anemia", "Anemia", "Anemia", "Blood health", None),
    ("breast-cancer", "Breast cancer", "Breast Cancer", "Cancer", None),
    ("prostate-cancer", "Prostate cancer", "Prostate Cancer", "Cancer", None),
    ("alzheimers-disease", "Alzheimer's disease", "Alzheimer's Disease", "Brain & nerves", None),
]


class SummaryParser(HTMLParser):
    """Keep source headings, paragraphs, and list items as plain text."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.sections = [{"heading": "Overview", "paragraphs": [], "points": [], "blocks": []}]
        self.mode = None
        self.depth = 0
        self.buffer = []
        self.table = None
        self.table_row = []
        self.table_header = False

    def finish(self):
        value = re.sub(r"\s+", " ", "".join(self.buffer)).strip()
        if value:
            if self.mode == "heading":
                self.sections.append({"heading": value, "paragraphs": [], "points": [], "blocks": []})
            elif self.mode == "point":
                self.sections[-1]["points"].append(value)
                blocks = self.sections[-1]["blocks"]
                if blocks and blocks[-1]["kind"] == "list":
                    blocks[-1]["items"].append(value)
                else:
                    blocks.append({"kind": "list", "items": [value]})
            else:
                self.sections[-1]["paragraphs"].append(value)
                self.sections[-1]["blocks"].append({"kind": "paragraph", "text": value})
        self.mode = None
        self.buffer = []

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.finish()
            self.table = {"kind": "table", "headers": [], "rows": []}
        elif self.table is not None and tag == "thead":
            self.table_header = True
        elif self.table is not None and tag == "tr":
            self.table_row = []
        elif self.table is not None and tag in ["td", "th"]:
            self.mode = "cell"
            self.buffer = []
        elif self.table is not None:
            if tag == "br":
                self.buffer.append(" ")
        elif tag in ["h2", "h3", "h4", "h5"]:
            self.finish()
            self.mode = "heading"
        elif tag == "li":
            self.finish()
            self.mode = "point"
        elif tag == "p" and self.mode != "point":
            self.finish()
            self.mode = "paragraph"
        elif tag == "br":
            self.buffer.append(" ")

    def handle_endtag(self, tag):
        if self.table is not None:
            if tag in ["td", "th"]:
                self.table_row.append(re.sub(r"\s+", " ", "".join(self.buffer)).strip())
                self.buffer = []
                self.mode = None
            elif tag == "tr":
                if self.table_header:
                    self.table["headers"] = self.table_row
                else:
                    self.table["rows"].append(self.table_row)
            elif tag == "thead":
                self.table_header = False
            elif tag == "table":
                self.sections[-1]["blocks"].append(self.table)
                self.table = None
            return
        if tag in ["h2", "h3", "h4", "h5", "li"] or (tag == "p" and self.mode == "paragraph"):
            self.finish()

    def handle_data(self, data):
        if self.mode:
            self.buffer.append(data)


def import_topics(archive_path, output_path):
    with zipfile.ZipFile(archive_path) as archive:
        filename = next(name for name in archive.namelist() if re.search(r"mplus_topics_\d{4}-\d{2}-\d{2}\.xml$", name))
        source_date = re.search(r"\d{4}-\d{2}-\d{2}", filename).group()
        root = ET.fromstring(archive.read(filename))
    topics = {topic.get("title"): topic for topic in root.findall("health-topic") if topic.get("language") == "English"}
    records = []
    for slug, title, source_title, category, legacy_source_id in SELECTION:
        topic = topics[source_title]
        parser = SummaryParser()
        parser.feed(topic.findtext("full-summary") or "")
        parser.finish()
        sections = [section for section in parser.sections if section["blocks"]]
        assert sections, source_title
        first_paragraph = next(paragraph for section in sections for paragraph in section["paragraphs"])
        summary = first_paragraph if len(first_paragraph) <= 330 else first_paragraph[:327].rsplit(" ", 1)[0] + "…"
        records.append({
            "id": slug, "title": title, "category": category, "summary": summary,
            "sourceId": legacy_source_id or "med-condition-" + slug,
            "sourceTitle": source_title, "sourceUrl": topic.get("url"),
            "sections": sections,
        })
    assert len(records) == 50 and len({r["id"] for r in records}) == 50
    with open(output_path, "w") as output:
        json.dump({"source": "MedlinePlus, U.S. National Library of Medicine",
                   "sourceExportDate": source_date,
                   "sourceArchiveUrl": "https://medlineplus.gov/xml/" + filename.split("/")[-1],
                   "records": records}, output, indent=2, ensure_ascii=False)
        output.write("\n")
    print(f"Imported {len(records)} condition summaries from MedlinePlus ({source_date}).")
    if len(sys.argv) > 3:
        portal_records = [{
            "name": record["title"], "cat": record["category"], "summary": record["summary"],
            "sourceUrl": record["sourceUrl"], "id": record["id"],
        } for record in records]
        with open(sys.argv[3], "w") as output:
            output.write("/* MedlinePlus-sourced condition previews. Generated by import-condition-summaries.py. */\n")
            output.write("window.PULSECARE_CONDITIONS = " + json.dumps(portal_records, ensure_ascii=False) + ";\n")


if __name__ == "__main__":
    import_topics(sys.argv[1], sys.argv[2])
