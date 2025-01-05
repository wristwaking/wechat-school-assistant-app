const fs = require('fs');
const path = require('path');
let dir = process.cwd();


let initExeDirData = () => {
    const dirPath = path.join(dir, "data");
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }

    if (!fs.existsSync(path.join(dirPath, "baiduKey.json"))) {
        let data = { state: false, clientId: "", clientSecret: "" }
        fs.writeFileSync(path.join(dir, 'data', 'baiduKey.json'), JSON.stringify(data), 'utf8');
    }

    if (!fs.existsSync(path.join(dirPath, "groups.json"))) {
        fs.writeFileSync(path.join(dir, 'data', 'groups.json'), "[]", 'utf8');
    }

    if (!fs.existsSync(path.join(dirPath, "notices.json"))) {
        fs.writeFileSync(path.join(dir, 'data', 'notices.json'), "[]", 'utf8');
    }

    if (!fs.existsSync(path.join(dirPath, "schedules.json"))) {
        fs.writeFileSync(path.join(dir, 'data', 'schedules.json'), "[]", 'utf8');
    }
}

module.exports = { initExeDirData }