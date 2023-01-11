import "amazon-connect-streams";

const containerDiv = document.getElementById("app"); 
const instanceURL = "https://test-dev-001.my.connect.aws/connect/ccp-v2/"

if (containerDiv) {
    connect.core.initCCP(containerDiv, {
        ccpUrl: instanceURL
    });
}
