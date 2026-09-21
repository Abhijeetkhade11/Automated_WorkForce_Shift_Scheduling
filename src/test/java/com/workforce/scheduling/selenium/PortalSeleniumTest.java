package com.workforce.scheduling.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PortalSeleniumTest {

    @LocalServerPort
    private int port;

    private WebDriver driver;

    @BeforeAll
    public void setupClass() {
        WebDriverManager.chromedriver().setup();
    }

    @BeforeEach
    public void setupTest() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    }

    @AfterEach
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Verify Portal Title & Brand Logo Header")
    public void testHomePageTitleAndBrand() {
        driver.get("http://localhost:" + port);

        String pageTitle = driver.getTitle();
        assertTrue(pageTitle.contains("Workforce Scheduling System"), "Page title should contain Workforce Scheduling System");

        WebElement brandHeading = driver.findElement(By.cssSelector(".brand h2"));
        assertEquals("ShiftFlow", brandHeading.getText().trim(), "Brand logo title should match ShiftFlow");
    }

    @Test
    @DisplayName("Verify Navigation Tab Switching to Shift Board")
    public void testNavigationTabs() {
        driver.get("http://localhost:" + port);

        WebElement shiftBoardTab = driver.findElement(By.cssSelector("a[data-tab='shifts']"));
        shiftBoardTab.click();

        WebElement sectionTitle = driver.findElement(By.id("current-section-title"));
        assertEquals("Available Roster Slots", sectionTitle.getText().trim(), "Section title should change to Available Roster Slots");
    }

    @Test
    @DisplayName("Verify Login Auth Modal Overlay Opens")
    public void testLoginModalVisibility() {
        driver.get("http://localhost:" + port);

        WebElement loginBtn = driver.findElement(By.id("btn-show-login"));
        loginBtn.click();

        WebElement authModal = driver.findElement(By.id("auth-modal"));
        String displayStyle = authModal.getCssValue("display");
        assertNotEquals("none", displayStyle, "Auth modal display should not be 'none' when clicked");
    }
}
