# Pio-ts

ð ä¸ä¸ªæ¯ææ´æ¢ Live2D æ¨¡åç JS æä»¶ - TypeScript çæ¬

åçï¼[Dreamer-Paul/Pio](https://github.com/Dreamer-Paul/Pio)

ä¿®æ¹çï¼æ¬é¡¹ç®ä¾èµï¼ï¼[YexuanXiao/Pio](https://github.com/YexuanXiao/Pio)

ååä¸å¼å®¹åçï¼ä»æä¾ TypeScript é¨åï¼ä»¥ Apache 2.0 éæ°åå¸

ç®åè¿å¤äºå¼åé¶æ®µï¼æå¯è½ä¼æ bug

#### å¼å®¹æ§

ä»åºåç Pio.js çç¼è¯ç®æ ä¸º ES2022ï¼å¦ææå¼å®¹æ§æµè§å¨çéæ±å¯èªè¡ç¼è¯

Paul_Pio ä¸º Pio çå«å

Pio.init ä¸º Pio.Init çå«å

Pio.message ä¸º Pio.Message çå«åï¼æ³¨æï¼ä½¿ç¨æ¹å¼ææååï¼

Pio.Message(message: string | string[], time?: number)

message å¯ä¸ºå­ç¬¦ä¸²æ°ç»æèå­ç¬¦ä¸²ï¼è¥ä¸ºå­ç¬¦ä¸²åéæºæ¾ç¤ºä¸ä¸ª

message ä¸æ¯æ HTMLï¼åçæ¯æï¼ï¼time åä½ä¸ºæ¯«ç§ï¼é»è®¤ä¸ºéæºæ¾ç¤º [10, 20] ç§

### æ°å¢åè½

#### JS ç¨æ·è½»æ¾åå»ºç¯å¢

ä½¿ç¨ Pio.CreateContainerToBody(width: number, height: number) å¯ç´æ¥åå»º Pio æéæ¡ä»¶

åªéè¦åä½¿ç¨ let x = new Pio(/* args */) å³å¯ä½¿ç¨

ä½¿ç¨è¯¥æ¹æ³ä¼èªå¨è§£å³ canvas æ¨¡ç³é®é¢

#### å¬å¼æ¥å£

let x = new Paul_Pio(/* args */)

x.Hide() éè

x.Show() æ¾ç¤º

x.Init() å·æ°çæ¿å¨

x.Message('Message', 10000) åéæ¶æ¯

x.SetNextIdol() æ¥åæ¢ä¸ä¸ä¸ªæ¨¡å

#### æ§å¶æé®æ¾ç¤º

å¨åæ°åæ·»å 

button: {
    info: false,
    home: false,
    totop: false,
    info: false,
    night: false,
    skin: false
},

å¯å³é­å¯¹åºæé®ï¼å¦æææé®æ²¡å³é­åé»è®¤æ¾ç¤º

#### æ ¹æ®è®¾å¤å¤§å°èªå¨åå°å¤§å°

è¯¥åè½éè¦æ¿æ¢ css ä½¿ç¨ï¼[pio.css](https://github.com/YexuanXiao/Pio/blob/master/static/pio.css)

#### è¿åé¡¶é¨æé®

è¯¥åè½éè¦æ¿æ¢ css ä½¿ç¨ï¼[pio.css](https://github.com/YexuanXiao/Pio/blob/master/static/pio.css)

#### æ¶æ¯æå¤§ 4 è¡

è¯¥åè½éè¦æ¿æ¢ css ä½¿ç¨ï¼[pio.css](https://github.com/YexuanXiao/Pio/blob/master/static/pio.css)

#### æ´æ¹åç loadlive2d ä¿®æ­£éè¯¯

è¯¥åè½éè¦æ¿æ¢ js ä½¿ç¨ï¼[l2d.js](https://github.com/YexuanXiao/Pio/blob/master/static/l2d.js)

### å£°æ

è¯¥é¡¹ç®æ¯æ¬äººå­¦ä¹  TypeScript çç»æé¡¹ç®