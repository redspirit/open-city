(function (window, wesa) {
    'use strict';

    function OpenCity () {

        const OCConfig = Object.freeze({
            Team: {
                Null: 0,
                Player: 1,
                Enemy: 2
            },
            TileType: {
                Null: 0,
                Steel: 1,
                Woods: 2,
                Ice: 3,
                Water: 4,
                Brick: 5,
                Solid: 7
            },
            ObjectType: {
                Tank: 0,
                Stationary: 1,
                Mobile: 2
            },
            Objects: {
                LightEnemyTank: 1,
                FastEnemyTank: 2,
                PowerEnemyTank: 3,
                ArmoredEnemyTank: 4,
                PlayerTank: 10,
                Eagle: 20,
                StationaryObject: 100,
                MobileObject: 101
            },
            CollisionMatrix: [
                [true,  true,  false],
                [false, false, false],
                [true,  true,  true]
            ]
        });

        const OCReference = {
            player: null,
            eagle: null,
            enemies: [],
            enemySpawners: [],
            keyStatus: {
                up: false,
                down: false,
                left: false,
                right: false,
                fire: false
            },
            playerRespawnCount: 2,
            score: 0,
            isGameOver: false
        };

        function OCMap(desc) {
            this.scene = desc.scene;
            this.tileWidth = desc.tileWidth;
            this.tileHeight = desc.tileHeight;
            this.eagleSpawnPoint = { row: 0, col: 12 };
            this.playerSpawnPoint = { row: 0, col: 8 };
            // this.enemySpawnPoint = [
            //     { row: 24, col: 0 },
            //     { row: 24, col: 12 },
            //     { row: 24, col: 24 },
            // ];
        }

        OCMap.prototype.spawnEagle = function () {
            let w = this.width, h = this.height;
            let tw = this.tileWidth, th = this.tileHeight;
            let eagle = new OCEagle({
                team: OCConfig.Team.Null,
                position: { x: tw * (1 + this.eagleSpawnPoint.col - w / 2), y: th * (1 + this.eagleSpawnPoint.row - h / 2) }
            });
            eagle.map = this;
            eagle.armor = 0;
            this.scene.addSpriteToLayer(1, eagle.sprite);
            OCReference.eagle = eagle;
        };

        OCMap.prototype.spawnPlayer = function () {
            let w = this.width, h = this.height;
            let tw = this.tileWidth, th = this.tileHeight;
            let player = new OCTank({
                type: OCConfig.Objects.PlayerTank,
                team: OCConfig.Team.Player,
                position: { x: tw * (1 + this.playerSpawnPoint.col - w / 2), y: th * (1 + this.playerSpawnPoint.row - h / 2) },
                speed: 1
            });
            player.map = this;
            this.scene.addSpriteToLayer(1, player.sprite);
            OCReference.player = player;
        };

        OCMap.prototype.load = function (mapUrl, callback) {
            this.data = [];
            this.width = 26;
            this.height = 26;
            let self = this;
            let oReq = new XMLHttpRequest();
            oReq.onload = function(){
                self.data = this.responseText.split('\n').map(function (item) {
                    return item.split('').filter(function (a) {
                        return a !== '\r';
                    }).map(function (a) {
                        return +a;
                    });
                });
                callback();
            };
            oReq.open("get", mapUrl, true);
            oReq.send();
        };

        OCMap.prototype.reset = function () {

            let self = this;
            let w = this.width, h = this.height;                // 26, 26
            let tw = this.tileWidth, th = this.tileHeight;      // 16, 16

            let col = -1;
            let row = -1;

            this.data.forEach(function (rowData) {
                row++;
                col = -1;
                rowData.forEach(function (tile) {
                    col++;

                    let cx = tw * (col - 0.5 * (w - 1));
                    let cy = th * (0.5 * (h - 1) - row);

                    if (tile == OCConfig.TileType.Brick) {
                        let brickPos = [
                            [cx - tw / 4, cy - th / 4],
                            [cx + tw / 4, cy - th / 4],
                            [cx - tw / 4, cy + th / 4],
                            [cx + tw / 4, cy + th / 4]
                        ];
                        let brickAct = [5, 6, 6, 5];
                        for (let j = 0; j < brickPos.length; j++) {
                            let brickBit = new wesa.Sprite({
                                object: wesa.assets.storedObjects[OCConfig.Objects.StationaryObject],
                                action: brickAct[j],
                                team: 0,
                                position: { x: brickPos[j][0], y: brickPos[j][1] },
                                scale: 2
                            });
                            brickBit.collision.mode = wesa.Sprite.CollisionMode.BY_ANIMATION;
                            self.scene.addSpriteToLayer(0, brickBit);
                        }
                    };
                    if (tile == OCConfig.TileType.Steel) {
                        let steelBit = new wesa.Sprite({
                            object: wesa.assets.storedObjects[OCConfig.Objects.StationaryObject],
                            action: OCConfig.TileType.Steel,
                            team: 0,
                            position: { x: cx, y: cy },
                            scale: 2
                        });
                        steelBit.collision.mode = wesa.Sprite.CollisionMode.BY_ANIMATION;
                        self.scene.addSpriteToLayer(0, steelBit);
                    }
                    if (tile == OCConfig.TileType.Woods) {
                        self.scene.addSpriteToLayer(2, new wesa.Sprite({
                            object: wesa.assets.storedObjects[OCConfig.Objects.StationaryObject],
                            action: OCConfig.TileType.Woods,
                            team: 0,
                            position: { x: cx, y: cy },
                            scale: 2
                        }));
                    }
                    if (tile == OCConfig.TileType.Water) {
                        let waterBit = new wesa.Sprite({
                            object: wesa.assets.storedObjects[OCConfig.Objects.StationaryObject],
                            action: OCConfig.TileType.Water,
                            team: 0,
                            position: { x: cx, y: cy },
                            scale: 2
                        });
                        waterBit.collision.mode = wesa.Sprite.CollisionMode.BY_ANIMATION;
                        self.scene.addSpriteToLayer(0, waterBit);
                    }
                    if (tile == OCConfig.TileType.Ice) {
                        self.scene.addSpriteToLayer(0, new wesa.Sprite({
                            object: wesa.assets.storedObjects[OCConfig.Objects.StationaryObject],
                            action: OCConfig.TileType.Ice,
                            team: 0,
                            position: { x: cx, y: cy },
                            scale: 2
                        }));
                    }
                    if (tile == OCConfig.TileType.Solid) {
                        let solidBit = new wesa.Sprite({
                            object: wesa.assets.storedObjects[OCConfig.Objects.StationaryObject],
                            action: OCConfig.TileType.Solid,
                            team: 0,
                            position: { x: cx, y: cy },
                            scale: 2
                        });
                        self.scene.addSpriteToLayer(0, solidBit);
                        solidBit.collision.mode = wesa.Sprite.CollisionMode.BY_ANIMATION;
                    }


                })
            });

            // Draw walls
            let wallPos = [[0, th * (h + 2) / 2], [0, -th * (h + 2) / 2], [tw * (w + 2) / 2, 0], [-tw * (w + 2) / 2, 0]];
            let wallScale = [[30, 2], [30, 2], [2, 30], [2, 30]];
            let wallColl = [[tw * w / 2, th], [tw * w / 2, th], [tw, th * h / 2], [tw, th * h / 2]];
            for (let i = 0; i < wallPos.length; i++) {
                let wall = new wesa.Sprite({
                    object: wesa.assets.storedObjects[OCConfig.Objects.StationaryObject],
                    action: OCConfig.TileType.Solid,
                    team: 0,
                    position: { x: wallPos[i][0], y: wallPos[i][1] },
                    scale: { x: wallScale[i][0], y: wallScale[i][1] }
                });
                wall.collision.hurt = {
                    shape: wesa.Sprite.CollisionShape.RECT,
                    x1Relative: -wallColl[i][0],
                    x2Relative: wallColl[i][0],
                    y1Relative: -wallColl[i][1],
                    y2Relative: wallColl[i][1]
                };
                this.scene.addSpriteToLayer(0, wall);
            }

            // Clear references
            // OCReference.enemies = [];
            // OCReference.enemySpawners = [];

            // Spawn Things
            this.spawnEagle();
            this.spawnPlayer();
            // this.addEnemySpawners();

        };

        function OCEagle(desc) {
            this.sprite = new wesa.Sprite({
                object: wesa.assets.storedObjects[OCConfig.Objects.Eagle],
                action: 0,
                team: desc.team,
                position: { x: desc.position.x, y: desc.position.y },
                scale: 2
            });
            this.sprite.backref = this;
            this.sprite.collision.mode = wesa.Sprite.CollisionMode.BY_ANIMATION;
        }

        OCEagle.prototype.die = function () {
            let s = this.sprite;
            s.scene.addSpriteToLayer(3, new wesa.Sprite({
                object: wesa.assets.storedObjects[OCConfig.Objects.MobileObject],
                action: 5,
                team: 0,
                position: { x: s.position.x, y: s.position.y },
                scale: 2
            }));
            s.collision.hurt = null;
            s.changeAction(1, {
                isSmart: true,
                isImmediate: true
            });
            OCFunctions.gameOver();
        }

        function OCTank(desc) {
            let me = this;
            me.type = desc.type;
            me.speed = (desc.hasOwnProperty('speed') ? desc.speed : 1);
            me.bulletSpeed = (desc.hasOwnProperty('bulletSpeed') ? desc.bulletSpeed : 5);
            me.armor = (desc.hasOwnProperty('armor') ? desc.armor : 0);
            me.sprite = new wesa.Sprite({
                object: wesa.assets.storedObjects[me.type],
                action: 40,
                team: desc.team,
                position: { x: desc.position.x, y: desc.position.y },
                scale: 2
            });
            me.sprite.backref = this;
            // me.sprite.addAI(OCAI.Universal());
            // switch (me.type) {
            //     case OCConfig.Objects.LightEnemyTank:
            //     case OCConfig.Objects.FastEnemyTank:
            //     case OCConfig.Objects.PowerEnemyTank:
            //     case OCConfig.Objects.ArmoredEnemyTank:
            //         me.sprite.addAI(OCAI.EnemyTank());
            //         break;
            //     default:
            //         break;
            // }
            this.sprite.collision.mode = wesa.Sprite.CollisionMode.BY_ANIMATION;
            this.cooldown = 0;
        }

        return {
            Map: OCMap,
            Tank: OCTank,
            Eagle: OCEagle,
            // config: OCConfig,
            // ref: OCReference,
            // func: OCFunctions
        };


    }

    if (typeof(window.OC) === 'undefined'){
        window.OC = OpenCity();
    }

}) (window, wesa);
