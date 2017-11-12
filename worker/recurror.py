from threading import Timer

class Recurror(object):
    """Manages parallel thread"""
    def __init__(self, interval, function, *args, **kwargs):
        super(Recurror, self).__init__()
        self.args = args
        self.kwargs = kwargs
        self.function = function
        self.interval = interval

    def start(self, **params):
        self.callback(params)

    def stop(self):
        self.interval = False

    def callback(self, params):
        if self.interval:
            self.function(params)
            Timer(self.interval, self.callback, (params,)).start()