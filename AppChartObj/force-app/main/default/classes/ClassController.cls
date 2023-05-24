public with sharing class ClassController {
    @AuraEnabled(cacheable=true)
    public static list<Application_Form__c> getUserFromApp(Id recordId){
        return [ SELECT Id,(SELECT  Full_Name__c, Director_Owner__c, RecordTypeName__c, Ownership__c FROM App_Directors_Owners__r) FROM Application_Form__c WHERE Id ='a005800000V5fvpAAB'];
    }
  
}