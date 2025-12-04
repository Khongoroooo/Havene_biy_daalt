import os
import time
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

# ===========================
# Supabase тохиргоо
# ===========================
load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
TABLE_NAME = "uneguiscrape"

# ===========================
# Ангилал, хуудасны тоо
# ===========================
CATEGORIES = {
    "oron-suuts-zarna": 50,
    "oron-suuts-treesllne": 50
}

BASE_LIST_URL = "https://www.unegui.mn/l-hdlh/l-hdlh-zarna/{category}/?page={page}"
BASE_URL = BASE_LIST_URL  # Detail page format

# ===========================
# Selenium тохиргоо
# ===========================
chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)
chrome_options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# ===========================
# Driver init
# ===========================
def init_driver():
    try:
        service = Service()
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return driver
    except Exception as e:
        print(f"❌ Драйвер эхлүүлэхэд алдаа гарлаа: {e}")
        return None

# ===========================
# List link fetch
# ===========================
def fetch_list_links(driver, category, page):
    url = BASE_LIST_URL.format(category=category, page=page)
    try:
        driver.get(url)
        time.sleep(5)

        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "a.announcement__title-link, div.no-announcements"))
        )

        no_results = driver.find_elements(By.CSS_SELECTOR, "div.no-announcements")
        if no_results:
            return []

        links = []
        elems = driver.find_elements(By.CSS_SELECTOR, "a.announcement__title-link")

        for e in elems:
            href = e.get_attribute("href")
            if href and "unegui.mn" in href:
                links.append(href)

        return links
    except TimeoutException:
        print(f"⏳ Хуудас {url} ачааллахад хэтэрсэн")
        return []
    except Exception as e:
        print(f"❌ Линк татахад алдаа: {e}")
        return []

# ===========================
# Detail fetch
# ===========================
def fetch_detail(driver, url):
    try:
        driver.get(url)
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "h1.title-announcement, section.list-announcement"))
        )
        time.sleep(1)

        data = {"url": url}

        # Гарчиг
        try:
            title_elem = driver.find_element(By.CSS_SELECTOR, "h1.title-announcement")
            data["title"] = title_elem.text.strip()
        except:
            data["title"] = None

        # Үнэ
        try:
            section = driver.find_element(By.CSS_SELECTOR, "section.list-announcement")
            price_data = section.get_attribute("data-price")
            if price_data:
                data["price"] = price_data
            else:
                price_text = driver.find_element(By.CSS_SELECTOR, "span.price-announcement").text.strip()
                data["price"] = price_text
        except:
            data["price"] = None

        # Байршил
        try:
            place_elem = driver.find_element(By.CSS_SELECTOR, "a.announcement__location")
            data["place"] = place_elem.text.strip()
        except:
            try:
                place_elem = driver.find_element(By.CSS_SELECTOR, "span[itemprop='address']")
                data["place"] = place_elem.text.strip()
            except:
                data["place"] = None

        # Огноо
        try:
            data_elem = driver.find_element(By.CSS_SELECTOR, "span.date-meta")
            data["date"] = data_elem.text.strip()
        except:
            data["date"] = None

        # Зураг
        images = []
        try:
            img_elems = driver.find_elements(By.CSS_SELECTOR, "div.announcement__images img, div.image-gallery img")
            for img in img_elems:
                src = img.get_attribute("data-full") or img.get_attribute("src")
                if src and "http" in src and src not in images:
                    if "small" in src:
                        src = src.replace("small", "big")
                    images.append(src)
        except:
            pass

        data["images"] = images[:10]

        # Характеристикууд
        characteristics = {}
        try:
            li_elems = driver.find_elements(By.CSS_SELECTOR, "ul.chars-column li")
            for li in li_elems:
                try:
                    key = li.find_element(By.CSS_SELECTOR, "span.key-chars").text.strip()
                    val = li.find_element(By.CSS_SELECTOR, "span.value-chars").text.strip()
                    characteristics[key] = val
                except:
                    continue
        except:
            pass

        data["characteristics"] = characteristics

        # Тайлбар
        try:
            desc = driver.find_element(By.CSS_SELECTOR, "div.js-description")
            data["description"] = desc.text.strip()
        except:
            data["description"] = None

        # Ангилал
        try:
            crumbs = driver.find_elements(By.CSS_SELECTOR, "nav.breadcrumbs a")
            data["category"] = crumbs[-1].text.strip()
        except:
            data["category"] = None

        # ID
        try:
            data["ad_id"] = url.rstrip("/").split("/")[-1]
        except:
            data["ad_id"] = None

        data["created_at"] = time.strftime("%Y-%m-%d %H:%M:%S")

        if not data["title"]:
            return None

        return data

    except TimeoutException:
        print(f"⏳ Зарын хуудас {url} ачааллахад хэтэрсэн")
        return None
    except Exception as e:
        print(f"❌ Дэлгэрэнгүй татахад алдаа ({url}): {e}")
        return None

# ===========================
# Supabase insert/update
# ===========================
def insert_supabase(data):
    try:
        existing = supabase.table(TABLE_NAME).select("id").eq("url", data["url"]).execute()

        if existing.data:
            supabase.table(TABLE_NAME).update(data).eq("url", data["url"]).execute()
            return True

        supabase.table(TABLE_NAME).insert(data).execute()
        return True

    except Exception as e:
        print(f"❌ Supabase руу оруулахад алдаа: {e}")
        return False

# ===========================
# Worker task
# ===========================
def worker_task(url, driver):
    try:
        data = fetch_detail(driver, url)
        if data:
            success = insert_supabase(data)
            return url, success, None
        else:
            return url, False, "fetch_failed"
    except Exception as e:
        return url, False, str(e)

# ===========================
# MAIN
# ===========================
def main():
    print("🚀 Унэгүй сайтаас мэдээлэл татаж эхэллээ...")

    list_driver = init_driver()
    if not list_driver:
        print("❌ Драйвер эхлүүлэх боломжгүй")
        return

    all_links = []
    print("📥 Линк scrape хийж байна...")

    for category, max_page in CATEGORIES.items():
        for page in range(1, max_page + 1):
            print(f"  📄 {category} - хуудас {page}")
            links = fetch_list_links(list_driver, category, page)
            all_links.extend(links)
            time.sleep(1)
            if page > 1 and not links:
                break

    list_driver.quit()

    print(f"📊 Нийт {len(all_links)} линк оллоо")
    unique_links = list(set(all_links))
    print(f"📊 Өвөрмөц линк: {len(unique_links)}")

    failed_urls = []
    success_count = 0
    print("📄 Detail scrape + Supabase upload...")

    with ThreadPoolExecutor(max_workers=3) as executor:
        drivers = [init_driver() for _ in range(3)]
        future_map = {}
        for url in unique_links:
            driver = drivers[len(future_map) % 3]
            future = executor.submit(worker_task, url, driver)
            future_map[future] = url

        for future in tqdm(as_completed(future_map), total=len(future_map), desc="Scraping"):
            try:
                url, success, error = future.result()
                if success:
                    success_count += 1
                else:
                    failed_urls.append({"url": url, "error": error})
            except Exception as e:
                failed_urls.append({"url": future_map[future], "error": str(e)})

    for d in drivers:
        if d:
            d.quit()

    print("\n==============================")
    print(f"✅ Амжилттай: {success_count}")
    print(f"❌ Алдаа: {len(failed_urls)}")
    print("==============================")

    if failed_urls:
        with open("failed_urls.json", "w", encoding="utf-8") as f:
            json.dump(failed_urls, f, ensure_ascii=False, indent=2)

    success_urls = [u for u in unique_links if not any(f["url"] == u for f in failed_urls)]
    if success_urls:
        with open("success_urls.json", "w", encoding="utf-8") as f:
            json.dump(success_urls, f, ensure_ascii=False, indent=2)

    print("🎉 Скрейп дууслаа!")

if __name__ == "__main__":
    main()
