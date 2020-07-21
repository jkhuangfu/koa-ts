import * as io from 'socket.io';
import * as url from 'url';
export default (app: any) => {
  const scoket = io(app);
  scoket.on('connection', (socket: io.Socket) => {
    const roomId = url.parse(socket.request.url, true).query.roomId || '0';
    if (roomId !== 'undefind' || roomId !== undefined) {
      socket.join(roomId, (err: any) => {
        // console.log(err);
        console.log(roomId, '加入房间');
        socket.emit('add', roomId);
      });
    }
    socket.on('post', (arg: any) => {
      console.log('当前房间ID:', Object.keys(socket.rooms)[0]);
      console.log('接收参数：', arg);
      socket.to('234').emit('send', `消息我收到了，${arg}`);
    });
    socket.on('say', (d: any) => {
      console.log(d);
    });
    socket.on('disconnect', () => {
      // 这里监听 disconnect，就可以知道谁断开连接了
      const roomid = url.parse(socket.request.url, true).query.roomId || '0';

      console.log('disconnect: ' + socket.id);
      socket.leave(roomid as string);
    });
  });
};
