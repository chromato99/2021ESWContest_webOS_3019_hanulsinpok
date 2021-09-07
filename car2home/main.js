window.onload = function() {
    var bridge = new WebOSServiceBridge();
    /*
     *  getTimeApi calls gettime of systemservice, a module in the platform.
     */
    var getTimeApi = 'luna://com.webos.service.systemservice/clock/getTime';
    var getTimeParams = '{}';

    /*
     *  helloApi calls the hello method of js_service template provided by CLI.
     *  In this case, the service name is used as default name "com.domain.app.service" is.
     *  If you change this service name, you need to change the service name of the following API.
     *
     *  If you change the name to helloparmas as you want, the contents will be reflected on the screen.
     */
    
    function getTime_callback(msg){
        var arg = JSON.parse(msg);
        if (arg.returnValue) {
            console.log("[APP_NAME: example web app] GETTIME_SUCCESS UTC : " + arg.utc);
            //webOSSystem.PmLogString(6, "GETTIME_SUCCESS", '{"APP_NAME": "example web app"}', "UTC : " + arg.utc);
        }
        else {
            console.error("[APP_NAME: example web app] GETTIME_FAILED errorText : " + arg.errorText);
            //webOSSystem.PmLogString(3, "GETTIME_FAILED", '{"APP_NAME": "example web app"}', "errorText : " + arg.errorText);
        }
    }


    var turnOnApi = 'luna://com.hanulsinpok.app.car2home.service/turnOn';
    var turnOnParams = '';
    function turnOn_callback(msg){
        var arg = JSON.parse(msg);
        if (arg.returnValue) {
            document.getElementById(arg.device_name + "button").innerHTML = arg.device_name + ": On";
            console.log("[APP_NAME: car2home] CALL_TURN_ON_SUCCESS response : " + arg.response);
            //webOSSystem.PmLogString(6, "CALLHELLO_SUCCESS", '{"APP_NAME": "example web app"}', "response : " + arg.Response);
        }
        else {
            console.error("[APP_NAME: car2home] CALL_TURN_ON_FAILED errorText : " + arg.error);
            //webOSSystem.PmLogString(3, "CALLHELLO_FAILED", '{"APP_NAME": "example web app"}', "errorText : " + arg.errorText);
        }
    }

    function assistant_callback(msg){
        var arg = JSON.parse(msg);
        if (arg.response.displayText) {
            document.getElementById("txt_msg").innerHTML += arg.response.displayText;
            console.log("[APP_NAME: car2home] CALL_TURN_ON_SUCCESS response : " + arg.response.displayText);
            //webOSSystem.PmLogString(6, "CALLHELLO_SUCCESS", '{"APP_NAME": "example web app"}', "response : " + arg.Response);
        }
        else {
            if(arg.response.partial) {
                document.getElementById("txt_msg").innerHTML += arg.response.partial;
                console.log("[APP_NAME: car2home] CALL_TURN_ON_SUCCESS response : " + arg.response.partial);
            } else {
                console.error("[APP_NAME: car2home] CALL_TURN_ON_FAILED errorText : " + arg);
                //webOSSystem.PmLogString(3, "CALLHELLO_FAILED", '{"APP_NAME": "example web app"}', "errorText : " + arg.errorText);
            }
        }
    }

    bridge.onservicecallback = getTime_callback;
    bridge.call(getTimeApi, getTimeParams);

    bridge.onservicecallback = (msg) => {
        var arg = JSON.parse(msg);
        console.log(arg);
    };
    bridge.call(`luna://com.webos.service.ai.voice/start`, '{"mode": "continuous", "keywordDetect": true}');
    bridge.onservicecallback = assistant_callback;
    bridge.call(`luna://com.webos.service.ai.voice/getResponse`, '{"subscribe": true}');


    /* document.getElementById("TV_button").onclick = function(e) {
        turnOnParams = '{"device_name":"TV"}';
        bridge.onservicecallback = turnOn_callback;
        bridge.call(turnOnApi, turnOnParams);
    }; */

}