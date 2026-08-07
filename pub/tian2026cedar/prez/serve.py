#!/usr/bin/env python3
"""Serve this directory over HTTP so the deck can be viewed from another machine.

Usage:  python3 serve.py [--port 8123] [--bind 0.0.0.0]
Then open http://<host-ip>:8123/ in a browser.
"""

import argparse
import socket
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCacheHandler(SimpleHTTPRequestHandler):
    """Serve with no-store caching so rebuilt PDFs/HTML show up on plain reload."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))  # no packets sent; just picks the outbound interface
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--port", type=int, default=8123)
    ap.add_argument("--bind", default="0.0.0.0")
    args = ap.parse_args()

    handler = partial(NoCacheHandler, directory=str(Path(__file__).parent))
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    print(f"Serving {Path(__file__).parent}")
    print(f"  local:   http://127.0.0.1:{args.port}/")
    print(f"  network: http://{lan_ip()}:{args.port}/")
    print("Ctrl-C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
