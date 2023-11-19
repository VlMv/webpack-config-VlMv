class MyClass {
  constructor(item) {
    this.item = item;
  }

  addItem(parent) {
    const div = document.createElement('div');
    div.textContent = this.item;
    div.classList.add('test__font-2');
    parent.prepend(div);
  }
}


function setClass(parent) {
  const newClass = new MyClass('Vaska');
  newClass.addItem(parent);
}

export default setClass;
