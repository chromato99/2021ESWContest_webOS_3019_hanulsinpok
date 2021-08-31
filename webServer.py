########################
# Server

import asyncio              # 웹 소켓 모듈을 선언한다.
import websockets           # 클라이언트 접속이 되면 호출된다.

async def accept(websocket, path):
    while True:
        data = await websocket.recv();# 클라이언트로부터 메시지를 대기한다.
        print("receive : " + data);
        await websocket.send("ws_srv send data = " + data);# 클라인언트로 echo를 붙여서 재 전송한다.
        
# "0.0.0.0" => 서버 pc에 ip 주소를 입력해준다.
# 0000 => 서버 pc에 포트를 입력 해 준다.
start_server = websockets.serve(accept, "localhost", 3000);

# 비동기로 서버를 대기한다.
asyncio.get_event_loop().run_until_complete(start_server);
asyncio.get_event_loop().run_forever();
########################