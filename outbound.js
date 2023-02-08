// Amazon Connect Streams APIの初期化処理
function init() {
    // CCPのURL 
    var instanceURL = "https://test-dev-001.my.connect.aws/ccp-v2";

    var ccpDiv = document.getElementById("ccp");
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
    // 発信ボタンを押すと、input フォームに入力された電話番号へ発信
    connect.agent(function (agent) {
        document.getElementById('dial').onclick = function() {
            var phoneNumber = document.getElementById('phone_number').value;
            phoneNumber = '+81' + phoneNumber.slice(1);
            console.log(phoneNumber);
            
            // endpoint インスタンス作成　
            var endpoint = connect.Endpoint.byPhoneNumber(phoneNumber);

            var queueArn = "arn:aws:connect:ap-northeast-1:831461333044:instance/63eb6a17-a9da-4caf-a4bf-8ad2f5cf887e/queue/fff1d521-eedb-4fdd-9e41-d355e36a6789";

            agent.connect(endpoint, {
                queueARN: queueArn,
                success: function() { console.log("outbound call connected"); },
                failure: function(err) {
                    console.log("outbound call connection failed");
                    console.log(err);
                }
            });
        }
    });
    // クリック発信
    connect.agent(function (agent) {
        document.getElementById('clickDial').onclick = function() {
            var phoneNumber2 = document.getElementById('clickDial').value;
            console.log(phoneNumber2);

            // endpoint インスタンス作成　
            var endpoint = connect.Endpoint.byPhoneNumber(phoneNumber2);

            var queueArn = "arn:aws:connect:ap-northeast-1:831461333044:instance/63eb6a17-a9da-4caf-a4bf-8ad2f5cf887e/queue/fff1d521-eedb-4fdd-9e41-d355e36a6789";

            agent.connect(endpoint, {
                // queueARN: queueArn,
                success: function() { console.log("outbound call connected"); },
                failure: function(err) {
                    console.log("outbound call connection failed");
                    console.log(err);
                }
            });
        }
    })

    // 切断ボタンが押されたら、電話を切る
    connect.contact(function (contact) {
        var conn = contact.getActiveInitialConnection();

        document.getElementById('hangUp').onclick = function() {
            conn.destroy({
                success: function() {
                    console.log("disconnected");
                    sleep(2000);
                    location.reload();
                },
                failure: function(err) {
                    console.log("disconnection failed");
                    console.log(err);
                }
            });
        };
    });
}