import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    handler = partial(CORSRequestHandler, directory=os.getcwd())
    server = ThreadingHTTPServer(('0.0.0.0', 5000), handler)
    print("Static file server running on port 5000")
    server.serve_forever()

if __name__ == '__main__':
    run_server()
