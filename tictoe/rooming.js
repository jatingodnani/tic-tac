console.log("diiii")

var text = document.getElementById("url");
function copyToClip(e){
    console.log(e)
    var text = document.getElementById("url");
text.select();
document.execCommand("copy");
e.target.value="Copied to clipboard"
setTimeout(function() {
    e.target.value = "<%=roomId%>";
}, 1500);
}