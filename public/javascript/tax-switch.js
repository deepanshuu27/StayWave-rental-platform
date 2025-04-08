
                  // functionality fr switch tax button

                  
                  let taxSwitch = document.getElementById("flexSwitchCheckDefault");
                  taxSwitch.addEventListener("click",()=>{
                
                      let taxInfo = document.getElementsByClassName("tax-info");
                      console.log(taxInfo);
              
                       for(info of taxInfo){                         // here we use loop bcs taxInfo contains  info of all italic listing part
                                                               
                          if(info.style.display != "inline"){
                          info.style.display = "inline";
                          }
              
                          else{
                          info.style.display= "none";
                      }
              
                  }
              });
              