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
