// 発信ボタンを押すと、input フォームに入力された電話番号へ発信
connect.agent(function (agent) {
    document.getElementById('dial').onclick = function() {
        var phoneNumber = document.getElementById('phone_number');
        phoneNumber = '+81' + phoneNumber.slice( 1 );
        console.log(phoneNumber);

        // endpoint インスタンス作成　（電話番号を指定してください）
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