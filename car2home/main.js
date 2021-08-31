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

    // 웹 서버를 접속한다.
    //<!-- "0.0.0.0" => 서버 pc에 ip 주소를 입력해준다. -->
    //<!-- 0000 => 서버 pc에 포트를 입력 해 준다.-->
    var webSocket = new WebSocket("ws://14.35.102.218:3000");
    // 웹 서버와의 통신을 주고 받은 결과를 출력할 오브젝트를 가져옵니다.
    var messageTextArea = document.getElementById("messageTextArea");
    // 소켓 접속이 되면 호출되는 함수
    webSocket.onopen = function (message) {
        messageTextArea.value += "Server connect...\n";
    };
    // 소켓 접속이 끝나면 호출되는 함수
    webSocket.onclose = function (message) {
        messageTextArea.value += "Server Disconnect...\n";
    };
    // 소켓 통신 중에 에러가 발생되면 호출되는 함수
    webSocket.onerror = function (message) {
        messageTextArea.value += "error...\n";
    };
    // 소켓 서버로 부터 메시지가 오면 호출되는 함수.
    webSocket.onmessage = function (message) {
        // 출력 area에 메시지를 표시한다.
        messageTextArea.value += "Recieve From Server => " + message.data + "\n";
    };
    // 서버로 메시지를 전송하는 함수
    function sendMessage() {
        var message = document.getElementById("textMessage");
        messageTextArea.value += "Send to Server => " + message.value + "\n";
        //웹소켓으로 textMessage객체의 값을 보낸다.
        webSocket.send(message.value);
        //textMessage객체의 값 초기화
        message.value = "";
    }
    function disconnect() {
        webSocket.close();
    }

}