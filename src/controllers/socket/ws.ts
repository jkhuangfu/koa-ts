import { server, IMessage, request } from 'websocket';
export default (app: any) => {
  const wsServer = new server({
    httpServer: app,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });
  // 此方法是设置允许连接本 websocket的ip或者域名
  function originIsAllowed(origin: string) {
    console.log(origin);
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }

  wsServer.on('request', (req: request) => {
    if (!originIsAllowed(req.origin)) {
      // Make sure we only accept requests from an allowed origin
      req.reject();
      console.log(new Date() + ' Connection from origin ' + req.origin + ' rejected.');
      return;
    }
    console.log(req.key, req.listeners('message'));

    const connection = req.accept('huangfu', req.origin);
    // console.log(new Date() + ' Connection accepted.');
    connection.on('message', (message: IMessage) => {
      console.log(JSON.parse(JSON.stringify(message)));
      if (message.type === 'utf8') {
        // @ts-ignore
        console.log('接收的: ' + JSON.parse(message.utf8Data).fn);
        connection.send('lalalal');
      } else if (message.type === 'binary') {
        // console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData || Buffer.from(''));
      }
    });
    connection.on('close', (reasonCode, description) => {
      console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });
};
