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
      title: "SmartWills Plan",
      intro: "专为希望以简单、有系统的方式准备遗嘱的中国公民而设，让您清楚指定受益人、遗嘱执行人及监护人，并为未来明确表达自己的意愿。",
      note: "立遗嘱人、遗嘱执行人、监护人、见证人及受益人皆须为中国公民，并必须使用中国身份证号码作为相关人士的身份识别资料。",
      names: ["SmartWills Basic", "SmartWills Advanced"],
      prices: ["RM 388", "RM 788"],
      summaries: ["一个简单的遗产遗产计划,以单次分配,以便简单而清晰的遗产规划。", "一个更详细的遗嘱计划,以更大的控制和灵活性来详细分配资产。"],
      best: ["一个简单的遗产遗产计划,以单次分配,以便简单而清晰的遗产规划。", "个人希望列出特定资产,并且对遗产规划有更大的细节和控制。"],
      buttonLabels: ["立即选择方案", "立即选择方案"],
      buttonLinks: ["https://app.mysmartwills.com/?item_id=2", "https://app.mysmartwills.com/?item_id=4"],
      features: [[], []],
      plus: false,
      package: false
    },
    "non-chinese": {
      title: "SmartWills Plus",
      intro: "专为涉及非中国公民的情况而设。当立遗嘱人或相关人士中包含非中国公民时，此方案可提供更合适的遗嘱规划选择。",
      note: "若立遗嘱人、遗嘱执行人、监护人、见证人或受益人当中任何一方为非中国公民，则必须使用其国际护照号码及相关国家身份证号码作为身份识别资料。",
      names: ["SmartWills Basic+", "SmartWills Advanced+"],
      prices: ["RM 489", "RM 889"],
      summaries: ["简单的遗嘱计划,涉及非中国公民,简单的一次性资产分配。", "一个包括非中国公民在内的全面遗嘱计划,详细和详细的资产分配。"],
      best: ["不是中国公民或家庭,需要简单的遗嘱,直接的一次性分配和明确的受益人安排。", "不是中国个人或家庭需要更详细的遗产规划,有细节化的资产分配和更大的灵活性,以实现复杂的安排。"],
      buttonLabels: ["立即选择方案", "立即选择方案"],
      buttonLinks: ["https://app.mysmartwills.com/?item_id=9", "https://app.mysmartwills.com/?item_id=11"],
      features: [[], []],
      plus: true,
      package: false
    },
    packages: {
      title: "SmartWills Packages",
      intro: "选择适合夫妻、长期灵活规划，或更全面遗产安排需求的遗嘱组合配套。",
      note: "选择适合您的需求的配套,或与SmartWills团队进行咨询,以获得个性化的指导。",
      names: ["Couple Wills", "Lifetime Unlimited Wills", "SmartWills Pro (Comprehensive Plan)"],
      prices: ["RM 880", "RM 2,500", "RM 1,380"],
      summaries: ["遗产规划为两个个体提供完整的遗嘱解决方案,使家庭规划更加清晰,更有组织。", "提供两种资产规划方式，让您更灵活地保护、安排与分配资产。", "遗产规划解决方案,结合遗嘱和遗嘱信托,为更全面的家庭和资产保护。"],
      best: ["想一起编制两个遗嘱的夫妻,选择基本或高级遗嘱计划。", "人们希望自由修改自己的遗嘱,", "个人寻求具有遗嘱信托和智能规划器指导的综合遗嘱。"],
      buttonLabels: ["立即购买", "立即购买", "立即购买"],
      buttonLinks: ["https://app.mysmartwills.com/event/?id=SMARTWILLSCOUPLE", "https://app.mysmartwills.com/event/?id=SWMYUNLIMITED", "https://app.mysmartwills.com/event/?id=SWMYPROPACKAGE"],
      features: [
        ["适用于夫妻", "2份遗嘱计划", "选择基本或高级遗嘱计划", "印刷包括", "一次支付"],
        ["遗嘱更新终身无限", "随着情况的变化,修改你的遗嘱", "印刷除外", "优质的长期解决方案"],
        ["1份遗嘱信托的综合遗嘱", "包括印刷服务", "经过认证的智能规划器提供服务"]
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
