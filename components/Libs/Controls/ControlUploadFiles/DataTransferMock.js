export class DataTransferMock {
  constructor() {
    this.data = {};
    this.files = [];
    this.types = [];
    this.items.add = (item) => {
      this.files.push(item);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  items() {}
}
