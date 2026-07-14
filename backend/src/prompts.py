"""Routing system prompt, few-shot examples, and the summarization prompt."""

from src.taxonomy import PRIORITY_RUBRIC

ROUTING_SYSTEM_PROMPT = f"""\
You are a support ticket routing engine. You read one ENGLISH support message and
return ONLY a JSON object. Never add prose, markdown, or code fences.

A single message may contain MORE THAN ONE independent issue. Detect every
independent issue and return one object per issue in an "issues" array. If there is
only one issue, return an array with a single object.

Personal data may already be masked as [EMAIL], [PHONE], [CARD], [AADHAAR], [PAN],
[ACCOUNT]. Treat placeholders as normal text.

CATEGORIES (choose exactly one per issue):
1. Authentication & Login
2. Billing & Payments
3. Technical Bug
4. Performance & Availability
5. Feature Request
6. Account Management
7. Security & Access
8. Orders & Operations
9. General / Uncategorized   (fallback: vague, insufficient info, spam, unsupported)

{PRIORITY_RUBRIC}
RULES:
- Emotional tone (anger, capitals, exclamation marks) does NOT change priority.
- Split only genuinely INDEPENDENT problems. Do not split one problem into pieces
  (a crash with an error message is one issue).
- If the message is too vague or unclassifiable, use "General / Uncategorized".
- If an issue fits two categories, pick the PRIMARY intent and explain it in reasoning.
- reasoning must be ONE line, <= 160 chars, stating the single deciding factor.
- confidence is YOUR certainty in this issue's category, from 0.0 to 1.0. A clear,
  unambiguous message is high (0.85-1.0); a vague or borderline call is lower (0.4-0.7).

Return JSON: {{ "issues": [ {{ "category": ..., "priority": ..., "confidence": ..., "reasoning": ... }}, ... ] }}
Do NOT include id or assigned_team; the backend adds them.
"""

SUMMARIZATION_PROMPT = """\
Condense this support message for a routing system. Preserve EVERY distinct problem,
request, and any urgency or impact signal (who is affected, whether work is blocked).
Do not solve anything, do not add information. Output plain text, <= ~120 words.
"""

FEW_SHOT_EXAMPLES = [
    {
        "ticket": "I was double charged for my subscription this month, please refund the extra payment.",
        "issues": [
            {
                "category": "Billing & Payments",
                "priority": "High",
                "confidence": 0.95,
                "reasoning": "Duplicate charge is a direct financial loss to the customer.",
            }
        ],
    },
    {
        "ticket": "I got an email alert about a login to my account from a country I've never visited.",
        "issues": [
            {
                "category": "Security & Access",
                "priority": "High",
                "confidence": 0.95,
                "reasoning": "Suspicious login is a potential account compromise.",
            }
        ],
    },
    {
        "ticket": "The whole platform has been down for everyone in our office since 9am, nobody can work.",
        "issues": [
            {
                "category": "Performance & Availability",
                "priority": "High",
                "confidence": 0.95,
                "reasoning": "Full outage blocking many users' work.",
            }
        ],
    },
    {
        "ticket": "It would be great if you could add a dark mode option to the dashboard.",
        "issues": [
            {
                "category": "Feature Request",
                "priority": "Low",
                "confidence": 0.95,
                "reasoning": "Enhancement suggestion, no workflow blocked.",
            }
        ],
    },
    {
        "ticket": "THIS IS RIDICULOUS!!! NOTHING WORKS AND NO ONE HELPS ME!!!",
        "issues": [
            {
                "category": "General / Uncategorized",
                "priority": "Low",
                "confidence": 0.5,
                "reasoning": "Angry but no concrete problem stated; tone ignored for priority.",
            }
        ],
    },
    {
        "ticket": "broken",
        "issues": [
            {
                "category": "General / Uncategorized",
                "priority": "Low",
                "confidence": 0.35,
                "reasoning": "Too vague to classify; needs clarification from the customer.",
            }
        ],
    },
    {
        "ticket": "The export button on the reports page crashes and shows a 500 error every time.",
        "issues": [
            {
                "category": "Technical Bug",
                "priority": "Medium",
                "confidence": 0.9,
                "reasoning": "Reproducible crash with error; treated as one issue, not two.",
            }
        ],
    },
    {
        "ticket": "Can you update the email address on my account to my new one?",
        "issues": [
            {
                "category": "Account Management",
                "priority": "Low",
                "confidence": 0.9,
                "reasoning": "Routine profile change, no urgency.",
            }
        ],
    },
    {
        "ticket": "My order shipped four days ago but the tracking page still shows no updates.",
        "issues": [
            {
                "category": "Orders & Operations",
                "priority": "Medium",
                "confidence": 0.85,
                "reasoning": "One user's delivery affected; workaround is waiting or contacting carrier.",
            }
        ],
    },
    {
        "ticket": "I can't log in, it keeps saying my password is incorrect even after resetting it.",
        "issues": [
            {
                "category": "Authentication & Login",
                "priority": "Medium",
                "confidence": 0.9,
                "reasoning": "Single user's login blocked; not a wider outage.",
            }
        ],
    },
    {
        "ticket": "Oh WOW, another 'update' and the export button STILL doesn't work. Impressive work, really.",
        "issues": [
            {
                "category": "Technical Bug",
                "priority": "Medium",
                "confidence": 0.8,
                "reasoning": "Sarcastic tone ignored; one user's export feature broken with a workaround.",
            }
        ],
    },
    {
        "ticket": "This is SO ANNOYING, the page took like 3 whole seconds to load just now, unacceptable!!",
        "issues": [
            {
                "category": "Performance & Availability",
                "priority": "Low",
                "confidence": 0.6,
                "reasoning": "Angry tone ignored; minor one-off slowness, no real impact.",
            }
        ],
    },
    {
        "ticket": "I got double charged after the app crashed during checkout.",
        "issues": [
            {
                "category": "Billing & Payments",
                "priority": "High",
                "confidence": 0.7,
                "reasoning": "Primary intent is the financial impact of the double charge.",
            }
        ],
    },
    {
        "ticket": "I was double charged this month, and separately I can't log in anymore, and could you add dark mode?",
        "issues": [
            {
                "category": "Billing & Payments",
                "priority": "Medium",
                "confidence": 0.85,
                "reasoning": "Duplicate charge reported without urgency escalation.",
            },
            {
                "category": "Authentication & Login",
                "priority": "Medium",
                "confidence": 0.85,
                "reasoning": "Single user locked out; likely has a workaround.",
            },
            {
                "category": "Feature Request",
                "priority": "Low",
                "confidence": 0.9,
                "reasoning": "Dark mode is a suggestion, not a blocker.",
            },
        ],
    },
]
