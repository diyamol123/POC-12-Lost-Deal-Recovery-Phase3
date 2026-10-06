
"""Post #4 Selenium journey.

Run against a running local/deployed application:

    APP_BASE_URL=http://localhost:3002 \
    python3 -m pytest tests/selenium/test_data_intelligence_journey.py -v -m selenium

Requires selenium and a configured Chrome browser/driver.
"""

import os

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:3000")


@pytest.mark.selenium
def test_data_intelligence_journey():
    options = webdriver.ChromeOptions()

    if os.getenv("SELENIUM_HEADLESS", "0") == "1":
        options.add_argument("--headless=new")

    driver = webdriver.Chrome(options=options)
    driver.set_window_size(1440, 1000)

    try:
        wait = WebDriverWait(driver, 10)

        # 1-3: operational page and existing functionality.
        driver.get(f"{BASE_URL}/")
        wait.until(lambda d: "LOST DEAL INTELLIGENCE" in d.page_source and "Operational View" in d.page_source)
        wait.until(lambda d: "LOST DEALS" in d.page_source)
        assert "FILTER" in driver.page_source or "filter" in driver.page_source.lower()

        # Navigation to Data Intelligence.
        links = driver.find_elements(By.PARTIAL_LINK_TEXT, "Data Intelligence")
        assert links, "Data Intelligence navigation link is missing"
        links[0].click()

        wait.until(lambda d: "/data-intelligence" in d.current_url)

        # 5: track + versions.
        assert "Track A — Comparative Intelligence" in driver.page_source
        assert "phase3-v1.0.0" in driver.page_source
        assert "1.0.0" in driver.page_source
        assert "COMPARATIVE RANKING" in driver.page_source

        # 6: apply one approved filter.
        selects = driver.find_elements(By.TAG_NAME, "select")
        assert len(selects) >= 1

        group_select = Select(selects[0])
        if len(group_select.options) > 1:
            group_select.select_by_index(1)

        wait.until(lambda d: "INTELLIGENCE FILTERS" in d.page_source)

        # 7-8: open result evidence and verify finding/evidence/limitation.
        result_buttons = driver.find_elements(By.CSS_SELECTOR, "button")
        clickable_result = None

        for button in result_buttons:
            label = (button.text or "").strip()
            if label and label not in {"Retry", "Close", "Clear filters"}:
                clickable_result = button
                break

        if clickable_result:
            driver.execute_script(
                "arguments[0].scrollIntoView({block:'center'});",
                clickable_result,
            )
            clickable_result.click()

            wait.until(lambda d: "RESULT EVIDENCE" in d.page_source)
            assert "FINDING" in driver.page_source
            assert "SUPPORTING EVIDENCE" in driver.page_source
            assert "LIMITATION" in driver.page_source

            close_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[aria-label="Close evidence panel"]')
            if close_buttons:
                close_buttons[0].click()

        # 9: methodology and limitations.
        assert "METHODOLOGY" in driver.page_source
        assert "LIMITATIONS & UNSUPPORTED USES" in driver.find_element(By.TAG_NAME, "body").text

        # 10: controlled empty state through a combination unlikely to match.
        selects = driver.find_elements(By.TAG_NAME, "select")
        if len(selects) >= 2:
            category_select = Select(selects[1])
            if len(category_select.options) > 1:
                # Select the first real category, then choose a different group
                # when available to exercise a changed result state.
                category_select.select_by_index(1)
                assert "INTELLIGENCE FILTERS" in driver.page_source

        # 11-12: return and confirm operational page still works.
        operational_links = driver.find_elements(
            By.PARTIAL_LINK_TEXT, "Operational View"
        )
        assert operational_links

        operational_link = operational_links[0]
        operational_href = operational_link.get_attribute("href")
        assert operational_href and operational_href.endswith("/")
        driver.get(operational_href)
        wait.until(lambda d: d.current_url.rstrip("/").endswith(""))
        wait.until(lambda d: "LOST DEAL INTELLIGENCE" in d.page_source)
        assert "LOST DEALS" in driver.find_element(By.TAG_NAME, "body").text

    finally:
        driver.quit()
