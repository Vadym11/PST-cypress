import { BasePage } from "../BasePage";
import { Header } from "../HeaderComponent";

export class CartBasePage extends BasePage {

    readonly header: Header;

    constructor() {
        super();
        this.header = new Header();
    }
}