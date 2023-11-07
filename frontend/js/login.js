fetch("/api/logout");

window.addEventListener("load", () => {
    const container = document.querySelector(".page-content .container");
    const content = container.querySelector(".content");
    content.querySelectorAll("input").forEach(i => i.addEventListener("keypress", (event) => {
        if(event.key == "Enter") submitForm();
    }));
    content.querySelector("button").addEventListener("click", () => submitForm());
    async function submitForm(){
        const username = content.querySelector(".input-box.username input").value;
        const password = content.querySelector(".input-box.password input").value;
        setLoading(true);
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
        const {message} = await response.json();
        if(!message){
            log("Unknown error occured.");
            return;
        }
        if(response.ok){
            window.location.href = "/";
            return;
        }
        log(message);
        setLoading(false);
    }
    function log(message){
        const output = container.querySelector(".output");
        output.innerText = message;
    }
    function setLoading(loading){
        if(loading) container.setAttribute("loading", "");
        else{
            if(container.hasAttribute("loading")) container.removeAttribute("loading");
        }
    }
});