class SearchView {
  #parentEl = document.querySelector('.search');

  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clear();
    return query;
  }
  #clear() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handle) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handle();
    });
  }
}

export default new SearchView();
