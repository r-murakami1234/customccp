// Amazon Connect Streams APIの初期化処理
function init() {
    // CCPのURL (Connectインスタンス名の部分を御自身のものに置き換えてください)
    var instanceURL = "https://test-dev-001.my.connect.aws/ccp-v2";

    var ccpDiv = document.getElementById("ccp");
    var nameDiv = document.getElementById("name");
    var phoneDiv = document.getElementById("phone");
    var agentNumberDiv = document.getElementById("agentNumber");
    var queueDiv = document.getElementById("queue");
    var availableAgentDiv = document.getElementById("availableAgent");

    // CCPの初期化
    connect.core.initCCP(ccpDiv, {
        ccpUrl: instanceURL,          // CCPのURLを指定 (必須項目)
        loginPopup: true,             // 必要時にログインダイアログを自動的にポップアップする
        loginPopupAutoClose: true,    // ログイン後にログインダイアログを自動的に閉じる
        loginOptions: {               // ログインダイアログをポップアップする際の設定
            autoClose: true,
            height: 750,
            width: 400,
            top: 0,
            left: 0
        },
        softphone: {                      // ソフトフォンの設定
            allowFramedSoftphone: true    // ソフトフォンのコンポーネントをiframeで埋め込むことを許可する
        }
    });

    // イベントサブスクリプション
    // Contactイベント
    connect.contact(function (contact) {
        // 着信または発信が発生した時のイベント
        contact.onConnecting(function (contact) {
            // 着信時の場合のみ
            if (contact.isInbound()) {
                console.log('通話着信: contactId =' + contact.getContactId() + '\n');
                // コンタクト属性から「名前」「電話番号」「ダイヤル番号」「窓口名」「転送可能エージェント」の値を取得する
                var attributeMap = contact.getAttributes();
                var customerName = attributeMap["CustomerName"]["value"];
                var phoneNumber = attributeMap["PhoneNumber"]["value"];
                var agentNumber = attributeMap["agentNumber"]["value"];
                var queue = attributeMap["queue"]["value"];
                var availableAgent = attributeMap["availableAgent"]["value"];

                console.log('コンタクト属性を取得: customerName = \"' + customerName + '\"\n');
                console.log('コンタクト属性を取得: phoneNumber = \"' + phoneNumber + '\"\n');
                console.log('コンタクト属性を取得: agentNumber = \"' + agentNumber + '\"\n');
                console.log('コンタクト属性を取得: queue = \"' + queue + '\"\n');
                console.log('コンタクト属性を取得: availableAgent = \"' + availableAgent + '\"\n');

                // 名前・電話番号の表示欄に値を表示する
                if (phoneNumber == 'anonymous' || phoneNumber == '') {
                    nameDiv.innerHTML = '(番号非通知)'
                    phoneDiv.innerHTML = '―'
                    // agentNumberDiv.innerHTML = agentNumber
                    // queueDiv.innerHTML = queue
                    // availableAgentDiv.innerHTML = availableAgent
                } else if (customerName == '') {
                    nameDiv.innerHTML = '(登録されていません)'
                    phoneDiv.innerHTML = phoneNumber
                    // agentNumberDiv.innerHTML = agentNumber
                    // queueDiv.innerHTML = queue
                    // availableAgentDiv.innerHTML = availableAgent
                } else {
                    nameDiv.innerHTML = customerName
                    phoneDiv.innerHTML = phoneNumber
                    // agentNumberDiv.innerHTML = agentNumber
                    // queueDiv.innerHTML = queue
                    // availableAgentDiv.innerHTML = availableAgent
                }
            }
        });

        // 通話を切断した時のイベント
        contact.onEnded(function (contact) {
            console.log('通話切断: contactId =' + contact.getContactId() + '\n');
            // 名前・電話番号の表示欄をクリアする
            nameDiv.innerHTML = ''
            phoneDiv.innerHTML = ''
            agentNumberDiv.innerHTML = ''
            queueDiv.innerHTML = ''
            availableAgentDiv.innerHTML = ''
        });
    });
}