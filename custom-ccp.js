//CCPのURLを設定する
var ccpUrl = "https://test-dev-001.my.connect.aws/ccp-v2";

//CCPをロードする
connect.core.initCCP(containerDiv, {
	ccpUrl: ccpUrl,        
	loginPopup: true,          
	softphone: {              
	  disableRingtone: true, 
	  ringtoneUrl: null,
	  allowFramedSoftphone: true 
	   }
	});

//画面上のテキストエリアにログ出力する
function writeLog(message) {
	var logtextarea = document.getElementById('logtextarea');
	var text = logtextarea.value;
	logtextarea.value = text + message;
};

//エージェントイベントのサブスクライブ設定
connect.agent(function(agent) {
	writeLog('エージェントイベントのサブスクライブ（connect.agent）!\n');
	writeLog('エージェントの基本情報の表示\n');

	//基本情報の表示
	var routingProfile = agent.getRoutingProfile();
	writeLog('routingProfile.name = ' + routingProfile.name + '\n');
	writeLog('routingProfile.queues = ' + JSON.stringify(routingProfile.queues) + '\n');
	writeLog('routingProfile.defaultOutboundQueue = ' + JSON.stringify(routingProfile.defaultOutboundQueue) + '\n');

	var name = agent.getName();
	writeLog('name = ' + name + '\n');
	
	var extension = agent.getExtension();
	writeLog('extension = ' + extension + '\n');


	//エージェントが受付可になったイベント
	agent.onRoutable(function(agent) {
		writeLog('エージェントが受付可になった（agent.onRoutable）!\n');
	});

	//エージェントが受付可ではなくなったイベント
	agent.onNotRoutable(function(agent) {
		writeLog('エージェントが受付可ではなくなった（agent.onNotRoutable）!\n');
	});

	//エージェントがオフラインになったイベント
	agent.onOffline(function(agent) {
		writeLog('エージェントがオフラインになった（agent.onOffline）!\n');
	});

	//エージェントがACWになったイベント
	agent.onAfterCallWork(function(agent) {
		writeLog('エージェントがACWになった（agent.onAfterCallWork）!\n');
	});
});


//コンタクトイベントのサブスクライブ設定
connect.contact(function(contact) {
	//有効なコネクションがあるかどうかチェック
	if (contact.getActiveInitialConnection() && contact.getActiveInitialConnection().getEndpoint()) {
		var conn = contact.getActiveInitialConnection();
		var phoneNumber = contact.getActiveInitialConnection().getEndpoint().phoneNumber;
	}

	writeLog('コンタクトイベントのサブスクライブ（connect.contact）!\n' );
	writeLog('contact.getActiveInitialConnection().getEndpoint().phoneNumber = ' + phoneNumber + '\n');
	writeLog('contact.getQueue().name = ' + contact.getQueue().name + '\n');
	writeLog('initialConn.getType() = ' + conn.getType() + '\n');


	//コンタクト情報がリフレッシュされたイベント
	contact.onRefresh(function(contact) {
		writeLog('コンタクト情報がリフレッシュされた（connect.onRefresh）!\n');

		//コンタクトのコネクションを確認する
		var conns = contact.getConnections();
		writeLog('コンタクトのコネクション = ' + JSON.stringify(conns) + '\n');
		
		//保留中かどうかチェックする
		var conn = contact.getActiveInitialConnection();
		if (conn.isOnHold()) {
			writeLog('保留中です!\n');
		}
	});

	//コールが着信したイベント
	contact.onIncoming(function(contact) {
		writeLog('コールが着信した（connect.onIncoming）!\n');
		writeLog('contactId =' + contact.getContactId() + '\n');
	});

	//コールに応答したイベント
	contact.onAccepted(function(contact) {
		writeLog('コールに応答した（connect.onAccepted）!\n');	
		writeLog('contactId =' + contact.getContactId() + '\n');
	});

	//コールが切断された（もしくは切断した）イベント
	contact.onEnded(function(contact) {
		writeLog('コールが切断された（もしくは切断した）（connect.onEnded）!\n');	
		writeLog('contactId =' + contact.getContactId() + '\n');			
	});	

	//コールが確立されたイベント
	contact.onConnected(function() {
		writeLog('コールが確立された（connect.onConnected）!\n');
		writeLog('contactId =' + contact.getContactId() + '\n');					
	});
});