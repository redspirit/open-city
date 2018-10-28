
// import * as socketIO from "socket.io-client";


export default class Client {

    public socket: any;

    constructor() {

        this.socket = io.connect('',{ query: "id=1234567" });

        this.socket.on('connect', () => {

            console.log('Socket connected');

        });


    }


}