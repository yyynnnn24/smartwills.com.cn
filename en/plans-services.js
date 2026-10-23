(() => {
  const isChinesePage = document.documentElement.lang.startsWith("zh");
  const viewSwitch = document.querySelector(".ps-view-switch");
  const viewToggle = document.querySelector("[data-view-toggle]");
  const viewButtons = Array.from(document.querySelectorAll("[data-view]"));
  const viewPanels = Array.from(document.querySelectorAll("[data-view-panel]"));
  const serviceButtons = Array.from(document.querySelectorAll("[data-service]"));
  const servicePanels = Array.from(document.querySelectorAll("[data-service-panel]"));
  const nationalityButtons = Array.from(document.querySelectorAll("[data-nationality]"));

  const planData = {
    malaysian: {
      title: "SmartWills Plan",
      intro: "Designed for Malaysian individuals who want a simple and structured way to prepare their Will, appoint beneficiaries, executors and guardians, and make their wishes clear for the future.",
      note: "The Will maker, Executor(s), Guardian(s), Witness(es) and Beneficiary(ies) are Malaysian.\n[Malaysia NRIC (i.e. ID number) must be used to identify the particulars of these individuals.]",
      names: ["SmartWills Basic", "SmartWills Advanced"],
      prices: ["RM 388", "RM 788"],
      summaries: ["A straightforward Will plan with lump-sum distribution for simple and clear estate planning.", "A more detailed Will plan with itemised asset distribution for greater control and flexibility."],
      best: ["A straightforward Will plan with lump-sum distribution for simple and clear estate planning.", "Individuals who want to list specific assets and have greater detail and control over their estate planning."],
      buttonLabels: ["Start Your Plan Now", "Start Your Plan Now"],
      buttonLinks: ["https://app.mysmartwills.com/?item_id=2", "https://app.mysmartwills.com/?item_id=4"],
      features: [[], []],
      plus: false,
      package: false
    },
    "non-malaysian": {
      title: "SmartWills Plus",
      intro: "Designed for cases involving non-Malaysian individuals, offering a more suitable Will-planning option when the Will maker or related parties include non-Malaysian citizens.",
      note: "If any among the Will maker, Executor(s), Guardian(s), Witness(es), or Beneficiary(ies) is a non-Malaysian citizen,\n[International Passport Numbers and relevant country ID Number must be used to identify the particulars of these individuals.]",
      names: ["SmartWills Basic+", "SmartWills Advanced+"],
      prices: ["RM 489", "RM 889"],
      summaries: ["A straightforward Will plan involving non-Malaysians, with simple lump-sum asset distribution.", "A comprehensive Will plan involving non-Malaysians, with detailed and itemised asset distribution."],
      best: ["Non-Malaysian individuals or families who need a simple Will with straightforward lump-sum distribution and clear beneficiary arrangements.", "Non-Malaysian individuals or families who need more detailed estate planning, with itemised asset distribution and greater flexibility for complex arrangements."],
      buttonLabels: ["Start Your Plan Now", "Start Your Plan Now"],
      buttonLinks: ["https://app.mysmartwills.com/?item_id=9", "https://app.mysmartwills.com/?item_id=11"],
      features: [[], []],
      plus: true,
      package: false
    },
    packages: {
      title: "SmartWills Packages",
      intro: "Choose a bundled Will-writing package designed for couples, long-term flexibility, or more comprehensive estate-planning needs.",
      note: "Select the package that fits your needs, or speak with the SmartWills team for personalised guidance.",
      names: ["Couple Wills", "Lifetime Unlimited Wills", "SmartWills Pro"],
      prices: ["RM 880", "RM 2,500", "RM 1,380"],
      summaries: isChinesePage
        ? ["遗产规划为两个个体提供完整的遗嘱解决方案,使家庭规划更加清晰,更有组织。", "通过遗嘱与遗嘱信托，为家庭与资产提供更全面的保障", "遗产规划解决方案,结合遗嘱和遗嘱信托,为更全面的家庭和资产保护。"]
        : ["A complete Will solution for two individuals, making family estate planning clearer and more organised.", "Flexible Will planning for two asset options, offering greater flexibility in protecting and arranging your assets.", "A complete estate planning solution combining a Will and testamentary trust for more comprehensive family and asset protection."],
      best: ["Couples who want to prepare two Wills together and choose either the Basic or Advanced Will plan.", "Individuals who want the freedom to revise their Will whenever their circumstances change.", "Individuals seeking a comprehensive Will with Testamentary Trust and SmartPlanner guidance."],
      buttonLabels: ["Buy Now", "Buy Now", "Buy Now"],
      buttonLinks: ["https://app.mysmartwills.com/event/?id=SMARTWILLSCOUPLE", "https://app.mysmartwills.com/event/?id=SWMYUNLIMITED", "https://app.mysmartwills.com/event/?id=SWMYPROPACKAGE"],
      features: [
        ["For couples", "2 × Will plans", "Choose Basic or Advanced Will Plan", "Printing included", "One-time payment"],
        ["Lifetime unlimited Will updates", "Revise your Will as circumstances change", "Printing excluded", "Premium long-term solution"],
        ["1 × Comprehensive Will with Testamentary Trust", "Printing included", "Served by a certified SmartPlanner"]
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
