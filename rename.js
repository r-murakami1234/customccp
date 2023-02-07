// 発信ボタンを押すと、input フォームに入力された電話番号へ発信
connect.agent(function (agent) {
    document.getElementById('dial').onclick = function() {
        var phoneNumber = document.getElementById('phone_number').value;
        phoneNumber = '+81' + phoneNumber.slice( 1 );

        // endpoint インスタンス作成　（電話番号を指定してください）
        var endpoint = connect.Endpoint.byPhoneNumber(phoneNumber);

        // endpoint インスタンスを作成時に endpointARN と endpointId が取得されない場合は以下を実行してください
        // var ARNs = agent.getAllQueueARNs();
        // console.log(ARNs)
        // ARNs で取得した endpointARN と endpointId を以下に入力してください
        // endpoint.endpointARN = "arn:aws:connect:<REGION>:<ACCOUNT_ID>:instance/<CONNECT_INSTANCE_ID>/transfer-destination/<TRANSFER_ID>";
        // endpoint.endpointId = "arn:aws:connect:<REGION>:<ACCOUNT_ID>:instance/<CONNECT_INSTANCE_ID>/transfer-destination/<TRANSFER_ID>";

        // Amazon Connect キューインスタンスから取得することができます。
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