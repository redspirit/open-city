
import Client from "./net/client";
let client = new Client();


class HTTP {

    static get(url:string, callback:any) {

        let oReq = new XMLHttpRequest();
        oReq.onload = () => {
            callback(JSON.parse(oReq.responseText));
        };
        oReq.open("get", url, true);
        oReq.send();

    }

    static post(url:string, data: any, callback:any) {

        let oReq = new XMLHttpRequest();
        oReq.onload = () => {
            callback(JSON.parse(oReq.responseText));
        };
        oReq.open("POST", url);
        oReq.setRequestHeader("Content-Type", "application/json");
        oReq.send(JSON.stringify(data));

    }

}

class Player {
    name: string = '';
    pass:string = '';
    id:string = '';
    isAuth: boolean = false;
    isAdmin: boolean = false;

    constructor() {

        this.localRestore();

    }


    public login(name:string, pass: string, callback:any = null):void {

        if(this.isAuth)
            return alert('Уже залогинен!');

        let form = {
            name: name,
            pass: pass
        };

        HTTP.post('/api/game/login', form, (data:any) => {

            if(data.error === 'wrong_pass')
                return alert('Это имя игрока уже занято');

            if(data.error)
                return alert('Error: ' + data.error);

            this.isAuth = true;
            this.name = name;
            this.pass = pass;
            this.id = data._id;
            this.isAdmin = data.isAdmin;

            client.connect(this.id);

            this.localSave();

            callback && callback(data);

        });

    }

    localSave():void {
        if(!this.isAuth) return;
        localStorage.setItem('player_name', this.name);
        localStorage.setItem('player_pass', this.pass);
    }

    localRestore():void {
        let name:string = localStorage.getItem('player_name') as string;
        let pass:string = localStorage.getItem('player_pass') as string;

        if(!name || !pass) return;

        this.login(name, pass);
        console.log('Login from local');

    }

    join() {
        if(!this.isAuth)
            return false;


        HTTP.post('/api/game/join', {player: this.id}, (session:any) => {

            if(session.error)
                return alert('Error: ' + session.error);

            console.log('Session', session);

        });

    }

}

let player:Player = new Player();

export default class Web {


    constructor() {

        (document.querySelector('#login-button') as HTMLInputElement).onclick = () => {
            this.onClickLoginButton();
        }

    }

    public getNamePass() {
        let name:string = (document.querySelector('#login-name') as HTMLInputElement).value;
        let pass:string = (document.querySelector('#login-password') as HTMLInputElement).value;
        return {
            name: name,
            pass: pass
        }
    }

    public onClickLoginButton() {

        let form = this.getNamePass();

        if(!form.name)
            return alert('Надо указать имя');

        if(!form.pass)
            return alert('Надо указать пароль');

        player.login(form.name, form.pass);

    }


}





