function renderError(err) {
    cardsCont.innerHTML = `
        <div class="error-message">
            ${err.message}
        </div>
    `
}
