import { LightningElement, track, wire, api } from 'lwc';

import seeSObject from '@salesforce/apex/SidebarController.seeSObject';
import seeCustObject from '@salesforce/apex/SidebarController.seeCustObject';

import ObjectData from '@salesforce/apex/SidebarController.selectedObject';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import setAllFilterFields from '@salesforce/apex/SidebarController.setAllFilterFields';
import getAllFiltersFields from '@salesforce/apex/SidebarController.getAllFiltersFields';

const columns = [
    { label: 'Standard Object Name', fieldName: 'apiName' }
]
const columnCustom = [{ label: 'Custom Object Name', fieldName: 'apiName' }];
export default class LWCWizard extends LightningElement {
    //@track value;

    @track fieldsName;
    @track options = [
        { label: 'Open - Not Contacted', value: 'Open - Not Contacted' },
        { label: 'Working - Contacted', value: 'Working - Contacted' },
        { label: 'Closed - Converted', value: 'Closed - Converted' },
        { label: 'Closed - Not Converted', value: 'Closed - Not Converted' }
    ];
    @track allValues = [];

    @track opStageOptions = [
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Need Analysis', value: 'Need Analysis' },
        { label: 'Value preposition', value: 'Value preposition' },
        { label: 'Id. decision maker', value: 'Id. decision maker' },
        { label: 'Perception Analysis', value: 'Perception Analysis' },
        { label: 'Proposal/Price Quote', value: 'Proposal/Price Quote' },
        { label: 'Negotiation/Review', value: 'Negotiation/Review' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
    ];
    @track allOpStage = [];
    @track allOpAmountList = [];
    allOpAmount;

    //-----------------------------//c/filter
    ref_Value;
    ref_Title;
    ref_Name;
    //-----------------------------//

    //@wire(ObjectData) records; // myCustomSettings
    fromDate;
    toDate;
    selectedObject;
    selectFromDate = null;
    selectToDate = null;

    Select;
    None;
    oppAmount;
    selectleadStatus = [];
    selectopportunityStage = [];
    @track selectoppAmount = [];

    @track selectedRow;
    seedata;
    columns = columns;
    columnCustom = columnCustom;
    standardObj = [];
    customObj = [];
    @wire(seeSObject) ObjectList;
    @wire(seeCustObject) CustomObjectList;

    @track REFERENCE_FilterFields = [];
    @track pickListFilterFields = [];
    handleFields() {
        console.log(this.template.querySelector('.fieldsPickList').value);
        this.fieldsName.forEach(e => {
            if (e.fieldsName.includes(this.template.querySelector('.fieldsPickList').value)) {
                if (e.datatypeName == 'PICKLIST') {
                    console.log(e.datatypeName);
                    if (!this.pickListFilterFields.includes(e)) {
                        this.pickListFilterFields.push(e);
                        console.log('PICKLIST' + this.pickListFilterFields);
                    }
                } else if (e.datatypeName == 'REFERENCE') {
                    if (!this.REFERENCE_FilterFields.includes(e)) {
                        this.REFERENCE_FilterFields.push(e);
                        console.log('REFERENCE' + this.REFERENCE_FilterFields);
                    }
                }
            }
        });
        console.log(this.pickListFilterFields);
    }

    handleChangeREF(event) {
        this.ref_Value = event.target.value;
        this.ref_Title = event.target.title;
        this.ref_Name = event.target.Name;
        console.log('value: ' + this.ref_Value);
        console.log('name: ' + this.ref_Name);
        console.log('title: ' + this.ref_Title);
    }

    @track filterPicklistValue = [];
    @track filterReferenceValue = [];
    @track tempListPL = [];
    tempListRF = [];
    handleFilter(event) {
        console.log('value: ' + event.target.value);
        console.log('name: ' + event.target.name);
        console.log('title: ' + event.target.title);

        this.fieldsName.forEach(e => {


            if (this.tempListPL.length <= this.fieldsName.length) {
                this.tempListPL.push({ value: [], key: e.fieldApiName });
                console.log(this.tempListPL);
            }
            //console.log(this.tempListPL[e.fieldApiName]);
            if (e.datatypeName == 'PICKLIST') {
                if (e.fieldApiName == event.target.title) {
                    //console.log('map: ' + this.tempListPL.key(e.fieldApiName));
                    console.log(e);
                    var objIndex = this.tempListPL.findIndex((obj => obj.key == e.fieldApiName));
                    console.log('objIndex: ' + objIndex);

                    console.log(this.tempListPL[objIndex]);
                    if (!this.tempListPL[objIndex].value.includes(event.target.value)) {
                        this.tempListPL[objIndex].value.push(event.target.value);
                        console.log('tempListPL: ' + this.tempListPL[objIndex].value);
                        e.filterValue = this.tempListPL[objIndex].value;
                    }
                    var objIndex = this.fieldsName.findIndex((obj => obj.fieldApiName == e.fieldApiName));
                    console.log('objIndex: ' + objIndex);

                    console.log(this.fieldsName[objIndex]);
                    //this.fieldsName[objIndex].filterValue = this.filterPicklistValue;
                    //console.log(this.fieldsName[objIndex].fieldsName);
                    /*if (!this.tempListPL.includes(event.target.value)) {
                        this.tempListPL.push(event.target.value);
                        console.log('tempListPL: ' + this.tempListPL);
                        e.filterValue = this.tempListPL;
                        //this.filterPicklistValue = [];
                        this.filterPicklistValue.push(e);
                        console.log('this.filterValueList: ' + JSON.stringify(this.filterPicklistValue));
                        var objIndex = this.filterPicklistValue.findIndex((obj => obj.fieldApiName == e.fieldApiName));
                        console.log('objIndex: ' + objIndex);
                    }*/

                }
            } /*else if (e.datatypeName == 'REFERENCE') {
                console.log('e.fieldApiName ' + e.fieldApiName);
                console.log('this.ref_Title ' + this.ref_Title);
                if (e.fieldApiName == this.ref_Title) {
                    console.log(e);
                    if (!this.tempListRF.includes(this.ref_Value)) {
                        this.tempListRF.push(this.ref_Value);
                        console.log('tempListRF: ' + this.tempListRF);
                        e.filterValue = this.tempListRF;
                        this.filterReferenceValue = [];
                        this.filterReferenceValue.push(e);
                        console.log('this.filterReferenceValue: ' + JSON.stringify(this.filterReferenceValue));
                    }
                }
            }*/
        });
    }
    handlePill() {
        console.log('handlePill start');
        console.log(this.tempListPL);
        console.log(this.pickListFilterFields);


    }
    handleChange(event) {

        if (!this.allValues.includes(event.target.value) && this.selectedObject == 'Lead') {
            this.allValues.push(event.target.value);
            this.handleSelect();
        }
        if (!this.allOpStage.includes(event.target.value) && this.selectedObject == 'Opportunity') {
            this.allOpStage.push(event.target.value);
            this.handleSelect();
        }
    }
    handleRemove(event) {
        const valueRemoved = event.target.name;

        if (this.selectedObject == 'Lead') {
            this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);
            console.log('allValues=' + this.allValues)
        }
        if (this.selectedObject == 'Opportunity') {
            this.allOpStage.splice(this.allOpStage.indexOf(valueRemoved), 1);
        }
        this.handleSelect();
    }
    handleChangeAmt(event) {

        console.log('event.target.value= ' + event.target.value);
        this.allOpAmount = event.target.value;
    }
    handleRemoveAmt(event) {
        const valueRemoved = event.target.name;
        this.selectoppAmount.splice(this.allOpStage.indexOf(valueRemoved), 1);
        //this.handleSelect();
    }

    @wire(seeSObject) doSomething({ data, error }) {

        if (data) {
            console.log('data =' + data);
            console.log(data);
            if (data.length == 0) {
                this.doSomething = true;
            } else {
                this.seedata = data;
                console.log(this.seedata);
                this.doSomething();
            }
            // let a = this.myCustomSettings.data;
        } else if (error) {
            console.log(error);
        }

        // do something...

    }

    @track currentStep = '1';

    handleOnStepClick(event) {
        this.currentStep = event.target.value;
    }

    get isStepOne() {
        return this.currentStep === "1";
    }

    get isStepTwo() {
        return this.currentStep === "2";
    }

    get isStepThree() {
        return this.currentStep === "3";
    }

    get isStepFour() {
        return this.currentStep === "4";
    }

    get isEnableNext() {
        return this.currentStep != "4";
    }

    get isEnablePrev() {
        return this.currentStep != "1";
    }

    get isEnableFinish() {
        return this.currentStep === "4";
    }


    // SUCCESS TOAST EVENT START

    showToastStep1() {
        const event = new ShowToastEvent({
            title: 'Please Select at least One Object',
            message: 'Please Select at least One Object',
            variant: 'error',
        })
        this.dispatchEvent(event);
    }
    showToastStep2First() {
        const event = new ShowToastEvent({
            title: 'Please Select Object',
            message: 'Please Select Object',
            variant: 'error',
        })
        this.dispatchEvent(event);
    }
    showToastStep2Second() {
        const event = new ShowToastEvent({
            title: 'To date Should be grater than From Date',
            message: 'To date Should be grater than From Date',
            variant: 'error',
        })
        this.dispatchEvent(event);
    }

    @track contacts;
    @track errorMsg;
    obj = [];
    handleNext() {
        if (this.currentStep == "1") {
            this.selectedRow = this.template.querySelector('lightning-datatable').getSelectedRows();
            console.log(this.selectedRow);
            this.obj = this.selectedRow;
            var cutomData = this.template.querySelector('.CustomObj').getSelectedRows();
            cutomData.forEach(el => {
                console.log(el);
                this.obj.push(el);
            });
            //console.log(cutomData);
            //this.obj.push(cutomData[0]);
            console.log('obj' + JSON.stringify(this.obj));
            if (this.selectedRow.length == 0) {
                this.showToastStep1();
            } else {
                this.currentStep = "2";
            }
            console.log(this.selectedRow);


        }
        // else if(this.selectedObject == null){
        //     this.showToastRed == true;
        // }
        else if (this.currentStep == "2") {
            console.log("Step 2");
            if (!this.selectedObject) {
                this.showToastStep2First();
            } else if (this.selectFromDate && this.selectToDate && this.selectFromDate > this.selectToDate) {

                this.showToastStep2Second();
            } else {
                //console.log(ObjectData.value);
                this.currentStep = "3";

            }



            getAllFiltersFields({ filterValueList: this.fieldsName, objectName: this.selectedObject })
                .then(result => {
                    this.mapMarkers = result;
                    this.zoomLevel = 2;
                    this.listView = "visible";
                    console.log(this.mapMarkers);
                })
                .catch(error => {
                    this.errorMsg = error;
                    console.log(this.errorMsg);

                })

            console.log(this.selectedObject);
            console.log(this.selectFromDate);
            console.log(this.selectToDate);
            console.log(this.selectopportunityStage);
            console.log(this.selectleadStatus);
            console.log(this.selectoppAmount);
            // ObjectData({ selectedObj: this.selectedObject, fromDate: this.selectFromDate, toDate: this.selectToDate, leadStatus: this.selectleadStatus, opportunityStage: this.selectopportunityStage, oppAmount: this.selectoppAmount })

            /*ObjectData({ selectedObj: this.selectedObject, fromDate: this.selectFromDate, toDate: this.selectToDate, leadStatus: this.selectleadStatus, opportunityStage: this.selectopportunityStage, oppAmount: this.selectoppAmount })
                .then(result => {
                    this.mapMarkers = result;
                    this.zoomLevel = 2;
                    this.listView = "visible";
                    console.log(this.mapMarkers);
                })
                .catch(error => {
                    this.errorMsg = error;
                    console.log(this.errorMsg);

                })*/
            //refreshApex(this.mapMarkers);
            console.log(this.mapMarkers);
            this.mapMarkers.forEach(e => {
                console.log('e::=' + e);
                console.log('e::=' + e.title);
            });
            //this.mapMarkers.forEach(el => {
            //console.log(el);

            //});
        } else if (this.currentStep == "3") {
            console.log("step 3");
            this.currentStep = "4";


            // ObjectData({selectedObj:this.selectedObject,opportunityStage:this.selectopportunityStage,Select:this.selectleadStatus,amount:this.selectamount})
        }
        // else{
        //     this.showToastRed();
        //     this.showToastRed == true;
        // }


        // if(this.selectedObject == true){
        //     this.showToast();
        //     this.showToast == true;
        // }
        // else{
        //     this.showToast == false;
        // }
    }


    LeadStatusTrue;
    oppTrue;
    dateTrue;
    handleSelect() {
        console.log("Hii");
        this.selectedObject = this.template.querySelector('select').value;
        console.log(this.selectedObject);
        setAllFilterFields({ ObjectName: this.selectedObject })
            .then(result => {
                console.log(result);
                console.log('result' + JSON.stringify(result));
                //console.log(result.fieldsName);
                var temp = JSON.stringify(result);
                this.fieldsName = JSON.parse(temp);
                //console.log(this.fieldsName);
            })
            .catch(error => {
                this.errorMsg = error;
                console.log(this.errorMsg);

            })
        this.fieldsName.forEach(e => {
            console.log(e);

        });
        if (this.selectedObject == "Shoe Shop" || this.selectedObject == "Lead" || this.selectedObject == "Account" || this.selectedObject == "Contact" || this.selectedObject == "Opportunity") {
            this.dateTrue = true;
        } else {
            this.dateTrue = false;
        }
        if (this.selectedObject == "Lead") {
            this.LeadStatusTrue = true;
            this.oppTrue = false;
        } else if (this.selectedObject == "Opportunity") {
            this.oppTrue = true;
            this.LeadStatusTrue = false;
        } else {
            this.LeadStatusTrue = false;
            this.oppTrue = false;
        }
        if (this.selectedObject == "Lead" || this.selectedObject == "Account" || this.selectedObject == "Contact" || this.selectedObject == "Opportunity") {


            this.selectFromDate = this.template.querySelector(".fromDate").value;
            console.log('this.selectFromDate 01 --' + this.selectFromDate);
            this.selectToDate = this.template.querySelector(".toDate").value;
            console.log('this.selectToDate 01 --' + this.selectToDate);
            console.log(this.selectFromDate.length);
            if (this.selectFromDate.length != 0 && this.selectToDate.length == 0) {
                var todayDate = new Date();
                this.selectToDate = todayDate.toJSON(); //DateTime Value
                console.log('this.selectToDate 02 --' + this.selectToDate);
            } else if (this.selectFromDate.length == 0 && this.selectToDate.length == 0) {
                this.selectFromDate = undefined;
                this.selectToDate = undefined;
            }

        }
        console.log('this.allOpStage' + this.allOpStage);
        if (this.selectedObject == "Opportunity") {
            if (this.allOpStage) {
                console.log('hii::');
                this.selectopportunityStage = [];
                this.allOpStage.forEach(e => {
                    if (!this.selectopportunityStage.includes(e)) {
                        this.selectopportunityStage.push(e);
                    }
                });
            }

            console.log('Select Opp Stage ' + this.selectopportunityStage);

            if (this.allOpAmount) {
                if (!this.selectoppAmount.includes(this.allOpAmount)) {
                    this.selectoppAmount.push(this.allOpAmount);
                }
            }
            if (this.selectoppAmount.length == 0) {
                this.selectoppAmount = [];
            }
            console.log('Select Amount ' + this.selectoppAmount);
            // console.log(' this.template.querySelector(".oppAmount").value' + this.template.querySelector(".oppAmount").value);
            // console.log('Select Amount ' + this.selectamount);
        } else if (this.selectedObject == "Lead") {
            //this.selectleadStatus = this.template.querySelector(".leadStatus").value;
            console.log('allValues::' + this.allValues);
            console.log('allValues size::' + this.allValues.length);
            if (this.allValues && this.allValues != '') {

                this.selectleadStatus = [];
                this.allValues.forEach(e => {
                    if (!this.selectleadStatus.includes(e)) {
                        this.selectleadStatus.push(e);
                    }
                });
            } else {
                console.log('hii==');
                this.selectleadStatus = [];
            }
            console.log('Select Lead ' + this.selectleadStatus);
        }


    }

    handlePrev() {
        if (this.currentStep == "4") {
            this.currentStep = "3";
        } else if (this.currentStep == "3") {
            this.currentStep = "2";

            this.selectFromDate = undefined;
            this.selectToDate = undefined;
            this.selectopportunityStage = undefined;
            this.selectleadStatus = [];
            console.log('this.selectleadStatus' + this.selectleadStatus);
            this.selectoppAmount = [];
            this.selectedObject = null;

            this.allValues = [];
            this.allOpStage = [];
            this.allOpAmount = undefined;


            this.oppTrue = false;
            this.LeadStatusTrue = false;
            this.dateTrue = false;
        } else if (this.currentStep = "2") {
            this.currentStep = "1";

            this.selectFromDate = undefined;
            this.selectToDate = undefined;
            this.selectopportunityStage = [];
            this.selectleadStatus = [];
            this.selectoppAmount = [];
            this.selectedObject = null;

            this.allOpStage = [];
            this.allValues = [];
            this.allOpAmount = undefined;


            this.oppTrue = false;
            this.LeadStatusTrue = false;
            this.dateTrue = false;
        }
    }

    //handleFinish() {
    //     LeadStatusTrue
    //}


    //--------------------------------------
    mapMarkers;
    zoomLevel;
    listView;
    // @wire(ObjectData, { selectedObj: '$selectedObject', fromDate: '$selectFromDate', toDate: '$selectToDate', leadStatus: '$selectleadStatus', opportunityStage: '$selectopportunityStage', oppAmount: '$selectoppAmount' })
    // LocationMarker({ data, error }) {
    //     if (data) {
    //         console.log('hiiiiiiiiii');
    //         console.log(data);
    //         this.mapMarkers = data

    //         console.log(this.mapMarkers);
    //         //Google Maps API supports zoom levels from 1 to 22 in desktop browsers, and from 1 to 20 on mobile.
    //         this.zoomLevel = 5;
    //         this.listView = "visible";
    //     } else if (error) {
    //         error;
    //         console.log(error);
    //     }
    // }
    handleCancel() {
        this.oppTrue = false;
        this.LeadStatusTrue = false;
        this.dateTrue = false;

        this.selectedObject = undefined;
        this.selectFromDate = undefined;
        this.selectToDate = undefined;
        this.selectopportunityStage = [];
        this.selectleadStatus = [];
        this.selectoppAmount = [];

        this.allValues = [];
        this.allOpStage = [];
        this.allOpAmount = undefined;

        this.currentStep = "1";
    }

    /*connectedCallback() {
      this.mapMarkers = [
        {
          location: {
            City: "Ajmer",
            Country: "India",
            PostalCode: "305001",
            State: "RJ",
            Street: "Ajay Nagar"
          },
          title: "Salesforce Bolt",
          description: "I am here",
          icon: "standard:account"
        },
        {
          location: {
            City: "Nagpur",
            Country: "India",
            PostalCode: "440002",
            State: "MH",
            Street: "Itwari"
          },
          title: "shahamir Location",
          description: "Success !",
          icon: "standard:account"
        }
      ];
      console.log(this.mapMarkers);
      //Google Maps API supports zoom levels from 1 to 22 in desktop browsers, and from 1 to 20 on mobile.
      this.zoomLevel = 5;
      this.listView = "visible";
    }*/
    //--------------------------------------

}