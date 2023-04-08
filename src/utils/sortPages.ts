const sortPages = (pages: string[]) => {
    return pages.sort((a: string, b: string) => {
        const lowerA = Number(a.replace("page_", "").replace(".html", ""));
        const lowerB = Number(b.replace("page_", "").replace(".html", ""));
        return lowerA - lowerB;
    });
};

export default sortPages;
