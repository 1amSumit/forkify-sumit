import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handle) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      handle(goto);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPage = Math.ceil(
      this._data.result.length / this._data.searchPerPage
    );
    console.log(numPage);
    if (curPage === 1 && numPage > 1) {
      return `
    <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      <span>Page ${curPage + 1}</span>
    </button>
      `;
    }

    if (numPage === curPage && numPage > 1) {
      return `
    <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;
    }

    if (curPage < numPage) {
      return `
        <button data-goto=${
          curPage - 1
        } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
        </button>

        <button data-goto=${
          curPage + 1
        } class="btn--inline pagination__btn--next">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        <span>Page ${curPage + 1}</span>
        </button>`;
    }
    return '';
  }
}

export default new PaginationView();
