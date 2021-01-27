document.addEventListener("DOMContentLoaded", function () {
    var stage = new NGL.Stage("viewport");
    stage.loadFile("rcsb://1crn", {defaultRepresentation: true});
});