(() => {
  "use strict";

  /* ============================================================
   * 1. FadeIn reveal-on-scroll (replaces Framer Motion FadeIn)
   * ========================================================== */
  function initFadeIns() {
    const els = document.querySelectorAll(".fade-in");
    els.forEach((el) => {
      const x = el.dataset.x ? `${el.dataset.x}px` : "0px";
      const y = el.dataset.y ? `${el.dataset.y}px` : "40px";
      const delay = el.dataset.delay || "0";
      const duration = el.dataset.duration || "0.8";
      el.style.setProperty("--fx", x);
      el.style.setProperty("--fy", y);
      el.style.setProperty("--fdelay", `${delay}s`);
      el.style.transitionDuration = `${duration}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ============================================================
   * 2. Magnet effect on hero portrait
   * ========================================================== */
  function initMagnet() {
    const el = document.getElementById("magnet");
    if (!el) return;
    const padding = 150;
    const strength = 3;
    const activeTransition = "transform 0.3s ease-out";
    const inactiveTransition = "transform 0.6s ease-in-out";

    window.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const within =
        Math.abs(dx) < rect.width / 2 + padding &&
        Math.abs(dy) < rect.height / 2 + padding;

      if (within) {
        el.style.transition = activeTransition;
        el.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`;
      } else {
        el.style.transition = inactiveTransition;
        el.style.transform = "translate3d(0px, 0px, 0)";
      }
    });
  }

  /* ============================================================
   * 3. AnimatedText — per-character scroll reveal
   * ========================================================== */
  function initAnimatedText() {
    const nodes = document.querySelectorAll(".animated-text");
    const instances = [];

    nodes.forEach((node) => {
      const text = node.dataset.text || "";
      node.textContent = "";
      const chars = [];
      [...text].forEach((c) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = c === " " ? "\u00A0" : c;
        node.appendChild(span);
        chars.push(span);
      });
      instances.push({ node, chars });
    });

    if (!instances.length) return;

    function update() {
      const vh = window.innerHeight;
      instances.forEach(({ node, chars }) => {
        const rect = node.getBoundingClientRect();
        // Mirrors the original range: ["start 0.8", "end 0.2"] of viewport
        const start = rect.top - vh * 0.8;
        const end = rect.bottom - vh * 0.2;
        const total = end - start || 1;
        const progress = Math.min(1, Math.max(0, (0 - start) / total));

        const n = chars.length;
        chars.forEach((span, i) => {
          const cStart = i / n;
          const cEnd = cStart + 1 / n;
          let localProgress = (progress - cStart) / (cEnd - cStart || 1);
          localProgress = Math.min(1, Math.max(0, localProgress));
          span.style.opacity = String(0.2 + localProgress * 0.8);
        });
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ============================================================
   * 4. Marquee hero-preview strip with scroll parallax
   * ========================================================== */
  const MARQUEE_IMAGES = [
    "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
    "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
    "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
    "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
    "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
    "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
    "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
    "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
    "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
    "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
    "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
    "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
    "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
    "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
    "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
    "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
    "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
    "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
    "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
  ];

  function buildMarqueeRow(containerId, images) {
    const row = document.getElementById(containerId);
    if (!row) return;
    const tripled = [...images, ...images, ...images];
    tripled.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      row.appendChild(img);
    });
  }

  function initMarquee() {
    const row1Images = MARQUEE_IMAGES.slice(0, 11);
    const row2Images = MARQUEE_IMAGES.slice(11);
    buildMarqueeRow("marquee-row-1", row1Images);
    buildMarqueeRow("marquee-row-2", row2Images);

    const section = document.getElementById("marquee-section");
    const row1 = document.getElementById("marquee-row-1");
    const row2 = document.getElementById("marquee-row-2");
    if (!section || !row1 || !row2) return;

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const value = (window.scrollY - top + window.innerHeight) * 0.3;
      const x1 = value - 200;
      const x2 = -(value - 200);
      row1.style.transform = `translateX(${x1}px)`;
      row2.style.transform = `translateX(${x2}px)`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ============================================================
   * 5. Skills marquee rows (icon pills)
   * ========================================================== */
  const ROW1 = [
    { slug: "html5", name: "HTML5", color: "E34F26" },
    { slug: "css3", name: "CSS3", color: "1572B6" },
    { slug: "javascript", name: "JavaScript", color: "F7DF1E" },
    { slug: "typescript", name: "TypeScript", color: "3178C6" },
    { slug: "openjdk", name: "Java", color: "F89820" },
    { slug: "c", name: "C", color: "A8B9CC" },
    { slug: "cplusplus", name: "C++", color: "00599C" },
    { slug: "python", name: "Python", color: "3776AB" },
    { slug: "mysql", name: "SQL", color: "4479A1" },
    { slug: "php", name: "PHP", color: "777BB4" },
    { slug: "gnubash", name: "Bash", color: "4EAA25" },
    { slug: "json", name: "JSON", color: "FFFFFF" },
    { slug: "xml", name: "XML", color: "FF6600" },
    { slug: "markdown", name: "Markdown", color: "FFFFFF" },
    { slug: "nodedotjs", name: "Node.js", color: "339933" },
  ];

  const ROW2 = [
    { slug: "react", name: "React", color: "61DAFB" },
    { slug: "tailwindcss", name: "Tailwind", color: "06B6D4" },
    { slug: "framer", name: "Framer Motion", color: "0055FF" },
    { slug: "vite", name: "Vite", color: "646CFF" },
    { slug: "git", name: "Git", color: "F05032" },
    { slug: "github", name: "GitHub", color: "FFFFFF" },
    { slug: "figma", name: "Figma", color: "F24E1E" },
    { slug: "firebase", name: "Firebase", color: "FFCA28" },
    { slug: "mongodb", name: "MongoDB", color: "47A248" },
    { slug: "express", name: "Express", color: "FFFFFF" },
    { slug: "postman", name: "Postman", color: "FF6C37" },
    { slug: "npm", name: "npm", color: "CB3837" },
    { slug: "linux", name: "Linux", color: "FCC624" },
    { slug: "redux", name: "Redux", color: "764ABC" },
  ];

  const ROW3 = [
    { slug: "nextdotjs", name: "Next.js", color: "FFFFFF" },
    { slug: "bootstrap", name: "Bootstrap", color: "7952B3" },
    { slug: "jquery", name: "jQuery", color: "0769AD" },
    { slug: "gitlab", name: "GitLab", color: "FC6D26" },
    { slug: "docker", name: "Docker", color: "2496ED" },
    { slug: "netlify", name: "Netlify", color: "00C7B7" },
    { slug: "vercel", name: "Vercel", color: "FFFFFF" },
  ];

  function buildSkillRow(containerId, skills) {
    const row = document.getElementById(containerId);
    if (!row) return;
    const doubled = [...skills, ...skills];
    doubled.forEach((skill) => {
      const pill = document.createElement("div");
      pill.className = "skill-pill";

      const img = document.createElement("img");
      img.src = `https://cdn.simpleicons.org/${skill.slug}/${skill.color}`;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = () => {
        img.remove();
      };

      const span = document.createElement("span");
      span.textContent = skill.name;

      pill.appendChild(img);
      pill.appendChild(span);
      row.appendChild(pill);
    });
  }

  function initSkills() {
    buildSkillRow("skill-row-1", ROW1);
    buildSkillRow("skill-row-2", ROW2);
    buildSkillRow("skill-row-3", ROW3);
  }

  /* ============================================================
   * 6. Services list
   * ========================================================== */
  const SERVICES = [
    {
      n: "01",
      name: "Software Development",
      desc: "Building reliable, well-structured software solutions tailored to real-world problems, with a focus on clean code and maintainability.",
    },
    {
      n: "02",
      name: "Web Development",
      desc: "Designing and developing modern, responsive websites and web applications using current frameworks and best practices.",
    },
    {
      n: "03",
      name: "Desktop Application Development",
      desc: "Creating efficient cross-platform desktop applications with intuitive interfaces and solid performance.",
    },
    {
      n: "04",
      name: "Database Design & Management",
      desc: "Designing, structuring, and managing databases to ensure data integrity, scalability, and efficient querying.",
    },
    {
      n: "05",
      name: "Technical Problem Solving",
      desc: "Analyzing complex technical challenges and delivering clear, efficient, and well-thought-out solutions.",
    },
  ];

  function initServices() {
    const list = document.getElementById("services-list");
    if (!list) return;

    SERVICES.forEach((s, i) => {
      const wrap = document.createElement("div");
      wrap.className = "fade-in";
      wrap.dataset.delay = String(i * 0.1);
      wrap.dataset.y = "30";

      const item = document.createElement("div");
      item.className = "service-item";
      item.innerHTML = `
        <div class="service-item__number">${s.n}</div>
        <div class="service-item__body">
          <div class="service-item__name">${s.name}</div>
          <p class="service-item__desc">${s.desc}</p>
        </div>
      `;

      wrap.appendChild(item);
      list.appendChild(wrap);
    });
  }

  /* ============================================================
   * 7. Projects list with sticky scale-on-scroll
   * ========================================================== */
  const PROJECTS = [
    {
      n: "01",
      category: "Web",
      name: "Facial-Recognition web Application",
      image: "assets/face2.jpg",
      link: "https://github.com/istiakalam-efty/Facial-Recognition",
    },
    {
      n: "02",
      category: "Web",
      name: "University Transport App",
      image: "assets/images.jpg",
      link: "https://github.com/istiakalam-efty/TRANSPORTAPP",
    },
    {
      n: "03",
      category: "Web",
      name: "Online Calculator",
      image: "assets/game.png",
      link: "https://github.com/istiakalam-efty/Calculator",
    },
    {
      n: "04",
      category: "Web",
      name: "Responsive Website Experience",
      image: "assets/cp.png",
      link: "https://github.com/istiakalam-efty/CraftOra-Website",
    },
    {
      n: "05",
      category: "Web",
      name: "Responsive Portfolio Experience",
      image: "assets/website image.jpg",
      link: "https://github.com/istiakalam-efty/CraftOra-Website",
    },
  ];

  function initProjects() {
    const list = document.getElementById("projects-list");
    if (!list) return;

    const total = PROJECTS.length;
    const cards = [];

    PROJECTS.forEach((project, index) => {
      const slot = document.createElement("div");
      slot.className = "project-slot";

      const card = document.createElement("div");
      card.className = "project-card";
      card.style.top = `${index * 28 + 96}px`;

      card.innerHTML = `
        <div class="project-card__header">
          <div class="project-card__header-left">
            <div class="project-card__number">${project.n}</div>
            <div class="project-card__meta">
              <span class="project-card__category">${project.category}</span>
              <span class="project-card__name">${project.name}</span>
            </div>
          </div>
          <a class="live-btn" href="${project.link}" target="_blank" rel="noopener noreferrer">Live Project</a>
        </div>
        <div class="project-card__images">
          <div class="project-card__images-left">
            <img src="${project.image}" alt="${project.name}" loading="lazy" />
            <img src="${project.image}" alt="${project.name}" loading="lazy" />
          </div>
          <div class="project-card__main">
            <img src="${project.image}" alt="${project.name}" loading="lazy" />
          </div>
        </div>
      `;

      slot.appendChild(card);
      list.appendChild(slot);
      cards.push({ card, index });
    });

    function onScroll() {
      const rect = list.getBoundingClientRect();
      const listTop = rect.top + window.scrollY;
      const listHeight = list.offsetHeight;
      const scrollPos = window.scrollY;

      // progress across the whole projects list, 0 at start, 1 at end
      const progress = Math.min(
        1,
        Math.max(0, (scrollPos - listTop) / (listHeight - window.innerHeight || 1))
      );

      cards.forEach(({ card, index }) => {
        const targetScale = 1 - (total - 1 - index) * 0.03;
        const rangeStart = index / total;
        const rangeEnd = 1;
        let local = (progress - rangeStart) / (rangeEnd - rangeStart || 1);
        local = Math.min(1, Math.max(0, local));
        const scale = 1 + (targetScale - 1) * local;
        card.style.transform = `scale(${scale})`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ============================================================
   * Init
   * ========================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initMarquee();
    initSkills();
    initServices();
    initProjects();
    initFadeIns();
    initAnimatedText();
    initMagnet();
  });
})();
