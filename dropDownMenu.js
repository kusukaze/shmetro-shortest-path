// 加载下拉框，需指定输入框和下拉框的id，以及关键词数组
// 关键词数组为二维数组，第1维是关键词名称（主匹配），第2维是拼音或英文（副匹配）
// 使用时调用此函数即可，后续函数为内部实现
function loadDropMenu(inputName, dropDownMenuName, dataList) {
    let startInput = document.getElementById(inputName);
    startInput.addEventListener('input', activateSearchList.bind(null, inputName, dropDownMenuName, dataList));
    startInput.addEventListener('click', activateSearchList.bind(null, inputName, dropDownMenuName, dataList));
    document.addEventListener('click', (event) => {
        hideAllDropMenu.call(null, inputName, dropDownMenuName, dataList, event)
    });
}

// 隐藏下拉框
// 若用户点击输入框，则将输入框全选，不隐藏下拉框
// 点击其他位置，则隐藏下拉框
function hideAllDropMenu(inputName, dropDownMenuName, dataList, event) {
    let sInput = document.getElementById(inputName);
    let itemList = dataList.map(subarray => subarray[0]);
    if (!sInput.contains(event.target)) {
        let dropMenu = document.getElementById(dropDownMenuName);
        if (dropMenu.style.display != 'none' && !(itemList.includes(sInput.value))) {
            sInput.value = "";
        }
        hideDropdownMenu(dropMenu);
    }
    else {
        sInput.select();
        sInput.focus();
    }
}

// 展示并更新下拉框信息
// 当用户点击输入框或在输入框输入时触发
function activateSearchList(searchInputId, dropdownMenuId, dataList) {
    let searchInput = document.getElementById(searchInputId);
    let dropdownMenu = document.getElementById(dropdownMenuId);
    handleSearchInput(searchInput, dropdownMenu, dataList);
}

// 模糊匹配关键词。优先匹配主关键词，再匹配副关键词。
// 展示顺序：完全匹配 > 前缀匹配 > 其他匹配
function handleSearchInput(searchInput, dropdownMenu, dataList) {
    let itemList = dataList.map(subarray => [subarray[0], subarray[2]]);
    let searchTerm = searchInput.value.trim().toUpperCase();
    dropdownMenu.innerHTML = '';

    let matcheditemList = itemList.filter(matchedItem => matchedItem[0].includes(searchTerm));
    // 主关键词匹配
    {
        let allMatchList = itemList.filter(matchedItem => matchedItem[0] == searchTerm);
        let prefixMatchList = itemList.filter(matchedItem =>
            matchedItem[0] != searchTerm && matchedItem[0].startsWith(searchTerm));
        let partMatchList = itemList.filter(matchedItem =>
            !matchedItem[0].startsWith(searchTerm) && matchedItem[0].includes(searchTerm));
        matcheditemList = allMatchList.concat(prefixMatchList, partMatchList);
        showDropdownMenu(searchInput, dropdownMenu, matcheditemList, searchTerm);
    }
    // 副关键词匹配
    {
        let allMatchList = dataList.filter(matchedItem =>
            !matchedItem[0].includes(searchTerm) && matchedItem[1].split(/\n/)[0] == searchTerm);
        let prefixMatchList = dataList.filter(matchedItem =>
            !matchedItem[0].includes(searchTerm) && matchedItem[1].split(/\n/)[0] != searchTerm
            && matchedItem[1].startsWith(searchTerm));
        let partMatchList = dataList.filter(matchedItem =>
            !matchedItem[0].includes(searchTerm) && !matchedItem[1].startsWith(searchTerm)
            && matchedItem[1].includes(searchTerm));
        let pinyinmatcheditemList = allMatchList.concat(prefixMatchList, partMatchList);
        pinyinmatcheditemList = pinyinmatcheditemList.map(matchedItem =>
            [matchedItem[0], matchedItem[2]]);
        showDropdownMenu(searchInput, dropdownMenu, pinyinmatcheditemList, searchTerm);
    }

}

// 根据匹配列表生成下拉框项目，并显示下拉框
function showDropdownMenu(searchInput, dropdownMenu, matcheditemList, searchTerm) {
    matcheditemList.forEach(school => {
        let item = document.createElement('li');
        item.classList.add('dropdown-item');

        if (school[1] != "none") {
            let colors = school[1].split(/\n/);
            for (const color of colors) {
                let img = document.createElement('span');
                img.innerHTML = color;
                console.log(color);
                item.appendChild(img);
                item.innerHTML += ' ';
            }
        }
        else {
            let img = document.createElement('img');
            img.src = 'icon.png';
            img.style.width = '15px';
            img.style.height = '15px';
            item.appendChild(img);
        }

        // 将匹配关键词用黄色标注

        let highlightedName = school[0].replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
        item.innerHTML += ' ' + highlightedName;

        item.addEventListener('click', () => {
            searchInput.value = school[0];
            hideDropdownMenu(dropdownMenu);
        });

        dropdownMenu.appendChild(item);
    });

    dropdownMenu.style.display = 'block';
}

// 隐藏单个下拉框项目
function hideDropdownMenu(dropdownMenu) {
    dropdownMenu.style.display = 'none';
}