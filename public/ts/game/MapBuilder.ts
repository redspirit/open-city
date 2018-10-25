import Container from "../engine/Container";
import Rect from "../engine/geometry/Rect";
import Point from "../engine/geometry/Point";
import {containers} from "../engine/Containers";

class MapBuilder {

    public buildFromFile(url:string) {
        this.loadFromFile(url, (map:any) => {
            this.buildFromMap(map);
        });
    }

    public buildFromMap(map:any) {

        let cols:number = -1;
        let rows:number = -1;

        map.forEach(function (row:number[]) {
            rows += 1;
            cols = -1;
            row.forEach(function (index:number) {
                cols += 1;

                let x:number = cols * 16 + 32;
                let y:number = rows * 16 + 32;

                if(index === 1) {
                    //new self.BricksBlock(x, y);
                }

                if(index === 2) {
                    new Container(new Rect(x, y, 16, 16))
                        .addSprite(1, 'iron', [new Point(0, 0)])
                        .setCollisionGroup('block');
                }

                if(index === 3) {
                    new Container(new Rect(x, y, 16, 16))
                        .addSprite(1, 'grass', [new Point(0, 0)])
                        .setZIndex(15);
                }

                if(index === 4) {
                    new Container(new Rect(x, y, 16, 16))
                        .addSprite(1, 'ice', [new Point(0, 0)]);
                }

                if(index === 5) {
                    new Container(new Rect(x, y, 16, 16))
                        .addSprite(1, 'water', [new Point(0, 0)])
                        .spriteState(1, 'idle')
                        .setCollisionGroup('block')
                        .setName('water');
                }

                if(index === 6) {
                    new Container(new Rect(x, y, 16, 16))
                        .addSprite(1, 'eagle', [new Point(0, 0)])
                        .spriteState(1, 'live')
                        .setCollisionGroup('block');
                }


            });

        })

    }


    private loadFromFile(mapUrl:string, cb:any) {
        if(!mapUrl)
            return console.error('Map URL not defined!');
        let map:any = [];
        let oReq = new XMLHttpRequest();
        oReq.onload = () => {
            map = oReq.responseText.split('\n').map((item:string) => {
                return item.split('').filter((a:string) => {
                    return a !== '\r';
                }).map((a:string) => {
                    return parseInt(a);
                });
            });
            cb && cb(map);
        };
        oReq.open("get", mapUrl, true);
        oReq.send();
    }

}

export let mapBuilder:MapBuilder = new MapBuilder();