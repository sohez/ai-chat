/* 
-----------------------------
Chat App Using Gemini API 
Get Free API Key From : 
 1- go to https://aistudio.google.com/app/apikey
 2- Click on "Get API Key" button
 3- Copy the API Key and paste it in the code below.
-----------------------------
*/
const API_KEY = "AIzaSyCCmyR9NL803sk_buQXBc5-CMkWY8xGTss"; // replace your API Key here.

document.addEventListener("DOMContentLoaded", function (event) {
    /* 
    -----------------------------
    Scroll to chat bottom 
    -----------------------------
    */
    const chatBodyScroll = document.getElementById("chat-body-scroll");
    chatBodyScroll.scrollTop = chatBodyScroll.scrollHeight;

    /* 
    -----------------------------
    Send Button Click -> sendMessage() is called !
    -----------------------------
    */
    let sendButton = document.getElementById("send-button");
    sendButton.addEventListener("click", sendMessage);

    /* 
   -----------------------------
   Keyword Enter Button Click -> sendMessage() is called !
   -----------------------------
   */
    let userInput = document.getElementById("user-input");
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
/* 
-----------------------------
Get value from input, append in UI & call API.
-----------------------------
*/
function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    appendMessage(userInput, "sent");
    document.getElementById("user-input").value = "";

    fetchResponseFromGPT(userInput);

}

/* 
-----------------------------
Append message in UI.
-----------------------------
*/
function appendMessage(message, sender) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("chat-message", sender);
    messageContainer.innerHTML = message;

    document
        .getElementById("chat-box-append")
        .appendChild(messageContainer);

    const chatBodyScroll = document.getElementById("chat-body-scroll");
    chatBodyScroll.scrollTop = chatBodyScroll.scrollHeight;
}

/* 
-----------------------------
call API convert markedText to HTML ELEMENTS, append response.
-----------------------------
*/
async function fetchResponseFromGPT(message) {

    document.getElementById("typing").classList.add("show-typing");
    
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: message }],
                    },
                ],
            }),
        }
    ).catch((e)=>{
        let er = `<p id="error-text">Error Occur <br> Try Again..<br>Error is:${e}</p>`;
        appendMessage(er, "received");
        // alert("erro Occur"+e)
        // console.log(e);
    })

    try{
        const data = await response.json();
        // console.log({data});
        const text = data.candidates[0].content.parts[0].text;
        let markedText = marked.parse(text);
        appendMessage(markedText, "received");
    }catch(e){
        // alert("erro Occur"+e)
        let er = `<p id="error-text">Error Occur <br> Try Again..<br>Error is:${e}</p>`;
        appendMessage(er, "received");
    }

    hilightCodeBlock();
    document.getElementById("typing").classList.remove("show-typing");

}

/* 
-----------------------------
hilight response Code 
-----------------------------
*/
function hilightCodeBlock() {
    document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
    });
}

// {
//     "data": {
//       "candidates": [
//         {
//           "finishReason": "RECITATION",
//           "index": 0
//         }
//       ],
//       "usageMetadata": {
//         "promptTokenCount": 3,
//         "totalTokenCount": 3
//       }
//     }
//   }