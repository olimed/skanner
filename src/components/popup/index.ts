import * as Quagga from "quagga"; 
import {renderElement} from "../../helpers/index";

export interface IPopupComponent {
    openModal(): void;
    closeModal(): void;
    bind(element): void;
}

export default class PopupComponent implements IPopupComponent {
    private modalView: HTMLElement;
    private scannerView: HTMLElement;
    private state: Boolean = false;
    private scannerIsRunning: Boolean = false;
    private bindView;
    private renderComponent(){
        const closeButton = renderElement("button", "close-button");
        closeButton.textContent = "X";
        closeButton.onclick = this.closeModal.bind(this);
        const header = renderElement("div", "modal-header", {}, [closeButton]);
        this.scannerView = renderElement("div");
        const body = renderElement("div", "modal-body", {}, [this.scannerView]);
        const modal = renderElement("div", "modal", {}, [header, body]);
        this.modalView = modal;
        document.body.appendChild(modal);
    }
    private initQuagga(){
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: this.scannerView,
                constraints: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: [
                    "ean_reader",
                    "ean_8_reader",
                    "code_39_reader",
                ],
                debug: {
                    showCanvas: true,
                    showPatches: true,
                    showFoundPatches: true,
                    showSkeleton: true,
                    showLabels: true,
                    showPatchLabels: true,
                    showRemainingPatchLabels: true,
                    boxFromPatches: {
                        showTransformed: true,
                        showTransformedBox: true,
                        showBB: true
                    }
                }
            },

        }, (err) => {
            if (err) {
                console.log(err);
                return
            }

            console.log("Initialization finished. Ready to start");
            Quagga.start();

            // Set flag to is running
            this.scannerIsRunning = true;
        });
        
        Quagga.onProcessed((result) => {
            const drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter((box) => {
                        return box !== result.box;
                    }).forEach((box) => {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, { color: "red", lineWidth: 3 });
                }
            }
        });


        Quagga.onDetected((result) => {            
            console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
            if (this.bindView && this.bindView.setBarcode) {
                this.bindView.setBarcode(result.codeResult)
            }
            this.closeModal();
        });
    
    }
    private stopScanner() {
        if (this.scannerIsRunning) {
            Quagga.stop();

            // Set flag to is running
            this.scannerIsRunning = false;
        }
    }
    constructor() {
        this.renderComponent();
        this.initQuagga();
    }
    openModal(){
        this.modalView.classList.add("active");
        this.initQuagga();
    }
    closeModal(){
        this.modalView.classList.remove("active");
        this.stopScanner();
    }
    bind(element) {
        if (element) {
            this.bindView = element;
        }
    }
}