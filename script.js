let config = null;
let currentLanguage = "en";

function getValueByKey(source, key) {
  return key.split(".").reduce((value, segment) => {
    if (value == null) return undefined;
    return value[segment];
  }, source);
}

function getLocalizedText(value) {
  if (value == null) return "";
  if (typeof value === "object" && !Array.isArray(value)) {
    if ("en" in value || "sec" in value) {
      return value[currentLanguage] ?? value.en ?? "";
    }
  }
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

function applyThemeColors() {
  const colors = config?.theme_colors;
  if (!colors) return;

  const variableMap = {
    primary: "--primary",
    secondary: "--secondary",
    background: "--background",
    surface: "--surface",
    text: "--text",
    muted_text: "--muted",
  };

  const root = document.documentElement;
  Object.entries(variableMap).forEach(([name, variable]) => {
    if (colors[name]) root.style.setProperty(variable, colors[name]);
  });

  if (colors.background) {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", colors.background);
  }
}

function getAssetUrl(asset) {
  return asset?.public_url || asset?.local_path || "";
}

function renderHero() {
  const heroImage = document.getElementById("hero-image");
  const image = config?.media_assets?.hero_image;
  if (!heroImage || !image) return;

  heroImage.src = getAssetUrl(image);
  heroImage.alt = getLocalizedText(image.alt_text);
}

function renderTimeline() {
  const container = document.getElementById("timeline");
  if (!container) return;
  container.replaceChildren();

  (config?.story?.timeline || []).forEach((item) => {
    const article = document.createElement("article");
    article.className = "timeline-item";

    const year = document.createElement("div");
    year.className = "timeline-year";
    year.innerText = String(item.year ?? "");

    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.innerText = getLocalizedText(item.title);
    const description = document.createElement("p");
    description.innerText = getLocalizedText(item.description);
    copy.append(title, description);

    article.append(year, copy);
    container.append(article);
  });
}

function renderSchedule() {
  const container = document.getElementById("event-schedule");
  if (!container) return;
  container.replaceChildren();

  (config?.event_schedule || []).forEach((event) => {
    const card = document.createElement("article");
    card.className = "event-card";

    const name = document.createElement("h3");
    name.innerText = getLocalizedText(event.name);

    const date = document.createElement("div");
    date.className = "event-date";
    date.innerText = getLocalizedText(event.date);

    const time = document.createElement("div");
    time.className = "event-time";
    time.innerText = `${event.start_time || ""}${event.end_time ? ` – ${event.end_time}` : ""}`;

    const description = document.createElement("p");
    description.className = "event-description";
    description.innerText = getLocalizedText(event.description);

    const venue = document.createElement("div");
    venue.className = "venue";

    const venueName = document.createElement("strong");
    venueName.innerText = getLocalizedText(event.location?.venue_name);
    const address = document.createElement("div");
    address.innerText = getLocalizedText(event.location?.address);
    const dressCode = document.createElement("div");
    dressCode.className = "dress-code";
    dressCode.innerText = getLocalizedText(event.dress_code);
    venue.append(venueName, address, dressCode);

    if (event.location?.map_url) {
      const mapLink = document.createElement("a");
      mapLink.className = "map-link";
      mapLink.href = event.location.map_url;
      mapLink.target = "_blank";
      mapLink.rel = "noopener noreferrer";
      mapLink.innerText = currentLanguage === "sec"
        ? "Google మ్యాప్స్‌లో చిరునామా చూడండి"
        : "View address on Google Maps";
      mapLink.setAttribute("aria-label", mapLink.innerText);
      venue.append(mapLink);
    }

    card.append(name, date, time, description, venue);
    container.append(card);
  });
}

function renderGallery() {
  const container = document.getElementById("gallery-grid");
  if (!container) return;
  container.replaceChildren();

  (config?.media_assets?.gallery || []).forEach((item, index) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = getAssetUrl(item);
    image.alt = getLocalizedText(item.alt_text);
    image.loading = index === 0 ? "eager" : "lazy";
    figure.append(image);
    container.append(figure);
  });
}

function renderTravel() {
  const container = document.getElementById("travel-grid");
  if (!container) return;
  container.replaceChildren();

  const airport = config?.travel?.airport;
  if (airport) {
    const card = document.createElement("article");
    card.className = "travel-card";
    const name = document.createElement("strong");
    name.innerText = getLocalizedText(airport.name);
    const code = document.createElement("div");
    code.innerText = airport.code || "";
    const address = document.createElement("div");
    address.innerText = getLocalizedText(airport.address);
    const transfer = document.createElement("div");
    transfer.innerText = getLocalizedText(airport.estimated_transfer);
    card.append(name, code, address, transfer);
    container.append(card);
  }

  (config?.travel?.recommended_hotels || []).forEach((hotel) => {
    const card = document.createElement("article");
    card.className = "travel-card";
    const name = document.createElement("strong");
    name.innerText = getLocalizedText(hotel.name);
    const address = document.createElement("div");
    address.innerText = getLocalizedText(hotel.address);
    const distance = document.createElement("div");
    distance.innerText = getLocalizedText(hotel.distance_to_venue);
    card.append(name, address, distance);

    if (hotel.booking_url) {
      const link = document.createElement("a");
      link.className = "map-link";
      link.href = hotel.booking_url;
      link.target = "_blank";
      link.rel = "noopener";
      card.append(link);
    }
    container.append(card);
  });
}

function renderFaqs() {
  const container = document.getElementById("faq-list");
  if (!container) return;
  container.replaceChildren();

  (config?.faqs || []).forEach((faq) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.innerText = getLocalizedText(faq.question);
    const answer = document.createElement("p");
    answer.innerText = getLocalizedText(faq.answer);
    details.append(summary, answer);
    container.append(details);
  });
}

function renderLanguageToggle() {
  const button = document.getElementById("language-toggle");
  if (!button) return;

  const englishName = config?.language?.language_names?.en;
  const secondaryName = config?.language?.language_names?.sec;
  document.getElementById("language-en").innerText =
    englishName?.en === "English" ? "EN" : getLocalizedText(englishName);
  document.getElementById("language-sec").innerText =
    getLocalizedText(secondaryName);
  button.setAttribute(
    "aria-label",
    getLocalizedText(config?.language?.switcher_label),
  );
  document.documentElement.lang = currentLanguage;
}

function render() {
  if (!config) return;

  document.querySelectorAll("[data-key]").forEach((element) => {
    const value = getValueByKey(config, element.dataset.key);
    element.innerText = getLocalizedText(value);
  });

  if (config.metadata?.title) {
    document.title = getLocalizedText(config.metadata.title);
  }

  applyThemeColors();
  renderHero();
  renderTimeline();
  renderSchedule();
  renderGallery();
  renderTravel();
  renderFaqs();
  renderLanguageToggle();
}

async function loadConfig() {
  try {
    const response = await fetch("./invite-config.json", { cache: "no-store" });
    if (!response.ok)
      throw new Error(`Unable to load invite-config.json: ${response.status}`);

    config = await response.json();
    currentLanguage = config.language?.default === "sec" ? "sec" : "en";
    render();
  } catch (error) {
    console.error(error);
  }
}

const languageToggle = document.getElementById("language-toggle");
languageToggle?.addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "sec" : "en";
  render();
  requestAnimationFrame(setupScrollAnimations);
});

function setupScrollAnimations() {
  const selector = ".section-heading, .person-card, .timeline-item, .event-card, .gallery-grid figure, .travel-card, details";
  const targets = document.querySelectorAll(selector);

  targets.forEach((element, index) => {
    element.classList.add("reveal");
    if (index % 3 === 1) element.classList.add("reveal-delay-1");
    if (index % 3 === 2) element.classList.add("reveal-delay-2");
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach(element => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(element => revealObserver.observe(element));
  }

  const heroImage = document.querySelector(".hero-media img");
  if (heroImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let framePending = false;
    window.addEventListener("scroll", () => {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.18, 120);
        heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
        framePending = false;
      });
    }, { passive: true });
  }
}

window.addEventListener("load", () => {
  document.getElementById("preloader")?.classList.add("is-hidden");
});

loadConfig().finally(() => {
  requestAnimationFrame(setupScrollAnimations);
});

