import $, { event } from "jquery";
const fabric = require("fabric").fabric;

let isDrawing = false as boolean;

const handleDrawing = () => {
  isDrawing = !isDrawing;
  if (isDrawing) {
    canvas.isDrawingMode = true;
  } else {
    canvas.isDrawingMode = false;
  }
}

const handleImage = (event: any): void => {
  $(".overlay").addClass("show");
  $(".edit-image").addClass("show");
}

const handleButton = (e: any) => {
  const target = e.target.tagName;
  $(`${target}`).toggleClass('active')
  handleDrawing();
}

const handleMouseDown = () => {
  $("button").toggleClass("mouse-down");

}

$(".image").on("click", handleImage);

$(".utils-utils").on("click", handleButton);
const utilsUtils = document.querySelector(".utils-utils")
// utilsUtils?.addEventListener("click", handleButton)






var canvas = new fabric.Canvas('canvas', {
  width: 500,
  height: 700,
  backgroundImage: 'https://thumbs.dreamstime.com/z/silhouette-de-femme-13998582.jpg"'
  // backgroundColor: 'white'
});


