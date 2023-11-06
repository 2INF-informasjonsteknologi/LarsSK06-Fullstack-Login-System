window.addEventListener("load", () => {
    const content = document.querySelector(".page-content .container .content");
    content.querySelector("button").addEventListener("click", () => {
        if(!content.hasAttribute("awaiting")) submitForm();
    });
    content.querySelectorAll("input").forEach(i => i.addEventListener("keypress", (event) => {
        if(event.key != "Enter") return;
        if(content.hasAttribute("awaiting")) return;
        submitForm();
    }));
    function log(message){
        const output = content.querySelector(".output");
        output.innerText = message;
    }
    async function submitForm(){
        content.setAttribute("awaiting", "");
        const username = content.querySelector(".input-box.username input").value;
        const password = content.querySelector(".input-box.password input").value;
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();
        if(content.hasAttribute("awaiting")) content.removeAttribute("awaiting");
        if(!response.ok){
            log(data.message);
            return;
        }
        window.location.href = "/";
    }
});