import PopupComponent from '../popup/index';
import {renderElement, PATTERNS_BARCODES, TYPES_BARCODES} from '../../helpers/index';

export interface IScannerComponent {
    setBarcode(text: Object): void;
}

export default class ScannerComponent implements IScannerComponent {
    private _scannerElement: HTMLElement;
    private input: HTMLInputElement;
    private popup: PopupComponent;
    private renderComponent(parent: HTMLElement){
        // const icon = renderElement("icon", "mdi mdi-camera");
        // const iconButton = renderElement("button", "icon-button", {}, [icon]);
        const iconButton =  renderElement("span", "icon-button mdi mdi-camera");
        const label = renderElement("label", "view-label");
        label.textContent = "Scanner barcodes";
        this.input = renderElement("input", "view-input", {type: "text"}) as any;
        this.input.addEventListener('setbarcode', this.setBarcode);
        const wrapper = renderElement("div", "wrapper", {}, [label, this.input, iconButton]);

        parent.appendChild(wrapper);
        this.scannerElement = wrapper;
        iconButton.onclick = this.openCamera.bind(this);
    }
    private get scannerElement() {
        return this._scannerElement || document.createElement("div");
    }
    private set scannerElement(element: HTMLElement) {
        this._scannerElement = element;
    }
    private openCamera(){
        this.popup.openModal();
    }
    constructor( private readonly parent: HTMLElement ) {
        this.renderComponent(parent);
        this.popup = new PopupComponent();
        this.popup.bind(this)
    }
    setBarcode(result): void {
        this.input.setAttribute("pattern", PATTERNS_BARCODES[result.format]);
        this.input.value = result.code;
        // this.input.value = TYPES_BARCODES[result.format](result.code);
    }
}