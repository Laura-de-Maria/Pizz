(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  function initIsotopeContainers() {
    document.querySelectorAll('.isotope-container').forEach(function(container) {
      let layout = container.closest('.isotope-layout').getAttribute('data-layout') || 'masonry';
      let filter = container.closest('.isotope-layout').getAttribute('data-default-filter') || '.filter-antipasti';
      let sort = container.closest('.isotope-layout').getAttribute('data-sort') || 'original-order';
  
      imagesLoaded(container, function() {
        let isotopeInstance = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
  
        // Add filter listeners
        container.closest('.isotope-layout').querySelectorAll('.isotope-filters li').forEach(function(filterElement) {
          filterElement.addEventListener('click', function() {
            let filterValue = this.getAttribute('data-filter');
            updateActiveFilter(container.closest('.isotope-layout'), this);
            isotopeInstance.arrange({ filter: filterValue });
  
            // Force layout reflow
            setTimeout(function() {
              isotopeInstance.layout();
            }, 100);
  
            updateSectionHeaders(container, filterValue);
  
            // Reinitialize AOS if needed
            if (typeof AOS !== 'undefined') {
              AOS.refresh();
            }
          });
        });
  
        // Initial section headers update
        updateSectionHeaders(container, filter);
      });
    });
  }
  
 
  function updateActiveFilter(layout, selectedFilterElement) {
    let activeFilter = layout.querySelector('.isotope-filters .filter-active');
    if (activeFilter) {
      activeFilter.classList.remove('filter-active');
    }
    selectedFilterElement.classList.add('filter-active');
  }

  function updateSectionHeaders(container, filterValue) {
    container.closest('.isotope-layout').querySelectorAll('.menu-section').forEach(function(section) {
      const items = section.querySelectorAll('.isotope-item');
      const header = section.querySelector('h5');
      const shouldShowHeader = Array.from(items).some(item =>
        item.classList.contains(filterValue.replace('.', ''))
      );
      if (shouldShowHeader) {
        section.classList.remove('hidden');
        header.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
        header.classList.add('hidden');
      }
    });
  }

  window.addEventListener('load', initIsotopeContainers);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      let section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  function navmenuScrollspy() {
    document.querySelectorAll('.navmenu a').forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
