(async () => {
    const data = await getContentbyJson('photoart_content.json');
    // reconstruct the content by push 
    const content = [];
    for (const key in data) {
        content.push(data[key]);
    }
    createRecentWorks(content);
})();