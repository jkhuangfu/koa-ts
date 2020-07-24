import * as io from 'socket.io';

const handleSocket: { [key: string]: (data: any, socket: io.Socket) => void } = {
  handleMessage: (data: any, socket: io.Socket) => {
    socket.emit('send', `消息我收到了，${data}`);
  },

  handleMessage1: (data: any, socket: io.Socket) => {
    console.log(data);
  }
};
export default handleSocket;
