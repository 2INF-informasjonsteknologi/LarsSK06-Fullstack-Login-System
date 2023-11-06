window.addEventListener("load", () => {
    setLoginButton();
});

async function setLoginButton(){
    const button = document.querySelector("header .button.login");
    const response = await fetch("/api/session");
    const data = await response.json();
    button.innerText = data.hasOwnProperty("user") ? "Log out" : "Log in";
}