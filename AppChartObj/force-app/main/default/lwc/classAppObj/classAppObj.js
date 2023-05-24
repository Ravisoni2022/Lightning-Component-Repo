import { api, LightningElement, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import orgcharttreeview from '@salesforce/resourceUrl/orgcharttreeview';
import getUserFromApp from '@salesforce/apex/ClassController.getUserFromApp';


export default class MyTreeGrid extends LightningElement {
    @api recordId
    d3Initialized = false;
    Datacon =[];

   @wire(getUserFromApp, { recordId: '$recordId' })
   dataHandler({data,error}){
    if(data){
        console.log(data[0].App_Directors_Owners__r);
        const newdata =data[0].App_Directors_Owners__r.concat({Full_Name__c:"a005800000V5fvpAAB",Application_Form__c:""})
       
        this.Datacon=data[0].App_Directors_Owners__r;
        
       
    }
   }
    renderedCallback() {
        if (this.orgcharttreeviewInitialized) {
            return;
        }
        this.orgcharttreeviewInitialized = true;

        Promise.all([
            loadScript(this, orgcharttreeview +'/orgcharttreeview.v7.min.js')
        ]).then(() => {
                console.log("libradry loaded succesfully");
                console.log( this.Datacon);
                 this.initializeorgcharttreeview();
            })
            .catch(error => {
            console.error(error);
            });
    }

    initializeorgcharttreeview() {

        function wrap(text, width) {
            text.each(function () {
                var text = orgcharttreeview.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = 0,dx = 0, //parseFloat(text.attr("dy")),
                    tspan = text.text(null)
                                .append("tspan")
                                .attr("x", x)
                                .attr("y", y)
                                .attr("dx", dx + "em")
                                .attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                                    .attr("x", x)
                                    .attr("y", y)
                                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                                    .text(word);
                                    
                    }
                }
            });
        }
        
        var svg = orgcharttreeview.select(this.template.querySelector('[data-id="visualisation"]')).append("svg").attr("width", 1200).attr("height", 600)
        .append("g").attr("transform", "translate(50,50)")

        var data = [{Full_Name__c:"Avijit communications",Application_Form__c:""},
        {Full_Name__c:"Avijit Kar",Application_Form__c:"Avijit communications"},
        {Full_Name__c:"Avijit Kar",Application_Form__c:"Avijit communications"},]
//var data = this.Datacon
        
        var dataStructure = orgcharttreeview.stratify().id(function (d) { return d.Full_Name__c; }).parentId(function (d) { return d.Application_Form__c; })
            (data);
        var treeStructure = orgcharttreeview.tree().size([850, 300]);
        var information = treeStructure(dataStructure);
       
      
            var connections = svg.append("g").selectAll("path")
            .data(information.links());
        connections.enter().append("path")
            .attr("d", function (d) {
                   return "M" + d.source.x + "," + d.source.y + " v 50 H" + d.target.x + " V" + d.target.y;
        });

        var rectangles = svg.append("g").selectAll("rect")
        .data(information.descendants());
            rectangles.enter().append("rect")
            .attr("x", function(d) { return d.x-40; })
            .attr("y", function(d) { return d.y-20; });
    
        var names = svg.append("g").selectAll("text").data(information.descendants());
        names.enter().append("text")
            .text(function(d) { return d.data.Full_Name__c; })
            .attr("x", function(d) { return d.x ; })
            .attr("y", function(d) { return d.y ; })
            .call(wrap, 57)
            .classed("bigger", true)
    }

}