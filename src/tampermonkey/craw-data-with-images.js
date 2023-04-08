// ==UserScript==
// @name         Craw data from Waka with images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use to craw craw data from Waka which use to build ebook
// @author       You
// @match        https://ebook.waka.vn/tu-duy-da-chieu-edward-de-bono-rZwqQW.html?type=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(async function () {
    "use strict";
    const sleep = async (time) => {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    };

    const bookName = window.reader_option.content_slug;
    const bookNameOriginal = window.reader_option.content_title;

    let id = 0;
    const waitForFrame = async (id) => {
        let frameElement = null;
        let times = 0;
        while (frameElement === null && times <= 20) {
            await sleep(1000);
            frameElement = document.querySelector(`#${id}`);
            console.log(frameElement);
            times = times + 1;
        }
        return frameElement;
    };

    const clickNext = () => {
        const nextButton = document.querySelector("#nextPage");
        nextButton.click();
    };

    while (true) {
        const buildedId = `__i${id}__`;
        const frameElement = await waitForFrame(buildedId);
        if (!frameElement) {
            throw new Error("frame not found");
        }
        await sleep(2000);
        const frameDocument = frameElement.contentWindow.document;
        const content = frameDocument.body.innerHTML;
        const imageElements = frameDocument.getElementsByTagName("img");
        const images = Array.from(imageElements).map((element) => ({ src: element.src, alt: element.alt }));

        const requestBody = {
            id: id,
            bookName: bookName,
            bookNameOriginal: bookNameOriginal,
            content: content,
            images: images,
        };

        await fetch("http://localhost:5000/store-book", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(requestBody),
        });
        id = id + 1;
        clickNext();
    }
})();
