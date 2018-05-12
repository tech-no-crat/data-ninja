class Project {
  constructor(id, name, filePath) {
    this.id = id;
    this.name = name;
    this.filePath = filePath;
  }

  view() {
    return {
      name: this.name
    };
  }
}

module.exports = {Project}
