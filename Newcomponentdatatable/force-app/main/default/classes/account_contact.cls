public class account_contact {
     @AuraEnabled(cacheable=true)
  public static List<Contact> getcontact(Id val) {
 return [SELECT Id, Name,Meeting_Fixed_Date__c, Meeting_Held_Date__c, Meeting_Pipeline_Date__c, QAL_Created_Date__c, Appointment_Set_Date__c, Appointment_Scheduled_For__c, QAL_Follow_up_Date__c, SAL_Follow_up_Date__c, Appointment_Held_Date__c, SAL_Created_Date__c, Sales_Accepted_Lead_Date_SAL__c, Qualified_Meeting_Held_Date_QAL__c
         FROM Contact  Where AccountId =:val 
         And ( SAL_Created_Date__c !=null OR Meeting_Fixed_Date__c != null OR Meeting_Held_Date__c != null OR Meeting_Pipeline_Date__c != null OR QAL_Created_Date__c != null OR Appointment_Set_Date__c != null OR Appointment_Held_Date__c != null OR Qualified_Meeting_Held_Date_QAL__c != null OR  QAL_Follow_up_Date__c != null OR SAL_Follow_up_Date__c != null OR Sales_Accepted_Lead_Date_SAL__c != null OR Qualified_Meeting_Held_Date_QAL__c != null) order by CreatedDate DESC];
   }
}