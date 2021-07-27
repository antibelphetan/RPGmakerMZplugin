/*=============================================================================
 AB_Navigation.js
----------------------------------------------------------------------------
 (C)2021 misty
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/06/26
 1.0.1 2021/07/27 他スクリプトと100%競合するので修正
----------------------------------------------------------------------------
 [HP]   : http://kilisamenosekai.web.fc2.com/
 [Twitter]: https://twitter.com/mistyrain_on_tw/
 =============================================================================*/

/*:
 * @target MZ
 * @plugindesc 簡易ナビゲーションシステム
 * @base AB_FastTrabelByItem
 * @orderAfter AB_FastTrabelByItem
 * @author ミスティ
 * @url http://kilisamenosekai.web.fc2.com/
 *
 * @param NaviEnableSwitch
 * @text ナビを許可するスイッチNo
 * @desc ナビゲーションの表示を許可するスイッチ ONで許可する。
 * @default 7
 * @type number
 *
 * @param NaviMapIdVarId
 * @text ナビ先のマップIDを格納する変数No
 * @desc 目的地のマップIDを格納する変数
 * @default 15
 * @type number
 *
 * @param NaviMapXVarId
 * @text ナビ先のマップX座標を格納する変数No
 * @desc ナビ先のマップX座標を格納する変数No
 * @default 16
 * @type number
 *
 * @param NaviMapYVarId
 * @text ナビ先のマップY座標を格納する変数No
 * @desc ナビ先のマップY座標を格納する変数No
 * @default 17
 * @type number
 *
 * @param NaviFstTrvlItemIdVarId
 * @text 次の目的地を示すファストトラベルのアイテムIDを指定する変数No
 * @desc 次の目的地を示すファストトラベルのアイテムIDを指定する変数No
 * @default 18
 * @type number
 *
 * @param NaviIconIndex
 * @text ナビゲーション先に表示するアイコンのインデックス
 * @desc ナビゲーション先に表示するアイコンのインデックス
 * @default 95
 * @type number
 *
 * @param NaviIconOpacity
 * @text ナビゲーション先に表示するアイコンの透明度
 * @desc ナビゲーション先に表示するアイコンの透明度
 * @default 192
 * @type number
 *
 * @param NaviIconAdjustX
 * @text ナビゲーション先に表示するアイコンの位置を調整をずらすX座標
 * @desc ナビゲーション先に表示するアイコンの位置を調整をずらすX座標
 * @default 8
 * @type number
 *
 * @param NaviIconAdjustY
 * @text ナビゲーション先に表示するアイコンの位置を調整をずらすY座標
 * @desc ナビゲーション先に表示するアイコンの位置を調整をずらすY座標
 * @default 8
 * @type number
 *
 * @param TransferEventListLength
 * @text 場所移動イベントを判定する際、イベントコマンド何個まで見るか
 * @desc 例えば10ならイベントコマンド10個以内に場所移動コマンドがあれば、場所移動イベントと見て判定に回す
 * @default 10
 * @type number
 *
 * @param DestinationMessage
 * @text 次の目的地表示
 * @desc 次の目的地を示す
 * @default 次の目的地：
 * @type string
 *
 * @param CannotNaviMessage
 * @text ナビゲーションできないときのメッセージ
 * @desc ナビゲーションできないときのメッセージ
 * @default ※遠すぎてナビゲーションできません。
 * @type string
 *
 * @help AB_Navigation.js[簡易ナビゲーションシステム]
 *
 
 * ==============================================
 *
 * @command SetNavigation
 * @text ナビ先設定
 * @desc ナビゲーション先を設定する。
 *
 * @arg mapId
 * @text ナビ先マップID
 * @desc ナビゲーション先のマップIDを設定
 * @default 0
 * @type number
 *
 * @arg posX
 * @text ナビ先マップX座標
 * @desc ナビゲーション先のX座標を設定
 * @default 0
 * @type number
 *
 * @arg posY
 * @text ナビ先マップY座標
 * @desc ナビゲーション先のY座標を設定
 * @default 0
 * @type number
 *
 * @arg itemId
 * @text ナビ先表示アイテムID
 * @desc ナビゲーション先として表示するアイテムIDを設定
 * @default 0
 * @type number
 *
 * ==============================================
 */

 (() => {

var parameters = PluginManager.parameters('AB_Navigation');

var NAVI_ENABLE_SWITCH = parameters['NaviEnableSwitch'] ;
var NAVI_MAP_ID_VARID = parameters['NaviMapIdVarId'] ;
var NAVI_MAP_X_VARID = parameters['NaviMapXVarId'];
var NAVI_MAP_Y_VARID = parameters['NaviMapYVarId'];
var NAVI_FSTTRVLITEM_ID_VARID = parameters['NaviFstTrvlItemIdVarId'];
var NAVI_ICON_INDEX = Number(parameters['NaviIconIndex']);
var NAVI_ICON_OPACITY = Number(parameters['NaviIconOpacity']);
var NAVI_ICON_ADJUST_X = Number(parameters['NaviIconAdjustX']);
var NAVI_ICON_ADJUST_Y = Number(parameters['NaviIconAdjustY']);
var TRANSFER_EVENT_LIST_LENGTH = Number(parameters['TransferEventListLength']);
var DESTINATION_MESSAGE = parameters['DestinationMessage'];
var CANNOT_NAVI_MESSAGE = parameters['CannotNaviMessage'];

PluginManager.registerCommand("AB_Navigation", "SetNavigation", args => {
    $gameTemp.setNavigation(args.mapId,args.posX,args.posY,args.itemId);
});

Game_Temp.prototype.setNavigation = function(mapId,x,y,itemId) {
    $gameVariables.setValue(NAVI_MAP_ID_VARID,Number(mapId));
    $gameVariables.setValue(NAVI_MAP_X_VARID,Number(x));
    $gameVariables.setValue(NAVI_MAP_Y_VARID,Number(y));
    $gameVariables.setValue(NAVI_FSTTRVLITEM_ID_VARID,Number(itemId));
};

Tilemap.prototype.createNavigationLayers = function() {
    var width = this._width;
    var height = this._height;
    var margin = this._margin;
    var tileCols = Math.ceil(width / this._tileWidth) + 1;
    var tileRows = Math.ceil(height / this._tileHeight) + 1;
    var layerWidth = tileCols * this._tileWidth;
    var layerHeight = tileRows * this._tileHeight;
    this._naviBitmap = new Bitmap(layerWidth, layerHeight);
    this._naviTileLayer = new Sprite();
    this._naviTileLayer.opacity = NAVI_ICON_OPACITY;
    this._naviTileLayer.z = 99;
    this._naviTileLayer.addChild(new Sprite(this._naviBitmap));
    this.addChild(this._naviTileLayer);
};
var AB_NVGTN_Tilemap_createLayers = Tilemap.prototype._createLayers;
Tilemap.prototype._createLayers = function() {
    AB_NVGTN_Tilemap_createLayers.call(this);
    this.createNavigationLayers();

};

Spriteset_Map.prototype.drawIconToNaviBmp = function(iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    this._tilemap._naviBitmap.blt(bitmap, sx, sy, pw, ph, x, y);
};
Spriteset_Map.prototype.drawNaviText = function(text,x, y) {
    this._tilemap._naviBitmap.drawText
        (text, x, y, this._tilemap._width, 32, "left");
    
};
Spriteset_Map.prototype.drawNavigation = function(iconIndex, x, y) {
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var stX = $gameMap.displayX()*tw;
    var stY = $gameMap.displayY()*th;
    var edX = stX+(this._tilemap._width)-ImageManager.iconWidth;
    var edY = stY+(this._tilemap._height)-ImageManager.iconHeight;

    var posX = x*tw ;
    var posY = y*th ;

    if(posX < stX)
    {
        posX = stX;
    }else if(posX > edX)
    {
        posX = edX ;
    }
    if(posY < stY)
    {
        posY = stY;
    }else if(posY > edY)
    {
        posY = edY ;
    }

    posX = posX - stX + NAVI_ICON_ADJUST_X;
    posY = posY - stY + NAVI_ICON_ADJUST_Y;

    this.drawIconToNaviBmp(iconIndex
        ,posX
        ,posY
    );
};

var AB_NVGTN_Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
Spriteset_Map.prototype.initialize = function() {
    AB_NVGTN_Spriteset_Map_initialize.call(this);
    this._transferEvents = [];
    this._tempNaviItemId = 0;
    this._tempNaviIcon = 0 ;
    this._tempNaviX = 0;
    this._tempNaviY = 0;
};

Spriteset_Map.prototype.updateNavigation = function() {
    this._tilemap._naviTileLayer.opacity = NAVI_ICON_OPACITY;
    this._tilemap._naviBitmap.clear();
    if ($gameMap.isEventRunning() || (!$gameSwitches.value(NAVI_ENABLE_SWITCH))) {
        this._transferEvents = [];
        this._tempNaviIcon = 0 ;
        this._tempNaviX = 0;
        this._tempNaviY = 0;
        return ;
    }
    
    if($gameVariables.value(NAVI_MAP_ID_VARID) == 0
    || $gameVariables.value(NAVI_MAP_X_VARID) == 0
    || $gameVariables.value(NAVI_MAP_Y_VARID) == 0 ){
        return; 
    }

    if($gameVariables.value(NAVI_MAP_ID_VARID) == $gameMap.mapId()) {
        this.drawNavigation(
            NAVI_ICON_INDEX,
            $gameVariables.value(NAVI_MAP_X_VARID),
            $gameVariables.value(NAVI_MAP_Y_VARID)
        );      
    }else{
        if($gameVariables.value(NAVI_MAP_ID_VARID) != this._tempNaviIcon 
        && $gameVariables.value(NAVI_MAP_X_VARID) != this._tempNaviX 
        && $gameVariables.value(NAVI_MAP_Y_VARID) != this._tempNaviY ){
            this._tempNaviIcon = $gameVariables.value(NAVI_MAP_ID_VARID) ;
            this._tempNaviX = $gameVariables.value(NAVI_MAP_X_VARID);
            this._tempNaviY = $gameVariables.value(NAVI_MAP_Y_VARID);
            this._transferEvents = $gameMap.getTransferEvents($gameVariables.value(NAVI_MAP_ID_VARID));
        }
        if(this._transferEvents.length == 0){
            if($gameVariables.value(NAVI_FSTTRVLITEM_ID_VARID) == 0){
                this.drawNaviText(CANNOT_NAVI_MESSAGE,0,0);
            }else{
                var item = $dataItems[$gameVariables.value(NAVI_FSTTRVLITEM_ID_VARID)];
                this.drawNaviText(DESTINATION_MESSAGE+item.name,0,0);
            }
        }else{
            if($gameVariables.value(NAVI_FSTTRVLITEM_ID_VARID) != 0){
                var item = $dataItems[$gameVariables.value(NAVI_FSTTRVLITEM_ID_VARID)];
                this.drawNaviText(DESTINATION_MESSAGE+item.name,0,0);
                for( var i = 0 ; i < this._transferEvents.length ; i++ ){
                    this.drawNavigation(
                        NAVI_ICON_INDEX,
                        this._transferEvents[i].x ,
                        this._transferEvents[i].y
                    )
                }
            }
        }

    }
}

Game_Event.prototype.getTransferTo = function(){
    var list = this.list();
    var listMax = TRANSFER_EVENT_LIST_LENGTH;

    if(list.length < TRANSFER_EVENT_LIST_LENGTH){
        listMax = list.length;
    }

    for( var i = 0 ; i < listMax ; i++ ){
        if(list[i].code == 201){
            if (list[i].parameters[0] === 0) {
                return list[i].parameters[1];
            } else {
                return $gameVariables.value(list[i].parameters[1]);
            }
        }
    }
    return undefined;
}

Game_Map.prototype.getTransferEvents = function(mapId) {
    transferEvents = [];
    for (const event of this.events()) {
        var transferTo = event.getTransferTo() ;
        if(transferTo == mapId){
            transferEvents.push(event); 
        }
    }
    return transferEvents;
};

var AB_NVGTN_Spriteset_Map_updateTilemap = Spriteset_Map.prototype.updateTilemap;
Spriteset_Map.prototype.updateTilemap = function() {
    AB_NVGTN_Spriteset_Map_updateTilemap.call(this);
    this.updateNavigation();
};
var AB_NVGTN_Window_FastTravelList_drawFastTravelName = Window_FastTravelList.prototype.drawFastTravelName;
Window_FastTravelList.prototype.drawFastTravelName = function(item, x, y, width) {
    AB_NVGTN_Window_FastTravelList_drawFastTravelName.call(this,item,x,y,width);
    if (item) {
        if(item.id == $gameVariables.value(NAVI_FSTTRVLITEM_ID_VARID)){
            this.drawIcon(NAVI_ICON_INDEX,x,y);
        }
    }
};
var AB_NVGTN_Window_QuestList_drawQuestName = Window_QuestList.prototype.drawQuestName;
Window_QuestList.prototype.drawQuestName = function(item, x, y, width) {
    AB_NVGTN_Window_QuestList_drawQuestName.call(this,item,x,y,width);
    if (item) {
        if(item.meta.questFastTrabelId != undefined){
            if(item.meta.questFastTrabelId == $gameVariables.value(NAVI_FSTTRVLITEM_ID_VARID)){
                this.drawIcon(NAVI_ICON_INDEX,x,y);
            }
        }
    }
};
var AB_NVGTN_Scene_Quest_onConfirmOk = Scene_Quest.prototype.onConfirmOk;
Scene_Quest.prototype.onConfirmOk = function() {
    if(this._confirmWindow.index() == 0)
    {
        var selected = this.item();
        if(selected.meta.questFastTrabelId != undefined){
            if($gameParty.isQuestOccurrence(selected.id) && selected.meta.questOccurrenceWarp){
                var questWarp = selected.meta.questOccurrenceWarp.split(",");
                $gameTemp.setNavigation(
                    Number(questWarp[0])
                    , Number(questWarp[1])
                    , Number(questWarp[2])
                    , Number(selected.meta.questFastTrabelId));
                SceneManager.goto(Scene_Map);   
            }else if($gameParty.isQuestReceive(selected.id) && selected.meta.questReceiveWarp){
                var questWarp = selected.meta.questReceiveWarp.split(",");
                $gameTemp.setNavigation(
                    Number(questWarp[0])
                    , Number(questWarp[1])
                    , Number(questWarp[2])
                    , Number(selected.meta.questFastTrabelId));
                SceneManager.goto(Scene_Map);   
            }
        }else{
            AB_NVGTN_Scene_Quest_onConfirmOk.call(this);
        }
    }else{
        this.onConfirmCancel();
    }
};

})();