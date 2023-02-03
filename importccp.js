// 履歴オブジェクト
let contacts = [];
// 接続中のコンタクト情報
let currentContact;

connect.agent( agent => {
    login_agent = agent; //エージェントオブジェクトを取得
});

//コンタクトイベントのサブスクライブ設定
connect.contact(function(contact) {

    if (contact.getActiveInitialConnection() && contact.getActiveInitialConnection().getEndpoint()) {
        //const conn = contact.getActiveInitialConnection();

        // 電話番後を取得
        const phoneNumber = contact.getActiveInitialConnection().getEndpoint().phoneNumber;
        //const contactId = contact.getContactId();

        // コンタクト開始（履歴用のオブジェクトを生成）
        currentContact = new Contact(phoneNumber);

        contact.onEnded(function(contact) {
            console.log("onEnded");
            if(contact.contactData == undefined){
                // コンタクト終了（履歴用のオブジェクトに終了を記録）
                currentContact.end(); 
                contacts.push(currentContact);
                // 履歴の表示更新
                refresh(contacts);
            }
        }); 

        contact.onConnected(function() {
            // コンタクト接続（履歴用のオブジェクトに接続を記録）
            currentContact.connected();
        });
    }
});

// 履歴用オブジェクト（１通話分）
class Contact {
    // 発信開始でオブジェクトを生成する
    constructor(phoneNumber) {
        this._phoneNumber = phoneNumber.split(':')[1].split('@')[0];
        this._startTime = new Date(); 
    }

    end() {
        this._endTime = new Date();
    }

    connected() {
        this._connectedTime = new Date();
    }

    display() {
        const phone = this._phoneNumber;
        const day = this.parseDate(this._startTime);
        const start = this.parseTime(this._startTime);
        const end = this.parseTime(this._endTime);

        if(this._connectedTime) { // 接続された場合
            const connected = this.parseTime(this._connectedTime);
            return ' 【通話】 ' + phone + ' ' + day + ' ' + connected + ' - ' + end;
        }
        return '【不在】 ' + phone + ' ' + day + ' ' + start;
    }

    parseDate(dt) {
        const y = ('0000' + dt.getFullYear()).slice(-4);
        const m = ('00' + (dt.getMonth() + 1)).slice(-2);
        const d = ('00' + (dt.getDate() + 1)).slice(-2);
        return y + '/' + m + '/' + d; 
    }

    parseTime(dt) {
        const h = ('00' + (dt.getHours() + 1)).slice(-2);
        const m = ('00' + (dt.getMinutes() + 1)).slice(-2);
        const s = ('00' + (dt.getSeconds() + 1)).slice(-2);
        return h + ':' + m + ':' + s; 
    }
}

// 履歴オブジェクトによる表示更新
// function refresh(contacts) {
//     $('ol').empty();
//     for(var i=0; i<contacts.length; i++) {
//         $('ol').append('</p>')
//         <li onclick="call('+ i +')">' + contacts[i].display() + '</li>
            
//     }
// }
//     for(var i=0; i<contacts.length; i++) {
//         $('ol').append('</p>')
//             <li onclick="call('+ i +')">' + contacts[i].display() + '</li>
//             <p>');
//     }
// }

// 発信
function call(n) {
    const phoneNumber = contacts[n]._phoneNumber

    var result = window.confirm(phoneNumber + 'に発信しますか？');

    if( result ) {
        var endpoint = connect.Endpoint.byPhoneNumber(phoneNumber);
        login_agent.connect(endpoint,{
            success: () => {
                console.log("Connect Success");
            },
            failure: () => {
                console.log("Connect Failed");
            }
        });
    }
}
