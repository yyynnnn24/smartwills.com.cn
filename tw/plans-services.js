(() => {
  const viewSwitch = document.querySelector(".ps-view-switch");
  const viewToggle = document.querySelector("[data-view-toggle]");
  const viewButtons = Array.from(document.querySelectorAll("[data-view]"));
  const viewPanels = Array.from(document.querySelectorAll("[data-view-panel]"));
  const serviceButtons = Array.from(document.querySelectorAll("[data-service]"));
  const servicePanels = Array.from(document.querySelectorAll("[data-service-panel]"));
  const nationalityButtons = Array.from(document.querySelectorAll("[data-nationality]"));

  const planData = {
    "chinese": {
        title: "智承遺囑規劃",
        intro: "專為希望以簡單、有系統的方式準備遺囑的中國公民而設，讓您清楚指定受益人、遺囑執行人及監護人，並為未來明確表達自己的意願。",
        note: "立遺囑人、遺囑執行人、監護人、見證人及受益人皆須為中國公民，並必須使用中國身份證號碼作為相關人士的身份識別資料。",
        names: ["智承標準遺囑", "智承進階遺囑"],
        prices: ["CNY 688", "CNY 1,388"],
        summaries: ["一個簡單的遺產計劃，以單次分配，以便簡單而清晰的遺產規劃。", "一個更詳細的遺囑計劃，以更大的控制和靈活性來詳細分配資產。"],
        best: ["一個簡單的遺產計劃，以單次分配，以便簡單而清晰的遺產規劃。", "個人希望列出特定資產，並且對遺產規劃有更大的細節和控制。"],
        buttonLabels: ["立即選擇方案", "立即選擇方案"],
        buttonLinks: ["https://app.mysmartwills.com/?item_id=2", "https://app.mysmartwills.com/?item_id=4"],
        features: [[], []],
        plus: false,
        package: false
    },
    "non-chinese": {
        title: "智承遺囑規劃 Plus",
        intro: "專為涉及非中國公民的情況而設。當立遺囑人或相關人士中包含非中國公民時，此方案可提供更合適的遺囑規劃選擇。",
        note: "若立遺囑人、遺囑執行人、監護人、見證人或受益人當中任何一方為非中國公民，則必須使用其國際護照號碼及相關國家身份證號碼作為身份識別資料。",
        names: ["智承標準遺囑+", "智承進階遺囑+"],
        prices: ["CNY 889", "CNY 1,489"],
        summaries: ["簡單的遺囑計劃，涉及非中國公民，簡單的一次性資產分配。", "一個包括非中國公民在內的全面遺囑計劃，詳細的資產分配。"],
        best: ["不是中國公民或家庭，需要簡單的遺囑，直接的一次性分配和明確的受益人安排。", "不是中國個人或家庭需要更詳細的遺產規劃，有細節化的資產分配和更大的靈活性，以實現複雜的安排。"],
        buttonLabels: ["立即選擇方案", "立即選擇方案"],
        buttonLinks: ["https://app.mysmartwills.com/?item_id=9", "https://app.mysmartwills.com/?item_id=11"],
        features: [[], []],
        plus: true,
        package: false
    },
    packages: {
        title: "智承遺囑配套",
        intro: "選擇適合夫妻、長期靈活規劃，或更全面遺產安排需求的遺囑組合配套。",
        note: "選擇適合您的需求的配套，或與SmartWills團隊進行諮詢，以獲得個人化的指導。",
        names: ["智承伴侶遺囑", "智承終身無限遺囑", "智承專業綜合配套"],
        prices: ["CNY 1,480", "CNY 4,500", "CNY 4,500"],
        summaries: ["遺產規劃為兩個個體提供完整的遺囑解決方案，使家庭規劃更加清晰、有組織。", "提供兩種資產規劃方式，讓您更靈活地保護、安排與分配資產。", "遺產規劃解決方案，結合遺囑和遺囑信託，為更全面的家庭和資產保護。"],
        best: ["想一起編製兩份遺囑的夫妻，可選擇基礎或進階遺囑計劃。", "希望可自由修改遺囑的人士。", "需要結合遺囑信託、專業規劃師指導的完整遺產安排的人士。"],
        buttonLabels: ["立即購買", "立即購買", "立即購買"],
        buttonLinks: ["https://app.mysmartwills.com/event/?id=SMARTWILLSCOUPLE", "https://app.mysmartwills.com/event/?id=SWMYUNLIMITED", "https://app.mysmartwills.com/event/?id=SWMYPROPACKAGE"],
        features: [
        ["適用於夫妻", "2份遺囑計劃", "可選基礎或進階遺囑計劃", "包含列印服務", "一次付費"],
        ["終身無限次更新遺囑", "隨狀況變動修改遺囑", "不含列印", "適合長期規劃的高彈性方案"],
        ["1份結合遺囑信託的綜合遺囑", "包含列印服務", "認證規劃師提供服務"]
        ],
        plus: false,
        package: true
    }
    };

  function selectView(view, updateHash = false) {
    viewButtons.forEach((button) => {
      const selected = button.dataset.view === view;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    viewPanels.forEach((panel) => {
      panel.hidden = panel.dataset.viewPanel !== view;
    });
    if (viewSwitch) viewSwitch.dataset.active = view;
    if (viewToggle) viewToggle.setAttribute("aria-pressed", String(view === "services"));
    if (updateHash) history.replaceState(null, "", view === "services" ? "#smartgp" : "#plans");
  }

  function selectService(service, updateHash = true) {
    selectView("services");
    serviceButtons.forEach((button) => {
      const selected = button.dataset.service === service;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    servicePanels.forEach((panel) => {
      panel.hidden = panel.dataset.servicePanel !== service;
    });
    if (updateHash) history.replaceState(null, "", `#${service}`);
  }

  function selectNationality(nationality, updateHash = false) {
    const data = planData[nationality];
    if (!data) return;
    nationalityButtons.forEach((button) => {
      const selected = button.dataset.nationality === nationality;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    const title = document.querySelector("[data-plan-title]");
    const intro = document.querySelector("[data-plan-intro]");
    const note = document.querySelector("[data-plan-note]");
    if (title) title.textContent = data.title;
    if (intro) intro.textContent = data.intro;
    if (note) note.textContent = data.note;

    document.querySelectorAll("[data-plan-card]").forEach((card, index) => {
      const cardIsAvailable = index < data.names.length;
      card.hidden = !cardIsAvailable;
      if (!cardIsAvailable) {
        card.classList.remove("is-plus", "is-package");
        card.querySelector(".ps-package-features")?.replaceChildren();
        return;
      }
      card.classList.toggle("is-plus", data.plus);
      card.classList.toggle("is-package", data.package);
      const heading = card.querySelector("h3");
      const price = card.querySelector(".ps-price");
      const summary = card.querySelector(".ps-price-card__summary");
      const best = card.querySelector(".ps-best p");
      const button = card.querySelector(".ps-primary-button");
      const featureGrid = card.querySelector(".ps-feature-grid");
      const packageFeatures = card.querySelector(".ps-package-features");
      if (heading) heading.textContent = data.names[index];
      if (price) price.textContent = data.prices[index];
      if (summary) summary.textContent = data.summaries[index];
      if (best) best.textContent = data.best[index];
      if (featureGrid) featureGrid.hidden = data.package;
      if (packageFeatures) {
        packageFeatures.replaceChildren();
        (data.features[index] || []).forEach((feature) => {
          const item = document.createElement("li");
          item.textContent = feature;
          packageFeatures.append(item);
        });
        packageFeatures.hidden = !data.package;
      }
      if (button) {
        button.textContent = data.buttonLabels[index];
        button.href = data.buttonLinks[index];
        if (data.package) {
          button.target = "_blank";
          button.rel = "noopener noreferrer";
        } else {
          button.removeAttribute("target");
          button.removeAttribute("rel");
        }
      }
    });
    document.querySelector(".ps-pricing-shell")?.classList.toggle("is-packages", data.package);
    if (updateHash) history.replaceState(null, "", `#${nationality}`);
  }

  viewButtons.forEach((button) => button.addEventListener("click", () => selectView(button.dataset.view, true)));
  viewToggle?.addEventListener("click", () => {
    selectView(viewSwitch?.dataset.active === "services" ? "plans" : "services", true);
  });
  serviceButtons.forEach((button) => button.addEventListener("click", () => selectService(button.dataset.service)));
  nationalityButtons.forEach((button) => button.addEventListener("click", () => selectNationality(button.dataset.nationality, true)));

  document.querySelectorAll("[data-service-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      selectService(link.dataset.serviceLink);
      document.querySelector(".ps-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-plan-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      selectView("plans");
      selectNationality(link.dataset.planLink, true);
      document.querySelector(".ps-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".site-header__nav-dropdown").forEach((dropdown) => {
    let closeTimer;
    const openMenu = () => { window.clearTimeout(closeTimer); dropdown.open = true; };
    const closeMenu = () => {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        if (!dropdown.matches(":hover") && !dropdown.matches(":focus-within")) dropdown.open = false;
      }, 120);
    };
    dropdown.addEventListener("mouseenter", openMenu);
    dropdown.addEventListener("mouseleave", closeMenu);
    dropdown.addEventListener("focusin", openMenu);
    dropdown.addEventListener("focusout", closeMenu);
  });

  document.querySelectorAll(".site-header__mobile-menu > summary").forEach((summary) => {
    summary.addEventListener("click", (event) => {
      const details = summary.parentElement;
      if (details instanceof HTMLDetailsElement) {
        event.preventDefault();
        details.open = !details.open;
      }
    });
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealSections = Array.from(document.querySelectorAll("main > section, .site-footer"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealSections.forEach((section) => section.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, sectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealSections.forEach((section) => observer.observe(section));
  }

  function applyLocationTarget() {
    const target = location.hash.replace("#", "");
    if (servicePanels.some((panel) => panel.dataset.servicePanel === target)) {
      selectService(target, false);
      return;
    }

    selectView("plans");
    selectNationality(planData[target] ? target : "malaysian");
  }

  applyLocationTarget();
  window.requestAnimationFrame(applyLocationTarget);
  window.addEventListener("hashchange", applyLocationTarget);
})();
