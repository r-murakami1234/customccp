// Amazon Connect Streams APIの初期化処理
function init() {
    // CCPのURL 
    var instanceURL = "https://test-dev-001.my.connect.aws/ccp-v2";

    var ccpDiv = document.getElementById("ccp");
    var nameDiv = document.getElementById("name");
    var phoneDiv = document.getElementById("phone");
    var queueDiv = document.getElementById("queue");
	var dialDiv = document.getElementById("dial");
    
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
		if (contact.getActiveInitialConnection() && contact.getActiveInitialConnection().getEndpoint()) {
		}
		
		// 着信または発信が発生した時のイベント
         contact.onConnecting(function (contact) {
        	// 着信時の場合のみ
			if (contact.isInbound()) {
				var phoneNumber = contact.getActiveInitialConnection().getEndpoint().phoneNumber;
				var queue = contact.getQueue().name;
				var dialNumber = contact.getAttributes();
				
				// コンソールログで値が入っているか確認
				console.log('コンタクト属性を取得: phoneNumber = \"' + phoneNumber + '\"\n');
				console.log('コンタクト属性を取得: queue = \"' + queue + '\"\n');
				console.log('コンタクト属性を取得: dialNumber = \"' + dialNumber + '\"\n');

				// 電話番号検索　Lambda 呼び出し
				const apiURL =
					'https://y693i6qtgb.execute-api.ap-northeast-1.amazonaws.com/SearchPhoneNumber';
				const myHeaders = new Headers();
				
				myHeaders.append('Content-Type', 'application/json');
				const raw = JSON.stringify({"PhoneNumber": phoneNumber });
				requestOptions = {
					method: 'POST',
					headers: myHeaders,
					body: raw,
					redirect: 'follow',
				};

				fetch(apiURL, requestOptions)
				//json形式で取り出す
				.then(response => response.json())
				.then(result => {
					//alert('顧客情報\n顧客名' + result[0][1] + '\n顧客電話番号' + phoneNumber + '\n窓口' + queue + '\n')
					if (phoneNumber == 'anonymous' || phoneNumber == '') {
						nameDiv.innerHTML = '(番号非通知)'
						phoneDiv.innerHTML = '―'
						queueDiv.innerHTML = queue;
						// dialDiv.innerHTML = dialNumber;
					}
					// nameDiv.innerHTML = result[0][1];
					phoneDiv.innerHTML = phoneNumber;
					queueDiv.innerHTML = queue;
					// dialDiv.innerHTML = dialNumber;
				})
			}
				
				// } else if (customerName == '') {
				// 	nameDiv.innerHTML = '(登録されていません)'
				// 	phoneDiv.innerHTML = phoneNumber
				// 	queueDiv.innerHTML = queue
				// } else {
				// 	nameDiv.innerHTML = customerName
				// 	phoneDiv.innerHTML = phoneNumber
				// 	queueDiv.innerHTML = queue
				// }
			
		});
		// 通話を切断した時のイベント
        contact.onEnded(function (contact) {
            console.log('通話切断: contactId =' + contact.getContactId() + '\n');
            // 名前・電話番号の表示欄をクリアする
            nameDiv.innerHTML = ''
            phoneDiv.innerHTML = ''
            queueDiv.innerHTML = ''
			dialDiv.innerHTML = dialNumber;
        });
    });
}