import os

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.getenv("APP_BASE_URL", "http" + "://" + "localhost:3002")


@pytest.mark.selenium
def test_data_intelligence_journey():
    options = webdriver.ChromeOptions()

    if os.getenv("SELENIUM_HEADLESS", "0") == "1":
        options.add_argument("--headless=new")

    driver = webdriver.Chrome(options=options)
    driver.set_window_size(1440, 1000)

    try:
        wait = WebDriverWait(driver, 15)

        # 1-3: operational page and existing functionality.
        driver.get(f"{BASE_URL}/")

        wait.until(
            lambda d: (
                "LOST DEAL INTELLIGENCE" in d.page_source
                and "Operational View" in d.page_source
                and "LOST DEALS" in d.page_source
            )
        )

        assert (
            "FILTER" in driver.page_source
            or "filter" in driver.page_source.lower()
        )

        # Navigation to Data Intelligence.
        links = driver.find_elements(
            By.PARTIAL_LINK_TEXT, "Data Intelligence"
        )
        assert links, "Data Intelligence navigation link is missing"
        links[0].click()

        wait.until(lambda d: "/data-intelligence" in d.current_url)

        # Wait for the actual Data Intelligence content to finish loading.
        wait.until(
            lambda d: (
                "Track A — Comparative Intelligence" in d.page_source
                and "phase3-v1.0.0" in d.page_source
                and "1.0.0" in d.page_source
            )
        )

        # 5: track + versions.
        assert "Track A — Comparative Intelligence" in driver.page_source
        assert "phase3-v1.0.0" in driver.page_source
        assert "1.0.0" in driver.page_source

        # Intelligence result content.
        wait.until(
            lambda d: (
                "Price" in d.page_source
                and "Competitor" in d.page_source
            )
        )

        assert "Price" in driver.page_source
        assert "Competitor" in driver.page_source

        # Select Price and verify that it becomes the active finding.
        price_button = wait.until(
            lambda d: d.find_element(
                By.CSS_SELECTOR,
                'button[aria-label="View evidence for Price"]',
            )
        )
        price_button.click()

        wait.until(
            lambda d: "RESULT EVIDENCE" in d.page_source
            and "CRM-012" in d.page_source
        )

        price_button = driver.find_element(
            By.CSS_SELECTOR,
            'button[aria-label="View evidence for Price"]',
        )
        assert price_button.get_attribute("aria-pressed") == "true"

        # Inspect the actual supporting CRM-012 record.
        crm_record_button = wait.until(
            lambda d: next(
                (
                    button
                    for button in d.find_elements(By.TAG_NAME, "button")
                    if button.text.strip() == "CRM-012"
                ),
                False,
            )
        )
        crm_record_button.click()

        wait.until(
            lambda d: "CRM RECORD INSPECTION" in d.page_source
        )
        assert "CRM-012" in driver.page_source

        # Verify the saved sensitivity result is linked to Price.
        wait.until(
            lambda d: "Selected finding" in d.page_source
            and "Competitor" in d.page_source
        )
        assert "Removed record: CRM-012" in driver.page_source

        # Close the evidence drawer without losing the selected finding.
        close_button = wait.until(
            lambda d: d.find_element(
                By.XPATH,
                "//aside[@role='dialog']//button[normalize-space()='Close']",
            )
        )
        close_button.click()

        wait.until(
            lambda d: "RESULT EVIDENCE" not in d.page_source
        )

        assistant_button = wait.until(
            lambda d: d.find_element(
                By.CSS_SELECTOR,
                'button[aria-label="Explain the selected Price finding"]',
            )
        )
        assistant_button.click()

        # Verify deterministic answer and Gemini/fallback explanation.
        wait.until(
            lambda d: "Grounded answer" in d.page_source
        )
        assert "Price is ranked #1" in driver.page_source
        assert "Gemini explanation" in driver.page_source

        # Mobile responsive validation: 390 x 844.
        driver.set_window_size(390, 844)
        driver.get(f"{BASE_URL}/")

        wait.until(
            lambda d: "LOST DEALS" in d.page_source
        )

        mobile_overflow = driver.execute_script(
            "return document.documentElement.scrollWidth > window.innerWidth"
        )
        assert not mobile_overflow, "Operational dashboard has horizontal page overflow on mobile."

        assert len(driver.find_elements(By.TAG_NAME, "select")) >= 6, (
            "One or more operational filters are missing on mobile."
        )

        driver.get(f"{BASE_URL}/data-intelligence")

        wait.until(
            lambda d: (
                "Track A — Comparative Intelligence" in d.page_source
                and "phase3-v1.0.0" in d.page_source
            )
        )

        mobile_overflow = driver.execute_script(
            "return document.documentElement.scrollWidth > window.innerWidth"
        )
        assert not mobile_overflow, "Recovery Intelligence has horizontal page overflow on mobile."
        assert "Price" in driver.page_source
        assert "Competitor" in driver.page_source

    finally:
        driver.quit()
