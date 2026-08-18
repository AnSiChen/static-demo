
(function () {
    const items = window.READING_ITEMS || [];
    const root = document.body.dataset.siteRoot || "./";

    function hrefFor(item) {
        return item.internal ? root + item.path : item.url;
    }

    function imageFor(item) {
        return item.image ? root + item.image : null;
    }

    function externalAttrs(item) {
        return item.internal ? "" : ' target="_blank" rel="noopener noreferrer"';
    }

    function featuredCard(item) {
        const image = imageFor(item);
        return `
        <article class="featured-card">
            ${image ? `<img src="${image}" alt="${item.title}" class="featured-image" loading="lazy" decoding="async">` : ""}
            <div class="featured-content">
                <p class="featured-source">${item.source}</p>
                <h3 class="featured-title"><a href="${hrefFor(item)}"${externalAttrs(item)}>${item.title}</a></h3>
                <p class="featured-summary">${item.summary}</p>
                <a href="${hrefFor(item)}" class="featured-link"${externalAttrs(item)}>Read →</a>
            </div>
        </article>`;
    }

    function readingCard(item) {
        const image = imageFor(item);
        return `
        <article class="reading-card">
            ${image ? `<img src="${image}" alt="${item.title}" class="reading-image" loading="lazy" decoding="async">` : ""}
            <div class="reading-content">
                <p class="reading-source">${item.source}</p>
                <h3 class="reading-title"><a href="${hrefFor(item)}"${externalAttrs(item)}>${item.title}</a></h3>
                <p class="reading-meta">${item.author} · ${item.date}</p>
                <p class="reading-summary">${item.summary}</p>
                <a href="${hrefFor(item)}" class="reading-link"${externalAttrs(item)}>Read →</a>
            </div>
        </article>`;
    }

    const featuredTarget = document.getElementById("featured-grid");
    if (featuredTarget) {
        featuredTarget.innerHTML = items.filter(item => item.featured).slice(0, 3).map(featuredCard).join("");
    }

    const rabbitTarget = document.getElementById("latest-grid");
    if (rabbitTarget) {
        rabbitTarget.innerHTML = items.map(readingCard).join("");
    }
})();
