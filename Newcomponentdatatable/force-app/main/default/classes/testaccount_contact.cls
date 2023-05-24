@isTest 
private class testaccount_contact {
    public static testMethod void  getcontact() {
        UserRole r = new UserRole(DeveloperName = 'MyCustomRole', Name = 'My Role');
        insert r;
        User u = new User(
            ProfileId = [SELECT ID From Profile WHERE name LIKE '%System Administrator%'].Id,
            FirstName = 'Test',
            LastName = 'last',
            Email = 'puser000@amamama.com',
            Username = 'puser000@amamama.com' + System.currentTimeMillis(),
            CompanyName = 'TEST',
            Title = 'title',
            Alias = 'alias',
            TimeZoneSidKey = 'America/Los_Angeles',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            UserRoleId = r.Id
        );
        
        insert u;
        system.runAs(u){
            Account testAccount = new Account();
            testAccount.Name='Test Account';
            testAccount.Website = 'https://www.aarentffoxx.com/';
            //testAccount.Data_Research_By__c = 'test';
            //testAccount.Data_Uploaded_By__c = 'testing';
            insert testAccount;
            Contact con = new Contact();
            con.FirstName = 'Test';
            con.OwnerId = u.Id;
            con.LastName = 'Demon';
            con.Email = 'Demon@gmail.com';
            con.AccountId = testAccount.Id;
            con.Appointment_Set_Date__c = date.parse('11/22/2022');
            //con.Contact_Owner_Govt__c = 'Testing';
            //con.Data_Research_By__c = 'AccTest';
            //con.Data_Uploaded_By__c = 'AccTest';
            insert con;
            account_contact.getcontact(con.Id);
        }
    }
}