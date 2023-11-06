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
        const email = content.querySelector(".input-box.email input").value;
        const username = content.querySelector(".input-box.username input").value;
        const fullName = content.querySelector(".input-box.full-name input").value;
        const password = content.querySelector(".input-box.password input").value;
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                username,
                fullName,
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