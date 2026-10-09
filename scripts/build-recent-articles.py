"""Build the October 9, 2026 editorial snapshot from verified publisher metadata.

This is not an automatic news feed. The curated headlines and original briefs
are fixed; stop for editorial review if publisher feeds no longer contain them.
"""
import concurrent.futures
import email.utils
import hashlib
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

SELECTION = [
    ("AI, Tech Leaders Are Lobbying Trump Health Officials in a Government-Run Chat Room", "Digital health", "KFF investigates how technology companies and federal officials are shaping health-app policy, raising questions about medical-record privacy and oversight."),
    ("‘We Are Seen as Disposable’: Rural Residents Fight a Proposed Gas Pipeline", "Public health", "A rural pipeline dispute illustrates concerns about environmental exposure and unequal public-health burdens in lower-income communities."),
    ("ChatGPT for Teens has special safeguards. A watchdog group finds most don't work", "Mental health", "NPR examines a watchdog assessment of teen chatbot safeguards, including concerns about responses to self-harm discussions and parental alerts."),
    ("A student hated reading for years. Her podcast explores finding the right diagnosis", "Family health", "A student describes her experience with dyslexia and finding an explanation for persistent reading difficulties, offering a family perspective on diagnosis."),
    ("RFK Jr. touts vaccine injury initiative, worrying experts", "Vaccines & prevention", "NPR reports on a federal vaccine-injury initiative and expert concerns. This is policy reporting, not evidence that established vaccine recommendations have changed."),
    ("Can GLP-1 drugs help people stop throwing away their money?", "Medications", "Researchers plan to investigate whether GLP-1 medicines influence impulsive financial behavior. The proposed research does not establish a treatment benefit for spending problems."),
    ("Suicide is up among Black Americans. We need to talk about it.", "Mental health", "A panel discussion examines suicide and mental-health challenges among Black Americans, emphasizing community experiences and the importance of open conversation."),
    ("‘Medicare for All’ Is Back. Now Comes the Hard Part.", "Insurance & costs", "KFF explores proposals for universal health coverage and the challenges of translating popular promises into legislation. Proposed changes are not current benefits."),
    ("Medical Debt Is Crushing Hospital Patients in Los Angeles. Health Officials May Have a Fix.", "Insurance & costs", "A Los Angeles effort to screen hospital patients for financial assistance offers a case study in preventing unaffordable medical bills."),
    ("New Maryland law requires radiologists inform patients of heart disease warning sign", "Heart health", "NPR discusses a Maryland notification requirement for blood-vessel calcium findings on mammograms. The state-specific rule is not a nationwide screening recommendation."),
    ("Congress tried to stop surprise medical bills. It created another problem.", "Insurance & costs", "CBS examines unintended consequences and disputed billing practices under the federal law intended to protect patients from surprise medical bills."),
    ("Food Aid Enrollment Tanks After SNAP Rule Changes", "Food & nutrition", "KFF examines falling SNAP participation after rule changes and the implications for households that depend on food assistance."),
    ("Before Saying Yes to the Medical Test, Know the Risks and Benefits", "Screening & cancer", "An overview of why direct-to-consumer medical tests, including full-body scans, can carry financial, physical, and emotional downsides as well as possible benefits."),
    ("Doctors Should Keep an Eye on Your Mix of Medication. If They Don’t, You Should.", "Medications", "This report explains the importance of reviewing multiple medicines, particularly in older adults. Reducing prescriptions should involve a qualified clinician, not self-directed changes."),
    ("Alan Alda on fighting Parkinson's with laughter", "Healthy aging", "Actor Alan Alda discusses living with Parkinson’s disease and maintaining humor and identity alongside a chronic neurological condition."),
    ("Letting go: Why holding onto grudges can be damaging", "Mental health", "CBS explores research and expert perspectives on resentment, stress, and forgiveness. The report discusses associations rather than promising a medical cure."),
    ("Midterms Have Revived Universal Healthcare Debate. These States Are Ahead of Everyone.", "Insurance & costs", "KFF examines state efforts toward broader health coverage as the national debate returns. State proposals and political campaigns are distinct from enacted coverage."),
    ("Patient Dies by Suicide After ‘Insurance Issue’ Delayed Medicine for Lung Disease Flare-Ups", "Care access", "A family’s experience with delayed COPD medication highlights questions about insurance barriers and timely access to care. The report includes discussion of suicide."),
    ("Hospitals Have a Little-Known Tool To Prevent Medical Debt. Here’s How It Works.", "Insurance & costs", "This explainer examines hospital financial-assistance programs and efforts to identify eligible patients automatically, while noting that procedures differ across hospitals and states."),
    ("Rural MAHA Followers Say Trump Health Policies Haven’t Reached Their Communities", "Care access", "A rural voter survey explores whether national health-policy initiatives are reaching local communities and meeting residents’ healthcare needs."),
    ("These 100 Nursing Homes Face Perilous Flood Risk. Minnesota Shows What Can Happen.", "Healthy aging", "KFF examines nursing homes vulnerable to flooding and the challenges of evacuating older residents, using a Minnesota incident as an example."),
    ("US Poised To Boot Legal Immigrants From Medicaid, Including Refugees and Sex-Trafficking Victims", "Insurance & costs", "A report examines Medicaid eligibility changes affecting certain legally present immigrants and projected losses of coverage. Eligibility depends on specific rules and circumstances."),
    ("Drugs Are Widely Used To Sedate Dementia Patients. Her Sons Wanted To Keep Her Off Them.", "Healthy aging", "A family’s experience highlights difficult decisions about sedating medicines in dementia care, including treatment goals, autonomy, and caregiving responsibilities."),
    ("Confusion and Angst Follow State’s Early Rollout of Medicaid Work Rules", "Insurance & costs", "Montana’s early implementation of Medicaid work requirements illustrates confusion over coverage rules. Requirements and exemptions vary, so consult official state guidance."),
    ("She Left After Waiting Hours in the Emergency Room. The ER Billed Her Anyway.", "Insurance & costs", "A patient billed after leaving an emergency-room waiting area illustrates questions about facility charges and how patients can understand disputed bills."),
    ("Republicans and Democrats Find a Unifying Target: Pharmacy Benefit Managers", "Medications", "KFF explores scrutiny of pharmacy benefit managers and state and federal proposals addressing their role in prescription pricing and pharmacy ownership."),
    ("Food Safety Finds a Place Among ‘Kitchen-Table’ Political Issues", "Food & nutrition", "Reporting examines how foodborne outbreaks and recalls have brought food safety into broader public discussions about everyday health protections."),
    ("Abortion Is on the Ballot Again as Post-Roe Policies Continue To Evolve", "Family health", "KFF explains upcoming state abortion-related ballot measures and their place in the changing reproductive-health policy landscape. Rules remain jurisdiction-specific."),
    ("Nursing Home Beds Are Becoming More Scarce", "Healthy aging", "An examination of declining nursing-home capacity considers how an aging population may affect families searching for long-term care."),
    ("Insurance Coverage Lags as Cancer Science, Treatment Move Forward", "Screening & cancer", "New approaches to classifying cancers by genetic changes can outpace insurance coverage, creating questions about access to specialized treatment."),
    ("As Health Insurance Costs Soar, Healthcare Workers Also Feel the Pinch", "Insurance & costs", "Healthcare workers describe difficult coverage decisions as insurance premiums rise, illustrating affordability pressures that extend beyond any single profession."),
    ('Porsha Williams reveals health emergency: "It all happened so fast"', "Family health", "A television personality describes emergency treatment after uterine fibroids were discovered. The personal account is not a diagnostic checklist or a typical outcome for every patient."),
]

# Dates below were checked against the publisher's displayed article date or
# official dated feed/Research Matters edition, not guessed from URLs.
VERIFIED = [
    ("Harvard Health Publishing", "2026-10-02", "People who walk more or walk faster live longer, study finds", "heart-health/people-who-walk-more-or-walk-faster-live-longer-study-finds", "Heart health", "Harvard reviews research associating walking pace and daily steps with longevity. Observational associations do not prove that a particular walking target guarantees a longer life."),
    ("Harvard Health Publishing", "2026-10-01", "For sleep apnea, a dental device may be as effective as CPAP", "heart-health/for-sleep-apnea-a-dental-device-may-be-as-effective-as-cpap", "Sleep", "A small study compared dental appliances and CPAP on blood pressure and sleepiness. The article notes that CPAP remains preferred for many people with moderate or severe sleep apnea."),
    ("Harvard Health Publishing", "2026-09-25", "Carb cycling: What is it, and does it work?", "diet-and-nutrition/carb-cycling-what-is-it-and-does-it-work", "Food & nutrition", "An explanation of alternating carbohydrate intake with activity levels, including why it may offer little advantage over a balanced diet for everyday exercisers."),
    ("Harvard Health Publishing", "2026-09-24", "Understanding orthorexia: Have your healthy eating goals gone too far?", "diet-and-nutrition/understanding-orthorexia-have-your-healthy-eating-goals-gone-too-far", "Food & nutrition", "An overview of when a preoccupation with eating healthfully can become restrictive or disruptive, with context for recognizing concerning patterns."),
    ("Harvard Health Publishing", "2026-09-24", "Salmonella, E. coli, Cyclospora, and other germs that cause food poisoning: What you need to know", "digestive-health/salmonella-e-coli-cyclospora-and-other-germs-that-cause-food-poisoning-what-you-need-to-know", "Food & nutrition", "Harvard explains common causes of foodborne illness, prevention, and how to find official recall and outbreak information."),
    ("Harvard Health Publishing", "2026-09-24", "Melatonin or magnesium: Can either supplement help you sleep?", "sleep/melatonin-or-magnesium-can-either-supplement-help-you-sleep", "Sleep", "A review of popular sleep supplements, the strength of their evidence, and why side effects and interactions deserve attention before use."),
    ("Harvard Health Publishing", "2026-09-17", "Shingrix shingles vaccine linked with lower heart disease risks", "heart-health/shingrix-shingles-vaccine-linked-with-lower-heart-disease-risks", "Vaccines & prevention", "Harvard discusses a study linking shingles vaccination with cardiovascular outcomes. The findings should not be treated as proof of a new heart-disease indication."),
    ("Mayo Clinic News Network", "2026-10-08", "Mayo Clinic Q&A: What are the treatment options for brain metastases?", "mayo-clinic-qa-what-are-the-treatment-options-for-brain-metastases", "Screening & cancer", "Mayo outlines how specialists choose among surgery, radiation, medicines, and combined approaches when cancer spreads to the brain. Treatment is individualized."),
    ("Mayo Clinic News Network", "2026-10-07", "Mayo Clinic Minute: Early screening and treatment advances improve prostate cancer outcomes", "mayo-clinic-minute-early-screening-and-treatment-advances-improve-prostate-cancer-outcomes", "Screening & cancer", "An overview of prostate cancer screening discussions and advances in precisely targeted radiation. Screening decisions should account for individual risks and preferences."),
    ("Mayo Clinic News Network", "2026-10-07", "Back or spine problems? Mayo Clinic experts explain where to start", "back-or-spine-problems-mayo-clinic-experts-explain-where-to-start", "Pain & mobility", "Mayo explains how different specialists evaluate persistent back or spine problems and why seeing a surgeon does not necessarily mean needing surgery."),
    ("Mayo Clinic News Network", "2026-10-05", "Mayo Clinic Q&A: What are 5 ovarian cancer signs women may overlook?", "mayo-clinic-qa-what-are-5-ovarian-cancer-signs-women-may-overlook", "Screening & cancer", "A discussion of vague or easily overlooked ovarian cancer symptoms and why persistent changes deserve a medical evaluation rather than self-diagnosis."),
    ("Mayo Clinic News Network", "2026-10-02", "Mayo Clinic Q&A: How are rotator cuff tears treated?", "mayo-clinic-qa-how-are-rotator-cuff-tears-treated", "Pain & mobility", "Mayo explains how clinicians assess rotator cuff injuries and choose treatment approaches, including factors affecting surgery decisions and recovery."),
    ("National Institutes of Health", "2026-10-07", "Device helps people with paralysis communicate", "device-helps-people-paralysis-communicate", "Family health", "NIH describes a brain-computer interface tested in three people with paralysis that combined speech and gestures through a virtual avatar. This remains developing research."),
    ("National Institutes of Health", "2026-10-07", "Improving lung cancer detection", "improving-lung-cancer-detection", "Screening & cancer", "A targeted MRI contrast agent improved lung-cancer detection in mouse models. Further studies are needed before the approach can be established for patients."),
    ("National Institutes of Health", "2026-10-07", "Estimating cognitive impairment risk, timing", "estimating-cognitive-impairment-risk-timing", "Healthy aging", "Researchers combined blood biomarkers and genetic information to study future cognitive impairment. Risk estimates are not certain predictions of an individual’s diagnosis."),
    ("National Institutes of Health", "2026-09-29", "Antiviral drug did not improve Long COVID symptoms", "antiviral-drug-did-not-improve-long-covid-symptoms", "Public health", "NIH summarizes a clinical trial in which an extended antiviral treatment did not improve Long COVID symptoms. The finding concerns the studied regimen, not every possible treatment."),
    ("National Institutes of Health", "2026-09-23", "Clues to what causes multiple sclerosis", "clues-what-causes-multiple-sclerosis", "Family health", "An NIH research overview examines emerging clues about multiple sclerosis and approaches to reducing disease activity. Research advances do not yet amount to a cure."),
    ("National Institutes of Health", "2026-09-15", "Depression may stall development of new neurons", "depression-may-stall-development-new-neurons", "Mental health", "NIH explains research on depression and the development of neurons in a brain region involved in memory. Mechanistic findings are not a new clinical treatment recommendation."),
]


def normalize(text):
    return re.sub(r"\s+", " ", html.unescape(text).replace("’", "'").replace("‘", "'")).strip().casefold()


def fetch_feed(source):
    publisher, url = source
    with urllib.request.urlopen(url, timeout=45) as response:
        root = ET.fromstring(response.read())
    return [
        dict(publisher=publisher, title=html.unescape(item.findtext("title") or ""),
             url=item.findtext("link"), timestamp=item.findtext("pubDate"))
        for item in root.findall(".//item")
        if "/video/" not in (item.findtext("link") or "")
    ]


def main():
    feeds = [
        ("CBS News", "https://www.cbsnews.com/latest/rss/health"),
        ("NPR", "https://feeds.npr.org/1128/rss.xml"),
        *[("KFF Health News", f"https://kffhealthnews.org/feed/?paged={page}") for page in range(1, 6)],
    ]
    with concurrent.futures.ThreadPoolExecutor(max_workers=7) as pool:
        candidates = [record for feed in pool.map(fetch_feed, feeds) for record in feed]
    by_title = {normalize(record["title"]): record for record in candidates}
    records = []
    for title, category, summary in SELECTION:
        assert normalize(title) in by_title, f"Publisher feed no longer includes selected article: {title}"
        raw = by_title[normalize(title)]
        date = email.utils.parsedate_to_datetime(raw["timestamp"])
        records.append(dict(
            title=raw["title"], url=raw["url"], publisher=raw["publisher"],
            published=date.date().isoformat(), publishedAt=date.astimezone(timezone.utc).isoformat(),
            category=category, summary=summary, articleType="Health reporting",
            dateEvidence="Publisher RSS publication timestamp",
        ))
    for publisher, date, title, path, category, summary in VERIFIED:
        if publisher.startswith("Harvard"):
            url = f"https://www.health.harvard.edu/{path}"
        elif publisher.startswith("Mayo"):
            url = f"https://newsnetwork.mayoclinic.org/discussion/{path}/"
        else:
            url = f"https://www.nih.gov/news-events/nih-research-matters/{path}"
        records.append(dict(
            title=title, url=url, publisher=publisher, published=date,
            publishedAt=None, category=category, summary=summary,
            articleType="Research news" if publisher.startswith("National") else "Health explainer",
            dateEvidence="Publisher displayed article date or official dated edition/feed",
        ))
    for record in records:
        slug = urlparse(record["url"]).path.rstrip("/").split("/")[-1][:75]
        record["id"] = "recent-" + slug + "-" + hashlib.sha256(record["url"].encode()).hexdigest()[:8]
        assert "2026-09-15" <= record["published"] <= "2026-10-09", record["title"]
        assert record["url"].startswith("https://")
    assert len(records) == len({r["id"] for r in records}) == len({r["url"] for r in records}) == 50
    assert len({normalize(r["title"]) for r in records}) == 50
    records.sort(key=lambda r: (-datetime.fromisoformat(r["publishedAt"] or r["published"] + "T00:00:00+00:00").timestamp(), r["title"]))
    output = Path("artifacts/health-guide/src/data/recent-articles.json")
    output.write_text(json.dumps(dict(
        checked="October 9, 2026",
        selection="50 recent health reads curated for broad U.S. relevance; not a readership ranking or an exhaustive real-time news feed.",
        records=records,
    ), ensure_ascii=False, indent=2) + "\n")
    print(f"Built {len(records)} verified article references from {len({r['publisher'] for r in records})} publishers.")


if __name__ == "__main__":
    main()
