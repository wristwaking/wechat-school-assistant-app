from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import json
from wcferry import Wcf

import schedule_task


def start_server(wcf: Wcf, wcf_groups: list, server_class=HTTPServer, port=8888):
    class MyServer(BaseHTTPRequestHandler):
        def do_GET(self):
            # 设置响应头
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # 创建一个字典并将其转换为 JSON 字符串
            data = {'code': 200, 'edgehacker': '边缘骇客编程实验室淘宝店：https://taobao.edgehacker.com'}
            json_data = json.dumps(data).encode('utf-8')
            # 发送数据
            self.wfile.write(json_data)
            return

        def do_POST(self):
            # 设置响应头
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # 创建一个字典并将其转换为 JSON 字符串
            data = {'code': 200, 'edgehacker': '边缘骇客编程实验室淘宝店：https://taobao.edgehacker.com'}
            json_data = json.dumps(data).encode('utf-8')
            schedule_task.start_all_schedule_task(wcf=wcf, wcf_groups=wcf_groups)
            # 发送数据
            self.wfile.write(json_data)
            return

        def log_message(self, format, *args):
            # 重写此方法以阻止日志输出
            pass

    schedule_task.start_all_schedule_task(wcf=wcf, wcf_groups=wcf_groups)
    server_address = ('', port)
    httpd = server_class(server_address, MyServer)
    httpd.serve_forever()


def start_server_thread(wcf: Wcf, wcf_groups: list, port=8888):
    server_thread = threading.Thread(target=start_server, args=(wcf, wcf_groups, HTTPServer, port))
    server_thread.daemon = True  # 设置为守护线程，这样主程序结束时它也会结束
    server_thread.start()

