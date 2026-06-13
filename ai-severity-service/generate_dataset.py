import random
import pandas as pd

CRITICAL = [
    ("cardiac arrest", "person unconscious not breathing chest pain collapsed"),
    ("bleeding", "bleeding heavily large blood loss pressure not stopping"),
    ("accident", "road accident multiple victims trapped unconscious severe trauma"),
    ("burns", "severe burns face smoke inhalation difficulty breathing"),
    ("stroke", "face drooping cannot speak arm weakness sudden collapse"),
    ("overdose", "unconscious overdose shallow breathing lips blue"),
]
MEDIUM = [
    ("fracture", "possible broken leg severe pain swelling cannot walk"),
    ("bleeding", "moderate bleeding cut deep but conscious"),
    ("burns", "second degree burn painful blisters on arm"),
    ("asthma", "breathing difficulty wheezing inhaler not helping"),
    ("accident", "bike crash conscious shoulder pain"),
    ("head injury", "dizzy after fall vomiting once conscious"),
]
LOW = [
    ("minor cut", "small cut mild bleeding patient alert"),
    ("sprain", "ankle sprain mild swelling can walk"),
    ("fever", "high temperature but breathing normally alert"),
    ("minor burn", "small burn on finger no blister"),
    ("panic", "panic attack anxious breathing fast but conscious"),
    ("fall", "slipped and fell mild pain no visible injury"),
]

NOISE = ["near library", "on main road", "at home", "in office", "crowd gathering", "needs help", "please hurry", "child involved", "elderly patient", "during sports event"]

def generate(n: int = 240, seed: int = 7) -> pd.DataFrame:
    random.seed(seed)
    rows = []
    buckets = [("CRITICAL", CRITICAL), ("MEDIUM", MEDIUM), ("LOW", LOW)]
    for label, examples in buckets:
        for _ in range(n // 3):
            injury, desc = random.choice(examples)
            victims = random.choices([1, 2, 3, 4, 5], weights=[55, 20, 12, 8, 5])[0]
            if label == "CRITICAL":
                victims = random.choices([1, 2, 3, 4, 5, 8], weights=[35, 22, 18, 12, 8, 5])[0]
            text = desc + " " + " ".join(random.sample(NOISE, k=random.randint(1, 3)))
            rows.append({"victim_count": victims, "injury_type": injury, "incident_description": text, "severity": label})
    random.shuffle(rows)
    return pd.DataFrame(rows)

if __name__ == "__main__":
    df = generate()
    df.to_csv("synthetic_severity_dataset.csv", index=False)
    print(f"Generated {len(df)} examples -> synthetic_severity_dataset.csv")
