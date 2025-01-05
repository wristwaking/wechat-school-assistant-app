const ipcRenderer = require("electron").ipcRenderer;
const { v4: uuidv4 } = require('uuid');
const { execSync } = require('child_process');
const moment = require('moment')
const path = require('path')

const fs = require("fs")
let dir = process.cwd();
const { initExeDirData } = require("./util");
const { default: axios } = require("axios");
const { format } = require("path");
const echarts = require("echarts")


new Vue({
    el: '#app',
    data: {
        child: null,
        launchState: "Closed",
        scheduleForm: {
            groupName: [],
            date: "",
            time: "",
            file: ""
        },
        noticeForm: {
            groupName: [],
            date: "",
            time: "",
            content: ""
        },
        problemForm: {
            serial: "",
            groupName: [],
            date: "",
            time: "",
            content: "",
            answer: "",
            detail: ""
        },
        baiduKey: {
            state: false,
            clientId: "",
            clientSecret: ""
        },
        groupName: "",
        date: "",
        groups: [],
        notices: [],
        schedules: [],
        problems: [],
        files: [],
        content: "",
        menu: "DATA",
        chart: null
    },
    methods: {
        ChooseMenu(menu) {
            this.menu = menu
            if (menu != "DATA") {
                this.chart.dispose() 
            } else {
                setTimeout(() => {
                    this.CreateEchart()
                }, 0)
            }
        },
        CreateEchart() {
            this.chart = echarts.init(document.getElementById('echart-figure'));
            this.chart.setOption({
                textStyle: {
                    fontFamily: "alibaba", 
                    fontWeight: 'normal',
                    color: '#006BCF'
                },
                
                tooltip: {},
                xAxis: {
                    data: ['作业推送', '消息提醒', '题目问答'],
                    axisLabel: {  
                        fontSize: 20,  
                        fontFamily: "alibaba", 
                    },
                },
                yAxis: {},
                series: [
                    {
                        name: '当前数量',
                        type: 'bar',
                        data: [this.schedules.length, this.notices.length, this.problems.length],
                        itemStyle: {  
                            color: '#006BCF'
                        },
                        label: {  
                            show: true, 
                            position: 'top',
                            formatter: '{c}',
                            fontSize: 30,  
                        }, 
                    }
                ]
            });
        },
        ChooseAllGroup(arr) {
            if (arr == "schedules") {
                this.scheduleForm.groupName = []
                this.groups.forEach(group => {
                    this.scheduleForm.groupName.push(group.content)
                })
            }
            if (arr == "notices") {
                this.noticeForm.groupName = []
                this.groups.forEach(group => {
                    this.noticeForm.groupName.push(group.content)
                })
            }
            if (arr == "problems") {
                this.problemForm.groupName = []
                this.groups.forEach(group => {
                    this.problemForm.groupName.push(group.content)
                })
            }
        },
        OpenRootDir() {
            ipcRenderer.send("open-file-root")
        },
        Taobao() {
            execSync('start chrome https://edgehacker.taobao.com/')
        },
        CloseApp() {
            ipcRenderer.send("close-app")
        },
        MiniApp() {
            ipcRenderer.send("resize-app")
        },
        OpenWorkSpace() {
            ipcRenderer.send("open-file-workspace")
        },
        UpdateWinXinBot() {
            axios.post("http://localhost:8888").then(res => {
                console.log(res)
            })
        },
        RefreshScheduleFile() {
            files = fs.readdirSync(path.join(dir, "workspace"))
            files.forEach(file => {
                if (!this.files.includes(file)) {
                    this.files.push(file)
                }
            });
        },
        DeleteGroup(id) {
            let recordToDelete = { id: id };
            let index = this.groups.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) { this.groups.splice(index, 1); }
            let updatedData = JSON.stringify(this.groups);
            fs.writeFileSync(path.join(dir, 'data', 'groups.json'), updatedData, 'utf8');
            let deleteAudio = document.getElementById("delete-audio")
            deleteAudio.play()
            this.UpdateWinXinBot()
        },
        DeleteSchedule(id) {
            let recordToDelete = { id: id };
            let index = this.schedules.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) { this.schedules.splice(index, 1); }
            let updatedData = JSON.stringify(this.schedules);
            fs.writeFileSync(path.join(dir, 'data', 'schedules.json'), updatedData, 'utf8');
            let deleteAudio = document.getElementById("delete-audio")
            deleteAudio.play()
            this.UpdateWinXinBot()
        },
        CopySchedule(id) {
            let recordToDelete = { id: id };
            let index = this.schedules.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) {
                scheduleList = this.schedules.splice(index, 1);
                this.scheduleForm = scheduleList[0]
                let updatedData = JSON.stringify(this.schedules);
                fs.writeFileSync(path.join(dir, 'data', 'schedules.json'), updatedData, 'utf8');
                let deleteAudio = document.getElementById("delete-audio")
                deleteAudio.play()
                this.UpdateWinXinBot()
            }
        },
        AddScheduleForm() {
            if (this.scheduleForm.groupName == "" || this.scheduleForm.time == "" || this.scheduleForm.date == "" || this.scheduleForm.file == "") {
                let errorAudio = document.getElementById("error-audio")
                errorAudio.play()
                return
            }
            let newRecord = { id: uuidv4(), date: this.scheduleForm.date, time: this.scheduleForm.time, file: this.scheduleForm.file, groupName: this.scheduleForm.groupName };
            this.schedules.push(newRecord);
            let updatedSchedulesData = JSON.stringify(this.schedules, null, 2);
            fs.writeFileSync(path.join(dir, "data", 'schedules.json'), updatedSchedulesData, 'utf8')
            this.schedules = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'schedules.json'), 'utf8'))
            this.scheduleForm = { groupName: "", date: "", time: "", file: "" }
            let successAudio = document.getElementById("success-audio")
            successAudio.play()
            this.UpdateWinXinBot()
        },
        DeleteNotice(id) {
            let recordToDelete = { id: id };
            let index = this.notices.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) { this.notices.splice(index, 1); }
            let updatedData = JSON.stringify(this.notices);
            fs.writeFileSync(path.join(dir, 'data', 'notices.json'), updatedData, 'utf8');
            let deleteAudio = document.getElementById("delete-audio")
            deleteAudio.play()
        },
        AddNoticeForm() {
            if (this.noticeForm.groupName == "" || this.noticeForm.time == "" || this.noticeForm.date == "" || this.noticeForm.content == "") {
                let errorAudio = document.getElementById("error-audio")
                errorAudio.play()
                return
            }
            let newRecord = { id: uuidv4(), date: this.noticeForm.date, time: this.noticeForm.time, content: this.noticeForm.content, groupName: this.noticeForm.groupName };
            this.notices.push(newRecord);
            let updatedNoticesData = JSON.stringify(this.notices, null, 2);
            fs.writeFileSync(path.join(dir, "data", 'notices.json'), updatedNoticesData, 'utf8')
            this.notices = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'notices.json'), 'utf8'))
            this.noticeForm = { groupName: "", date: "", time: "", content: "" }
            let successAudio = document.getElementById("success-audio")
            successAudio.play()
            this.UpdateWinXinBot()
        },
        CopyNotice(id) {
            let recordToDelete = { id: id };
            let index = this.notices.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) {
                noticeList = this.notices.splice(index, 1);
                this.noticeForm = noticeList[0]
                let updatedData = JSON.stringify(this.notices);
                fs.writeFileSync(path.join(dir, 'data', 'notices.json'), updatedData, 'utf8');
                let deleteAudio = document.getElementById("delete-audio")
                deleteAudio.play()
                this.UpdateWinXinBot()
            }
        },
        AddProblemForm() {
            if (this.problemForm.serial == "" || this.problemForm.detail == "" || this.problemForm.groupName == "" || this.problemForm.time == "" || this.problemForm.date == "" || this.problemForm.content == "" || this.problemForm.answer == "") {
                let errorAudio = document.getElementById("error-audio")
                errorAudio.play()
                return
            }
            let newRecord = { id: uuidv4(), serial: this.problemForm.serial, date: this.problemForm.date, time: this.problemForm.time, content: this.problemForm.content, groupName: this.problemForm.groupName, answer: this.problemForm.answer, detail: this.problemForm.detail };
            this.problems.push(newRecord);
            let updatedProblemsData = JSON.stringify(this.problems, null, 2);
            fs.writeFileSync(path.join(dir, "data", 'problems.json'), updatedProblemsData, 'utf8')
            this.problems = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'problems.json'), 'utf8'))
            this.problemForm = { serial: "", groupName: "", date: "", time: "", content: "", answer: "", detail: "" }
            let successAudio = document.getElementById("success-audio")
            successAudio.play()
            this.UpdateWinXinBot()
        },
        DeleteProblem(id) {
            let recordToDelete = { id: id };
            let index = this.problems.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) { this.problems.splice(index, 1); }
            let updatedData = JSON.stringify(this.problems);
            fs.writeFileSync(path.join(dir, 'data', 'problems.json'), updatedData, 'utf8');
            let deleteAudio = document.getElementById("delete-audio")
            deleteAudio.play()
            this.UpdateWinXinBot()
        },
        CopyProblem(id) {
            let recordToDelete = { id: id };
            let index = this.problems.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) {
                problemList = this.problems.splice(index, 1);
                this.problemForm = problemList[0]
                let updatedData = JSON.stringify(this.problems);
                fs.writeFileSync(path.join(dir, 'data', 'problems.json'), updatedData, 'utf8');
                let deleteAudio = document.getElementById("delete-audio")
                deleteAudio.play()
                this.UpdateWinXinBot()
            }
        },
        AddGroupForm() {
            if (this.groupName == "") {
                let errorAudio = document.getElementById("error-audio")
                errorAudio.play()
                return
            }
            let newRecord = { id: uuidv4(), content: this.groupName };
            let state = false
            this.groups.forEach(item => {
                if (item.content == this.content) {
                    state = true
                    return
                }
            });
            if (state) {
                let errorAudio = document.getElementById("error-audio")
                errorAudio.play()
                return
            }
            this.groups.push(newRecord);
            let updatedData = JSON.stringify(this.groups);
            fs.writeFileSync(path.join(dir, 'data', 'groups.json'), updatedData, 'utf8')
            this.groups = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'groups.json'), 'utf8'))
            this.groupName = ""
            let successAudio = document.getElementById("success-audio")
            successAudio.play()
            this.UpdateWinXinBot()

        },
        SubmitTime() {
            let baiduKey = { state: this.baiduKey.state, clientId: this.baiduKey.clientId, clientSecret: this.baiduKey.clientSecret }
            fs.writeFileSync(path.join(dir, 'data', 'baiduKey.json'), JSON.stringify(baiduKey), 'utf8')
            let successAudio = document.getElementById("success-audio")
            successAudio.play()
            this.UpdateWinXinBot()

        },
        clearExpiredProblems() {
            let resultArr = []
            this.problems.forEach(item => {
                let now = moment()
                let specifiedDate = moment(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm:ss');
                if (specifiedDate.isAfter(now)) {
                    resultArr.push(item)
                }
            });
            this.problems = resultArr
            fs.writeFileSync(path.join(dir, 'data', 'problems.json'), JSON.stringify(this.problems), 'utf8')
            this.UpdateWinXinBot()

        },
        clearExpiredNotices() {
            let resultArr = []
            this.notices.forEach(item => {
                let now = moment()
                let specifiedDate = moment(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm:ss');
                if (specifiedDate.isAfter(now)) {
                    resultArr.push(item)
                    console.log(specifiedDate.isAfter(now))
                }
            });
            this.notices = resultArr
            fs.writeFileSync(path.join(dir, 'data', 'notices.json'), JSON.stringify(this.notices), 'utf8')
            this.UpdateWinXinBot()

        },
        clearExpiredSchedules() {
            let resultArr = []
            this.schedules.forEach(item => {
                let now = moment()
                let specifiedDate = moment(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm:ss');
                if (specifiedDate.isAfter(now)) {
                    resultArr.push(item)
                }
            });
            this.schedules = resultArr
            fs.writeFileSync(path.join(dir, 'data', 'schedules.json'), JSON.stringify(this.schedules), 'utf8')
            this.UpdateWinXinBot()

        }
    },
    mounted() {
        this.timer = setInterval(() => {
            try {
                axios.get("http://localhost:8888").then(response => {
                    if (response.status == 200) {
                        this.launchState = "Running"
                    } else {
                        console.log("")
                    }
                }).catch(err => {
                    this.launchState = "Closed"
                })
            } catch (error) {
                this.launchState = "Closed"
            }
        }, 1000)
        initExeDirData()
        ipcRenderer.on("open-file-dialog-result", (e, params) => {
            if (params.result.length == 1) {
                this.scheduleForm.file = params.result[0]
            }
        })

        this.RefreshScheduleFile()
        this.baiduKey = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'baiduKey.json'), 'utf8'))
        this.notices = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'notices.json'), 'utf8'))
        this.groups = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'groups.json'), 'utf8'))
        this.schedules = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'schedules.json'), 'utf8'))
        this.problems = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'problems.json'), 'utf8'))
        this.CreateEchart()
    }
})