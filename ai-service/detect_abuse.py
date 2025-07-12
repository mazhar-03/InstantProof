from better_profanity import profanity

profanity.load_censor_words()

def detect_abuse(text: str):
    if not text:
        return {
            "has_profanity": False,
            "has_threats": False,
            "detected_words": []
        }

    profane = profanity.contains_profanity(text)

    threat_keywords = ["kill", "bomb", "attack", "threat", "shoot", "die", "destroy", "atakan"]
    detected = [word for word in threat_keywords if word in text.lower()]

    return {
        "has_profanity": profane,
        "has_threats": len(detected) > 0,
        "detected_words": detected
    }
