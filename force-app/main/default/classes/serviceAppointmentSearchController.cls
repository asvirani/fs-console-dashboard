public class serviceAppointmentSearchController {
    @AuraEnabled( cacheable = true )
    public static List<sObject> search(String searchTerm, string myObject, string myfield){
        String myQuery = null;
        if(searchTerm == null || searchTerm == ''){
            myQuery = 'Select Id, '+myfield+' from '+myObject+' Where LastModifiedDate != NULL ORDER BY LastModifiedDate DESC LIMIT  5';
        }
        else {
            myQuery = 'Select Id, '+myfield+' from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' LIMIT  5';
        }
        System.debug('My Query '+myQuery);
        List<sObject> lookUpList = database.query(myQuery);
        return lookUpList;
    }
    @AuraEnabled
    public static List<ServiceAppointment> searchServiceAppointment(Id AccountId, Date datefield){
        
        List<ServiceAppointment> serviceApp = new List<ServiceAppointment>();
        Integer day = datefield.day();
        Integer month = datefield.month(); 
        Integer year = datefield.year();
        System.debug(' Service Appointment- accountId '+AccountId+' date '+datefield);
        Datetime startDate = Datetime.newInstance(year, month, day, 00, 00, 00);
        Datetime newStartDate = startDate.addHours(-8);
        Datetime endDate = Datetime.newInstance(year, month, day, 23, 59, 59);
        Datetime newEndDate = endDate.addHours(-8);
        System.debug(newStartDate+' Service Appointment- startDate '+startDate+' endDate '+endDate+'---'+newEndDate);
        serviceApp = [SELECT Id, AppointmentNumber, Subject, AccountId,  ServiceTerritoryId, Service_Territory_Name__c, SchedStartTime,EarliestStartTime, DueDate, Status, SchedEndTime, DurationInMinutes, StatusCategory FROM ServiceAppointment where AccountId =: AccountId and SchedStartTime >=: newStartDate and SchedStartTime <=: newEndDate];
        //System.debug(DAY_ONLY(datefield));
        System.debug(' Service Appointment '+serviceApp);
        
        //and DATEVALUE(DueDate) =: DATEVALUE(datefield)  and DueDate__c =: datefield
        return serviceApp;
    }
    @AuraEnabled
    public static List<ProductItem> fetchProductlist(Integer recordCount){
        String locationId = System.Label.Location_Id;
        return [SELECT Id, Product2.Name,QuantityOnHand, Product2Id  FROM ProductItem where LocationId=:locationId ORDER BY Product2.Name];
    }

    @AuraEnabled
    public static String createProductRequest(List<ProductRequestLineItem> prodReqLine, Id recordId){
        try {

            
            String sourceLocationId = System.Label.Location_Id;
            String destinationLocationId = System.Label.destination_location_Id;

            ProductRequest prodReq = new ProductRequest(WorkOrderId = recordId, Status = 'Submitted', SourceLocationId = sourceLocationId, DestinationLocationId = destinationLocationId);

            insert prodReq;

            List<ProductRequestLineItem> prodReqLineNew = new List<ProductRequestLineItem>();

            for(ProductRequestLineItem tempProd : prodReqLine){
                if(tempProd.QuantityRequested!=null &&  tempProd.QuantityRequested > 0){
                    tempProd.Status = 'Submitted'; 
                    tempProd.WorkOrderId = recordId; 
                    tempProd.SourceLocationId = sourceLocationId;
                    tempProd.DestinationLocationId = destinationLocationId;
                    tempProd.ParentId = prodReq.Id;
                    prodReqLineNew.add(tempProd);
                }
            }

            insert prodReqLineNew;
            
            System.debug(' Product List ' + prodReqLine);
            System.debug(' recordId ' + recordId);
            return prodReq.Id;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    class ProductWrap{
        public String Id;
        public Integer quantity;
    }

    @AuraEnabled(cacheable = true)
    public static List<DemoChartSFS__mdt> fetchDemoChartSFSlist(){
        return [SELECT Id, MasterLabel, Max__c, Show_Chart__c, Type__c,Value__c FROM DemoChartSFS__mdt];
    }
}