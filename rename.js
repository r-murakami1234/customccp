var phoneNumberDiv = document.getElementById("phoneNumber");

connect.agent(function (agent) {
    document.getElementById('phoneNumber').onclick = function() {
        var phoneNumber = document.getElementById('phoneNumber').value;
        // phoneNumber = '+81' + phoneNumber.slice( 1 );
        var endpoint = connect.Endpoint.byPhoneNumber(phoneNumber);

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