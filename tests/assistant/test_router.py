from backend.assistant.router import classify_question
from backend.assistant.errors import AssistantValidationError


def test_top_category():
    match = classify_question("Which lost-deal category has the highest total deal value?")
    assert match.intent == "top_category"


def test_top_categories():
    match = classify_question("What are the top 3 lost-deal categories?")
    assert match.intent == "top_categories"
    assert match.parameters == {"limit": 3}


def test_rank():
    match = classify_question("What is the ranking of Price?")
    assert match.intent == "category_rank"
    assert match.parameters["group_key"] == "Price"


def test_evidence():
    match = classify_question("What evidence supports Price?")
    assert match.intent == "category_evidence"
    assert match.parameters["group_key"] == "Price"


def test_compare():
    match = classify_question("Compare Price and Competitor")
    assert match.intent == "compare_categories"
    assert match.parameters == {"group_key_a": "Price", "group_key_b": "Competitor"}


def test_limitations():
    assert classify_question("What limitations apply to this analysis?").intent == "analysis_limitations"


def test_versions():
    assert classify_question("What data and method versions are currently being used?").intent == "package_versions"


def test_validation():
    assert classify_question("What is the validation status of the intelligence package?").intent == "validation_status"


def test_unsupported_is_rejected():
    try:
        classify_question("Predict which deal will be recovered next.")
    except AssistantValidationError:
        pass
    else:
        raise AssertionError("Unsupported question was not rejected")
