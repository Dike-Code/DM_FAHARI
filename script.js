/* =========================================================
   FAHARI STAFFING — script.js
   Theme toggle, mobile menu, scroll header, scroll reveal,
   contact tabs, field validation gating, year stamp.
   ========================================================= */

(() => {
	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

	/* ---------- Year stamp ---------- */
	const yearEl = $("#year");
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	/* ---------- Theme toggle ---------- */
	const root = document.documentElement;
	const themeToggle = $("#themeToggle");
	const prefersDark =
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;
	const initial = prefersDark ? "dark" : "light";
	root.setAttribute("data-theme", initial);

	if (themeToggle) {
		themeToggle.addEventListener("click", () => {
			const next =
				root.getAttribute("data-theme") === "dark" ? "light" : "dark";
			root.setAttribute("data-theme", next);
		});
	}

	/* ---------- Header scroll state ---------- */
	const header = $("#site-header");
	const hero = $(".hero");

	const updateHeader = () => {
		if (!header) return;
		const y = window.scrollY;
		header.classList.toggle("is-scrolled", y > 12);

		if (hero) {
			const heroBottom = hero.offsetTop + hero.offsetHeight - 80;
			header.classList.toggle("on-hero", y < heroBottom);
		}
	};
	updateHeader();
	window.addEventListener("scroll", updateHeader, { passive: true });
	window.addEventListener("resize", updateHeader);

	/* ---------- Mobile menu ---------- */
	const hamburger = document.getElementById("hamburger");
	const mobileMenu = document.getElementById("mobileMenu");
	if (hamburger && mobileMenu) {
		hamburger.addEventListener("click", function () {
			var open = mobileMenu.getAttribute("data-open") === "true";
			if (open) {
				mobileMenu.removeAttribute("data-open");
				hamburger.setAttribute("aria-expanded", "false");
			} else {
				mobileMenu.setAttribute("data-open", "true");
				hamburger.setAttribute("aria-expanded", "true");
			}
		});
		mobileMenu.querySelectorAll("a").forEach(function (a) {
			a.addEventListener("click", function () {
				mobileMenu.removeAttribute("data-open");
				hamburger.setAttribute("aria-expanded", "false");
			});
		});
		window.addEventListener("resize", function () {
			if (window.innerWidth >= 980) {
				mobileMenu.removeAttribute("data-open");
				hamburger.setAttribute("aria-expanded", "false");
			}
		});
	}

	/* ---------- Scroll reveal ---------- */
	const reveals = $$("[data-reveal]");
	if ("IntersectionObserver" in window && reveals.length) {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.05, rootMargin: "0px 0px -10% 0px" },
		);
		reveals.forEach((el) => io.observe(el));
	} else {
		reveals.forEach((el) => el.classList.add("is-visible"));
	}

	/* ---------- Contact tabs ---------- */
	const tabs = $$(".tab");
	const panels = $$(".contact-form");
	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			const target = tab.dataset.tab;
			tabs.forEach((t) => {
				const active = t === tab;
				t.classList.toggle("is-active", active);
				t.setAttribute("aria-selected", active ? "true" : "false");
			});
			panels.forEach((p) => {
				p.classList.toggle("is-active", p.dataset.panel === target);
			});
		});
	});

	/* ---------- Smooth in-page nav offset for sticky header ---------- */
	$$('a[href^="#"]').forEach((link) => {
		link.addEventListener("click", (e) => {
			const id = link.getAttribute("href");
			if (id.length < 2) return;
			const target = document.querySelector(id);
			if (!target) return;
			e.preventDefault();
			const headerH = header ? header.offsetHeight : 0;
			const top =
				target.getBoundingClientRect().top +
				window.scrollY -
				headerH +
				1;
			window.scrollTo({ top, behavior: "smooth" });
		});
	});
})();

// ============== FORM VALIDATION BUTTON GATING ==============
(() => {
	// 1. Handle Ebook Form
	const ebookForm = document.getElementById("ebookForm");
	const ebookBtn = document.getElementById("ebookSubmit");

	if (ebookForm && ebookBtn) {
		const checkEbook = () => {
			ebookBtn.disabled = !ebookForm.checkValidity();
		};
		ebookForm.addEventListener("input", checkEbook);
		ebookForm.addEventListener("change", checkEbook);
		checkEbook(); // Run initial check
	}

	// 2. Handle Contact & Application Forms Safely
	const contactForms = [
		{ formId: "form-request", btnId: "reqSubmit" },
		{ formId: "form-apply", btnId: "applySubmit" },
	];

	contactForms.forEach(({ formId, btnId }) => {
		const form = document.getElementById(formId);
		const btn = document.getElementById(btnId);
		if (!form || !btn) return;

		const checkForm = () => {
			btn.disabled = !form.checkValidity();
		};
		form.addEventListener("input", checkForm);
		form.addEventListener("change", checkForm);
		checkForm(); // Run initial check
	});
})();
