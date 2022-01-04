const { app, BrowserWindow,webContents,Menu } = require('electron');
//const si = require('systeminformation');
const fs = require('fs');
//var geoip = require('geoip-lite');
//const publicIp = require('public-ip');
const axios = require('axios');
const path = require('path');
 
app.commandLine.appendSwitch("ignore-certificate-errors", "true");
app.commandLine.appendSwitch("allow-insecure-localhost", "true");

let win, child

async function createWindow () {
  
  //let publicIP = await publicIp.v4();
  //var geo = geoip.lookup(publicIP);

  //console.log(geo);
  win = new BrowserWindow({
    width: 800,
    height: 600,
    kiosk:true,
    webPreferences: {
      nodeIntegration: false
    }
  });
  // const template = [{
  //   label: 'File',
  //   submenu: [
  //     { role: 'close' },{ role: 'quit' }
  //   ]
  // }];

  //const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(null);
  //win.setMenu(null);
  win.show();
  win.loadURL('https://192.168.11.21:8080/');
  // let chassis = await si.chassis();
  // let os = await si.osInfo();
  // let networkInterfaceDefault = await si.networkInterfaceDefault();
  // let networkInterfaces = await si.networkInterfaces();
  // let graphics = await si.graphics();
  // let network_info = {};
  // let displays = {};
  // let osinfo = {};
  // let app_id = null;
  // let macid = null;
  // let initial = null;
  // if (graphics.displays[0]) {
  //     displays.currentResX = graphics.displays[0].currentResX;
  //     displays.currentResY = graphics.displays[0].currentResY;
  // }
  // osinfo = {
  //   platform: os.platform,
  //   distro: os.distro,
  //   release: os.release,
  //   kernel: os.kernel,
  //   arch: os.arch,
  //   hostname: os.hostname
  // };
  // networkInterfaces.forEach(x => {
  //     if (x.iface === networkInterfaceDefault && x.type === 'wired') {
  //       network_info ={
  //         ip4 : x.ip4,
  //         ip6 : x.ip6,
  //         mac : x.mac
  //       }  
  //       macid = x.mac;
  //     }
  // });
  
  // if (fs.existsSync('.my_site_info')) {
  //   fs.readFile('.my_site_info', 'utf8', (err, data) => {
  //     if (err) {
  //         throw err;
  //     }
  //     content = data;
  //     initial = false;
  //     // Invoke the next step here however you like
  //     console.log(content);   // Put all of the code here (not the best solution)
  // });
  //     // Do something
  // }
  // else{
  //   initial = true;
  //   // if(initial == false){
  //   //     let app_info = await axios({
  //   //       method: 'get',
  //   //       url: 'http://192.168.1.66:3000/getAppInfo/'+macid
  //   //     })
  //   //     //console.log("wwwwww",JSON.stringify(app_info.data.data));
  //   //     fs.writeFile(".my_site_info", JSON.stringify(app_info.data.data), (err) => {
  //   //       if(err) {
  //   //           return console.log(err);
  //   //       }
  //   //   }); 
  //   // }
  // }
  
  // let obj = {
  //   key:'Busy-Bee',
  //   network_info: JSON.stringify(network_info),
  //   chassis: chassis.type,
  //   displays: JSON.stringify(displays),
  //   os: JSON.stringify(osinfo),
  //   app_type: 'client-app',
  //   initial:initial
  // }
  
  //win.loadURL('https://bare.wordsworthelt.net',{
  // win.loadURL('https://bare.wordsworthelt.net',{
  //     userAgent: JSON.stringify(obj)
  // });
  
  // win.webContents.openDevTools()

  // setTimeout(async ()=>{
  //   if(initial == true){
  //     let app_info = await axios({
  //       method: 'get',
  //       url: 'http://192.168.1.66:3000/getAppInfo/'+macid
  //     })
  //     //console.log("wwwwww",JSON.stringify(app_info.data.data));
  //     fs.writeFile(".my_site_info", JSON.stringify(app_info.data.data), (err) => {
  //       if(err) {
  //           return console.log(err);
  //       }
  //   }); 
  //   initial = false;
  // }
  // },1000);
  

  win.on('closed', () => {
    win = null;
  });
  win.onbeforeunload =  () => {
  }
}

app.on('ready', createWindow);
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  console.log('certificate-error', error)
  event.preventDefault()
})

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
