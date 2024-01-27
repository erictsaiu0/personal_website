// // main.js

// function createRecentWorkCard (WorkMetadata) {
//     const card = document.createElement('div');
//     const cardHTMLTemplate = ``;
//     card.classList.add('card');
//     card.classList.add('recent-work-card');
//     card.innerHTML = cardHTMLTemplate;
//     return card;
// }

// function createRecentWorks (WordsMetadata) {
//     const recentWorksContainer = document.createElement('div');
//     recentWorksContainer.classList.add('recent-works-container');
//     WordsMetadata.forEach(WorkMetadata => {
//         const card = createRecentWorkCard(WorkMetadata);
//         recentWorksContainer.appendChild(card);
//     })
//     return recentWorksContainer;
// }

// function parseWorkMetadata (directory) {
//     const fs = require('fs');
//     const path = require('path');
//     const metadataJson = fs.readFileSync(path.join(directory, 'metadata.json'));
//     const metadata = JSON.parse(metadataJson);
//     metadata.date = new Date(metadata.date);
//     return metadata;
// }

// function parseTopNWorks (directory, n = 5) {
//     const fs = require('fs');
//     const path = require('path');
//     const topNWorks = [];
//     const allWorks = fs.readdirSync(directory);
//     allWorks.forEach(work => {
//         const workDirectory = path.join(directory, work);
//         const workMetadata = parseWorkMetadata(workDirectory);
//         topNWorks.push(workMetadata);
//     })
//     topNWorks.sort((a, b) => b.date - a.date);
//     return topNWorks.slice(0, n);
// }

// function createRecentWorksSection () {
//     const recentWorksSection = document.createElement('section');
//     recentWorksSection.classList.add('recent-works-section');
//     recentWorksSection.appendChild(createRecentWorks(WordsMetadata));
//     return recentWorksSection;
// }

// the above code is pesudo code, it is not working code, it is just a reference for me to write the code below
function parseWorkMetadata(dir) {
    console.log('[parseWorkMetadata]Parsing metadata for directory:', dir);
    // await fetch('https://raw.githubusercontent.com/erictsaiu0/personal_website/' + dir + 'metadata.json')
    return fetch(dir + 'metadata.json')
        .then(response => response.json())
        .then(metadata => {
            metadata.date = new Date(metadata.date);
            return metadata;
        })
        .catch(error => {
            console.error('Error fetching metadata:', error);
        });
}

// the dir list is saved in the file 'dir_list.json' in the root directory of the repository
async function getFilesInDirectory(dir) {
    console.log('[getFilesInDirectory]Fetching files in directory:', dir);
    // the dir list is saved in the file 'work_dirs.json' as format: {"0": "ccc", "1": "gradient_scotoma"}
    // return fetch('https://raw.githubusercontent.com/erictsaiu0/personal_website/work_dirs.json')
    return await fetch('work_dirs.json')
        .then(response => response.json())
        .then(dirList => {
            // const dirList = JSON.parse(dirListJson);
            // console.log(dirList);
            const fileNames = [];
            for (const key in dirList) {
                // console.log(key, dirList[key]);
                fileNames.push(dirList[key]);
            }
            return fileNames;
        })
        .catch(error => {
            console.error('Error fetching dir list:', error);
        });
}

async function parseTopNWorks(directory, n = 5) {
    try {
        const fileNames = await getFilesInDirectory(directory);
        const topNWorks = [];
        for (const fileName of fileNames) {
            const workDirectory = directory + fileName + '/';
            const workMetadata = await parseWorkMetadata(workDirectory);
            topNWorks.push(workMetadata);
        }
        topNWorks.sort((a, b) => b.date - a.date);
        // console.log(topNWorks.slice(0, n));
        return topNWorks.slice(0, n);
    } catch (error) {
        console.error('Error fetching top N works:', error);
    }
}

function getContentbyJson(path) {
    // read the content from the json file and return the content as parseTopNWorks does
    return fetch(path)
        .then(response => response.json())
        .then(content => {
            return content;
        })
        .catch(error => {
            console.error('Error fetching content:', error);
        });
}

async function createRecentWorkCard(WorkMetadata, ImageOnRight = true) {
    const title = document.createElement('h2');
    title.classList.add('text-2xl');
    const info = document.createElement('h3');
    info.classList.add('pt-4');
    const description = document.createElement('p');
    description.classList.add('pt-6', 'text-sm');
    const tags = document.createElement('h6');
    tags.classList.add('pt-6', 'italic', 'text-xs');

    title.innerHTML = WorkMetadata.title;
    info.innerHTML = WorkMetadata.info;
    description.innerHTML = WorkMetadata.description;
    tags.innerHTML = WorkMetadata.tags.map(tag => '#' + tag).join(' ');

    const RecentWorkText = document.createElement('div');
    RecentWorkText.classList.add('w-1/2', 'pl-12', 'pr-12');
    RecentWorkText.appendChild(title);
    RecentWorkText.appendChild(info);
    RecentWorkText.appendChild(description);
    RecentWorkText.appendChild(tags);

    const image = document.createElement('img');
    image.classList.add('rounded-2xl', 'float-left');

    // image.src = 'cover.jpg' if the image is in the same directory as the metatdata.json file, else image.src = 'cover.png'
    image.src = 'works/' + WorkMetadata.dirname + '/cover.jpg';
    image.onerror = () => {
        image.src = 'works/' + WorkMetadata.dirname + '/cover.png';
        image.onerror = () => {
            image.src = ''
        }
    }
    
    const RecentWorkImage = document.createElement('div');
    RecentWorkImage.classList.add('w-1/2', 'p-4', 'flex', 'justify-center');
    RecentWorkImage.appendChild(image);

    const RecentWork = document.createElement('div');
    RecentWork.classList.add('flex', 'flex-row', 'place-content-center', 'place-items-center', 'w-full');
    if (ImageOnRight) {
        RecentWork.appendChild(RecentWorkText);
        RecentWork.appendChild(RecentWorkImage);
    } else {
        RecentWork.appendChild(RecentWorkImage);
        RecentWork.appendChild(RecentWorkText);
    }
    // RecentWork.appendChild(RecentWorkText);
    // RecentWork.appendChild(RecentWorkImage);

    const section = document.createElement('section');
    section.classList.add('py-8', 'px-8', 'mb-8', 'rounded-2xl');
    section.appendChild(RecentWork);

    main = document.querySelector('main');
    main.appendChild(section);
}

async function createRecentWorks(WordsMetadata) {
    const metadataArray = Array.from(WordsMetadata); // Convert WordsMetadata to an array if it is not already an array
    let imageOnRight = false; // Set initial value of ImageOnRight parameter
    for (const WorkMetadata of metadataArray) {
        await createRecentWorkCard(WorkMetadata, imageOnRight); // Pass the current value of imageOnRight to the function
        imageOnRight = !imageOnRight; // Toggle the value of imageOnRight for the next iteration
    }
}

console.log('JS loaded');
// (async () => {
//     const topNWorks = await parseTopNWorks('works/');
//     console.log(topNWorks);
//     createRecentWorks(topNWorks);
// })();
(async () => {
    const data = await getContentbyJson('index_content.json');
    // reconstruct the content by push 
    const content = [];
    for (const key in data) {
        content.push(data[key]);
    }
    createRecentWorks(content);
})();

// createRecentWorks(parseTopNWorks('works/'));


// parseTopNWorks('/works/');
// getFilesInDirectory('works/');
// parseWorkMetadata('works/');