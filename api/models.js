class Project {
  constructor(name) {
    this.name = name;
  }

  view() {
    return {
      name: this.name
    };
  }
}

module.exports = {Project}
