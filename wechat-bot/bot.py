from datetime import datetime
import json
from queue import Empty
from threading import Thread
import util
from http_check import start_server_thread
from util import get_chatroom_name
from wcferry import Wcf, WxMsg

wcf = Wcf()

bot = wcf.get_user_info()

with open('data/groups.json', 'r', encoding='utf-8') as file:
    groups = json.load(file)

with open('data/problems.json', 'r', encoding='utf-8') as file:
    problems = json.load(file)

customize_groups = []
for group in groups:
    customize_groups.append(group['content'])

wcf_groups = []

for i in wcf.get_contacts():
    if i['wxid'].endswith("chatroom"):
        wcf_groups.append(i)


def processMsg(msg: WxMsg):
    if msg.from_group():
        room_name = get_chatroom_name(wcf_groups=wcf_groups, roomid=msg.roomid)
        if (room_name in customize_groups):
            """
            result = qianfan_ai.get_completion(msg.content.replace(f"@{bot['name']}", ""))
            receiver_alias = wcf.get_alias_in_chatroom(msg.sender, msg.roomid)
            wcf.send_text(msg=f"@{receiver_alias} {result}", receiver=msg.roomid, aters=f"{msg.sender}")
            """
            content = msg.content
            arr: list = content.split(" ")
            if content.startswith("#"):
                if len(arr) != 2:
                    return
                problem_serial = arr[0].replace("#", "")
                problem = util.search_problem_by_serial(problem_list=problems, problem_serial=problem_serial)
                if problem is not None:
                    problem_result = arr[1]
                    if problem_result == problem['answer']:
                        receiver_alias = wcf.get_alias_in_chatroom(msg.sender, msg.roomid)
                        response_prefix = "恭喜你回答正确！\n\n"
                        response = f"{response_prefix}题目解析：{problem['detail']}"
                        wcf.send_text(msg=f"@{receiver_alias} {response}", receiver=msg.roomid, aters=f"{msg.sender}")
                    else:
                        receiver_alias = wcf.get_alias_in_chatroom(msg.sender, msg.roomid)
                        response_prefix = "很抱歉回答错误！\n\n"
                        response = f"{response_prefix}题目解析：{problem['detail']}"
                        wcf.send_text(msg=f"@{receiver_alias} {response}", receiver=msg.roomid, aters=f"{msg.sender}")



def enableReceivingMsg():
    def innerProcessMsg():
        while wcf.is_receiving_msg():
            try:
                msg = wcf.get_msg()
                processMsg(msg)
            except Empty:
                continue
            except Exception as e:
                print(f"Receiving message error: {e}")

    wcf.enable_receiving_msg()
    Thread(target=innerProcessMsg, name="GetMessage", daemon=True).start()


now = datetime.now()

# 格式化时间
formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
print("微信智能助教机器人 1.0.0")
print("边缘骇客编程实验室官方淘宝店铺访问：https://edgehacker.taobao.com/")
print("")

enableReceivingMsg()
start_server_thread(wcf=wcf, wcf_groups=wcf_groups)

wcf.keep_running()
