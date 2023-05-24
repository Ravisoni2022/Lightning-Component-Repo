import { LightningElement, api, wire } from 'lwc';
import getcontact from '@salesforce/apex/account_contact.getcontact';
//import getopportunity from '@salesforce/apex/account_contact.getopportunity';

const Columns = [
    {
        label: 'Contact Name', fieldName: 'Contact_Id', type: 'url', hideDefaultActions: "true",
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }, target: '_blank'
        }
    },
    // { label: 'Record Type', fieldName: 'RecordType_Name',hideDefaultActions: "true" },
    { label: 'Meeting Fixed', fieldName: 'Meeting_Fixed',hideDefaultActions: "true",type: "date" ,typeAttributes: {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    } },
    { label: 'Meeting Held ', fieldName: 'Meeting_Held' ,hideDefaultActions: "true",type: "date" ,typeAttributes: {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    }},
    { label: 'Meeting Pipeline', fieldName: 'Meeting_Pipeline' ,hideDefaultActions: "true",type: "date" ,typeAttributes: {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    }},
    { label: 'QAL Date ', fieldName: 'QAL_Date',hideDefaultActions: "true",type: "date" ,typeAttributes: {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    } },
    { label: 'SAL Date', fieldName: 'SAL_Date',hideDefaultActions: "true",type: "date" ,typeAttributes: {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    } },
    
    { label: 'QAL Followup', fieldName: 'QAL_Followup',hideDefaultActions: "true",type: "date" ,typeAttributes: {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    } },
    { label: 'SAL FollowUp', fieldName: 'SAL_Followup',hideDefaultActions: "true",type: "date" ,typeAttributes: {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    } }
];

// colum for datatable
//why wirev decorator?  wire is recative in nature  when ever their is change in org data it will automaticaaly reflect in lwc .
export default class Releted_Contact extends LightningElement {
    @api recordId;   // give reacordid of account
    contacts;
    error;
    cols = Columns; //if the Apex method takes a string parameter, don’t pass a string directly. Instead, pass an object that contains a property whose value is a string.
    @wire(getcontact, { val: '$recordId' }) wiredContacts({ error, data }) {
        if (data) {
            console.log('Contact Data:', data);
            this.contacts = data;
            this.error = undefined;
            // to show account name
            let currentData = [];
            data.forEach((row) => {
                let rowData = {};
                console.log('row Data:', row);
                //console.log('row.RecordType.Name', row.RecordType.Name);
                rowData.Contact_Id = '/' + row.Id;
                console.log('rowData.Contact_Id', rowData.Contact_Id);
                rowData.Name = row.Name;
                //rowData.RecordType_Name = row.RecordType.Name;
                if (row.QAL_Created_Date__c != null) {
                    rowData.QAL_Date = row.QAL_Created_Date__c;
                } else if ('') {}

                if (row.Meeting_Pipeline_Date__c != null) {
                    rowData.Meeting_Pipeline = row.Meeting_Pipeline_Date__c;
                } else if ('') {}

                if (row.Meeting_Held_Date__c != null) {
                    rowData.Meeting_Held = row.Meeting_Held_Date__c;
                } else if ('') {}

                if (row.Meeting_Fixed_Date__c != null) {
                    rowData.Meeting_Fixed = row.Meeting_Fixed_Date__c;
                } else if ('') {}

                if (row.SAL_Created_Date__c != null) {
                    rowData.SAL_Date = row.SAL_Created_Date__c
                } else if ('') {
                }
                if (row.QAL_Followup_Date__c != null){
                    rowData.QAL_Followup = row.QAL_Followup_Date__c
                }else if (''){}
                if (row.SAL_Follow_up_Date__c != null){
                    rowData.SAL_Followup = row.SAL_Follow_up_Date__c;
                }else if (''){}
                //rowData.Appointment_Scheduled_For__c = row.Appointment_Scheduled_For__c;
                //rowData.Appointment_Held_Date__c = row.Appointment_Held_Date__c;
                rowData.QAL_Follow_up_Date__c = row.SAL_Follow_up_Date__c;
                rowData.SAL_Follow_up_Date__c = row.SAL_Follow_up_Date__c;
                //rowData.Qualified_Meeting_Held_Date_QAL__c = row.Qualified_Meeting_Held_Date_QAL__c;
                //rowData.Sales_Accepted_Lead_Date_SAL__c = row.Sales_Accepted_Lead_Date_SAL__c;


                if (row.Account) {
                    rowData.Account_Name = row.Account.Name;
                }
                console.log('row data NEW', rowData);
                currentData.push(rowData);

            });
            this.contacts = currentData;

        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
        console.log(data);
        console.log(error);
    }

    exportContactData(){
        let columnHeaderCSV = ['Contact Name','Meeting Fixed','Meeting Held','Meeting Pipeline','QAL Date','SAL Date','QAL Followup','SAL FollowUp'];
        // Prepare a html table
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += 'border: 1px solid black;';
        doc += 'border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
        columnHeaderCSV.forEach(element => {            
            doc += '<th>'+ element +'</th>'           
        });
        doc += '</tr>';
        // Add the data rows
        console.log(this.contacts);
        this.contacts.forEach(record => {
            doc += '<tr>';
            if (record.Name != undefined) {
                doc += '<th>'+record.Name+'</th>'; 
            } else {
                doc += '<th>'+'-'+'</th>'; 
            }
            // if (record.RecordType_Name != undefined) {
            //     doc += '<th>'+record.RecordType_Name+'</th>'; 
            // } else {
            //     doc += '<th>'+'-'+'</th>'; 
            // }
            if (record.Meeting_Fixed != undefined) {
                doc += '<th>'+record.Meeting_Fixed+'</th>'; 
            } else {
                doc += '<th>'+'-'+'</th>'; 
            }
            if (record.Meeting_Held != undefined) {
                doc += '<th>'+record.Meeting_Held+'</th>'; 
            } else {
                doc += '<th>'+'-'+'</th>'; 
            }
            if (record.Meeting_Pipeline != undefined) {
                doc += '<th>'+record.Meeting_Pipeline+'</th>'; 
            } else {
                doc += '<th>'+'-'+'</th>'; 
            }
            if (record.QAL_Date != undefined) {
                doc += '<th>'+record.QAL_Date+'</th>'; 
            } else {
                doc += '<th>'+'-'+'</th>'; 
            }
            if (record.SAL_Date != undefined) {
                doc += '<th>'+record.SAL_Date+'</th>'; 
            } else {
                doc += '<th>'+'-'+'</th>'; 
            }
            if (record.QAL_Followup != undefined) {
                doc += '<th>'+record.QAL_Follow_up_Date__c+'</th>'; 
            } else {
                doc += '<th>'+'-'+'</th>'; 
            }
            if (record.SAL_Followup != undefined) {
                doc += '<th>'+record.SAL_Follow_up_Date__c+'</th>'; 
            } else {
                doc += '<th>'+'-'+'</th>'; 
            }
            
            
            doc += '</tr>';
        });
        doc += '</table>';
        console.log('Check doc table'+ doc)
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Contact Data.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
}

