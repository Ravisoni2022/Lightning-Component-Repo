public with sharing class SidebarController {
    
    @AuraEnabled(cacheable =true)
    public static List<objectClass> seeSObject(){
        //system.debug('selectedData'+selectedData);
        list<objectClass> allobject = new list<objectClass>();
        for(Schema.SObjectType obj : Schema.getGlobalDescribe().Values()) {
            if(obj.getDescribe().getName()=='Account'||obj.getDescribe().getName()=='Contact'||obj.getDescribe().getName()=='Lead'||obj.getDescribe().getName()=='Opportunity') {
                system.debug('obj: '+obj);
                system.debug('obj getDescribe: '+obj.getDescribe());
                objectClass wpr = new objectClass();
                //wpr.objectName = obj.getDescribe().getLabel();
                wpr.apiName = obj.getDescribe().getName();
                //System.debug(wpr.apiName);
                allobject.add(wpr);
            }
        }
        
        system.debug('allobject'+ allobject);
        return allobject;
    }
    @AuraEnabled(cacheable =true)
    public static List<objectClass> seeCustObject(){
        list<objectClass> allobject = new list<objectClass>();
        objectClass wpr = new objectClass();
        wpr.apiName = 'Shoe Shop';
        allobject.add(wpr);
        system.debug('allobject- 2-'+ allobject);
        return allobject;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<fieldDetailsWrapper> setAllFilterFields(String ObjectName){
        System.debug('ObjectName' + ObjectName);
        
        list<fieldDetailsWrapper> fieldDetailsWrapperList = new list<fieldDetailsWrapper>();
        
        SObjectType contactType = Schema.getGlobalDescribe().get(ObjectName);
        Map<String,Schema.SObjectField> mfields = contactType.getDescribe().fields.getMap();
        
        List<String> sObjectDetailsList = new List<String>();
        
        for(String fieldApiName : mfields.keySet()){
            SObjectType r = ((SObject)(Type.forName('Schema.'+ObjectName).newInstance())).getSObjectType();
            DescribeSObjectResult d = r.getDescribe();
            //system.debug('d: '+d.getValue());
            
            //System.debug(d.fields.getMap().get(String.valueOf(mfields.get(s))).getDescribe().getType());//datatype
            Schema.DisplayType datatypeName = d.fields.getMap().get(String.valueOf(mfields.get(fieldApiName))).getDescribe().getType();
            
            String fieldsName = mfields.get( fieldApiName ).getDescribe().getLabel();
            
            system.debug('fieldsName: '+fieldsName);            
            System.debug('datatypeName: ' + datatypeName);//datatype
            System.debug('fieldApiName: ' + fieldApiName);//field Api Name
            
            if(String.valueOf(datatypeName) == 'PICKLIST' || String.valueOf(datatypeName) == 'DATETIME' || String.valueOf(datatypeName) == 'CURRENCY' || String.valueOf(datatypeName) == 'NUMBER' || String.valueOf(datatypeName) == 'REFERENCE' || String.valueOf(datatypeName) == 'DATE'){
                //sObjectDetailsList.add(String.valueOf(mfields.get(fieldApiName)));
                fieldDetailsWrapper fw = new fieldDetailsWrapper();
                fw.fieldsName = fieldsName;
                fw.datatypeName = String.valueOf(datatypeName);
                fw.fieldApiName = fieldApiName;
                fw.filterValue = null;
                if(String.valueOf(datatypeName) == 'PICKLIST'){
                    List<Schema.PicklistEntry> pValues = ((SObject)(Type.forName('Schema.'+ObjectName).newInstance())).getSObjectType().getDescribe().fields.getMap().get(fieldApiName).getDescribe().getPicklistValues();
                    system.debug('pValues: '+pValues);
                    List<string> valuesList = new List<string>();
                    for(Schema.PicklistEntry pv:pValues){
                        
                        system.debug('pv: '+pv);
                        system.debug('pv.getLabel(): '+pv.getLabel());
                        string var = pv.getLabel();
                        system.debug('var: '+var);
                        
                        valuesList.add(pv.getLabel());
                        system.debug('valuesList: '+valuesList);
                    }
                    fw.values = valuesList;
                }else{
                    fw.values = null;
                }
                fieldDetailsWrapperList.add(fw);
            }
        }
        
        
        return fieldDetailsWrapperList;
    }
    
    //Account
    
    @AuraEnabled(cacheable=true)
    public static List<waraperLocationMarker2> getAllFiltersFields(List<fieldDetailsWrapper> filterValueList, string objectName){
        List<waraperLocationMarker2> sendObjectData = new List<waraperLocationMarker2>();
        list<string> iterableFields = new list<string>();
        string Query = '';
        system.debug('filterValueList: '+filterValueList);
        system.debug('objectName: '+objectName);
        Set<String> fieldNames = schema.describeSObjects(new String[] {objectName})[0].fields.getMap().keyset();
 		List<String> iterableField = new List<String>(fieldNames);
        for(string fld: iterableField){
          
            if(fld == 'Name' || fld == 'Id' || fld == 'BillingCity' || fld == 'BillingCountry' || fld == 'BillingStreet' || fld == 'BillingPostalCode' || fld == 'BillingState') {
            system.debug('fieldApiName:' + fld);
                iterableFields.add(fld);
            }
            else if(fld == 'Name' || fld== 'Id' || fld == 'MailingCity' || fld == 'MailingCountry' || fld == 'MailingStreet' || fld == 'MailingPostalCode' || fld == 'MailingState'){
                system.debug('fieldApiName:' + fld);
                iterableFields.add(fld);
            }
            else if(fld == 'Name' || fld== 'Id' || fld == 'City' || fld == 'Country' || fld == 'Street' || fld == 'PostalCode' || fld == 'State'){
                system.debug('fieldApiName:' + fld);
                iterableFields.add(fld);
            }
        }
        for(fieldDetailsWrapper wlm : filterValueList){
            //ACCOUNT
            
            //CONTACT
           /* else if(wlm.fieldApiName == 'Name' || wlm.fieldApiName == 'Id' || wlm.fieldApiName == 'CleanStatus' || wlm.fieldApiName == 'MailingCity' || wlm.fieldApiName == 'MailingCountry' || wlm.fieldApiName == 'MailingStreet' || wlm.fieldApiName == 'MailingPostalCode' || wlm.fieldApiName == 'MailingState'){
            iterableFields.add(wlm.fieldApiName);   
            }
            //LEAD
            else if(wlm.fieldApiName == 'Name' || wlm.fieldApiName == 'Id' || wlm.fieldApiName == 'Status' || wlm.fieldApiName == 'City' || wlm.fieldApiName == 'Country' || wlm.fieldApiName == 'Street' || wlm.fieldApiName == 'PostalCode' || wlm.fieldApiName == 'State'){
            iterableFields.add(wlm.fieldApiName);      
            }
            //OPPORTUNITY
            else if(wlm.fieldApiName == 'Name' || wlm.fieldApiName == 'Id' || wlm.fieldApiName == 'StageName' || wlm.fieldApiName == 'Account.BillingCity' || wlm.fieldApiName == 'Account.BillingCountry' || wlm.fieldApiName == 'Account.BillingStreet' || wlm.fieldApiName == 'Account.BillingPostalCode' || wlm.fieldApiName == 'Account.BillingState'){
            iterableFields.add(wlm.fieldApiName);   
            }*/
            
            if(wlm.filterValue != NULL){
                system.debug(wlm.datatypeName);
                if(wlm.datatypeName == 'DATETIME' || wlm.datatypeName == 'DATE'){
                    //CreatedDate >=:FromDate AND CreatedDate <=:toDate ;
                    system.debug('wlm.filterValue[0]=> '+wlm.filterValue[0]);
                    system.debug('wlm.filterValue[0]=> '+wlm.filterValue[1]);
                    //te dt1= Date.parse(wlm.filterValue[0]);
                    //te dt2= Date.parse(wlm.filterValue[1]);
                    //tetime fromDate = DateTime.newInstance(dt1.year(),dt1.month(),dt1.day(),0,0,0);
                    //tetime toDate = DateTime.newInstance(dt2.year(),dt2.month(),dt2.day(),0,0,0);
                    Query += wlm.fieldApiName + ' >= '+ wlm.filterValue[0] + ' AND ' + wlm.fieldApiName + ' <= '+ wlm.filterValue[1] + ' AND ';
                    system.debug('Query: '+ Query);
                }else{
                    system.debug('wlm filterValue: '+wlm.filterValue);
                    system.debug('wlm fieldApiName: '+wlm.fieldApiName);
                    //iterableFields.add(wlm.fieldApiName);
                    Query += wlm.fieldApiName + ' IN(\''+ String.join(wlm.filterValue, '\',\'')+'\') AND ';
                    system.debug('Query: '+ Query);
                }
            }
        }
        
        system.debug('Check iterableFields:' + iterableFields);   
        Query = Query.removeEnd(' AND ');
        system.debug('Query: '+ Query);
 //Set<String> fieldNames = schema.describeSObjects(new String[] {sobjectName})[0].fields.getMap().keyset();
 //List<String> iterableFields = new List<String>(fieldNames);
system.debug('string '+ String.format('SELECT {0} FROM {1} WHERE {2}', new String[] { String.join(iterableFields, ','), objectName, Query}));

        List<SObject> objectList =  Database.query(String.format('SELECT {0} FROM {1} WHERE {2}', new String[] { 
    String.join(iterableFields, ','),
    objectName,
    Query}));
system.debug('objectList:  ' + objectList);
system.debug('objectList:  ' + objectList.size());		//String.join(iterableFields, ',')
        if(ObjectName == 'Account'){
            system.debug(ObjectName);
            for(SObject acc: objectList){
                if((String)acc.get('BillingCity') != null && (String)acc.get('BillingCountry') != null && (String)acc.get('BillingStreet') != null && (String)acc.get('BillingPostalCode') != null && (String)acc.get('BillingState') != null){
                system.debug('acc:' + acc); 
                system.debug(acc.get('Name'));
                waraperLocationMarker wlm = new waraperLocationMarker();
                waraperLocationMarker2 wlm2 = new waraperLocationMarker2();
                    
                    wlm.City =(String)acc.get('BillingCity');
                    wlm.Country = (String)acc.get('BillingCountry');
                    wlm.street = (String)acc.get('BillingStreet');
                    wlm.PostalCode = (String)acc.get('BillingPostalCode');
                    wlm.State = (String)acc.get('BillingState');
                    
                    wlm2.location = wlm;
                    wlm2.title = (String)acc.get('Name');
                    wlm2.icon = 'standard:account';
                 
                sendObjectData.add(wlm2);
            }
            }
        }
       
    

    
        //CONTACT
    if(ObjectName == 'Contact'){
            system.debug(ObjectName);
            for(SObject con: objectList){
                if((String)con.get('MailingCity') != null && (String)con.get('MailingCountry') != null && (String)con.get('MailingStreet') != null && (String)con.get('MailingPostalCode') != null && (String)con.get('MailingState') != null){
                system.debug('con:' + con); 
                system.debug(con.get('Name'));
                waraperLocationMarker wlm = new waraperLocationMarker();
                   waraperLocationMarker2 wlm2 = new waraperLocationMarker2();
                    
                    wlm.City =(String)con.get('MailingCity');
                    wlm.Country = (String)con.get('MailingCountry');
                    wlm.street = (String)con.get('MailingStreet');
                    wlm.PostalCode = (String)con.get('MailingPostalCode');
                    wlm.State = (String)con.get('MailingState');
                    
                    wlm2.location = wlm;
                    wlm2.title = (String)con.get('Name');
                    wlm2.icon = 'standard:contact';
                 
                sendObjectData.add(wlm2);
            }
            }
        }
        
       //Lead
           if(ObjectName == 'Lead'){
            system.debug(ObjectName);
            for(SObject lead: objectList){
                if((String)lead.get('City') != null && (String)lead.get('Country') != null && (String)lead.get('Street') != null && (String)lead.get('PostalCode') != null && (String)lead.get('State') != null){
                system.debug('lead:' + lead); 
                system.debug(lead.get('Name'));
                waraperLocationMarker wlm = new waraperLocationMarker();
                   waraperLocationMarker2 wlm2 = new waraperLocationMarker2();
                    
                    wlm.City =(String)lead.get('City');
                    wlm.Country = (String)lead.get('Country');
                    wlm.street = (String)lead.get('Street');
                    wlm.PostalCode = (String)lead.get('PostalCode');
                    wlm.State = (String)lead.get('State');
                    
                    wlm2.location = wlm;
                    wlm2.title = (String)lead.get('Name');
                    wlm2.icon = 'standard:lead';
                 
                sendObjectData.add(wlm2);
            }
            }
        }
        
        system.debug('Check sendObjectData:' + sendObjectData);
        return sendObjectData;
    }
      
 
      
    	
    
    
    
    
	@AuraEnabled(cacheable = true)
    //public static List<waraperLocationMarker2> selectedObject(){
        
    public static List<waraperLocationMarker2> selectedObject(string selectedObj,datetime fromDate,datetime toDate,List<string> leadStatus,List<string> opportunityStage,List<integer> oppAmount){
        
        system.debug('selectedObject::'+selectedObj);
        system.debug('FromDate::'+FromDate);
        system.debug('toDate::'+toDate);
        system.debug('opportunityStage' + opportunityStage);
        system.debug('leadStatus' + leadStatus);
        system.debug('leadStatus' + leadStatus.isEmpty());
        system.debug('oppAmount' + oppAmount);
        if(FromDate == Null){
            toDate = Null;
        }
		List<Account> AccList = new List<Account>();
        //String fullRecordURL = URL.getSalesforceBaseUrl().toExternalForm() + '/' + listview.Name;
        List<Contact> ConList = new List<Contact>();
        List<Opportunity> oppList = new List<Opportunity>();
        List<Lead> leadList = new List<Lead>();
        List<Shoe_Shop__c> shoeList = new List<Shoe_Shop__c>();
        // FOR ACCOUNT OBJECT START
        //string selectedObj2 = 'Account';
        List<waraperLocationMarker2> waraperLocationMarkerList = new List<waraperLocationMarker2>();
        
        if(selectedObj == 'Account'){
            system.debug(selectedObj);
            if(FromDate != Null && toDate != Null){
            AccList = [select id,Name,BillingCity,BillingCountry,BillingStreet,BillingPostalCode,BillingState,CreatedDate from account where CreatedDate >=:FromDate AND CreatedDate <=:toDate ];
            } 
            else if(FromDate == Null && toDate == Null){
            AccList = [select id,Name,BillingCity,BillingCountry,BillingStreet,BillingPostalCode,BillingState from account LIMIT 200];
            }
            for(Account acc:AccList){
                if(acc.BillingCity != null && acc.BillingCountry != null && acc.BillingStreet != null && acc.BillingPostalCode != null && acc.BillingState != null){
                //if(acc.BillingCity != null || acc.BillingCountry != null || acc.BillingStreet != null || acc.BillingPostalCode != null || acc.BillingState != null){
                	system.debug('acc'+acc);
                    waraperLocationMarker wlm = new waraperLocationMarker();
                    waraperLocationMarker2 wlm2 = new waraperLocationMarker2();
                    
                    wlm.City =acc.BillingCity;
                    wlm.Country = acc.BillingCountry;
                    wlm.street = acc.BillingStreet;
                    wlm.PostalCode = acc.BillingPostalCode;
                    wlm.State = acc.BillingState;
                    
                    wlm2.location = wlm;
                    wlm2.title = acc.name;
                    wlm2.description = '<a href="https://wahinnovations-2c-dev-ed.develop.lightning.force.com/lightning/r/Account/'+ acc.Id +'">'+ acc.Name +'</a>';
                    wlm2.icon = 'standard:account';
                    
                    waraperLocationMarkerList.add(wlm2);
                }
            }
            system.debug('waraperLocationMarkerList'+waraperLocationMarkerList);
            return waraperLocationMarkerList;
        }

        // FOR ACCOUNT OBJECT END


        // FOR CONTACT OBJECT START
            //List<waraperLocationMarker2> waraperLocationMarkerListc = new List<waraperLocationMarker2>();
            
            if(selectedObj == 'Contact'){
                system.debug(selectedObj);
                if(FromDate != Null && toDate != Null){
                ConList = [select id,Name,MailingCity,MailingCountry,MailingStreet,MailingPostalCode,MailingState,CreatedDate from contact where CreatedDate >=:FromDate AND CreatedDate <=:toDate ];
                }
                else{
                ConList = [select id,Name,MailingCity,MailingCountry,MailingStreet,MailingPostalCode,MailingState from contact LIMIT 200];
                }
                for(Contact con:ConList){
                    if(con.MailingCity != null && con.MailingCountry != null && con.MailingStreet != null && con.MailingPostalCode != null && con.MailingState != null){
                        system.debug('con'+con);
                        waraperLocationMarker wlmc = new waraperLocationMarker();
                        waraperLocationMarker2 wlmc2 = new waraperLocationMarker2();
                        
                        wlmc.City =con.MailingCity;
                        wlmc.Country = con.MailingCountry;
                        wlmc.street = con.MailingStreet;
                        wlmc.PostalCode = con.MailingPostalCode;
                        wlmc.State = con.MailingState;
                        
                        wlmc2.location = wlmc;
                        wlmc2.title = con.name;
                        wlmc2.description = 'test shahamir';
                        wlmc2.icon = 'standard:contact';
                        
                        waraperLocationMarkerList.add(wlmc2);
                    }
                }
                system.debug('waraperLocationMarkerList'+ waraperLocationMarkerList);
                return waraperLocationMarkerList;
            }
            
            // FOR CONTACT OBJECT START



            // FOR LEAD OBJECT START

        //List<waraperLocationMarker2> waraperLocationMarkerListl = new List<waraperLocationMarker2>();
            
            if(selectedObj == 'Lead'){
                system.debug(selectedObj);
                if(FromDate != Null && toDate != Null && !leadStatus.isEmpty()){
                leadList = [select id,Name,City,Country,Street,PostalCode,State,CreatedDate,Status from lead where CreatedDate >=:FromDate AND CreatedDate <=:toDate AND Status =:leadStatus];
                }
                else if(FromDate == Null && toDate == Null && !leadStatus.isEmpty()){
                    leadList = [select id,Name,City,Country,Street,PostalCode,State,CreatedDate,Status from lead where Status=:leadStatus];
                }
                else if(FromDate != Null && toDate != Null && leadStatus.isEmpty()){
                    leadList = [select id,Name,City,Country,Street,PostalCode,State,CreatedDate from lead where CreatedDate >=:FromDate AND CreatedDate <=:toDate];
                }
                else if(FromDate == Null && toDate == Null && leadStatus.isEmpty()){
                leadList = [select id,Name,City,Country,Street,PostalCode,State,Status from lead LIMIT 200];
                }
                system.debug('leadList' + leadList);
                for(Lead lead:leadList){
                    if(lead.City != null && lead.Country != null && lead.Street != null && lead.PostalCode != null && lead.State != null){
                        system.debug('lead'+lead);
                        waraperLocationMarker wlml = new waraperLocationMarker();
                        waraperLocationMarker2 wlml2 = new waraperLocationMarker2();
                        
                        wlml.City =lead.City;
                        wlml.Country = lead.Country;
                        wlml.street = lead.Street;
                        wlml.PostalCode = lead.PostalCode;
                        wlml.State = lead.State;
    
                        
                        wlml2.location = wlml;
                        wlml2.title = lead.name;
                        wlml2.description = 'test shahamir';
                        wlml2.icon = 'standard:lead';
                        
                        waraperLocationMarkerList.add(wlml2);
                    }
                }
                system.debug('waraperLocationMarkerList'+waraperLocationMarkerList);
                return waraperLocationMarkerList;
            }

            // FOR LEAD OBJECT END


            // FOR OPPORTUNITY OBJECT START

            //List<waraperLocationMarker2> waraperLocationMarkerListo = new List<waraperLocationMarker2>();
            
             if(selectedObj == 'Opportunity'){
                 system.debug(selectedObj);
                 if(FromDate != Null && toDate != Null && !opportunityStage.isEmpty() && !oppAmount.isEmpty()){
                 oppList = [select id,Name,Account.BillingCity,Account.BillingCountry,Account.BillingStreet,Account.BillingPostalCode,Account.BillingState,StageName,Amount,CreatedDate from opportunity where CreatedDate >=:FromDate AND CreatedDate <=:toDate AND StageName =:opportunityStage AND Amount =:oppAmount];
            	 }
                 else if(FromDate == Null && toDate == Null && opportunityStage.isEmpty() && !oppAmount.isEmpty()){
                 oppList = [select id,Name,Account.BillingCity,Account.BillingCountry,Account.BillingStreet,Account.BillingPostalCode,Account.BillingState,Amount from opportunity where Amount =:oppAmount];   
                 }
                 else if(FromDate != Null && toDate != Null  && oppAmount.isEmpty() && opportunityStage.isEmpty()){
                 oppList = [select id,Name,Account.BillingCity,Account.BillingCountry,Account.BillingStreet,Account.BillingPostalCode,Account.BillingState,CreatedDate from opportunity where CreatedDate >=:FromDate AND CreatedDate <=:toDate];    
                 }
                 else if(FromDate != Null && toDate != Null  && oppAmount.isEmpty() && !opportunityStage.isEmpty()){
                 oppList = [select id,Name,Account.BillingCity,Account.BillingCountry,Account.BillingStreet,Account.BillingPostalCode,Account.BillingState,CreatedDate,StageName from opportunity where CreatedDate >=:FromDate AND CreatedDate <=:toDate AND StageName =:opportunityStage];    
                 }
                 else if(FromDate == Null && toDate == Null && oppAmount.isEmpty() && !opportunityStage.isEmpty()){
                 oppList = [select id,Name,Account.BillingCity,Account.BillingCountry,Account.BillingStreet,Account.BillingPostalCode,Account.BillingState,StageName from opportunity where StageName =:opportunityStage];   
                 }
                 else if(FromDate == Null && toDate == Null  && !oppAmount.isEmpty() && !opportunityStage.isEmpty()){
                 oppList = [select id,Name,Account.BillingCity,Account.BillingCountry,Account.BillingStreet,Account.BillingPostalCode,Account.BillingState,StageName,Amount from opportunity where StageName =:opportunityStage AND Amount =:oppAmount];    
                 }
               	 else if(FromDate == Null && toDate == Null && opportunityStage.isEmpty() && oppAmount.isEmpty()){
                 oppList = [select id,Name,Account.BillingCity,Account.BillingCountry,Account.BillingStreet,Account.BillingPostalCode,Account.BillingState from opportunity LIMIT 200];
                 }
                 system.debug('oppList' + oppList);                 
                 for(Opportunity opp:oppList){
                     system.debug('opp'+ opp);
                     if(opp.Account.BillingCity != null && opp.Account.BillingCountry != null && opp.Account.BillingStreet != null && opp.Account.BillingPostalCode != null && opp.Account.BillingState != null ){
                        system.debug('opp'+ opp);
                        waraperLocationMarker wlmo = new waraperLocationMarker();
                        waraperLocationMarker2 wlmo2 = new waraperLocationMarker2();
                        
                        wlmo.City = opp.Account.BillingCity;
                        wlmo.Country = opp.Account.BillingCountry;
                        wlmo.street = opp.Account.BillingStreet;
                        wlmo.PostalCode = opp.Account.BillingPostalCode;
                        wlmo.State = opp.Account.BillingState;
                        
                        wlmo2.location = wlmo;
                        wlmo2.title = opp.name;
                        wlmo2.description = 'test shahamir';
                        wlmo2.icon = 'standard:opportunity';
                        
                        waraperLocationMarkerList.add(wlmo2);
                     }
                 }
                 system.debug('waraperLocationMarkerList'+waraperLocationMarkerList);
                return waraperLocationMarkerList;
             }
          /* Shoe Shop Start */
    
    //List<waraperLocationMarker2> waraperLocationMarkerList = new List<waraperLocationMarker2>();
        
        if(selectedObj == 'Shoe Shop'){
            system.debug(selectedObj);
            if(FromDate != Null && toDate != Null){
            shoeList = [select id,Name,City__c,Country__c,Street__c,Zip_Postal_Code__c,State_Province__c,CreatedDate from Shoe_Shop__c where CreatedDate >=:FromDate AND CreatedDate <=:toDate ];
            }
            else if(FromDate == Null && toDate == Null){
                shoeList = [select id,Name,City__c,Country__c,Street__c,Zip_Postal_Code__c,State_Province__c from Shoe_Shop__c LIMIT 200];    
            }
            //else if(FromDate == Null && toDate == Null){
            //shoeList = [select id,Name,BillingCity,BillingCountry,BillingStreet,BillingPostalCode,BillingState from account LIMIT 200];
            //}
            for(Shoe_Shop__c shoe:shoeList){
                if(shoe.City__c != null && shoe.Country__c != null && shoe.Street__c != null && shoe.Zip_Postal_Code__c != null && shoe.State_Province__c != null){
                //if(acc.BillingCity != null || acc.BillingCountry != null || acc.BillingStreet != null || acc.BillingPostalCode != null || acc.BillingState != null){
                	system.debug('shoe'+shoe);
                    waraperLocationMarker wls = new waraperLocationMarker();
                    waraperLocationMarker2 wls2 = new waraperLocationMarker2();
                    
                    wls.City =shoe.City__c;
                    wls.Country = shoe.Country__c;
                    wls.street = shoe.Street__c;
                    wls.PostalCode = shoe.Zip_Postal_Code__c;
                    wls.State = shoe.State_Province__c;
                    
                    wls2.location = wls;
                    wls2.title = shoe.name;
                    wls2.description = 'test shahamir';
                    wls2.icon = 'standard:campaign';
                    
                    waraperLocationMarkerList.add(wls2);
                }
            }
            system.debug('waraperLocationMarkerList'+waraperLocationMarkerList);
            return waraperLocationMarkerList;
        }
    
    /* Shoe Shop End */

            // FOR OPPORTUNITY OBJECT END

        if(selectedObj == 'Contact'){
            system.debug(selectedObj);
        }
        if(selectedObj == 'Lead'){
            system.debug(selectedObj);
        }
        if(selectedObj == 'Opportunity'){
            system.debug(selectedObj);
        }
        if(selectedObj == 'Shoe Shop'){
            system.debug(selectedObj);
        }
        system.debug('waraperLocationMarkerList size'+waraperLocationMarkerList.size());
        system.debug('waraperLocationMarkerList'+waraperLocationMarkerList);
        return waraperLocationMarkerList;
    }    
    
    
    public class ObjectClass {
        //public string objectName {get;set;}
        @AuraEnabled public string apiName {get;set;}
        
        public objectClass() {
            //objectName = null;
            apiName = null;
        }
    }
    public class waraperLocationMarker2{
        @AuraEnabled public waraperLocationMarker location{get;set;}
        @AuraEnabled public string title{get;set;}
        @AuraEnabled public string description{get;set;}
        @AuraEnabled public string icon{get;set;}
        public waraperLocationMarker2(){
            location = null;
            title = null;
            description = null;
            icon = null;
        }
    }
    public class waraperLocationMarker{
        //@AuraEnabled public address location{get;set;}
        @AuraEnabled public string City{get;set;}
        @AuraEnabled public string Country{get;set;}
        @AuraEnabled public string PostalCode{get;set;}
        @AuraEnabled public string State{get;set;}
        @AuraEnabled public string Street{get;set;}
        public waraperLocationMarker(){
            //location = null;
            city = null;
            Country= null;
            PostalCode= null;
            State= null;
            Street= null;
        }
    }
    
    public class fieldDetailsWrapper{
        @AuraEnabled public String fieldsName {get;set;}
        @AuraEnabled public string datatypeName {get;set;}
        @AuraEnabled public String fieldApiName {get;set;}
        @AuraEnabled public List<string> values {get;set;}
        @AuraEnabled public List<string> filterValue{get;set;}
        
            
        public fieldDetailsWrapper(){
            this.fieldsName =null;
            this.datatypeName =null;
            this.fieldApiName =null;
            this.values =null;
            this.filterValue = null;
            
        }
    }
}