from playwright.sync_api import sync_playwright

def verify(page):
    page.goto("http://localhost:8000")
    # Expect "Booting Vibe..." text
    page.get_by_text("Booting Vibe...").wait_for()
    page.screenshot(path="verification/booting.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify(page)
        finally:
            browser.close()
