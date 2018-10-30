
// import * as socketIO from "socket.io-client";


export default class Client {

    public socket: any;

    constructor() {




    }

    public connect(id:string) {

        this.socket = io.connect('',{ query: "id=" + id });

        this.socket.on('connect', () => {

            console.log('Socket connected');

        });

        this.socket.on('disconnect', () => {

            console.log('Socket DISconnected');

        });

    }


}