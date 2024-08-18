function toggleMenu() {
    // 按第一次時，將menu打開，並將menu裡的元素一個一個顯示出來，第二次時，將menu關閉
    const menu = document.querySelector('#mobile-menu');
    const elements = Array.from(menu.children);
    if (elements[0].children[0].classList.contains('collapse')) {
        let delay = 0; // Declare and initialize the delay variable
        for (const element of elements) {
            setTimeout(() => {
                    element.children[0].classList.remove('collapse');
                }, delay);
                delay += 100;
        }
    } else {
        let delay = 0; // Declare and initialize the delay variable
        for (const element of elements) {
            setTimeout(() => {
                    element.children[0].classList.add('collapse');
                }, delay);
                delay += 100;
        }
    }
}