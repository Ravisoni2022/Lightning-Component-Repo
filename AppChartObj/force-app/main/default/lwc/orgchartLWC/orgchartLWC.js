import { LightningElement,api } from 'lwc';
    import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
    import orgChart from '@salesforce/resourceUrl/orgchart';

    export default class ContactHierarchy extends LightningElement {
    error;
    chart;
    initialized = false;

    renderedCallback() {
        if (this.initialized) return;
        this.initialized = true;

        Promise.all([
            loadScript(this, orgChart),
        ])
            .then(() => {
                console.log('script loaded')
                this.intialized3();
            })
            .catch((error) => {
               this.error = error;
                console.log(error);
            });
    }
    

    intialized3() {
        let canvas = this.template.querySelector(".orgchart");
        let context = canvas;
        this.chart = new orgchart(context, {
            mouseScrool: orgchart.action.none, nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            },
            nodes: [
                { id: 1, name: "Amber McKenzie" , title: "CEO", img: "https://cdn.balkan.app/shared/2.jpg"},
                { id: 2, pid: 1, name: "Ava Field" , title: "Marketing Manager" , img: "https://cdn.balkan.app/shared/3.jpg"},
                { id: 3, pid: 1, name: "Peter Stevens",title: "Sales Manager" , img: "https://cdn.balkan.app/shared/4.jpg"},
                { id: 4, pid: 1, name: "Ravi Soni ",title: "HR Manager" , img: "https://cdn.balkan.app/shared/2.jpg"}
            ]

        });
        console.log(this.chart);

    }
    }