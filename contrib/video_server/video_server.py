#!/usr/bin/python3
"""
THE CODE COPIED FROM HERE AND UPDATED TO STREAM VIDEO FILES AND MODIFIED TO INCLUDE STREAMING FROM FILE/VIDEO UrL
https://gist.github.com/n3wtron/4624820


Author: Igor Maculan - n3wtron@gmail.com
A Simple mjpg stream http server
"""
import argparse
import http
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn

import cv2


class CamHandler(BaseHTTPRequestHandler):

    def __init__(self, request, client_address, server):
        img_src = 'http://{}:{}/cam.mjpg'.format(server.server_address[0], server.server_address[1])
        self.html_page = """
            <html>
                <head></head>
                <body>
                    <img src="{}"/>
                </body>
            </html>""".format(img_src)
        self.html_404_page = """
            <html>
                <head></head>
                <body>
                    <h1>NOT FOUND</h1>
                </body>
            </html>"""
        BaseHTTPRequestHandler.__init__(self, request, client_address, server)

    def do_GET(self):
        if self.path.endswith('.mjpg'):
            self.send_response(http.HTTPStatus.OK)
            self.send_header('Content-type', 'multipart/x-mixed-replace; boundary=--jpgboundary')
            self.end_headers()
            while True:
                try:

                    img = self.server.read_frame()
                    if img is None:
                        raise RuntimeError('No frame to decode, ending stream')
                    if self.server.frame_shape:
                        img = cv2.resize(img, self.server.frame_shape, interpolation=cv2.INTER_LINEAR)
                    retval, jpg = cv2.imencode('.jpg', img)
                    if retval is None:
                        raise RuntimeError('Could not encode img to JPEG')

                    jpg_bytes = jpg.tobytes()
                    self.wfile.write("--jpgboundary\r\n".encode())
                    self.send_header('Content-type', 'image/jpeg')
                    self.send_header('Content-length', len(jpg_bytes))
                    self.end_headers()
                    self.wfile.write(jpg_bytes)
                    time.sleep(self.server.read_delay)

                except (IOError, ConnectionError, cv2.error):
                    break
        elif self.path.endswith('.html'):
            self.send_response(http.HTTPStatus.OK)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(self.html_page.encode())
        else:
            self.send_response(http.HTTPStatus.NOT_FOUND)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(self.html_404_page.encode())


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""

    def __init__(self, 
                capture_path, 
                server_address, 
                loop_play, 
                RequestHandlerClass, 
                fps=30, 
                frame_shape=None, 
                bind_and_activate=True):
        HTTPServer.__init__(self, server_address, RequestHandlerClass, bind_and_activate)
        ThreadingMixIn.__init__(self)

        self._capture_path_idx = 0
        self._capture_path = capture_path
        self.fps = fps
        if frame_shape:
            self.frame_shape = frame_shape
        self.read_delay = 1. / fps
        self._lock = threading.Lock()

        current_source = self.video_path_handler(self._capture_path[0])
        self._camera = cv2.VideoCapture(current_source)
        self.loop_play = loop_play


    def video_path_handler(self, path):
        try:
            # verifies whether is a webcam
            return int(path)
        except TypeError:
            pass
        except ValueError:
            pass
        return path


    def open_video(self):
        fname = self.video_path_handler(self._capture_path[self._capture_path_idx])

        if not self._camera.open(fname):
            raise IOError('Could not open video {}'.format(fname))

    def read_frame(self):
        with self._lock:
            retval, img = self._camera.read()
            if not retval:
                if self.loop_play:
                    self._capture_path_idx += 1
                    if self._capture_path_idx >= len(self._capture_path):
                        self._capture_path_idx = 0
                fname= self.video_path_handler(self._capture_path[self._capture_path_idx])
                print("** Opening: {}".format(fname))
                self.open_video()
                if self.loop_play:
                    retval, img = self._camera.read()
                    return img
        return img

    def serve_forever(self, poll_interval=0.5):
        self.open_video()
        try:
            super().serve_forever(poll_interval)
        except KeyboardInterrupt:
            self._camera.release()

## Args parser for bool
def str2bool(v):
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-v', '--video-input', default=["sample.mp4"], action='append',
        help='Specify a video file path, rtsp stream address or camera value')
    parser.add_argument('-p', '--port', default=6420, type=int)
    parser.add_argument('-a', '--address', default="0.0.0.0")
    parser.add_argument('-s', '--shape', default=None, nargs='+', type=int)
    parser.add_argument("--loop", type=str2bool, nargs='?',
                        const=True, default=True,
                        help="loop video")

    parser.add_argument("--fps", default=30, type=int)
    args = parser.parse_args()
    print(args)

    address = args.address
    port = args.port
    videos = args.video_input

    # We are dropping the default arguments, if there are additional arguments passed as video-input
    if (len(videos) >1):
        videos = videos[1:]
    loop_play = args.loop
    fps=args.fps
    img_shape = None
    if args.shape:
        img_shape = tuple(args.shape)

    video = ""
    for x in videos:
        video=video+x+"  "
    print("project credit https://gist.github.com/n3wtron/4624820")
    print('{} served on http://{}:{}/cam.mjpg with {} fps'.format(video, address, port, fps))
    server = ThreadedHTTPServer(videos, (address, port), loop_play, CamHandler, fps, img_shape)
    server.serve_forever()

if __name__ == '__main__':
    main()
