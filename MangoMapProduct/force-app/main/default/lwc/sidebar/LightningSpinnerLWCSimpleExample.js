import { LightningElement, api } from 'lwc';

export default class LightningSpinnerLWCSimpleExample extends LightningElement {
    @api isLoaded = false;
    // change isLoaded to the opposite of its current value
    handleClick() {
        this.isLoaded = !this.isLoaded;
    }
}
