(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.publication-filter__pill'));
    var inlineTagButtons = Array.prototype.slice.call(document.querySelectorAll('.pub-tag[data-filter-tag]'));
    var publicationArticles = Array.prototype.slice.call(document.querySelectorAll('.archive__item--publication'));
    var sectionTitles = Array.prototype.slice.call(document.querySelectorAll('[data-publication-section]'));
    var emptyMessage = document.querySelector('.publication-filter__empty');
    var selectedTags = new Set();

    if (!publicationArticles.length) {
      return;
    }

    function publicationWrapper(article) {
      return article.closest('.list__item') || article;
    }

    function tagsOf(article) {
      return (article.getAttribute('data-tags') || '').split(',').filter(Boolean);
    }

    function matchesSelectedTags(article) {
      if (selectedTags.size === 0) {
        return true;
      }

      var tags = tagsOf(article);
      return Array.from(selectedTags).some(function (tag) {
        return tags.indexOf(tag) !== -1;
      });
    }

    function updateChipStates() {
      var allTagButtons = filterButtons.concat(inlineTagButtons);
      allTagButtons.forEach(function (button) {
        var tag = button.getAttribute('data-filter-tag');
        var isActive = selectedTags.has(tag);
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    function updateSectionVisibility() {
      sectionTitles.forEach(function (sectionTitle) {
        var section = sectionTitle.getAttribute('data-publication-section');
        var hasVisiblePublication = publicationArticles.some(function (article) {
          return article.getAttribute('data-category') === section && publicationWrapper(article).style.display !== 'none';
        });

        sectionTitle.style.display = hasVisiblePublication ? '' : 'none';
      });
    }

    function applyFilter() {
      var visibleCount = 0;

      publicationArticles.forEach(function (article) {
        var wrapper = publicationWrapper(article);
        var show = matchesSelectedTags(article);
        wrapper.style.display = show ? '' : 'none';
        if (show) {
          visibleCount += 1;
        }
      });

      updateSectionVisibility();
      if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
      }
    }

    function toggleTag(tag) {
      if (!tag) {
        return;
      }

      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
      } else {
        selectedTags.add(tag);
      }

      updateChipStates();
      applyFilter();
    }

    filterButtons.concat(inlineTagButtons).forEach(function (button) {
      button.addEventListener('click', function () {
        toggleTag(button.getAttribute('data-filter-tag'));
      });
    });
  });
}());
