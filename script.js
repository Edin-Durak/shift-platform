// Get user's preferred language from localStorage or default to 'en'
let currentLang = localStorage.getItem("preferredLanguage") || "en";

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Set initial language
  setLanguage(currentLang);

  // Add event listeners to language switcher
  document.querySelectorAll(".lang-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = link.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  // Add event listeners to tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });
});

function setLanguage(lang) {
  currentLang = lang;

  // Save preference
  localStorage.setItem("preferredLanguage", lang);

  // Update HTML lang and direction
  const html = document.documentElement;
  html.setAttribute("lang", lang);
  html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  // Update content
  updateContent();

  // Update URL without page reload
  const url = new URL(window.location);
  url.searchParams.set("lang", lang);
  window.history.pushState({}, "", url);
}

function createTermsSection(termsData) {
  const container = document.createElement("div");
  container.className = "terms-content";

  // Add main content
  if (termsData.content) {
    const mainContent = document.createElement("p");
    mainContent.className = "terms-main-content";
    mainContent.textContent = termsData.content;
    container.appendChild(mainContent);
  }

  // Add sections
  if (termsData.sections) {
    termsData.sections.forEach((section) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "terms-section";

      if (section.title) {
        const sectionTitle = document.createElement("h3");
        sectionTitle.className = "section-title";
        sectionTitle.textContent = section.title;
        sectionDiv.appendChild(sectionTitle);
      }

      if (section.items) {
        const itemsList = document.createElement("div");
        itemsList.className = "terms-items";

        section.items.forEach((item) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "terms-item";

          if (item.subtitle) {
            const subtitle = document.createElement("h4");
            subtitle.className = "item-subtitle";
            subtitle.textContent = item.subtitle;
            itemDiv.appendChild(subtitle);
          }

          if (item.content) {
            const content = document.createElement("p");
            content.className = "item-content";
            content.textContent = item.content;
            itemDiv.appendChild(content);
          }

          if (item.subitems) {
            const subitemsList = document.createElement("ul");
            subitemsList.className = "subitems-list";
            item.subitems.forEach((subitem) => {
              const subitemLi = document.createElement("li");
              subitemLi.textContent = subitem;
              subitemsList.appendChild(subitemLi);
            });
            itemDiv.appendChild(subitemsList);
          }

          itemsList.appendChild(itemDiv);
        });

        sectionDiv.appendChild(itemsList);
      }

      container.appendChild(sectionDiv);
    });
  }

  return container;
}

function updateContent() {
  try {
    const translations = TRANSLATIONS[currentLang];
    if (!translations) {
      throw new Error(`No translations found for language: ${currentLang}`);
    }

    // Update tab buttons text
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      const lang = currentLang; // 'en' or 'ar'
      const translatedText = btn.getAttribute(`data-${lang}`);
      if (translatedText) {
        btn.textContent = translatedText;
      }
    });

    // Update Terms content
    const termsSection = document.getElementById("terms");
    if (termsSection && translations.terms) {
      // Clear existing content
      termsSection.innerHTML = "";

      // Add title
      const titleElement = document.createElement("h2");
      titleElement.textContent = translations.terms.title;
      termsSection.appendChild(titleElement);

      // Add introduction
      if (translations.terms.content) {
        const introDiv = document.createElement("div");
        introDiv.className = "terms-introduction";
        introDiv.textContent = translations.terms.content;
        termsSection.appendChild(introDiv);
      }

      // Add sections
      if (translations.terms.sections) {
        const sectionsContainer = document.createElement("div");
        sectionsContainer.className = "terms-sections";

        translations.terms.sections.forEach((section) => {
          const sectionDiv = document.createElement("div");
          sectionDiv.className = "terms-section";

          // Handle both title and subtitle
          if (section.title || section.subtitle) {
            const titleElement = document.createElement("h3");
            titleElement.className = section.title
              ? "section-title"
              : "section-subtitle";
            titleElement.textContent = section.title || section.subtitle;
            sectionDiv.appendChild(titleElement);
          }

          if (section.content) {
            const contentElement = document.createElement("p");
            contentElement.className = "section-content";
            contentElement.textContent = section.content;
            sectionDiv.appendChild(contentElement);
          }

          // Handle items array if it exists
          if (section.items) {
            const itemsList = document.createElement("ul");
            itemsList.className = "section-items";
            section.items.forEach((item) => {
              if (typeof item === "string") {
                // Handle simple string items
                const li = document.createElement("li");
                li.textContent = item;
                itemsList.appendChild(li);
              } else {
                // Handle complex items with subtitle/content/subitems
                const itemDiv = document.createElement("div");
                itemDiv.className = "terms-item";

                if (item.subtitle) {
                  const subtitle = document.createElement("h4");
                  subtitle.className = "item-subtitle";
                  subtitle.textContent = item.subtitle;
                  itemDiv.appendChild(subtitle);
                }

                if (item.content) {
                  const content = document.createElement("p");
                  content.className = "item-content";
                  content.textContent = item.content;
                  itemDiv.appendChild(content);
                }

                if (item.subitems) {
                  const subitemsList = document.createElement("ul");
                  subitemsList.className = "subitems-list";
                  item.subitems.forEach((subitem) => {
                    const li = document.createElement("li");
                    li.textContent = subitem;
                    subitemsList.appendChild(li);
                  });
                  itemDiv.appendChild(subitemsList);
                }

                itemsList.appendChild(itemDiv);
              }
            });
            sectionDiv.appendChild(itemsList);
          }

          sectionsContainer.appendChild(sectionDiv);
        });

        termsSection.appendChild(sectionsContainer);
      }
    }

    // Update Policy content
    const policySection = document.getElementById("policy");
    if (policySection && translations.policy) {
      // Clear existing content first
      policySection.innerHTML = "";

      // Add title
      const titleElement = document.createElement("h2");
      titleElement.textContent = translations.policy.title;
      policySection.appendChild(titleElement);

      // Add introduction/content
      const introDiv = document.createElement("div");
      introDiv.className = "policy-introduction";

      // Handle different content structures
      let introContent = "";
      if (translations.policy.introduction) {
        // English version structure
        introContent = translations.policy.introduction.content;
      } else if (translations.policy.content) {
        // Arabic version structure
        introContent = translations.policy.content;
      }

      introDiv.textContent = introContent;
      policySection.appendChild(introDiv);

      // Add sections
      if (translations.policy.sections) {
        const sectionsDiv = document.createElement("div");
        sectionsDiv.className = "policy-sections";

        translations.policy.sections.forEach((section) => {
          const sectionElement = document.createElement("div");
          sectionElement.className = "policy-section";

          // Add section title
          if (section.title) {
            const sectionTitle = document.createElement("h3");
            sectionTitle.textContent = section.title;
            sectionElement.appendChild(sectionTitle);
          }

          // Add section items
          if (section.items && section.items.length > 0) {
            const list = document.createElement("ul");
            section.items.forEach((item) => {
              const listItem = document.createElement("li");
              listItem.textContent = item;
              list.appendChild(listItem);
            });
            sectionElement.appendChild(list);
          }

          sectionsDiv.appendChild(sectionElement);
        });

        policySection.appendChild(sectionsDiv);
      }
    }
  } catch (error) {
    console.error("Error updating content:", error);
  }
}

function switchTab(tabId) {
  // Remove active class from all tabs and content
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".content")
    .forEach((content) => content.classList.remove("active"));

  // Add active class to selected tab and content
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

// Check URL parameters for language on page load
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  if (langParam && ["en", "ar"].includes(langParam)) {
    setLanguage(langParam);
  }
});

function changeLanguage(lang) {
  const html = document.documentElement;

  if (lang === "ar") {
    html.setAttribute("dir", "rtl");
    html.setAttribute("lang", "ar");
    // Add Arabic content here
  } else {
    html.setAttribute("dir", "ltr");
    html.setAttribute("lang", "en");
    // Add English content here
  }
}
