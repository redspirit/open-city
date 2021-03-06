
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


        // restore from name and pass
        let userData = web.restoreParams();
        if(userData.name && userData.pass) {
            this.login(userData.name, userData.pass);
        }

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

            web.saveParams(this.name, this.pass);
            web.elementVisible('.login-form', false);
            // web.elementVisible('.go-game-button', true);

            callback && callback(data);

        });

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

class Web {


    constructor() {

        (document.querySelector('#login-button') as HTMLInputElement).onclick = () => {
            this.onClickLoginButton();
        };
        (document.querySelector('.go-game-button') as HTMLInputElement).onclick = () => {
            this.onClickJoin();
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

    public onClickJoin() {

        player.join();

    }

    public elementVisible(elem:string, visible:boolean):void {
        let classes:DOMTokenList = (document.querySelector(elem) as HTMLInputElement).classList;
        if(visible) {
            classes.remove('hide');
        } else {
            classes.add('hide');
        }
    }

    saveParams(name:string, pass:string):void {
        localStorage.setItem('player_name', name);
        localStorage.setItem('player_pass', pass);
    }

    restoreParams() {
        return {
            name: localStorage.getItem('player_name') as string,
            pass: localStorage.getItem('player_pass') as string
        };
    }

}

class WebComponents {

    private data:any;
    private components:any[] = [];

    constructor() {

        let elements = document.querySelectorAll('[data-repeat]');
        [].forEach.call(elements, (container:any) => {


            //console.log(container.firstChild);

            let tmpChild = container.firstElementChild;
            container.firstChild.remove();

            let item = {
                type: 'repeat',
                container: container,
                template: tmpChild,
                dataKey: container.getAttribute('data-repeat')
            };

            this.components.push(item);

        });

    }

    public setData(_data:any) {
        this.data = _data;
        this.refresh();
    }

    private refresh() {

        this.components.forEach((item) => {
            if(item.type === 'repeat') {
                this.dataRepeat(item);
            }
        });

    }

    private insertAfter(elem:any, refElem:any) {
        return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
    }

    private dataRepeat(item:any) {
        // обрабатываем один контейнер для коллекции

        console.log(item);

        item.container.innerHTML = '';


        if(item.dataKey in this.data && this.data[item.dataKey] instanceof Array) {

            let thisData: [any] = this.data[item.dataKey];

            let index = -1;
            thisData.forEach((itemData:any) => {
                index++;
                let newItemElement = item.template.cloneNode(true);
                let dataTexts = newItemElement.querySelectorAll('[data-text]');
                [].forEach.call(dataTexts, (dataText:any) => {
                    let attr:string = dataText.getAttribute('data-text');
                    if(attr === '$index') {
                        dataText.innerHTML = index;
                    } else {
                        dataText.innerHTML = itemData[attr];
                    }
                });
                item.container.appendChild(newItemElement);
            });

        }
    }


}


let web:Web = new Web();
let player:Player = new Player();
let webComponents:WebComponents = new WebComponents();

webComponents.setData({
    team1Collection: [{name: 'one'},{name: 'two'},{name: 'three'}],
    team2Collection: []
});

export function test() {
    console.log('Start');
}



