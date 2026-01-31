Immutable Audit Log Management System is the motive. so, this project is a about the sending the request
to the manager(admin) regarding the change in code. so once user send anything it will be immutable for
the user. 


login
     |
     |------> email
     |------> password
        |
        |
        |
       \/
--------------------------------------------------------------    
users
     |------->id         
     |------->firstname          
     |------->lastname       
     |------->role         ('USER','ADMIN') 
     |------->username  
     |------->email
     |------->password            
     |------->bio 

        |
        |
        |
       
ADMIN
     |------->id
     |------->user_id
     |------->role     
     |------->privileges
     |------->created_at     
     |------->created_by


-------------------------------------------------------------------------------------

API's used in this project

1) /users/signup	
2) /users/login	
3) /change-request/create	
4) /change-request/my-requests	
5) /change-request/my-pending-requests	
6) /change-request/manager-my-requests	
7) /change-request/manager-my-pending-requests








