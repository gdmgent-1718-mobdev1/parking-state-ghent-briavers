        //herbruikbare functie
        function getJSON(url, succesHandler, errorHandler){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json'
        xhr.open('GET', url, true)
        xhr.onload = function(){
            if(xhr.status == 200){
                var data = (!xhr.responseType)?JSON.parse(response):xhr.response;
                succesHandler && succesHandler(data)
            } else{
                errorHandler && errorHandler(xhr.status)
            }
        };
        xhr.onerror = function(){
            errorHandler && errorHandler('network Error')
        };
        xhr.send(null);
        };
        


        function timer(){ 
        //herbruikbare funcitie aanroepe 
        getJSON('https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json', 
        function(data){
// de succeshandler
            //get the container
            var searchResultsElement = document.querySelector('.parkingSlots');
            var tempStr = '';
            console.log(data);
            //loop trough each tree
            

            data.forEach(function(data) {
                let name = data.name;
                console.log(name)
                let totalCapacity = data.totalCapacity;
                let availableCapacity = data.parkingStatus.availableCapacity;
                let addon = ""
                let open = data.parkingStatus.open;

                if(sessionStorage.getItem("parkingslots"+ name) == null || sessionStorage.getItem("parkingslots"+name) == availableCapacity ){
                    addon = "<span class='equal'> = </span>"
                }else if (sessionStorage.getItem("parkingslots"+ name) > availableCapacity){
                    addon = "<span class='less'> - </span>"
                }else if (sessionStorage.getItem("parkingslots"+ name) < availableCapacity){
                    addon = "<span class='more'> + </span>"
                } 

                sessionStorage.setItem('parkingslots'+name, availableCapacity); 

                console.log(addon)

                let color =""
                                            
                if((parseInt(availableCapacity)/parseInt(totalCapacity)) > 0.50 && (open == true)){
                    color = "green";
                
                }else if((parseInt(availableCapacity)/parseInt(totalCapacity)) > 0.30 && (open == true)){
                    color = "yellow";
                    
                }else if((parseInt(availableCapacity)/parseInt(totalCapacity)) > 0.15 && (open == true)){
                    color = "orange";
                    
                }else {
                    color = "red";
                    
                }
                

                let address = data.address;
                

                if(open){
                    open = 'ja'
                }else{open = 'neen'}
               
                tempStr += 
                `
                <div class='parkingSlot ${color}'>
                    <h1>${name}</h1>
                    <p>
                     Totale capaciteit: ${totalCapacity}   <br>
                     Beschikbare capaciteit: ${availableCapacity} ${addon} <br>
                     Adress: ${address}   <br>
                     Open: ${open}   <br>
                    </p>
                </div>
                `
             
                
            }, this);
            
            //inject the tempr string into the HTML
            searchResultsElement.innerHTML = tempStr;
        },
// de Failhandler
            function(error){
                console.log(error);
            }
        );
        }

        timer();
        setInterval(timer, (10*1000));
       