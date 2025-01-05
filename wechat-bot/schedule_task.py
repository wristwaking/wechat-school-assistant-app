import time
import random

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import json
from wcferry import Wcf
import util
from print_color import bcolors
from util import is_datetime_expired

# 创建一个调度器实例
scheduler = BackgroundScheduler()


def schedule_task_job(schedule_task: dict, wcf: Wcf, wcf_groups: list):
    for group in schedule_task['groupName']:
        # 生成一个0.5到2秒之间的随机延迟时间
        random_delay = random.uniform(0.5, 3)
        # 等待随机时间
        time.sleep(random_delay)
        roomid = util.get_chatroom_roomid(wcf_groups=wcf_groups, name=group)
        if roomid:
            # 必须先启动机器人再启动微信发送文件成功！
            wcf.send_file(path="./workspace/{}".format(schedule_task['file']), receiver=roomid)



def notice_task_job(notice_task: dict, wcf: Wcf, wcf_groups: list):
    for group in notice_task['groupName']:
        # 生成一个0.5到2秒之间的随机延迟时间
        random_delay = random.uniform(0.5, 3)
        # 等待随机时间
        time.sleep(random_delay)
        roomid = util.get_chatroom_roomid(wcf_groups=wcf_groups, name=group)
        if roomid:
            wcf.send_text(msg=notice_task['content'], receiver=roomid)


def problem_task_job(problem_task: dict, wcf: Wcf, wcf_groups: list):
    for group in problem_task['groupName']:
        # 生成一个0.5到2秒之间的随机延迟时间
        random_delay = random.uniform(0.5, 3)
        # 等待随机时间
        time.sleep(random_delay)
        roomid = util.get_chatroom_roomid(wcf_groups=wcf_groups, name=group)
        if roomid:
            # msg = f"题目编号：{problem_task['serial']}\n{problem_task['content']}\n答题回复：# 号键加题目编号加答案"
            msg = f"题目编号：{problem_task['serial']}\n{problem_task['content']}"
            wcf.send_text(msg=msg, receiver=roomid)


def start_all_schedule_task(wcf: Wcf, wcf_groups: list):
    if scheduler.running:
        now = datetime.now()
        formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
        print(bcolors.WARNING + "【{}】【微信智能助教机器人】【重新刷新】".format(formatted_time) + bcolors.ENDC)
        scheduler.remove_all_jobs()
    else:
        now = datetime.now()
        formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
        print(bcolors.WARNING + "【{}】【微信智能助教机器人】【初始加载】".format(formatted_time) + bcolors.ENDC)

    # 打开JSON文件并读取内容
    with open('data/schedules.json', mode='r', encoding='UTF-8') as file:
        schedule_list = json.load(file)

    # 打开JSON文件并读取内容
    with open('data/notices.json', mode='r', encoding='UTF-8') as file:
        notice_list = json.load(file)

    # 打开JSON文件并读取内容
    with open('data/problems.json', mode='r', encoding='UTF-8') as file:
        problem_list = json.load(file)

    for schedule_task in schedule_list:
        if not is_datetime_expired(f"{schedule_task['date']} {schedule_task['time']}"):
            # 字符串表示的日期时间
            date_time_str = f"{schedule_task['date']} {schedule_task['time']}"
            # 使用 strptime 方法将字符串转换为 datetime 对象
            run_date = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
            scheduler.add_job(schedule_task_job, args=(schedule_task, wcf, wcf_groups), run_date=run_date)

    for notice_task in notice_list:
        if not is_datetime_expired(f"{notice_task['date']} {notice_task['time']}"):
            # 字符串表示的日期时间
            date_time_str = f"{notice_task['date']} {notice_task['time']}"
            # 使用 strptime 方法将字符串转换为 datetime 对象
            run_date = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
            scheduler.add_job(notice_task_job, args=(notice_task, wcf, wcf_groups), run_date=run_date)

    for problem_task in problem_list:
        if not is_datetime_expired(f"{problem_task['date']} {problem_task['time']}"):
            # 字符串表示的日期时间
            date_time_str = f"{problem_task['date']} {problem_task['time']}"
            # 使用 strptime 方法将字符串转换为 datetime 对象
            run_date = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
            scheduler.add_job(problem_task_job, args=(problem_task, wcf, wcf_groups), run_date=run_date)

    if scheduler.running:
        # 获取当前时间
        now = datetime.now()

        # 格式化时间
        formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
        print(bcolors.HEADER + "【{}】【微信智能助教机器人】【刷新成功】".format(formatted_time) + bcolors.ENDC)
    else:
        # 获取当前时间
        now = datetime.now()

        # 格式化时间
        formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
        print(bcolors.OKGREEN + "【{}】【微信智能助教机器人】【启动成功】".format(formatted_time) + bcolors.ENDC)
        scheduler.start()

