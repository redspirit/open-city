

export enum InputAction {LEFT, RIGHT, UP, DOWN, FIRE, PAUSE, RESET}

class Input {

    public statuses:boolean[] = [];
    public actions:any = {};
    public pressedCallback:any = function () {};
    public releasedCallback:any = function () {};

    constructor() {
        document.addEventListener('keydown', (e) => this.keydownEvent(e), false);
        document.addEventListener('keyup', (e) => this.keyupEvent(e), false);
    }

    private keydownEvent(e:any) {
        let com = this.actions[e.keyCode];
        if(typeof com !== 'undefined') {
            if(!this.statuses[com]) this.pressedCallback(com);
            this.statuses[com] = true;
        }
    }
    private keyupEvent(e:any) {
        let com = this.actions[e.keyCode];
        if(typeof com !== 'undefined') {
            this.statuses[com] = false;
            this.releasedCallback(com);
        }
    }

    public assign(code:number, command:InputAction):void {
        this.actions[code] = command;
        this.statuses[command] = false;
    };

    public isPressed(command:InputAction):boolean {
        return this.statuses[command];
    };
    public onPressed(callback:any):void {
        this.pressedCallback = callback;
    };
    public onReleased(callback:any):void {
        this.releasedCallback = callback;
    }

}

export let input:Input = new Input();