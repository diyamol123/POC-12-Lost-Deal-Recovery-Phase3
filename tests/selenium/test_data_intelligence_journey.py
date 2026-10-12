import os

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:3003")


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

    finally:
        driver.quit()
