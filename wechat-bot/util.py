from datetime import datetime


def is_datetime_expired(datetime_str: str):
    # 尝试将日期时间字符串解析为datetime对象
    format = '%Y-%m-%d %H:%M:%S'
    try:
        given_datetime = datetime.strptime(datetime_str, format)
    except ValueError:
        return False

        # 获取当前日期时间
    current_datetime = datetime.now()

    # 比较日期时间
    if given_datetime < current_datetime:
        return True
    else:
        return False


def get_chatroom_name(wcf_groups: list, roomid: str):
    for room in wcf_groups:
        if room['wxid'] == roomid:
            return room['name']
    return ""


def get_chatroom_roomid(wcf_groups: list, name: str):
    for room in wcf_groups:
        if room['name'] == name:
            return room['wxid']
    return ""


def search_problem_by_serial(problem_list: list, problem_serial: str) -> dict:
    for problem in problem_list:
        if problem['serial'] == problem_serial:
            return problem
    return None
