import $, { cssNumber, event } from "jquery";
const localForage = require("localforage");
const fabric = require("fabric").fabric;


localForage.config({
  driver: localForage.LOCALSTORAGE,
  name: "2Dshape",
  version: 1.0,
  storeName: "keyvaluepairs",
});


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
  myPromise.then(async (image) => {
    const lf = await localForage.getItem(imageBackground)
    if (lf) {
      handleLoad()
    }
    fabric.Image.fromURL(image, function (img: any) {
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);
      canvas.setBackgroundImage(img);
      canvas.requestRenderAll();
    });
  })
}

const activeClass = (target: HTMLElement) => {
  const lastActive = document.querySelector('.active');
  if (lastActive) {
    lastActive.classList.remove("active");
  } const containsActive = $(target).hasClass("active");
  if (!containsActive) {
    target.classList.add('active');
  } else {
    target.classList.remove('active');
  }
}

const handleUtils = (e: any) => {
  const target = e.target;
  activeClass(target)
  handleDrawing();
}

const handleDelete = () => {
  canvas.getObjects().forEach((o: any) => {
    canvas.remove(o)
  });
}

const handleSave = () => {
  jsonSave = canvas.toJSON();
  const imageSRC = jsonSave.backgroundImage.src;
  localForage.setItem(imageSRC, JSON.stringify(jsonSave));
}

const handleLoad = async () => {
  const lf = await localForage.getItem(imageBackground)
  canvas.loadFromJSON(JSON.parse(lf), canvas.renderAll.bind(canvas));
}

const handleText = (e: any) => {
  const target = e.target;
  var iText = new fabric.IText('Text', {
    left: 100,
  });
  activeClass(target)
  canvas.add(iText);
}

$(".image").on("click", handleImage);
$(".save button").on("click", handleSave);
$(".restore button").on("click", handleLoad);
$(".delete button").on("click", handleDelete);
$(".utils-utils.drawer").on("click", handleUtils);
$(".utils-utils.text").on("click", handleText);

// var text = new fabric.Text('hello world', { left: 100, top: 100 });







