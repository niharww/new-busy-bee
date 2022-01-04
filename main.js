const remote = window.require('electron').remote;
const BrowserWindow = window.require('electron').BrowserWindow;
const { Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');

function showTopBar(e){
    
    if(e.pageY < 35){
        document.getElementById('topbar').style.display = 'block';
    }
    else{
        document.getElementById('topbar').style.display = 'none';
    }
}

function openSettings(){
    let seting = document.getElementById('settings');
    seting.style.right = '0px';
    seting.style.transitionDuration = '0.2s';
    //document.getElementById('bodytag').removeEventListener('mousemove');
}

function closePopup(){
    let seting = document.getElementById('settings');
    seting.style.right = '-250px';
    seting.style.transitionDuration = '0.2s';
    //document.getElementById('bodytag').addEventListener('mousemove',showTopBar);
}

function keyup(e){
    if(e.charCode == 13){
        goToPage('local','');
    }
}

function closeApp(){
    var window = remote.getCurrentWindow();
    window.close();
    //var newwindow = remote.getCurrentWindow();
    //newwindow.close();
}

function minimizeApp(){
    var window = remote.getCurrentWindow();
    window.minimize();
}

async function goToPage(param,lin){
    //var window = remote.getCurrentWindow();
    //console.log(global.location);
    // webContents.webPreferences = {
    //     nodeIntegration : false
    // };

    if(param == 'web'){
        checkFileStatus(true,'https://rkcl.wordsworthelt.net:8080');
        document.getElementById('onlyforlocal').style.display = 'none';
        window.open('https://rkcl.wordsworthelt.net:8080', '_blank', 'nodeIntegration=no');   
        const template = [{
            label: 'File',
            submenu: [
              { role: 'close' },{ role: 'quit' }
            ]
          }];
        
          const menu = Menu.buildFromTemplate(template)
          Menu.setApplicationMenu(menu);
    }
    else{

        let links = null;
        if(param != 'history'){
            links = document.getElementById('local_link').value;
        }
        else{
            links = lin;
        }
         
        let host_port = null;

        if(links.trim()!==''){
            
            if((links.indexOf("//") != -1 && links.indexOf(":") != -1 && links.split(":").length==3) || links.trim() == 'https://rkcl.wordsworthelt.net:8080'){
                let firstSplit = links.split("//");
                host_port = firstSplit[1].split(":");

                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false
                  });

                await axios.get('https://'+host_port[0]+':'+host_port[1]+'/',{httpsAgent})
                .then((res)=>{                    
                    checkFileStatus(true,links.trim());
                    document.getElementById('srvrnot').style.display = 'none';
                    document.getElementById('validip').style.display = 'none';
                    document.getElementById('onlyforlocal').style.display = 'none';
                    window.open(links, '_blank', 'nodeIntegration=no');
                })
                .catch((err)=>{                    
                    document.getElementById('srvrnot').style.display = 'none';
                    document.getElementById('validip').style.display = 'none';
                    document.getElementById('srvrnot').style.display = 'block';
                    //alert("Server is not running");
                });
            }
            else{
                document.getElementById('srvrnot').style.display = 'none';
                document.getElementById('validip').style.display = 'none';
                document.getElementById('validip').style.display = 'block';
                //alert("Please enter valid ip");
            }
        
        }
        else{
            document.getElementById('srvrnot').style.display = 'none';
            document.getElementById('validip').style.display = 'none';
            document.getElementById('validip').style.display = 'block';
            //alert("Please enter link");
            return false;
        }
    }
}

function onlocal(){
    document.getElementById('onlyforlocal').style.display = 'block';
}

function checkFileStatus(server_on,links){

    if(server_on == true){
        if (fs.existsSync(path.join(__dirname,'.defaults'))) {
            fs.readFile(path.join(__dirname,'.defaults'), 'utf8', (err, filedata) => {
            if (err) {
                throw err;
            }
            else{
                let file_data = JSON.parse(filedata);
                if(links.trim() != 'https://rkcl.wordsworthelt.net:8080'){
                    if(file_data['connections'].indexOf(links.trim()) == -1){
                        file_data['connections'].push(links.trim());
                    }
                    file_data['last_connected'] = links.trim();
                    fs.writeFile(path.join(__dirname,'.defaults'), JSON.stringify(file_data), (err) => {
                        if(err) {
                            return console.log(err);
                        }
                    });
                } 
            }
    
            // Invoke the next step here however you like
            //console.log(content);   // Put all of the code here (not the best solution)
        });
          // Do something
      }
      else{
          let obj = {
              "connections":[],
              "created_at":Date.now(),
              "last_connected":links.trim()
          };

          if(links.trim() != 'https://rkcl.wordsworthelt.net:8080'){
              obj.connections.push(links.trim());
          }
          fs.writeFile(path.join(__dirname,'.defaults'), JSON.stringify(obj), (err) => {
            if(err) {
                return console.log(err);
            }
        });
      }
    }

}

(function(){
    if (fs.existsSync(path.join(__dirname,'.defaults'))) {
        fs.readFile(path.join(__dirname,'.defaults'), 'utf8', (err, filedata) => {
          if (err) {
              throw err;
          }
          else{
            let file_data = JSON.parse(filedata);
            let mainDiv = document.getElementById('serverlist');
            for(let ser=0; ser<file_data['connections'].length; ser++){
                let divs = document.createElement('DIV');
                divs.innerHTML = (parseInt(ser)+1)+".&nbsp;&nbsp;&nbsp;"+file_data['connections'][ser];
                divs.setAttribute('onclick',"goToPage('history','"+file_data['connections'][ser]+"')");
                divs.setAttribute('class','custom-list');
                mainDiv.appendChild(divs);
            }
            window.open(file_data['last_connected'], '_blank', 'nodeIntegration=no');
          }
    
          // Invoke the next step here however you like
          //console.log(content);   // Put all of the code here (not the best solution)
      });
          // Do something
    }

})();