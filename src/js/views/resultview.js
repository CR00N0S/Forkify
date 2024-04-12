import view from './view';
import icons from 'url:../../img/icons.svg';

class resultview extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'could not find your dish';

  _generateMarkup() {
    return this._data.map(this._genmarkup).join('');
  }

  _genmarkup(result) {
    const id = window.location.hash.slice(1);

    return `
        <li class="preview">
            <a class="preview__link ${
              id === result.id ? 'preview__link--active' : ''
            }"  href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image_url}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                
              </div>
            </a>
          </li>
        `;
  }
}

export default new resultview();
