var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import $ from "jquery";
const localForage = require("localforage");
const fabric = require("fabric").fabric;
localForage.config({
    driver: localForage.LOCALSTORAGE,
    name: "2Dshape",
    version: 1.0,
    storeName: "keyvaluepairs",
});
let isDrawing = false;
let jsonSave;
let imageBackground = "";
let color = "#000000";
let width = 1;
var canvas = new fabric.Canvas('canvas', {
    width: 800,
    height: 700,
});
canvas.setZoom(canvas.getZoom() * 1);
const handleDrawing = () => {
    isDrawing = !isDrawing;
    if (isDrawing) {
        canvas.isDrawingMode = true;
    }
    else {
        canvas.isDrawingMode = false;
    }
};
const handleImage = (event) => {
    $(".overlay").addClass("show");
    $(".edit-image").addClass("show");
    const myPromise = new Promise((resolve, reject) => {
        imageBackground = event.target.currentSrc;
        resolve(imageBackground);
    });
    myPromise.then((image) => __awaiter(void 0, void 0, void 0, function* () {
        const lf = yield localForage.getItem(imageBackground);
        if (lf) {
            handleLoad();
        }
        fabric.Image.fromURL(image, function (img) {
            img.scaleToWidth(canvas.width);
            img.scaleToHeight(canvas.height);
            canvas.setBackgroundImage(img);
            canvas.requestRenderAll();
        });
    }));
};
const activeClass = (target) => {
    let isActive = target.classList.contains('active');
    if (isActive) {
        target.classList.remove("active");
        return;
    }
    const lastActive = document.querySelector('.active');
    if (lastActive) {
        lastActive.classList.remove("active");
    }
    const containsActive = $(target).hasClass("active");
    if (!containsActive) {
        target.classList.add('active');
    }
    else {
        target.classList.remove('active');
    }
};
const handleUtils = (e) => {
    const target = e.target;
    activeClass(target);
    handleDrawing();
};
const handleClear = () => __awaiter(void 0, void 0, void 0, function* () {
    canvas.getObjects().forEach((o) => {
        canvas.remove(o);
    });
});
const handleSave = () => {
    jsonSave = canvas.toJSON();
    const imageSRC = jsonSave.backgroundImage.src;
    localForage.setItem(imageSRC, JSON.stringify(jsonSave));
};
const handleLoad = () => __awaiter(void 0, void 0, void 0, function* () {
    const lf = yield localForage.getItem(imageBackground);
    canvas.loadFromJSON(JSON.parse(lf), canvas.renderAll.bind(canvas));
});
const handleCancel = () => {
    $(".overlay").removeClass("show");
    $(".edit-image").removeClass("show");
    canvas.getObjects().forEach((o) => {
        canvas.remove(o);
    });
};
const handleDelete = () => {
    console.log(imageBackground);
    localForage.removeItem(imageBackground);
};
const handleText = (e) => {
    const target = e.target;
    var iText = new fabric.IText('Text', {
        left: 100,
        fill: color
    });
    activeClass(target);
    canvas.add(iText);
};
const handleChangeColor = (e) => {
    color = $(`.${e.target.className}`).val();
    canvas.freeDrawingBrush.color = color;
};
const handleChangeWidth = (e) => {
    width = $("#width-select :selected").val();
    canvas.freeDrawingBrush.width = parseInt(width);
};
$(".image").on("click", handleImage);
$(".save button").on("click", handleSave);
$(".restore button").on("click", handleLoad);
$(".cancel button").on("click", handleCancel);
$(".clear button").on("click", handleClear);
$(".delete button").on("click", handleDelete);
$(".utils-utils.drawer").on("click", handleUtils);
$(".utils-utils.text").on("click", handleText);
$(".color-picker").on("change", handleChangeColor);
$(".width-select").on("change", handleChangeWidth);
