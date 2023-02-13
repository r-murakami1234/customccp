    var importURL = "https://gntsf0si0f.execute-api.ap-northeast-1.amazonaws.com/POST"

    function addanswer() {
        fetch(importURL, requestOptions)
        then.answer = document.getElementById("answer");
        then.answer.innertext = "CSVファイルを更新しました。"
    }