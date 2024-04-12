class searchView {
  #perentel = document.querySelector('.search');

  query() {
    const query = this.#perentel.querySelector('.search__field').value;
    this.cleari();
    return query;
  }

  cleari() {
    this.#perentel.querySelector('.search__field').value = '';
  }

  addHandlerSearch(functionq) {
    this.#perentel.addEventListener('submit', function (e) {
      e.preventDefault();
      functionq();
    });
  }
}
export default new searchView();
