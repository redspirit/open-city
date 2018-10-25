
export class Loader {

    private configUrl:string = '';
    private loadedCallback:any;
    public configData: any;

    public load(url:string, callback:any):void {
        this.configUrl = url;
        this.loadConfigFile(() => {
            this.loadBitmaps( () => {
                callback(this.configData);
            });
        });
    }

    private loadConfigFile(cb:any):void {
        let oReq = new XMLHttpRequest();
        oReq.onload = () => {
            this.configData = JSON.parse(oReq.responseText);
            cb && cb()
        };
        oReq.open("get", this.configUrl, true);
        oReq.send();
    }

    private loadBitmaps(cb:any):void {

        let loadedCount:number = 0;
        let total:number = this.configData.bitmaps.length;

        this.configData.bitmaps.forEach((bitmap:any) => {
            bitmap.img = new Image();
            bitmap.img.addEventListener("load", () => {
                loadedCount++;
                if(loadedCount === total) {
                    cb();
                }
            }, false);
            bitmap.img.src = bitmap.url;
        });

    }

}

export let loader:Loader = new Loader();