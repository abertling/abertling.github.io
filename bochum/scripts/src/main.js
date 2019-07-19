(function() {

    /* detect js */
    document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className.replace('no-js', 'js');
  
    /* detect touch */
    if (("ontouchstart" in document.documentElement)) {
      document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className.replace('no-touch', 'touch');
    }

    var body = document.getElementsByTagName('body')[0];

    var lazyLoadInstance = new LazyLoad({
      elements_selector: ".lazy"
    });

    /* add search overlay */
    var searchOverlay = function() {
      var headerSearchInput = document.querySelectorAll('.header__search .form--search .field--search input')[0];
      var headerSearchClose = document.querySelectorAll('.header__search .search__close')[0];
      if (headerSearchInput) {
        headerSearchInput.addEventListener('focus',function(e) {
          body.classList.add('open-search');
        }, true);
      }
      if (headerSearchClose) {
        headerSearchClose.addEventListener('click',function(e) {
          body.classList.remove('open-search');
        });
      }
    }();

    /* toggle search hints */
    var searchHints = function() {
      var searchForms = document.querySelectorAll('.form--search');
      for (var i = 0; i < searchForms.length; i++) {
        var searchForm = searchForms[i];
        var searchInput = searchForm.querySelectorAll('.field--search input')[0];
        if (searchInput) {
          searchInput.addEventListener('input', function() {
            if (this.value !== '') {
              this.parentElement.parentElement.classList.add('active');
            } else {
              this.parentElement.parentElement.classList.remove('active');
            }
          }, false);
        }
        if (searchForm) {
          searchForm.addEventListener('blur',function(e) {
            this.classList.remove('active');
          }, true);
        }
      }
    }();

    function saveData(blob, fileName) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
    
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    /* toggle image download */
    var photoDownload = function() {
      var photoDownloads = document.querySelectorAll('.image__download');
      for (var i = 0; i < photoDownloads.length; i++) {
        var photoDownload = photoDownloads[i];
        photoDownload.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var fileLink = this.getAttribute('data-file');
          var fileName = this.getAttribute('data-name');
          if (fileLink) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", fileLink);
            xhr.responseType = "blob";
            xhr.onload = function () {
              if (fileName) {
                saveData(this.response, fileName);
              } else {
                saveData(this.response, 'file');
              }
            };
            xhr.send();
          }
        });
      }
    }();

    /* toggle ermergency message */
    var emergencyMessage = function() {
      var emergencyMessages = document.querySelectorAll('.emergency');
      
      for (var i = 0; i < emergencyMessages.length; i++) {
        var emergencyMessage = emergencyMessages[i];
        var emergencyClose = emergencyMessage.querySelectorAll('.emergency__close')[0];
        if (emergencyMessage) {
          setTimeout(function(){ 
            emergencyMessage.classList.add('active');
            body.classList.add('open-emergency');
          }, 2000);
        }
        if (emergencyClose) {
          emergencyClose.addEventListener('click', function() {
            this.parentElement.classList.remove('active');
            body.classList.remove('open-emergency');
          });
        }
      }
      var headerSearchInput = document.querySelectorAll('.header__search .form--search .field--search input')[0];
      if (headerSearchInput) {
        headerSearchInput.addEventListener('focus',function(e) {
          emergencyMessage.classList.remove('active');
          body.classList.remove('open-emergency');
        }, true);
      }
    }();

    /* add language select */
    var languageSelect = function() {
      var languageForms = document.getElementsByClassName('form--translate');
      for (var i = 0; i < languageForms.length; i++) {
        var languageForm = languageForms[i];
        var languageFormSelect = languageForm.querySelectorAll('.field--translate select')[0];
        if (languageFormSelect) {
          languageFormSelect.addEventListener('change', function() {
            changeLanguage(this.parentElement.parentElement);
            this.value = 'de';
          }, false);
        }
      }
      function changeLanguage(form) {
        var url = form.querySelectorAll('.field--translate .translateUrl')[0];
        var language = form.querySelectorAll('.field--translate .translateToLanguage')[0];
        var select = form.querySelectorAll('.field--translate select')[0];
        // form.querySelectorAll('.field--translate .translateLangcode')[0].innerHTML = select.value;
        language.value = select.value;
        url.value = window.location.href;
        if (select.value !== 'de') {
          form.submit();
        }
        return false;
      }
    }();

    /* add lightboxes */
    var addLightboxes = function() {
      var imageLightboxes = GLightbox({
        selector: 'image__lightbox'
      });
      var slideshowLightboxes = GLightbox({
        selector: 'slideshow__lightbox'
      });
      var iframeLightboxes = GLightbox({
        selector: 'iframeviewer__lightbox'
      });
    }();

    /* add custom scrollbar */
    var addCustomScrollbar = function() {
      var navigation = document.getElementsByClassName('navigation')[0];
      var mainContainer = document.getElementsByClassName('container')[0];
      var abcNavigations = document.querySelectorAll('.abcnavigation .abcnavigation__wrapper');
      var tablesWrapper = document.querySelectorAll('.table .table__wrapper');
      if (abcNavigations.length) {
        for (var i = 0; i < abcNavigations.length; i++) {
          new OverlayScrollbars(abcNavigations[i], { });
        }
      }
      if (tablesWrapper.length) {
        for (var i = 0; i < tablesWrapper.length; i++) {
          var tableScrollbar = new OverlayScrollbars(tablesWrapper[i], { });
          tablesWrapper[i].parentElement.classList.remove('table--scrolled');
          tableScrollbar.getElements().viewport.addEventListener('scroll', function() {
            this.parentElement.parentElement.parentElement.style.width = this.clientWidth + 'px';
            if (this.scrollLeft > 0) {
              this.parentElement.parentElement.parentElement.classList.add('table--scrolled');
            } else {
              this.parentElement.parentElement.parentElement.classList.remove('table--scrolled');
            }
          });
        }
        window.addEventListener('resize', function() {
          for (var i = 0; i < tablesWrapper.length; i++) {
            tablesWrapper[i].parentElement.style.width = '';
          }
        });
      }
      if (navigation) {
        new OverlayScrollbars(navigation, {});
      }
      if (mainContainer) {
        var mainContaineScrollbar = new OverlayScrollbars(mainContainer, {});
        var lastScrollTop = 0;
        mainContaineScrollbar.getElements().viewport.addEventListener('scroll', function() {
          /* detect scroll */
          if (this.scrollTop > 0) {
            body.classList.add('scrolled');
          } else {
            body.classList.remove('scrolled');
          }

          /* detect scroll up */
          var st = this.scrollTop;
          if (st > lastScrollTop || st === 0) {
            body.classList.remove('scrolled--up');
          } else {
            body.classList.add('scrolled--up');
          }
          lastScrollTop = st;
        });
      }
    }();

    /* toggle menu overlay */
    var toggleMenu = function() {
      var navigationOpener = document.querySelectorAll('.header__hamburger')[0];
      var navigationCloser = document.querySelectorAll('.navigation__close')[0];
  
      if (navigationOpener) {
        navigationOpener.addEventListener('click', function(e) {
          e.preventDefault();
          body.classList.add('open-navigation');
          navigationOpener.classList.add('active');
        });
      }
      if (navigationCloser) {
        navigationCloser.addEventListener('click', function(e) {
          e.preventDefault();
          navigationOpener.classList.remove('active');
          body.classList.remove('open-navigation');
        });
      }
    }();

    function setAccordion(status) {
      var accordion = document.getElementsByClassName('accordion__item');
      for (var i = 0; i < accordion.length; i++) {
        accordion[i].classList.remove('open');
        accordion[i].classList.add('closed');
        accordionToggle = accordion[i].querySelectorAll('.accordion__toggle')[0];
        if (status) {
          accordionToggle.nextElementSibling.style.maxHeight = 0;
          toggleAccordion(accordionToggle);
        } else {
          accordionToggle.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
            this.parentElement.classList.toggle('closed');
            toggleAccordion(this);
          });
        }
      }
      function toggleAccordion(that) {
        var panel = that.nextElementSibling;
        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        } 
      }
    };
    setAccordion();

    /* add swiper slideshow */
    var swiperSlideshows = function() {
      var slideshowsWithTeaser = document.querySelectorAll('.slideshow--teaser .slideshow__container');
      var slideshowsWithImages = document.querySelectorAll('.slideshow--images .slideshow__container');
      for (var i = 0; i < slideshowsWithTeaser.length; i++) {
        (function(i) {
          var slideshow = slideshowsWithTeaser[i];
          var swiperInstance = new Swiper(slideshow, {
            loop: true,
            autoplay: {
              delay: 5000,
            },
            calculateHeight: true,
            speed: 600,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
          swiperInstance.on('slideChange', function () {
            lazyLoadInstance.update();
          });
        }(i));
      }
      for (var i = 0; i < slideshowsWithImages.length; i++) {
        (function(i) {
          var slideshow = slideshowsWithImages[i];
          var swiperInstance = new Swiper(slideshow, {
            loop: true,
            autoplay: {
              delay: 5000,
            },
            calculateHeight: true,
            speed: 600,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
          swiperInstance.autoplay.stop();
          slideshow.querySelectorAll('.swiper-button-play')[0].addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.add('swiper-is-stopped');
            swiperInstance.autoplay.start();
          });
          slideshow.querySelectorAll('.swiper-button-pause')[0].addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('swiper-is-stopped');
            swiperInstance.autoplay.stop();
          });
          swiperInstance.on('slideChange', function () {
            lazyLoadInstance.update();
          });
        }(i));
      }
    }();

    flatpickr.localize(flatpickr.l10ns.de);
    flatpickr.l10ns.default.firstDayOfWeek = 1;
    flatpickr(".datepicker", {
      static: true,
      altFormat: 'd.m.Y',
      altInput: true,
      dateFormat: 'Y-m-d',
      nextArrow: '<i class="icon icon--system" data-icon="chevron_right"></i>',
      prevArrow: '<i class="icon icon--system" data-icon="chevron_left"></i>',
      onChange: function(selectedDates, dateStr, instance) {
        if (dateStr) {
          instance.mobileInput.classList.add('flatpicker-dateselected');
        }
      },
    });

    /* make selects stylable */
    function makeSelectsGreatAgain() {
      var selects = document.querySelectorAll('.select select');
      if (selects) {
        for (var i = 0; i < selects.length; i++) {
          new selecty(selects[i]);
        }
      }
    }
    makeSelectsGreatAgain();

    /* add ripple effect to buttons */
    var addRippleEffect = function() {
      var buttons = document.getElementsByClassName('button');
      addRippleElement(buttons);

      var linkListItems = document.querySelectorAll('.linklist__list > li > a');
      addRippleElement(linkListItems);

      var teaserItems = document.querySelectorAll('.teaser__item');
      addRippleElement(teaserItems);

      var linkBoxItems = document.querySelectorAll('.linkbox__list > li > a');
      addRippleElement(linkBoxItems);

      var accordionToggles = document.querySelectorAll('.accordion__toggle');
      addRippleElement(accordionToggles);
        
      function addRippleElement(elements) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].classList.add('ripple');
          elements[i].onmousedown = function(e) {
              var x = e.offsetX,
                  y = e.offsetY,
                  w = this.offsetWidth;
              var ripple = document.createElement('span');
              ripple.className = 'ripple__circle';
              ripple.style.left = x + 'px';
              ripple.style.top  = y + 'px';
              ripple.style.setProperty('--scale', w);
              this.appendChild(ripple);
              setTimeout(function() {
                  ripple.parentNode.removeChild(ripple);
              }, 500);
          }
        }
      }
    }();
  
    /* resize handler */
    function resizeHandler() {
      setAccordion(true);
      // responsiveBackgroundImages();
    }

    function is_landscape() {
      return window.matchMedia('(orientation: landscape)').matches;
    }
  
    /* width resize event listener */
    window.addEventListener("resize", resizeThrottler, false);
    function getViewportWidth() {
      return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    var resizeTimeout;
    var savedViewportWith = getViewportWidth();
    function resizeThrottler() {
      if ( !resizeTimeout ) {
        resizeTimeout = setTimeout(function() {
          resizeTimeout = null;
          var viewportWith = getViewportWidth();
          if (savedViewportWith !== viewportWith) {
            savedViewportWith = viewportWith;
            resizeHandler();
          }
         }, 66);
      }
    }

})();