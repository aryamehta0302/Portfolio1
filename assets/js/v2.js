/**
 * Portfolio V2 — Interaction Engine
 * This module handles all custom interactive elements and visual effects.
 * It is loaded after main.js to ensure it doesn't block critical rendering or initializations.
 */

(function () {
  'use strict';

  // State flag for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * 1. Spotlight Cursor Effect
   * Follows the mouse position and updates a radial gradient background.
   */
  class SpotlightEffect {
    constructor() {
      if (prefersReducedMotion) return;

      this.spotlight = document.createElement('div');
      this.spotlight.className = 'v2-spotlight';
      document.body.appendChild(this.spotlight);

      this.mouseX = window.innerWidth / 2;
      this.mouseY = window.innerHeight / 2;
      this.currentX = this.mouseX;
      this.currentY = this.mouseY;
      
      this.isActive = false;
      this.isDesktop = window.innerWidth > 768;

      this.bindEvents();
      if (this.isDesktop) {
        this.animate();
      }
    }

    bindEvents() {
      // Track mouse movement
      window.addEventListener('mousemove', (e) => {
        if (!this.isDesktop) return;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        if (!this.isActive) {
          this.isActive = true;
          this.spotlight.classList.add('active');
        }
      }, { passive: true });

      // Handle window resize
      window.addEventListener('resize', () => {
        this.isDesktop = window.innerWidth > 768;
        if (!this.isDesktop && this.isActive) {
          this.isActive = false;
          this.spotlight.classList.remove('active');
        }
      }, { passive: true });
      
      // Hide when leaving window
      document.addEventListener('mouseleave', () => {
        this.isActive = false;
        this.spotlight.classList.remove('active');
      });
      
      document.addEventListener('mouseenter', () => {
        if (this.isDesktop) {
          this.isActive = true;
          this.spotlight.classList.add('active');
        }
      });
    }

    animate() {
      if (!this.isDesktop) {
        requestAnimationFrame(() => this.animate());
        return;
      }

      // Smooth interpolation
      this.currentX += (this.mouseX - this.currentX) * 0.15;
      this.currentY += (this.mouseY - this.currentY) * 0.15;

      this.spotlight.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
      
      requestAnimationFrame(() => this.animate());
    }
  }

  /**
   * 2. Reading Progress Bar
   * Updates a progress bar width based on scroll position.
   */
  class ProgressBar {
    constructor() {
      this.bar = document.createElement('div');
      this.bar.className = 'v2-reading-progress';
      document.body.appendChild(this.bar);

      this.update = this.update.bind(this);
      
      // Debounce scroll listener for performance
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.update();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
      
      window.addEventListener('resize', this.update, { passive: true });
      
      // Initial update
      this.update();
    }

    update() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollableHeight = documentHeight - windowHeight;
      if (scrollableHeight <= 0) {
        this.bar.style.width = '0%';
        return;
      }
      
      const progress = (scrollTop / scrollableHeight) * 100;
      this.bar.style.width = `${progress}%`;
    }
  }

  /**
   * 3. Section Reveal Animation (Intersection Observer)
   * Elements with class 'v2-reveal' animate in when scrolled into view.
   */
  class SectionReveal {
    constructor() {
      if (prefersReducedMotion) return;

      this.elements = document.querySelectorAll('.v2-reveal');
      if (!this.elements.length) return;

      this.observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve after animating in once
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before it enters the viewport
        threshold: 0.1
      });

      this.elements.forEach(el => this.observer.observe(el));
    }
  }

  /**
   * 4. Gooey Text Morph
   * Rotates an array of words with a smooth SVG filter morph effect.
   */
  class GooeyMorph {
    constructor(elementId, words, interval = 3000) {
      if (prefersReducedMotion) return;
      
      this.container = document.getElementById(elementId);
      if (!this.container) return;

      this.words = words;
      this.interval = interval;
      this.currentIndex = 0;
      
      // Setup container
      this.container.classList.add('v2-gooey-container');
      this.textElement = document.createElement('span');
      this.textElement.className = 'v2-gooey-text v2-gooey-text--entering';
      this.textElement.textContent = this.words[0];
      this.container.appendChild(this.textElement);

      this.start();
    }

    start() {
      setInterval(() => {
        // Exit current
        this.textElement.className = 'v2-gooey-text v2-gooey-text--exiting';
        
        setTimeout(() => {
          // Increment index
          this.currentIndex = (this.currentIndex + 1) % this.words.length;
          this.textElement.textContent = this.words[this.currentIndex];
          
          // Enter new
          this.textElement.className = 'v2-gooey-text v2-gooey-text--entering';
        }, 400); // Wait for exit animation to finish
        
      }, this.interval);
    }
  }

  /**
   * 5. Read More Toggle (for Recommendation Cards)
   */
  class ReadMoreToggle {
    constructor() {
      this.toggles = document.querySelectorAll('.v2-rec-card__toggle');
      if (!this.toggles.length) return;

      this.toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          const targetId = toggle.getAttribute('aria-controls');
          const content = document.getElementById(targetId);
          if (!content) return;

          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          
          if (isExpanded) {
            content.classList.add('v2-rec-card__text--collapsed');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.textContent = 'Read More';
          } else {
            content.classList.remove('v2-rec-card__text--collapsed');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.textContent = 'Read Less';
          }
        });
      });
    }
  }

  /**
   * 6. Terminal Typewriter Animation
   */
  class TerminalAnimation {
    constructor(elementId, speed = 30) {
      if (prefersReducedMotion) return;
      
      this.container = document.getElementById(elementId);
      if (!this.container) return;
      
      // We assume the terminal lines are initially hidden (opacity: 0) or wrapped
      // For this simple implementation, we'll just reveal child elements sequentially
      this.lines = Array.from(this.container.querySelectorAll('.v2-terminal__line'));
      if (!this.lines.length) return;
      
      this.lines.forEach(line => line.style.display = 'none');
      
      this.currentIndex = 0;
      
      // Start observation to trigger animation when visible
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.typeNextLine();
          this.observer.disconnect();
        }
      }, { threshold: 0.5 });
      
      this.observer.observe(this.container);
    }
    
    typeNextLine() {
      if (this.currentIndex >= this.lines.length) return;
      
      const line = this.lines[this.currentIndex];
      line.style.display = 'block';
      
      // Calculate delay based on line length (simulate reading/typing time)
      const textContent = line.textContent.trim();
      const delay = textContent.startsWith('>') ? 800 : textContent.length * 15;
      
      this.currentIndex++;
      
      setTimeout(() => {
        this.typeNextLine();
      }, delay);
    }
  }

  /**
   * 7. Auto TOC Generator & Scrollspy
   */
  class AutoTOC {
    constructor(contentSelector, tocContainerId) {
      this.content = document.querySelector(contentSelector);
      this.tocContainer = document.getElementById(tocContainerId);
      if (!this.content || !this.tocContainer) return;

      this.headings = Array.from(this.content.querySelectorAll('h2, h3'));
      if (this.headings.length === 0) return;

      this.buildTOC();
      this.initScrollspy();
    }

    buildTOC() {
      this.headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = 'heading-' + index;
        }
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.className = heading.tagName.toLowerCase() === 'h3' ? 'toc-h3' : 'toc-h2';
        
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(heading.id);
          const y = target.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({top: y, behavior: 'smooth'});
        });
        
        this.tocContainer.appendChild(link);
      });
    }

    initScrollspy() {
      this.links = Array.from(this.tocContainer.querySelectorAll('a'));
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.links.forEach(l => l.classList.remove('active'));
            const activeLink = this.links.find(l => l.getAttribute('href') === '#' + entry.target.id);
            if (activeLink) activeLink.classList.add('active');
          }
        });
      }, { rootMargin: '-100px 0px -60% 0px' });

      this.headings.forEach(h => observer.observe(h));
    }
  }

  /**
   * 8. Copy Code Logic
   */
  class CopyCode {
    constructor() {
      const codeBlocks = document.querySelectorAll('.v2-code-block');
      codeBlocks.forEach(block => {
        const copyBtn = block.querySelector('.v2-terminal__copy');
        const codeContent = block.querySelector('code');
        if (copyBtn && codeContent) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(codeContent.innerText).then(() => {
              const originalText = copyBtn.innerHTML;
              copyBtn.innerHTML = '<i class="bi bi-check2"></i> Copied';
              copyBtn.classList.add('copied');
              setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copied');
              }, 2000);
            });
          });
        }
      });
    }
  }

  // Initialize all modules when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Expose classes to global scope if needed by specific pages
    window.V2 = {
      SpotlightEffect,
      ProgressBar,
      SectionReveal,
      GooeyMorph,
      ReadMoreToggle,
      TerminalAnimation,
      AutoTOC,
      CopyCode
    };

    // Auto-init global components
    new SpotlightEffect();
    new ProgressBar();
    new SectionReveal();
    new ReadMoreToggle();
  });

})();


/* Recommendations JS */
document.addEventListener('DOMContentLoaded', () => {
      const yearSpan = document.querySelector('.copyright span:first-child');
      if (yearSpan) yearSpan.innerHTML = `Copyright &copy; ${new Date().getFullYear()}`;
      
      // Read More functionality
      document.querySelectorAll('.v2-read-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const container = this.previousElementSibling;
          if (container.classList.contains('v2-recommendation-card__quote-collapsed')) {
            container.classList.remove('v2-recommendation-card__quote-collapsed');
            this.innerHTML = 'Read Less <i class="bi bi-chevron-up"></i>';
          } else {
            container.classList.add('v2-recommendation-card__quote-collapsed');
            this.innerHTML = 'Read More <i class="bi bi-chevron-down"></i>';
          }
          
          // Trigger masonry relayout if it exists
          if (typeof Masonry !== 'undefined') {
            const msnryGrid = document.querySelector('[data-masonry]');
            if (msnryGrid) {
              const msnry = Masonry.data(msnryGrid);
              if (msnry) setTimeout(() => msnry.layout(), 300); // Wait for transition
            }
          }
        });
      });
    });
