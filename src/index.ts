import $, { cssNumber, event } from "jquery";
const fabric = require("fabric").fabric;

let isDrawing = false as boolean;
let jsonSave: any;
let imageBackground = "" as string;

var canvas = new fabric.Canvas('canvas', {
  width: 800,
  height: 700,
});

canvas.setZoom(canvas.getZoom() * 1);

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
  const myPromise = new Promise((resolve, reject) => {
    imageBackground = event.target.currentSrc
    resolve(imageBackground)
  })
  myPromise.then(image => {
    fabric.Image.fromURL(image, function (img: any) {
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);
      canvas.setBackgroundImage(img);
      canvas.requestRenderAll();
    });
  })
}

const handleUtils = (e: any) => {
  const target = e.target.tagName;
  $(`${target}`).toggleClass('active')
  handleDrawing();
}


const handleSave = () => {
  jsonSave = canvas.toJSON();
  console.log(jsonSave)
  canvas.getObjects().forEach((o: any) => {
    canvas.remove(o)
  });
}

const handleRestore = () => {
  canvas.loadFromJSON(jsonSave, canvas.renderAll.bind(canvas));
}


$(".image").on("click", handleImage);
$(".utils-utils").on("click", handleUtils);
$(".save button").on("click", handleSave);
$(".restore button").on("click", handleRestore);

var text = new fabric.Text('hello world', { left: 100, top: 100 });

var itext = new fabric.IText('GeeksforGeeks', {

});


canvas.add(text, itext);
