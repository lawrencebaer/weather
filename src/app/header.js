module.exports = {
  template: require('./header.html'),
  controller: HeaderCtrl,
  bindings: {
    loading: '<',
    zipCode: '<',
    valid: '<',
    onClick: '&'
  }
};

function HeaderCtrl () {

}
