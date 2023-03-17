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
let color = "#000000" as string | number | string[] | undefined;
let width = 1 as any

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

const activeClass = (target: HTMLElement): void => {
  let isActive = target.classList.contains('active')
  if (isActive) {
    target.classList.remove("active")
    return
  }
  const lastActive = document.querySelector('.active');
  if (lastActive) {
    lastActive.classList.remove("active");
  }
  const containsActive = $(target).hasClass("active");
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

const handleClear = async () => {
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

const handleCancel = () => {
  $(".overlay").removeClass("show");
  $(".edit-image").removeClass("show");
  canvas.getObjects().forEach((o: any) => {
    canvas.remove(o)
  });
}

const handleDelete = () => {
  console.log(imageBackground)
  localForage.removeItem(imageBackground)
}

const handleText = (e: any) => {
  const target = e.target;
  var iText = new fabric.IText('Text', {
    left: 100,
    fill: color
  });
  activeClass(target)
  canvas.add(iText);
}

const handleChangeColor = (e: any) => {
  color = $(`.${e.target.className}`).val();
  canvas.freeDrawingBrush.color = color;
}

const handleChangeWidth = (e: any) => {
  width = $("#width-select :selected").val()
  canvas.freeDrawingBrush.width = parseInt(width);
}

$(".image").on("click", handleImage);
$(".save button").on("click", handleSave);
$(".restore button").on("click", handleLoad);
$(".cancel button").on("click", handleCancel);
$(".clear button").on("click", handleClear);
$(".delete button").on("click", handleDelete);
$(".utils-utils.drawer").on("click", handleUtils);
$(".utils-utils.text").on("click", handleText);

$(".color-picker").on("change", handleChangeColor)
$(".width-select").on("change", handleChangeWidth)






