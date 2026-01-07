import json
import random
from datetime import datetime, timedelta

# Highly granular account templates for maximum deception
ACCOUNTS = {
    "news": {
        "verified": [
            {"username": "The New York Times", "handle": "nytimes", "avatar": "https://ui-avatars.com/api/?background=random&name=nytimes.com"},
            {"username": "BBC News", "handle": "BBCNews", "avatar": "https://ui-avatars.com/api/?background=random&name=bbc.co.uk"},
            {"username": "Reuters", "handle": "Reuters", "avatar": "https://ui-avatars.com/api/?background=random&name=reuters.com"},
            {"username": "The Wall Street Journal", "handle": "WSJ", "avatar": "https://ui-avatars.com/api/?background=random&name=wsj.com"},
            {"username": "Associated Press", "handle": "AP", "avatar": "https://ui-avatars.com/api/?background=random&name=apnews.com"},
            {"username": "Bloomberg", "handle": "business", "avatar": "https://ui-avatars.com/api/?background=random&name=bloomberg.com"},
            {"username": "The Economist", "handle": "TheEconomist", "avatar": "https://ui-avatars.com/api/?background=random&name=economist.com"}
        ],
        "spoof": [
            {"username": "The New York Times", "handle": "ny_times_daily", "avatar": "https://ui-avatars.com/api/?background=random&name=nytimes.com"},
            {"username": "BBC News", "handle": "BBC_News_Flash", "avatar": "https://ui-avatars.com/api/?background=random&name=bbc.co.uk"},
            {"username": "Reuters News", "handle": "Reuters_Official", "avatar": "https://ui-avatars.com/api/?background=random&name=reuters.com"},
            {"username": "WSJ Breaking", "handle": "WSJ_News_Alert", "avatar": "https://ui-avatars.com/api/?background=random&name=wsj.com"},
            {"username": "Bloomberg News", "handle": "bloomberg_live", "avatar": "https://ui-avatars.com/api/?background=random&name=bloomberg.com"}
        ]
    },
    "govt": {
        "verified": [
            {"username": "NASA", "handle": "NASA", "avatar": "https://ui-avatars.com/api/?background=random&name=NASA"},
            {"username": "Dept. of Treasury", "handle": "USTreasury", "avatar": "https://ui-avatars.com/api/?background=random&name=TREASURY"},
            {"username": "European Central Bank", "handle": "ecb", "avatar": "https://ui-avatars.com/api/?background=random&name=ECB"},
            {"username": "United Nations", "handle": "UN", "avatar": "https://ui-avatars.com/api/?background=random&name=UN"},
            {"username": "Department of State", "handle": "StateDept", "avatar": "https://ui-avatars.com/api/?background=random&name=STATE"}
        ],
        "spoof": [
            {"username": "NASA Updates", "handle": "NASA_Live_X", "avatar": "https://ui-avatars.com/api/?background=random&name=NASA"},
            {"username": "Treasury Dept", "handle": "Treasury_Updates", "avatar": "https://ui-avatars.com/api/?background=random&name=TREASURY"},
            {"username": "ECB News", "handle": "ECB_Official_News", "avatar": "https://ui-avatars.com/api/?background=random&name=ECB"},
            {"username": "State Dept Global", "handle": "StateDept_Global", "avatar": "https://ui-avatars.com/api/?background=random&name=STATE"}
        ]
    },
    "tech_ceo": {
        "verified": [
            {"username": "Elon Musk", "handle": "elonmusk", "avatar": "https://i.pravatar.cc/150?u=elon"},
            {"username": "Satya Nadella", "handle": "satyanadella", "avatar": "https://i.pravatar.cc/150?u=satya"},
            {"username": "Sundar Pichai", "handle": "sundarpichai", "avatar": "https://i.pravatar.cc/150?u=sundar"},
            {"username": "Sam Altman", "handle": "sama", "avatar": "https://i.pravatar.cc/150?u=sama"},
            {"username": "Jensen Huang", "handle": "jensenh_nvidia", "avatar": "https://i.pravatar.cc/150?u=jensen"}
        ],
        "spoof": [
            {"username": "Elon Musk", "handle": "elon_musk_office", "avatar": "https://i.pravatar.cc/150?u=elon"},
            {"username": "Sam Altman", "handle": "sama_openai_ceo", "avatar": "https://i.pravatar.cc/150?u=sama"},
            {"username": "Satya Nadella", "handle": "satya_nadella_ms", "avatar": "https://i.pravatar.cc/150?u=satya"},
            {"username": "Sundar Pichai", "handle": "sundar_pichai_google", "avatar": "https://i.pravatar.cc/150?u=sundar"}
        ]
    }
}

# Post content lists (summarized for brevity in generation script)
# In real scenario, these would be much larger
TOPICS = ["Economy", "Science", "Geopolitics", "Health", "Climate", "Tech", "Space"]

def get_content(diff, is_fake):
    # This is a helper to generate semi-randomized content to reach 1000+ posts
    if diff == "easy":
        if is_fake:
            return f"BREAKING: Scientists discover that {random.choice(['clouds', 'rocks', 'ocean water'])} is actually made of {random.choice(['sugar', 'plastic', 'alien DNA'])}. #Shocking"
        return f"NASA's latest mission to {random.choice(['Mars', 'Jupiter', 'the Moon'])} successfully enters orbit today. #Space #NASA"
    elif diff == "medium":
        if is_fake:
            return f"New regulations on {random.choice(['cryptocurrency', 'AI', 'EVs'])} are secretly a way for governments to {random.choice(['read your mail', 'limit your travel', 'track your sleep'])}."
        return f"Global markets respond to the latest {random.choice(['jobs report', 'inflation data', 'tech merger'])} with moderate gains. #Finance"
    elif diff == "hard":
        if is_fake:
            return f"Leaked {random.choice(['CERN', 'IMF', 'WHO'])} documents suggest that the current {random.choice(['energy crisis', 'yield curve', 'viral variant'])} was modeled in 2014 as a 'behavioral test'."
        return f"The latest peer-reviewed findings in {random.choice(['Nature', 'Science', 'The Lancet'])} indicate a {random.randint(2,8)}% variance in {random.choice(['carbon sequestration', 'quantum decoherence', 'neural plasticity'])}."
    else: # impossible
        if is_fake:
            return f"Sub-section 4(c) of the {random.randint(2010,2024)} {random.choice(['Maritime Protocol', 'Digital Services Act', 'Aviation Treaty'])} secretly redefines {random.choice(['data encryption', 'territorial waters', 'airspace rights'])} as 'negotiable assets'."
        return f"The {random.randint(2010,2024)} revision of the {random.choice(['Harmonized Tariff Schedule', 'ISO 27001', 'GAAP standards'])} includes a clarifying footnote on {random.choice(['piezo-electric sensors', 'intangible depreciation', 'risk parity'])}."

def generate_full_database():
    all_posts = []
    start_date = datetime(2025, 12, 27)
    
    id_map = {"easy": 10000, "medium": 20000, "hard": 30000, "impossible": 40000}
    
    for difficulty in ["easy", "medium", "hard", "impossible"]:
        # 160 Verified, 160 Misinformation per difficulty = 320 total per difficulty
        # 320 * 4 = 1280 total
        for i in range(160):
            # Verified
            cat = random.choice(list(ACCOUNTS.keys()))
            acc = random.choice(ACCOUNTS[cat]["verified"])
            content = get_content(difficulty, False)
            all_posts.append({
                "id": id_map[difficulty] + i,
                "username": acc["username"],
                "handle": acc["handle"],
                "avatar": acc["avatar"],
                "content": content,
                "timestamp": (start_date + timedelta(minutes=random.randint(0, 100000))).isoformat() + "Z",
                "type": "Verified",
                "reasoning": f"This is a factual statement about {random.choice(TOPICS).lower()} from a verified source.",
                "difficulty": difficulty
            })
            
            # Misinformation
            cat = random.choice(list(ACCOUNTS.keys()))
            if difficulty in ["hard", "impossible"] and random.random() > 0.4:
                acc = random.choice(ACCOUNTS[cat]["verified"])
            else:
                acc = random.choice(ACCOUNTS[cat]["spoof"])
                
            content = get_content(difficulty, True)
            all_posts.append({
                "id": id_map[difficulty] + i + 10000, # Large offset for fakes
                "username": acc["username"],
                "handle": acc["handle"],
                "avatar": acc["avatar"],
                "content": content,
                "timestamp": (start_date + timedelta(minutes=random.randint(0, 100000))).isoformat() + "Z",
                "type": "Misinformation",
                "reasoning": f"This is a deceptive claim about {random.choice(TOPICS).lower()} designed to mislead readers.",
                "difficulty": difficulty
            })
            
    return all_posts

if __name__ == "__main__":
    final_posts = generate_full_database()
    with open("src/data/posts.json", "w") as f:
        json.dump(final_posts, f, indent=2)
    print(f"Database expanded. Now contains {len(final_posts)} posts.")