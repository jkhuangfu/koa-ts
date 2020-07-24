import * as io from 'socket.io';
import { Server } from 'http';
import Socket from './controllers';

export default (server: Server) => {
  const ws = io(server).of('/socket');
  ws.on('connection', async (socket: io.Socket) => {
    // const { roomId = 'default' } = url.parse(socket.request.url, true).query;
    // // 从redis中获取所有房间
    // const redisRooms = await redisDb.get('socket_rooms');
    // LOG4.http.info(`已存在的socketRooms：${redisRooms}`);
    // const result = JSON.parse(redisRooms as string);
    // if (!redisRooms) {
    //   await redisDb.set('socket_rooms', JSON.stringify([roomId]));
    // } else {
    //   // 判断已存在的房间是否包含当前进入的房间
    //  !result.includes(roomId) && (await redisDb.set('socket_rooms', JSON.stringify([...result, roomId])));
    // }
    // socket.join(roomId as string, (err: any) => {
    //   // console.log(err);
    //   console.log(roomId, '---加入房间---test');
    // });
    socket.on('post', (arg: { data: any; method: string }) => {
      Socket[arg.method](arg.data, socket);
    });
    socket.on('disconnect', () => {
      // 这里监听 disconnect，就可以知道谁断开连接了
      console.log('disconnect: ' + socket.id);
    });
  });
};
