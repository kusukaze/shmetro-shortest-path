from pypinyin import pinyin,Style

with open("pinyin.txt",encoding="utf-8") as f:
    for line in f:
        initials = []
        for char in line:
            initials.append(pinyin(char,style=Style.FIRST_LETTER)[0][0])
        ans = "".join(initials).replace("\n","")
        print(ans)
