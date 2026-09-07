import { createRequire as __triadCreateRequire } from 'node:module';
const require = __triadCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/pend/index.js
var require_pend = __commonJS({
  "../node_modules/pend/index.js"(exports, module) {
    module.exports = Pend;
    function Pend() {
      this.pending = 0;
      this.max = Infinity;
      this.listeners = [];
      this.waiting = [];
      this.error = null;
    }
    Pend.prototype.go = function(fn) {
      if (this.pending < this.max) {
        pendGo(this, fn);
      } else {
        this.waiting.push(fn);
      }
    };
    Pend.prototype.wait = function(cb) {
      if (this.pending === 0) {
        cb(this.error);
      } else {
        this.listeners.push(cb);
      }
    };
    Pend.prototype.hold = function() {
      return pendHold(this);
    };
    function pendHold(self) {
      self.pending += 1;
      var called = false;
      return onCb;
      function onCb(err) {
        if (called) throw new Error("callback called twice");
        called = true;
        self.error = self.error || err;
        self.pending -= 1;
        if (self.waiting.length > 0 && self.pending < self.max) {
          pendGo(self, self.waiting.shift());
        } else if (self.pending === 0) {
          var listeners = self.listeners;
          self.listeners = [];
          listeners.forEach(cbListener);
        }
      }
      function cbListener(listener) {
        listener(self.error);
      }
    }
    function pendGo(self, fn) {
      fn(pendHold(self));
    }
  }
});

// ../node_modules/fd-slicer/index.js
var require_fd_slicer = __commonJS({
  "../node_modules/fd-slicer/index.js"(exports) {
    var fs = __require("fs");
    var util = __require("util");
    var stream = __require("stream");
    var Readable = stream.Readable;
    var Writable = stream.Writable;
    var PassThrough = stream.PassThrough;
    var Pend = require_pend();
    var EventEmitter = __require("events").EventEmitter;
    exports.createFromBuffer = createFromBuffer;
    exports.createFromFd = createFromFd;
    exports.BufferSlicer = BufferSlicer;
    exports.FdSlicer = FdSlicer;
    util.inherits(FdSlicer, EventEmitter);
    function FdSlicer(fd, options) {
      options = options || {};
      EventEmitter.call(this);
      this.fd = fd;
      this.pend = new Pend();
      this.pend.max = 1;
      this.refCount = 0;
      this.autoClose = !!options.autoClose;
    }
    FdSlicer.prototype.read = function(buffer, offset, length, position, callback) {
      var self = this;
      self.pend.go(function(cb) {
        fs.read(self.fd, buffer, offset, length, position, function(err, bytesRead, buffer2) {
          cb();
          callback(err, bytesRead, buffer2);
        });
      });
    };
    FdSlicer.prototype.write = function(buffer, offset, length, position, callback) {
      var self = this;
      self.pend.go(function(cb) {
        fs.write(self.fd, buffer, offset, length, position, function(err, written, buffer2) {
          cb();
          callback(err, written, buffer2);
        });
      });
    };
    FdSlicer.prototype.createReadStream = function(options) {
      return new ReadStream(this, options);
    };
    FdSlicer.prototype.createWriteStream = function(options) {
      return new WriteStream(this, options);
    };
    FdSlicer.prototype.ref = function() {
      this.refCount += 1;
    };
    FdSlicer.prototype.unref = function() {
      var self = this;
      self.refCount -= 1;
      if (self.refCount > 0) return;
      if (self.refCount < 0) throw new Error("invalid unref");
      if (self.autoClose) {
        fs.close(self.fd, onCloseDone);
      }
      function onCloseDone(err) {
        if (err) {
          self.emit("error", err);
        } else {
          self.emit("close");
        }
      }
    };
    util.inherits(ReadStream, Readable);
    function ReadStream(context, options) {
      options = options || {};
      Readable.call(this, options);
      this.context = context;
      this.context.ref();
      this.start = options.start || 0;
      this.endOffset = options.end;
      this.pos = this.start;
      this.destroyed = false;
    }
    ReadStream.prototype._read = function(n) {
      var self = this;
      if (self.destroyed) return;
      var toRead = Math.min(self._readableState.highWaterMark, n);
      if (self.endOffset != null) {
        toRead = Math.min(toRead, self.endOffset - self.pos);
      }
      if (toRead <= 0) {
        self.destroyed = true;
        self.push(null);
        self.context.unref();
        return;
      }
      self.context.pend.go(function(cb) {
        if (self.destroyed) return cb();
        var buffer = new Buffer(toRead);
        fs.read(self.context.fd, buffer, 0, toRead, self.pos, function(err, bytesRead) {
          if (err) {
            self.destroy(err);
          } else if (bytesRead === 0) {
            self.destroyed = true;
            self.push(null);
            self.context.unref();
          } else {
            self.pos += bytesRead;
            self.push(buffer.slice(0, bytesRead));
          }
          cb();
        });
      });
    };
    ReadStream.prototype.destroy = function(err) {
      if (this.destroyed) return;
      err = err || new Error("stream destroyed");
      this.destroyed = true;
      this.emit("error", err);
      this.context.unref();
    };
    util.inherits(WriteStream, Writable);
    function WriteStream(context, options) {
      options = options || {};
      Writable.call(this, options);
      this.context = context;
      this.context.ref();
      this.start = options.start || 0;
      this.endOffset = options.end == null ? Infinity : +options.end;
      this.bytesWritten = 0;
      this.pos = this.start;
      this.destroyed = false;
      this.on("finish", this.destroy.bind(this));
    }
    WriteStream.prototype._write = function(buffer, encoding, callback) {
      var self = this;
      if (self.destroyed) return;
      if (self.pos + buffer.length > self.endOffset) {
        var err = new Error("maximum file length exceeded");
        err.code = "ETOOBIG";
        self.destroy();
        callback(err);
        return;
      }
      self.context.pend.go(function(cb) {
        if (self.destroyed) return cb();
        fs.write(self.context.fd, buffer, 0, buffer.length, self.pos, function(err2, bytes) {
          if (err2) {
            self.destroy();
            cb();
            callback(err2);
          } else {
            self.bytesWritten += bytes;
            self.pos += bytes;
            self.emit("progress");
            cb();
            callback();
          }
        });
      });
    };
    WriteStream.prototype.destroy = function() {
      if (this.destroyed) return;
      this.destroyed = true;
      this.context.unref();
    };
    util.inherits(BufferSlicer, EventEmitter);
    function BufferSlicer(buffer, options) {
      EventEmitter.call(this);
      options = options || {};
      this.refCount = 0;
      this.buffer = buffer;
      this.maxChunkSize = options.maxChunkSize || Number.MAX_SAFE_INTEGER;
    }
    BufferSlicer.prototype.read = function(buffer, offset, length, position, callback) {
      var end = position + length;
      var delta = end - this.buffer.length;
      var written = delta > 0 ? delta : length;
      this.buffer.copy(buffer, offset, position, end);
      setImmediate(function() {
        callback(null, written);
      });
    };
    BufferSlicer.prototype.write = function(buffer, offset, length, position, callback) {
      buffer.copy(this.buffer, position, offset, offset + length);
      setImmediate(function() {
        callback(null, length, buffer);
      });
    };
    BufferSlicer.prototype.createReadStream = function(options) {
      options = options || {};
      var readStream = new PassThrough(options);
      readStream.destroyed = false;
      readStream.start = options.start || 0;
      readStream.endOffset = options.end;
      readStream.pos = readStream.endOffset || this.buffer.length;
      var entireSlice = this.buffer.slice(readStream.start, readStream.pos);
      var offset = 0;
      while (true) {
        var nextOffset = offset + this.maxChunkSize;
        if (nextOffset >= entireSlice.length) {
          if (offset < entireSlice.length) {
            readStream.write(entireSlice.slice(offset, entireSlice.length));
          }
          break;
        }
        readStream.write(entireSlice.slice(offset, nextOffset));
        offset = nextOffset;
      }
      readStream.end();
      readStream.destroy = function() {
        readStream.destroyed = true;
      };
      return readStream;
    };
    BufferSlicer.prototype.createWriteStream = function(options) {
      var bufferSlicer = this;
      options = options || {};
      var writeStream = new Writable(options);
      writeStream.start = options.start || 0;
      writeStream.endOffset = options.end == null ? this.buffer.length : +options.end;
      writeStream.bytesWritten = 0;
      writeStream.pos = writeStream.start;
      writeStream.destroyed = false;
      writeStream._write = function(buffer, encoding, callback) {
        if (writeStream.destroyed) return;
        var end = writeStream.pos + buffer.length;
        if (end > writeStream.endOffset) {
          var err = new Error("maximum file length exceeded");
          err.code = "ETOOBIG";
          writeStream.destroyed = true;
          callback(err);
          return;
        }
        buffer.copy(bufferSlicer.buffer, writeStream.pos, 0, buffer.length);
        writeStream.bytesWritten += buffer.length;
        writeStream.pos = end;
        writeStream.emit("progress");
        callback();
      };
      writeStream.destroy = function() {
        writeStream.destroyed = true;
      };
      return writeStream;
    };
    BufferSlicer.prototype.ref = function() {
      this.refCount += 1;
    };
    BufferSlicer.prototype.unref = function() {
      this.refCount -= 1;
      if (this.refCount < 0) {
        throw new Error("invalid unref");
      }
    };
    function createFromBuffer(buffer, options) {
      return new BufferSlicer(buffer, options);
    }
    function createFromFd(fd, options) {
      return new FdSlicer(fd, options);
    }
  }
});

// ../node_modules/buffer-crc32/index.js
var require_buffer_crc32 = __commonJS({
  "../node_modules/buffer-crc32/index.js"(exports, module) {
    var Buffer2 = __require("buffer").Buffer;
    var CRC_TABLE = [
      0,
      1996959894,
      3993919788,
      2567524794,
      124634137,
      1886057615,
      3915621685,
      2657392035,
      249268274,
      2044508324,
      3772115230,
      2547177864,
      162941995,
      2125561021,
      3887607047,
      2428444049,
      498536548,
      1789927666,
      4089016648,
      2227061214,
      450548861,
      1843258603,
      4107580753,
      2211677639,
      325883990,
      1684777152,
      4251122042,
      2321926636,
      335633487,
      1661365465,
      4195302755,
      2366115317,
      997073096,
      1281953886,
      3579855332,
      2724688242,
      1006888145,
      1258607687,
      3524101629,
      2768942443,
      901097722,
      1119000684,
      3686517206,
      2898065728,
      853044451,
      1172266101,
      3705015759,
      2882616665,
      651767980,
      1373503546,
      3369554304,
      3218104598,
      565507253,
      1454621731,
      3485111705,
      3099436303,
      671266974,
      1594198024,
      3322730930,
      2970347812,
      795835527,
      1483230225,
      3244367275,
      3060149565,
      1994146192,
      31158534,
      2563907772,
      4023717930,
      1907459465,
      112637215,
      2680153253,
      3904427059,
      2013776290,
      251722036,
      2517215374,
      3775830040,
      2137656763,
      141376813,
      2439277719,
      3865271297,
      1802195444,
      476864866,
      2238001368,
      4066508878,
      1812370925,
      453092731,
      2181625025,
      4111451223,
      1706088902,
      314042704,
      2344532202,
      4240017532,
      1658658271,
      366619977,
      2362670323,
      4224994405,
      1303535960,
      984961486,
      2747007092,
      3569037538,
      1256170817,
      1037604311,
      2765210733,
      3554079995,
      1131014506,
      879679996,
      2909243462,
      3663771856,
      1141124467,
      855842277,
      2852801631,
      3708648649,
      1342533948,
      654459306,
      3188396048,
      3373015174,
      1466479909,
      544179635,
      3110523913,
      3462522015,
      1591671054,
      702138776,
      2966460450,
      3352799412,
      1504918807,
      783551873,
      3082640443,
      3233442989,
      3988292384,
      2596254646,
      62317068,
      1957810842,
      3939845945,
      2647816111,
      81470997,
      1943803523,
      3814918930,
      2489596804,
      225274430,
      2053790376,
      3826175755,
      2466906013,
      167816743,
      2097651377,
      4027552580,
      2265490386,
      503444072,
      1762050814,
      4150417245,
      2154129355,
      426522225,
      1852507879,
      4275313526,
      2312317920,
      282753626,
      1742555852,
      4189708143,
      2394877945,
      397917763,
      1622183637,
      3604390888,
      2714866558,
      953729732,
      1340076626,
      3518719985,
      2797360999,
      1068828381,
      1219638859,
      3624741850,
      2936675148,
      906185462,
      1090812512,
      3747672003,
      2825379669,
      829329135,
      1181335161,
      3412177804,
      3160834842,
      628085408,
      1382605366,
      3423369109,
      3138078467,
      570562233,
      1426400815,
      3317316542,
      2998733608,
      733239954,
      1555261956,
      3268935591,
      3050360625,
      752459403,
      1541320221,
      2607071920,
      3965973030,
      1969922972,
      40735498,
      2617837225,
      3943577151,
      1913087877,
      83908371,
      2512341634,
      3803740692,
      2075208622,
      213261112,
      2463272603,
      3855990285,
      2094854071,
      198958881,
      2262029012,
      4057260610,
      1759359992,
      534414190,
      2176718541,
      4139329115,
      1873836001,
      414664567,
      2282248934,
      4279200368,
      1711684554,
      285281116,
      2405801727,
      4167216745,
      1634467795,
      376229701,
      2685067896,
      3608007406,
      1308918612,
      956543938,
      2808555105,
      3495958263,
      1231636301,
      1047427035,
      2932959818,
      3654703836,
      1088359270,
      936918e3,
      2847714899,
      3736837829,
      1202900863,
      817233897,
      3183342108,
      3401237130,
      1404277552,
      615818150,
      3134207493,
      3453421203,
      1423857449,
      601450431,
      3009837614,
      3294710456,
      1567103746,
      711928724,
      3020668471,
      3272380065,
      1510334235,
      755167117
    ];
    if (typeof Int32Array !== "undefined") {
      CRC_TABLE = new Int32Array(CRC_TABLE);
    }
    function ensureBuffer(input) {
      if (Buffer2.isBuffer(input)) {
        return input;
      }
      var hasNewBufferAPI = typeof Buffer2.alloc === "function" && typeof Buffer2.from === "function";
      if (typeof input === "number") {
        return hasNewBufferAPI ? Buffer2.alloc(input) : new Buffer2(input);
      } else if (typeof input === "string") {
        return hasNewBufferAPI ? Buffer2.from(input) : new Buffer2(input);
      } else {
        throw new Error("input must be buffer, number, or string, received " + typeof input);
      }
    }
    function bufferizeInt(num) {
      var tmp = ensureBuffer(4);
      tmp.writeInt32BE(num, 0);
      return tmp;
    }
    function _crc32(buf, previous) {
      buf = ensureBuffer(buf);
      if (Buffer2.isBuffer(previous)) {
        previous = previous.readUInt32BE(0);
      }
      var crc = ~~previous ^ -1;
      for (var n = 0; n < buf.length; n++) {
        crc = CRC_TABLE[(crc ^ buf[n]) & 255] ^ crc >>> 8;
      }
      return crc ^ -1;
    }
    function crc32() {
      return bufferizeInt(_crc32.apply(null, arguments));
    }
    crc32.signed = function() {
      return _crc32.apply(null, arguments);
    };
    crc32.unsigned = function() {
      return _crc32.apply(null, arguments) >>> 0;
    };
    module.exports = crc32;
  }
});

// ../node_modules/yauzl/index.js
var require_yauzl = __commonJS({
  "../node_modules/yauzl/index.js"(exports) {
    var fs = __require("fs");
    var zlib = __require("zlib");
    var fd_slicer = require_fd_slicer();
    var crc32 = require_buffer_crc32();
    var util = __require("util");
    var EventEmitter = __require("events").EventEmitter;
    var Transform = __require("stream").Transform;
    var PassThrough = __require("stream").PassThrough;
    var Writable = __require("stream").Writable;
    exports.open = open;
    exports.fromFd = fromFd;
    exports.fromBuffer = fromBuffer;
    exports.fromRandomAccessReader = fromRandomAccessReader;
    exports.dosDateTimeToDate = dosDateTimeToDate;
    exports.validateFileName = validateFileName;
    exports.ZipFile = ZipFile;
    exports.Entry = Entry;
    exports.RandomAccessReader = RandomAccessReader;
    function open(path, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = null;
      }
      if (options == null) options = {};
      if (options.autoClose == null) options.autoClose = true;
      if (options.lazyEntries == null) options.lazyEntries = false;
      if (options.decodeStrings == null) options.decodeStrings = true;
      if (options.validateEntrySizes == null) options.validateEntrySizes = true;
      if (options.strictFileNames == null) options.strictFileNames = false;
      if (callback == null) callback = defaultCallback;
      fs.open(path, "r", function(err, fd) {
        if (err) return callback(err);
        fromFd(fd, options, function(err2, zipfile) {
          if (err2) fs.close(fd, defaultCallback);
          callback(err2, zipfile);
        });
      });
    }
    function fromFd(fd, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = null;
      }
      if (options == null) options = {};
      if (options.autoClose == null) options.autoClose = false;
      if (options.lazyEntries == null) options.lazyEntries = false;
      if (options.decodeStrings == null) options.decodeStrings = true;
      if (options.validateEntrySizes == null) options.validateEntrySizes = true;
      if (options.strictFileNames == null) options.strictFileNames = false;
      if (callback == null) callback = defaultCallback;
      fs.fstat(fd, function(err, stats) {
        if (err) return callback(err);
        var reader = fd_slicer.createFromFd(fd, { autoClose: true });
        fromRandomAccessReader(reader, stats.size, options, callback);
      });
    }
    function fromBuffer(buffer, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = null;
      }
      if (options == null) options = {};
      options.autoClose = false;
      if (options.lazyEntries == null) options.lazyEntries = false;
      if (options.decodeStrings == null) options.decodeStrings = true;
      if (options.validateEntrySizes == null) options.validateEntrySizes = true;
      if (options.strictFileNames == null) options.strictFileNames = false;
      var reader = fd_slicer.createFromBuffer(buffer, { maxChunkSize: 65536 });
      fromRandomAccessReader(reader, buffer.length, options, callback);
    }
    function fromRandomAccessReader(reader, totalSize, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = null;
      }
      if (options == null) options = {};
      if (options.autoClose == null) options.autoClose = true;
      if (options.lazyEntries == null) options.lazyEntries = false;
      if (options.decodeStrings == null) options.decodeStrings = true;
      var decodeStrings = !!options.decodeStrings;
      if (options.validateEntrySizes == null) options.validateEntrySizes = true;
      if (options.strictFileNames == null) options.strictFileNames = false;
      if (callback == null) callback = defaultCallback;
      if (typeof totalSize !== "number") throw new Error("expected totalSize parameter to be a number");
      if (totalSize > Number.MAX_SAFE_INTEGER) {
        throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
      }
      reader.ref();
      var eocdrWithoutCommentSize = 22;
      var maxCommentSize = 65535;
      var bufferSize = Math.min(eocdrWithoutCommentSize + maxCommentSize, totalSize);
      var buffer = newBuffer(bufferSize);
      var bufferReadStart = totalSize - buffer.length;
      readAndAssertNoEof(reader, buffer, 0, bufferSize, bufferReadStart, function(err) {
        if (err) return callback(err);
        for (var i = bufferSize - eocdrWithoutCommentSize; i >= 0; i -= 1) {
          if (buffer.readUInt32LE(i) !== 101010256) continue;
          var eocdrBuffer = buffer.slice(i);
          var diskNumber = eocdrBuffer.readUInt16LE(4);
          if (diskNumber !== 0) {
            return callback(new Error("multi-disk zip files are not supported: found disk number: " + diskNumber));
          }
          var entryCount = eocdrBuffer.readUInt16LE(10);
          var centralDirectoryOffset = eocdrBuffer.readUInt32LE(16);
          var commentLength = eocdrBuffer.readUInt16LE(20);
          var expectedCommentLength = eocdrBuffer.length - eocdrWithoutCommentSize;
          if (commentLength !== expectedCommentLength) {
            return callback(new Error("invalid comment length. expected: " + expectedCommentLength + ". found: " + commentLength));
          }
          var comment = decodeStrings ? decodeBuffer(eocdrBuffer, 22, eocdrBuffer.length, false) : eocdrBuffer.slice(22);
          if (!(entryCount === 65535 || centralDirectoryOffset === 4294967295)) {
            return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries, decodeStrings, options.validateEntrySizes, options.strictFileNames));
          }
          var zip64EocdlBuffer = newBuffer(20);
          var zip64EocdlOffset = bufferReadStart + i - zip64EocdlBuffer.length;
          readAndAssertNoEof(reader, zip64EocdlBuffer, 0, zip64EocdlBuffer.length, zip64EocdlOffset, function(err2) {
            if (err2) return callback(err2);
            if (zip64EocdlBuffer.readUInt32LE(0) !== 117853008) {
              return callback(new Error("invalid zip64 end of central directory locator signature"));
            }
            var zip64EocdrOffset = readUInt64LE(zip64EocdlBuffer, 8);
            var zip64EocdrBuffer = newBuffer(56);
            readAndAssertNoEof(reader, zip64EocdrBuffer, 0, zip64EocdrBuffer.length, zip64EocdrOffset, function(err3) {
              if (err3) return callback(err3);
              if (zip64EocdrBuffer.readUInt32LE(0) !== 101075792) {
                return callback(new Error("invalid zip64 end of central directory record signature"));
              }
              entryCount = readUInt64LE(zip64EocdrBuffer, 32);
              centralDirectoryOffset = readUInt64LE(zip64EocdrBuffer, 48);
              return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries, decodeStrings, options.validateEntrySizes, options.strictFileNames));
            });
          });
          return;
        }
        callback(new Error("end of central directory record signature not found"));
      });
    }
    util.inherits(ZipFile, EventEmitter);
    function ZipFile(reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, lazyEntries, decodeStrings, validateEntrySizes, strictFileNames) {
      var self = this;
      EventEmitter.call(self);
      self.reader = reader;
      self.reader.on("error", function(err) {
        emitError(self, err);
      });
      self.reader.once("close", function() {
        self.emit("close");
      });
      self.readEntryCursor = centralDirectoryOffset;
      self.fileSize = fileSize;
      self.entryCount = entryCount;
      self.comment = comment;
      self.entriesRead = 0;
      self.autoClose = !!autoClose;
      self.lazyEntries = !!lazyEntries;
      self.decodeStrings = !!decodeStrings;
      self.validateEntrySizes = !!validateEntrySizes;
      self.strictFileNames = !!strictFileNames;
      self.isOpen = true;
      self.emittedError = false;
      if (!self.lazyEntries) self._readEntry();
    }
    ZipFile.prototype.close = function() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.reader.unref();
    };
    function emitErrorAndAutoClose(self, err) {
      if (self.autoClose) self.close();
      emitError(self, err);
    }
    function emitError(self, err) {
      if (self.emittedError) return;
      self.emittedError = true;
      self.emit("error", err);
    }
    ZipFile.prototype.readEntry = function() {
      if (!this.lazyEntries) throw new Error("readEntry() called without lazyEntries:true");
      this._readEntry();
    };
    ZipFile.prototype._readEntry = function() {
      var self = this;
      if (self.entryCount === self.entriesRead) {
        setImmediate(function() {
          if (self.autoClose) self.close();
          if (self.emittedError) return;
          self.emit("end");
        });
        return;
      }
      if (self.emittedError) return;
      var buffer = newBuffer(46);
      readAndAssertNoEof(self.reader, buffer, 0, buffer.length, self.readEntryCursor, function(err) {
        if (err) return emitErrorAndAutoClose(self, err);
        if (self.emittedError) return;
        var entry = new Entry();
        var signature = buffer.readUInt32LE(0);
        if (signature !== 33639248) return emitErrorAndAutoClose(self, new Error("invalid central directory file header signature: 0x" + signature.toString(16)));
        entry.versionMadeBy = buffer.readUInt16LE(4);
        entry.versionNeededToExtract = buffer.readUInt16LE(6);
        entry.generalPurposeBitFlag = buffer.readUInt16LE(8);
        entry.compressionMethod = buffer.readUInt16LE(10);
        entry.lastModFileTime = buffer.readUInt16LE(12);
        entry.lastModFileDate = buffer.readUInt16LE(14);
        entry.crc32 = buffer.readUInt32LE(16);
        entry.compressedSize = buffer.readUInt32LE(20);
        entry.uncompressedSize = buffer.readUInt32LE(24);
        entry.fileNameLength = buffer.readUInt16LE(28);
        entry.extraFieldLength = buffer.readUInt16LE(30);
        entry.fileCommentLength = buffer.readUInt16LE(32);
        entry.internalFileAttributes = buffer.readUInt16LE(36);
        entry.externalFileAttributes = buffer.readUInt32LE(38);
        entry.relativeOffsetOfLocalHeader = buffer.readUInt32LE(42);
        if (entry.generalPurposeBitFlag & 64) return emitErrorAndAutoClose(self, new Error("strong encryption is not supported"));
        self.readEntryCursor += 46;
        buffer = newBuffer(entry.fileNameLength + entry.extraFieldLength + entry.fileCommentLength);
        readAndAssertNoEof(self.reader, buffer, 0, buffer.length, self.readEntryCursor, function(err2) {
          if (err2) return emitErrorAndAutoClose(self, err2);
          if (self.emittedError) return;
          var isUtf8 = (entry.generalPurposeBitFlag & 2048) !== 0;
          entry.fileName = self.decodeStrings ? decodeBuffer(buffer, 0, entry.fileNameLength, isUtf8) : buffer.slice(0, entry.fileNameLength);
          var fileCommentStart = entry.fileNameLength + entry.extraFieldLength;
          var extraFieldBuffer = buffer.slice(entry.fileNameLength, fileCommentStart);
          entry.extraFields = [];
          var i = 0;
          while (i < extraFieldBuffer.length - 3) {
            var headerId = extraFieldBuffer.readUInt16LE(i + 0);
            var dataSize = extraFieldBuffer.readUInt16LE(i + 2);
            var dataStart = i + 4;
            var dataEnd = dataStart + dataSize;
            if (dataEnd > extraFieldBuffer.length) return emitErrorAndAutoClose(self, new Error("extra field length exceeds extra field buffer size"));
            var dataBuffer = newBuffer(dataSize);
            extraFieldBuffer.copy(dataBuffer, 0, dataStart, dataEnd);
            entry.extraFields.push({
              id: headerId,
              data: dataBuffer
            });
            i = dataEnd;
          }
          entry.fileComment = self.decodeStrings ? decodeBuffer(buffer, fileCommentStart, fileCommentStart + entry.fileCommentLength, isUtf8) : buffer.slice(fileCommentStart, fileCommentStart + entry.fileCommentLength);
          entry.comment = entry.fileComment;
          self.readEntryCursor += buffer.length;
          self.entriesRead += 1;
          if (entry.uncompressedSize === 4294967295 || entry.compressedSize === 4294967295 || entry.relativeOffsetOfLocalHeader === 4294967295) {
            var zip64EiefBuffer = null;
            for (var i = 0; i < entry.extraFields.length; i++) {
              var extraField = entry.extraFields[i];
              if (extraField.id === 1) {
                zip64EiefBuffer = extraField.data;
                break;
              }
            }
            if (zip64EiefBuffer == null) {
              return emitErrorAndAutoClose(self, new Error("expected zip64 extended information extra field"));
            }
            var index = 0;
            if (entry.uncompressedSize === 4294967295) {
              if (index + 8 > zip64EiefBuffer.length) {
                return emitErrorAndAutoClose(self, new Error("zip64 extended information extra field does not include uncompressed size"));
              }
              entry.uncompressedSize = readUInt64LE(zip64EiefBuffer, index);
              index += 8;
            }
            if (entry.compressedSize === 4294967295) {
              if (index + 8 > zip64EiefBuffer.length) {
                return emitErrorAndAutoClose(self, new Error("zip64 extended information extra field does not include compressed size"));
              }
              entry.compressedSize = readUInt64LE(zip64EiefBuffer, index);
              index += 8;
            }
            if (entry.relativeOffsetOfLocalHeader === 4294967295) {
              if (index + 8 > zip64EiefBuffer.length) {
                return emitErrorAndAutoClose(self, new Error("zip64 extended information extra field does not include relative header offset"));
              }
              entry.relativeOffsetOfLocalHeader = readUInt64LE(zip64EiefBuffer, index);
              index += 8;
            }
          }
          if (self.decodeStrings) {
            for (var i = 0; i < entry.extraFields.length; i++) {
              var extraField = entry.extraFields[i];
              if (extraField.id === 28789) {
                if (extraField.data.length < 6) {
                  continue;
                }
                if (extraField.data.readUInt8(0) !== 1) {
                  continue;
                }
                var oldNameCrc32 = extraField.data.readUInt32LE(1);
                if (crc32.unsigned(buffer.slice(0, entry.fileNameLength)) !== oldNameCrc32) {
                  continue;
                }
                entry.fileName = decodeBuffer(extraField.data, 5, extraField.data.length, true);
                break;
              }
            }
          }
          if (self.validateEntrySizes && entry.compressionMethod === 0) {
            var expectedCompressedSize = entry.uncompressedSize;
            if (entry.isEncrypted()) {
              expectedCompressedSize += 12;
            }
            if (entry.compressedSize !== expectedCompressedSize) {
              var msg = "compressed/uncompressed size mismatch for stored file: " + entry.compressedSize + " != " + entry.uncompressedSize;
              return emitErrorAndAutoClose(self, new Error(msg));
            }
          }
          if (self.decodeStrings) {
            if (!self.strictFileNames) {
              entry.fileName = entry.fileName.replace(/\\/g, "/");
            }
            var errorMessage = validateFileName(entry.fileName, self.validateFileNameOptions);
            if (errorMessage != null) return emitErrorAndAutoClose(self, new Error(errorMessage));
          }
          self.emit("entry", entry);
          if (!self.lazyEntries) self._readEntry();
        });
      });
    };
    ZipFile.prototype.openReadStream = function(entry, options, callback) {
      var self = this;
      var relativeStart = 0;
      var relativeEnd = entry.compressedSize;
      if (callback == null) {
        callback = options;
        options = {};
      } else {
        if (options.decrypt != null) {
          if (!entry.isEncrypted()) {
            throw new Error("options.decrypt can only be specified for encrypted entries");
          }
          if (options.decrypt !== false) throw new Error("invalid options.decrypt value: " + options.decrypt);
          if (entry.isCompressed()) {
            if (options.decompress !== false) throw new Error("entry is encrypted and compressed, and options.decompress !== false");
          }
        }
        if (options.decompress != null) {
          if (!entry.isCompressed()) {
            throw new Error("options.decompress can only be specified for compressed entries");
          }
          if (!(options.decompress === false || options.decompress === true)) {
            throw new Error("invalid options.decompress value: " + options.decompress);
          }
        }
        if (options.start != null || options.end != null) {
          if (entry.isCompressed() && options.decompress !== false) {
            throw new Error("start/end range not allowed for compressed entry without options.decompress === false");
          }
          if (entry.isEncrypted() && options.decrypt !== false) {
            throw new Error("start/end range not allowed for encrypted entry without options.decrypt === false");
          }
        }
        if (options.start != null) {
          relativeStart = options.start;
          if (relativeStart < 0) throw new Error("options.start < 0");
          if (relativeStart > entry.compressedSize) throw new Error("options.start > entry.compressedSize");
        }
        if (options.end != null) {
          relativeEnd = options.end;
          if (relativeEnd < 0) throw new Error("options.end < 0");
          if (relativeEnd > entry.compressedSize) throw new Error("options.end > entry.compressedSize");
          if (relativeEnd < relativeStart) throw new Error("options.end < options.start");
        }
      }
      if (!self.isOpen) return callback(new Error("closed"));
      if (entry.isEncrypted()) {
        if (options.decrypt !== false) return callback(new Error("entry is encrypted, and options.decrypt !== false"));
      }
      self.reader.ref();
      var buffer = newBuffer(30);
      readAndAssertNoEof(self.reader, buffer, 0, buffer.length, entry.relativeOffsetOfLocalHeader, function(err) {
        try {
          if (err) return callback(err);
          var signature = buffer.readUInt32LE(0);
          if (signature !== 67324752) {
            return callback(new Error("invalid local file header signature: 0x" + signature.toString(16)));
          }
          var fileNameLength = buffer.readUInt16LE(26);
          var extraFieldLength = buffer.readUInt16LE(28);
          var localFileHeaderEnd = entry.relativeOffsetOfLocalHeader + buffer.length + fileNameLength + extraFieldLength;
          var decompress;
          if (entry.compressionMethod === 0) {
            decompress = false;
          } else if (entry.compressionMethod === 8) {
            decompress = options.decompress != null ? options.decompress : true;
          } else {
            return callback(new Error("unsupported compression method: " + entry.compressionMethod));
          }
          var fileDataStart = localFileHeaderEnd;
          var fileDataEnd = fileDataStart + entry.compressedSize;
          if (entry.compressedSize !== 0) {
            if (fileDataEnd > self.fileSize) {
              return callback(new Error("file data overflows file bounds: " + fileDataStart + " + " + entry.compressedSize + " > " + self.fileSize));
            }
          }
          var readStream = self.reader.createReadStream({
            start: fileDataStart + relativeStart,
            end: fileDataStart + relativeEnd
          });
          var endpointStream = readStream;
          if (decompress) {
            var destroyed = false;
            var inflateFilter = zlib.createInflateRaw();
            readStream.on("error", function(err2) {
              setImmediate(function() {
                if (!destroyed) inflateFilter.emit("error", err2);
              });
            });
            readStream.pipe(inflateFilter);
            if (self.validateEntrySizes) {
              endpointStream = new AssertByteCountStream(entry.uncompressedSize);
              inflateFilter.on("error", function(err2) {
                setImmediate(function() {
                  if (!destroyed) endpointStream.emit("error", err2);
                });
              });
              inflateFilter.pipe(endpointStream);
            } else {
              endpointStream = inflateFilter;
            }
            endpointStream.destroy = function() {
              destroyed = true;
              if (inflateFilter !== endpointStream) inflateFilter.unpipe(endpointStream);
              readStream.unpipe(inflateFilter);
              readStream.destroy();
            };
          }
          callback(null, endpointStream);
        } finally {
          self.reader.unref();
        }
      });
    };
    function Entry() {
    }
    Entry.prototype.getLastModDate = function() {
      return dosDateTimeToDate(this.lastModFileDate, this.lastModFileTime);
    };
    Entry.prototype.isEncrypted = function() {
      return (this.generalPurposeBitFlag & 1) !== 0;
    };
    Entry.prototype.isCompressed = function() {
      return this.compressionMethod === 8;
    };
    function dosDateTimeToDate(date, time) {
      var day = date & 31;
      var month = (date >> 5 & 15) - 1;
      var year = (date >> 9 & 127) + 1980;
      var millisecond = 0;
      var second = (time & 31) * 2;
      var minute = time >> 5 & 63;
      var hour = time >> 11 & 31;
      return new Date(year, month, day, hour, minute, second, millisecond);
    }
    function validateFileName(fileName) {
      if (fileName.indexOf("\\") !== -1) {
        return "invalid characters in fileName: " + fileName;
      }
      if (/^[a-zA-Z]:/.test(fileName) || /^\//.test(fileName)) {
        return "absolute path: " + fileName;
      }
      if (fileName.split("/").indexOf("..") !== -1) {
        return "invalid relative path: " + fileName;
      }
      return null;
    }
    function readAndAssertNoEof(reader, buffer, offset, length, position, callback) {
      if (length === 0) {
        return setImmediate(function() {
          callback(null, newBuffer(0));
        });
      }
      reader.read(buffer, offset, length, position, function(err, bytesRead) {
        if (err) return callback(err);
        if (bytesRead < length) {
          return callback(new Error("unexpected EOF"));
        }
        callback();
      });
    }
    util.inherits(AssertByteCountStream, Transform);
    function AssertByteCountStream(byteCount) {
      Transform.call(this);
      this.actualByteCount = 0;
      this.expectedByteCount = byteCount;
    }
    AssertByteCountStream.prototype._transform = function(chunk, encoding, cb) {
      this.actualByteCount += chunk.length;
      if (this.actualByteCount > this.expectedByteCount) {
        var msg = "too many bytes in the stream. expected " + this.expectedByteCount + ". got at least " + this.actualByteCount;
        return cb(new Error(msg));
      }
      cb(null, chunk);
    };
    AssertByteCountStream.prototype._flush = function(cb) {
      if (this.actualByteCount < this.expectedByteCount) {
        var msg = "not enough bytes in the stream. expected " + this.expectedByteCount + ". got only " + this.actualByteCount;
        return cb(new Error(msg));
      }
      cb();
    };
    util.inherits(RandomAccessReader, EventEmitter);
    function RandomAccessReader() {
      EventEmitter.call(this);
      this.refCount = 0;
    }
    RandomAccessReader.prototype.ref = function() {
      this.refCount += 1;
    };
    RandomAccessReader.prototype.unref = function() {
      var self = this;
      self.refCount -= 1;
      if (self.refCount > 0) return;
      if (self.refCount < 0) throw new Error("invalid unref");
      self.close(onCloseDone);
      function onCloseDone(err) {
        if (err) return self.emit("error", err);
        self.emit("close");
      }
    };
    RandomAccessReader.prototype.createReadStream = function(options) {
      var start = options.start;
      var end = options.end;
      if (start === end) {
        var emptyStream = new PassThrough();
        setImmediate(function() {
          emptyStream.end();
        });
        return emptyStream;
      }
      var stream = this._readStreamForRange(start, end);
      var destroyed = false;
      var refUnrefFilter = new RefUnrefFilter(this);
      stream.on("error", function(err) {
        setImmediate(function() {
          if (!destroyed) refUnrefFilter.emit("error", err);
        });
      });
      refUnrefFilter.destroy = function() {
        stream.unpipe(refUnrefFilter);
        refUnrefFilter.unref();
        stream.destroy();
      };
      var byteCounter = new AssertByteCountStream(end - start);
      refUnrefFilter.on("error", function(err) {
        setImmediate(function() {
          if (!destroyed) byteCounter.emit("error", err);
        });
      });
      byteCounter.destroy = function() {
        destroyed = true;
        refUnrefFilter.unpipe(byteCounter);
        refUnrefFilter.destroy();
      };
      return stream.pipe(refUnrefFilter).pipe(byteCounter);
    };
    RandomAccessReader.prototype._readStreamForRange = function(start, end) {
      throw new Error("not implemented");
    };
    RandomAccessReader.prototype.read = function(buffer, offset, length, position, callback) {
      var readStream = this.createReadStream({ start: position, end: position + length });
      var writeStream = new Writable();
      var written = 0;
      writeStream._write = function(chunk, encoding, cb) {
        chunk.copy(buffer, offset + written, 0, chunk.length);
        written += chunk.length;
        cb();
      };
      writeStream.on("finish", callback);
      readStream.on("error", function(error) {
        callback(error);
      });
      readStream.pipe(writeStream);
    };
    RandomAccessReader.prototype.close = function(callback) {
      setImmediate(callback);
    };
    util.inherits(RefUnrefFilter, PassThrough);
    function RefUnrefFilter(context) {
      PassThrough.call(this);
      this.context = context;
      this.context.ref();
      this.unreffedYet = false;
    }
    RefUnrefFilter.prototype._flush = function(cb) {
      this.unref();
      cb();
    };
    RefUnrefFilter.prototype.unref = function(cb) {
      if (this.unreffedYet) return;
      this.unreffedYet = true;
      this.context.unref();
    };
    var cp437 = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0";
    function decodeBuffer(buffer, start, end, isUtf8) {
      if (isUtf8) {
        return buffer.toString("utf8", start, end);
      } else {
        var result = "";
        for (var i = start; i < end; i++) {
          result += cp437[buffer[i]];
        }
        return result;
      }
    }
    function readUInt64LE(buffer, offset) {
      var lower32 = buffer.readUInt32LE(offset);
      var upper32 = buffer.readUInt32LE(offset + 4);
      return upper32 * 4294967296 + lower32;
    }
    var newBuffer;
    if (typeof Buffer.allocUnsafe === "function") {
      newBuffer = function(len) {
        return Buffer.allocUnsafe(len);
      };
    } else {
      newBuffer = function(len) {
        return new Buffer(len);
      };
    }
    function defaultCallback(err) {
      if (err) throw err;
    }
  }
});

// src/memory/api.ts
import { URL as URL2 } from "node:url";

// src/memory/types.ts
var DEFAULT_CONFIG = {
  extractEveryTurns: 1,
  compileEveryTurns: 10,
  compileThreshold: 4.5,
  decayLambda: 0.02,
  hitBonus: 2,
  injectTokenBudget: 6e3,
  injectRefreshSteps: 8,
  dailyCompileEnabled: true,
  extractMaxChars: 6e3,
  minImportance: 7,
  consolidateEnabled: true,
  // 增量演进模式：一次只整理「最近更新」的 20 条（对齐 ReMe auto_dream 的小撮
  // 单元策略）。20 条约 3-5K 字符：慢模型实测 ~230s 可完成（<300s 超时），
  // 快模型十几秒；不做全库 200 条大输入（4 万字符必超时）。
  consolidateMaxEntries: 20,
  // 300s：60s 默认对 200 条输入（3-4 万字符）远不够——实测 bai/vision 系
  // 模型连 70 条都会 60s 超时，导致整理永远失败且被误报「无需整理」。
  consolidateTimeoutMs: 3e5,
  logApiRequests: false,
  injectDefaultEnabled: true,
  injectTopK: 8,
  entryLimit: 500,
  pruneNeverHitDays: 21,
  embeddingProvider: "off",
  embeddingBaseUrl: "",
  embeddingModel: "text-embedding-3-small",
  embeddingApiKey: "",
  embeddingDimensions: 0
};
var CONFIG_NUMBER_BOUNDS = {
  extractEveryTurns: { min: 1, max: 100, int: true, step: 1 },
  compileEveryTurns: { min: 1, max: 500, int: true, step: 1 },
  compileThreshold: { min: 0, max: 20, int: false, step: 0.5 },
  decayLambda: { min: 0, max: 0.5, int: false, step: 0.01 },
  hitBonus: { min: 0, max: 10, int: false, step: 0.5 },
  injectTokenBudget: { min: 1e3, max: 6e4, int: true, step: 500 },
  injectRefreshSteps: { min: 1, max: 200, int: true, step: 1 },
  extractMaxChars: { min: 500, max: 6e4, int: true, step: 500 },
  minImportance: { min: 1, max: 10, int: false, step: 0.5 },
  consolidateMaxEntries: { min: 10, max: 2e3, int: true, step: 10 },
  consolidateTimeoutMs: { min: 5e3, max: 6e5, int: true, step: 5e3 },
  injectTopK: { min: 1, max: 50, int: true, step: 1 },
  entryLimit: { min: 50, max: 1e5, int: true, step: 50 },
  pruneNeverHitDays: { min: 0, max: 3650, int: true, step: 1 }
};
var CONFIG_NUMBER_KEYS = Object.keys(CONFIG_NUMBER_BOUNDS);
var CONFIG_BOOLEAN_KEYS = ["dailyCompileEnabled", "consolidateEnabled", "logApiRequests", "injectDefaultEnabled"];
function applyConfigOverrides(config, candidate) {
  const applied = {};
  if (candidate === null || typeof candidate !== "object") return applied;
  const raw = candidate;
  for (const key of CONFIG_NUMBER_KEYS) {
    const value = raw[key];
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    const bounds = CONFIG_NUMBER_BOUNDS[key];
    let next = Math.min(bounds.max, Math.max(bounds.min, value));
    if (bounds.int) next = Math.round(next);
    else next = Math.round(next * 100) / 100;
    config[key] = next;
    applied[key] = next;
  }
  for (const key of CONFIG_BOOLEAN_KEYS) {
    const value = raw[key];
    if (typeof value === "boolean") {
      ;
      config[key] = value;
      applied[key] = value;
    }
  }
  for (const key of CONFIG_STRING_KEYS) {
    if (typeof raw[key] === "string") {
      ;
      config[key] = raw[key];
      applied[key] = raw[key];
    }
  }
  const provider = raw.embeddingProvider;
  if (provider === "off" || provider === "http" || provider === "local") {
    ;
    config.embeddingProvider = provider;
    applied.embeddingProvider = provider;
  }
  const dims = raw.embeddingDimensions;
  if (typeof dims === "number" && Number.isFinite(dims) && dims >= 0) {
    const rounded = Math.round(dims);
    config.embeddingDimensions = rounded;
    applied.embeddingDimensions = rounded;
  }
  return applied;
}
function publicConfig(config) {
  const out = {};
  for (const key of CONFIG_NUMBER_KEYS) out[key] = config[key];
  for (const key of CONFIG_BOOLEAN_KEYS) out[key] = config[key];
  for (const key of CONFIG_STRING_KEYS) out[key] = config[key];
  out.embeddingProvider = config.embeddingProvider;
  out.embeddingDimensions = config.embeddingDimensions;
  return out;
}
var CONFIG_STRING_KEYS = ["embeddingBaseUrl", "embeddingModel", "embeddingApiKey"];

// src/memory/engine/store.ts
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
function memoryHome() {
  const dshHome2 = process.env.DSH_HOME ?? join(homedir(), ".dsh");
  return join(dshHome2, "memories", "dsh-memory");
}
function projectHashOf(cwd) {
  return createHash("sha1").update(cwd).digest("hex").slice(0, 12);
}
function entryIdOf(content, scope, projectHash) {
  const key = `${scope}\0${projectHash ?? ""}\0${content.trim()}`;
  return `mem_${createHash("sha1").update(key).digest("hex").slice(0, 16)}`;
}
function localDate(date = /* @__PURE__ */ new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function nowIso() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function atomicWriteText(file, content) {
  await mkdir(join(file, ".."), { recursive: true });
  const temp = `${file}.tmp`;
  await writeFile(temp, content, "utf8");
  await rename(temp, file);
}
async function atomicWriteJson(file, value) {
  await atomicWriteText(file, `${JSON.stringify(value, null, 2)}
`);
}
async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}
async function appendJsonl(file, value) {
  await mkdir(join(file, ".."), { recursive: true });
  const { appendFile } = await import("node:fs/promises");
  await appendFile(file, `${JSON.stringify(value)}
`, "utf8");
}
async function readJsonl(file) {
  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    return [];
  }
  const out = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "") continue;
    try {
      out.push(JSON.parse(trimmed));
    } catch {
    }
  }
  return out;
}
var REVISION_KEEP = 20;
var MemoryStore = class _MemoryStore {
  root;
  /** 回刷 debounce（毫秒）：合并短窗口内的多次写。 */
  static FLUSH_DEBOUNCE_MS = 500;
  /** 内存态条目（权威副本；磁盘 entries.json 是它的节流回刷镜像）。 */
  entries = [];
  /** 内存态是否落后于磁盘（有待回刷）。 */
  dirty = false;
  /** 节流回刷计时器。 */
  flushTimer = null;
  constructor(root = memoryHome()) {
    this.root = root;
    const data = readJsonSync(
      this.entriesFile(),
      { version: 2, entries: [] }
    );
    this.entries = migrateEntries(data.entries);
  }
  // ── 路径 ────────────────────────────────────────────────────────────
  entriesFile() {
    return join(this.root, "store", "entries.json");
  }
  stateFile() {
    return join(this.root, "store", "state.json");
  }
  configFile() {
    return join(this.root, "store", "config.json");
  }
  /** 读运行时配置覆盖（config.json；缺失返回空）。 */
  readConfigSync() {
    return readJsonSync(this.configFile(), {});
  }
  /** 写运行时配置覆盖（面板设置持久化）。 */
  async writeConfig(config) {
    await atomicWriteJson(this.configFile(), config);
  }
  changesFile(date) {
    return join(this.root, "changes", `${date}.jsonl`);
  }
  globalDir() {
    return join(this.root, "global");
  }
  projectDir(hash) {
    return join(this.root, "projects", hash);
  }
  dailyFile(date) {
    return join(this.root, "daily", `${date}.md`);
  }
  // ── 条目 ────────────────────────────────────────────────────────────
  /** 全量条目索引（内存快照的浅拷贝，避免外部误改内存态）。 */
  async readEntries() {
    return [...this.entries];
  }
  /** 节流回刷：标记 dirty 并在 debounce 后落盘（合并写放大）。 */
  scheduleFlush() {
    this.dirty = true;
    if (this.flushTimer !== null) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      void this.flushNow().catch(() => void 0);
    }, _MemoryStore.FLUSH_DEBOUNCE_MS);
  }
  /** 立即落盘（幂等；dispose / 退出前调用）。 */
  async flush() {
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flushNow();
  }
  async flushNow() {
    if (!this.dirty) return;
    this.dirty = false;
    await atomicWriteJson(this.entriesFile(), { version: 2, entries: this.entries });
  }
  /**
   * 修改内存态条目（fn 原地修改传入数组或返回替换数组），随后节流回刷。
   * 单线程下内存数组的同步操作天然原子，无需额外写串行队列。
   */
  async mutateEntries(fn) {
    const result = await fn(this.entries);
    this.scheduleFlush();
    return result;
  }
  async getEntry(id) {
    return this.entries.find((entry) => entry.id === id);
  }
  /**
   * 新增或更新（同 id 合并）。返回 { created, entry }。
   * 同时按去重逻辑：新增时若同内容（同 scope+projectHash）已存在则合并为 update。
   */
  async upsertEntry(next) {
    return this.mutateEntries((entries) => {
      const id = entryIdOf(next.content, next.scope, next.projectHash);
      const existing = entries.find((entry2) => entry2.id === id);
      const now = nowIso();
      let entry;
      if (existing !== void 0) {
        const revived = existing.deprecated === true ? { ...existing, deprecated: void 0, deprecatedAt: void 0, deprecatedReason: void 0, supersededBy: void 0 } : existing;
        entry = {
          ...revived,
          content: next.content,
          tags: mergeTags(revived.tags, next.tags),
          pinned: next.pinned ?? revived.pinned,
          importance: Math.max(revived.importance, next.importance ?? revived.importance),
          layer: next.layer ?? revived.layer,
          updatedAt: now,
          version: revived.version + 1
        };
        entries.splice(entries.indexOf(existing), 1, entry);
        return { created: false, entry };
      }
      entry = {
        id,
        content: next.content,
        scope: next.scope,
        projectHash: next.scope === "project" ? next.projectHash : null,
        tags: next.tags ?? [],
        pinned: next.pinned ?? false,
        createdAt: now,
        updatedAt: now,
        importance: next.importance ?? 10,
        lastHitAt: null,
        layer: next.layer ?? "short",
        source: next.source ?? "extract",
        version: 1,
        confidence: next.confidence ?? (next.source === "manual" ? 1 : 0.6),
        verified: next.source === "manual",
        kind: next.kind ?? inferKind(next.tags),
        provenance: next.provenance,
        embedding: void 0
      };
      entries.push(entry);
      return { created: true, entry };
    });
  }
  /**
   * 替换单条（用于裁决操作：改内容/标签/移项目/置顶/启用）。返回新条目；不存在返回 undefined。
   *
   * id 是 content+scope+projectHash 的稳定派生值，所以内容或归属变化时必须重算 id，
   * 否则 id 与内容脱钩：后续 upsertEntry（提取/手动添加）算出的新 id 找不到本条，
   * 会把同一条记忆再插一遍（面板出现重复条目）。若新 id 已存在（改成了与另一条
   * 完全相同的内容），把两条合并为一条，保留较高的 importance 与并集标签。
   */
  async patchEntry(id, patch) {
    return this.mutateEntries((entries) => {
      const index = entries.findIndex((entry) => entry.id === id);
      if (index === -1) return void 0;
      const current = entries[index];
      const merged = {
        ...current,
        ...patch,
        id,
        updatedAt: nowIso(),
        version: current.version + 1,
        verified: true
      };
      if (merged.scope === "global") merged.projectHash = null;
      const nextId = entryIdOf(merged.content, merged.scope, merged.projectHash);
      if (nextId === id) {
        entries[index] = merged;
        return merged;
      }
      const clashIndex = entries.findIndex((entry, at) => at !== index && entry.id === nextId);
      const updated = { ...merged, id: nextId };
      if (clashIndex === -1) {
        entries[index] = updated;
        return updated;
      }
      const clash = entries[clashIndex];
      const combined = {
        ...updated,
        tags: mergeTags(clash.tags, updated.tags),
        pinned: clash.pinned || updated.pinned,
        importance: Math.max(clash.importance, updated.importance),
        layer: clash.layer === "long" || updated.layer === "long" ? "long" : "short",
        createdAt: clash.createdAt < updated.createdAt ? clash.createdAt : updated.createdAt,
        version: Math.max(clash.version, updated.version) + 1
      };
      entries[clashIndex] = combined;
      entries.splice(index, 1);
      return combined;
    });
  }
  /** 删除条目。返回是否删除成功。 */
  async removeEntry(id) {
    return this.mutateEntries((entries) => {
      const index = entries.findIndex((entry) => entry.id === id);
      if (index === -1) return false;
      entries.splice(index, 1);
      return true;
    });
  }
  /**
   * 软废弃一条记忆（retire，无后继）：数据保留但默认不再检索/注入/编译。
   * 已废弃条目重复 retire 是幂等 no-op。
   */
  async retireEntry(id, reason) {
    return this.mutateEntries((entries) => {
      const index = entries.findIndex((entry2) => entry2.id === id);
      if (index === -1) return void 0;
      const current = entries[index];
      if (current.deprecated === true) return current;
      const entry = {
        ...current,
        deprecated: true,
        deprecatedAt: nowIso(),
        deprecatedReason: reason?.trim() !== "" ? reason?.trim() : void 0,
        supersededBy: void 0,
        updatedAt: nowIso(),
        version: current.version + 1
      };
      entries[index] = entry;
      return entry;
    });
  }
  /**
   * 修订一条记忆（revise，软废弃 + 后继）：把旧内容软废弃，写入新内容作为后继。
   * 参考 opencontext 的 oc_memory_revise 语义：{ deprecatedId, newId }。
   *
   * 后继条目复用 upsertEntry 的稳定 id 派生：新内容与库中已有条目撞 id 时
   * 直接复用（不重复插入）；旧条目标记 supersededBy 指向后继。
   * 内容未变化时视为 no-op（不产生废弃条目）。
   */
  async reviseEntry(input) {
    const content = input.content.trim();
    if (content === "") throw new Error("content \u4E0D\u80FD\u4E3A\u7A7A");
    const target = await this.getEntry(input.id);
    if (target === void 0) return void 0;
    if (target.deprecated === true) return void 0;
    const nextId = entryIdOf(content, target.scope, target.projectHash);
    if (nextId === input.id) return void 0;
    await this.mutateEntries((entries) => {
      const index = entries.findIndex((entry2) => entry2.id === input.id);
      if (index === -1) return;
      const current = entries[index];
      entries[index] = {
        ...current,
        deprecated: true,
        deprecatedAt: nowIso(),
        deprecatedReason: input.reason?.trim() !== "" ? input.reason?.trim() : void 0,
        supersededBy: nextId,
        updatedAt: nowIso(),
        version: current.version + 1
      };
    });
    const { entry } = await this.upsertEntry({
      content,
      scope: target.scope,
      projectHash: target.projectHash,
      tags: input.tags,
      pinned: target.pinned,
      importance: input.importance ?? target.importance,
      layer: target.layer,
      source: target.source,
      kind: input.kind ?? target.kind,
      confidence: target.confidence
    });
    return { deprecatedId: input.id, newId: entry.id, entry };
  }
  /** 复活一条已废弃的记忆（undo retire / undo revise 的后继侧）。 */
  async restoreEntry(id) {
    return this.mutateEntries((entries) => {
      const index = entries.findIndex((entry2) => entry2.id === id);
      if (index === -1) return void 0;
      const current = entries[index];
      if (current.deprecated !== true) return current;
      const entry = {
        ...current,
        deprecated: void 0,
        deprecatedAt: void 0,
        deprecatedReason: void 0,
        supersededBy: void 0,
        updatedAt: nowIso(),
        version: current.version + 1
      };
      entries[index] = entry;
      return entry;
    });
  }
  /** 注入命中刷新（原子）：给命中的条目加分并刷新 lastHitAt，返回刷新条数。 */
  async applyHits(hitIds, bonus) {
    return this.mutateEntries((entries) => {
      let count = 0;
      for (const entry of entries) {
        if (!hitIds.has(entry.id)) continue;
        entry.importance = Math.min(20, Math.round((entry.importance + bonus) * 100) / 100);
        entry.lastHitAt = nowIso();
        count += 1;
      }
      return count;
    });
  }
  /** 原子替换全部条目（ticker 每日编译等批量场景；fn 返回新数组）。 */
  async replaceEntries(fn) {
    const next = await fn(this.entries);
    this.entries = next;
    this.scheduleFlush();
    return next;
  }
  // ── 变更流 ──────────────────────────────────────────────────────────
  async appendChange(change) {
    const record = {
      ...change,
      id: `chg_${Date.now().toString(36)}_${randomUUID().slice(0, 8)}`,
      at: nowIso()
    };
    await appendJsonl(this.changesFile(localDate()), record);
    return record;
  }
  async readChanges(date) {
    if (date !== void 0) return readJsonl(this.changesFile(date));
    const dir = join(this.root, "changes");
    let files;
    try {
      files = await readdir(dir);
    } catch {
      return [];
    }
    const dates = files.filter((file) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(file)).sort();
    const all = [];
    for (const file of dates) {
      all.push(...await readJsonl(join(dir, file)));
    }
    return all;
  }
  // ── ticker 状态 ─────────────────────────────────────────────────────
  /**
   * 追加一行日志（按分类落独立文件 + 大小轮转，防无界增长）。
   * kind: extract=提取诊断 / consolidate=整理诊断 / api=API 请求（默认关闭）/ error=插件错误。
   * 轮转：当前文件 ≥ 10MB 时改名成带时间戳归档，只保留最近 5 个归档。
   */
  async appendLog(kind, line) {
    const { appendFile, stat: stat2, rename: rename5, readdir: readdir5, unlink: unlink2 } = await import("node:fs/promises");
    const logDir = join(this.root, "log");
    const file = join(logDir, `${kind}.log`);
    await mkdir(logDir, { recursive: true });
    const maxBytes = 10 * 1024 * 1024;
    const keep = 5;
    try {
      const info = await stat2(file);
      if (info.size >= maxBytes) {
        const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
        try {
          await rename5(file, join(logDir, `${kind}.${stamp}.log`));
        } catch {
        }
        try {
          const names = (await readdir5(logDir)).filter((name2) => name2.startsWith(`${kind}.`) && name2.endsWith(".log")).sort();
          const excess = names.slice(0, Math.max(0, names.length - keep));
          for (const name2 of excess) {
            try {
              await unlink2(join(logDir, name2));
            } catch {
            }
          }
        } catch {
        }
      }
    } catch {
    }
    await appendFile(file, `${line}
`, "utf8");
  }
  /** 插件错误日志（本插件 async 任务失败；DSH 控制台日志不落盘）。 */
  async appendErrorLog(stage, message) {
    await this.appendLog("error", `[${nowIso()}] ${stage}: ${message}`);
  }
  /** 提取诊断日志（turn= 开始/结束/耗时/候选数，排查提取卡死）。 */
  async appendExtractLog(message) {
    await this.appendLog("extract", `[${nowIso()}] ${message}`);
  }
  /**
   * 整理诊断日志：consolidate 引擎的每次「为什么没整理/整理成什么」都落盘。
   * 引擎 debug 级日志不进 DSH 控制台（不落盘），此前 consolidate 静默
   * skip/失败时磁盘上毫无痕迹，无法区分「无需整理」与「路由拿不到模型」。
   */
  async appendConsolidateLog(message) {
    await this.appendLog("consolidate", `[${nowIso()}] ${message}`);
  }
  /** API 请求诊断日志（默认关闭；仅 config.logApiRequests 开启时由 api.ts 调用）。 */
  async appendApiLog(message) {
    await this.appendLog("api", `[${nowIso()}] ${message}`);
  }
  async readState() {
    const state = await readJson(this.stateFile(), {
      schemaVersion: 1,
      perSession: {},
      lastDailyDate: null
    });
    if (state.perSession === void 0 || state.perSession === null) state.perSession = {};
    return state;
  }
  async writeState(state) {
    await atomicWriteJson(this.stateFile(), state);
  }
  // ── 记忆注入开关（按会话，内存缓存 + state.json 持久化） ───────────
  /** 注入被关闭的会话 id（内存缓存；null = 未加载）。 */
  injectDisabledCache = null;
  /** 注入被显式开启的会话 id（内存缓存；null = 未加载）。 */
  injectForcedCache = null;
  async ensureInjectCaches() {
    if (this.injectDisabledCache === null || this.injectForcedCache === null) {
      const state = await this.readState();
      this.injectDisabledCache = new Set(Array.isArray(state.injectDisabled) ? state.injectDisabled : []);
      this.injectForcedCache = new Set(Array.isArray(state.injectForced) ? state.injectForced : []);
    }
    return { disabled: this.injectDisabledCache, forced: this.injectForcedCache };
  }
  /**
   * 该会话的显式开关；未单独设置返回 null（调用方回退 config.injectDefaultEnabled）。
   * 关闭列表优先于开启列表：同时出现按更保守的「不注入」处理。
   */
  async injectStateOf(sessionId) {
    const { disabled, forced } = await this.ensureInjectCaches();
    if (disabled.has(sessionId)) return false;
    if (forced.has(sessionId)) return true;
    return null;
  }
  /** 该会话是否启用记忆注入（未单独设置时用 fallback，即配置默认值）。 */
  async isInjectEnabled(sessionId, fallback = true) {
    return await this.injectStateOf(sessionId) ?? fallback;
  }
  /**
   * 设置该会话的记忆注入开关（持久化到 state.json；调用频率极低，直接写）。
   * null = 清除本会话覆盖，回到 config.injectDefaultEnabled（面板「跟随默认」）。
   */
  async setInjectEnabled(sessionId, enabled) {
    const { disabled, forced } = await this.ensureInjectCaches();
    const nextDisabled = new Set(disabled);
    const nextForced = new Set(forced);
    if (enabled === null) {
      nextDisabled.delete(sessionId);
      nextForced.delete(sessionId);
    } else if (enabled) {
      nextDisabled.delete(sessionId);
      nextForced.add(sessionId);
    } else {
      nextForced.delete(sessionId);
      nextDisabled.add(sessionId);
    }
    this.injectDisabledCache = nextDisabled;
    this.injectForcedCache = nextForced;
    const state = await this.readState();
    state.injectDisabled = [...nextDisabled];
    state.injectForced = [...nextForced];
    await this.writeState(state);
  }
  // ── 项目 meta ───────────────────────────────────────────────────────
  async readProjectMeta(hash) {
    const meta = await readJson(join(this.projectDir(hash), "meta.json"), null);
    return meta ?? void 0;
  }
  async writeProjectMeta(hash, meta) {
    await atomicWriteJson(join(this.projectDir(hash), "meta.json"), meta);
  }
  /** 该工作区是否开启自动记忆（默认 true；meta 缺失或字段未写视为开启）。 */
  async isAutoMemoryEnabled(hash) {
    const meta = await this.readProjectMeta(hash);
    return meta?.autoMemory !== false;
  }
  /**
   * projects/ 下的全部目录名（hash），含 meta.json 缺失的裸目录。
   * 编译时用它找出「条目已被删光、md 产物却还留着旧内容」的项目。
   */
  async listProjectHashes() {
    try {
      return (await readdir(join(this.root, "projects"), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      return [];
    }
  }
  /**
   * 列出全部项目（含 meta 与统计）。
   *
   * entryCount / pinnedCount 只数活跃条目：已软废弃（回收站里的）不计。
   * 早先这里把 deprecated 一并算进去，导致「全部记忆 5」与「某项目 8」
   * 自相矛盾——删掉的记忆在项目计数里阴魂不散。
   */
  async listProjects(entries) {
    const dir = join(this.root, "projects");
    let hashes;
    try {
      hashes = (await readdir(dir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      hashes = [];
    }
    const projects = [];
    for (const hash of hashes) {
      const meta = await this.readProjectMeta(hash);
      if (meta === void 0) continue;
      const owned = entries.filter((entry) => entry.scope === "project" && entry.projectHash === hash && entry.deprecated !== true);
      projects.push({
        hash,
        path: meta.path,
        alias: meta.alias,
        locked: meta.locked,
        autoMemory: meta.autoMemory !== false,
        entryCount: owned.length,
        pinnedCount: owned.filter((entry) => entry.pinned).length
      });
    }
    projects.sort((a, b) => a.path.localeCompare(b.path));
    return projects;
  }
  /**
   * 读取 DSH 工作区注册表（${DSH_HOME}/storages/workspace.json），容错返回空。
   * 用于让「尚无记忆的新工作区」也出现在面板项目列表（entryCount 0）。
   */
  async listDshWorkspaces() {
    const dshHome2 = process.env.DSH_HOME ?? join(homedir(), ".dsh");
    const file = join(dshHome2, "storages", "workspace.json");
    const raw = await readJson(file, {});
    const table = raw?.tables?.workspaces;
    if (typeof table !== "object" || table === null) return [];
    const out = [];
    for (const record of Object.values(table)) {
      if (typeof record === "object" && record !== null && typeof record.path === "string" && record.path !== "") {
        out.push({ path: record.path, title: typeof record.title === "string" && record.title !== "" ? record.title : record.path });
      }
    }
    return out;
  }
  // ── 修订版本（consolidate 回滚锚点） ────────────────────────────────
  revisionsDir() {
    return join(this.root, "revisions");
  }
  /**
   * 写入一个修订快照（整理前调用），返回修订 id。
   * 保存 meta + 全量 entries，回滚时直接整体恢复。
   */
  async writeRevision(input) {
    const id = `rev_${Date.now().toString(36)}_${randomUUID().slice(0, 8)}`;
    const meta = {
      id,
      at: nowIso(),
      entryCount: input.entries.length,
      scope: input.scope,
      trigger: input.trigger
    };
    await atomicWriteJson(join(this.revisionsDir(), `${id}.json`), { version: 1, meta, entries: input.entries });
    await this.pruneRevisions(REVISION_KEEP);
    return id;
  }
  /** 列出修订版本（新 → 旧）。 */
  async listRevisions() {
    const dir = this.revisionsDir();
    let files;
    try {
      files = await readdir(dir);
    } catch {
      return [];
    }
    const metas = [];
    for (const file of files) {
      if (!/^rev_[0-9a-z]+_[0-9a-z]+\.json$/.test(file)) continue;
      const data = await readJson(join(dir, file), {});
      if (data.meta !== void 0 && typeof data.meta.id === "string") metas.push(data.meta);
    }
    return metas.sort((a, b) => b.at.localeCompare(a.at));
  }
  /** 读修订快照的全部条目；不存在返回 null。 */
  async readRevisionEntries(id) {
    const data = await readJson(join(this.revisionsDir(), `${id}.json`), null);
    if (data === null || !Array.isArray(data.entries)) return null;
    return data.entries;
  }
  /** 回滚到某修订（整体恢复 entries，走写串行队列）。返回是否成功。 */
  async restoreRevision(id) {
    const entries = await this.readRevisionEntries(id);
    if (entries === null) return false;
    await this.replaceEntries(() => entries);
    return true;
  }
  /** 滚动清理：只保留最近 keep 个修订。 */
  async pruneRevisions(keep) {
    const metas = await this.listRevisions();
    if (metas.length <= keep) return;
    for (const meta of metas.slice(keep)) {
      try {
        await unlink(join(this.revisionsDir(), `${meta.id}.json`));
      } catch {
      }
    }
  }
  // ── md 产物（compile.ts 调用） ─────────────────────────────────────
  /** 写任意 md 产物（原子）。 */
  async writeArtifact(path, content) {
    await atomicWriteText(join(this.root, path), content);
  }
  /** 写项目层产物。 */
  async writeProjectArtifacts(hash, artifacts) {
    const dir = this.projectDir(hash);
    await mkdir(dir, { recursive: true });
    for (const [name2, content] of Object.entries(artifacts)) {
      if (content === void 0) continue;
      await atomicWriteText(join(dir, `${name2}.md`), content);
    }
  }
  /** 写全局层产物。 */
  async writeGlobalArtifacts(artifacts) {
    const dir = this.globalDir();
    await mkdir(dir, { recursive: true });
    for (const [name2, content] of Object.entries(artifacts)) {
      if (content === void 0) continue;
      await atomicWriteText(join(dir, `${name2}.md`), content);
    }
  }
};
function mergeTags(existing, next, max = 8) {
  const out = [];
  for (const tag of [...existing, ...next ?? []]) {
    const t = String(tag).trim();
    if (t === "") continue;
    if (!out.includes(t)) out.push(t);
    if (out.length >= max) break;
  }
  return out;
}
function summarize(content, max = 80) {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1)}\u2026`;
}
function readJsonSync(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
function isMemoryKind(value) {
  return value === "identity" || value === "preference" || value === "fact" || value === "decision" || value === "gotcha" || value === "session-summary";
}
function inferKind(tags) {
  const lower = (tags ?? []).map((tag) => String(tag).toLowerCase());
  if (lower.some((tag) => tag === "\u8EAB\u4EFD" || tag === "identity")) return "identity";
  if (lower.some((tag) => tag === "\u504F\u597D" || tag === "preference" || tag === "\u98CE\u683C" || tag === "style" || tag === "\u4E60\u60EF" || tag === "habit")) return "preference";
  if (lower.some((tag) => tag === "\u8E29\u5751" || tag === "gotcha" || tag === "\u5751")) return "gotcha";
  if (lower.some((tag) => tag === "\u51B3\u7B56" || tag === "decision")) return "decision";
  return "fact";
}
function migrateEntries(entries) {
  if (!Array.isArray(entries)) return [];
  const out = [];
  for (const raw of entries) {
    if (typeof raw !== "object" || raw === null) continue;
    const entry = raw;
    if (typeof entry.id !== "string" || typeof entry.content !== "string") continue;
    const source = entry.source === "manual" ? "manual" : "extract";
    out.push({
      id: entry.id,
      content: entry.content,
      scope: entry.scope === "global" ? "global" : "project",
      projectHash: entry.scope === "project" ? typeof entry.projectHash === "string" ? entry.projectHash : null : null,
      tags: Array.isArray(entry.tags) ? entry.tags.filter((tag) => typeof tag === "string") : [],
      pinned: entry.pinned === true,
      createdAt: typeof entry.createdAt === "string" ? entry.createdAt : nowIso(),
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : nowIso(),
      importance: typeof entry.importance === "number" ? entry.importance : 10,
      lastHitAt: typeof entry.lastHitAt === "string" ? entry.lastHitAt : null,
      layer: entry.layer === "long" ? "long" : "short",
      source,
      version: typeof entry.version === "number" ? entry.version : 1,
      confidence: typeof entry.confidence === "number" ? entry.confidence : source === "manual" ? 1 : 0.6,
      verified: entry.verified === true || source === "manual",
      kind: isMemoryKind(entry.kind) ? entry.kind : inferKind(entry.tags),
      provenance: entry.provenance,
      embedding: Array.isArray(entry.embedding) ? entry.embedding : void 0,
      // disabled 是可选字段：仅 true 时保留（undefined=启用，落盘不冗余）。
      ...entry.disabled === true ? { disabled: true } : {},
      // schema v3：软废弃字段（仅真实废弃时保留）。
      ...entry.deprecated === true ? {
        deprecated: true,
        deprecatedAt: typeof entry.deprecatedAt === "string" ? entry.deprecatedAt : nowIso(),
        ...typeof entry.deprecatedReason === "string" && entry.deprecatedReason !== "" ? { deprecatedReason: entry.deprecatedReason } : {},
        ...typeof entry.supersededBy === "string" ? { supersededBy: entry.supersededBy } : {}
      } : {}
    });
  }
  return out;
}

// src/memory/engine/scoring.ts
function decayImportance(importance, days, lambda) {
  if (days <= 0) return importance;
  const decayed = importance * Math.pow(1 - lambda, days);
  return Math.round(decayed * 100) / 100;
}
function daysSince(iso, from = /* @__PURE__ */ new Date()) {
  if (iso === null) return 0;
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return 0;
  return Math.max(0, Math.floor((from.getTime() - time) / 864e5));
}
function isInjectionEligible(entry, threshold) {
  if (entry.pinned) return true;
  if (entry.layer === "long") return true;
  return entry.importance >= threshold;
}
function shouldPromote(entry, threshold) {
  if (entry.layer !== "short") return false;
  if (entry.importance >= threshold * 2) return true;
  const age = daysSince(entry.updatedAt);
  if (age >= 14 && entry.importance >= threshold) return true;
  return false;
}
function shouldEvict(entry, threshold) {
  if (entry.layer !== "short" || entry.pinned) return false;
  const age = daysSince(entry.updatedAt);
  return age >= 60 && entry.importance < threshold / 2;
}
function injectionRank(entry) {
  return entry.pinned ? Number.POSITIVE_INFINITY : entry.importance;
}

// src/memory/engine/compile.ts
var IDENTITY_TAGS = ["\u8EAB\u4EFD", "identity", "\u504F\u597D", "preference", "\u98CE\u683C", "style", "\u4EBA\u683C", "persona", "\u4E60\u60EF", "habit"];
var FACT_TAGS = ["\u4E8B\u5B9E", "fact", "\u4FE1\u606F", "info", "\u8981\u70B9", "key", "\u80CC\u666F", "context"];
function groupEntries(entries, now = /* @__PURE__ */ new Date()) {
  const groups = {
    today: [],
    week: [],
    earlier: [],
    longterm: []
  };
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  for (const entry of entries) {
    if (entry.layer === "long") {
      groups.longterm.push(entry);
      continue;
    }
    const time = Date.parse(entry.updatedAt);
    if (Number.isNaN(time)) {
      groups.earlier.push(entry);
      continue;
    }
    const days = Math.floor((startOfDay - time) / 864e5);
    if (days <= 0) groups.today.push(entry);
    else if (days < 7) groups.week.push(entry);
    else groups.earlier.push(entry);
  }
  return groups;
}
function entryLine(entry) {
  const tagText = entry.tags.length > 0 ? ` \`${entry.tags.join("` `")}\`` : "";
  const score = entry.importance >= 10 ? "" : ` [${entry.importance}]`;
  return `- ${entry.content.replace(/\n/g, " ")}${score}${tagText}`;
}
function renderTimeline(entries) {
  const groups = groupEntries(entries);
  const lines = ["# \u8BB0\u5FC6\u65F6\u95F4\u7EBF"];
  const pushGroup = (title, list) => {
    if (list.length === 0) return;
    lines.push(`
## ${title}`);
    for (const entry of list) lines.push(entryLine(entry));
  };
  pushGroup("\u4ECA\u5929", groups.today);
  pushGroup("\u672C\u5468", groups.week);
  pushGroup("\u66F4\u65E9", groups.earlier);
  pushGroup("\u957F\u671F\u6C89\u6DC0", groups.longterm);
  return lines.join("\n");
}
function renderIdentity(entries) {
  if (entries.length === 0) return "";
  const lines = ["# \u7528\u6237\u8EAB\u4EFD\u4E0E\u504F\u597D"];
  for (const entry of entries) {
    lines.push(entryLine(entry));
  }
  return lines.join("\n");
}
function renderFacts(entries) {
  if (entries.length === 0) return "";
  const lines = ["# \u4E8B\u5B9E"];
  for (const entry of entries) lines.push(entryLine(entry));
  return lines.join("\n");
}
function renderPinned(entries) {
  if (entries.length === 0) return "";
  const lines = ["# \u7F6E\u9876"];
  for (const entry of entries) lines.push(entryLine(entry));
  return lines.join("\n");
}
function isIdentityEntry(entry) {
  if (entry.scope !== "global") return false;
  if (entry.kind === "identity" || entry.kind === "preference") return true;
  return entry.tags.some((tag) => IDENTITY_TAGS.includes(tag.toLowerCase()));
}
function isFactEntry(entry) {
  if (entry.pinned) return false;
  if (entry.kind === "identity" || entry.kind === "preference") return false;
  if (entry.kind === "fact" || entry.kind === "decision" || entry.kind === "gotcha") return true;
  if (entry.tags.some((tag) => FACT_TAGS.includes(tag.toLowerCase()))) return true;
  return entry.importance >= 8;
}
function compileGlobalArtifacts(entries) {
  const identity = entries.filter(isIdentityEntry);
  const facts = entries.filter((entry) => entry.scope === "global" && !isIdentityEntry(entry) && isFactEntry(entry));
  const pinned = entries.filter((entry) => entry.scope === "global" && entry.pinned);
  return {
    identity: renderIdentity(identity),
    facts: renderFacts(facts),
    pinned: renderPinned(pinned)
  };
}
function compileProjectArtifacts(entries) {
  const facts = entries.filter((entry) => isFactEntry(entry) && !entry.pinned);
  const pinned = entries.filter((entry) => entry.pinned);
  return {
    memory: renderTimeline(entries),
    facts: renderFacts(facts),
    pinned: renderPinned(pinned)
  };
}
function renderDaily(date, changes) {
  const lines = [`# ${date} \u8BB0\u5FC6\u65E5\u5FD7`, ""];
  if (changes.length === 0) {
    lines.push("\uFF08\u65E0\u65B0\u8BB0\u5FC6\uFF09");
  } else {
    for (const change of changes) {
      const badge = change.action === "add" ? "\u65B0\u589E" : change.action === "promote" ? "\u6C89\u6DC0" : "\u66F4\u65B0";
      const scope = change.scope === "global" ? "\u5168\u5C40" : "\u9879\u76EE";
      lines.push(`- [${badge}][${scope}] ${change.summary}`);
    }
  }
  return lines.join("\n");
}
function buildInjectionText(entries, config) {
  const budget = Math.max(1e3, config.injectTokenBudget);
  const buckets = { identity: [], memory: [], pinned: [], facts: [] };
  const pinned = entries.filter((entry) => entry.pinned);
  for (const entry of pinned) buckets.pinned.push(entryLine(entry));
  const rest = entries.filter((entry) => !entry.pinned).sort((a, b) => injectionRank(b) - injectionRank(a));
  let used = buckets.pinned.reduce((sum, line) => sum + line.length + 1, 0);
  for (const entry of rest) {
    const section = entry.scope === "global" ? isIdentityEntry(entry) ? "identity" : "facts" : "memory";
    const line = entryLine(entry);
    const headerCost = buckets[section].length === 0 ? sectionHeader(section).length + 3 : 0;
    if (used + line.length + 1 + headerCost > budget) continue;
    used += line.length + 1 + headerCost;
    buckets[section].push(line);
  }
  const sections = {
    identity: buckets.identity.join("\n"),
    memory: buckets.memory.join("\n"),
    pinned: buckets.pinned.join("\n"),
    facts: buckets.facts.join("\n")
  };
  const order = ["identity", "memory", "pinned", "facts"];
  const outSections = order.filter((name2) => sections[name2] !== "").map((name2) => ({ name: sectionHeader(name2), text: sections[name2] }));
  const text = outSections.map((section) => `[${section.name}]
${section.text}`).join("\n\n");
  return { text, sections: outSections };
}
function sectionHeader(section) {
  switch (section) {
    case "identity":
      return "\u8BB0\u5FC6\xB7\u8EAB\u4EFD\u504F\u597D";
    case "memory":
      return "\u8BB0\u5FC6\xB7\u9879\u76EE";
    case "pinned":
      return "\u8BB0\u5FC6\xB7\u7F6E\u9876";
    case "facts":
      return "\u8BB0\u5FC6\xB7\u4E8B\u5B9E";
  }
}
async function compileAll(store, config) {
  const all = await store.readEntries();
  const entries = all.filter((entry) => entry.disabled !== true && entry.deprecated !== true);
  const byProject = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (entry.scope !== "project" || entry.projectHash === null) continue;
    const list = byProject.get(entry.projectHash) ?? [];
    list.push(entry);
    byProject.set(entry.projectHash, list);
  }
  for (const [hash, owned] of byProject) {
    await store.writeProjectArtifacts(hash, compileProjectArtifacts(owned));
  }
  const emptied = (await store.listProjectHashes()).filter((hash) => !byProject.has(hash));
  for (const hash of emptied) {
    await store.writeProjectArtifacts(hash, { memory: "", facts: "", pinned: "" });
  }
  const global = entries.filter((entry) => entry.scope === "global");
  await store.writeGlobalArtifacts(compileGlobalArtifacts(global));
}
function selectInjectionEntries(entries, threshold) {
  return entries.filter((entry) => isInjectionEligible(entry, threshold)).sort((a, b) => injectionRank(b) - injectionRank(a));
}
function workspaceHashOf(header) {
  const cwd = header?.cwd;
  if (typeof cwd !== "string" || cwd.trim() === "") return null;
  return projectHashOf(cwd);
}
async function writeDailyLog(store, date = localDate()) {
  const changes = await store.readChanges(date);
  const summary = changes.map((change) => ({
    action: change.action,
    summary: change.summary,
    scope: change.scope
  }));
  await store.writeArtifact(`daily/${date}.md`, renderDaily(date, summary));
}
function promoteEntries(entries, threshold) {
  const promoted = [];
  const remaining = [];
  for (const entry of entries) {
    if (shouldPromote(entry, threshold)) {
      promoted.push({ ...entry, layer: "long" });
    } else {
      remaining.push(entry);
    }
  }
  return { promoted, remaining };
}

// vendor/dsh-llm/brand.ts
function MessageId(id) {
  return id;
}
function ToolCallId(id) {
  return id;
}

// vendor/dsh-llm/never.ts
function assertNever(value, context) {
  const rendered = JSON.stringify(value) ?? String(value);
  throw new Error(`unreachable variant${context ? ` in ${context}` : ""}: ${rendered}`);
}

// vendor/dsh-llm/message.ts
import { randomUUID as randomUUID2 } from "@deepseek-ai/dsh-util-crypto";

// vendor/dsh-llm/call-config.ts
function deepFreeze(value) {
  const seen = /* @__PURE__ */ new WeakSet();
  const pending = [{ kind: "visit", node: value }];
  while (pending.length > 0) {
    const task = pending.pop();
    if (task === void 0) continue;
    if (task.kind === "property") {
      pending.push({ kind: "visit", node: task.source[task.key] });
      continue;
    }
    const node = task.node;
    if (node === null || typeof node !== "object") continue;
    if (node instanceof AbortSignal) continue;
    if (seen.has(node)) continue;
    seen.add(node);
    Object.freeze(node);
    const keys = Object.keys(node);
    for (let index = keys.length - 1; index >= 0; index--) {
      const key = keys[index];
      if (key === void 0) continue;
      pending.push({ kind: "property", source: node, key });
    }
  }
  return value;
}

// vendor/dsh-llm/message.ts
function freezeMessage(message) {
  return deepFreeze(structuredClone(message));
}
function createMessage(input) {
  return freezeMessage({
    ...input,
    id: MessageId(randomUUID2())
  });
}
function createUserMessage(input) {
  return createMessage({
    ...input,
    role: "user"
  });
}

// vendor/dsh-llm/assembler.ts
var BlockAssembler = class {
  partials = /* @__PURE__ */ new Map();
  order = [];
  _usage;
  _finish;
  _replayState;
  /**
   * Feed one chunk into the assembly state.
   * @param chunk - the next raw chunk, in stream order.
   */
  push(chunk) {
    switch (chunk.type) {
      case "block-start": {
        if (!this.partials.has(chunk.index)) {
          this.order.push(chunk.index);
          this.partials.set(chunk.index, {
            blockType: chunk.blockType,
            text: "",
            toolCallArguments: ""
          });
        }
        return;
      }
      case "text-delta":
      case "reasoning-delta": {
        const partial = this.ensure(chunk.index, chunk.type === "text-delta" ? "text" : "reasoning");
        if (partial.block) return;
        partial.text += chunk.text;
        return;
      }
      case "tool-call-delta": {
        const partial = this.ensure(chunk.index, "tool-call");
        if (partial.block) return;
        partial.toolCallId = chunk.id;
        if (chunk.name) partial.toolCallName = chunk.name;
        partial.toolCallArguments += chunk.argumentsDelta;
        return;
      }
      case "block-end": {
        const partial = this.ensure(chunk.index, chunk.block.type);
        if (partial.block) return;
        partial.block = chunk.block;
        return;
      }
      case "usage": {
        this._usage = chunk.usage;
        return;
      }
      case "finish": {
        this._finish = chunk.reason;
        this._replayState = chunk.replayState;
        return;
      }
      default:
        return assertNever(chunk, "BlockAssembler.push");
    }
  }
  ensure(index, blockType) {
    let partial = this.partials.get(index);
    if (!partial) {
      partial = { blockType, text: "", toolCallArguments: "" };
      this.partials.set(index, partial);
      this.order.push(index);
    }
    return partial;
  }
  assemble(partial, index) {
    if (partial.block) return partial.block;
    switch (partial.blockType) {
      case "text":
        return { type: "text", text: partial.text };
      case "reasoning":
        return { type: "reasoning", text: partial.text };
      case "tool-call":
        return {
          type: "tool-call",
          id: partial.toolCallId ?? ToolCallId(`call-${index}`),
          name: partial.toolCallName ?? "",
          arguments: partial.toolCallArguments
        };
      default:
        throw new Error(`cannot assemble incomplete block of type "${partial.blockType}"`);
    }
  }
  /** Invariant accessor: every index in `order` has a partial. */
  mustGet(index) {
    const partial = this.partials.get(index);
    if (!partial) throw new Error(`BlockAssembler invariant violated: no partial for index ${index}`);
    return partial;
  }
  /**
   * The one shared keep/drop decision over all seen blocks: max-token
   * truncation drops tool calls that cannot be executed safely. Emitted blocks
   * and replay metadata both derive from this result, so they cannot disagree.
   */
  assembled() {
    const all = this.order.map((index) => this.assemble(this.mustGet(index), index));
    const kept = this.finish.kind === "max-tokens" ? all.map((block) => block.type !== "tool-call") : void 0;
    const blocks = kept === void 0 ? all : all.filter((_, position) => kept[position]);
    const envelope = this._replayState;
    if (envelope?.blocks === void 0) return { blocks, replay: envelope };
    if (envelope.blocks.length !== all.length) return { blocks, replay: void 0 };
    return {
      blocks,
      replay: kept === void 0 || blocks.length === all.length ? envelope : { response: envelope.response, blocks: envelope.blocks.filter((_, position) => kept[position]) }
    };
  }
  /**
   * Assemble all blocks seen so far, in stream order.
   * @returns one block per seen index, except that max-token truncation drops
   *   tool calls that cannot be executed safely; an open block assembles from
   *   its accumulated deltas (an unknown block type never closed by `block-end` throws).
   */
  blocks() {
    return this.assembled().blocks;
  }
  /**
   * Assemble the prefix an interrupted stream can safely finalize: closed and
   * open text/reasoning blocks with non-whitespace content, in stream order.
   * Tool calls are omitted because interruption precedes dispatch; retaining
   * one would require a fabricated result. Open unknown blocks are also omitted.
   * @returns the kept blocks; empty when nothing streamed before the interruption.
   */
  interruptedBlocks() {
    return this.order.map((index) => {
      const partial = this.mustGet(index);
      const type = partial.block?.type ?? partial.blockType;
      if (type !== "text" && type !== "reasoning") return void 0;
      return this.assemble(partial, index);
    }).filter((block) => (block?.type === "text" || block?.type === "reasoning") && block.text.trim() !== "");
  }
  /** Usage from the `usage` chunk; undefined until one arrives. */
  get usage() {
    return this._usage;
  }
  /** Finish reason from the `finish` chunk; `{kind: 'stop'}` when the stream ended without one. */
  get finish() {
    return this._finish ?? { kind: "stop" };
  }
  /**
   * Replay metadata from the terminal finish chunk, if any, with per-block
   * entries pruned in step with {@link blocks}. Undefined when the envelope's
   * entries do not align with the emitted blocks.
   */
  get replayState() {
    return this.assembled().replay;
  }
  /**
   * The assembled assistant message.
   * @param source - producer attribution for the assembled message.
   * @returns a frozen assistant-role message over `blocks()` (same open-block assembly rules).
   */
  message(source = { kind: "plugin", plugin: "dsh-llm/assembler" }) {
    return createMessage({ role: "assistant", content: this.blocks(), source });
  }
};

// vendor/dsh-llm/error.ts
var HarnessError = class extends Error {
  /** Stable machine-routable failure class (e.g. `RATE_LIMIT`); route on this, never by parsing `message`. */
  code;
  constructor(message, code, options) {
    super(message, options);
    this.code = code;
    this.name = new.target.name;
  }
};
var STRUCTURED_CONTEXT_OVERFLOW = new RegExp(
  String.raw`(?:^|[^a-z0-9])context[\s_-](?:length|window)[\s_-]` + String.raw`(?:exceed(?:ed|s)?|overflow(?:ed)?|limit[\s_-]exceeded)(?:$|[^a-z0-9])`,
  "i"
);
var TOO_LARGE_FOR_CONTEXT = new RegExp(
  String.raw`\b(?:request|prompt|input|messages?)\s+(?:is\s+|are\s+)?` + String.raw`too\s+(?:large|long)\s+for\s+(?:(?:this|the)\s+)?` + String.raw`(?:model(?:'s)?\s+)?context(?:\s+window)?\b`,
  "i"
);
var EXCEEDS_MODEL_CONTEXT = new RegExp(
  String.raw`\b(?:input|prompt|request|messages?)\b.{0,40}` + String.raw`\b(?:exceed(?:s|ed)?|overflows?|is\s+larger\s+than)\b.{0,40}` + String.raw`\b(?:the\s+)?(?:model(?:'s)?\s+)?context(?:\s+(?:length|window))?\b`,
  "i"
);

// src/memory/engine/embedding.ts
function resolveEmbeddingProvider(config) {
  if (config.embeddingProvider === "off") return null;
  if (config.embeddingProvider === "http") {
    const baseUrl = config.embeddingBaseUrl.trim().replace(/\/+$/, "");
    if (baseUrl === "") return null;
    return new HttpEmbeddingProvider({
      baseUrl,
      model: config.embeddingModel.trim() || "text-embedding-3-small",
      apiKey: config.embeddingApiKey.trim() || envApiKey(),
      dimensions: config.embeddingDimensions > 0 ? config.embeddingDimensions : 0
    });
  }
  return new LocalEmbeddingProvider(config.embeddingModel.trim() || "Xenova/all-MiniLM-L6-v2");
}
function envApiKey() {
  try {
    return process.env.DSH_MEMORY_EMBEDDING_API_KEY ?? "";
  } catch {
    return "";
  }
}
var HttpEmbeddingProvider = class _HttpEmbeddingProvider {
  backend = "http";
  model;
  dimensions;
  baseUrl;
  apiKey;
  timeoutMs;
  /** 单次请求最大输入条数（OpenAI 上限 2048，保守 256）。 */
  static BATCH_SIZE = 256;
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.model = options.model;
    this.apiKey = options.apiKey;
    this.dimensions = options.dimensions;
    this.timeoutMs = options.timeoutMs ?? 15e3;
  }
  async embed(texts) {
    const out = [];
    for (let i = 0; i < texts.length; i += _HttpEmbeddingProvider.BATCH_SIZE) {
      const chunk = texts.slice(i, i + _HttpEmbeddingProvider.BATCH_SIZE);
      out.push(...await this.embedChunk(chunk));
    }
    return out;
  }
  async embedChunk(texts) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...this.apiKey !== "" ? { authorization: `Bearer ${this.apiKey}` } : {}
        },
        body: JSON.stringify({ model: this.model, input: texts }),
        signal: controller.signal
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`embedding http ${response.status}: ${detail.slice(0, 200)}`);
      }
      const data = await response.json();
      const embeddings = data.data?.map((item) => item.embedding);
      if (!Array.isArray(embeddings) || embeddings.some((vec) => !Array.isArray(vec))) {
        throw new Error("embedding http: unexpected response shape");
      }
      return embeddings;
    } finally {
      clearTimeout(timer);
    }
  }
};
var LocalEmbeddingProvider = class {
  backend = "local";
  model;
  dimensions = 0;
  pipeline = null;
  failure = null;
  constructor(model) {
    this.model = model;
  }
  async ensurePipeline() {
    if (this.failure !== null) throw this.failure;
    if (this.pipeline === null) {
      this.pipeline = (async () => {
        try {
          const mod = await import(
            /* @vite-ignore */
            "@xenova/transformers"
          );
          const pipe = await mod.pipeline("feature-extraction", this.model, { quantized: true });
          const probe = await pipe("", { pooling: "mean", normalize: true });
          this.dimensions = Array.isArray(probe.data) ? probe.data.length : 384;
          return pipe;
        } catch (error) {
          this.failure = error instanceof Error ? error : new Error(String(error));
          this.pipeline = null;
          throw this.failure;
        }
      })();
    }
    return this.pipeline;
  }
  async embed(texts) {
    const pipe = await this.ensurePipeline();
    const out = [];
    for (const text of texts) {
      const result = await pipe(text, { pooling: "mean", normalize: true });
      out.push(Array.from(result.data));
    }
    return out;
  }
};
function cosineSimilarity(a, b) {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
function normalizedCosine(a, b) {
  return (cosineSimilarity(a, b) + 1) / 2;
}

// src/memory/engine/retrieval.ts
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ");
}
function ngrams(text) {
  const s = normalize(text).replace(/\s+/g, "");
  const out = /* @__PURE__ */ new Set();
  for (let n = 2; n <= 3; n += 1) {
    for (let i = 0; i + n <= s.length; i += 1) {
      out.add(s.slice(i, i + n));
    }
  }
  return out;
}
function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  return inter / (a.size + b.size - inter);
}
function keywordHit(query, entry) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const hay = normalize(`${entry.content} ${entry.tags.join(" ")}`);
  return terms.every((term) => hay.includes(term));
}
function metaWeight(entry) {
  let w = 1;
  if (entry.verified) w *= 1.15;
  const confidence = Number.isFinite(entry.confidence) ? entry.confidence : 0.6;
  const importance = Number.isFinite(entry.importance) ? entry.importance : 10;
  w *= 0.5 + confidence * 0.5;
  w *= 0.5 + importance / 20;
  return w;
}
function hybridScore(query, entry) {
  const q = normalize(query);
  if (q.trim() === "") return metaWeight(entry);
  const qGrams = ngrams(q);
  const hay = normalize(`${entry.content} ${entry.tags.join(" ")}`);
  const hGrams = ngrams(hay);
  let score = jaccard(qGrams, hGrams);
  if (keywordHit(query, entry)) score = Math.max(score, 0.5) + 0.3;
  return score * metaWeight(entry);
}
function semanticScore(query, entry, queryVec) {
  const ngram = hybridScore(query, entry);
  if (queryVec === null || !Array.isArray(entry.embedding) || entry.embedding.length === 0) {
    return ngram;
  }
  const cos = normalizedCosine(queryVec, entry.embedding) * metaWeight(entry);
  return cos * 0.75 + ngram * 0.25;
}
function searchEntries(query, entries, mode, options = {}) {
  const active = options.includeDeprecated === true ? entries : entries.filter((entry) => entry.deprecated !== true);
  const matches = [];
  for (const entry of active) {
    if (mode === "keyword" && !keywordHit(query, entry)) continue;
    matches.push({ entry, score: hybridScore(query, entry) });
  }
  return matches.sort((a, b) => b.score - a.score);
}
async function searchEntriesSemantic(query, entries, provider, options = {}) {
  const active = options.includeDeprecated === true ? entries : entries.filter((entry) => entry.deprecated !== true);
  if (active.length === 0) return [];
  let queryVec = null;
  if (provider !== null) {
    try {
      const vectors = await provider.embed([query]);
      queryVec = vectors[0] ?? null;
    } catch {
      queryVec = null;
    }
  }
  const missing = [];
  for (const entry of active) {
    if (!Array.isArray(entry.embedding) || entry.embedding.length === 0) missing.push(entry);
  }
  if (provider !== null && missing.length > 0) {
    try {
      const vectors = await provider.embed(missing.map((entry) => entry.content));
      for (let i = 0; i < missing.length; i += 1) {
        missing[i].embedding = vectors[i] ?? void 0;
      }
    } catch {
    }
  }
  const matches = active.map((entry) => ({
    entry,
    score: semanticScore(query, entry, queryVec)
  }));
  return matches.sort((a, b) => b.score - a.score);
}
function semanticSimilarity(a, b) {
  return jaccard(ngrams(a), ngrams(b));
}

// src/memory/engine/extract.ts
var EXTRACT_TIMEOUT_MS = 3e4;
function parseExtractOutput(raw) {
  let text = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(text);
  if (fence !== null) text = fence[1].trim();
  text = text.replace(/^\uFEFF/, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return [];
  let parsed;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  if (typeof parsed !== "object" || parsed === null) return [];
  const memories = parsed.memories;
  if (!Array.isArray(memories)) return [];
  const out = [];
  for (const item of memories) {
    if (typeof item !== "object" || item === null) continue;
    const record = item;
    const content = typeof record.content === "string" ? record.content.trim() : "";
    if (content === "") continue;
    const scope = record.scope === "global" ? "global" : "project";
    const tags = Array.isArray(record.tags) ? record.tags.filter((tag) => typeof tag === "string" && tag.trim() !== "").map((tag) => tag.trim()).slice(0, 8) : [];
    const importance = typeof record.importance === "number" && Number.isFinite(record.importance) ? Math.max(1, Math.min(10, Math.round(record.importance))) : 5;
    out.push({ content, scope, tags, importance });
  }
  return out;
}
function extractSystemPrompt() {
  return [
    "You are a memory extractor for an AI assistant. Read the conversation transcript and extract information worth remembering across sessions.",
    "Return ONLY a JSON object in this exact shape (no markdown, no commentary):",
    '{"memories":[{"content":"...","scope":"global"|"project","tags":["..."],"importance":1}]}',
    "Rules:",
    "- Extract only DURABLE cross-session knowledge: user identity, stable preferences, hard-won gotchas, architectural decisions, non-obvious constraints. Litmus test: would a session a month later still act on this? If not, skip it.",
    '- NEVER extract session work logs: commit hashes, push/release announcements, version bumps, "\u5DF2\u4FEE\u590D\u5E76\u63A8\u9001", build/deploy results, file-change lists, intermediate debugging steps, transient bug states. Git and the issue tracker already record those.',
    "- NEVER extract facts trivially derivable from the workspace: package.json contents, dependency lists, directory layouts, file paths, config values the model can simply read again.",
    "- NEVER extract generic programming knowledge, framework docs, or explanations the model already knows.",
    "- Skip small talk, greetings, chit-chat, and content with no lasting value.",
    '- scope: "global" for user identity/preferences/working style; "project" for workspace/project-specific content.',
    "- tags: 1-4 short category tags in the same language as the content (e.g. \u6280\u672F, \u8E29\u5751, \u67B6\u6784, \u504F\u597D).",
    "- importance: integer 1-10. 8-10 = durable facts/decisions a future session will act on; anything below 8 is treated as session-scoped noise and dropped. When unsure, score low or skip.",
    "- content: write in the original language of the conversation, one complete concise sentence or bullet.",
    "- NEVER extract project instruction files (AGENTS.md, CLAUDE.md), the skill catalog (available skills list), or any skill content: those are auto-injected by the harness and must NOT be stored as memory.",
    '- If nothing is worth remembering, return {"memories":[]}.'
  ].join("\n");
}
function extractUserPrompt(transcript) {
  return `Extract memories from this conversation transcript (JSON string):
${JSON.stringify(transcript)}`;
}
async function extractCandidates(ctx, agent, transcript, config) {
  if (transcript.trim() === "") return [];
  const llm = ctx.get("llm");
  if (llm === void 0) return [];
  const route = await resolveRoute(ctx, agent);
  if (route === void 0) return [];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXTRACT_TIMEOUT_MS);
  try {
    const options = {
      provider: route.provider,
      model: route.model,
      messages: [createUserMessage({
        content: [{ type: "text", text: extractUserPrompt(transcript.slice(0, config.extractMaxChars)) }],
        source: { kind: "plugin", plugin: "dsh-memory" }
      })],
      system: extractSystemPrompt(),
      // 推理模型需要空间输出 JSON：text + reasoning 都会产生，上限调高。
      maxTokens: 2048,
      signal: controller.signal
    };
    const assembler = new BlockAssembler();
    for await (const chunk of llm.stream(options)) {
      assembler.push(chunk);
    }
    const finish = assembler.finish;
    if (finish.kind !== "stop") return [];
    const text = assembler.blocks().filter((block) => block.type === "text" || block.type === "reasoning").map((block) => block.text ?? "").join(" ");
    const candidates = parseExtractOutput(text);
    return candidates.filter((candidate) => candidate.importance >= config.minImportance && !isSensitiveContent(candidate.content));
  } catch (error) {
    ctx.logger?.debug?.(`[dsh-memory] extract failed: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  } finally {
    clearTimeout(timer);
  }
}
var SENSITIVE_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  // GitHub tokens
  /sk-[A-Za-z0-9_-]{20,}/i,
  // OpenAI 等
  /AKIA[0-9A-Z]{16}/,
  // AWS access key
  /xox[baprs]-[A-Za-z0-9-]{20,}/i,
  // Slack tokens
  /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/i,
  // 私钥块
  /(?:password|passwd|secret|api[_-]?key|access[_-]?token|private[_-]?key)\s*[=:]\s*[^\s,，。；;]{8,}/i
];
function isSensitiveContent(text) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(text));
}
async function resolveRoute(ctx, agent) {
  if (agent.options.provider !== void 0 && agent.options.model !== void 0 && agent.options.provider !== "" && agent.options.model !== "") {
    return { provider: agent.options.provider, model: agent.options.model };
  }
  const defaultModel = ctx.get("agentDefaultModel");
  if (defaultModel !== void 0) {
    try {
      const selection = defaultModel.currentSelection();
      if (selection.provider !== void 0 && selection.model !== void 0) {
        return { provider: selection.provider, model: selection.model };
      }
    } catch {
    }
  }
  return void 0;
}
function transcriptFromEvents(events) {
  const lines = [];
  for (const event of events) {
    if (event.type === "user/message") {
      const message = event.data;
      const injectedKinds = ["plugin", "agent-instructions", "skill-catalog", "skill-invocation"];
      if (typeof message.source?.kind === "string" && injectedKinds.includes(message.source.kind)) continue;
      lines.push(`User: ${textOfContent(message.content)}`);
    } else if (event.type === "assistant/message") {
      const data = event.data;
      lines.push(`Assistant: ${textOfContent(data.message?.content)}`);
    }
  }
  return lines.join("\n");
}
function textOfContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const block of content) {
    if (typeof block !== "object" || block === null) continue;
    const record = block;
    if (record.type === "text" && typeof record.text === "string") parts.push(record.text);
  }
  return parts.join("\n").trim();
}
var DUP_SIMILARITY_THRESHOLD = 0.75;
function isDuplicateContent(content, existing, threshold = DUP_SIMILARITY_THRESHOLD) {
  const trimmed = content.trim();
  if (trimmed === "") return true;
  for (const entry of existing) {
    if (entry.deprecated === true) continue;
    if (entry.content.trim() === trimmed) return true;
    if (semanticSimilarity(trimmed, entry.content) >= threshold) return true;
  }
  return false;
}

// src/memory/engine/consolidate.ts
var CONSOLIDATE_AGENT = {
  id: "dsh-memory-consolidate",
  options: {},
  session: { id: "", header: void 0 }
};
function scopeLabel(scope) {
  return scope === "global" ? "global" : `project:${scope.projectHash}`;
}
async function consolidateScope(ctx, store, config, scope, trigger) {
  const label = scopeLabel(scope);
  const empty = { scope: label, merged: 0, rewritten: 0, dropped: 0, promoted: 0, changed: 0 };
  const log = (message) => {
    void store.appendConsolidateLog(`[${trigger}] ${label}: ${message}`).catch(() => void 0);
  };
  if (!config.consolidateEnabled) {
    log("skip (consolidate disabled in config)");
    return empty;
  }
  const all = await store.readEntries();
  let owned = all.filter((entry) => scope === "global" ? entry.scope === "global" : entry.scope === "project" && entry.projectHash === scope.projectHash);
  owned = owned.filter((entry) => !entry.pinned && entry.disabled !== true && entry.deprecated !== true);
  owned = selectConsolidationSet(owned, config.consolidateMaxEntries);
  if (owned.length < 2) {
    log(`skip (owned=${owned.length} after pinned/disabled/deprecated filter, need >= 2)`);
    return empty;
  }
  const llm = ctx.get("llm");
  if (llm === void 0) {
    log("skip (llm service not available on context)");
    return { ...empty, failed: "LLM \u670D\u52A1\u4E0D\u53EF\u7528" };
  }
  let route;
  if (config.consolidateProvider !== void 0 && config.consolidateModel !== void 0 && config.consolidateProvider !== "" && config.consolidateModel !== "") {
    route = { provider: config.consolidateProvider, model: config.consolidateModel };
    log(`use dedicated model ${route.provider}/${route.model}`);
  } else {
    route = await resolveRoute(ctx, CONSOLIDATE_AGENT);
  }
  if (route === void 0) {
    log("skip (no LLM route: agentDefaultModel.currentSelection() returned empty; agent options are unset)");
    return { ...empty, failed: "\u672A\u914D\u7F6E\u9ED8\u8BA4\u6A21\u578B\uFF08agentDefaultModel \u65E0\u9009\u62E9\uFF09" };
  }
  log(`start owned=${owned.length} route=${route.provider}/${route.model}`);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.consolidateTimeoutMs);
  try {
    const options = {
      provider: route.provider,
      model: route.model,
      messages: [createUserMessage({
        content: [{ type: "text", text: consolidateUserPrompt(owned) }],
        source: { kind: "plugin", plugin: "dsh-memory" }
      })],
      system: consolidateSystemPrompt(),
      maxTokens: 4096,
      signal: controller.signal
    };
    const assembler = new BlockAssembler();
    for await (const chunk of llm.stream(options)) {
      assembler.push(chunk);
    }
    const finish = assembler.finish;
    if (finish.kind !== "stop") {
      log(`abort (finish=${finish.kind})`);
      return { ...empty, failed: `\u6A21\u578B\u8F93\u51FA\u5F02\u5E38\u4E2D\u65AD\uFF08finish=${finish.kind}\uFF09\uFF0C\u53EF\u80FD\u662F\u8D85\u65F6\u6216\u8F93\u51FA\u622A\u65AD` };
    }
    const text = assembler.blocks().filter((block) => block.type === "text" || block.type === "reasoning").map((block) => block.text ?? "").join(" ");
    const ops = parseConsolidateOutput(text);
    if (ops.length === 0) {
      log("noop (llm returned 0 valid ops)");
      return empty;
    }
    await store.writeRevision({ entries: all, scope: label, trigger });
    let stats = { merged: 0, rewritten: 0, dropped: 0, promoted: 0 };
    let events = [];
    await store.replaceEntries((current) => {
      const result = applyOps(current, ops);
      stats = result.stats;
      events = result.events;
      return result.next;
    });
    for (const event of events) await store.appendChange(event);
    await store.appendChange({
      action: "consolidate",
      entryId: "",
      scope: scope === "global" ? "global" : "project",
      projectHash: scope === "global" ? null : scope.projectHash,
      summary: `\u6574\u7406\u5B8C\u6210\uFF1A\u5408\u5E76 ${stats.merged} / \u6539\u5199 ${stats.rewritten} / \u5E9F\u5F03 ${stats.dropped} / \u63D0\u5347 ${stats.promoted}`
    });
    await compileAll(store, config);
    await writeDailyLog(store);
    const changed = stats.merged + stats.rewritten + stats.dropped + stats.promoted;
    log(`done (merged=${stats.merged}, rewritten=${stats.rewritten}, dropped=${stats.dropped}, promoted=${stats.promoted}, changed=${changed})`);
    ctx.logger?.debug?.(`[dsh-memory] consolidate ${label} done (merged=${stats.merged}, rewritten=${stats.rewritten}, dropped=${stats.dropped}, promoted=${stats.promoted})`);
    return { scope: label, ...stats, changed };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`failed: ${message}`);
    ctx.logger?.debug?.(`[dsh-memory] consolidate ${label} failed: ${message}`);
    return { ...empty, failed: message };
  } finally {
    clearTimeout(timer);
  }
}
async function consolidateAll(ctx, store, config, trigger) {
  if (!config.consolidateEnabled) return [];
  const entries = await store.readEntries();
  const hashes = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    if (entry.scope === "project" && entry.projectHash !== null) hashes.add(entry.projectHash);
  }
  const results = [];
  const globalResult = await consolidateScope(ctx, store, config, "global", trigger);
  if (globalResult.changed > 0 || globalResult.failed !== void 0) results.push(globalResult);
  for (const hash of hashes) {
    const result = await consolidateScope(ctx, store, config, { projectHash: hash }, trigger);
    if (result.changed > 0 || result.failed !== void 0) results.push(result);
  }
  return results;
}
function applyOps(entries, ops) {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const stats = { merged: 0, rewritten: 0, dropped: 0, promoted: 0 };
  const events = [];
  const removeIds = /* @__PURE__ */ new Set();
  const removeObjects = /* @__PURE__ */ new Set();
  const additions = [];
  for (const op of ops) {
    switch (op.type) {
      case "merge": {
        const sources = op.ids.map((id) => byId.get(id)).filter((entry) => entry !== void 0);
        if (sources.length < 2) break;
        const content = sanitizeContent(op.content);
        if (content === "" || isSensitiveContent(content)) break;
        const scope = sources[0].scope;
        const projectHash = sources[0].projectHash;
        const merged = {
          id: entryIdOf(content, scope, projectHash),
          content,
          scope,
          projectHash: scope === "project" ? projectHash : null,
          tags: sanitizeTags(op.tags),
          pinned: false,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          importance: Math.max(...sources.map((source) => source.importance)),
          lastHitAt: null,
          layer: sources.some((source) => source.layer === "long") ? "long" : "short",
          source: sources[0].source,
          version: 1,
          confidence: Math.max(...sources.map((source) => source.confidence)),
          verified: false,
          kind: sources[0].kind,
          provenance: void 0,
          embedding: void 0
        };
        const clash = byId.get(merged.id);
        if (clash !== void 0 && clash.deprecated === true) {
          clash.deprecated = void 0;
          clash.deprecatedAt = void 0;
          clash.deprecatedReason = void 0;
          clash.supersededBy = void 0;
          clash.updatedAt = nowIso();
          clash.version += 1;
        } else if (clash === void 0 || removeIds.has(merged.id)) {
          additions.push(merged);
        }
        for (const source of sources) {
          removeIds.add(source.id);
          removeObjects.add(source);
          events.push({
            action: "delete",
            entryId: source.id,
            scope: source.scope,
            projectHash: source.projectHash,
            summary: `\u5408\u5E76\uFF1A${summarize(source.content)}`,
            before: source.content
          });
        }
        events.push({
          action: "add",
          entryId: merged.id,
          scope: merged.scope,
          projectHash: merged.projectHash,
          summary: `\u5408\u5E76\u4E3A\uFF1A${summarize(merged.content)}`,
          after: merged.content
        });
        stats.merged += sources.length;
        break;
      }
      case "rewrite": {
        const entry = byId.get(op.ids[0]);
        if (entry === void 0 || entry.pinned) break;
        const content = sanitizeContent(op.content);
        if (content === "" || isSensitiveContent(content) || content === entry.content) break;
        const nextId = entryIdOf(content, entry.scope, entry.projectHash);
        if (nextId !== entry.id && byId.has(nextId)) break;
        const before = entry.content;
        entry.id = nextId;
        entry.content = content;
        entry.tags = sanitizeTags(op.tags);
        entry.updatedAt = nowIso();
        entry.version += 1;
        byId.delete(op.ids[0]);
        byId.set(nextId, entry);
        events.push({
          action: "update",
          entryId: entry.id,
          scope: entry.scope,
          projectHash: entry.projectHash,
          summary: `\u6574\u7406\u6539\u5199\uFF1A${summarize(content)}`,
          before,
          after: content
        });
        stats.rewritten += 1;
        break;
      }
      case "drop": {
        for (const id of op.ids) {
          const entry = byId.get(id);
          if (entry === void 0 || entry.pinned) continue;
          if (entry.deprecated === true) continue;
          entry.deprecated = true;
          entry.deprecatedAt = nowIso();
          entry.deprecatedReason = "consolidate-drop";
          entry.updatedAt = nowIso();
          entry.version += 1;
          events.push({
            action: "retire",
            entryId: entry.id,
            scope: entry.scope,
            projectHash: entry.projectHash,
            summary: `\u6574\u7406\u5E9F\u5F03\uFF1A${summarize(entry.content)}`,
            before: entry.content
          });
          stats.dropped += 1;
        }
        break;
      }
      case "promote": {
        for (const id of op.ids) {
          const entry = byId.get(id);
          if (entry === void 0 || entry.layer === "long") continue;
          entry.layer = "long";
          entry.updatedAt = nowIso();
          events.push({
            action: "promote",
            entryId: entry.id,
            scope: entry.scope,
            projectHash: entry.projectHash,
            summary: summarize(entry.content)
          });
          stats.promoted += 1;
        }
        break;
      }
    }
  }
  const next = entries.filter((entry) => !removeIds.has(entry.id) && !removeObjects.has(entry));
  const seen = new Set(next.map((entry) => entry.id));
  for (const addition of additions) {
    if (seen.has(addition.id)) continue;
    seen.add(addition.id);
    next.push(addition);
  }
  return { next, stats, events };
}
function selectConsolidationSet(entries, max) {
  return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, max);
}
function consolidateSystemPrompt() {
  return [
    "You are a memory consolidator for an AI assistant's long-term memory. You receive a set of existing memory entries (each with a stable id) and reorganize them into a cleaner, less redundant set \u2014 like the brain consolidating memories during sleep.",
    "Return ONLY a JSON object in this exact shape (no markdown, no commentary):",
    '{"ops":[{"type":"merge","ids":["..."],"content":"...","tags":["..."]},{"type":"rewrite","id":"...","content":"...","tags":["..."]},{"type":"drop","ids":["..."]},{"type":"promote","ids":["..."]}]}',
    "Rules:",
    '- "merge": combine 2+ near-duplicate or strongly-related entries into ONE concise entry. content must preserve all non-redundant facts; NEVER invent information not present in the inputs.',
    '- "rewrite": rewrite a single entry to be clearer, better worded, or better tagged. Only when it is genuinely ambiguous/redundant/poorly worded.',
    '- "drop": delete entries that are obsolete, fully superseded by a merge, or have no lasting value.',
    '- "promote": mark durable, frequently-relevant entries as long-term (ids only, no content).',
    "- Only reference ids that appear in the input. Omit untouched entries from ops entirely (they are kept as-is by default).",
    "- Never merge/drop/rewrite across clearly different topics.",
    "- Write content in the original language of the entries.",
    '- If nothing needs reorganizing, return {"ops":[]}.'
  ].join("\n");
}
function consolidateUserPrompt(entries) {
  const view = entries.map((entry) => ({
    id: entry.id,
    content: entry.content,
    tags: entry.tags,
    importance: entry.importance,
    layer: entry.layer
  }));
  return `Reorganize these memory entries (JSON array of {id, content, tags, importance, layer}):
${JSON.stringify(view)}`;
}
function parseConsolidateOutput(raw) {
  let text = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(text);
  if (fence !== null) text = fence[1].trim();
  text = text.replace(/^\uFEFF/, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return [];
  let parsed;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  if (typeof parsed !== "object" || parsed === null) return [];
  const ops = parsed.ops;
  if (!Array.isArray(ops)) return [];
  const out = [];
  for (const item of ops) {
    if (typeof item !== "object" || item === null) continue;
    const record = item;
    const type = record.type;
    if (type !== "merge" && type !== "rewrite" && type !== "drop" && type !== "promote") continue;
    const ids = Array.isArray(record.ids) ? record.ids.filter((id) => typeof id === "string" && id.trim() !== "").map((id) => id.trim()) : typeof record.id === "string" ? [record.id.trim()] : [];
    if (ids.length === 0) continue;
    const op = { type, ids: [...new Set(ids)] };
    if (type === "merge" || type === "rewrite") {
      const content = typeof record.content === "string" ? record.content.trim() : "";
      if (content === "") continue;
      op.content = content;
      op.tags = sanitizeTags(record.tags);
    }
    out.push(op);
  }
  return out;
}
function sanitizeContent(value) {
  return typeof value === "string" ? value.trim() : "";
}
function sanitizeTags(value) {
  return Array.isArray(value) ? value.filter((tag) => typeof tag === "string" && tag.trim() !== "").map((tag) => tag.trim()).slice(0, 8) : [];
}

// src/memory/api.ts
var ROUTE_PREFIX = "/api/dsh-memory";
function isMemoryKindValue(value) {
  return value === "identity" || value === "preference" || value === "fact" || value === "decision" || value === "gotcha" || value === "session-summary";
}
function toView(entry) {
  return {
    id: entry.id,
    content: entry.content,
    scope: entry.scope,
    projectHash: entry.projectHash,
    tags: entry.tags,
    pinned: entry.pinned,
    disabled: entry.disabled === true,
    deprecated: entry.deprecated === true,
    importance: entry.importance,
    layer: entry.layer,
    source: entry.source,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    version: entry.version,
    confidence: entry.confidence,
    verified: entry.verified,
    kind: entry.kind,
    lastHitAt: entry.lastHitAt
  };
}
function mountMemoryRoutes(ctx, store, config) {
  return ctx.webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: (req, res) => {
      void handle(ctx, store, config, req, res);
    }
  });
}
async function handle(ctx, store, config, req, res) {
  if (!loopbackAllowed(req)) {
    json(res, 403, { error: "loopback-only" });
    return;
  }
  let url;
  let rest;
  let method;
  try {
    url = new URL2(req.url ?? "/", "http://localhost");
    rest = url.pathname.slice(ROUTE_PREFIX.length);
    method = req.method ?? "GET";
  } catch {
    json(res, 400, { error: "invalid request url" });
    return;
  }
  const apiStarted = Date.now();
  if (config.logApiRequests) void store.appendApiLog(`${method} ${rest} start`).catch(() => void 0);
  try {
    if (method === "GET" && rest === "/list") {
      json(res, 200, await listView(store, url.searchParams));
      return;
    }
    if (method === "GET" && rest === "/related") {
      const entryId = url.searchParams.get("entryId") ?? "";
      const limitRaw = Number(url.searchParams.get("limit") ?? "3");
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(8, Math.round(limitRaw))) : 3;
      const entries = await store.readEntries();
      const source = entries.find((entry) => entry.id === entryId);
      if (source === void 0) {
        json(res, 200, { entries: [] });
        return;
      }
      const matches = searchEntries(
        source.content,
        entries.filter((entry) => entry.id !== entryId && entry.deprecated !== true),
        "hybrid"
      ).slice(0, limit);
      json(res, 200, { entries: matches.map((match) => toView(match.entry)) });
      return;
    }
    if (method === "GET" && rest === "/projects") {
      const entries = await store.readEntries();
      json(res, 200, { projects: await mergeWorkspaces(store, await store.listProjects(entries)) });
      return;
    }
    if (method === "GET" && rest === "/tags") {
      const entries = await store.readEntries();
      const counts = /* @__PURE__ */ new Map();
      for (const entry of entries) {
        if (entry.deprecated === true) continue;
        for (const tag of entry.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
      json(res, 200, { tags: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count })) });
      return;
    }
    if (method === "GET" && rest === "/changes") {
      const raw = url.searchParams.get("date");
      const changes = raw === "all" ? await store.readChanges() : await store.readChanges(raw ?? localDate());
      json(res, 200, {
        date: raw ?? localDate(),
        changes: changes.sort((a, b) => b.at.localeCompare(a.at))
      });
      return;
    }
    if (method === "GET" && rest === "/summary") {
      const entries = await store.readEntries();
      const today = localDate();
      json(res, 200, {
        today,
        entryCount: entries.filter((entry) => entry.deprecated !== true).length,
        // 与面板项目列表同源（含零记忆的 DSH 工作区），否则「全部项目 N」
        // 和下面列出的项目行数对不上。
        projectCount: (await mergeWorkspaces(store, await store.listProjects(entries))).length,
        todayChanges: (await store.readChanges(today)).length,
        changeCount: (await store.readChanges()).length,
        pinnedCount: entries.filter((entry) => entry.pinned && entry.deprecated !== true).length,
        disabledCount: entries.filter((entry) => entry.disabled === true).length,
        deprecatedCount: entries.filter((entry) => entry.deprecated === true).length,
        longtermCount: entries.filter((entry) => entry.layer === "long" && entry.deprecated !== true).length,
        globalCount: entries.filter((entry) => entry.scope === "global" && entry.deprecated !== true).length
      });
      return;
    }
    if (method === "GET" && rest === "/config") {
      json(res, 200, { config: publicConfig(config) });
      return;
    }
    if (method === "POST" && rest === "/config") {
      const body = await readBody(req);
      if (body.reset === true) {
        applyConfigOverrides(config, DEFAULT_CONFIG);
        await store.writeConfig({});
        json(res, 200, { ok: true, config: publicConfig(config) });
        return;
      }
      const applied = applyConfigOverrides(config, body);
      await store.writeConfig({ ...store.readConfigSync(), ...applied });
      json(res, 200, { ok: true, config: publicConfig(config) });
      return;
    }
    if (method === "GET" && rest === "/models") {
      const llm = ctx.get("llm");
      const empty = { models: [] };
      if (llm === void 0) {
        json(res, 200, empty);
        return;
      }
      const byId = /* @__PURE__ */ new Map();
      for (const provider of llm.listProviders?.() ?? []) byId.set(provider.id, provider.name ?? provider.id);
      for (const provider of llm.listConfigurableProviders?.() ?? []) {
        if (!byId.has(provider.provider)) byId.set(provider.provider, provider.name ?? provider.provider);
      }
      const models = [];
      for (const [provider, providerName] of byId) {
        try {
          const infos = await llm.listModels?.(provider);
          const ids = (infos ?? []).map((info) => info.id).filter((id) => typeof id === "string" && id !== "");
          if (ids.length > 0) models.push({ provider, providerName, models: ids });
        } catch {
        }
      }
      json(res, 200, { models });
      return;
    }
    if (method === "GET" && rest === "/inject-state") {
      const sessionId = url.searchParams.get("sessionId") ?? "";
      const defaultEnabled = config.injectDefaultEnabled !== false;
      const explicit = await store.injectStateOf(sessionId);
      json(res, 200, { enabled: explicit ?? defaultEnabled, defaultEnabled, explicit });
      return;
    }
    if (method === "POST" && rest === "/inject-state") {
      const body = await readBody(req);
      const sessionId = requireString(body.sessionId, "sessionId");
      const enabled = body.enabled === null ? null : body.enabled !== false;
      await store.setInjectEnabled(sessionId, enabled);
      const defaultEnabled = config.injectDefaultEnabled !== false;
      json(res, 200, { ok: true, enabled: enabled ?? defaultEnabled, defaultEnabled, explicit: enabled !== null });
      return;
    }
    if (method === "POST" && rest === "/pin") {
      const body = await readBody(req);
      const entryId = requireString(body.entryId, "entryId");
      const pinned = body.pinned !== false;
      const entry = await store.patchEntry(entryId, { pinned });
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      await compileAll(store, config);
      json(res, 200, { ok: true, entry: toView(entry) });
      return;
    }
    if (method === "POST" && rest === "/enable") {
      const body = await readBody(req);
      const entryId = requireString(body.entryId, "entryId");
      const enabled = body.enabled !== false;
      const existing = await store.getEntry(entryId);
      if (existing === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      const entry = await store.patchEntry(entryId, { disabled: !enabled });
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      await store.appendChange({
        action: "update",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `${enabled ? "\u542F\u7528" : "\u7981\u7528"}\uFF1A${summarize(entry.content)}`
      });
      await compileAll(store, config);
      json(res, 200, { ok: true, entry: toView(entry) });
      return;
    }
    if (method === "POST" && rest === "/update") {
      const body = await readBody(req);
      const entryId = requireString(body.entryId, "entryId");
      const patch = {};
      if (typeof body.content === "string" && body.content.trim() !== "") {
        patch.content = body.content.trim();
      }
      if (Array.isArray(body.tags)) {
        patch.tags = body.tags.filter((tag) => typeof tag === "string" && tag.trim() !== "").map((tag) => tag.trim()).slice(0, 8);
      }
      if (typeof body.importance === "number" && Number.isFinite(body.importance)) {
        patch.importance = Math.max(1, Math.min(20, Math.round(body.importance * 10) / 10));
      }
      if (typeof body.pinned === "boolean") patch.pinned = body.pinned;
      if (isMemoryKindValue(body.kind)) patch.kind = body.kind;
      if (body.layer === "short" || body.layer === "long") patch.layer = body.layer;
      const before = await store.getEntry(entryId);
      const entry = await store.patchEntry(entryId, patch);
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      await store.appendChange({
        action: "update",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: summarize(entry.content),
        before: before?.content,
        after: entry.content
      });
      await compileAll(store, config);
      json(res, 200, { ok: true, entry: toView(entry) });
      return;
    }
    if (method === "POST" && rest === "/move") {
      const body = await readBody(req);
      const entryId = requireString(body.entryId, "entryId");
      const existing = await store.getEntry(entryId);
      if (existing === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      let scope = existing.scope;
      let projectHash = existing.projectHash;
      if (body.scope === "global") {
        scope = "global";
        projectHash = null;
      } else if (body.scope === "project") {
        scope = "project";
        const rawHash = typeof body.projectHash === "string" ? body.projectHash.trim() : "";
        const rawPath = typeof body.path === "string" ? body.path.trim() : "";
        projectHash = /^[0-9a-f]{12}$/i.test(rawHash) ? rawHash.toLowerCase() : rawHash !== "" ? projectHashOf(rawHash) : rawPath !== "" ? projectHashOf(rawPath) : existing.projectHash;
        if (projectHash === null) throw new Error("\u79FB\u5165\u9879\u76EE\u9700\u8981 projectHash \u6216 path");
        const meta = await store.readProjectMeta(projectHash);
        if (meta === void 0) {
          const rawPath2 = typeof body.path === "string" ? body.path.trim() : "";
          const rawHash2 = typeof body.projectHash === "string" ? body.projectHash.trim() : "";
          const path = rawPath2 !== "" ? rawPath2 : /^[0-9a-f]{12}$/i.test(rawHash2) ? "\u624B\u52A8\u5F52\u5C5E" : rawHash2;
          await store.writeProjectMeta(projectHash, {
            path: path === "" ? "\u624B\u52A8\u5F52\u5C5E" : path,
            alias: null,
            locked: true
          });
        }
      }
      const entry = await store.patchEntry(entryId, { scope, projectHash });
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      await store.appendChange({
        action: "update",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `\u79FB\u9879\u76EE\uFF1A${summarize(entry.content)}`,
        before: existing.content,
        after: entry.content
      });
      await compileAll(store, config);
      json(res, 200, { ok: true, entry: toView(entry) });
      return;
    }
    if (method === "POST" && rest === "/delete") {
      const body = await readBody(req);
      const entryId = requireString(body.entryId, "entryId");
      const existing = await store.getEntry(entryId);
      if (existing === void 0) {
        json(res, 200, { ok: true, alreadyGone: true });
        return;
      }
      const ok = await store.removeEntry(entryId);
      if (!ok) {
        json(res, 200, { ok: true, alreadyGone: true });
        return;
      }
      await store.appendChange({
        action: "delete",
        entryId,
        scope: existing.scope,
        projectHash: existing.projectHash,
        summary: `\u5220\u9664\uFF1A${summarize(existing.content)}`
      });
      await compileAll(store, config);
      json(res, 200, { ok: true });
      return;
    }
    if (method === "POST" && rest === "/delete-batch") {
      const body = await readBody(req);
      const ids = Array.isArray(body.entryIds) ? body.entryIds.filter((id) => typeof id === "string" && id.trim() !== "").map((id) => id.trim()) : [];
      if (ids.length === 0) throw new Error("entryIds \u4E0D\u80FD\u4E3A\u7A7A");
      const wanted = new Set(ids);
      const removed = await store.mutateEntries((entries) => {
        const targets = entries.filter((entry) => wanted.has(entry.id));
        for (const target of targets) entries.splice(entries.indexOf(target), 1);
        return targets;
      });
      for (const entry of removed) {
        await store.appendChange({
          action: "delete",
          entryId: entry.id,
          scope: entry.scope,
          projectHash: entry.projectHash,
          summary: `\u5220\u9664\uFF1A${summarize(entry.content)}`,
          before: entry.content
        });
      }
      await compileAll(store, config);
      json(res, 200, { ok: true, deleted: removed.length, missing: ids.length - removed.length });
      return;
    }
    if (method === "POST" && rest === "/delete-today") {
      const body = await readBody(req);
      const scope = body.scope === "global" || body.scope === "project" ? body.scope : void 0;
      const projectHash = typeof body.projectHash === "string" && body.projectHash.trim() !== "" ? body.projectHash.trim() : void 0;
      const today = localDate();
      const removed = await store.mutateEntries((entries) => {
        const targets = entries.filter((entry) => {
          if (entry.pinned || entry.deprecated === true) return false;
          if (scope !== void 0 && entry.scope !== scope) return false;
          if (scope === "project" && projectHash !== void 0 && entry.projectHash !== projectHash) return false;
          const stamp = entry.updatedAt ?? entry.createdAt;
          const time = Date.parse(stamp);
          return !Number.isNaN(time) && localDate(new Date(time)) === today;
        });
        for (const target of targets) entries.splice(entries.indexOf(target), 1);
        return targets;
      });
      for (const entry of removed) {
        await store.appendChange({
          action: "delete",
          entryId: entry.id,
          scope: entry.scope,
          projectHash: entry.projectHash,
          summary: `\u5220\u9664\u4ECA\u65E5\uFF1A${summarize(entry.content)}`,
          before: entry.content
        });
      }
      await compileAll(store, config);
      json(res, 200, { ok: true, deleted: removed.length });
      return;
    }
    if (method === "POST" && rest === "/revise") {
      const body = await readBody(req);
      const entryId = requireString(body.entryId, "entryId");
      const content = typeof body.content === "string" ? body.content.trim() : "";
      if (content === "") throw new Error("content \u4E0D\u80FD\u4E3A\u7A7A");
      const target = await store.getEntry(entryId);
      if (target === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      const result = await store.reviseEntry({
        id: entryId,
        content,
        reason: typeof body.reason === "string" ? body.reason : void 0,
        tags: Array.isArray(body.tags) ? body.tags.filter((tag) => typeof tag === "string" && tag.trim() !== "").map((tag) => tag.trim()).slice(0, 8) : void 0,
        importance: typeof body.importance === "number" && Number.isFinite(body.importance) ? Math.max(1, Math.min(10, Math.round(body.importance))) : void 0
      });
      if (result === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\u6216\u5DF2\u5E9F\u5F03\uFF1A${entryId}`);
      await store.appendChange({
        action: "revise",
        entryId: result.deprecatedId,
        scope: target.scope,
        projectHash: target.projectHash,
        summary: `\u4FEE\u8BA2\u4E3A\uFF1A${summarize(result.entry.content)}`,
        before: target.content,
        after: result.entry.content
      });
      await compileAll(store, config);
      json(res, 200, {
        ok: true,
        deprecatedId: result.deprecatedId,
        newId: result.newId,
        entry: toView(result.entry)
      });
      return;
    }
    if (method === "POST" && rest === "/retire") {
      const body = await readBody(req);
      const entryId = requireString(body.entryId, "entryId");
      const entry = await store.retireEntry(entryId, typeof body.reason === "string" ? body.reason : void 0);
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      await store.appendChange({
        action: "retire",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `\u5E9F\u5F03\uFF1A${summarize(entry.content)}`,
        before: entry.content
      });
      await compileAll(store, config);
      json(res, 200, { ok: true, entry: toView(entry) });
      return;
    }
    if (method === "POST" && rest === "/restore") {
      const body = await readBody(req);
      const entryId = requireString(body.entryId, "entryId");
      const entry = await store.restoreEntry(entryId);
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      await store.appendChange({
        action: "update",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `\u6062\u590D\uFF1A${summarize(entry.content)}`,
        after: entry.content
      });
      await compileAll(store, config);
      json(res, 200, { ok: true, entry: toView(entry) });
      return;
    }
    if (method === "POST" && rest === "/meta") {
      const body = await readBody(req);
      const hash = requireString(body.projectHash, "projectHash");
      const meta = await store.readProjectMeta(hash);
      const next = {
        path: meta?.path ?? (typeof body.path === "string" && body.path !== "" ? body.path : "\u624B\u52A8\u5F52\u5C5E"),
        alias: typeof body.alias === "string" ? body.alias.trim() === "" ? null : body.alias.trim().slice(0, 64) : meta?.alias ?? null,
        locked: typeof body.locked === "boolean" ? body.locked : meta?.locked ?? true,
        autoMemory: typeof body.autoMemory === "boolean" ? body.autoMemory : meta?.autoMemory ?? true
      };
      await store.writeProjectMeta(hash, next);
      json(res, 200, { ok: true, meta: { ...next, hash } });
      return;
    }
    if (method === "POST" && rest === "/delete-project") {
      const body = await readBody(req);
      const projectHash = requireString(body.projectHash, "projectHash");
      const removed = await store.mutateEntries((entries) => {
        const targets = entries.filter((entry) => entry.scope === "project" && entry.projectHash === projectHash && !entry.pinned);
        for (const target of targets) {
          entries.splice(entries.indexOf(target), 1);
        }
        return targets;
      });
      for (const entry of removed) {
        await store.appendChange({
          action: "delete",
          entryId: entry.id,
          scope: entry.scope,
          projectHash: entry.projectHash,
          summary: `\u6E05\u7A7A\u9879\u76EE\uFF1A${summarize(entry.content)}`
        });
      }
      await compileAll(store, config);
      json(res, 200, { ok: true, deleted: removed.length });
      return;
    }
    if (method === "POST" && rest === "/remember") {
      const body = await readBody(req);
      const content = typeof body.content === "string" ? body.content.trim() : "";
      if (content === "") throw new Error("content \u4E0D\u80FD\u4E3A\u7A7A");
      const scope = body.scope === "global" ? "global" : "project";
      const projectHash = scope === "project" ? typeof body.projectHash === "string" && body.projectHash !== "" ? body.projectHash : null : null;
      if (scope === "project" && projectHash === null) {
        throw new Error("\u9879\u76EE\u5C42\u8BB0\u5FC6\u9700\u8981 projectHash\uFF08\u5F53\u524D\u65E0\u5DE5\u4F5C\u533A\uFF0C\u8BF7\u7528\u5168\u5C40\u6216\u6307\u5B9A\u9879\u76EE\uFF09");
      }
      const tags = Array.isArray(body.tags) ? body.tags.filter((tag) => typeof tag === "string" && tag.trim() !== "").map((tag) => tag.trim()).slice(0, 8) : [];
      const importance = typeof body.importance === "number" && Number.isFinite(body.importance) ? Math.max(1, Math.min(10, Math.round(body.importance))) : 8;
      const pinned = body.pinned === true;
      if (scope === "project" && projectHash !== null) {
        const meta = await store.readProjectMeta(projectHash);
        if (meta === void 0) {
          await store.writeProjectMeta(projectHash, {
            path: typeof body.path === "string" && body.path !== "" ? body.path : "\u624B\u52A8\u5F52\u5C5E",
            alias: null,
            locked: false
          });
        }
      }
      const beforeEntry = await store.getEntry(entryIdOf(content, scope, scope === "project" ? projectHash : null));
      const { created, entry } = await store.upsertEntry({
        content,
        scope,
        projectHash: scope === "project" ? projectHash : null,
        tags,
        importance,
        pinned,
        source: "manual"
      });
      await store.appendChange({
        action: created ? "add" : "update",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: summarize(entry.content),
        before: beforeEntry?.content,
        after: entry.content
      });
      await compileAll(store, config);
      json(res, 200, { ok: true, created, entry: toView(entry) });
      return;
    }
    if (method === "POST" && rest === "/consolidate") {
      const body = await readBody(req);
      const scopeRaw = typeof body.scope === "string" ? body.scope : "all";
      let results;
      if (scopeRaw === "global") {
        results = [await consolidateScope(ctx, store, config, "global", "manual")];
      } else if (scopeRaw === "project") {
        const projectHash = requireString(body.projectHash, "projectHash");
        results = [await consolidateScope(ctx, store, config, { projectHash }, "manual")];
      } else {
        results = await consolidateAll(ctx, store, config, "manual");
      }
      json(res, 200, { ok: true, results });
      return;
    }
    if (method === "GET" && rest === "/revisions") {
      json(res, 200, { revisions: await store.listRevisions() });
      return;
    }
    if (method === "POST" && rest === "/rollback") {
      const body = await readBody(req);
      const revisionId = requireString(body.revisionId, "revisionId");
      const ok = await store.restoreRevision(revisionId);
      if (!ok) throw new Error(`\u4FEE\u8BA2\u4E0D\u5B58\u5728\uFF1A${revisionId}`);
      await compileAll(store, config);
      ctx.logger?.info?.(`[dsh-memory] rolled back to revision ${revisionId}`);
      json(res, 200, { ok: true });
      return;
    }
    json(res, 404, { error: `no route for ${method} ${rest}` });
  } catch (error) {
    json(res, 400, { error: error instanceof Error ? error.message : String(error) });
  } finally {
    if (config.logApiRequests) void store.appendApiLog(`${method} ${rest} done ${Date.now() - apiStarted}ms`).catch(() => void 0);
  }
}
async function listView(store, params) {
  const entries = await store.readEntries();
  const scope = params.get("scope");
  const project = params.get("project");
  const q = params.get("q")?.trim().toLowerCase() ?? "";
  const tag = params.get("tag");
  const includeDeprecated = params.get("includeDeprecated") === "1";
  const scoped = entries.filter((entry) => {
    if (scope === "global" && entry.scope !== "global") return false;
    if (scope === "project" && entry.scope !== "project") return false;
    if (project !== null && project !== "" && entry.projectHash !== project) return false;
    if (tag !== null && tag !== "" && !entry.tags.includes(tag)) return false;
    if (!includeDeprecated && entry.deprecated === true) return false;
    return true;
  });
  const matched = q === "" ? scoped : searchEntries(q, scoped, "hybrid").filter((match) => match.score >= 0.2).map((match) => match.entry);
  const views = (q === "" ? [...matched].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  }) : [...matched].sort((a, b) => a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1)).map(toView);
  return { entries: views, projects: await mergeWorkspaces(store, await store.listProjects(entries)) };
}
async function mergeWorkspaces(store, projects) {
  const known = new Set(projects.map((project) => project.hash));
  for (const workspace of await store.listDshWorkspaces()) {
    const hash = projectHashOf(workspace.path);
    if (!known.has(hash)) {
      projects.push({
        hash,
        path: workspace.path,
        alias: workspace.title,
        locked: false,
        autoMemory: true,
        entryCount: 0,
        pinnedCount: 0
      });
      known.add(hash);
    }
  }
  projects.sort((a, b) => a.path.localeCompare(b.path));
  return projects;
}
function isLoopbackAddress(address) {
  if (typeof address !== "string") return false;
  const a = address.toLowerCase();
  if (a === "::1") return true;
  const ipv4 = a.startsWith("::ffff:") ? a.slice(7) : a;
  const octets = ipv4.split(".");
  return octets.length === 4 && octets[0] === "127" && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function hostNameOf(value) {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase();
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    if (close <= 1) return null;
    const suffix = host.slice(close + 1);
    if (suffix !== "" && !/^:\d+$/.test(suffix)) return null;
    return host.slice(1, close);
  }
  const firstColon = host.indexOf(":");
  const lastColon = host.lastIndexOf(":");
  if (firstColon !== lastColon) return null;
  return firstColon === -1 ? host : host.slice(0, firstColon);
}
function loopbackAllowed(req) {
  if (!isLoopbackAddress(req.socket.remoteAddress)) return false;
  const host = hostNameOf(req.headers.host);
  if (host === null) return false;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}
function json(res, status2, value) {
  const body = JSON.stringify(value);
  res.writeHead(status2, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache"
  });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 4 * 1024 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) {
        resolvePromise({});
        return;
      }
      try {
        resolvePromise(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error instanceof Error ? error : new Error("invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}
function requireString(value, name2) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name2} \u4E0D\u80FD\u4E3A\u7A7A`);
  }
  return value.trim();
}

// src/memory/engine/inject.ts
var MAX_HITS_PER_INJECTION = 5;
function textOf(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.map((part) => {
    if (typeof part !== "object" || part === null) return "";
    const record = part;
    return record.type === "text" && typeof record.text === "string" ? record.text : "";
  }).join(" ");
}
function extractQuery(messages) {
  const texts = [];
  for (const message of messages) {
    if (typeof message !== "object" || message === null) continue;
    const msg = message;
    if (typeof msg.source?.kind === "string" && msg.source.kind !== "user") continue;
    if (msg.role !== "user" && msg.role !== void 0) continue;
    texts.push(textOf(msg.content));
  }
  return texts.join(" ").replace(/\s+/g, " ").trim().slice(0, 300);
}
var SAFETY_RULE = [
  "\u3010\u5B89\u5168\u89C4\u8303\u3011\u6240\u6709 GitHub/OpenAI/AWS/Slack token\u3001\u79C1\u94A5\u3001password \u7B49\u654F\u611F\u51ED\u636E",
  "\u4E25\u7981\u63D0\u4EA4\u6216\u66F4\u65B0\u5230 GitHub \u4ED3\u5E93\uFF1B\u4EE3\u7801\u4E2D\u4E00\u5F8B\u7528\u73AF\u5883\u53D8\u91CF\u5F15\u7528\uFF0C",
  "\u5E76\u786E\u4FDD .gitignore \u6392\u9664\u542B\u51ED\u636E\u7684\u6587\u4EF6\u3002"
].join("");
function createMemoryInjector(store, config, logger) {
  const stepCounters = /* @__PURE__ */ new Map();
  async function buildMemoryBlock(agent, query) {
    const entries = await store.readEntries();
    const hash = workspaceHashOf(agent.session.header);
    const visible = entries.filter((entry) => entry.disabled !== true && entry.deprecated !== true && (entry.scope === "global" || entry.scope === "project" && entry.projectHash === hash));
    if (visible.length === 0) return null;
    const pinned = visible.filter((entry) => entry.pinned);
    const identity = visible.filter((entry) => entry.scope === "global" && !entry.pinned && (entry.kind === "identity" || entry.kind === "preference"));
    const longterm = visible.filter((entry) => entry.layer === "long" && !entry.pinned && !identity.includes(entry));
    const rest = visible.filter((entry) => !pinned.includes(entry) && !identity.includes(entry) && !longterm.includes(entry));
    const topK = query.trim() === "" ? selectInjectionEntries(rest, config.compileThreshold).slice(0, config.injectTopK) : searchEntries(query, rest, "hybrid").slice(0, config.injectTopK).map((match) => match.entry);
    const selected = [...pinned, ...identity, ...longterm, ...topK];
    if (selected.length === 0) return null;
    const hitCandidates = selected.filter((entry) => entry.lastHitAt === null || daysSince(entry.lastHitAt) >= 1).slice(0, MAX_HITS_PER_INJECTION);
    if (hitCandidates.length > 0) {
      const hitIds = new Set(hitCandidates.map((entry) => entry.id));
      const refreshed = await store.applyHits(hitIds, config.hitBonus);
      logger?.debug?.(`[dsh-memory] hit refresh: ${refreshed} entries`);
    }
    return buildInjectionText(selected, config);
  }
  const preStepListener = async (payload, next) => {
    let decision;
    try {
      decision = await next();
    } catch (error) {
      logger?.warn?.(`[dsh-memory] pre-step next() failed: ${error instanceof Error ? error.message : String(error)}`);
      return { kind: "reject" };
    }
    if (decision.kind !== "enter" || payload.signal.aborted) return decision;
    const sessionId = payload.agent.session.id;
    if (!await store.isInjectEnabled(sessionId, config.injectDefaultEnabled !== false)) return decision;
    if (stepCounters.has(sessionId)) return decision;
    stepCounters.set(sessionId, 1);
    try {
      const query = extractQuery(payload.messages);
      const block = await buildMemoryBlock(payload.agent, query);
      if (block === null || block.text === "") return decision;
      const wrapped = [
        SAFETY_RULE,
        "\u3010\u957F\u671F\u8BB0\u5FC6 \xB7 \u7528\u6237\u8981\u6C42\u6309\u9700\u6267\u884C\u6216\u53C2\u8003\u3011",
        "\uFF08\u82E5\u4E0E\u5F53\u524D\u9879\u76EE\u7684 AGENTS.md / \u9879\u76EE\u6307\u4EE4\u6216\u7CFB\u7EDF\u63D0\u793A\u51B2\u7A81\uFF0C\u4E00\u5F8B\u4EE5\u9879\u76EE\u6307\u4EE4\u4E3A\u51C6\uFF1B\u8BB0\u5FC6\u4EC5\u4F5C\u53C2\u8003\u4E0E\u7528\u6237\u504F\u597D\u8865\u5145\uFF09",
        block.text
      ].join("\n");
      const memoryMessage = createUserMessage({
        content: [{ type: "text", text: wrapped }],
        source: {
          kind: "plugin",
          plugin: "dsh-memory",
          form: "snapshot",
          sections: [{ name: "\u5B89\u5168\u89C4\u8303", text: SAFETY_RULE }, ...block.sections]
        }
      });
      return { kind: "enter", messages: [...decision.messages, memoryMessage] };
    } catch (error) {
      logger?.warn?.(`[dsh-memory] injection failed: ${error instanceof Error ? error.message : String(error)}`);
      return decision;
    }
  };
  return {
    preStepListener,
    disposeSession: (sessionId) => {
      stepCounters.delete(sessionId);
    }
  };
}

// src/memory-store-singleton.ts
var webuiMemoryStoreSingleton;
function setWebuiMemoryStore(store) {
  webuiMemoryStoreSingleton = store;
}

// src/memory/engine/ticker.ts
var SESSION_END_DEBOUNCE_MS = 15e3;
var DAILY_CHECK_INTERVAL_MS = 60 * 60 * 1e3;
function createTicker(ctx, store, config) {
  let queue = Promise.resolve();
  const enqueue = (task) => {
    const result = queue.then(task);
    queue = result.then(() => void 0, () => void 0);
    return result;
  };
  const enqueueSafe = (task) => {
    enqueue(task).catch((error) => {
      ctx.logger?.warn?.(`[dsh-memory] ticker task failed: ${error instanceof Error ? error.message : String(error)}`);
    });
  };
  const sessionEndTimers = /* @__PURE__ */ new Map();
  async function runDailyCompile() {
    const today = localDate();
    const state = await store.readState();
    const last = state.lastDailyDate;
    state.lastDailyDate = today;
    await store.writeState(state);
    if (last === today) return;
    const days = last === null ? 1 : Math.max(1, Math.floor((Date.parse(today) - Date.parse(last)) / 864e5));
    let promoted = [];
    let evicted = [];
    let pruned = [];
    await store.replaceEntries((entries) => {
      const live = [];
      const frozen = [];
      for (const entry of entries) {
        if (entry.deprecated === true) frozen.push(entry);
        else live.push(entry);
      }
      const decayed = live.map((entry) => ({
        ...entry,
        importance: decayImportance(entry.importance, days, config.decayLambda)
      }));
      const result = promoteEntries(decayed, config.compileThreshold);
      promoted = result.promoted;
      const kept = [];
      evicted = [];
      for (const entry of result.remaining) {
        if (shouldEvict(entry, config.compileThreshold)) evicted.push(entry);
        else kept.push(entry);
      }
      pruned = [];
      if (config.pruneNeverHitDays > 0) {
        pruned = kept.filter((entry) => {
          if (entry.source !== "extract") return false;
          if (entry.pinned === true || entry.verified === true || entry.disabled === true) return false;
          const idleSince = entry.lastHitAt ?? entry.createdAt;
          return daysSince(idleSince) >= config.pruneNeverHitDays;
        });
      }
      const prunedIds = new Set(pruned.map((entry) => entry.id));
      const survivor = [...promoted, ...kept.filter((entry) => !prunedIds.has(entry.id)), ...frozen];
      let finalSurvivor = survivor;
      if (finalSurvivor.length > config.entryLimit) {
        const overflow = finalSurvivor.filter((entry) => !entry.pinned && entry.deprecated !== true).sort((a, b) => a.importance - b.importance || a.updatedAt.localeCompare(b.updatedAt)).slice(0, finalSurvivor.length - config.entryLimit);
        const overflowIds = new Set(overflow.map((entry) => entry.id));
        evicted.push(...overflow);
        finalSurvivor = finalSurvivor.filter((entry) => !overflowIds.has(entry.id));
      }
      return finalSurvivor;
    });
    for (const entry of promoted) {
      await store.appendChange({
        action: "promote",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: summarize(entry.content)
      });
    }
    for (const entry of evicted) {
      await store.appendChange({
        action: "delete",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `\u4F4E\u5206\u6761\u76EE\u6EDA\u51FA\uFF1A${summarize(entry.content)}`
      });
    }
    for (const entry of pruned) {
      await store.appendChange({
        action: "delete",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `\u95F2\u7F6E ${config.pruneNeverHitDays} \u5929\u81EA\u52A8\u6E05\u7406\uFF1A${summarize(entry.content)}`
      });
    }
    await compileAll(store, config);
    await writeDailyLog(store);
    ctx.logger?.debug?.(`[dsh-memory] daily compile done (promoted=${promoted.length}, evicted=${evicted.length}, pruned=${pruned.length})`);
    if (config.consolidateEnabled) {
      const results = await consolidateAll(ctx, store, config, "daily");
      const changed = results.reduce((sum, result) => sum + result.changed, 0);
      if (changed > 0) {
        ctx.logger?.debug?.(`[dsh-memory] daily consolidate done (scopes=${results.length}, changed=${changed})`);
      }
    }
  }
  async function runTurnCompile(sessionId, turnCount) {
    if (turnCount % config.compileEveryTurns !== 0) return;
    await compileAll(store, config);
    ctx.logger?.debug?.(`[dsh-memory] incremental compile (session=${sessionId}, turns=${turnCount})`);
  }
  function scheduleSessionEnd(sessionId) {
    const existing = sessionEndTimers.get(sessionId);
    if (existing !== void 0) clearTimeout(existing);
    const timer = setTimeout(() => {
      sessionEndTimers.delete(sessionId);
      enqueueSafe(async () => {
        await compileAll(store, config);
        await writeDailyLog(store);
        ctx.logger?.debug?.(`[dsh-memory] final compile (session=${sessionId})`);
      });
    }, SESSION_END_DEBOUNCE_MS);
    sessionEndTimers.set(sessionId, timer);
  }
  function onTurnEnd(sessionId, _agent) {
    const result = enqueue(async () => {
      const state = await store.readState();
      const per = state.perSession[sessionId] ?? { turnCount: 0, lastInjectedStep: 0 };
      per.turnCount += 1;
      state.perSession[sessionId] = per;
      const today = localDate();
      if (state.lastDailyDate !== today) {
        await store.writeState(state);
        if (config.dailyCompileEnabled) await runDailyCompile();
      } else {
        await store.writeState(state);
      }
      await runTurnCompile(sessionId, per.turnCount);
    });
    scheduleSessionEnd(sessionId);
    return result;
  }
  const timerService = ctx.get("timer");
  const checkInterval = timerService?.interval(() => {
    enqueueSafe(async () => {
      const state = await store.readState();
      const today = localDate();
      if (state.lastDailyDate !== today && config.dailyCompileEnabled) {
        await runDailyCompile();
      }
    });
  }, DAILY_CHECK_INTERVAL_MS);
  function dispose() {
    if (typeof checkInterval === "function") checkInterval();
    for (const timer of sessionEndTimers.values()) clearTimeout(timer);
    sessionEndTimers.clear();
  }
  return { onTurnEnd, enqueue, dispose };
}

// vendor/dsh-session/json.ts
function hasIntrinsicConstructor(prototype, name2) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "constructor");
  const constructor = descriptor?.value;
  if (typeof constructor !== "function") return false;
  try {
    return constructor.name === name2 && constructor.prototype === prototype && Function.prototype.toString.call(constructor) === `function ${name2}() { [native code] }`;
  } catch {
    return false;
  }
}
function isIntrinsicObjectPrototype(value) {
  return Object.getPrototypeOf(value) === null && hasIntrinsicConstructor(value, "Object");
}
function hasPlainArrayPrototype(value) {
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(prototype) || !hasIntrinsicConstructor(prototype, "Array")) return false;
  const objectPrototype = Object.getPrototypeOf(prototype);
  return typeof objectPrototype === "object" && objectPrototype !== null && isIntrinsicObjectPrototype(objectPrototype);
}
function hasPlainObjectPrototype(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || typeof prototype === "object" && isIntrinsicObjectPrototype(prototype);
}
function enumerableStringKeys(value) {
  const keys = Reflect.ownKeys(value);
  if (keys.some((key) => typeof key !== "string" || !Object.prototype.propertyIsEnumerable.call(value, key))) return void 0;
  return keys;
}
function walkJsonValue(value, detach) {
  const ancestors = /* @__PURE__ */ new Set();
  let root;
  const assign = (destination, item) => {
    if (destination === void 0) return;
    if (destination.kind === "root") {
      root = item;
    } else if (destination.kind === "array") {
      destination.target[destination.index] = item;
    } else {
      Object.defineProperty(destination.target, destination.key, {
        value: item,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
  };
  const tasks = [{
    kind: "visit",
    value,
    ...detach ? { destination: { kind: "root" } } : {}
  }];
  for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
    if (task.kind === "leave") {
      ancestors.delete(task.source);
      continue;
    }
    if (task.kind === "array-item") {
      if (!Object.prototype.hasOwnProperty.call(task.source, task.index)) return void 0;
      tasks.push({
        kind: "visit",
        value: task.source[task.index],
        ...task.target === void 0 ? {} : { destination: { kind: "array", target: task.target, index: task.index } }
      });
      continue;
    }
    if (task.kind === "object-property") {
      tasks.push({
        kind: "visit",
        value: task.source[task.key],
        ...task.target === void 0 ? {} : { destination: { kind: "object", target: task.target, key: task.key } }
      });
      continue;
    }
    const current = task.value;
    if (current === null) {
      assign(task.destination, null);
      continue;
    }
    if (typeof current === "boolean" || typeof current === "string") {
      assign(task.destination, current);
      continue;
    }
    if (typeof current === "number") {
      if (!Number.isFinite(current) || Object.is(current, -0)) return void 0;
      assign(task.destination, current);
      continue;
    }
    if (typeof current !== "object") return void 0;
    if (ancestors.has(current)) return void 0;
    if (Array.isArray(current)) {
      if (!hasPlainArrayPrototype(current)) return void 0;
      const length = current.length;
      if (Reflect.ownKeys(current).length !== length + 1) return void 0;
      const target2 = detach ? [] : void 0;
      if (target2 !== void 0) assign(task.destination, target2);
      ancestors.add(current);
      tasks.push({ kind: "leave", source: current });
      for (let index = length - 1; index >= 0; index--) {
        tasks.push({ kind: "array-item", source: current, index, ...target2 === void 0 ? {} : { target: target2 } });
      }
      continue;
    }
    if (!hasPlainObjectPrototype(current)) return void 0;
    const keys = enumerableStringKeys(current);
    if (keys === void 0) return void 0;
    const target = detach ? {} : void 0;
    if (target !== void 0) assign(task.destination, target);
    ancestors.add(current);
    tasks.push({ kind: "leave", source: current });
    for (let index = keys.length - 1; index >= 0; index--) {
      const key = keys[index];
      if (key === void 0) return void 0;
      tasks.push({ kind: "object-property", source: current, key, ...target === void 0 ? {} : { target } });
    }
  }
  return detach ? root : true;
}
function isJsonValue(value) {
  return walkJsonValue(value, false) === true;
}

// vendor/dsh-tools/json-schema.ts
var JsonSchemaError = class extends HarnessError {
  /** Individual schema violations in walk order. */
  violations;
  constructor(violations) {
    super(`unsupported JSON schema: ${violations.join("; ")}`, "UNSUPPORTED_SCHEMA");
    this.name = "JsonSchemaError";
    this.violations = violations;
  }
};
var CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
  "type",
  "oneOf",
  "properties",
  "required",
  "additionalProperties",
  "items",
  "enum",
  "const"
]);
var ANNOTATION_KEYWORDS = /* @__PURE__ */ new Set(["description", "title", "default", "examples"]);
var SCHEMA_TYPES = ["object", "array", "string", "number", "integer", "boolean", "null"];
function hasIntrinsicConstructor2(prototype, name2) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "constructor");
  const constructor = descriptor?.value;
  if (typeof constructor !== "function") return false;
  try {
    return constructor.name === name2 && constructor.prototype === prototype && Function.prototype.toString.call(constructor) === `function ${name2}() { [native code] }`;
  } catch {
    return false;
  }
}
function isIntrinsicObjectPrototype2(value) {
  return Object.getPrototypeOf(value) === null && hasIntrinsicConstructor2(value, "Object");
}
function isPlainJsonRecord(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  try {
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || typeof prototype === "object" && isIntrinsicObjectPrototype2(prototype);
  } catch {
    return false;
  }
}
function hasPlainArrayPrototype2(value) {
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(prototype) || !hasIntrinsicConstructor2(prototype, "Array")) return false;
  const objectPrototype = Object.getPrototypeOf(prototype);
  return typeof objectPrototype === "object" && objectPrototype !== null && isIntrinsicObjectPrototype2(objectPrototype);
}
function hasOnlyEnumerableStringKeys(value) {
  try {
    return Reflect.ownKeys(value).every((key) => typeof key === "string" && Object.prototype.propertyIsEnumerable.call(value, key));
  } catch {
    return false;
  }
}
function isJsonSchemaRecord(value) {
  return isPlainJsonRecord(value) && hasOnlyEnumerableStringKeys(value);
}
function isPlainJsonArray(value) {
  if (!Array.isArray(value)) return false;
  try {
    if (!hasPlainArrayPrototype2(value) || Reflect.ownKeys(value).length !== value.length + 1) return false;
    for (let index = 0; index < value.length; index++) {
      if (!Object.hasOwn(value, index)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
function isJsonNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && !Object.is(value, -0);
}
function scalarMatches(type, value) {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return isJsonNumber(value);
    case "integer":
      return isJsonNumber(value) && Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "null":
      return value === null;
    /* v8 ignore next -- JsonSchemaScalarType is closed; this retains compile-time exhaustiveness. */
    default:
      return assertNever(type, "JsonSchemaType");
  }
}
var ONE_OF_SIBLING_KEYWORDS = ["properties", "required", "additionalProperties", "items", "enum", "const"];
function checkObjectSchemaTail(node, path, properties, violations) {
  const hasRequired = Object.hasOwn(node, "required");
  const required = hasRequired ? node.required : void 0;
  if (hasRequired) {
    if (!isPlainJsonArray(required) || required.some((entry) => typeof entry !== "string")) {
      violations.push(`${path}.required must be an array of strings`);
    } else {
      const declared = isJsonSchemaRecord(properties) ? properties : {};
      for (const key of required) {
        if (!Object.hasOwn(declared, key)) violations.push(`${path}.required names "${key}" which is not in properties`);
      }
    }
  }
  if (Object.hasOwn(node, "additionalProperties") && typeof node.additionalProperties !== "boolean") {
    violations.push(`${path}.additionalProperties must be a boolean`);
  }
}
function checkSchemaNode(root, rootPath, violations, seen) {
  const tasks = [{ kind: "enter", node: root, path: rootPath }];
  for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
    if (task.kind === "leave") {
      seen.delete(task.node);
      continue;
    }
    if (task.kind === "one-of-tail") {
      for (const key of ONE_OF_SIBLING_KEYWORDS) {
        if (Object.hasOwn(task.node, key)) violations.push(`${task.path}.${key} is not supported beside oneOf`);
      }
      continue;
    }
    if (task.kind === "object-tail") {
      checkObjectSchemaTail(task.node, task.path, task.properties, violations);
      continue;
    }
    const { node, path } = task;
    if (!isJsonSchemaRecord(node)) {
      violations.push(`${path} must be a schema object`);
      continue;
    }
    if (seen.has(node)) {
      violations.push(`${path} is circular`);
      continue;
    }
    seen.add(node);
    tasks.push({ kind: "leave", node });
    for (const key of Object.keys(node)) {
      if (CONSTRAINT_KEYWORDS.has(key)) continue;
      if (ANNOTATION_KEYWORDS.has(key)) {
        try {
          if (!isJsonValue(node[key])) violations.push(`${path}.${key} annotation must be lossless JSON data`);
        } catch {
          violations.push(`${path}.${key} annotation must be lossless JSON data`);
        }
        continue;
      }
      violations.push(`${path}.${key} is not a supported keyword (subset: type/oneOf/properties/required/additionalProperties/items/enum/const + annotations)`);
    }
    if (Object.hasOwn(node, "description") && typeof node.description !== "string") {
      violations.push(`${path}.description must be a string`);
    }
    if (Object.hasOwn(node, "title") && typeof node.title !== "string") {
      violations.push(`${path}.title must be a string`);
    }
    const hasType = Object.hasOwn(node, "type");
    const hasOneOf = Object.hasOwn(node, "oneOf");
    if (hasType && hasOneOf) {
      violations.push(`${path} cannot declare both type and oneOf`);
      continue;
    }
    if (!hasType && !hasOneOf) {
      for (const key of ONE_OF_SIBLING_KEYWORDS) {
        if (Object.hasOwn(node, key)) violations.push(`${path}.${key} requires type or oneOf`);
      }
      continue;
    }
    if (hasOneOf) {
      const oneOf = node.oneOf;
      tasks.push({ kind: "one-of-tail", node, path });
      if (!isPlainJsonArray(oneOf) || oneOf.length < 2) {
        violations.push(`${path}.oneOf must be an array of at least two schemas`);
      } else {
        for (let index = oneOf.length - 1; index >= 0; index--) {
          tasks.push({ kind: "enter", node: oneOf[index], path: `${path}.oneOf[${index}]` });
        }
      }
      continue;
    }
    const type = node.type;
    if (typeof type !== "string" || !SCHEMA_TYPES.includes(type)) {
      violations.push(Array.isArray(type) ? `${path}.type must be a single type string (type arrays are not supported)` : `${path}.type must be one of ${SCHEMA_TYPES.join("/")}`);
      continue;
    }
    const schemaType = type;
    const allowedFor = {
      properties: ["object"],
      required: ["object"],
      additionalProperties: ["object"],
      items: ["array"],
      enum: ["string", "number", "integer", "boolean", "null"],
      const: ["string", "number", "integer", "boolean", "null"]
    };
    for (const [key, types] of Object.entries(allowedFor)) {
      if (Object.hasOwn(node, key) && !types.includes(schemaType)) {
        violations.push(`${path}.${key} is not supported on type "${schemaType}"`);
      }
    }
    switch (schemaType) {
      case "object": {
        const properties = Object.hasOwn(node, "properties") ? node.properties : void 0;
        tasks.push({ kind: "object-tail", node, path, properties });
        if (Object.hasOwn(node, "properties")) {
          if (!isJsonSchemaRecord(properties)) {
            violations.push(`${path}.properties must be an object of schemas`);
          } else {
            const entries = Object.entries(properties);
            for (let index = entries.length - 1; index >= 0; index--) {
              const entry = entries[index];
              if (entry === void 0) continue;
              tasks.push({ kind: "enter", node: entry[1], path: `${path}.properties.${entry[0]}` });
            }
          }
        }
        break;
      }
      case "array": {
        if (Object.hasOwn(node, "items")) tasks.push({ kind: "enter", node: node.items, path: `${path}.items` });
        break;
      }
      case "string":
      case "number":
      case "integer":
      case "boolean":
      case "null": {
        const hasEnum = Object.hasOwn(node, "enum");
        const allowed = hasEnum ? node.enum : void 0;
        const enumValid = isPlainJsonArray(allowed) && allowed.length > 0 && allowed.every((entry) => scalarMatches(schemaType, entry));
        if (hasEnum && !enumValid) {
          violations.push(`${path}.enum must be a non-empty array of ${schemaType} values`);
        }
        const hasConst = Object.hasOwn(node, "const");
        const declaredConst = hasConst ? node.const : void 0;
        const constValid = scalarMatches(schemaType, declaredConst);
        if (hasConst) {
          if (!constValid) {
            violations.push(`${path}.const must be a ${schemaType} value`);
          } else if (enumValid && !allowed.includes(declaredConst)) {
            violations.push(`${path}.const must be one of ${path}.enum when both are declared`);
          }
        }
        break;
      }
      /* v8 ignore next -- schemaType was narrowed from the closed SCHEMA_TYPES table above. */
      default:
        assertNever(schemaType, "JsonSchemaType");
    }
  }
}
function assertSupportedJsonSchema(schema) {
  const violations = [];
  checkSchemaNode(schema, "schema", violations, /* @__PURE__ */ new Set());
  if (violations.length > 0) throw new JsonSchemaError(violations);
}
function safelyIsJsonValue(value) {
  try {
    return isJsonValue(value);
  } catch {
    return false;
  }
}
function diagnosticPath(path) {
  return path === "" ? "arguments" : path;
}
function propertyPath(path, key) {
  return path === "" ? key : `${path}.${key}`;
}
function losslessValueViolation(path) {
  return [`"${diagnosticPath(path)}" must be a lossless JSON value`];
}
function appendViolations(target, source) {
  for (const violation of source) target.push(violation);
}
function valueFrame(node, value, path) {
  return {
    node,
    value,
    path,
    catches: false,
    phase: "start",
    children: [],
    childIndex: 0,
    violations: [],
    tailViolations: [],
    matches: 0
  };
}
function checkScalarValue(node, value, path) {
  const allowed = Object.hasOwn(node, "enum") ? node.enum : void 0;
  if (allowed !== void 0 && !allowed.includes(value)) {
    return [`"${diagnosticPath(path)}" must be one of ${JSON.stringify(allowed)}`];
  }
  if (Object.hasOwn(node, "const") && value !== node.const) {
    return [`"${diagnosticPath(path)}" must be ${JSON.stringify(node.const)}`];
  }
  return [];
}
function checkValue(schema, value, path) {
  const frames = [valueFrame(schema, value, path)];
  let rootResult;
  const receive = (result) => {
    const parent = frames.at(-1);
    if (parent === void 0) {
      rootResult = result;
      return;
    }
    if (parent.kind === "oneOf") {
      if (result.length === 0) parent.matches++;
    } else {
      appendViolations(parent.violations, result);
    }
  };
  const finish = (result) => {
    frames.pop();
    receive(result);
  };
  while (frames.length > 0) {
    const frame = frames.at(-1);
    if (frame === void 0) break;
    try {
      if (frame.phase === "children") {
        if (frame.childIndex < frame.children.length) {
          const child = frame.children[frame.childIndex];
          if (child === void 0) throw new Error("missing schema-value child frame");
          frame.childIndex++;
          frames.push(valueFrame(child.node, child.value, child.path));
          continue;
        }
        if (frame.kind === "oneOf") {
          finish(frame.matches === 1 ? [] : [`"${diagnosticPath(frame.path)}" must match exactly one oneOf branch (matched ${frame.matches})`]);
          continue;
        }
        appendViolations(frame.violations, frame.tailViolations);
        if (frame.violations.length > 0) {
          finish(frame.violations);
        } else if (frame.kind === "object") {
          finish(safelyIsJsonValue(frame.value) ? [] : [`"${diagnosticPath(frame.path)}" must be a lossless JSON object`]);
        } else {
          finish(safelyIsJsonValue(frame.value) ? [] : [`"${diagnosticPath(frame.path)}" must be a dense lossless JSON array`]);
        }
        continue;
      }
      const nodeType = Object.hasOwn(frame.node, "type") ? frame.node.type : void 0;
      frame.catches = !(nodeType !== void 0 && !SCHEMA_TYPES.includes(nodeType));
      const oneOf = Object.hasOwn(frame.node, "oneOf") ? frame.node.oneOf : void 0;
      if (oneOf !== void 0) {
        frame.kind = "oneOf";
        frame.children = Array.from(oneOf, (branch) => ({ node: branch, value: frame.value, path: frame.path }));
        frame.childIndex = 0;
        frame.matches = 0;
        frame.phase = "children";
        continue;
      }
      if (nodeType === void 0) {
        finish(safelyIsJsonValue(frame.value) ? [] : losslessValueViolation(frame.path));
        continue;
      }
      switch (nodeType) {
        case "object": {
          if (!isPlainJsonRecord(frame.value)) {
            finish([`"${diagnosticPath(frame.path)}" must be an object`]);
            break;
          }
          const properties = Object.hasOwn(frame.node, "properties") ? frame.node.properties ?? {} : {};
          const violations = [];
          const required = Object.hasOwn(frame.node, "required") ? frame.node.required ?? [] : [];
          for (const key of required) {
            if (!Object.hasOwn(frame.value, key) || frame.value[key] === void 0) {
              violations.push(`missing required property "${propertyPath(frame.path, key)}"`);
            }
          }
          const children = [];
          for (const [key, child] of Object.entries(properties)) {
            if (!Object.hasOwn(frame.value, key) || frame.value[key] === void 0) continue;
            children.push({ node: child, value: frame.value[key], path: propertyPath(frame.path, key) });
          }
          const tailViolations = [];
          if (Object.hasOwn(frame.node, "additionalProperties") && frame.node.additionalProperties === false) {
            for (const key of Object.keys(frame.value)) {
              if (!Object.hasOwn(properties, key)) {
                tailViolations.push(`"${propertyPath(frame.path, key)}" is not a declared property (additionalProperties: false)`);
              }
            }
          }
          frame.kind = "object";
          frame.children = children;
          frame.childIndex = 0;
          frame.violations = violations;
          frame.tailViolations = tailViolations;
          frame.phase = "children";
          break;
        }
        case "array": {
          if (!Array.isArray(frame.value)) {
            finish([`"${diagnosticPath(frame.path)}" must be an array`]);
            break;
          }
          const items = Object.hasOwn(frame.node, "items") ? frame.node.items : void 0;
          const children = items === void 0 ? [] : frame.value.flatMap((entry, index) => [{ node: items, value: entry, path: `${frame.path}[${index}]` }]);
          frame.kind = "array";
          frame.children = children;
          frame.childIndex = 0;
          frame.violations = [];
          frame.phase = "children";
          break;
        }
        case "string":
          finish(typeof frame.value === "string" ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be a string`]);
          break;
        case "number":
          finish(typeof frame.value !== "number" ? [`"${diagnosticPath(frame.path)}" must be a number`] : !isJsonNumber(frame.value) ? [`"${diagnosticPath(frame.path)}" must be a finite JSON number`] : checkScalarValue(frame.node, frame.value, frame.path));
          break;
        case "integer":
          finish(!isJsonNumber(frame.value) || !Number.isInteger(frame.value) ? [`"${diagnosticPath(frame.path)}" must be an integer`] : checkScalarValue(frame.node, frame.value, frame.path));
          break;
        case "boolean":
          finish(typeof frame.value === "boolean" ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be a boolean`]);
          break;
        case "null":
          finish(frame.value === null ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be null`]);
          break;
        default:
          finish(assertNever(nodeType, "JsonSchemaType"));
      }
    } catch (error) {
      let failed = frames.pop();
      while (failed !== void 0 && !failed.catches) failed = frames.pop();
      if (failed === void 0) throw error;
      receive(losslessValueViolation(failed.path));
    }
  }
  return rootResult ?? losslessValueViolation(path);
}
function validateJsonSchemaValue(schema, value, path = "value") {
  return checkValue(schema, value, path);
}

// vendor/dsh-tools/schema.ts
var ANNOTATION_KEYS = ["description", "title", "default", "examples"];
function authorError(message) {
  throw new JsonSchemaError([message]);
}
function copyAnnotations(source, target) {
  if (Object.hasOwn(source, "description")) target.description = source.description;
  if (Object.hasOwn(source, "title")) target.title = source.title;
  if (Object.hasOwn(source, "default")) target.default = source.default;
  if (Object.hasOwn(source, "examples")) target.examples = source.examples;
}
function assertAuthorKeys(source, path, allowed) {
  for (const key of Object.keys(source)) {
    if (!allowed.includes(key)) authorError(`${path}.${key} is not supported by the value schema DSL`);
  }
}
function assignCompiledNode(destination, node) {
  switch (destination.kind) {
    case "root":
      destination.holder.value = node;
      break;
    case "property":
      Object.defineProperty(destination.target, destination.key, {
        value: node,
        enumerable: true,
        configurable: true,
        writable: true
      });
      break;
    case "item":
      destination.target.items = node;
      break;
    case "one-of":
      destination.target[destination.index] = node;
      break;
  }
}
function assignCompiledPropertyMap(destination, compiled) {
  if (destination.kind === "root") {
    destination.holder.value = compiled;
  } else {
    destination.target.properties = compiled.properties;
  }
}
function runSchemaCompiler(initial) {
  const seen = /* @__PURE__ */ new Set();
  const tasks = [initial];
  for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
    if (task.kind === "leave") {
      seen.delete(task.input);
      continue;
    }
    if (task.kind === "property-map-tail") {
      if (task.required.length > 0) {
        task.compiled.required = task.required;
        if (task.destination.kind === "object") task.destination.target.required = task.required;
      }
      continue;
    }
    if (task.kind === "property") {
      if (!isJsonSchemaRecord(task.property)) authorError(`${task.path} must be a value schema object`);
      if (Object.hasOwn(task.property, "required") && task.property.required !== true) {
        authorError(`${task.path}.required must be true when present`);
      }
      if (Object.hasOwn(task.property, "required") && task.property.required === true) task.required.push(task.key);
      tasks.push({
        kind: "value",
        input: task.property,
        path: task.path,
        allowRequired: true,
        destination: { kind: "property", target: task.properties, key: task.key }
      });
      continue;
    }
    if (task.kind === "property-map") {
      if (!isJsonSchemaRecord(task.input)) authorError(`${task.path} must be an object of value schemas`);
      if (seen.has(task.input)) authorError(`${task.path} is circular`);
      seen.add(task.input);
      const compiled = { properties: {} };
      const required = [];
      assignCompiledPropertyMap(task.destination, compiled);
      tasks.push({ kind: "leave", input: task.input });
      tasks.push({ kind: "property-map-tail", compiled, required, destination: task.destination });
      const entries = Object.entries(task.input);
      for (let index = entries.length - 1; index >= 0; index--) {
        const entry = entries[index];
        if (entry === void 0) continue;
        tasks.push({
          kind: "property",
          property: entry[1],
          path: `${task.path}.${entry[0]}`,
          key: entry[0],
          properties: compiled.properties,
          required
        });
      }
      continue;
    }
    const { input, path } = task;
    if (!isJsonSchemaRecord(input)) authorError(`${path} must be a value schema object`);
    if (seen.has(input)) authorError(`${path} is circular`);
    seen.add(input);
    const authorKeys = [...ANNOTATION_KEYS, ...task.allowRequired ? ["required"] : []];
    const node = {};
    assignCompiledNode(task.destination, node);
    tasks.push({ kind: "leave", input });
    if (Object.hasOwn(input, "oneOf")) {
      assertAuthorKeys(input, path, [...authorKeys, "oneOf", "type"]);
      if (Object.hasOwn(input, "type")) authorError(`${path} cannot declare both type and oneOf`);
      if (!isPlainJsonArray(input.oneOf)) authorError(`${path}.oneOf must be an array of at least two value schemas`);
      const branches = [];
      node.oneOf = branches;
      copyAnnotations(input, node);
      for (let index = input.oneOf.length - 1; index >= 0; index--) {
        tasks.push({
          kind: "value",
          input: input.oneOf[index],
          path: `${path}.oneOf[${index}]`,
          allowRequired: false,
          destination: { kind: "one-of", target: branches, index }
        });
      }
      continue;
    }
    const inputType = Object.hasOwn(input, "type") ? input.type : void 0;
    switch (inputType) {
      case "json":
        assertAuthorKeys(input, path, [...authorKeys, "type"]);
        copyAnnotations(input, node);
        break;
      case "object":
        assertAuthorKeys(input, path, [...authorKeys, "type", "properties", "additionalProperties"]);
        if (!Object.hasOwn(input, "additionalProperties") || typeof input.additionalProperties !== "boolean") {
          authorError(`${path}.additionalProperties must be explicitly true or false`);
        }
        node.type = "object";
        copyAnnotations(input, node);
        node.additionalProperties = input.additionalProperties;
        if (Object.hasOwn(input, "properties")) {
          tasks.push({
            kind: "property-map",
            input: input.properties,
            path: `${path}.properties`,
            destination: { kind: "object", target: node }
          });
        }
        break;
      case "array":
        assertAuthorKeys(input, path, [...authorKeys, "type", "items"]);
        node.type = "array";
        copyAnnotations(input, node);
        if (Object.hasOwn(input, "items")) {
          tasks.push({
            kind: "value",
            input: input.items,
            path: `${path}.items`,
            allowRequired: false,
            destination: { kind: "item", target: node }
          });
        }
        break;
      case "string":
      case "number":
      case "integer":
      case "boolean":
      case "null":
        assertAuthorKeys(input, path, [...authorKeys, "type", "enum", "const"]);
        node.type = inputType;
        copyAnnotations(input, node);
        if (Object.hasOwn(input, "enum")) {
          if (!isPlainJsonArray(input.enum)) authorError(`${path}.enum must be a non-empty array of scalar values`);
          node.enum = Array.from(input.enum, (entry) => entry);
        }
        if (Object.hasOwn(input, "const")) node.const = input.const;
        break;
      default:
        authorError(`${path}.type must be string/number/integer/boolean/null/array/object/json, or use oneOf`);
    }
  }
}
function compilePropertyMap(input, path) {
  const holder = {};
  runSchemaCompiler({ kind: "property-map", input, path, destination: { kind: "root", holder } });
  return holder.value ?? authorError(`${path} did not compile`);
}
function compileValueSchema(input, path) {
  const holder = {};
  runSchemaCompiler({ kind: "value", input, path, allowRequired: false, destination: { kind: "root", holder } });
  return holder.value ?? authorError(`${path} did not compile`);
}
function valueSchemaSpecToJsonSchema(spec) {
  const schema = compileValueSchema(spec, "schema");
  assertSupportedJsonSchema(schema);
  return schema;
}
function parameterSchemaSpecToJsonSchema(spec) {
  const compiled = compilePropertyMap(spec, "parameters");
  const schema = {
    type: "object",
    properties: compiled.properties,
    ...compiled.required === void 0 ? {} : { required: compiled.required }
  };
  assertSupportedJsonSchema(schema);
  return schema;
}
var ToolArgsError = class extends HarnessError {
  /** Individual violations in schema-walk order. */
  violations;
  constructor(violations) {
    super(`invalid arguments: ${violations.join("; ")}`, "INVALID_ARGS");
    this.name = "ToolArgsError";
    this.violations = violations;
  }
};
function defineTool(options) {
  const userExecute = options.execute;
  const userFinalizeContent = options.finalizeContent;
  const userRender = options.output.render;
  const userPresentationMeta = options.output.presentationMeta;
  const userPresentCall = options.presentCall;
  const userPresentResult = options.presentResult;
  const userIsConcurrencySafe = options.isConcurrencySafe;
  if (options.timeoutMs !== void 0 && (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0)) {
    throw new Error(`defineTool(${options.name}): timeoutMs must be a positive finite number`);
  }
  const parameters = parameterSchemaSpecToJsonSchema(options.parameters);
  const outputSchema = valueSchemaSpecToJsonSchema(options.output.schema);
  const validate = (args) => validateJsonSchemaValue(parameters, args, "");
  const tool = {
    name: options.name,
    description: options.description,
    parameters,
    output: {
      schema: outputSchema,
      render(args, value) {
        return userRender(args, value);
      },
      ...userPresentationMeta !== void 0 ? {
        presentationMeta(args, value) {
          return userPresentationMeta(args, value);
        }
      } : {}
    },
    ...options.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {},
    async execute(args, exec) {
      const violations = validate(args);
      if (violations.length > 0) throw new ToolArgsError(violations);
      return userExecute(args, exec);
    }
  };
  if (userFinalizeContent) {
    tool.finalizeContent = (exec, result) => userFinalizeContent(exec, result);
  }
  if (userPresentCall) {
    tool.presentCall = (args) => {
      if (validate(args).length > 0) return void 0;
      return userPresentCall(args);
    };
  }
  if (userPresentResult) {
    tool.presentResult = (args, result) => {
      if (validate(args).length > 0) return void 0;
      return userPresentResult(args, result);
    };
  }
  if (userIsConcurrencySafe) {
    tool.isConcurrencySafe = (args) => {
      if (validate(args).length > 0) return false;
      return userIsConcurrencySafe(args);
    };
  }
  return tool;
}

// src/memory/tools.ts
function registerMemoryTools(ctx, store, config) {
  const disposers = [];
  disposers.push(ctx.tools.register(textTool({
    name: "memory_search",
    description: '\u641C\u7D22\u672C\u5730\u957F\u671F\u8BB0\u5FC6\uFF08\u8BED\u4E49\u76F8\u4F3C\u5EA6 + \u5173\u952E\u8BCD\uFF0C\u652F\u6301\u6309\u5185\u5BB9/\u6807\u7B7E/\u9879\u76EE/\u8303\u56F4\u8FC7\u6EE4\uFF09\u3002\u7528\u4E4B\u524D\u8BB0\u4F4F\u7684\u51B3\u5B9A\u3001\u504F\u597D\u3001\u8E29\u5751\u3001\u9879\u76EE\u4E0A\u4E0B\u6587\uFF0C\u6216\u56DE\u7B54"\u6211\u8BB0\u5F97/\u4E4B\u524D\u8BF4\u8FC7"\u7C7B\u95EE\u9898\u65F6\u3002',
    parameters: {
      query: { type: "string", description: "\u641C\u7D22\u5173\u952E\u8BCD\uFF08\u7A7A\u683C\u5206\u9694\u591A\u4E2A\u8BCD\uFF09\u3002\u7559\u7A7A\u5217\u51FA\u5168\u90E8\u3002" },
      scope: { type: "string", enum: ["global", "project"], description: "global=\u5168\u5C40\u5C42\uFF08\u8EAB\u4EFD/\u504F\u597D\uFF09\uFF1Bproject=\u9879\u76EE\u5C42\u3002\u9ED8\u8BA4\u5168\u90E8\u3002" },
      project: { type: "string", description: "\u9879\u76EE\u6807\u8BC6\uFF08workspace \u8DEF\u5F84\u6216 hash\uFF09\u3002\u9ED8\u8BA4\u5F53\u524D\u5DE5\u4F5C\u533A\u9879\u76EE\u3002" },
      tag: { type: "string", description: "\u6309\u6807\u7B7E\u7B5B\u9009\u3002" },
      mode: { type: "string", enum: ["hybrid", "keyword", "semantic"], description: "\u68C0\u7D22\u6A21\u5F0F\uFF1Ahybrid=\u76F8\u4F3C\u5EA6+\u7CBE\u786E\u547D\u4E2D\uFF08\u9ED8\u8BA4\uFF09\uFF1Bkeyword=\u4EC5\u7CBE\u786E\u5B50\u4E32\uFF1Bsemantic=\u5411\u91CF\u8BED\u4E49\uFF08\u9700\u914D\u7F6E embedding\uFF0C\u672A\u914D\u7F6E\u65F6\u56DE\u9000 hybrid\uFF09\u3002" },
      includeDeprecated: { type: "boolean", description: "\u662F\u5426\u5305\u542B\u5DF2\u8F6F\u5E9F\u5F03\uFF08retire/revise \u65E7\u6761\u76EE\uFF09\u7684\u8BB0\u5FC6\u3002\u9ED8\u8BA4 false\u3002" },
      limit: { type: "integer", description: "\u8FD4\u56DE\u6761\u6570\u4E0A\u9650\uFF08\u9ED8\u8BA4 10\uFF0C\u6700\u5927 30\uFF09\u3002" }
    },
    async execute(args, exec) {
      const entries = await store.readEntries();
      const agent = exec.agent;
      const currentHash = agent !== void 0 ? workspaceHashOf(agent.session.header) : null;
      const projectFilter = typeof args.project === "string" && args.project !== "" ? resolveProjectFilter(args.project) : currentHash;
      const query = typeof args.query === "string" ? args.query : "";
      const mode = args.mode === "keyword" || args.mode === "semantic" ? args.mode : "hybrid";
      const visible = entries.filter((entry) => {
        if (entry.scope === "project" && projectFilter !== null && entry.projectHash !== projectFilter) return false;
        if (typeof args.scope === "string" && entry.scope !== args.scope) return false;
        if (typeof args.tag === "string" && args.tag !== "" && !entry.tags.includes(args.tag)) return false;
        return true;
      });
      const options = { includeDeprecated: args.includeDeprecated === true };
      const embeddingProvider = mode === "semantic" ? await getEmbeddingProvider(config) : null;
      const matches = mode === "semantic" ? await searchEntriesSemantic(query, visible, embeddingProvider, options) : searchEntries(query, visible, mode, options);
      if (embeddingProvider !== null) await store.flush();
      const limit = Math.max(1, Math.min(30, typeof args.limit === "number" ? args.limit : 10));
      const picked = matches.slice(0, limit);
      if (picked.length === 0) return "\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u8BB0\u5FC6\u3002";
      const lines = picked.map(({ entry, score }) => {
        const head = entry.pinned ? "\u{1F4CC}" : "";
        const scope = entry.scope === "global" ? "\u5168\u5C40" : "\u9879\u76EE";
        const tags = entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : "";
        const layer = entry.layer === "long" ? "\uFF08\u957F\u671F\uFF09" : "";
        const verified = entry.verified ? "" : "\u3014\u5F85\u786E\u8BA4\u3015";
        const disabledMark = entry.disabled === true ? "\u3014\u5DF2\u7981\u7528\xB7\u4E0D\u53C2\u4E0E\u6CE8\u5165\u3015" : "";
        const deprecatedMark = entry.deprecated === true ? "\u3014\u5DF2\u5E9F\u5F03\xB7retire/revise \u6807\u8BB0\u3015" : "";
        const rel = query.trim() !== "" ? `\xB7\u76F8\u5173${Math.round(score * 100)}%` : "";
        return `${entry.id} ${head}[${entry.importance}] ${scope}${layer}: ${entry.content}${disabledMark}${deprecatedMark}${verified}${rel}${tags}`;
      });
      return `${lines.join("\n")}
\uFF08\u9996\u5217\u4E3A entryId\uFF0C\u53EF\u7528\u4E8E memory_pin / memory_tag / memory_forget / memory_revise / memory_retire\uFF09`;
    }
  })));
  disposers.push(ctx.tools.register(textTool({
    name: "memory_remember",
    description: "\u624B\u52A8\u5199\u5165\u4E00\u6761\u957F\u671F\u8BB0\u5FC6\uFF08\u7528\u6237\u660E\u786E\u8981\u6C42\u8BB0\u4F4F\uFF0C\u6216\u4F60\u5224\u65AD\u503C\u5F97\u8DE8\u4F1A\u8BDD\u4FDD\u7559\u7684\u91CD\u8981\u4E8B\u5B9E/\u51B3\u5B9A\uFF09\u3002",
    parameters: {
      content: { type: "string", required: true, description: "\u8981\u8BB0\u4F4F\u7684\u5185\u5BB9\u3002" },
      scope: { type: "string", enum: ["global", "project"], description: "global=\u5168\u5C40\u5C42\uFF08\u8EAB\u4EFD/\u504F\u597D\uFF09\uFF1Bproject=\u5F53\u524D\u9879\u76EE\u5C42\u3002\u9ED8\u8BA4 project\u3002" },
      tags: { type: "array", items: { type: "string" }, description: "\u5206\u7C7B\u6807\u7B7E\uFF08\u5982 \u6280\u672F\u3001\u8E29\u5751\u3001\u67B6\u6784\u3001\u504F\u597D\uFF09\u3002" },
      importance: { type: "integer", description: "\u91CD\u8981\u6027 1-10\uFF08\u9ED8\u8BA4 8\uFF09\u3002" }
    },
    async execute(args, exec) {
      const content = String(args.content ?? "").trim();
      if (content === "") throw new Error("content \u4E0D\u80FD\u4E3A\u7A7A");
      const agent = exec.agent;
      const hash = agent !== void 0 ? workspaceHashOf(agent.session.header) : null;
      const scope = args.scope === "global" ? "global" : "project";
      if (scope === "project" && hash === null) {
        throw new Error('\u65E0\u6CD5\u5224\u5B9A\u5F53\u524D\u5DE5\u4F5C\u533A\u9879\u76EE\uFF08\u65E0 cwd\uFF09\uFF0C\u8BF7\u7528 scope: "global" \u6216\u7A0D\u540E\u91CD\u8BD5');
      }
      if (scope === "project" && (hash === null || !await store.isAutoMemoryEnabled(hash))) {
        throw new Error("\u5F53\u524D\u9879\u76EE\u7684\u81EA\u52A8\u8BB0\u5FC6\u5DF2\u5173\u95ED\uFF0C\u5DF2\u8DF3\u8FC7\u8BB0\u5F55\uFF1B\u5982\u9700\u8BB0\u5F55\u8BF7\u5148\u5728\u8BB0\u5FC6\u9762\u677F\u5F00\u542F\u8BE5\u9879\u76EE\u5F00\u5173");
      }
      const importance = typeof args.importance === "number" ? Math.max(1, Math.min(10, args.importance)) : 8;
      const tags = Array.isArray(args.tags) ? args.tags.filter((tag) => typeof tag === "string" && tag.trim() !== "").map((tag) => tag.trim()).slice(0, 8) : [];
      const { created, entry } = await store.upsertEntry({
        content,
        scope,
        projectHash: scope === "project" ? hash : null,
        tags,
        importance,
        source: "manual"
      });
      if (scope === "project" && hash !== null) {
        const meta = await store.readProjectMeta(hash);
        if (meta === void 0) {
          await store.writeProjectMeta(hash, {
            path: agent?.session.header?.cwd ?? "\u624B\u52A8\u8BB0\u5FC6",
            alias: null,
            locked: false
          });
        }
      }
      await store.appendChange({
        action: created ? "add" : "update",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: summarize(entry.content)
      });
      return created ? `\u5DF2\u8BB0\u4F4F\uFF1A${entry.content}\uFF08${scope === "global" ? "\u5168\u5C40" : "\u9879\u76EE"}${tags.length > 0 ? `\uFF0C\u6807\u7B7E\uFF1A${tags.join(", ")}` : ""}\uFF09` : `\u5DF2\u66F4\u65B0\u8BB0\u5FC6\uFF1A${entry.content}`;
    }
  })));
  disposers.push(ctx.tools.register(textTool({
    name: "memory_pin",
    description: "\u7F6E\u9876/\u53D6\u6D88\u7F6E\u9876\u4E00\u6761\u8BB0\u5FC6\uFF08\u7F6E\u9876\u7684\u8BB0\u5FC6\u59CB\u7EC8\u8FDB\u5165\u4E0A\u4E0B\u6587\u6CE8\u5165\u5E76\u663E\u793A\u5728\u7F6E\u9876\u533A\uFF09\u3002",
    parameters: {
      entryId: { type: "string", required: true, description: "\u8BB0\u5FC6\u6761\u76EE id\uFF08\u7528 memory_search \u83B7\u53D6\uFF09\u3002" },
      pinned: { type: "boolean", description: "true=\u7F6E\u9876\uFF0Cfalse=\u53D6\u6D88\u3002\u9ED8\u8BA4 true\u3002" }
    },
    async execute(args) {
      const id = String(args.entryId ?? "");
      if (id === "") throw new Error("entryId \u4E0D\u80FD\u4E3A\u7A7A");
      const entry = await store.patchEntry(id, { pinned: args.pinned !== false });
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${id}`);
      return entry.pinned ? `\u5DF2\u7F6E\u9876\uFF1A${summarize(entry.content)}` : `\u5DF2\u53D6\u6D88\u7F6E\u9876\uFF1A${summarize(entry.content)}`;
    }
  })));
  disposers.push(ctx.tools.register(textTool({
    name: "memory_tag",
    description: "\u4FEE\u6539\u4E00\u6761\u8BB0\u5FC6\u7684\u6807\u7B7E\uFF08\u8986\u76D6\u5F0F\u66F4\u65B0\u6807\u7B7E\u5217\u8868\uFF09\u3002",
    parameters: {
      entryId: { type: "string", required: true, description: "\u8BB0\u5FC6\u6761\u76EE id\u3002" },
      tags: { type: "array", items: { type: "string" }, required: true, description: "\u65B0\u7684\u6807\u7B7E\u5217\u8868\uFF08\u8986\u76D6\u65E7\u7684\uFF09\u3002" }
    },
    async execute(args) {
      const id = String(args.entryId ?? "");
      const tags = Array.isArray(args.tags) ? args.tags.filter((tag) => typeof tag === "string" && tag.trim() !== "").map((tag) => tag.trim()).slice(0, 8) : [];
      const entry = await store.patchEntry(id, { tags });
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${id}`);
      await store.appendChange({
        action: "update",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `\u6539\u6807\u7B7E\uFF1A${summarize(entry.content)}`
      });
      return `\u6807\u7B7E\u5DF2\u66F4\u65B0\uFF1A${entry.tags.length > 0 ? entry.tags.join(", ") : "\uFF08\u65E0\uFF09"}`;
    }
  })));
  disposers.push(ctx.tools.register(textTool({
    name: "memory_forget",
    description: "\u5220\u9664\u4E00\u6761\u8BB0\u5FC6\uFF08\u4EC5\u5F53\u7528\u6237\u660E\u786E\u8981\u6C42\u5220\u9664/\u9057\u5FD8\u67D0\u6761\u8BB0\u5FC6\u65F6\u4F7F\u7528\uFF09\u3002",
    parameters: {
      entryId: { type: "string", required: true, description: "\u8BB0\u5FC6\u6761\u76EE id\uFF08\u7528 memory_search \u83B7\u53D6\uFF09\u3002" }
    },
    async execute(args) {
      const id = String(args.entryId ?? "");
      if (id === "") throw new Error("entryId \u4E0D\u80FD\u4E3A\u7A7A");
      const entry = await store.getEntry(id);
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${id}`);
      const ok = await store.removeEntry(id);
      if (!ok) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${id}`);
      await store.appendChange({
        action: "delete",
        entryId: id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `\u5220\u9664\uFF1A${summarize(entry.content)}`
      });
      return `\u5DF2\u5220\u9664\u8BB0\u5FC6\uFF1A${summarize(entry.content)}`;
    }
  })));
  disposers.push(ctx.tools.register(textTool({
    name: "memory_revise",
    description: "\u4FEE\u8BA2\u4E00\u6761\u8BB0\u5FC6\uFF1A\u8F6F\u5E9F\u5F03\u65E7\u6761\u76EE\uFF08\u4FDD\u7559\u6570\u636E\u4F46\u4E0D\u518D\u68C0\u7D22/\u6CE8\u5165\uFF09\uFF0C\u5199\u5165\u65B0\u5185\u5BB9\u4F5C\u4E3A\u540E\u7EE7\u6761\u76EE\u3002\u7528\u4E8E\u8BB0\u5FC6\u8FC7\u65F6/\u9519\u8BEF/\u9700\u8981\u91CD\u5199\u65F6\u3002\u8FD4\u56DE\u65B0\u65E7\u4E24\u4E2A id\u3002",
    parameters: {
      entryId: { type: "string", required: true, description: "\u8981\u4FEE\u8BA2\u7684\u65E7\u6761\u76EE id\uFF08\u7528 memory_search \u83B7\u53D6\uFF09\u3002" },
      content: { type: "string", required: true, description: "\u65B0\u7684\u8BB0\u5FC6\u5185\u5BB9\uFF08\u4F5C\u4E3A\u540E\u7EE7\u6761\u76EE\uFF09\u3002" },
      reason: { type: "string", description: "\u4FEE\u8BA2\u539F\u56E0\uFF08\u8BB0\u5F55\u5728\u65E7\u6761\u76EE\u7684\u5E9F\u5F03\u539F\u56E0\u4E2D\uFF09\u3002" },
      tags: { type: "array", items: { type: "string" }, description: "\u540E\u7EE7\u6761\u76EE\u7684\u6807\u7B7E\uFF08\u7F3A\u7701\u7EE7\u627F\u65E7\u6761\u76EE\u6807\u7B7E\uFF09\u3002" },
      importance: { type: "integer", description: "\u540E\u7EE7\u6761\u76EE\u7684\u91CD\u8981\u5EA6 1-10\uFF08\u7F3A\u7701\u7EE7\u627F\u65E7\u6761\u76EE\uFF09\u3002" }
    },
    async execute(args, exec) {
      const entryId = String(args.entryId ?? "");
      if (entryId === "") throw new Error("entryId \u4E0D\u80FD\u4E3A\u7A7A");
      const content = String(args.content ?? "").trim();
      if (content === "") throw new Error("content \u4E0D\u80FD\u4E3A\u7A7A");
      const agent = exec.agent;
      const hash = agent !== void 0 ? workspaceHashOf(agent.session.header) : null;
      const target = await store.getEntry(entryId);
      if (target === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${entryId}`);
      if (target.scope === "project" && (hash === null || !await store.isAutoMemoryEnabled(target.projectHash ?? hash))) {
        throw new Error("\u8BE5\u9879\u76EE\u7684\u81EA\u52A8\u8BB0\u5FC6\u5DF2\u5173\u95ED\uFF0C\u5DF2\u8DF3\u8FC7\u4FEE\u8BA2\uFF1B\u5982\u9700\u8BB0\u5F55\u8BF7\u5148\u5728\u8BB0\u5FC6\u9762\u677F\u5F00\u542F\u8BE5\u9879\u76EE\u5F00\u5173");
      }
      const result = await store.reviseEntry({
        id: entryId,
        content,
        reason: typeof args.reason === "string" ? args.reason : void 0,
        tags: Array.isArray(args.tags) ? args.tags.filter((tag) => typeof tag === "string" && tag.trim() !== "").map((tag) => tag.trim()).slice(0, 8) : void 0,
        importance: typeof args.importance === "number" ? Math.max(1, Math.min(10, args.importance)) : void 0
      });
      if (result === void 0) {
        const current = await store.getEntry(entryId);
        if (current !== void 0 && current.deprecated !== true && current.content.trim() === content) {
          throw new Error("\u65B0\u5185\u5BB9\u4E0E\u65E7\u6761\u76EE\u76F8\u540C\uFF0C\u65E0\u9700\u4FEE\u8BA2\uFF1B\u5982\u9700\u8C03\u6574\u8BF7\u7528 memory_tag / memory_pin \u6216\u4FEE\u6539\u5143\u6570\u636E");
        }
        throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\u6216\u5DF2\u5E9F\u5F03\uFF1A${entryId}`);
      }
      await store.appendChange({
        action: "revise",
        entryId: result.deprecatedId,
        scope: target.scope,
        projectHash: target.projectHash,
        summary: `\u4FEE\u8BA2\u4E3A\uFF1A${summarize(result.entry.content)}`,
        before: target.content,
        after: result.entry.content
      });
      await compileAll(store, config);
      return `\u5DF2\u4FEE\u8BA2\u8BB0\u5FC6\uFF1A\u65E7\u6761\u76EE ${result.deprecatedId} \u5DF2\u8F6F\u5E9F\u5F03\uFF0C\u65B0\u6761\u76EE ${result.newId} \u5DF2\u8BB0\u5F55\uFF1A${summarize(result.entry.content)}`;
    }
  })));
  disposers.push(ctx.tools.register(textTool({
    name: "memory_retire",
    description: "\u8F6F\u5E9F\u5F03\u4E00\u6761\u8BB0\u5FC6\uFF08retire\uFF09\uFF1A\u6570\u636E\u4FDD\u7559\u4F46\u4E0D\u518D\u53C2\u4E0E\u68C0\u7D22/\u6CE8\u5165/\u7F16\u8BD1\u3002\u7528\u4E8E\u300C\u8FD9\u6761\u8BB0\u5FC6\u8FC7\u65F6\u4E86\u4F46\u4E0D\u60F3\u5F7B\u5E95\u5220\u9664\u300D\u7684\u573A\u666F\u3002\u5F7B\u5E95\u5220\u9664\u8BF7\u7528 memory_forget\u3002",
    parameters: {
      entryId: { type: "string", required: true, description: "\u8981\u5E9F\u5F03\u7684\u6761\u76EE id\uFF08\u7528 memory_search \u83B7\u53D6\uFF09\u3002" },
      reason: { type: "string", description: "\u5E9F\u5F03\u539F\u56E0\u3002" }
    },
    async execute(args) {
      const id = String(args.entryId ?? "");
      if (id === "") throw new Error("entryId \u4E0D\u80FD\u4E3A\u7A7A");
      const entry = await store.retireEntry(id, typeof args.reason === "string" ? args.reason : void 0);
      if (entry === void 0) throw new Error(`\u8BB0\u5FC6\u4E0D\u5B58\u5728\uFF1A${id}`);
      await store.appendChange({
        action: "retire",
        entryId: entry.id,
        scope: entry.scope,
        projectHash: entry.projectHash,
        summary: `\u5E9F\u5F03\uFF1A${summarize(entry.content)}`,
        before: entry.content
      });
      await compileAll(store, config);
      return `\u5DF2\u8F6F\u5E9F\u5F03\u8BB0\u5FC6\uFF1A${summarize(entry.content)}\uFF08\u6570\u636E\u4FDD\u7559\uFF0C\u4E0D\u518D\u6CE8\u5165\uFF1B\u53EF\u7528 memory_search includeDeprecated \u67E5\u770B\uFF09`;
    }
  })));
  disposers.push(ctx.tools.register(textTool({
    name: "memory_consolidate",
    description: "\u6574\u7406\u672C\u5730\u8BB0\u5FC6\uFF08\u5408\u5E76\u91CD\u590D/\u53BB\u91CD/\u7CBE\u70BC\u91CD\u5199/\u5220\u9664\u4F4E\u4EF7\u503C/\u63D0\u5347\u957F\u671F\uFF09\u2014\u2014\u5373 openhanako \u7684 Memory Dream\u3002\u6BCF\u5929\u4F1A\u81EA\u52A8\u8FD0\u884C\u4E00\u6B21\uFF0C\u4E5F\u53EF\u624B\u52A8\u89E6\u53D1\u3002",
    parameters: {
      scope: { type: "string", enum: ["all", "global", "project"], description: "all=\u5168\u5C40+\u5168\u90E8\u9879\u76EE\uFF1Bglobal=\u4EC5\u5168\u5C40\u5C42\uFF1Bproject=\u5F53\u524D\u5DE5\u4F5C\u533A\u9879\u76EE\u3002\u9ED8\u8BA4 all\u3002" }
    },
    async execute(args, exec) {
      let results;
      if (args.scope === "global") {
        results = [await consolidateScope(ctx, store, config, "global", "manual")];
      } else if (args.scope === "project") {
        const agent = exec.agent;
        const hash = agent !== void 0 ? workspaceHashOf(agent.session.header) : null;
        if (hash === null) throw new Error('\u65E0\u6CD5\u5224\u5B9A\u5F53\u524D\u5DE5\u4F5C\u533A\u9879\u76EE\uFF08\u65E0 cwd\uFF09\uFF0C\u8BF7\u7528 scope: "all" \u6216 "global"');
        results = [await consolidateScope(ctx, store, config, { projectHash: hash }, "manual")];
      } else {
        results = await consolidateAll(ctx, store, config, "manual");
      }
      const changed = results.reduce((sum, result) => sum + result.changed, 0);
      if (changed === 0) return "\u8BB0\u5FC6\u5DF2\u662F\u6700\u4F73\u72B6\u6001\uFF0C\u672C\u6B21\u6574\u7406\u65E0\u53D8\u52A8\u3002";
      const lines = results.map((result) => `- ${result.scope}\uFF1A\u5408\u5E76 ${result.merged}\u3001\u6539\u5199 ${result.rewritten}\u3001\u5220\u9664 ${result.dropped}\u3001\u63D0\u5347\u957F\u671F ${result.promoted}`);
      return `\u5DF2\u6574\u7406\u8BB0\u5FC6\uFF08${changed} \u5904\u53D8\u52A8\uFF09\uFF1A
${lines.join("\n")}`;
    }
  })));
  return () => {
    for (const dispose of disposers) dispose();
  };
}
function resolveProjectFilter(project) {
  const trimmed = project.trim();
  if (trimmed === "") return null;
  if (/^[0-9a-f]{12}$/.test(trimmed)) return trimmed;
  return projectHashOf(trimmed);
}
var cachedProvider;
var cachedProviderKey = "";
async function getEmbeddingProvider(config) {
  const key = `${config.embeddingProvider}|${config.embeddingBaseUrl}|${config.embeddingModel}`;
  if (cachedProviderKey === key) return cachedProvider ?? null;
  cachedProviderKey = key;
  cachedProvider = resolveEmbeddingProvider(config);
  return cachedProvider;
}
var TOOL_PRESENTATION = {
  memory_search: { kind: "read", title: (args) => `\u8BB0\u5FC6\u641C\u7D22\uFF1A${String(args.query ?? "")}` },
  memory_remember: { kind: "other", title: () => "\u8BB0\u5F55\u8BB0\u5FC6" },
  memory_pin: { kind: "other", title: (args) => `\u7F6E\u9876\uFF1A${String(args.entryId ?? "")}` },
  memory_tag: { kind: "other", title: (args) => `\u6539\u6807\u7B7E\uFF1A${String(args.entryId ?? "")}` },
  memory_forget: { kind: "other", title: (args) => `\u5220\u9664\uFF1A${String(args.entryId ?? "")}` },
  memory_revise: { kind: "other", title: (args) => `\u4FEE\u8BA2\uFF1A${String(args.entryId ?? "")}` },
  memory_retire: { kind: "other", title: (args) => `\u5E9F\u5F03\uFF1A${String(args.entryId ?? "")}` },
  memory_consolidate: { kind: "other", title: () => "\u6574\u7406\u8BB0\u5FC6" }
};
function textTool(definition) {
  const presentation = TOOL_PRESENTATION[definition.name];
  return defineTool({
    ...definition,
    output: {
      schema: { type: "string" },
      render: (_args, value) => [{ type: "text", text: value }]
    },
    presentCall: (args) => ({
      card: "generic",
      kind: presentation.kind,
      title: presentation.title(args),
      rawInput: args
    })
  });
}

// src/memory/index.ts
function resolveConfig(input, persisted) {
  const config = { ...DEFAULT_CONFIG };
  if (persisted !== void 0) applyConfigOverrides(config, persisted);
  applyConfigOverrides(config, input);
  return config;
}
function applyMemory(ctx, input) {
  const store = new MemoryStore();
  setWebuiMemoryStore(store);
  const config = resolveConfig(input, store.readConfigSync());
  const logError = (stage, error) => {
    const message = error instanceof Error ? error.stack ?? error.message : String(error);
    ctx.logger?.warn?.(`[dsh-memory] ${stage}: ${message}`);
    void store.appendErrorLog(stage, message).catch(() => void 0);
  };
  const ticker = createTicker(ctx, store, config);
  ctx.effect(() => ticker.dispose, "dsh-memory: ticker");
  const injector = createMemoryInjector(store, config, ctx.logger);
  ctx.on("agent/pre-step", ((payload, next) => injector.preStepListener(payload, next)), { prepend: true });
  ctx.on("agent/disposed", ({ agent }) => {
    injector.disposeSession(agent.session.id);
  });
  const toolsDispose = registerMemoryTools(ctx, store, config);
  ctx.effect(() => toolsDispose, "dsh-memory: tools");
  const routesDispose = mountMemoryRoutes(ctx, store, config);
  ctx.effect(() => routesDispose, "dsh-memory: routes");
  const turnBuffers = /* @__PURE__ */ new Map();
  ctx.on("session/event", (session, event) => {
    if (event.type === "turn/start") {
      turnBuffers.set(session.id, []);
      return;
    }
    if (event.type === "turn/end") {
      const buffer = turnBuffers.get(session.id) ?? [];
      turnBuffers.delete(session.id);
      const turnNumber = event.data.turn ?? 0;
      void ticker.onTurnEnd(session.id, { id: session.id }).catch((error) => logError("ticker.onTurnEnd", error));
      const agents = ctx.get("agents");
      const agent = agents?.get(session.id);
      if (agent === void 0) return;
      void ticker.enqueue(async () => {
        await extractTurn(ctx, store, config, agent, buffer, turnNumber);
      }).catch((error) => logError("extractTurn", error));
      return;
    }
    if (event.type === "user/message" || event.type === "assistant/message") {
      const buffer = turnBuffers.get(session.id);
      if (buffer === void 0) return;
      buffer.push({ type: event.type, data: event.data });
    }
  });
  ctx.effect(() => () => {
    void store.flush();
  }, "dsh-memory: flush on dispose");
  ctx.logger?.info?.("[dsh-memory] memory engine mounted");
}
async function extractTurn(ctx, store, config, agent, buffer, turnNumber) {
  const transcript = transcriptFromEvents(buffer);
  if (transcript.trim() === "") return;
  const workspaceHash = workspaceHashOf(agent.session.header);
  if (workspaceHash === null || !await store.isAutoMemoryEnabled(workspaceHash)) {
    ctx.logger?.debug?.(`[dsh-memory] extract skipped (auto-memory off or no cwd): ${workspaceHash ?? "null"}`);
    return;
  }
  if (config.extractEveryTurns > 1 && turnNumber % config.extractEveryTurns !== 1) return;
  const tickerState = await store.readState();
  const sessionState = tickerState.perSession[agent.id];
  if ((sessionState?.extractFailStreak ?? 0) >= 3 && turnNumber % 10 !== 1) return;
  const startedAt = Date.now();
  void store.appendExtractLog(`turn=${turnNumber} chars=${transcript.length} route=${agent.options.provider ?? "default"} start`);
  const candidates = await extractCandidates(ctx, agent, transcript, config);
  void store.appendExtractLog(`turn=${turnNumber} done ${Date.now() - startedAt}ms candidates=${candidates.length}`);
  ctx.logger?.debug?.(`[dsh-memory] extract turn=${turnNumber} chars=${transcript.length} candidates=${candidates.length} route=${agent.options.provider ?? "default"}`);
  if (candidates.length === 0) {
    const latest = await store.readState();
    const per = latest.perSession[agent.id] ?? { turnCount: 0, lastInjectedStep: 0 };
    per.extractFailStreak = (per.extractFailStreak ?? 0) + 1;
    latest.perSession[agent.id] = per;
    await store.writeState(latest);
    return;
  }
  let added = 0;
  let updated = 0;
  let deduped = 0;
  const existingEntries = await store.readEntries();
  for (const candidate of candidates) {
    let scope = candidate.scope;
    let hash = null;
    if (scope === "project") {
      hash = workspaceHashOf(agent.session.header);
      if (hash === null) scope = "global";
    }
    const sameScope = existingEntries.filter((entry2) => entry2.scope === scope && (scope === "global" || entry2.projectHash === hash));
    if (isDuplicateContent(candidate.content, sameScope)) {
      deduped += 1;
      continue;
    }
    const beforeEntry = await store.getEntry(entryIdOf(candidate.content, scope, hash));
    const { created, entry } = await store.upsertEntry({
      content: candidate.content,
      scope,
      projectHash: hash,
      tags: candidate.tags,
      importance: candidate.importance,
      source: "extract"
    });
    existingEntries.push(entry);
    if (scope === "project" && hash !== null) {
      const meta = await store.readProjectMeta(hash);
      if (meta === void 0) {
        await store.writeProjectMeta(hash, {
          path: agent.session.header?.cwd ?? "\u672A\u77E5\u5DE5\u4F5C\u533A",
          alias: null,
          locked: false
        });
      }
    }
    if (created) added += 1;
    else updated += 1;
    await store.appendChange({
      action: created ? "add" : "update",
      entryId: entry.id,
      scope: entry.scope,
      projectHash: entry.projectHash,
      summary: summarize(entry.content),
      before: beforeEntry?.content,
      after: entry.content
    });
  }
  const successState = await store.readState();
  const successPer = successState.perSession[agent.id] ?? { turnCount: 0, lastInjectedStep: 0 };
  successPer.extractFailStreak = 0;
  successState.perSession[agent.id] = successPer;
  await store.writeState(successState);
  if (added + updated > 0) {
    await compileAll(store, config);
    ctx.logger?.debug?.(`[dsh-memory] extracted ${added} new, ${updated} updated, ${deduped} deduped`);
  }
}

// vendor/usage-skill/skills-host.js
import { mkdir as mkdir2, readFile as readFile2, readdir as readdir2, rename as rename2, rm, stat, writeFile as writeFile2 } from "node:fs/promises";
import { homedir as homedir2 } from "node:os";
import { join as join2, relative, resolve, sep } from "node:path";
import { URL as URL3 } from "node:url";
import { inflateRawSync } from "node:zlib";
var SKILL_FILE = "SKILL.md";
var BUNDLES_FILE = ".bundles.json";
var ROUTE_PREFIX2 = "/api/skill-manager";
var NAME_MAX = 64;
var NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
var ARCHIVE_MAX_ENTRIES = 2e3;
var ARCHIVE_MAX_TOTAL = 200 * 1024 * 1024;
function unzipArchive(buffer) {
  if (buffer.length < 22) throw new Error("not a zip archive");
  let eocd = -1;
  const tailStart = Math.max(0, buffer.length - 65557);
  for (let i = buffer.length - 22; i >= tailStart; i--) {
    if (buffer.readUInt32LE(i) === 101010256) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip archive");
  const totalEntries = buffer.readUInt16LE(eocd + 10);
  if (totalEntries === 0 || totalEntries > ARCHIVE_MAX_ENTRIES) throw new Error("archive has too many entries");
  const cdOffset = buffer.readUInt32LE(eocd + 16);
  const files = [];
  let pos = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (pos + 46 > buffer.length || buffer.readUInt32LE(pos) !== 33639248) break;
    const method = buffer.readUInt16LE(pos + 10);
    const compSize = buffer.readUInt32LE(pos + 20);
    const nameLen = buffer.readUInt16LE(pos + 28);
    const extraLen = buffer.readUInt16LE(pos + 30);
    const commentLen = buffer.readUInt16LE(pos + 32);
    const localOffset = buffer.readUInt32LE(pos + 42);
    const name2 = buffer.subarray(pos + 46, pos + 46 + nameLen).toString("utf8").replace(/\\/g, "/");
    if (!name2.endsWith("/") && name2 !== "") {
      if (method !== 0 && method !== 8) throw new Error(`unsupported zip compression method ${String(method)}`);
      const lhNameLen = buffer.readUInt16LE(localOffset + 26);
      const lhExtraLen = buffer.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lhNameLen + lhExtraLen;
      if (dataStart + compSize > buffer.length) throw new Error("corrupt zip archive");
      const raw = buffer.subarray(dataStart, dataStart + compSize);
      const data = method === 0 ? Buffer.from(raw) : inflateRawSync(raw);
      files.push({ name: name2, data });
    }
    pos += 46 + nameLen + extraLen + commentLen;
  }
  if (files.length === 0) throw new Error("archive contains no files");
  let total = 0;
  for (const file of files) {
    total += file.data.length;
    if (total > ARCHIVE_MAX_TOTAL) throw new Error("archive too large");
  }
  return files;
}
function managedRoot() {
  const agentsHome = process.env.DSH_AGENTS_HOME ?? join2(homedir2(), ".agents");
  return join2(agentsHome, "skills");
}
function dshRoot() {
  const dshHome2 = process.env.DSH_HOME ?? join2(homedir2(), ".dsh");
  return join2(dshHome2, "skills");
}
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  const block = match?.[1];
  if (block === void 0) return {};
  const fields = {};
  for (const line of block.split(/\r?\n/)) {
    const pair = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    const key = pair?.[1];
    const valueText = pair?.[2];
    if (key === void 0 || valueText === void 0) continue;
    const value = valueText.trim();
    if (value === "true") fields[key] = true;
    else if (value === "false") fields[key] = false;
    else fields[key] = value;
  }
  return fields;
}
async function walkSkillDir(dir, prefix, out) {
  let entries;
  try {
    entries = await readdir2(dir, { withFileTypes: true });
  } catch {
    return;
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const rel = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) await walkSkillDir(join2(dir, entry.name), rel, out);
    else out.push(rel);
  }
}
async function readSkillMeta(root, dir) {
  let raw;
  try {
    raw = await readFile2(join2(root, dir, SKILL_FILE), "utf8");
  } catch {
    return void 0;
  }
  const fields = parseFrontmatter(raw);
  const name2 = typeof fields.name === "string" && fields.name !== "" ? fields.name : dir;
  const files = [];
  await walkSkillDir(join2(root, dir), "", files);
  return {
    name: name2,
    dir,
    description: typeof fields.description === "string" ? fields.description : "",
    compatibility: typeof fields.compatibility === "string" ? fields.compatibility : "",
    fileCount: files.length,
    files: files.slice(0, 200),
    root: rootLabel(root)
  };
}
function rootLabel(root) {
  if (root === managedRoot()) return "agents";
  if (root === dshRoot()) return "dsh";
  return "other";
}
async function listRootSkills(root) {
  const views = [];
  let entries = [];
  try {
    entries = (await readdir2(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return views;
  }
  for (const dir of entries) {
    const meta = await readSkillMeta(root, dir);
    if (meta !== void 0) views.push(meta);
  }
  return views;
}
async function readBundles(root) {
  try {
    const parsed = JSON.parse(await readFile2(join2(root, BUNDLES_FILE), "utf8"));
    if (typeof parsed === "object" && parsed !== null && parsed.version === 1 && Array.isArray(parsed.bundles)) {
      return parsed;
    }
  } catch {
  }
  return { version: 1, bundles: [] };
}
async function writeBundles(root, file) {
  await mkdir2(root, { recursive: true });
  const target = join2(root, BUNDLES_FILE);
  const temp = `${target}.tmp`;
  await writeFile2(temp, `${JSON.stringify(file, null, 2)}
`, "utf8");
  await rename2(temp, target);
}
var CATEGORY_MAX_LEN = 24;
var CATEGORY_MAX_PER_BUNDLE = 8;
function normalizeCategories(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim().slice(0, CATEGORY_MAX_LEN);
    if (trimmed === "" || out.includes(trimmed)) continue;
    if (out.length >= CATEGORY_MAX_PER_BUNDLE) break;
    out.push(trimmed);
  }
  return out;
}
function categoriesOf(record) {
  return normalizeCategories(record.categories);
}
function checkedName(name2) {
  const trimmed = name2.trim();
  if (trimmed === "" || trimmed.length > NAME_MAX) {
    throw new Error(`name must be 1-${String(NAME_MAX)} characters`);
  }
  return trimmed;
}
function resolveSkillFile(base, path) {
  if (path === "" || path.includes("\0") || path.includes("\\")) {
    throw new Error(`unsupported skill file path: ${JSON.stringify(path)}`);
  }
  const target = resolve(base, path);
  const within = relative(resolve(base), target);
  if (within === "" || within.startsWith("..") || within.includes(sep + "..")) {
    throw new Error(`skill file escapes its directory: ${JSON.stringify(path)}`);
  }
  return target;
}
async function allSkills() {
  const views = [];
  const seenDir = /* @__PURE__ */ new Set();
  const seenName = /* @__PURE__ */ new Set();
  for (const root of [managedRoot(), dshRoot()]) {
    for (const skill of await listRootSkills(root)) {
      const dirKey = skill.root + "/" + skill.dir;
      if (seenDir.has(dirKey)) continue;
      seenDir.add(dirKey);
      if (seenName.has(skill.name)) continue;
      seenName.add(skill.name);
      views.push(skill);
    }
  }
  return views;
}
function indexSkills(views) {
  const byName = /* @__PURE__ */ new Map();
  const byDir = /* @__PURE__ */ new Map();
  for (const skill of views) {
    if (!byName.has(skill.name)) byName.set(skill.name, skill);
    if (!byDir.has(skill.dir)) byDir.set(skill.dir, skill);
  }
  return { byName, byDir };
}
function resolveSkillEntry(entry, index) {
  const hit = index.byName.get(entry) ?? index.byDir.get(entry);
  return hit === void 0 ? void 0 : hit.name;
}
async function viewsOf(entries) {
  const index = indexSkills(await allSkills());
  const views = [];
  for (const entry of entries) {
    const name2 = resolveSkillEntry(entry, index);
    if (name2 === void 0) continue;
    if (views.some((view) => view.name === name2)) continue;
    const skill = index.byName.get(name2);
    if (skill !== void 0) views.push(skill);
  }
  return views;
}
function checkedLookupName(value) {
  const name2 = checkedName(value);
  if (name2 === "." || name2 === ".." || name2.includes("/") || name2.includes("\\") || name2.includes(sep)) {
    throw new Error(`invalid skill name ${JSON.stringify(name2)}`);
  }
  return name2;
}
async function locateSkillDir(name2) {
  const roots = [managedRoot(), dshRoot()];
  for (const root of roots) {
    const candidate = join2(root, name2);
    try {
      if ((await stat(candidate)).isDirectory()) return candidate;
    } catch {
    }
  }
  for (const root of roots) {
    let entries = [];
    try {
      entries = (await readdir2(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      continue;
    }
    for (const dir of entries) {
      const meta = await readSkillMeta(root, dir);
      if (meta !== void 0 && meta.name === name2) return join2(root, dir);
    }
  }
  return void 0;
}
async function snapshot() {
  const root = managedRoot();
  const views = await allSkills();
  const index = indexSkills(views);
  const ledger = await readBundles(root);
  const bundles = [];
  const healed = [];
  const assigned = /* @__PURE__ */ new Set();
  for (const record of ledger.bundles) {
    const skills = [];
    const canonical = [];
    const missing = [];
    let changed = false;
    for (const entry of record.skills) {
      const name2 = resolveSkillEntry(entry, index);
      if (name2 === void 0) {
        missing.push(entry);
        canonical.push(entry);
        continue;
      }
      if (canonical.includes(name2)) {
        changed = true;
        continue;
      }
      if (name2 !== entry) changed = true;
      canonical.push(name2);
      const skill = index.byName.get(name2);
      if (skill !== void 0) skills.push(skill);
      assigned.add(name2);
    }
    bundles.push({ id: record.id, name: record.name, skillCount: skills.length, skills, missingSkills: missing, categories: categoriesOf(record) });
    if (changed) {
      Object.assign(record, { skills: canonical });
      healed.push(record.id);
    }
  }
  const loose = views.filter((skill) => !assigned.has(skill.name));
  if (healed.length > 0) {
    try {
      await writeBundles(root, { version: 1, bundles: ledger.bundles });
    } catch {
    }
  }
  return { bundles, loose };
}
async function createBundle(body) {
  const name2 = checkedName(typeof body.name === "string" ? body.name : "");
  const categories = normalizeCategories(body.categories);
  const root = managedRoot();
  const ledger = await readBundles(root);
  if (ledger.bundles.some((bundle) => bundle.name === name2)) {
    throw new Error(`bundle "${name2}" already exists`);
  }
  const base = name2.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "bundle";
  let id = base;
  let suffix = 2;
  while (ledger.bundles.some((bundle) => bundle.id === id)) {
    id = `${base}-${String(suffix)}`;
    suffix += 1;
  }
  const record = { id, name: name2, skills: [], categories };
  await writeBundles(root, { version: 1, bundles: [...ledger.bundles, record] });
  return { id, name: name2, skillCount: 0, skills: [], missingSkills: [], categories };
}
async function renameBundle(id, body) {
  const root = managedRoot();
  const ledger = await readBundles(root);
  const index = ledger.bundles.findIndex((bundle) => bundle.id === id);
  const existing = index === -1 ? void 0 : ledger.bundles[index];
  if (existing === void 0) throw new Error(`bundle ${JSON.stringify(id)} not found`);
  const nextName = typeof body.name === "string" && body.name.trim() !== "" ? checkedName(body.name) : existing.name;
  if (nextName !== existing.name && ledger.bundles.some((bundle, i) => i !== index && bundle.name === nextName)) {
    throw new Error(`bundle "${nextName}" already exists`);
  }
  const record = { ...existing, name: nextName };
  if (Array.isArray(body.categories)) record.categories = normalizeCategories(body.categories);
  const bundles = [...ledger.bundles];
  bundles[index] = record;
  await writeBundles(root, { version: 1, bundles });
  const skills = await viewsOf(record.skills);
  return { id: record.id, name: nextName, skillCount: skills.length, skills, missingSkills: [], categories: categoriesOf(record) };
}
async function deleteBundle(id) {
  const root = managedRoot();
  const ledger = await readBundles(root);
  const bundles = ledger.bundles.filter((bundle) => bundle.id !== id);
  if (bundles.length === ledger.bundles.length) {
    throw new Error(`bundle ${JSON.stringify(id)} not found`);
  }
  await writeBundles(root, { version: 1, bundles });
}
async function setBundleSkills(id, body) {
  const root = managedRoot();
  const ledger = await readBundles(root);
  const index = ledger.bundles.findIndex((bundle) => bundle.id === id);
  const existing = index === -1 ? void 0 : ledger.bundles[index];
  if (existing === void 0) throw new Error(`bundle ${JSON.stringify(id)} not found`);
  const skillIndex = indexSkills(await allSkills());
  const raw = Array.isArray(body.skillNames) ? body.skillNames.filter((v) => typeof v === "string") : [];
  const skills = [];
  const unknown = [];
  for (const entry of raw) {
    const name2 = resolveSkillEntry(entry, skillIndex);
    if (name2 === void 0) {
      unknown.push(entry);
      continue;
    }
    if (!skills.includes(name2)) skills.push(name2);
  }
  if (unknown.length > 0) throw new Error(`skill ${JSON.stringify(unknown.join(", "))} not found`);
  const record = { ...existing, skills };
  const aliases = /* @__PURE__ */ new Set();
  for (const name2 of skills) {
    aliases.add(name2);
    const skill = skillIndex.byName.get(name2);
    if (skill !== void 0) aliases.add(skill.dir);
  }
  const bundles = ledger.bundles.map((candidate) => candidate.id === id ? record : { ...candidate, skills: candidate.skills.filter((name2) => !aliases.has(name2)) });
  await writeBundles(root, { version: 1, bundles });
  const views = skills.map((name2) => skillIndex.byName.get(name2)).filter((skill) => skill !== void 0);
  return { id: record.id, name: record.name, skillCount: views.length, skills: views, missingSkills: [], categories: categoriesOf(record) };
}
async function assignBundle(root, skillName, bundleId) {
  if (typeof bundleId !== "string" || bundleId === "") return;
  const ledger = await readBundles(root);
  const index = ledger.bundles.findIndex((bundle) => bundle.id === bundleId);
  if (index === -1) throw new Error(`bundle ${JSON.stringify(bundleId)} not found`);
  const canonical = resolveSkillEntry(skillName, indexSkills(await allSkills())) ?? skillName;
  const bundles = ledger.bundles.map((candidate, i) => i === index ? { ...candidate, skills: [...candidate.skills.filter((name2) => name2 !== canonical), canonical] } : { ...candidate, skills: candidate.skills.filter((name2) => name2 !== canonical && name2 !== skillName) });
  await writeBundles(root, { version: 1, bundles });
}
function normalizeUploadFiles(input) {
  const list = Array.isArray(input) ? input : [];
  const cleaned = [];
  for (const item of list) {
    if (typeof item !== "object" || item === null) continue;
    const rawPath = typeof item.path === "string" ? item.path : "";
    const parts = [];
    for (const segment of rawPath.split("\\").join("/").split("/")) {
      if (segment === "" || segment === ".") continue;
      if (segment === "..") {
        throw new Error(`unsupported skill file path: ${JSON.stringify(rawPath)}`);
      }
      parts.push(segment);
    }
    if (parts.length === 0) continue;
    cleaned.push({ path: parts.join("/"), data: typeof item.data === "string" ? item.data : "" });
  }
  if (cleaned.length === 0) return cleaned;
  const top = cleaned[0].path.split("/")[0];
  const nested = top !== void 0 && cleaned.every((file) => file.path.startsWith(top + "/"));
  if (!nested) return cleaned;
  return cleaned.map((file) => ({ path: file.path.slice(top.length + 1), data: file.data }));
}
function setFrontmatterName(raw, name2) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (match === null) return `---
name: ${String(name2)}
---

${raw}`;
  const body = raw.slice(match[0].length);
  const kept = [];
  let replaced = false;
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s*name\s*:/.test(line)) {
      if (!replaced) {
        kept.push(`name: ${String(name2)}`);
        replaced = true;
      }
      continue;
    }
    kept.push(line);
  }
  if (!replaced) kept.unshift(`name: ${String(name2)}`);
  return `---
${kept.join("\n")}
---
${body}`;
}
async function installArchive(body) {
  const root = managedRoot();
  const raw = typeof body.archive === "string" ? body.archive : "";
  if (raw === "") throw new Error("empty archive");
  const files = unzipArchive(Buffer.from(raw, "base64"));
  const skillIndex = files.findIndex((file) => file.name === SKILL_FILE || file.name.endsWith("/" + SKILL_FILE));
  const skillEntry = skillIndex === -1 ? void 0 : files[skillIndex];
  if (skillEntry === void 0) throw new Error(`archive must contain ${SKILL_FILE}`);
  const meta = parseFrontmatter(skillEntry.data.toString("utf8"));
  let skillName = typeof meta.name === "string" ? meta.name.trim() : "";
  if (!NAME_PATTERN.test(skillName)) {
    const top = skillEntry.name.slice(0, skillEntry.name.length - SKILL_FILE.length).replace(/\/+$/, "");
    const fallback = top.split("/").pop() ?? "";
    skillName = fallback.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  if (!NAME_PATTERN.test(skillName)) throw new Error("skill name must be lowercase alphanumeric/hyphen");
  if (skillName.length > NAME_MAX) throw new Error(`name must be 1-${String(NAME_MAX)} characters`);
  const skillDir = join2(root, skillName);
  const base = skillEntry.name.slice(0, skillEntry.name.length - SKILL_FILE.length).replace(/\/+$/, "");
  let hasSkillFile = false;
  for (const file of files) {
    let rel = file.name;
    if (base !== "" && rel.startsWith(base + "/")) rel = rel.slice(base.length + 1);
    if (rel === SKILL_FILE) hasSkillFile = true;
    const target = resolveSkillFile(skillDir, rel);
    await mkdir2(join2(target, ".."), { recursive: true });
    await writeFile2(target, file.data);
  }
  if (!hasSkillFile) {
    const description = typeof body.description === "string" ? body.description.trim() : "";
    await writeFile2(join2(skillDir, SKILL_FILE), `---
name: ${skillName}
description: ${description || "Installed from the Skills panel."}
---

${description}`, "utf8");
  }
  await assignBundle(root, skillName, typeof body.bundleId === "string" ? body.bundleId : "");
  const finalMeta = await readSkillMeta(root, skillName);
  return { name: finalMeta?.name ?? skillName, dir: skillName, description: finalMeta?.description ?? "" };
}
async function installSkill(body) {
  if (typeof body.archive === "string" && body.archive !== "") {
    return installArchive(body);
  }
  const rawRequested = typeof body.skillName === "string" ? body.skillName.trim() : "";
  const requested = rawRequested === "" ? "" : checkedName(rawRequested);
  const root = managedRoot();
  const files = normalizeUploadFiles(body.files);
  const skillEntry = files.find((file) => file.path === SKILL_FILE);
  const fields = skillEntry === void 0 ? {} : parseFrontmatter(Buffer.from(skillEntry.data, "base64").toString("utf8"));
  const metaName = typeof fields.name === "string" ? fields.name.trim() : "";
  let skillName = NAME_PATTERN.test(requested) ? requested : "";
  if (skillName === "" && NAME_PATTERN.test(metaName)) skillName = metaName;
  if (skillName === "") throw new Error("skill name must be lowercase alphanumeric/hyphen");
  if (skillName.length > NAME_MAX) throw new Error(`name must be 1-${String(NAME_MAX)} characters`);
  const skillDir = join2(root, skillName);
  await mkdir2(skillDir, { recursive: true });
  let hasSkillFile = false;
  for (const file of files) {
    if (file.path === SKILL_FILE) hasSkillFile = true;
    const target = resolveSkillFile(skillDir, file.path);
    await mkdir2(join2(target, ".."), { recursive: true });
    await writeFile2(target, Buffer.from(file.data, "base64"));
  }
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!hasSkillFile) {
    const text = `---
name: ${skillName}
description: ${description || "Installed from the Skills panel."}
---

${description}`;
    await writeFile2(join2(skillDir, SKILL_FILE), text, "utf8");
  } else if (metaName !== "" && metaName !== skillName) {
    const raw = Buffer.from(skillEntry.data, "base64").toString("utf8");
    await writeFile2(join2(skillDir, SKILL_FILE), setFrontmatterName(raw, skillName), "utf8");
  }
  await assignBundle(root, skillName, typeof body.bundleId === "string" ? body.bundleId : "");
  const meta = await readSkillMeta(root, skillName);
  return {
    name: meta?.name ?? skillName,
    dir: skillName,
    description: meta?.description ?? "",
    renamed: metaName !== "" && metaName !== skillName
  };
}
async function readSkillFile(skillName, relPath) {
  const name2 = checkedLookupName(skillName);
  const dir = await locateSkillDir(name2);
  if (dir === void 0) throw new Error(`skill ${JSON.stringify(name2)} not found`);
  if (relPath === "" || relPath.includes("\0") || relPath.includes("\\")) {
    throw new Error(`unsupported file path: ${JSON.stringify(relPath)}`);
  }
  const target = resolveSkillFile(dir, relPath);
  let info;
  try {
    info = await stat(target);
  } catch {
    throw new Error(`file ${JSON.stringify(relPath)} not found in skill ${JSON.stringify(name2)}`);
  }
  if (!info.isFile()) throw new Error(`not a file: ${JSON.stringify(relPath)}`);
  const content = await readFile2(target, "utf8");
  return { name: name2, path: relPath, content };
}
async function deleteSkill(skillName) {
  const name2 = checkedLookupName(skillName);
  const roots = [managedRoot(), dshRoot()];
  const removed = [];
  const aliases = /* @__PURE__ */ new Set([name2]);
  for (const root2 of roots) {
    let entries = [];
    try {
      entries = (await readdir2(root2, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      continue;
    }
    for (const dir of entries) {
      const meta = await readSkillMeta(root2, dir);
      if (dir !== name2 && (meta === void 0 || meta.name !== name2)) continue;
      try {
        await rm(join2(root2, dir), { recursive: true, force: true });
      } catch {
        continue;
      }
      aliases.add(dir);
      if (meta !== void 0) aliases.add(meta.name);
      removed.push({ root: rootLabel(root2), dir, name: meta === void 0 ? dir : meta.name });
    }
  }
  if (removed.length === 0) throw new Error(`skill ${JSON.stringify(name2)} not found`);
  const root = managedRoot();
  const ledger = await readBundles(root);
  await writeBundles(root, {
    version: 1,
    bundles: ledger.bundles.map((candidate) => ({
      ...candidate,
      skills: candidate.skills.filter((candidateName) => !aliases.has(candidateName))
    }))
  });
  return { removed };
}
function isLoopbackAddress2(address) {
  if (typeof address !== "string") return false;
  const a = address.toLowerCase();
  if (a === "::1") return true;
  const ipv4 = a.startsWith("::ffff:") ? a.slice(7) : a;
  const octets = ipv4.split(".");
  return octets.length === 4 && octets[0] === "127" && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function hostNameOf2(value) {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase();
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    if (close <= 1) return null;
    const suffix = host.slice(close + 1);
    if (suffix !== "" && !/^:\d+$/.test(suffix)) return null;
    return host.slice(1, close);
  }
  const firstColon = host.indexOf(":");
  const lastColon = host.lastIndexOf(":");
  if (firstColon !== lastColon) return null;
  return firstColon === -1 ? host : host.slice(0, firstColon);
}
function loopbackAllowed2(req) {
  if (!isLoopbackAddress2(req.socket.remoteAddress)) return false;
  const host = hostNameOf2(req.headers.host);
  if (host === null) return false;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}
function json2(res, status2, value) {
  const body = JSON.stringify(value);
  res.writeHead(status2, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache"
  });
  res.end(body);
}
function readBody2(req) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 4 * 1024 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) {
        resolvePromise({});
        return;
      }
      try {
        resolvePromise(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error instanceof Error ? error : new Error("invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}
async function handle2(ctx, req, res) {
  if (!loopbackAllowed2(req)) {
    json2(res, 403, { error: "loopback-only" });
    return;
  }
  const url = new URL3(req.url ?? "/", "http://localhost");
  const rest = url.pathname.slice(ROUTE_PREFIX2.length);
  const method = req.method ?? "GET";
  try {
    if (method === "GET" && (rest === "" || rest === "/list")) {
      json2(res, 200, await snapshot());
      return;
    }
    if (method === "POST" && rest === "/bundles") {
      const body = await readBody2(req);
      json2(res, 200, await createBundle(body));
      return;
    }
    const matchId = /^\/bundles\/([^/]+)$/.exec(rest);
    if (method === "PATCH" && matchId !== null) {
      const body = await readBody2(req);
      json2(res, 200, await renameBundle(decodeURIComponent(matchId[1]), body));
      return;
    }
    if (method === "DELETE" && matchId !== null) {
      await deleteBundle(decodeURIComponent(matchId[1]));
      json2(res, 200, { ok: true });
      return;
    }
    const matchSkills = /^\/bundles\/([^/]+)\/skills$/.exec(rest);
    if (method === "PUT" && matchSkills !== null) {
      const body = await readBody2(req);
      json2(res, 200, await setBundleSkills(decodeURIComponent(matchSkills[1]), body));
      return;
    }
    if (method === "POST" && rest === "/skills") {
      const body = await readBody2(req);
      json2(res, 200, await installSkill(body));
      return;
    }
    const matchSkillDelete = /^\/skills\/([^/]+)$/.exec(rest);
    if (method === "DELETE" && matchSkillDelete !== null) {
      const result = await deleteSkill(decodeURIComponent(matchSkillDelete[1]));
      json2(res, 200, { ok: true, ...result });
      return;
    }
    const matchSkillFile = /^\/skills\/([^/]+)\/files\/(.+)$/.exec(rest);
    if (method === "GET" && matchSkillFile !== null) {
      const file = await readSkillFile(
        decodeURIComponent(matchSkillFile[1]),
        decodeURIComponent(matchSkillFile[2])
      );
      json2(res, 200, file);
      return;
    }
    json2(res, 404, { error: `no route for ${method} ${rest}` });
  } catch (error) {
    json2(res, 400, { error: error instanceof Error ? error.message : String(error) });
  }
}
async function apply(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX2,
    handler: (req, res) => {
      void handle2(ctx, req, res);
    }
  }), "dsh-skill-manager: routes");
}

// vendor/usage-skill/index.js
import { homedir as homedir4 } from "node:os";
import { join as join4, dirname } from "node:path";
import { mkdir as mkdir3, readFile as readFile4, rename as rename3, writeFile as writeFile3 } from "node:fs/promises";

// vendor/usage-skill/usage.js
function dayKey(timeMs) {
  const date = new Date(timeMs);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
function hourKey(timeMs) {
  const date = new Date(timeMs);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}-${hour}`;
}
function zeroBuckets() {
  return {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0
  };
}
function bucketsOf(usage) {
  return {
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
    cacheReadTokens: usage.cacheReadTokens ?? 0,
    cacheWriteTokens: usage.cacheWriteTokens ?? 0
  };
}
function totalTokens(buckets) {
  return buckets.inputTokens + buckets.outputTokens + buckets.cacheReadTokens + buckets.cacheWriteTokens;
}
function cacheHitRate(buckets) {
  const input = buckets.inputTokens ?? 0;
  const cacheRead = buckets.cacheReadTokens ?? 0;
  const cacheWrite = buckets.cacheWriteTokens ?? 0;
  const promptTokens = input + cacheRead + cacheWrite;
  if (promptTokens <= 0) return null;
  return Math.round(cacheRead / promptTokens * 1e3) / 10;
}
function addInto(target, source) {
  target.inputTokens += source.inputTokens;
  target.outputTokens += source.outputTokens;
  target.cacheReadTokens += source.cacheReadTokens;
  target.cacheWriteTokens += source.cacheWriteTokens;
  return target;
}
function subtractFrom(target, source) {
  target.inputTokens -= source.inputTokens;
  target.outputTokens -= source.outputTokens;
  target.cacheReadTokens -= source.cacheReadTokens;
  target.cacheWriteTokens -= source.cacheWriteTokens;
  return target;
}
function sampleOf(event) {
  if (event.type === "assistant/chunk" && event.data?.chunk?.type === "usage") {
    return {
      key: `${event.data.turn}:${event.data.step}`,
      usage: event.data.chunk.usage
    };
  }
  if (event.type === "assistant/message" && event.data?.usage !== void 0) {
    return {
      key: `${event.data.turn}:${event.data.step}`,
      usage: event.data.usage
    };
  }
  return void 0;
}
function modelOf(event) {
  const source = event.data?.message?.source;
  if (source !== void 0 && typeof source.model === "string") {
    return `${typeof source.provider === "string" && source.provider.length > 0 ? source.provider : "unknown"}/${source.model}`;
  }
  const config = event.data?.header?.config;
  if (config !== void 0 && typeof config.model === "string") {
    return `${typeof config.provider === "string" && config.provider.length > 0 ? config.provider : "unknown"}/${config.model}`;
  }
  return void 0;
}
function entryOf(byDay, day) {
  let entry = byDay.get(day);
  if (entry === void 0) {
    entry = {
      totals: zeroBuckets(),
      models: /* @__PURE__ */ new Map(),
      requests: 0,
      intervals: [],
      compacted: 0
    };
    byDay.set(day, entry);
  }
  return entry;
}
function shiftDay(day, deltaDays) {
  const parts = day.split("-").map(Number);
  const shifted = new Date(parts[0], (parts[1] ?? 1) - 1, (parts[2] ?? 1) + deltaDays);
  return dayKey(shifted.getTime());
}
function lastNaturalDays(endDay, count) {
  const days = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) days.push(shiftDay(endDay, -offset));
  return days;
}
function hourEntryOf(byHour, hour) {
  let entry = byHour.get(hour);
  if (entry === void 0) {
    entry = {
      totals: zeroBuckets(),
      requests: 0,
      workMs: 0
    };
    byHour.set(hour, entry);
  }
  return entry;
}
function createUsageState() {
  return {
    days: /* @__PURE__ */ new Map(),
    hours: /* @__PURE__ */ new Map(),
    lastSample: null,
    currentModel: null,
    consumed: 0,
    openSteps: /* @__PURE__ */ new Map(),
    /** Newest `session/title` payload (last-wins); null before any title event. */
    title: null
  };
}
function applyUsageDelta(state, events) {
  let last = state.lastSample;
  let currentModel = state.currentModel;
  for (const event of events) {
    if (event.type === "request/header") {
      const model2 = modelOf(event);
      if (model2 !== void 0) currentModel = model2;
    }
    if (event.type === "session/title") {
      const title = event.data?.title;
      if (typeof title === "string" && title.length > 0) state.title = title;
    }
    if (event.type === "compaction/summary" || event.type === "compaction/prune") {
      const shadowed = event.data?.shadowedTokenCount;
      if (Number.isFinite(shadowed) && shadowed > 0) entryOf(state.days, dayKey(event.time)).compacted += shadowed;
    }
    if (event.type === "assistant/message") {
      entryOf(state.days, dayKey(event.time)).requests += 1;
      hourEntryOf(state.hours, hourKey(event.time)).requests += 1;
    }
    if (event.type === "step/start") {
      state.openSteps.set(`${event.data.turn}:${event.data.step}`, event.time);
    } else if (event.type === "step/end") {
      const key = `${event.data.turn}:${event.data.step}`;
      const start = state.openSteps.get(key);
      if (start !== void 0) {
        const workMs = Math.max(0, event.time - start);
        if (event.time > start) entryOf(state.days, dayKey(event.time)).intervals.push([start, event.time]);
        hourEntryOf(state.hours, hourKey(event.time)).workMs += workMs;
        state.openSteps.delete(key);
      }
    }
    const sample = sampleOf(event);
    if (sample === void 0) continue;
    const buckets = bucketsOf(sample.usage);
    const model = modelOf(event) ?? currentModel ?? "unknown/unknown";
    const day = dayKey(event.time);
    const hour = hourKey(event.time);
    const entry = entryOf(state.days, day);
    const hourEntry = hourEntryOf(state.hours, hour);
    if (last !== null && last.key === sample.key) {
      const previous = state.days.get(last.day);
      if (previous !== void 0) {
        subtractFrom(previous.totals, last.buckets);
        const previousModel = previous.models.get(last.model);
        if (previousModel !== void 0) subtractFrom(previousModel, last.buckets);
      }
      const previousHour = state.hours.get(last.hour);
      if (previousHour !== void 0) subtractFrom(previousHour.totals, last.buckets);
    }
    addInto(entry.totals, buckets);
    let modelBucket = entry.models.get(model);
    if (modelBucket === void 0) {
      modelBucket = zeroBuckets();
      entry.models.set(model, modelBucket);
    }
    addInto(modelBucket, buckets);
    addInto(hourEntry.totals, buckets);
    last = { key: sample.key, day, hour, model, buckets };
  }
  state.lastSample = last;
  state.currentModel = currentModel;
}
function mergeInto(byDay, sessionDays) {
  for (const [day, entry] of sessionDays) {
    const target = entryOf(byDay, day);
    addInto(target.totals, entry.totals);
    target.requests += entry.requests ?? 0;
    target.compacted += entry.compacted ?? 0;
    if (entry.intervals !== void 0 && entry.intervals.length > 0) target.intervals.push(...entry.intervals);
    for (const [model, buckets] of entry.models) {
      let modelBucket = target.models.get(model);
      if (modelBucket === void 0) {
        modelBucket = zeroBuckets();
        target.models.set(model, modelBucket);
      }
      addInto(modelBucket, buckets);
    }
  }
}
function mergeHoursInto(byHour, sessionHours) {
  for (const [hour, entry] of sessionHours) {
    const target = hourEntryOf(byHour, hour);
    addInto(target.totals, entry.totals);
    target.requests += entry.requests ?? 0;
    target.workMs += entry.workMs ?? 0;
  }
}
function mergedDuration(intervals) {
  if (intervals === void 0 || intervals.length === 0) return 0;
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  let total = 0;
  let curStart = sorted[0][0];
  let curEnd = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    if (s <= curEnd) {
      if (e > curEnd) curEnd = e;
    } else {
      total += curEnd - curStart;
      curStart = s;
      curEnd = e;
    }
  }
  total += curEnd - curStart;
  return Math.max(0, total);
}
function renderUsage(byDay, byHour, updatedAt) {
  const days = [...byDay.entries()].map(([date, entry]) => {
    const models = [...entry.models.entries()].map(([model, buckets]) => ({
      model,
      ...buckets,
      tokens: totalTokens(buckets),
      cacheHitRate: cacheHitRate(buckets)
    })).sort((a, b) => b.tokens - a.tokens);
    return {
      date,
      ...entry.totals,
      tokens: totalTokens(entry.totals),
      cacheHitRate: cacheHitRate(entry.totals),
      requests: entry.requests ?? 0,
      workMs: mergedDuration(entry.intervals),
      compacted: entry.compacted ?? 0,
      models
    };
  }).sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  const hours = [...(byHour ?? /* @__PURE__ */ new Map()).entries()].map(([hour, entry]) => ({
    hour,
    ...entry.totals,
    tokens: totalTokens(entry.totals),
    cacheHitRate: cacheHitRate(entry.totals),
    requests: entry.requests ?? 0,
    workMs: entry.workMs ?? 0
  })).sort((a, b) => a.hour < b.hour ? -1 : a.hour > b.hour ? 1 : 0);
  const total = zeroBuckets();
  let totalRequests = 0;
  let totalWorkMs = 0;
  let totalCompacted = 0;
  for (const [, entry] of byDay) {
    addInto(total, entry.totals);
    totalRequests += entry.requests ?? 0;
    totalWorkMs += mergedDuration(entry.intervals);
    totalCompacted += entry.compacted ?? 0;
  }
  return {
    days,
    hours,
    total: {
      ...total,
      tokens: totalTokens(total),
      cacheHitRate: cacheHitRate(total),
      requests: totalRequests,
      workMs: totalWorkMs,
      compacted: totalCompacted
    },
    updatedAt
  };
}
function renderSignal(days, nowMs, options = {}) {
  const windowDays = Math.max(1, options.windowDays ?? 30);
  const anomalyThreshold = Math.max(1.5, options.anomalyThreshold ?? 3);
  const today = dayKey(nowMs);
  const yesterday = shiftDay(today, -1);
  const window = lastNaturalDays(today, windowDays);
  const week = window.slice(-7);
  const byDate = new Map(days.map((day) => [day.date, day]));
  let requests = 0;
  let tokens = 0;
  let promptTokens = 0;
  let cacheReadTokens = 0;
  let compacted = 0;
  const modelTotals = /* @__PURE__ */ new Map();
  for (const date of window) {
    const day = byDate.get(date);
    if (day === void 0) continue;
    requests += day.requests ?? 0;
    tokens += day.tokens ?? 0;
    promptTokens += (day.inputTokens ?? 0) + (day.cacheReadTokens ?? 0) + (day.cacheWriteTokens ?? 0);
    cacheReadTokens += day.cacheReadTokens ?? 0;
    compacted += day.compacted ?? 0;
    for (const model of day.models ?? []) {
      if (model === null || typeof model !== "object") continue;
      const current = modelTotals.get(model.model) ?? { model: model.model, tokens: 0 };
      current.tokens += model.tokens ?? 0;
      modelTotals.set(model.model, current);
    }
  }
  const topRoutes = [...modelTotals.values()].sort((a, b) => b.tokens - a.tokens).slice(0, 5).map((entry) => ({ model: entry.model, tokens: entry.tokens, share: tokens > 0 ? entry.tokens / tokens : null }));
  let weekSum = 0;
  for (const date of week) weekSum += byDate.get(date)?.tokens ?? 0;
  const dailyAvg7 = weekSum / 7;
  const activeTokens = [];
  for (const date of window) {
    const value = byDate.get(date)?.tokens ?? 0;
    if (value > 0) activeTokens.push(value);
  }
  activeTokens.sort((a, b) => a - b);
  let median = null;
  if (activeTokens.length > 0) {
    const mid = Math.floor(activeTokens.length / 2);
    median = activeTokens.length % 2 === 1 ? activeTokens[mid] : (activeTokens[mid - 1] + activeTokens[mid]) / 2;
  }
  const yesterdayTokens = byDate.get(yesterday)?.tokens ?? 0;
  const yesterdayMultiple = median !== null && median > 0 ? yesterdayTokens / median : null;
  const anomalyDays = [];
  if (median !== null && median > 0) {
    for (const date of window) {
      const value = byDate.get(date)?.tokens ?? 0;
      if (value > median * anomalyThreshold) {
        anomalyDays.push({ date, tokens: value, multiple: value / median });
      }
    }
    anomalyDays.sort((a, b) => b.tokens - a.tokens);
  }
  return {
    windowDays,
    generatedAt: nowMs,
    efficiency: {
      requests,
      tokens,
      tokensPerRequest: requests > 0 ? tokens / requests : null,
      cacheHitRate: promptTokens > 0 ? Math.round(cacheReadTokens / promptTokens * 1e3) / 10 : null,
      compactedTokens: compacted,
      compactedShare: tokens + compacted > 0 ? compacted / (tokens + compacted) : null,
      topRoutes,
      topRouteShare: topRoutes.length > 0 ? topRoutes[0].share : null
    },
    signal: {
      dailyAvg7,
      projected30: dailyAvg7 * 30,
      activeMedian: median,
      activeDays: activeTokens.length,
      yesterdayDate: yesterday,
      yesterdayTokens,
      yesterdayMultiple,
      anomalyThreshold,
      anomalyDays
    }
  };
}

// vendor/usage-skill/balance.js
var SCHEMES = {
  /** DeepSeek: GET {origin}/user/balance — CNY balance_infos entry. */
  deepseek: {
    url: (baseURL) => new URL("/user/balance", baseURL).href,
    parse: (json7) => {
      const infos = Array.isArray(json7?.balance_infos) ? json7.balance_infos : [];
      const info = infos.find((entry) => entry?.currency === "CNY") ?? infos[0];
      return {
        isAvailable: json7?.is_available === true,
        currency: info?.currency ?? void 0,
        total: info?.total_balance ?? void 0,
        granted: info?.granted_balance ?? void 0,
        toppedUp: info?.topped_up_balance ?? void 0
      };
    }
  },
  /** OpenRouter account credits; the endpoint requires a Management Key. */
  openrouter: {
    url: (baseURL) => new URL("/api/v1/credits", baseURL).href,
    parse: (json7) => {
      const totalCredits = typeof json7?.data?.total_credits === "number" ? json7.data.total_credits : void 0;
      const totalUsage = typeof json7?.data?.total_usage === "number" ? json7.data.total_usage : void 0;
      const remaining = totalCredits !== void 0 && totalUsage !== void 0 ? totalCredits - totalUsage : void 0;
      return {
        isAvailable: remaining !== void 0 ? remaining > 0 : void 0,
        currency: "USD",
        total: remaining,
        used: totalUsage,
        limit: totalCredits,
        granted: void 0,
        toppedUp: void 0
      };
    }
  },
  /** Moonshot / Kimi: GET {origin}/v1/users/me/balance — available/cash/voucher. */
  moonshot: {
    url: (baseURL) => new URL("/v1/users/me/balance", baseURL).href,
    parse: (json7) => {
      const data = json7?.data;
      const available = typeof data?.available_balance === "number" ? data.available_balance : void 0;
      const cash = typeof data?.cash_balance === "number" ? data.cash_balance : void 0;
      const voucher = typeof data?.voucher_balance === "number" ? data.voucher_balance : void 0;
      return {
        isAvailable: available !== void 0 ? available > 0 : void 0,
        currency: typeof data?.currency === "string" ? data.currency : void 0,
        total: available,
        granted: voucher,
        toppedUp: cash
      };
    }
  },
  /** Z.AI / GLM: GET {origin}/api/paas/v4/balance — total + available. */
  zai: {
    url: (baseURL) => new URL("/api/paas/v4/balance", baseURL).href,
    parse: (json7) => {
      const data = json7?.data;
      const total = typeof data?.total_balance === "number" ? data.total_balance : typeof data?.available_balance === "number" ? data.available_balance : void 0;
      const available = typeof data?.available_balance === "number" ? data.available_balance : void 0;
      return {
        isAvailable: total !== void 0 ? total > 0 : void 0,
        currency: typeof data?.currency === "string" ? data.currency : void 0,
        total,
        granted: void 0,
        toppedUp: available
      };
    }
  }
};
function providerError(status2, message, httpStatus) {
  const error = new Error(message);
  error.providerStatus = status2;
  if (httpStatus !== void 0) error.httpStatus = httpStatus;
  return error;
}
function responseStatus(status2) {
  if (status2 === 401 || status2 === 403) return "unauthorized";
  if (status2 === 429) return "rate-limited";
  return status2 >= 500 ? "unavailable" : "invalid-response";
}
function balanceSchemeOf(providerId) {
  if (providerId === "deepseek-official" || providerId === "deepseek") return "deepseek";
  if (providerId === "openrouter") return "openrouter";
  if (providerId === "moonshotai" || providerId === "moonshotai-cn" || providerId === "kimi" || providerId === "kimi-coding") return "moonshot";
  if (providerId === "zai" || providerId === "zai-coding-cn") return "zai";
  return null;
}
async function queryBalance(scheme, baseURL, apiKey, timeoutMs = 15e3, fetchImpl = fetch) {
  const spec = SCHEMES[scheme];
  if (spec === void 0) throw new Error(`no balance scheme "${scheme}"`);
  const response = await fetchImpl(spec.url(baseURL), {
    headers: { authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!response.ok) throw providerError(responseStatus(response.status), `balance API returned HTTP ${response.status}`, response.status);
  let body;
  try {
    body = await response.json();
  } catch {
    throw providerError("invalid-response", "balance API returned invalid JSON");
  }
  return spec.parse(body);
}

// vendor/usage-skill/subscriptions.js
import { readFile as readFile3 } from "node:fs/promises";
import { homedir as homedir3 } from "node:os";
import { join as join3 } from "node:path";
var OPENCODE_GO_URL = "https://opencode.ai";
var OPENCODE_GO_USAGE_URL = `${OPENCODE_GO_URL}/zen/go/v1/usage`;
var ZAI_HOSTS = {
  global: "https://api.z.ai",
  "bigmodel-cn": "https://open.bigmodel.cn"
};
var ZAI_QUOTA_PATH = "/api/monitor/usage/quota/limit";
var ZAI_SUBSCRIPTION_PATH = "/api/biz/subscription/list";
var KIMI_USAGE_URL = "https://api.kimi.com/coding/v1/usages";
var MINIMAX_TOKEN_PLAN_HOSTS = {
  global: "https://www.minimax.io",
  cn: "https://www.minimaxi.com"
};
var MINIMAX_LEGACY_HOSTS = {
  global: "https://api.minimax.io",
  cn: "https://api.minimaxi.com"
};
var MINIMAX_USAGE_PATH = "/v1/api/openplatform/coding_plan/remains";
var MINIMAX_TOKEN_PLAN_PATH = "/v1/token_plan/remains";
var DEFAULT_TIMEOUT_MS = 15e3;
var REFS = {
  openCodeApiKey: "OPENCODE_GO_API_KEY",
  openCodeCookie: "OPENCODE_GO_AUTH_COOKIE",
  openCodeWorkspace: "OPENCODE_GO_WORKSPACE_ID",
  zaiApiKey: "ZAI_API_KEY",
  zaiRegion: "ZAI_API_REGION",
  kimiApiKey: "KIMI_API_KEY",
  minimaxApiKey: "MINIMAX_API_KEY",
  minimaxRegion: "MINIMAX_API_REGION"
};
function numberOrNull(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}
function clampPercent(value) {
  const parsed = numberOrNull(value);
  return parsed === null ? null : Math.max(0, Math.min(100, parsed));
}
function round1(value) {
  return Math.round(value * 10) / 10;
}
function toIso(value) {
  if (value === null || value === void 0 || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    const date2 = new Date(value < 2e10 ? value * 1e3 : value);
    return Number.isNaN(date2.getTime()) ? null : date2.toISOString();
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
async function resolveCredential(credentials, ref) {
  if (credentials === void 0 || credentials === null || typeof credentials.resolve !== "function") return "";
  try {
    const hit = await credentials.resolve(ref);
    return typeof hit?.value === "string" ? hit.value.trim() : "";
  } catch {
    return "";
  }
}
function normalizedStatus(error) {
  if (error?.name === "TimeoutError" || error?.name === "AbortError") return "unavailable";
  if (error?.providerStatus) return error.providerStatus;
  return error instanceof SyntaxError ? "invalid-response" : "unavailable";
}
function invalidResponse(message) {
  const error = new Error(message);
  error.providerStatus = "invalid-response";
  return error;
}
async function request(url, init, deps, type) {
  const response = await (deps.fetch ?? fetch)(url, {
    ...init,
    signal: AbortSignal.timeout(deps.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  });
  if (!response.ok) {
    const error = new Error(`upstream returned HTTP ${response.status}`);
    error.httpStatus = response.status;
    error.providerStatus = response.status === 401 || response.status === 403 ? "unauthorized" : response.status === 429 ? "rate-limited" : "unavailable";
    throw error;
  }
  if (type === "text") return response.text();
  try {
    return await response.json();
  } catch {
    throw invalidResponse("upstream returned invalid JSON");
  }
}
function sanitizeCookie(raw) {
  let value = String(raw ?? "").trim().replace(/^cookie\s*:\s*/i, "");
  value = value.split(";").map((part) => part.trim()).filter(Boolean).join("; ");
  return value !== "" && !value.includes("=") ? `auth=${value}` : value;
}
function workspaceIdOf(raw) {
  return String(raw ?? "").match(/wrk_[A-Za-z0-9]+/)?.[0] ?? "";
}
function looksSignedOut(text) {
  const lower = String(text).toLowerCase();
  return lower.includes("sign in") || lower.includes("login") || lower.includes("auth/authorize") || lower.includes('actor of type "public"');
}
function goWindowFromObject(value, kind, now) {
  if (value === null || typeof value !== "object") return null;
  const percentSource = value.usagePercent ?? value.usedPercent ?? value.percentUsed ?? value.percentage ?? value.percent;
  let usedPercent = clampPercent(percentSource);
  if (usedPercent === null) {
    const used = numberOrNull(value.used ?? value.consumed);
    const limit = numberOrNull(value.limit ?? value.total ?? value.quota);
    if (used !== null && limit !== null && limit > 0) usedPercent = clampPercent(used / limit * 100);
  }
  if (usedPercent === null) return null;
  if (usedPercent <= 1 && usedPercent >= 0 && value.percent === void 0 && percentSource !== void 0) usedPercent *= 100;
  const resetSeconds = numberOrNull(value.resetInSec ?? value.resetInSeconds ?? value.resetSeconds);
  const resetsAt = resetSeconds === null ? toIso(value.resetAt ?? value.resetsAt ?? value.nextReset) : new Date(now + Math.max(0, resetSeconds) * 1e3).toISOString();
  return {
    kind,
    usedPercent: round1(clampPercent(usedPercent)),
    remainingPercent: round1(100 - clampPercent(usedPercent)),
    ...resetsAt === null ? {} : { resetsAt }
  };
}
function parseOpenCodeGoApi(body, now) {
  const usage = body?.usage ?? body;
  if (usage === null || typeof usage !== "object") return [];
  return [
    goWindowFromObject(usage.rolling, "session", now),
    goWindowFromObject(usage.weekly, "weekly", now),
    goWindowFromObject(usage.monthly, "monthly", now)
  ].filter(Boolean);
}
function findObject(root, keyword, depth = 0) {
  if (root === null || typeof root !== "object" || depth > 5) return null;
  for (const [key, value] of Object.entries(root)) {
    if (key.toLowerCase().includes(keyword) && value !== null && typeof value === "object") return value;
  }
  for (const value of Object.values(root)) {
    const found = findObject(value, keyword, depth + 1);
    if (found !== null) return found;
  }
  return null;
}
function goWindowFromText(text, key, kind, now) {
  const percent = new RegExp(`${key}[^}]*?usagePercent\\s*[:=]\\s*([0-9]+(?:\\.[0-9]+)?)`, "i").exec(text);
  if (percent === null) return null;
  const reset = new RegExp(`${key}[^}]*?resetInSec\\s*[:=]\\s*([0-9]+)`, "i").exec(text);
  const usedPercent = round1(clampPercent(Number(percent[1])));
  return {
    kind,
    usedPercent,
    remainingPercent: round1(100 - usedPercent),
    ...reset === null ? {} : { resetsAt: new Date(now + Number(reset[1]) * 1e3).toISOString() }
  };
}
function parseOpenCodeGo(text, now) {
  let windows = [];
  try {
    const root = JSON.parse(text);
    windows = [
      goWindowFromObject(findObject(root, "rolling"), "session", now),
      goWindowFromObject(findObject(root, "weekly") ?? findObject(root, "week"), "weekly", now),
      goWindowFromObject(findObject(root, "monthly") ?? findObject(root, "month"), "monthly", now)
    ].filter(Boolean);
  } catch {
  }
  if (!windows.some((window) => window.kind === "session") || !windows.some((window) => window.kind === "weekly")) {
    windows = [
      goWindowFromText(text, "rollingUsage", "session", now),
      goWindowFromText(text, "weeklyUsage", "weekly", now),
      goWindowFromText(text, "monthlyUsage", "monthly", now)
    ].filter(Boolean);
  }
  return windows.some((window) => window.kind === "session") && windows.some((window) => window.kind === "weekly") ? windows : [];
}
async function localOpenCodeApiKey(deps) {
  try {
    const home = typeof deps.homedir === "function" ? deps.homedir() : homedir3();
    const load = deps.readFile ?? readFile3;
    const raw = JSON.parse(await load(join3(home, ".local", "share", "opencode", "auth.json"), "utf8"));
    const entry = raw?.["opencode-go"] ?? raw?.opencode;
    return entry?.type === "api" && typeof entry.key === "string" ? entry.key.trim() : "";
  } catch {
    return "";
  }
}
async function collectOpenCodeGoFromDashboard(cookie, workspaceId, deps) {
  try {
    const text = await request(`${OPENCODE_GO_URL}/workspace/${workspaceId}/go`, {
      headers: {
        cookie,
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8"
      }
    }, deps, "text");
    if (looksSignedOut(text)) return { status: "unauthorized", windows: [] };
    const windows = parseOpenCodeGo(text, deps.now());
    return { status: windows.length > 0 ? "ok" : "invalid-response", windows };
  } catch (error) {
    return { status: normalizedStatus(error), windows: [] };
  }
}
async function collectOpenCodeGo(credentials, deps) {
  const apiKeyRef = deps.apiKeyRef ?? REFS.openCodeApiKey;
  const [configuredApiKey, cookieRaw, workspaceRaw] = await Promise.all([
    resolveCredential(credentials, apiKeyRef),
    resolveCredential(credentials, REFS.openCodeCookie),
    resolveCredential(credentials, REFS.openCodeWorkspace)
  ]);
  const apiKey = configuredApiKey || await localOpenCodeApiKey(deps);
  const cookie = sanitizeCookie(cookieRaw);
  const workspaceId = workspaceIdOf(workspaceRaw);
  if (apiKey === "" && (cookie === "" || workspaceId === "")) {
    return {
      id: "opencode-go",
      displayName: "OpenCode Go",
      mode: "subscription",
      status: "not-configured",
      plan: "Go",
      missingCredentials: [apiKeyRef],
      windows: []
    };
  }
  let apiStatus = "unavailable";
  if (apiKey !== "") {
    try {
      const body = await request(OPENCODE_GO_USAGE_URL, {
        headers: { authorization: `Bearer ${apiKey}`, accept: "application/json" }
      }, deps, "json");
      const windows = parseOpenCodeGoApi(body, deps.now());
      if (windows.length > 0) {
        return { id: "opencode-go", displayName: "OpenCode Go", mode: "subscription", status: "ok", plan: "Go", windows };
      }
      apiStatus = "invalid-response";
    } catch (error) {
      apiStatus = normalizedStatus(error);
    }
  }
  if (cookie !== "" && workspaceId !== "") {
    const dashboard = await collectOpenCodeGoFromDashboard(cookie, workspaceId, deps);
    return { id: "opencode-go", displayName: "OpenCode Go", mode: "subscription", status: dashboard.status, plan: "Go", windows: dashboard.windows };
  }
  return { id: "opencode-go", displayName: "OpenCode Go", mode: "subscription", status: apiStatus, plan: "Go", windows: [] };
}
function zaiRegionOf(raw, fallback = "global") {
  const value = String(raw || fallback).trim().toLowerCase();
  return value === "bigmodel-cn" || value === "cn" || value.includes("bigmodel.cn") ? "bigmodel-cn" : "global";
}
function zaiWindowMinutes(limit) {
  const unit = numberOrNull(limit?.unit);
  const number = numberOrNull(limit?.number);
  if (unit === null || number === null || number <= 0) return null;
  if (unit === 5) return number;
  if (unit === 3) return number * 60;
  if (unit === 1) return number * 24 * 60;
  if (unit === 6) return number * 7 * 24 * 60;
  return null;
}
function zaiUsedPercent(limit) {
  const total = numberOrNull(limit?.usage);
  const remaining = numberOrNull(limit?.remaining);
  const current = numberOrNull(limit?.currentValue ?? limit?.current_value);
  if (total !== null && total > 0) {
    const used = remaining === null ? current : current === null ? total - remaining : Math.max(total - remaining, current);
    if (used !== null) return clampPercent(Math.max(0, Math.min(total, used)) / total * 100);
  }
  return clampPercent(limit?.percentage ?? limit?.usedPercent ?? limit?.used_percent);
}
function displayPlan(value) {
  return String(value ?? "").trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ").replace(/\bglm\b/gi, "GLM").replace(/\b\w/g, (char) => char.toUpperCase());
}
function zaiPlan(quota, subscription) {
  const row = Array.isArray(subscription?.data) ? subscription.data.find((entry) => entry && typeof entry === "object") : null;
  for (const source of [row, quota?.data]) {
    for (const key of ["product_name", "productName", "plan_name", "planName", "package_name", "packageName", "plan_type", "planType", "level"]) {
      const value = displayPlan(source?.[key]);
      if (value !== "") return value;
    }
  }
  return "GLM Coding Plan";
}
function zaiWindow(limit, kind, fallbackReset = null) {
  const usedPercent = zaiUsedPercent(limit);
  if (usedPercent === null) return null;
  const resetsAt = toIso(limit.nextResetTime ?? limit.next_reset_time) ?? fallbackReset;
  return {
    kind,
    usedPercent: round1(usedPercent),
    remainingPercent: round1(100 - usedPercent),
    ...resetsAt === null ? {} : { resetsAt },
    ...numberOrNull(limit.remaining) === null ? {} : { remaining: numberOrNull(limit.remaining) }
  };
}
function parseZai(quota, subscription) {
  const limits = Array.isArray(quota?.data?.limits) ? quota.data.limits : [];
  const tokenLimits = limits.filter((limit) => ["TOKENS_LIMIT", "CREDIT_LIMIT"].includes(String(limit?.type ?? limit?.limit_type ?? "").toUpperCase()) && zaiUsedPercent(limit) !== null).sort((a, b) => (zaiWindowMinutes(a) ?? Number.MAX_SAFE_INTEGER) - (zaiWindowMinutes(b) ?? Number.MAX_SAFE_INTEGER));
  const timeLimit = limits.find((limit) => String(limit?.type ?? limit?.limit_type ?? "").toUpperCase() === "TIME_LIMIT" && zaiUsedPercent(limit) !== null) ?? null;
  const first = tokenLimits[0] ?? null;
  const session = tokenLimits.length >= 2 ? first : zaiWindowMinutes(first) !== null && zaiWindowMinutes(first) <= 360 ? first : null;
  const weekly = tokenLimits.length >= 2 ? tokenLimits[tokenLimits.length - 1] : session === null ? first : null;
  const subscriptionRow = Array.isArray(subscription?.data) ? subscription.data[0] : null;
  const renewAt = toIso(subscriptionRow?.next_renew_time ?? subscriptionRow?.nextRenewTime);
  return {
    plan: zaiPlan(quota, subscription),
    windows: [
      session === null ? null : zaiWindow(session, "session"),
      weekly === null ? null : zaiWindow(weekly, "weekly"),
      timeLimit === null ? null : zaiWindow(timeLimit, "billing", renewAt)
    ].filter(Boolean)
  };
}
async function collectZai(credentials, deps) {
  const apiKeyRef = deps.zaiApiKeyRef ?? REFS.zaiApiKey;
  const [apiKey, configuredRegion] = await Promise.all([
    resolveCredential(credentials, apiKeyRef),
    resolveCredential(credentials, REFS.zaiRegion)
  ]);
  const region = zaiRegionOf(configuredRegion, deps.zaiDefaultRegion);
  if (apiKey === "") {
    return { id: "zai", displayName: "Z.ai", mode: "subscription", status: "not-configured", plan: "GLM Coding Plan", region, missingCredentials: [apiKeyRef], windows: [] };
  }
  const host = ZAI_HOSTS[region];
  const init = { headers: { authorization: apiKey, accept: "application/json" } };
  try {
    const quota = await request(`${host}${ZAI_QUOTA_PATH}`, init, deps, "json");
    let subscription = null;
    try {
      subscription = await request(`${host}${ZAI_SUBSCRIPTION_PATH}`, init, deps, "json");
    } catch {
    }
    const parsed = parseZai(quota, subscription);
    return { id: "zai", displayName: "Z.ai", mode: "subscription", status: parsed.windows.length > 0 ? "ok" : "invalid-response", plan: parsed.plan, region, windows: parsed.windows };
  } catch (error) {
    return { id: "zai", displayName: "Z.ai", mode: "subscription", status: normalizedStatus(error), plan: "GLM Coding Plan", region, windows: [] };
  }
}
function limitWindow(value, kind) {
  if (value === null || typeof value !== "object") return null;
  const limit = numberOrNull(value.limit ?? value.total);
  const remaining = numberOrNull(value.remaining);
  if (limit === null || remaining === null || limit <= 0) return null;
  const usedPercent = round1(clampPercent((limit - remaining) / limit * 100));
  const resetsAt = toIso(value.resetTime ?? value.reset_time ?? value.resetsAt);
  return {
    kind,
    usedPercent,
    remainingPercent: round1(100 - usedPercent),
    ...resetsAt === null ? {} : { resetsAt }
  };
}
function parseKimi(body) {
  const data = body?.data ?? body;
  const limits = Array.isArray(data?.limits) ? data.limits : [];
  const session = limits.map((entry) => limitWindow(entry?.detail ?? entry, "session")).find(Boolean) ?? null;
  const weekly = limitWindow(data?.usage, "weekly");
  return {
    plan: String(data?.plan ?? data?.planName ?? "Kimi For Coding"),
    windows: [session, weekly].filter(Boolean)
  };
}
async function collectKimi(credentials, deps) {
  const apiKeyRef = deps.apiKeyRef ?? REFS.kimiApiKey;
  const apiKey = await resolveCredential(credentials, apiKeyRef);
  if (apiKey === "") return { id: "kimi", displayName: "Kimi For Coding", mode: "subscription", status: "not-configured", plan: "Kimi For Coding", missingCredentials: [apiKeyRef], windows: [] };
  try {
    const configured = nonEmptyUrl(deps.baseURL, "/coding/v1/usages") ?? KIMI_USAGE_URL;
    const body = await request(configured, {
      headers: { authorization: `Bearer ${apiKey}`, accept: "application/json" }
    }, deps, "json");
    const parsed = parseKimi(body);
    return { id: "kimi", displayName: "Kimi For Coding", mode: "subscription", status: parsed.windows.length > 0 ? "ok" : "invalid-response", ...parsed };
  } catch (error) {
    return { id: "kimi", displayName: "Kimi For Coding", mode: "subscription", status: normalizedStatus(error), plan: "Kimi For Coding", windows: [] };
  }
}
function nonEmptyUrl(value, defaultPath) {
  if (typeof value !== "string" || value.trim() === "") return null;
  try {
    const url = new URL(value);
    return url.pathname === "/" || url.pathname === "" ? new URL(defaultPath, url).href : url.href;
  } catch {
    return null;
  }
}
function minimaxRegionOf(raw, baseURL) {
  const value = String(raw ?? "").trim().toLowerCase();
  if (value === "cn" || value.includes("minimaxi.com") || String(baseURL ?? "").includes("minimaxi.com")) return "cn";
  return "global";
}
function resetFromDuration(value, now) {
  const milliseconds = numberOrNull(value);
  if (milliseconds === null || milliseconds < 0) return null;
  const date = new Date(now + milliseconds);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
function parseMiniMax(body, now) {
  const statusCode = numberOrNull(body?.base_resp?.status_code ?? body?.baseResp?.statusCode);
  if (statusCode !== null && statusCode !== 0) return [];
  const remains = Array.isArray(body?.model_remains) ? body.model_remains : Array.isArray(body?.data?.model_remains) ? body.data.model_remains : [];
  const general = remains.find((entry) => String(entry?.model_name ?? entry?.modelName ?? "").toLowerCase() === "general");
  if (general === void 0) return [];
  const intervalRemaining = clampPercent(general.current_interval_remaining_percent ?? general.currentIntervalRemainingPercent);
  const weeklyRemaining = clampPercent(general.current_weekly_remaining_percent ?? general.currentWeeklyRemainingPercent);
  const weeklyStatus = numberOrNull(general.current_weekly_status ?? general.currentWeeklyStatus);
  const sessionReset = toIso(general.current_interval_end_time ?? general.currentIntervalEndTime ?? general.current_interval_reset_time) ?? resetFromDuration(general.remains_time ?? general.remainsTime, now);
  const weeklyReset = toIso(general.current_weekly_end_time ?? general.currentWeeklyEndTime ?? general.current_weekly_reset_time) ?? resetFromDuration(general.weekly_remains_time ?? general.weeklyRemainsTime, now);
  return [
    intervalRemaining === null ? null : {
      kind: "session",
      usedPercent: round1(100 - intervalRemaining),
      remainingPercent: round1(intervalRemaining),
      ...sessionReset === null ? {} : { resetsAt: sessionReset }
    },
    weeklyStatus !== 1 || weeklyRemaining === null ? null : {
      kind: "weekly",
      usedPercent: round1(100 - weeklyRemaining),
      remainingPercent: round1(weeklyRemaining),
      ...weeklyReset === null ? {} : { resetsAt: weeklyReset }
    }
  ].filter(Boolean);
}
async function collectMiniMax(credentials, deps) {
  const apiKeyRef = deps.apiKeyRef ?? REFS.minimaxApiKey;
  const [apiKey, configuredRegion] = await Promise.all([
    resolveCredential(credentials, apiKeyRef),
    resolveCredential(credentials, REFS.minimaxRegion)
  ]);
  const region = minimaxRegionOf(deps.region ?? configuredRegion, deps.baseURL);
  if (apiKey === "") return { id: "minimax", displayName: "MiniMax Coding Plan", mode: "subscription", status: "not-configured", plan: "MiniMax Coding Plan", region, missingCredentials: [apiKeyRef], windows: [] };
  const configuredUrl = nonEmptyUrl(deps.baseURL, MINIMAX_USAGE_PATH);
  const urls = configuredUrl === null ? [
    `${MINIMAX_TOKEN_PLAN_HOSTS[region]}${MINIMAX_TOKEN_PLAN_PATH}`,
    `${MINIMAX_LEGACY_HOSTS[region]}${MINIMAX_USAGE_PATH}`
  ] : [configuredUrl];
  try {
    let body = null;
    for (const [index, url] of urls.entries()) {
      try {
        body = await request(url, {
          headers: { authorization: `Bearer ${apiKey}`, accept: "application/json" }
        }, deps, "json");
        break;
      } catch (error) {
        if (index === 0 && urls.length > 1 && (error?.httpStatus === 404 || error?.httpStatus === 405)) continue;
        throw error;
      }
    }
    const windows = parseMiniMax(body, deps.now());
    return { id: "minimax", displayName: "MiniMax Coding Plan", mode: "subscription", status: windows.length > 0 ? "ok" : "invalid-response", plan: "MiniMax Coding Plan", region, windows };
  } catch (error) {
    return { id: "minimax", displayName: "MiniMax Coding Plan", mode: "subscription", status: normalizedStatus(error), plan: "MiniMax Coding Plan", region, windows: [] };
  }
}
async function collectSubscription(providerId, credentials, options = {}, deps = {}) {
  const shared = {
    fetch: deps.fetch,
    readFile: deps.readFile,
    homedir: deps.homedir,
    timeoutMs: deps.timeoutMs,
    now: deps.now ?? Date.now,
    apiKeyRef: options.apiKeyRef,
    baseURL: options.baseURL,
    region: options.region
  };
  if (providerId === "opencode-go") return collectOpenCodeGo(credentials, shared);
  if (providerId === "zai") return collectZai(credentials, {
    ...shared,
    zaiApiKeyRef: options.apiKeyRef,
    zaiDefaultRegion: options.region ?? "global"
  });
  if (providerId === "kimi") return collectKimi(credentials, shared);
  if (providerId === "minimax") return collectMiniMax(credentials, shared);
  return { id: providerId, displayName: providerId, mode: "subscription", status: "unavailable", windows: [] };
}
var subscriptionCredentialRefs = { ...REFS };

// vendor/usage-skill/accounts.js
import { lookup as dnsLookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { createHash as createHash2, randomBytes } from "node:crypto";
var DEFAULT_TIMEOUT_MS2 = 15e3;
var DEFAULT_REFRESH_MS = 3e5;
var MAX_RESPONSE_BYTES = 1024 * 1024;
var OPENROUTER_MANAGEMENT_REF = "OPENROUTER_MANAGEMENT_KEY";
var SENSENOVA_CONSOLE_TOKEN_REF = "SENSENOVA_CONSOLE_TOKEN";
var SENSENOVA_USERNAME_REF = "SENSENOVA_USERNAME";
var SENSENOVA_PASSWORD_REF = "SENSENOVA_PASSWORD";
var SENSENOVA_PLATFORM_ORIGIN = "https://platform.sensenova.cn";
var SENSENOVA_ISSUER = "https://signin.sensecore.cn";
var SENSENOVA_IAM = "https://iam.sensecoreapi.cn";
var SENSENOVA_CLIENT_ID = "nova";
var SENSENOVA_REDIRECT_URI = "https://platform.sensenova.cn";
var SENSENOVA_AUTHORIZE = "https://platform.sensenova.cn/oauth2/auth";
var SENSENOVA_SCOPE = "openid offline offline_access";
var SENSENOVA_TOKEN_SKEW_MS = 6e4;
var sensenovaTokenCache = /* @__PURE__ */ new Map();
var ACCOUNT_STATUSES = /* @__PURE__ */ new Set([
  "ok",
  "not-configured",
  "unauthorized",
  "rate-limited",
  "unavailable",
  "invalid-response",
  "unsupported"
]);
var ADAPTERS = /* @__PURE__ */ new Set([
  "deepseek-balance",
  "openrouter-balance",
  "moonshot-balance",
  "zai-balance",
  "general",
  "new-api",
  "sub2api",
  "opencode-go",
  "zai-token-plan",
  "kimi-token-plan",
  "minimax-token-plan",
  "sensenova-token-plan",
  "declarative"
]);
var SENSITIVE_HEADERS = /* @__PURE__ */ new Set([
  "authorization",
  "api-key",
  "cookie",
  "host",
  "proxy-authorization",
  "proxy-authenticate",
  "set-cookie",
  "transfer-encoding",
  "connection",
  "upgrade",
  "x-api-key"
]);
function nonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}
function numberOrNull2(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}
function booleanOrNull(value) {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false") return false;
  return null;
}
function round12(value) {
  return Math.round(value * 10) / 10;
}
function toIso2(value) {
  if (value === null || value === void 0 || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    const date2 = new Date(value < 2e10 ? value * 1e3 : value);
    return Number.isNaN(date2.getTime()) ? null : date2.toISOString();
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
function statusError(status2, message, httpStatus) {
  const error = new Error(message);
  error.providerStatus = status2;
  if (httpStatus !== void 0) error.httpStatus = httpStatus;
  return error;
}
function statusOf(error) {
  if (ACCOUNT_STATUSES.has(error?.providerStatus)) return error.providerStatus;
  if (error?.name === "TimeoutError" || error?.name === "AbortError") return "unavailable";
  return "unavailable";
}
async function resolveCredential2(credentials, ref) {
  if (nonEmptyString(ref) === null || credentials === null || credentials === void 0 || typeof credentials.resolve !== "function") return "";
  try {
    const hit = await credentials.resolve(ref);
    return nonEmptyString(hit?.value) ?? "";
  } catch {
    return "";
  }
}
function responseStatus2(status2) {
  if (status2 === 401 || status2 === 403) return "unauthorized";
  if (status2 === 429) return "rate-limited";
  if (status2 === 404 || status2 === 405) return "unsupported";
  return status2 >= 500 ? "unavailable" : "invalid-response";
}
async function parseJsonResponse(response, maxBytes = MAX_RESPONSE_BYTES) {
  const declared = numberOrNull2(response.headers?.get?.("content-length"));
  if (declared !== null && declared > maxBytes) throw statusError("invalid-response", "upstream response exceeds the size limit");
  const contentType = response.headers?.get?.("content-type");
  if (typeof contentType === "string" && contentType !== "" && !/\bjson\b/i.test(contentType)) {
    throw statusError("invalid-response", "upstream did not return JSON");
  }
  if (typeof response.arrayBuffer === "function") {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw statusError("invalid-response", "upstream response exceeds the size limit");
    try {
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw statusError("invalid-response", "upstream returned invalid JSON");
    }
  }
  try {
    return await response.json();
  } catch {
    throw statusError("invalid-response", "upstream returned invalid JSON");
  }
}
async function requestJson(url, init, deps = {}) {
  const response = await (deps.fetch ?? fetch)(url, {
    ...init,
    redirect: "manual",
    signal: AbortSignal.timeout(deps.timeoutMs ?? DEFAULT_TIMEOUT_MS2)
  });
  if (!response.ok) throw statusError(responseStatus2(response.status), `upstream returned HTTP ${response.status}`, response.status);
  return parseJsonResponse(response, deps.maxResponseBytes ?? MAX_RESPONSE_BYTES);
}
function schemeAdapter(scheme) {
  return `${scheme}-balance`;
}
function schemeOfAdapter(adapter) {
  return adapter.endsWith("-balance") ? adapter.slice(0, -8) : null;
}
function defaultAdapter(provider) {
  const providerId = provider.id;
  if (providerId === "opencode-go") return "opencode-go";
  if (providerId === "zai" || providerId === "zai-coding-cn") return "zai-token-plan";
  if (providerId === "kimi-coding" || providerId === "kimi-for-coding") return "kimi-token-plan";
  if (["minimax", "minimaxi", "minimax-cn", "minimax-coding"].includes(providerId)) return "minimax-token-plan";
  if (providerId === "sensenova") return "sensenova-token-plan";
  if (providerId === "passion") return "sub2api";
  try {
    const hostname = new URL(provider.baseURL).hostname.toLowerCase();
    if (hostname === "passionapi.com" || hostname.endsWith(".passionapi.com")) return "sub2api";
    if (hostname === "token.sensenova.cn" || hostname.endsWith(".sensenova.cn")) return "sensenova-token-plan";
  } catch {
  }
  const scheme = balanceSchemeOf(providerId);
  return scheme === null ? null : schemeAdapter(scheme);
}
function adapterMode(adapter, monitor) {
  if (adapter === "declarative") return monitor.mode;
  if (["opencode-go", "zai-token-plan", "kimi-token-plan", "minimax-token-plan", "sensenova-token-plan"].includes(adapter)) return "subscription";
  return "balance";
}
function assertRelativePath(path, label) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    throw new Error(`${label} must be an absolute-path relative path beginning with /`);
  }
  try {
    const parsed = new URL(path, "https://usage.invalid");
    if (parsed.origin !== "https://usage.invalid") throw new Error("origin changed");
  } catch {
    throw new Error(`${label} must be a relative path, not a URL`);
  }
}
function validatePointer(pointer, label) {
  if (pointer === void 0 || pointer === null) return;
  const value = typeof pointer === "object" && pointer !== null ? pointer.pointer : pointer;
  if (typeof value !== "string" || value !== "" && !value.startsWith("/")) throw new Error(`${label} must be a JSON Pointer`);
}
function validateWarning(value, label) {
  if (value === void 0) return;
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  for (const field of ["warnBelow", "criticalBelow"]) {
    if (value[field] !== void 0 && numberOrNull2(value[field]) === null) throw new Error(`${label}.${field} must be numeric`);
  }
  const warn = numberOrNull2(value.warnBelow);
  const critical = numberOrNull2(value.criticalBelow);
  if (warn !== null && critical !== null && critical > warn) throw new Error(`${label}.criticalBelow must not exceed warnBelow`);
}
function validateDeclarative(monitor, label) {
  if (monitor.mode !== "balance" && monitor.mode !== "subscription") throw new Error(`${label}.mode must be balance or subscription`);
  if (monitor.request === null || typeof monitor.request !== "object" || Array.isArray(monitor.request)) throw new Error(`${label}.request must be an object`);
  assertRelativePath(monitor.request.path, `${label}.request.path`);
  if (monitor.request.method !== void 0 && monitor.request.method !== "GET") throw new Error(`${label}.request.method must be GET`);
  const authType = monitor.request.auth?.type;
  if (authType !== void 0 && !["bearer", "raw", "x-api-key"].includes(authType)) throw new Error(`${label}.request.auth.type is unsupported`);
  for (const name2 of Object.keys(monitor.request.headers ?? {})) {
    if (SENSITIVE_HEADERS.has(name2.toLowerCase())) throw new Error(`${label}.request.headers cannot override ${name2}`);
  }
  if (monitor.extract === null || typeof monitor.extract !== "object" || Array.isArray(monitor.extract)) throw new Error(`${label}.extract must be an object`);
  for (const field of ["root", "valid", "invalidMessage", "plan", "remaining", "used", "total", "currency", "unlimited", "expiresAt", "items", "kind", "usedPercent", "remainingPercent", "resetsAt"]) {
    validatePointer(monitor.extract[field], `${label}.extract.${field}`);
  }
  if (monitor.mode === "balance" && monitor.extract.remaining === void 0 && monitor.extract.total === void 0) throw new Error(`${label}.extract requires remaining or total`);
  if (monitor.mode === "subscription" && monitor.extract.items === void 0) throw new Error(`${label}.extract.items is required`);
  if (monitor.extract.divisor !== void 0 && (numberOrNull2(monitor.extract.divisor) === null || Number(monitor.extract.divisor) === 0)) throw new Error(`${label}.extract.divisor must be a non-zero number`);
}
function validateAccountConfig(raw = {}) {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) throw new Error("account config must be an object");
  const monitors = raw.monitors ?? {};
  if (monitors === null || typeof monitors !== "object" || Array.isArray(monitors)) throw new Error("monitors must be an object keyed by provider id");
  const normalized = {};
  for (const [key, value] of Object.entries(monitors)) {
    const label = `monitors.${key}`;
    if (nonEmptyString(key) === null || value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
    const providerId = nonEmptyString(value.providerId) ?? key;
    const adapter = nonEmptyString(value.adapter);
    if (adapter === null || !ADAPTERS.has(adapter)) throw new Error(`${label}.adapter is unsupported`);
    if (value.usageBaseURL !== void 0) {
      let url;
      try {
        url = new URL(value.usageBaseURL);
      } catch {
        throw new Error(`${label}.usageBaseURL must be a valid URL`);
      }
      if (url.username !== "" || url.password !== "") throw new Error(`${label}.usageBaseURL must not contain credentials`);
      if (url.protocol !== "https:" && value.allowInsecure !== true) throw new Error(`${label}.usageBaseURL must use HTTPS unless allowInsecure is true`);
    }
    validateWarning(value.warning, `${label}.warning`);
    if (adapter === "declarative") validateDeclarative(value, label);
    normalized[providerId] = { ...value, providerId, adapter };
  }
  return { monitors: normalized };
}
function resolveAccountSpec(provider, config = { monitors: {} }) {
  const monitor = config.monitors?.[provider.id] ?? {};
  const adapter = monitor.adapter ?? defaultAdapter(provider);
  const mode = adapter === null ? null : adapterMode(adapter, monitor);
  const apiKeyRef = monitor.credentialRef ?? (adapter === "openrouter-balance" ? OPENROUTER_MANAGEMENT_REF : adapter === "sensenova-token-plan" ? SENSENOVA_USERNAME_REF : provider.apiKeyEnv);
  return {
    id: provider.id,
    displayName: provider.displayName ?? provider.id,
    adapter,
    mode,
    apiKeyRef,
    baseURL: monitor.usageBaseURL ?? provider.baseURL,
    providerBaseURL: provider.baseURL,
    monitor,
    configKey: JSON.stringify({ adapter, mode, provider, monitor })
  };
}
function decodePointerToken(token) {
  return token.replace(/~1/g, "/").replace(/~0/g, "~");
}
function jsonPointer(value, pointer) {
  if (pointer === "" || pointer === void 0 || pointer === null) return value;
  if (typeof pointer !== "string" || !pointer.startsWith("/")) return void 0;
  let current = value;
  for (const raw of pointer.slice(1).split("/")) {
    const key = decodePointerToken(raw);
    if (current === null || current === void 0 || typeof current !== "object" || !Object.hasOwn(current, key)) return void 0;
    current = current[key];
  }
  return current;
}
function mapped(root, mapping) {
  if (mapping === void 0 || mapping === null) return void 0;
  if (typeof mapping === "string") return jsonPointer(root, mapping);
  if (typeof mapping === "object" && typeof mapping.pointer === "string") {
    const value = jsonPointer(root, mapping.pointer);
    const divisor = numberOrNull2(mapping.divisor);
    return divisor === null ? value : numberOrNull2(value) === null ? void 0 : Number(value) / divisor;
  }
  return void 0;
}
function ipv4Private(octets) {
  const [a, b, c] = octets;
  return a === 0 || a === 10 || a === 127 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a === 192 && b === 0 && (c === 0 || c === 2) || a === 192 && b === 88 && c === 99 || a === 100 && b >= 64 && b <= 127 || a === 198 && (b === 18 || b === 19) || a === 198 && b === 51 && c === 100 || a === 203 && b === 0 && c === 113 || a >= 224;
}
function ipv6Bytes(address) {
  let value = address.toLowerCase().split("%")[0];
  let ipv4Tail = null;
  const lastColon = value.lastIndexOf(":");
  if (value.slice(lastColon + 1).includes(".")) {
    const octets = value.slice(lastColon + 1).split(".").map(Number);
    if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
    ipv4Tail = [octets[0] << 8 | octets[1], octets[2] << 8 | octets[3]];
    value = `${value.slice(0, lastColon)}:${ipv4Tail[0].toString(16)}:${ipv4Tail[1].toString(16)}`;
  }
  const halves = value.split("::");
  if (halves.length > 2) return null;
  const left = halves[0] === "" ? [] : halves[0].split(":");
  const right = halves.length === 1 || halves[1] === "" ? [] : halves[1].split(":");
  const missing = 8 - left.length - right.length;
  if (missing < 0 || halves.length === 1 && missing !== 0) return null;
  const words = [...left, ...Array(missing).fill("0"), ...right].map((part) => Number.parseInt(part || "0", 16));
  if (words.length !== 8 || words.some((part) => !Number.isInteger(part) || part < 0 || part > 65535)) return null;
  const bytes = [];
  for (const word of words) bytes.push(word >> 8, word & 255);
  return bytes;
}
function isPrivateAddress(address) {
  const value = String(address ?? "").trim().replace(/^\[|\]$/g, "");
  if (isIP(value) === 4) return ipv4Private(value.split(".").map(Number));
  if (isIP(value) !== 6) return false;
  const bytes = ipv6Bytes(value);
  if (bytes === null) return true;
  if (bytes.slice(0, 10).every((byte) => byte === 0) && bytes[10] === 255 && bytes[11] === 255) return ipv4Private(bytes.slice(12));
  const globalUnicast = (bytes[0] & 224) === 32;
  const word0 = bytes[0] << 8 | bytes[1];
  const word1 = bytes[2] << 8 | bytes[3];
  const ietfSpecial = word0 === 8193 && word1 <= 511;
  const sixToFour = word0 === 8194;
  const documentation = word0 === 8193 && word1 === 3512 || word0 === 16383 && (word1 & 61440) === 0;
  return !globalUnicast || ietfSpecial || sixToFour || documentation;
}
function privateHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" || host.endsWith(".localhost") || isPrivateAddress(host);
}
async function resolvePublicAddress(url, spec, deps) {
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (privateHostname(hostname) && spec.monitor.allowPrivateNetwork !== true) throw statusError("unsupported", "account monitor private-network access requires allowPrivateNetwork");
  if (isIP(hostname) !== 0) return { address: hostname, family: isIP(hostname) };
  let addresses;
  try {
    addresses = await (deps.lookup ?? dnsLookup)(hostname, { all: true, verbatim: true });
  } catch {
    throw statusError("unavailable", "account monitor hostname could not be resolved");
  }
  if (!Array.isArray(addresses)) addresses = [addresses];
  if (addresses.length === 0) throw statusError("unavailable", "account monitor hostname resolved to no addresses");
  if (spec.monitor.allowPrivateNetwork !== true && addresses.some((entry) => isPrivateAddress(entry?.address))) {
    throw statusError("unsupported", "account monitor hostname resolves to a private network");
  }
  const selected = addresses[0];
  return { address: selected.address, family: selected.family ?? isIP(selected.address) };
}
function crossOriginSensitive(spec) {
  return spec.monitor.usageBaseURL !== void 0 || spec.adapter === "general" || spec.adapter === "new-api" || spec.adapter === "declarative" || schemeOfAdapter(spec.adapter ?? "") !== null;
}
async function assertTargetPolicy(rawUrl, spec, deps) {
  const url = new URL(rawUrl);
  if (url.username !== "" || url.password !== "") throw statusError("unsupported", "account monitor URL must not contain credentials");
  if (url.protocol !== "https:" && spec.monitor.allowInsecure !== true) throw statusError("unsupported", "account monitor requires HTTPS");
  if (url.protocol !== "https:" && url.protocol !== "http:") throw statusError("unsupported", "account monitor protocol is unsupported");
  if (crossOriginSensitive(spec) && nonEmptyString(spec.providerBaseURL) !== null) {
    const providerOrigin = new URL(spec.providerBaseURL).origin;
    if (url.origin !== providerOrigin && spec.monitor.allowCrossOrigin !== true) throw statusError("unsupported", "account monitor cross-origin access requires allowCrossOrigin");
  }
  const resolved = await resolvePublicAddress(url, spec, deps);
  return { url, ...resolved };
}
function responseHeaders(headers) {
  return {
    get: (name2) => {
      const value = headers[String(name2).toLowerCase()];
      return Array.isArray(value) ? value.join(", ") : value === void 0 ? null : String(value);
    },
    getSetCookie: () => {
      const value = headers["set-cookie"];
      if (value === void 0) return [];
      return Array.isArray(value) ? value : [String(value)];
    }
  };
}
async function pinnedFetch(rawUrl, init, spec, deps) {
  const target = await assertTargetPolicy(rawUrl, spec, deps);
  const signal = init?.signal ?? AbortSignal.timeout(deps.timeoutMs ?? DEFAULT_TIMEOUT_MS2);
  return new Promise((resolve2, reject) => {
    const transport = target.url.protocol === "https:" ? httpsRequest : httpRequest;
    const request2 = transport(target.url, {
      method: init?.method ?? "GET",
      headers: init?.headers,
      signal,
      servername: isIP(target.url.hostname.replace(/^\[|\]$/g, "")) === 0 ? target.url.hostname : void 0,
      lookup: (_hostname, options, callback) => {
        if (options?.all) callback(null, [{ address: target.address, family: target.family }]);
        else callback(null, target.address, target.family);
      }
    }, (response) => {
      const chunks = [];
      let size = 0;
      response.on("data", (chunk) => {
        size += chunk.length;
        if (size > (deps.maxResponseBytes ?? MAX_RESPONSE_BYTES)) request2.destroy(statusError("invalid-response", "upstream response exceeds the size limit"));
        else chunks.push(chunk);
      });
      response.on("end", () => {
        const body = Buffer.concat(chunks);
        resolve2({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          status: response.statusCode,
          headers: responseHeaders(response.headers),
          arrayBuffer: async () => body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
          json: async () => JSON.parse(body.toString("utf8")),
          text: async () => body.toString("utf8")
        });
      });
    });
    request2.on("error", reject);
    if (init?.body !== void 0 && init?.body !== null && init?.body !== "") request2.write(init.body);
    request2.end();
  });
}
function customURL(spec) {
  const base = new URL(spec.baseURL);
  const providerBase = nonEmptyString(spec.providerBaseURL) === null ? null : new URL(spec.providerBaseURL);
  if (base.protocol !== "https:" && spec.monitor.allowInsecure !== true) throw statusError("unsupported", "custom monitor requires HTTPS");
  if (privateHostname(base.hostname) && spec.monitor.allowPrivateNetwork !== true) throw statusError("unsupported", "custom monitor private-network access requires allowPrivateNetwork");
  if (providerBase !== null && base.origin !== providerBase.origin && spec.monitor.allowCrossOrigin !== true) throw statusError("unsupported", "custom monitor cross-origin access requires allowCrossOrigin");
  const url = new URL(spec.monitor.request.path, base);
  if (url.origin !== base.origin) throw statusError("unsupported", "custom monitor request must stay on its configured origin");
  return url.href;
}
function customHeaders(spec, credential) {
  const headers = { accept: "application/json" };
  for (const [name2, value] of Object.entries(spec.monitor.request.headers ?? {})) {
    if (!SENSITIVE_HEADERS.has(name2.toLowerCase()) && typeof value === "string") headers[name2] = value;
  }
  const type = spec.monitor.request.auth?.type;
  if (credential !== "") {
    if (type === "bearer") headers.authorization = `Bearer ${credential}`;
    if (type === "raw") headers.authorization = credential;
    if (type === "x-api-key") headers["x-api-key"] = credential;
  }
  return headers;
}
function balanceAlert(balance, warning) {
  const remaining = numberOrNull2(balance?.remaining);
  const warnBelow = numberOrNull2(warning?.warnBelow);
  const criticalBelow = numberOrNull2(warning?.criticalBelow);
  if (remaining !== null && (warnBelow !== null || criticalBelow !== null)) {
    if (criticalBelow !== null && remaining <= criticalBelow) return { level: "critical", metric: "balance", value: remaining, threshold: criticalBelow };
    if (warnBelow !== null && remaining <= warnBelow) return { level: "warning", metric: "balance", value: remaining, threshold: warnBelow };
    return { level: "normal", metric: "balance", value: remaining };
  }
  const total = numberOrNull2(balance?.total);
  if (remaining !== null && total !== null && total > 0) {
    const value = round12(Math.max(0, Math.min(100, remaining / total * 100)));
    return { level: value <= 10 ? "critical" : value <= 30 ? "warning" : "normal", metric: "remaining-percent", value };
  }
  return { level: "unknown", metric: "balance", value: remaining };
}
function subscriptionAlert(windows) {
  const remaining = windows.map((entry) => numberOrNull2(entry.remainingPercent)).filter((value2) => value2 !== null);
  if (remaining.length === 0) return { level: "unknown", metric: "remaining-percent", value: null };
  const value = round12(Math.min(...remaining));
  return { level: value <= 10 ? "critical" : value <= 30 ? "warning" : "normal", metric: "remaining-percent", value };
}
function baseSnapshot(spec, status2, now) {
  return {
    id: spec.id,
    displayName: spec.displayName,
    mode: spec.mode ?? "balance",
    adapter: spec.adapter,
    status: status2,
    fetchedAt: now
  };
}
function unavailableSnapshot(spec, status2, now, extra = {}) {
  const base = baseSnapshot(spec, status2, now);
  if (base.mode === "subscription") return { ...base, windows: [], alert: subscriptionAlert([]), ...extra };
  return { ...base, balance: null, alert: { level: "unknown", metric: "balance", value: null }, ...extra };
}
async function queryBuiltInBalance(spec, credential, deps, now) {
  const scheme = schemeOfAdapter(spec.adapter);
  const raw = await queryBalance(scheme, spec.baseURL, credential, deps.timeoutMs ?? DEFAULT_TIMEOUT_MS2, deps.fetch ?? fetch);
  const remaining = numberOrNull2(raw.total);
  if (remaining === null) throw statusError("invalid-response", "balance response is missing a numeric amount");
  const used = numberOrNull2(raw.used);
  const total = numberOrNull2(raw.limit);
  const balance = {
    remaining,
    ...used === null ? {} : { used },
    ...total === null ? {} : { total },
    currency: nonEmptyString(raw.currency) ?? "USD",
    unlimited: false,
    expiresAt: null,
    available: raw.isAvailable !== false,
    breakdown: {
      granted: numberOrNull2(raw.granted),
      toppedUp: numberOrNull2(raw.toppedUp)
    }
  };
  const status2 = scheme === "deepseek" && raw.isAvailable === false ? "unavailable" : "ok";
  return { ...baseSnapshot(spec, status2, now), balance, alert: balanceAlert(balance, spec.monitor.warning) };
}
async function queryGeneral(spec, credential, deps, now) {
  const body = await requestJson(new URL("/user/balance", spec.baseURL).href, {
    headers: { authorization: `Bearer ${credential}`, accept: "application/json" }
  }, deps);
  const remaining = numberOrNull2(body?.balance);
  if (remaining === null) throw statusError("invalid-response", "general balance response is missing balance");
  const balance = { remaining, currency: nonEmptyString(body?.currency) ?? "USD", unlimited: false, expiresAt: null };
  return { ...baseSnapshot(spec, "ok", now), balance, alert: balanceAlert(balance, spec.monitor.warning) };
}
async function quotaPerUnit(spec, deps) {
  try {
    const body = await requestJson(new URL("/api/status", spec.baseURL).href, { headers: { accept: "application/json" } }, deps);
    const value = numberOrNull2(body?.data?.quota_per_unit);
    if (value !== null && value > 0) return { value, fallback: false };
    return { value: 5e5, fallback: true };
  } catch (error) {
    if (error?.httpStatus === 404 || error?.httpStatus === 405) return { value: 5e5, fallback: true };
    throw error;
  }
}
async function queryNewApiFallback(spec, credentials, deps, now) {
  const ref = spec.monitor.fallbackCredentialRef;
  const token = await resolveCredential2(credentials, ref);
  if (token === "") return unavailableSnapshot(spec, "unsupported", now, { missingCredentials: ref === void 0 ? [] : [ref] });
  const headers = { authorization: `Bearer ${token}`, accept: "application/json" };
  const userId = await resolveCredential2(credentials, spec.monitor.fallbackUserIdRef);
  if (userId !== "") headers["new-api-user"] = userId;
  const [body, quotaUnit] = await Promise.all([
    requestJson(new URL("/api/user/self", spec.baseURL).href, { headers }, deps),
    quotaPerUnit(spec, deps)
  ]);
  const unit = quotaUnit.value;
  if (body?.success === false || body?.data === null || typeof body?.data !== "object") throw statusError("invalid-response", "New API user response is invalid");
  const remainingQuota = numberOrNull2(body.data.quota);
  const usedQuota = numberOrNull2(body.data.used_quota);
  if (remainingQuota === null) throw statusError("invalid-response", "New API user response is missing quota");
  const balance = {
    remaining: remainingQuota / unit,
    ...usedQuota === null ? {} : { used: usedQuota / unit, total: (remainingQuota + usedQuota) / unit },
    currency: "USD",
    unlimited: false,
    expiresAt: null
  };
  return {
    ...baseSnapshot(spec, "ok", now),
    plan: nonEmptyString(body.data.group) ?? void 0,
    balance,
    alert: balanceAlert(balance, spec.monitor.warning),
    source: "management-fallback",
    quotaUnit: unit,
    quotaUnitFallback: quotaUnit.fallback
  };
}
async function queryNewApi(spec, credentials, credential, deps, now) {
  let body;
  try {
    body = await requestJson(new URL("/api/usage/token/", spec.baseURL).href, {
      headers: { authorization: `Bearer ${credential}`, accept: "application/json" }
    }, deps);
  } catch (error) {
    if (error?.httpStatus === 404 || error?.httpStatus === 405) return queryNewApiFallback(spec, credentials, deps, now);
    throw error;
  }
  if (body?.code !== true || body?.data === null || typeof body?.data !== "object") throw statusError("invalid-response", "New API token response is invalid");
  const granted = numberOrNull2(body.data.total_granted);
  const used = numberOrNull2(body.data.total_used);
  const available = numberOrNull2(body.data.total_available);
  const quotaUnit = await quotaPerUnit(spec, deps);
  const unit = quotaUnit.value;
  const unlimited = booleanOrNull(body.data.unlimited_quota) === true;
  if (!unlimited && available === null) throw statusError("invalid-response", "New API token response is missing total_available");
  const balance = {
    remaining: available === null ? null : available / unit,
    ...used === null ? {} : { used: used / unit },
    ...granted === null ? {} : { total: granted / unit },
    currency: "USD",
    unlimited,
    expiresAt: numberOrNull2(body.data.expires_at) > 0 ? toIso2(body.data.expires_at) : null
  };
  return {
    ...baseSnapshot(spec, "ok", now),
    plan: nonEmptyString(body.data.name) ?? void 0,
    balance,
    alert: unlimited ? { level: "normal", metric: "remaining-percent", value: 100 } : balanceAlert(balance, spec.monitor.warning),
    source: "token",
    quotaUnit: unit,
    quotaUnitFallback: quotaUnit.fallback
  };
}
function amountWindow(kind, usedValue, limitValue, remainingValue, resetsAt) {
  const limit = numberOrNull2(limitValue);
  if (limit === null || limit <= 0) return null;
  const remaining = numberOrNull2(remainingValue);
  const used = numberOrNull2(usedValue) ?? (remaining === null ? null : limit - remaining);
  if (used === null) return null;
  const usedPercent = round12(Math.max(0, Math.min(100, used / limit * 100)));
  const reset = toIso2(resetsAt);
  return {
    kind,
    usedPercent,
    remainingPercent: round12(100 - usedPercent),
    ...reset === null ? {} : { resetsAt: reset }
  };
}
function sub2ApiWindowKind(value) {
  const kind = nonEmptyString(value) ?? "quota";
  if (kind === "5h") return "session";
  if (kind === "1d") return "daily";
  if (kind === "7d") return "weekly";
  return kind;
}
function sub2ApiSubscription(spec, body, now) {
  const windows = [];
  if (body.mode === "quota_limited") {
    const quota = body.quota;
    if (quota === null || typeof quota !== "object" || Array.isArray(quota)) {
      throw statusError("invalid-response", "Sub2API quota response is missing quota");
    }
    const total = amountWindow("quota", quota.used, quota.limit, quota.remaining, body.expires_at);
    if (total !== null) windows.push(total);
    for (const entry of Array.isArray(body.rate_limits) ? body.rate_limits : []) {
      if (entry === null || typeof entry !== "object" || Array.isArray(entry)) continue;
      const window = amountWindow(sub2ApiWindowKind(entry.window), entry.used, entry.limit, entry.remaining, entry.reset_at);
      if (window !== null) windows.push(window);
    }
  } else {
    const subscription = body.subscription;
    if (subscription === null || typeof subscription !== "object" || Array.isArray(subscription)) {
      throw statusError("invalid-response", "Sub2API subscription response is missing subscription limits");
    }
    for (const period of ["daily", "weekly", "monthly"]) {
      const window = amountWindow(
        period,
        subscription[`${period}_usage_usd`],
        subscription[`${period}_limit_usd`],
        null,
        null
      );
      if (window !== null) windows.push(window);
    }
  }
  if (windows.length === 0) throw statusError("invalid-response", "Sub2API response has no usable quota windows");
  return {
    ...baseSnapshot(spec, "ok", now),
    mode: "subscription",
    plan: nonEmptyString(body.planName) ?? nonEmptyString(body.plan_name) ?? "Sub2API",
    windows,
    alert: subscriptionAlert(windows)
  };
}
async function querySub2Api(spec, credential, deps, now) {
  const body = await requestJson(new URL("/v1/usage", spec.baseURL).href, {
    headers: { authorization: `Bearer ${credential}`, accept: "application/json" }
  }, deps);
  if (body === null || typeof body !== "object" || Array.isArray(body)) throw statusError("invalid-response", "Sub2API response must be an object");
  if (body.isValid === false || body.is_active === false) throw statusError("unauthorized", "Sub2API key is invalid");
  const hasSubscription = body.subscription !== null && typeof body.subscription === "object" && !Array.isArray(body.subscription);
  if (body.mode === "quota_limited" || hasSubscription) return sub2ApiSubscription(spec, body, now);
  const remaining = numberOrNull2(body.balance ?? body.remaining);
  if (remaining === null) throw statusError("invalid-response", "Sub2API response is missing a numeric balance");
  const balance = {
    remaining,
    currency: nonEmptyString(body.unit) ?? "USD",
    unlimited: false,
    expiresAt: toIso2(body.expires_at)
  };
  return {
    ...baseSnapshot(spec, "ok", now),
    mode: "balance",
    plan: nonEmptyString(body.planName) ?? nonEmptyString(body.plan_name) ?? void 0,
    balance,
    alert: balanceAlert(balance, spec.monitor.warning)
  };
}
function customBalance(spec, body, now) {
  const extract = spec.monitor.extract;
  const root = jsonPointer(body, extract.root ?? "");
  if (root === void 0) throw statusError("invalid-response", "custom response root is missing");
  const valid = mapped(root, extract.valid);
  if (valid === false) throw statusError("invalid-response", String(mapped(root, extract.invalidMessage) ?? "custom response is marked invalid"));
  const divisor = numberOrNull2(extract.divisor) ?? 1;
  const remainingRaw = numberOrNull2(mapped(root, extract.remaining) ?? mapped(root, extract.total));
  if (remainingRaw === null) throw statusError("invalid-response", "custom response is missing a numeric balance");
  const usedRaw = numberOrNull2(mapped(root, extract.used));
  const totalRaw = numberOrNull2(mapped(root, extract.total));
  const balance = {
    remaining: remainingRaw / divisor,
    ...usedRaw === null ? {} : { used: usedRaw / divisor },
    ...totalRaw === null ? {} : { total: totalRaw / divisor },
    currency: nonEmptyString(mapped(root, extract.currency)) ?? nonEmptyString(extract.currencyValue) ?? "USD",
    unlimited: booleanOrNull(mapped(root, extract.unlimited)) === true,
    expiresAt: toIso2(mapped(root, extract.expiresAt))
  };
  return { ...baseSnapshot(spec, "ok", now), plan: nonEmptyString(mapped(root, extract.plan)) ?? void 0, balance, alert: balanceAlert(balance, spec.monitor.warning) };
}
function customSubscription(spec, body, now) {
  const extract = spec.monitor.extract;
  const root = jsonPointer(body, extract.root ?? "");
  const items = mapped(root, extract.items);
  if (!Array.isArray(items)) throw statusError("invalid-response", "custom response items must be an array");
  const windows = [];
  for (const item of items) {
    const used = numberOrNull2(mapped(item, extract.usedPercent));
    const remaining = numberOrNull2(mapped(item, extract.remainingPercent));
    if (used === null && remaining === null) continue;
    const usedPercent = round12(Math.max(0, Math.min(100, used ?? 100 - remaining)));
    const remainingPercent = round12(Math.max(0, Math.min(100, remaining ?? 100 - used)));
    windows.push({
      kind: nonEmptyString(mapped(item, extract.kind)) ?? "quota",
      usedPercent,
      remainingPercent,
      ...toIso2(mapped(item, extract.resetsAt)) === null ? {} : { resetsAt: toIso2(mapped(item, extract.resetsAt)) }
    });
  }
  if (windows.length === 0) throw statusError("invalid-response", "custom response has no usable quota windows");
  return { ...baseSnapshot(spec, "ok", now), plan: nonEmptyString(mapped(root, extract.plan)) ?? void 0, windows, alert: subscriptionAlert(windows) };
}
async function queryDeclarative(spec, credentials, deps, now) {
  const ref = spec.monitor.request.auth?.credentialRef ?? spec.apiKeyRef;
  const credential = await resolveCredential2(credentials, ref);
  if (spec.monitor.request.auth !== void 0 && credential === "") return unavailableSnapshot(spec, "not-configured", now, { missingCredentials: ref === void 0 ? [] : [ref] });
  const body = await requestJson(customURL(spec), { method: "GET", headers: customHeaders(spec, credential) }, deps);
  return spec.mode === "subscription" ? customSubscription(spec, body, now) : customBalance(spec, body, now);
}
function decodeJwtPayload(token) {
  const parts = String(token).split(".");
  if (parts.length < 2) return null;
  let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  try {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}
function pkceChallenge(verifier) {
  return createHash2("sha256").update(verifier).digest("base64url");
}
function redirectLocation(response) {
  const direct = response?.headers?.get?.("location");
  if (typeof direct === "string" && direct !== "") return direct;
  if (typeof response?.headers?.location === "string" && response.headers.location !== "") return response.headers.location;
  return null;
}
function createCookieJar() {
  const jars = /* @__PURE__ */ new Map();
  function capture(response, url) {
    const setCookies = response?.headers?.getSetCookie?.();
    if (!Array.isArray(setCookies) || setCookies.length === 0) return;
    const host = new URL(url).hostname;
    if (!jars.has(host)) jars.set(host, /* @__PURE__ */ new Map());
    const jar = jars.get(host);
    for (const entry of setCookies) {
      const pair = String(entry).split(";")[0];
      const eq = pair.indexOf("=");
      if (eq <= 0) continue;
      jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
    }
  }
  function cookieHeader(url) {
    const jar = jars.get(new URL(url).hostname);
    if (jar === void 0 || jar.size === 0) return null;
    return [...jar.entries()].map(([name2, value]) => `${name2}=${value}`).join("; ");
  }
  return { capture, cookieHeader };
}
async function requestRaw(url, init, deps, jar = null) {
  const headers = { ...init?.headers ?? {} };
  const cookie = jar === null ? null : jar.cookieHeader(url);
  if (cookie !== null && cookie !== void 0 && cookie !== "") headers.cookie = cookie;
  const response = await (deps.fetch ?? fetch)(url, {
    ...init,
    headers,
    redirect: "manual",
    signal: AbortSignal.timeout(deps.timeoutMs ?? DEFAULT_TIMEOUT_MS2)
  });
  if (jar !== null) jar.capture(response, url);
  return response;
}
async function sensenovaLogin(username, password, deps) {
  const verifier = randomToken();
  const state = randomToken();
  const jar = createCookieJar();
  const authorize = new URL(SENSENOVA_AUTHORIZE);
  authorize.searchParams.set("client_id", SENSENOVA_CLIENT_ID);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("redirect_uri", SENSENOVA_REDIRECT_URI);
  authorize.searchParams.set("scope", SENSENOVA_SCOPE);
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("code_challenge", pkceChallenge(verifier));
  authorize.searchParams.set("code_challenge_method", "S256");
  const authorizeResponse = await requestRaw(authorize.href, { method: "GET" }, deps, jar);
  const loginLocation = redirectLocation(authorizeResponse);
  if (loginLocation === null) throw statusError("invalid-response", "SenseNova login flow did not redirect to a login challenge");
  const loginChallenge = new URL(loginLocation).searchParams.get("login_challenge");
  if (loginChallenge === null) throw statusError("invalid-response", "SenseNova login flow did not include a login challenge");
  const challengeCheck = await requestJson(`${SENSENOVA_IAM}/iam/authn/v1/auth/checkChallenge?challenge=${encodeURIComponent(loginChallenge)}`, { method: "GET", headers: { accept: "application/json" } }, deps);
  if (challengeCheck?.is_valid !== true) throw statusError("invalid-response", "SenseNova login challenge is invalid");
  const loginBody = JSON.stringify({ username, password, challenge: loginChallenge });
  const loginResponse = await requestJson(`${SENSENOVA_IAM}/iam/authn/v1/auth/nova/login`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: loginBody
  }, deps);
  const next = nonEmptyString(loginResponse?.redirect);
  if (next === null) throw statusError("invalid-response", "SenseNova login response is missing a redirect");
  let code = null;
  let cursor = next;
  for (let hop = 0; hop < 6 && code === null; hop++) {
    const candidate = new URL(cursor).searchParams.get("code");
    if (candidate !== null) {
      code = candidate;
      break;
    }
    const response = await requestRaw(cursor, { method: "GET" }, deps, jar);
    const location = redirectLocation(response);
    if (location === null) break;
    cursor = new URL(location, cursor).href;
  }
  if (code === null) throw statusError("invalid-response", "SenseNova login flow did not produce an authorization code");
  const tokenResponse = await requestJson(`${SENSENOVA_ISSUER}/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SENSENOVA_REDIRECT_URI,
      client_id: SENSENOVA_CLIENT_ID,
      code_verifier: verifier
    }).toString()
  }, deps);
  const accessToken = nonEmptyString(tokenResponse?.access_token);
  if (accessToken === null) throw statusError("invalid-response", "SenseNova token response is missing access_token");
  const refreshToken = nonEmptyString(tokenResponse?.refresh_token) ?? "";
  const payload = decodeJwtPayload(accessToken);
  const expiresAt = payload?.exp !== void 0 ? Number(payload.exp) * 1e3 : (deps.now ?? Date.now)() + (numberOrNull2(tokenResponse?.expires_in) ?? 10800) * 1e3;
  return { accessToken, refreshToken, expiresAt };
}
async function sensenovaRefresh(refreshToken, deps) {
  const tokenResponse = await requestJson(`${SENSENOVA_ISSUER}/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: SENSENOVA_CLIENT_ID,
      refresh_token: refreshToken
    }).toString()
  }, deps);
  const accessToken = nonEmptyString(tokenResponse?.access_token);
  if (accessToken === null) throw statusError("invalid-response", "SenseNova refresh response is missing access_token");
  const payload = decodeJwtPayload(accessToken);
  const expiresAt = payload?.exp !== void 0 ? Number(payload.exp) * 1e3 : (deps.now ?? Date.now)() + (numberOrNull2(tokenResponse?.expires_in) ?? 10800) * 1e3;
  return { accessToken, refreshToken: nonEmptyString(tokenResponse?.refresh_token) ?? refreshToken, expiresAt };
}
async function senseNovaAccessToken(spec, credentials, deps, now) {
  const direct = await resolveCredential2(credentials, SENSENOVA_CONSOLE_TOKEN_REF);
  if (direct !== "") return { accessToken: direct, expiresAt: Number.MAX_SAFE_INTEGER };
  const username = await resolveCredential2(credentials, SENSENOVA_USERNAME_REF);
  const password = await resolveCredential2(credentials, SENSENOVA_PASSWORD_REF);
  const missing = [
    username === "" ? SENSENOVA_USERNAME_REF : void 0,
    password === "" ? SENSENOVA_PASSWORD_REF : void 0
  ].filter((ref) => ref !== void 0);
  if (missing.length > 0) {
    sensenovaTokenCache.delete(spec.id);
    return { error: "not-configured", missingCredentials: missing };
  }
  const cached = sensenovaTokenCache.get(spec.id);
  if (cached !== void 0 && cached.expiresAt - now > SENSENOVA_TOKEN_SKEW_MS) return cached;
  if (cached !== void 0 && cached.refreshToken !== "") {
    try {
      const token2 = await sensenovaRefresh(cached.refreshToken, deps);
      sensenovaTokenCache.set(spec.id, token2);
      return token2;
    } catch (error) {
    }
  }
  const token = await sensenovaLogin(username, password, deps);
  sensenovaTokenCache.set(spec.id, token);
  return token;
}
var SENSENOVA_TOKENPLAN_USAGE = `${SENSENOVA_PLATFORM_ORIGIN}/lite/console/v1/tokenplan/pool-usage`;
async function querySenseNovaPools(accessToken, spec, deps, now) {
  const body = await requestJson(SENSENOVA_TOKENPLAN_USAGE, { method: "GET", headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" } }, deps);
  const pools = Array.isArray(body?.pools) ? body.pools : null;
  if (pools === null || pools.length === 0) throw statusError("invalid-response", "SenseNova pool usage response is missing pools");
  const windows = [];
  for (const pool of pools) {
    if (pool === null || typeof pool !== "object" || Array.isArray(pool)) continue;
    const poolName = nonEmptyString(pool.name) ?? "\u79EF\u5206\u6C60";
    const poolType = nonEmptyString(pool.pool_type) ?? "default";
    const modelCount = Array.isArray(pool.model_ids) ? pool.model_ids.length : 0;
    const grantBalance = numberOrNull2(pool.grant_balance);
    const grantExpiryRaw = numberOrNull2(pool.nearest_grant_expiry);
    const grantExpiryAt = grantExpiryRaw !== null && grantExpiryRaw > 0 ? toIso2(grantExpiryRaw) : null;
    for (const [winKey, winType, winLabel] of [["window_5h", "5h", "5h \u7A97\u53E3"], ["window_7d", "7d", "7\u5929\u7A97\u53E3"]]) {
      const w = pool[winKey];
      if (w === null || typeof w !== "object" || Array.isArray(w)) continue;
      const limit = numberOrNull2(w?.limit);
      const used = numberOrNull2(w?.used);
      const remaining = numberOrNull2(w?.remaining);
      if (limit === null || limit <= 0 || used === null || remaining === null) continue;
      const resetsAt = toIso2(numberOrNull2(w?.reset_at));
      windows.push({
        kind: `${poolName} \xB7 ${winLabel}`,
        usedPercent: round12(Math.max(0, Math.min(100, used / limit * 100))),
        remainingPercent: round12(Math.max(0, Math.min(100, remaining / limit * 100))),
        ...resetsAt === null ? {} : { resetsAt },
        // 积分制扩展字段：池名/池类型/窗口类型/积分绝对值/模型数/活动积分。
        poolName,
        poolType,
        windowType: winType,
        limit,
        used,
        remaining,
        modelCount,
        ...grantBalance === null ? {} : { grantBalance },
        ...grantExpiryAt === null ? {} : { grantExpiryAt }
      });
    }
  }
  if (windows.length === 0) throw statusError("invalid-response", "SenseNova pool usage response has no usable quota windows");
  return { ...baseSnapshot(spec, "ok", now), plan: nonEmptyString(body?.plan?.name) ?? "Token Plan", windows, alert: subscriptionAlert(windows) };
}
async function querySenseNovaLegacy(accessToken, spec, deps, now) {
  const payload = decodeJwtPayload(accessToken);
  const tenantId = nonEmptyString(payload?.ext?.tenant_id) ?? nonEmptyString(payload?.tenant_id);
  if (tenantId === null) throw statusError("invalid-response", "SenseNova token does not contain tenant_id");
  const url = `${SENSENOVA_PLATFORM_ORIGIN}/lite/console/v1/user/coding-plan/usages?account_id=${encodeURIComponent(tenantId)}`;
  const body = await requestJson(url, { method: "GET", headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" } }, deps);
  if (body === null || typeof body !== "object" || Array.isArray(body)) throw statusError("invalid-response", "SenseNova usage response must be an object");
  const pct = body.model_remaining_percent;
  if (pct === null || typeof pct !== "object" || Array.isArray(pct)) throw statusError("invalid-response", "SenseNova usage response is missing model_remaining_percent");
  const windows = [];
  for (const [kind, raw] of Object.entries(pct)) {
    const rem = numberOrNull2(raw);
    if (rem === null) continue;
    const remainingPercent = round12(Math.max(0, Math.min(100, rem)));
    windows.push({
      kind: nonEmptyString(kind) ?? "unknown",
      usedPercent: round12(Math.max(0, Math.min(100, 100 - remainingPercent))),
      remainingPercent
    });
  }
  if (windows.length === 0) throw statusError("invalid-response", "SenseNova usage response has no usable quota windows");
  return { ...baseSnapshot(spec, "ok", now), plan: "Token Plan", windows, alert: subscriptionAlert(windows) };
}
async function querySenseNova(spec, credentials, deps, now) {
  const token = await senseNovaAccessToken(spec, credentials, deps, now);
  if (token.error === "not-configured") return unavailableSnapshot(spec, "not-configured", now, { missingCredentials: token.missingCredentials });
  try {
    return await querySenseNovaPools(token.accessToken, spec, deps, now);
  } catch (error) {
    if (error?.providerStatus !== "unsupported") throw error;
    return await querySenseNovaLegacy(token.accessToken, spec, deps, now);
  }
}
async function queryAccount(spec, credentials, deps = {}) {
  const now = (deps.now ?? Date.now)();
  if (spec === null || spec === void 0 || spec.adapter === null || spec.mode === null) return unavailableSnapshot(spec ?? { id: "unknown", displayName: "Unknown", adapter: null, mode: "balance" }, "unsupported", now);
  try {
    const safeDeps = deps.fetch === void 0 ? { ...deps, fetch: (url, init) => pinnedFetch(url, init, spec, deps) } : deps;
    if (spec.adapter === "declarative") return await queryDeclarative(spec, credentials, safeDeps, now);
    const credential = await resolveCredential2(credentials, spec.apiKeyRef);
    if (spec.adapter !== "opencode-go" && spec.adapter !== "sensenova-token-plan" && credential === "") return unavailableSnapshot(spec, "not-configured", now, { missingCredentials: spec.apiKeyRef === void 0 ? [] : [spec.apiKeyRef] });
    if (schemeOfAdapter(spec.adapter) !== null) return await queryBuiltInBalance(spec, credential, safeDeps, now);
    if (spec.adapter === "general") return await queryGeneral(spec, credential, safeDeps, now);
    if (spec.adapter === "new-api") return await queryNewApi(spec, credentials, credential, safeDeps, now);
    if (spec.adapter === "sub2api") return await querySub2Api(spec, credential, safeDeps, now);
    if (spec.adapter === "sensenova-token-plan") return await querySenseNova(spec, credentials, safeDeps, now);
    const subscriptionId = spec.adapter === "zai-token-plan" ? "zai" : spec.adapter === "kimi-token-plan" ? "kimi" : spec.adapter === "minimax-token-plan" ? "minimax" : "opencode-go";
    const provider = await collectSubscription(subscriptionId, credentials, {
      apiKeyRef: spec.apiKeyRef,
      region: spec.monitor.region ?? (spec.adapter === "zai-token-plan" && String(spec.baseURL ?? "").includes("bigmodel.cn") ? "bigmodel-cn" : void 0) ?? (spec.adapter === "minimax-token-plan" && String(spec.baseURL ?? "").includes("minimaxi.com") ? "cn" : void 0),
      baseURL: spec.monitor.usageBaseURL
    }, safeDeps);
    const windows = Array.isArray(provider.windows) ? provider.windows : [];
    return { ...baseSnapshot(spec, provider.status, now), plan: provider.plan, windows, alert: subscriptionAlert(windows), ...provider.missingCredentials === void 0 ? {} : { missingCredentials: provider.missingCredentials } };
  } catch (error) {
    return unavailableSnapshot(spec, statusOf(error), now);
  }
}
function isTransient(status2) {
  return status2 === "unavailable" || status2 === "rate-limited" || status2 === "invalid-response";
}
function withStaleData(previous, current) {
  if (previous?.status !== "ok" || !isTransient(current.status)) return current;
  return {
    ...previous,
    status: current.status,
    fetchedAt: current.fetchedAt,
    lastSuccessAt: previous.lastSuccessAt ?? previous.fetchedAt,
    stale: true
  };
}
function createAccountService({ credentials, getProviders, config = { monitors: {} }, deps = {} }) {
  const cache2 = /* @__PURE__ */ new Map();
  const inflight2 = /* @__PURE__ */ new Map();
  const refreshMs = deps.refreshMs ?? DEFAULT_REFRESH_MS;
  async function specs() {
    const providers = [...await getProviders()];
    if (deps.includeLegacyProviders !== false) {
      if (!providers.some((provider) => provider.id === "opencode-go")) providers.push({ id: "opencode-go", displayName: "OpenCode Go", apiKeyEnv: "OPENCODE_GO_API_KEY" });
      if (!providers.some((provider) => provider.id === "zai" || provider.id === "zai-coding-cn")) providers.push({ id: "zai", displayName: "Z.ai", apiKeyEnv: "ZAI_API_KEY", baseURL: "https://api.z.ai" });
    }
    const known = new Set(providers.map((provider) => provider.id));
    const unknown = Object.keys(config.monitors ?? {}).filter((providerId) => !known.has(providerId));
    if (unknown.length > 0) throw new Error(`account monitor references unknown provider: ${unknown.join(", ")}`);
    return providers.map((provider) => resolveAccountSpec(provider, config));
  }
  async function specById(providerId) {
    return (await specs()).find((spec) => spec.id === providerId) ?? null;
  }
  async function refresh(spec) {
    const existing = inflight2.get(spec.id);
    if (existing !== void 0) return existing;
    const promise = queryAccount(spec, credentials, deps).then((current) => {
      const next = withStaleData(cache2.get(spec.id)?.account, current);
      cache2.set(spec.id, { configKey: spec.configKey, account: next });
      return next;
    }).finally(() => inflight2.delete(spec.id));
    inflight2.set(spec.id, promise);
    return promise;
  }
  async function get(providerId, { force = false } = {}) {
    const spec = await specById(providerId);
    if (spec === null) return null;
    const hit = cache2.get(providerId);
    const age = (deps.now ?? Date.now)() - (hit?.account?.fetchedAt ?? 0);
    if (!force && hit?.configKey === spec.configKey && age >= 0 && age < refreshMs) return hit.account;
    return refresh(spec);
  }
  async function refreshAll() {
    const all = await specs();
    return Promise.all(all.filter((spec) => spec.adapter !== null).map(refresh));
  }
  async function providerViews() {
    return Promise.all((await specs()).map(async (spec) => {
      const account = cache2.get(spec.id)?.account;
      const credentialConfigured = account === void 0 && spec.apiKeyRef !== void 0 ? await resolveCredential2(credentials, spec.apiKeyRef) !== "" : false;
      return {
        id: spec.id,
        displayName: spec.displayName,
        accountMode: account?.mode ?? spec.mode,
        adapter: spec.adapter,
        configured: account === void 0 ? credentialConfigured : account.status !== "not-configured",
        status: account?.status ?? "pending",
        fetchedAt: account?.fetchedAt ?? null,
        alert: account?.alert ?? null
      };
    }));
  }
  async function subscriptionAccounts() {
    const all = await specs();
    const accounts = await Promise.all(all.filter((spec) => spec.mode === "subscription" || spec.adapter === "sub2api").map((spec) => get(spec.id)));
    return accounts.filter((account) => account?.mode === "subscription");
  }
  return {
    get,
    refreshAll,
    providerViews,
    subscriptionAccounts,
    validate: async () => {
      await specs();
    },
    cached: (providerId) => cache2.get(providerId)?.account ?? null
  };
}
var ACCOUNT_REFRESH_MS = DEFAULT_REFRESH_MS;

// vendor/usage-skill/deepseek-billing.js
var import_yauzl = __toESM(require_yauzl(), 1);
var EXPORT_ORIGIN = "https://platform.deepseek.com";
var EXPORT_PATH = "/api/v0/usage/export";
var TIMEOUT_MS = 15e3;
var TOKEN_REF = "DEEPSEEK_USER_TOKEN";
async function resolveToken(credentials) {
  if (credentials === null || credentials === void 0 || typeof credentials.resolve !== "function") return "";
  try {
    const value = (await credentials.resolve(TOKEN_REF))?.value;
    return typeof value === "string" && value.trim() !== "" ? value.trim() : "";
  } catch {
    return "";
  }
}
function round2(value) {
  return Math.round(value * 100) / 100;
}
function safeFloat(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
function safeInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}
function unzipEntries(buf) {
  return new Promise((resolve2, reject) => {
    const files = /* @__PURE__ */ new Map();
    import_yauzl.default.fromBuffer(buf, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
          return;
        }
        zipfile.openReadStream(entry, (err2, rs) => {
          if (err2) return reject(err2);
          const chunks = [];
          rs.on("data", (c) => chunks.push(c));
          rs.on("end", () => {
            files.set(entry.fileName, Buffer.concat(chunks).toString("utf8"));
            zipfile.readEntry();
          });
          rs.on("error", reject);
        });
      });
      zipfile.on("end", () => resolve2(files));
      zipfile.on("error", reject);
    });
  });
}
function findCsv(files, kind) {
  for (const name2 of files.keys()) {
    const base = String(name2).split("/").pop() ?? String(name2);
    if (base.includes(`${kind}-`) && base.endsWith(".csv")) return files.get(name2);
  }
  return null;
}
function parseCost(csvText, byModel) {
  const lines = String(csvText).split("\n");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;
    const cols = line.split(",");
    const model = (cols[2] ?? "").trim();
    if (model === "") continue;
    const agg = ensureModel(byModel, model);
    agg.cost += safeFloat(cols[4]);
  }
}
function parseAmount(csvText, byModel) {
  const lines = String(csvText).split("\n");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;
    const cols = line.split(",");
    const model = (cols[2] ?? "").trim();
    const type = (cols[5] ?? "").trim();
    if (model === "" || type === "") continue;
    const agg = ensureModel(byModel, model);
    const amount = safeInt(cols[7]);
    if (type === "request_count") agg.requests += amount;
    else if (type === "input_cache_hit_tokens") agg.inputCacheHitTokens += amount;
    else if (type === "input_cache_miss_tokens") agg.inputCacheMissTokens += amount;
    else if (type === "output_tokens") agg.outputTokens += amount;
  }
}
function ensureModel(byModel, model) {
  let agg = byModel.get(model);
  if (agg === void 0) {
    agg = {
      model,
      cost: 0,
      requests: 0,
      inputCacheHitTokens: 0,
      inputCacheMissTokens: 0,
      outputTokens: 0
    };
    byModel.set(model, agg);
  }
  return agg;
}
function monthTargets(nowMs, months) {
  const date = new Date(nowMs);
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const targets = [];
  for (let i = 0; i < months; i++) {
    targets.push({ year, month });
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }
  return targets;
}
async function fetchMonth(target, token, fetchImpl) {
  const url = new URL(EXPORT_PATH, EXPORT_ORIGIN);
  url.searchParams.set("month", String(target.month));
  url.searchParams.set("year", String(target.year));
  const response = await fetchImpl(url.href, {
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`usage export returned HTTP ${response.status}`);
  const files = await unzipEntries(Buffer.from(await response.arrayBuffer()));
  const costCsv = findCsv(files, "cost");
  const amountCsv = findCsv(files, "amount");
  if (costCsv === null && amountCsv === null) return null;
  const byModel = /* @__PURE__ */ new Map();
  if (costCsv !== null) parseCost(costCsv, byModel);
  if (amountCsv !== null) parseAmount(amountCsv, byModel);
  if (byModel.size === 0) return null;
  let rawTotal = 0;
  const models = [];
  for (const agg of byModel.values()) {
    rawTotal += agg.cost;
    models.push({
      model: agg.model,
      cost: round2(agg.cost),
      requests: agg.requests,
      inputCacheHitTokens: agg.inputCacheHitTokens,
      inputCacheMissTokens: agg.inputCacheMissTokens,
      outputTokens: agg.outputTokens
    });
  }
  return {
    year: target.year,
    month: target.month,
    currency: "CNY",
    totalCost: round2(rawTotal),
    models
  };
}
async function queryDeepseekBilling(credentials, options = {}) {
  const token = await resolveToken(credentials);
  if (token === "") return {
    configured: false,
    message: "\u672A\u914D\u7F6E DeepSeek \u5E73\u53F0\u767B\u5F55 Token\uFF08DEEPSEEK_USER_TOKEN\uFF09",
    fetchedAt: null,
    months: []
  };
  const nowMs = (options.now ?? Date.now)();
  const months = Math.max(1, Math.min(12, Math.trunc(options.months ?? 3) || 3));
  const fetchImpl = options.fetchImpl ?? fetch;
  const monthsOut = [];
  for (const target of monthTargets(nowMs, months)) try {
    const month = await fetchMonth(target, token, fetchImpl);
    if (month !== null) monthsOut.push(month);
  } catch {
  }
  if (monthsOut.length === 0) return {
    configured: true,
    message: "DeepSeek \u8D26\u5355\u62C9\u53D6\u5931\u8D25\uFF08Token \u53EF\u80FD\u5DF2\u5931\u6548\u6216\u8FD1\u671F\u65E0\u8D26\u5355\u6570\u636E\uFF09",
    fetchedAt: null,
    months: []
  };
  return {
    configured: true,
    message: null,
    fetchedAt: nowMs,
    months: monthsOut
  };
}

// vendor/usage-skill/index.js
var USAGE_PATH = "/api/usage-stats/usage";
var SIGNAL_PATH = "/api/usage-stats/signal";
var DAY_SESSIONS_PATH = "/api/usage-stats/day-sessions";
var BUDGET_PATH = "/api/usage-stats/budget";
var PROVIDERS_PATH = "/api/usage-stats/providers";
var BALANCE_PATH = "/api/usage-stats/balance";
var SUBSCRIPTIONS_PATH = "/api/usage-stats/subscriptions";
var ACCOUNT_PATH = "/api/usage-stats/account";
var CREDENTIALS_PATH = "/api/usage-stats/credentials";
var BILLING_PATH = "/api/usage-stats/deepseek-billing";
var UPSTREAM_TIMEOUT_MS = 15e3;
var CACHE_VERSION = 6;
var WRITABLE_CREDENTIAL_REFS = /* @__PURE__ */ new Set(["SENSENOVA_USERNAME", "SENSENOVA_PASSWORD", "SENSENOVA_CONSOLE_TOKEN", "DEEPSEEK_USER_TOKEN"]);
var DEEPSEEK_DEFAULTS = {
  apiKeyEnv: "DEEPSEEK_API_KEY",
  baseURL: "https://api.deepseek.com"
};
function json3(res, status2, value) {
  const body = JSON.stringify(value);
  res.writeHead(status2, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache"
  });
  res.end(body);
}
function isLoopbackAddress3(address) {
  if (typeof address !== "string") return false;
  const a = address.toLowerCase();
  if (a === "::1") return true;
  const ipv4 = a.startsWith("::ffff:") ? a.slice(7) : a;
  const octets = ipv4.split(".");
  return octets.length === 4 && octets[0] === "127" && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function hostNameOf3(value) {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase();
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    if (close <= 1) return null;
    const suffix = host.slice(close + 1);
    if (suffix !== "" && !/^:\d+$/.test(suffix)) return null;
    return host.slice(1, close);
  }
  const firstColon = host.indexOf(":");
  const lastColon = host.lastIndexOf(":");
  if (firstColon !== lastColon) return host;
  if (lastColon === -1) return host.replace(/\.$/, "");
  if (!/^\d+$/.test(host.slice(lastColon + 1))) return null;
  return host.slice(0, lastColon).replace(/\.$/, "");
}
function isLoopbackHostHeader(req) {
  const name2 = hostNameOf3(req.headers.host);
  return name2 === "localhost" || isLoopbackAddress3(name2);
}
function rejectForeignCaller(req, res) {
  if (req.method !== "GET") {
    res.writeHead(405, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: "method-not-allowed" }));
    return true;
  }
  const peer = req.socket?.remoteAddress;
  if (isLoopbackAddress3(peer) && isLoopbackHostHeader(req)) return false;
  json3(res, 403, { ok: false, error: "forbidden" });
  return true;
}
function rejectForeignWrite(req, res) {
  const peer = req.socket?.remoteAddress;
  if (isLoopbackAddress3(peer) && isLoopbackHostHeader(req)) return false;
  json3(res, 403, { ok: false, error: "forbidden" });
  return true;
}
function readJsonBody(req, maxBytes = 64 * 1024) {
  return new Promise((resolve2, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("request body exceeds the size limit"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve2(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("request body is not valid JSON"));
      }
    });
    req.on("error", reject);
  });
}
function cachePath() {
  const home = process.env.DSH_HOME ?? join4(homedir4(), ".dsh");
  return join4(home, "storages", "usage-stats-cache.json");
}
var loadedCache = null;
var loadPromise = null;
var inflight = null;
function serializeSession(state) {
  const days = {};
  for (const [date, entry] of state.days) {
    const models = {};
    for (const [model, buckets] of entry.models) models[model] = { ...buckets };
    days[date] = {
      totals: { ...entry.totals },
      models,
      requests: entry.requests ?? 0,
      intervals: entry.intervals ?? [],
      compacted: entry.compacted ?? 0
    };
  }
  const hours = {};
  for (const [hour, entry] of state.hours ?? []) {
    hours[hour] = {
      totals: { ...entry.totals },
      requests: entry.requests ?? 0,
      workMs: entry.workMs ?? 0
    };
  }
  return {
    kind: state.kind ?? "persisted",
    consumed: state.consumed ?? 0,
    ...state.revision === void 0 ? {} : { revision: state.revision },
    ...typeof state.title === "string" ? { title: state.title } : {},
    days,
    hours,
    lastSample: state.lastSample === null ? null : {
      key: state.lastSample.key,
      day: state.lastSample.day,
      hour: state.lastSample.hour,
      model: state.lastSample.model,
      buckets: { ...state.lastSample.buckets }
    },
    currentModel: state.currentModel,
    openSteps: state.openSteps instanceof Map ? Object.fromEntries(state.openSteps) : {}
  };
}
function parseSession(raw) {
  const state = createUsageState();
  if (raw === null || typeof raw !== "object") return state;
  state.kind = typeof raw.kind === "string" ? raw.kind : "persisted";
  state.consumed = Number.isSafeInteger(raw.consumed) ? raw.consumed : 0;
  if (typeof raw.revision === "string") state.revision = raw.revision;
  if (typeof raw.title === "string") state.title = raw.title;
  if (raw.days !== null && typeof raw.days === "object") {
    for (const [date, entry] of Object.entries(raw.days)) {
      if (entry === null || typeof entry !== "object") continue;
      const target = { totals: zeroBuckets(), models: /* @__PURE__ */ new Map(), requests: 0, intervals: [], compacted: 0 };
      const totals = entry.totals;
      if (totals !== null && typeof totals === "object") {
        target.totals.inputTokens = Number.isFinite(totals.inputTokens) ? totals.inputTokens : 0;
        target.totals.outputTokens = Number.isFinite(totals.outputTokens) ? totals.outputTokens : 0;
        target.totals.cacheReadTokens = Number.isFinite(totals.cacheReadTokens) ? totals.cacheReadTokens : 0;
        target.totals.cacheWriteTokens = Number.isFinite(totals.cacheWriteTokens) ? totals.cacheWriteTokens : 0;
      }
      if (Number.isFinite(entry.requests)) target.requests = entry.requests;
      if (Number.isFinite(entry.compacted)) target.compacted = entry.compacted;
      if (Array.isArray(entry.intervals)) {
        for (const iv of entry.intervals) {
          if (Array.isArray(iv) && iv.length >= 2 && Number.isFinite(iv[0]) && Number.isFinite(iv[1]) && iv[1] > iv[0]) {
            target.intervals.push([iv[0], iv[1]]);
          }
        }
      }
      if (entry.models !== null && typeof entry.models === "object") {
        for (const [model, buckets] of Object.entries(entry.models)) {
          if (buckets === null || typeof buckets !== "object") continue;
          target.models.set(model, {
            inputTokens: Number.isFinite(buckets.inputTokens) ? buckets.inputTokens : 0,
            outputTokens: Number.isFinite(buckets.outputTokens) ? buckets.outputTokens : 0,
            cacheReadTokens: Number.isFinite(buckets.cacheReadTokens) ? buckets.cacheReadTokens : 0,
            cacheWriteTokens: Number.isFinite(buckets.cacheWriteTokens) ? buckets.cacheWriteTokens : 0
          });
        }
      }
      state.days.set(date, target);
    }
  }
  if (raw.hours !== null && typeof raw.hours === "object") {
    for (const [hour, entry] of Object.entries(raw.hours)) {
      if (entry === null || typeof entry !== "object") continue;
      const target = { totals: zeroBuckets(), requests: 0, workMs: 0 };
      const totals = entry.totals;
      if (totals !== null && typeof totals === "object") {
        target.totals.inputTokens = Number.isFinite(totals.inputTokens) ? totals.inputTokens : 0;
        target.totals.outputTokens = Number.isFinite(totals.outputTokens) ? totals.outputTokens : 0;
        target.totals.cacheReadTokens = Number.isFinite(totals.cacheReadTokens) ? totals.cacheReadTokens : 0;
        target.totals.cacheWriteTokens = Number.isFinite(totals.cacheWriteTokens) ? totals.cacheWriteTokens : 0;
      }
      if (Number.isFinite(entry.requests)) target.requests = entry.requests;
      if (Number.isFinite(entry.workMs)) target.workMs = entry.workMs;
      state.hours.set(hour, target);
    }
  }
  if (raw.lastSample !== null && raw.lastSample !== void 0 && typeof raw.lastSample === "object" && typeof raw.lastSample.key === "string" && typeof raw.lastSample.day === "string") {
    const buckets = raw.lastSample.buckets ?? {};
    state.lastSample = {
      key: raw.lastSample.key,
      day: raw.lastSample.day,
      hour: typeof raw.lastSample.hour === "string" ? raw.lastSample.hour : void 0,
      model: typeof raw.lastSample.model === "string" ? raw.lastSample.model : "unknown",
      buckets: {
        inputTokens: Number.isFinite(buckets.inputTokens) ? buckets.inputTokens : 0,
        outputTokens: Number.isFinite(buckets.outputTokens) ? buckets.outputTokens : 0,
        cacheReadTokens: Number.isFinite(buckets.cacheReadTokens) ? buckets.cacheReadTokens : 0,
        cacheWriteTokens: Number.isFinite(buckets.cacheWriteTokens) ? buckets.cacheWriteTokens : 0
      }
    };
  }
  if (typeof raw.currentModel === "string") state.currentModel = raw.currentModel;
  if (raw.openSteps !== null && typeof raw.openSteps === "object") {
    for (const [key, time] of Object.entries(raw.openSteps)) {
      if (Number.isFinite(time)) state.openSteps.set(key, time);
    }
  }
  return state;
}
async function loadCache() {
  if (loadedCache !== null) return loadedCache;
  loadPromise ??= (async () => {
    const fresh = { version: CACHE_VERSION, sessions: {} };
    try {
      const raw = await readFile4(cachePath(), "utf8");
      const parsed = JSON.parse(raw);
      if (parsed !== null && typeof parsed === "object" && parsed.version === CACHE_VERSION && parsed.sessions !== null && typeof parsed.sessions === "object") {
        const sessions = {};
        for (const [id, entry] of Object.entries(parsed.sessions)) {
          if (typeof id === "string" && id.length > 0) sessions[id] = parseSession(entry);
        }
        return { version: CACHE_VERSION, sessions };
      }
    } catch {
    }
    return fresh;
  })();
  loadedCache = await loadPromise;
  return loadedCache;
}
async function saveCache(ctx, cache2) {
  try {
    const path = cachePath();
    await mkdir3(dirname(path), { recursive: true });
    const serialized = { version: CACHE_VERSION, sessions: {} };
    for (const [id, state] of Object.entries(cache2.sessions)) serialized.sessions[id] = serializeSession(state);
    const tmp = `${path}.tmp`;
    await writeFile3(tmp, JSON.stringify(serialized), "utf8");
    await rename3(tmp, path);
  } catch (error) {
    ctx.logger.warn(`usage-stats: saving usage cache failed: ${String(error)}`);
  }
}
function withLock(run) {
  if (inflight !== null) return inflight;
  inflight = run().finally(() => {
    inflight = null;
  });
  return inflight;
}
async function collectUsage(ctx) {
  return withLock(async () => {
    const cache2 = await loadCache();
    const live = ctx.get("sessions");
    const attached = /* @__PURE__ */ new Set();
    if (live !== void 0) {
      for (const session of live.list()) {
        attached.add(session.id);
        const state = cache2.sessions[session.id] ?? createUsageState();
        if (state.kind !== "live") {
          state.days = /* @__PURE__ */ new Map();
          state.hours = /* @__PURE__ */ new Map();
          state.openSteps = /* @__PURE__ */ new Map();
          state.lastSample = null;
          state.currentModel = null;
          state.consumed = 0;
        }
        const events = session.events !== void 0 ? session.events : typeof session.snapshotEvents === "function" ? session.snapshotEvents() : [];
        const count = events.length;
        if ((state.consumed ?? 0) < count) {
          applyUsageDelta(state, events.slice(state.consumed ?? 0));
          state.consumed = count;
        }
        state.kind = "live";
        cache2.sessions[session.id] = state;
      }
    }
    const persistence = ctx.get("sessionPersistence");
    const persistedIds = /* @__PURE__ */ new Set();
    if (persistence !== void 0) {
      let snapshots = null;
      if (typeof persistence.listSnapshots === "function") {
        try {
          snapshots = await persistence.listSnapshots();
        } catch (error) {
          ctx.logger.warn(`usage-stats: listSnapshots failed, falling back to list(): ${String(error)}`);
        }
      }
      const metas = snapshots !== null ? snapshots.map((entry) => entry.header) : await persistence.list();
      const revisionOf = /* @__PURE__ */ new Map();
      if (snapshots !== null) for (const entry of snapshots) revisionOf.set(entry.header.id, entry.revision);
      for (const meta of metas) {
        persistedIds.add(meta.id);
        if (attached.has(meta.id)) continue;
        const state = cache2.sessions[meta.id] ?? createUsageState();
        const revision = revisionOf.get(meta.id);
        const changed = state.kind !== "persisted" || revision !== void 0 && revision !== state.revision || revision === void 0;
        if (changed) {
          try {
            const wasPersisted = state.kind === "persisted";
            const fromSeq = wasPersisted ? state.consumed : 0;
            const { events } = await persistence.readFrom(meta.id, fromSeq);
            if (!wasPersisted) {
              state.days = /* @__PURE__ */ new Map();
              state.hours = /* @__PURE__ */ new Map();
              state.openSteps = /* @__PURE__ */ new Map();
              state.lastSample = null;
              state.currentModel = null;
              state.consumed = 0;
            }
            const fresh = wasPersisted ? events.filter((event) => event.seq > (state.consumed ?? 0)) : events;
            const contiguous = fresh.length === 0 ? state.consumed === 0 : fresh[0].seq === state.consumed + 1;
            if (!contiguous && state.consumed > 0) {
              state.days = /* @__PURE__ */ new Map();
              state.hours = /* @__PURE__ */ new Map();
              state.openSteps = /* @__PURE__ */ new Map();
              state.lastSample = null;
              state.currentModel = null;
              state.consumed = 0;
              const { events: allEvents } = await persistence.readFrom(meta.id, 0);
              applyUsageDelta(state, allEvents);
              state.consumed = allEvents.length > 0 ? allEvents[allEvents.length - 1].seq : 0;
            } else if (fresh.length > 0) {
              applyUsageDelta(state, fresh);
              state.consumed = fresh[fresh.length - 1].seq;
            }
            state.kind = "persisted";
            if (revision !== void 0) state.revision = revision;
          } catch (error) {
            ctx.logger.warn(`usage-stats: reading persisted session "${meta.id}" failed: ${String(error)}`);
          }
        }
        cache2.sessions[meta.id] = state;
      }
    }
    for (const id of Object.keys(cache2.sessions)) {
      if (!attached.has(id) && !persistedIds.has(id)) delete cache2.sessions[id];
    }
    const byDay = /* @__PURE__ */ new Map();
    const byHour = /* @__PURE__ */ new Map();
    for (const state of Object.values(cache2.sessions)) {
      mergeInto(byDay, state.days);
      mergeHoursInto(byHour, state.hours);
    }
    await saveCache(ctx, cache2);
    return renderUsage(byDay, byHour, Date.now());
  });
}
async function handleUsage(ctx, req, res) {
  if (rejectForeignCaller(req, res)) return;
  try {
    const result = await collectUsage(ctx);
    json3(res, 200, { ok: true, ...result });
  } catch (error) {
    ctx.logger.warn(`usage-stats: usage aggregation failed: ${String(error)}`);
    json3(res, 500, { ok: false, error: "internal", message: error instanceof Error ? error.message : String(error) });
  }
}
function budgetPath() {
  const home = process.env.DSH_HOME ?? join4(homedir4(), ".dsh");
  return join4(home, "storages", "usage-budget.json");
}
async function readBudget() {
  try {
    const raw = JSON.parse(await readFile4(budgetPath(), "utf8"));
    if (raw !== null && typeof raw === "object" && Number.isFinite(raw.budget) && raw.budget >= 0) return raw.budget;
  } catch {
  }
  return null;
}
async function writeBudget(ctx, budget) {
  try {
    const path = budgetPath();
    await mkdir3(dirname(path), { recursive: true });
    const tmp = `${path}.tmp`;
    await writeFile3(tmp, JSON.stringify({ version: 1, budget, updatedAt: Date.now() }), "utf8");
    await rename3(tmp, path);
    return true;
  } catch (error) {
    ctx.logger.warn(`usage-stats: saving budget failed: ${String(error)}`);
    return false;
  }
}
async function handleSignal(ctx, req, res) {
  if (rejectForeignCaller(req, res)) return;
  try {
    const url = new URL(req.url ?? "/", "http://x");
    const days = Math.max(7, Math.min(90, Number.parseInt(url.searchParams.get("days") ?? "30", 10) || 30));
    const result = await collectUsage(ctx);
    const [signal, budget] = [renderSignal(result.days, Date.now(), { windowDays: days }), await readBudget()];
    json3(res, 200, { ok: true, ...signal, budget });
  } catch (error) {
    ctx.logger.warn(`usage-stats: signal aggregation failed: ${String(error)}`);
    json3(res, 500, { ok: false, error: "internal", message: error instanceof Error ? error.message : String(error) });
  }
}
async function handleDaySessions(ctx, req, res) {
  if (rejectForeignCaller(req, res)) return;
  try {
    const url = new URL(req.url ?? "/", "http://x");
    const date = url.searchParams.get("date") ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      json3(res, 400, { ok: false, error: "invalid-date", message: "date must be YYYY-MM-DD" });
      return;
    }
    await collectUsage(ctx);
    const rows = await withLock(async () => {
      const cache2 = await loadCache();
      const sessions = [];
      for (const [id, state] of Object.entries(cache2.sessions)) {
        const entry = state.days.get(date);
        if (entry === void 0) continue;
        const tokens = totalTokens(entry.totals);
        if (!(tokens > 0)) continue;
        let firstAt = null;
        let lastAt = null;
        for (const interval of entry.intervals ?? []) {
          if (!Array.isArray(interval) || interval.length < 2) continue;
          if (firstAt === null || interval[0] < firstAt) firstAt = interval[0];
          if (lastAt === null || interval[1] > lastAt) lastAt = interval[1];
        }
        sessions.push({
          id,
          title: typeof state.title === "string" && state.title.length > 0 ? state.title : null,
          tokens,
          requests: entry.requests ?? 0,
          firstAt,
          lastAt
        });
      }
      sessions.sort((a, b) => b.tokens - a.tokens);
      return sessions;
    });
    json3(res, 200, { ok: true, date, sessions: rows });
  } catch (error) {
    ctx.logger.warn(`usage-stats: day-sessions failed: ${String(error)}`);
    json3(res, 500, { ok: false, error: "internal", message: error instanceof Error ? error.message : String(error) });
  }
}
async function handleBudgetGet(ctx, req, res) {
  if (rejectForeignCaller(req, res)) return;
  json3(res, 200, { ok: true, budget: await readBudget() });
}
async function handleBudgetPost(ctx, req, res) {
  if (rejectForeignWrite(req, res)) return;
  try {
    const body = await readJsonBody(req);
    const value = body?.budget;
    if (value === void 0 || value === null || value === "") {
      json3(res, 400, { ok: false, error: "invalid-budget", message: "budget must be a non-negative number" });
      return;
    }
    const budget = typeof value === "number" ? value : Number(String(value).trim().replace(/,/g, ""));
    if (!Number.isFinite(budget) || budget < 0) {
      json3(res, 400, { ok: false, error: "invalid-budget", message: "budget must be a non-negative number" });
      return;
    }
    if (!await writeBudget(ctx, budget)) {
      json3(res, 500, { ok: false, error: "internal", message: "saving the budget failed" });
      return;
    }
    json3(res, 200, { ok: true, budget });
  } catch (error) {
    ctx.logger.warn(`usage-stats: budget write failed: ${String(error)}`);
    json3(res, 500, { ok: false, error: "internal", message: error instanceof Error ? error.message : String(error) });
  }
}
async function configuredProviders(ctx) {
  const settings = ctx.get("settings");
  const providers = [];
  const deepseek = settings?.get?.("llm-deepseek");
  if (deepseek !== void 0 && deepseek !== null && typeof deepseek === "object") {
    providers.push({
      id: "deepseek-official",
      displayName: "DeepSeek",
      apiKeyEnv: typeof deepseek.apiKeyEnv === "string" ? deepseek.apiKeyEnv : DEEPSEEK_DEFAULTS.apiKeyEnv,
      baseURL: typeof deepseek.baseURL === "string" ? deepseek.baseURL : DEEPSEEK_DEFAULTS.baseURL
    });
  } else {
    providers.push({
      id: "deepseek-official",
      displayName: "DeepSeek",
      apiKeyEnv: DEEPSEEK_DEFAULTS.apiKeyEnv,
      baseURL: DEEPSEEK_DEFAULTS.baseURL
    });
  }
  const pi = settings?.get?.("llm-pi-ai");
  if (pi !== void 0 && pi !== null && typeof pi === "object" && pi.providers !== void 0 && typeof pi.providers === "object") {
    for (const [route, profile] of Object.entries(pi.providers)) {
      if (profile === null || typeof profile !== "object") continue;
      providers.push({
        id: route,
        displayName: typeof profile.displayName === "string" && profile.displayName.length > 0 ? profile.displayName : route,
        apiKeyEnv: typeof profile.apiKeyEnv === "string" ? profile.apiKeyEnv : void 0,
        baseURL: typeof profile.baseURL === "string" ? profile.baseURL : void 0
      });
    }
  }
  return providers;
}
async function handleProviders(ctx, accounts, req, res) {
  if (rejectForeignCaller(req, res)) return;
  try {
    json3(res, 200, { ok: true, providers: await accounts.providerViews() });
  } catch (error) {
    ctx.logger.warn(`usage-stats: providers enumeration failed: ${String(error)}`);
    json3(res, 500, { ok: false, error: "internal", message: error instanceof Error ? error.message : String(error) });
  }
}
async function selectedProviderId(req, accounts) {
  const url = new URL(req.url ?? "/", "http://x");
  const requested = url.searchParams.get("provider");
  if (requested !== null && requested !== "") return requested;
  const providers = await accounts.providerViews();
  return providers.find((entry) => entry.id === "deepseek-official")?.id ?? providers.find((entry) => entry.configured)?.id ?? providers[0]?.id ?? null;
}
async function handleAccount(ctx, accounts, req, res) {
  if (rejectForeignCaller(req, res)) return;
  try {
    const url = new URL(req.url ?? "/", "http://x");
    const providerId = await selectedProviderId(req, accounts);
    const account = providerId === null ? null : await accounts.get(providerId, { force: url.searchParams.get("refresh") === "1" });
    if (account === null) {
      json3(res, 200, { ok: false, error: "unknown-provider", message: `provider "${providerId}" is not configured` });
      return;
    }
    json3(res, 200, { ok: true, account });
  } catch (error) {
    ctx.logger.warn(`usage-stats: account fetch failed: ${String(error)}`);
    json3(res, 500, { ok: false, error: "internal", message: error instanceof Error ? error.message : String(error) });
  }
}
async function handleCredentials(ctx, accounts, req, res) {
  if (rejectForeignWrite(req, res)) return;
  if (req.method !== "POST") {
    res.writeHead(405, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: "method-not-allowed" }));
    return;
  }
  try {
    const body = await readJsonBody(req);
    const ref = typeof body?.ref === "string" ? body.ref.trim() : "";
    const value = typeof body?.value === "string" ? body.value : "";
    if (!WRITABLE_CREDENTIAL_REFS.has(ref)) {
      json3(res, 400, { ok: false, error: "invalid-ref", message: `credential "${ref}" is not writable from the panel` });
      return;
    }
    if (value === "") {
      json3(res, 400, { ok: false, error: "empty-value", message: "credential value must not be empty" });
      return;
    }
    const credentials = ctx.get("credentials") ?? ctx.credentials;
    if (credentials === null || credentials === void 0 || typeof credentials.set !== "function") {
      json3(res, 500, { ok: false, error: "read-only", message: "credential store is read-only" });
      return;
    }
    await credentials.set(ref, value);
    json3(res, 200, { ok: true, ref });
  } catch (error) {
    ctx.logger.warn(`usage-stats: credential write failed: ${String(error)}`);
    json3(res, 500, { ok: false, error: "internal", message: error instanceof Error ? error.message : String(error) });
  }
}
async function handleBalance(ctx, accounts, req, res) {
  if (rejectForeignCaller(req, res)) return;
  try {
    const providerId = await selectedProviderId(req, accounts);
    const account = providerId === null ? null : await accounts.get(providerId);
    if (account === null) {
      json3(res, 200, { ok: false, error: "unknown-provider", message: `provider "${providerId}" is not configured` });
      return;
    }
    if (account.mode !== "balance" || account.status === "unsupported") {
      json3(res, 200, {
        ok: false,
        error: "unsupported",
        message: `${account.displayName} has no public balance interface`,
        provider: account.id
      });
      return;
    }
    if (account.status === "not-configured") {
      json3(res, 200, {
        ok: false,
        error: "no-credential",
        message: account.missingCredentials?.[0] ?? "api key",
        provider: account.id
      });
      return;
    }
    if (account.balance === null || account.balance === void 0) {
      json3(res, 502, { ok: false, error: "failed", message: account.status });
      return;
    }
    json3(res, 200, {
      ok: true,
      provider: account.id,
      balance: {
        isAvailable: account.status === "ok" || account.stale === true,
        currency: account.balance.currency,
        total: account.balance.remaining,
        granted: account.balance.breakdown?.granted,
        toppedUp: account.balance.breakdown?.toppedUp
      },
      fetchedAt: account.fetchedAt
    });
  } catch (error) {
    ctx.logger.warn(`usage-stats: balance fetch failed: ${String(error)}`);
    json3(res, 502, { ok: false, error: "failed", message: error instanceof Error ? error.message : String(error) });
  }
}
async function handleSubscriptions(ctx, accounts, req, res) {
  if (rejectForeignCaller(req, res)) return;
  try {
    const subscriptions = (await accounts.subscriptionAccounts()).filter(Boolean).map((account) => account.adapter === "zai-token-plan" ? { ...account, id: "zai" } : account);
    json3(res, 200, { ok: true, subscriptions, fetchedAt: Date.now() });
  } catch (error) {
    ctx.logger.warn(`usage-stats: subscription usage failed: ${String(error)}`);
    json3(res, 500, { ok: false, error: "internal", message: error instanceof Error ? error.message : String(error) });
  }
}
async function handleBilling(ctx, req, res) {
  if (rejectForeignCaller(req, res)) return;
  try {
    const rawMonths = new URL(req.url ?? "/", "http://x").searchParams.get("months");
    const months = Math.max(1, Math.min(12, Number.parseInt(rawMonths ?? "3", 10) || 3));
    json3(res, 200, {
      ok: true,
      ...await queryDeepseekBilling(ctx.get("credentials") ?? ctx.credentials, { months })
    });
  } catch (error) {
    ctx.logger.warn(`usage-stats: deepseek billing failed: ${String(error)}`);
    json3(res, 500, {
      ok: false,
      error: "internal",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
function startBackgroundRefresh(ctx, accounts, deps = {}) {
  let running = false;
  let stopped = false;
  let active = Promise.resolve();
  const run = async () => {
    if (running || stopped) return;
    running = true;
    active = (async () => {
      const results = await Promise.allSettled([accounts.refreshAll(), collectUsage(ctx)]);
      for (const result of results) if (result.status === "rejected") ctx.logger.warn(`usage-stats: background refresh failed: ${String(result.reason)}`);
    })().finally(() => {
      running = false;
    });
    return active;
  };
  void run();
  const setTimer = deps.setInterval ?? setInterval;
  const clearTimer = deps.clearInterval ?? clearInterval;
  const timer = setTimer(run, deps.intervalMs ?? ACCOUNT_REFRESH_MS);
  timer?.unref?.();
  const stop = async () => {
    stopped = true;
    clearTimer(timer);
    await active;
  };
  stop.refreshNow = async () => {
    await active;
    return run();
  };
  return stop;
}
async function apply2(ctx, rawConfig = {}, deps = {}) {
  const config = validateAccountConfig(rawConfig);
  const accounts = deps.accounts ?? createAccountService({
    credentials: ctx.get("credentials") ?? ctx.credentials,
    getProviders: () => configuredProviders(ctx),
    config,
    deps: { timeoutMs: UPSTREAM_TIMEOUT_MS }
  });
  await accounts.validate();
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: USAGE_PATH,
    handler: (req, res) => handleUsage(ctx, req, res)
  }), "usage-stats: usage route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: SIGNAL_PATH,
    handler: (req, res) => handleSignal(ctx, req, res)
  }), "usage-stats: signal route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: DAY_SESSIONS_PATH,
    handler: (req, res) => handleDaySessions(ctx, req, res)
  }), "usage-stats: day-sessions route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: BUDGET_PATH,
    handler: (req, res) => {
      if (req.method === "POST") return handleBudgetPost(ctx, req, res);
      return handleBudgetGet(ctx, req, res);
    }
  }), "usage-stats: budget route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: PROVIDERS_PATH,
    handler: (req, res) => handleProviders(ctx, accounts, req, res)
  }), "usage-stats: providers route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: ACCOUNT_PATH,
    handler: (req, res) => handleAccount(ctx, accounts, req, res)
  }), "usage-stats: account route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: CREDENTIALS_PATH,
    handler: (req, res) => handleCredentials(ctx, accounts, req, res)
  }), "usage-stats: credentials route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: BALANCE_PATH,
    handler: (req, res) => handleBalance(ctx, accounts, req, res)
  }), "usage-stats: balance route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: SUBSCRIPTIONS_PATH,
    handler: (req, res) => handleSubscriptions(ctx, accounts, req, res)
  }), "usage-stats: subscriptions route");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: BILLING_PATH,
    handler: (req, res) => handleBilling(ctx, req, res)
  }), "usage-stats: deepseek-billing route");
  if (deps.disableBackgroundRefresh !== true) ctx.effect(() => startBackgroundRefresh(ctx, accounts), "usage-stats: background account refresh");
  if (deps.disableSkills !== true) await apply(ctx);
}

// src/automation/index.ts
import { existsSync as existsSync2, mkdirSync as mkdirSync3, readFileSync as readFileSync4, writeFileSync as writeFileSync3 } from "node:fs";
import { dirname as dirname3, join as join8 } from "node:path";

// src/automation/store.ts
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync as readFileSync2, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname as dirname2, join as join5 } from "node:path";
import { homedir as homedir5 } from "node:os";

// src/automation/types.ts
var AUTOMATION_SCHEMA_VERSION = 1;
var CodedError = class extends Error {
  code;
  status;
  constructor(message, code, status2 = 409) {
    super(message);
    this.name = "CodedError";
    this.code = code;
    this.status = status2;
  }
};
function normalizeModelRef(model) {
  if (model === null || model === void 0 || model === "") return "";
  if (typeof model === "string") {
    const value = model.trim();
    if (value === "") return "";
    const slash = value.indexOf("/");
    if (slash > 0 && slash < value.length - 1) {
      return { id: value.slice(slash + 1), provider: value.slice(0, slash) };
    }
    return { id: value };
  }
  if (typeof model === "object") {
    const raw = model;
    const id = typeof raw.id === "string" ? raw.id.trim() : "";
    if (id === "") return "";
    const provider = typeof raw.provider === "string" ? raw.provider.trim() : "";
    return provider !== "" ? { id, provider } : { id };
  }
  return "";
}
function normalizeJob(job) {
  return {
    ...job,
    schedule: job.type === "every" ? Math.max(MIN_EVERY_INTERVAL_MS, typeof job.schedule === "number" ? job.schedule : Number.parseInt(String(job.schedule), 10) || MIN_EVERY_INTERVAL_MS) : job.schedule,
    model: normalizeModelRef(job.model),
    schemaVersion: Number.isInteger(job.schemaVersion) && job.schemaVersion > AUTOMATION_SCHEMA_VERSION ? job.schemaVersion : AUTOMATION_SCHEMA_VERSION,
    configRevision: Number.isSafeInteger(job.configRevision) && job.configRevision > 0 ? job.configRevision : 1,
    consecutiveErrors: Number.isFinite(job.consecutiveErrors) ? job.consecutiveErrors : 0
  };
}
var MIN_EVERY_INTERVAL_MS = 6e4;
function deriveJobLabel({ label, prompt }) {
  if (typeof label === "string" && label.trim() !== "") return label.trim();
  if (typeof prompt === "string" && prompt.trim() !== "") return prompt.slice(0, 30);
  return "";
}

// src/automation/store.ts
function automationLegacyRoot() {
  const dshHome2 = process.env.DSH_HOME ?? join5(homedir5(), ".dsh");
  return join5(dshHome2, "automation", "dsh-webui");
}
function automationDataRoot() {
  const dshHome2 = process.env.DSH_HOME ?? join5(homedir5(), ".dsh");
  return join5(dshHome2, "automation", "dsh-triad");
}
function migrateLegacyAutomationData() {
  try {
    const next = automationDataRoot();
    const legacy = automationLegacyRoot();
    if (next === legacy) return;
    if (existsSync(join5(next, "cron-jobs.json"))) return;
    if (!existsSync(join5(legacy, "cron-jobs.json"))) return;
    mkdirSync(next, { recursive: true });
    copyDirRecursive(legacy, next);
  } catch {
  }
}
function copyDirRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const from = join5(src, entry);
    const to = join5(dest, entry);
    if (existsSync(to)) continue;
    const stat2 = statSync(from);
    if (stat2.isDirectory()) copyDirRecursive(from, to);
    else if (stat2.isFile()) copyFileSync(from, to);
  }
}
var BACKOFF_MS = [0, 6e4, 3e5, 9e5, 36e5];
var RUNS_TRIM_OVER = 500;
var RUNS_TRIM_KEEP = 300;
var UPDATE_ALLOWED = /* @__PURE__ */ new Set(["label", "model", "schedule", "prompt", "enabled", "type"]);
var VALID_TYPES = /* @__PURE__ */ new Set(["at", "every", "cron"]);
function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}
function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function parseDocument(bytes) {
  let data;
  try {
    data = JSON.parse(bytes.toString("utf-8"));
  } catch {
    throw new CodedError("\u81EA\u52A8\u5316\u4EFB\u52A1\u5B58\u50A8\u6587\u4EF6\u635F\u574F", "cron_store_corrupt", 500);
  }
  if (!isPlainObject(data) || !Array.isArray(data.jobs)) {
    throw new CodedError("\u81EA\u52A8\u5316\u4EFB\u52A1\u5B58\u50A8\u6587\u4EF6\u635F\u574F", "cron_store_corrupt", 500);
  }
  return data;
}
var CronStore = class {
  jobsPath;
  runsDir;
  /** 完整产出目录根（runs/<jobId>/<stamp>.md，由 executor 写入）。 */
  outputsDir;
  jobs = [];
  nextNum = 1;
  storeRevision = 0;
  /** 重入防护：同一时刻只允许一个 mutator。 */
  mutating = false;
  constructor(jobsPath, runsDir) {
    const root = automationDataRoot();
    this.jobsPath = jobsPath ?? join5(root, "cron-jobs.json");
    this.runsDir = runsDir ?? join5(root, "cron-runs");
    this.outputsDir = join5(root, "runs");
    this.load();
  }
  // ════════════════════════════
  //  持久化
  // ════════════════════════════
  /** 从磁盘读文档；主文件缺失/损坏时尝试用 .tmp 快照恢复。 */
  readState() {
    let bytes = null;
    try {
      bytes = readFileSync2(this.jobsPath);
    } catch {
      bytes = null;
    }
    if (bytes !== null) {
      try {
        return { doc: parseDocument(bytes), dirty: false };
      } catch (error) {
        if (!(error instanceof CodedError)) throw error;
        return { doc: this.recoverFromTmp(bytes), dirty: true };
      }
    }
    const tmpPath = this.jobsPath + ".tmp";
    if (!existsSync(tmpPath)) return null;
    return { doc: this.recoverFromTmp(null), dirty: true };
  }
  /** 用 .tmp 快照恢复：保留损坏主文件的备份后原地还原。 */
  recoverFromTmp(corruptBytes) {
    const tmpPath = this.jobsPath + ".tmp";
    let tmpBytes;
    try {
      tmpBytes = readFileSync2(tmpPath);
    } catch {
      throw new CodedError("\u81EA\u52A8\u5316\u4EFB\u52A1\u5B58\u50A8\u4E0D\u53EF\u7528", "cron_store_unavailable", 500);
    }
    const doc = parseDocument(tmpBytes);
    try {
      if (corruptBytes !== null && existsSync(this.jobsPath)) {
        writeFileSync(`${this.jobsPath}.corrupt-${Date.now().toString(36)}.bak`, corruptBytes, { flag: "wx" });
      }
      renameSync(tmpPath, this.jobsPath);
    } catch (error) {
      throw new CodedError(`\u81EA\u52A8\u5316\u4EFB\u52A1\u5B58\u50A8\u6062\u590D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`, "cron_store_recovery_failed", 500);
    }
    return doc;
  }
  load() {
    const state = this.readState();
    if (state === null) {
      this.jobs = [];
      this.nextNum = 1;
      this.storeRevision = 0;
      return;
    }
    const nowIso2 = (/* @__PURE__ */ new Date()).toISOString();
    let dirty = state.dirty;
    const jobs = cloneJson(state.doc.jobs);
    for (const job of jobs) {
      const normalizedModel = JSON.stringify(normalizeModelRef(job.model));
      if (JSON.stringify(job.model ?? "") !== normalizedModel) {
        job.model = normalizeModelRef(job.model);
        dirty = true;
      }
      if (job.consecutiveErrors === void 0) {
        job.consecutiveErrors = 0;
        dirty = true;
      }
      if (job.enabled === true && !isValidRunAt(job.nextRunAt)) {
        const next = this.calcNextRun(job.type, job.schedule, nowIso2);
        if (next === null) {
          job.enabled = false;
          job.nextRunAt = null;
          job.configRevision = (Number.isSafeInteger(job.configRevision) ? job.configRevision : 1) + 1;
        } else {
          job.nextRunAt = next;
        }
        dirty = true;
      }
    }
    const normalized = jobs.map(normalizeJob);
    const nextNum = validNextNum(state.doc.nextNum, normalized);
    if (dirty || JSON.stringify(jobs) !== JSON.stringify(normalized)) {
      const revision = (state.doc.storeRevision ?? 0) + 1;
      this.writeState({ storeRevision: revision, jobs: normalized, nextNum });
      this.adopt({ storeRevision: revision, jobs: normalized, nextNum });
      return;
    }
    this.adopt({ storeRevision: state.doc.storeRevision ?? 0, jobs: normalized, nextNum });
  }
  adopt(state) {
    this.storeRevision = state.storeRevision;
    this.jobs = state.jobs;
    this.nextNum = state.nextNum;
  }
  /** 原子写：先写 .tmp 再 rename 覆盖。 */
  writeState(doc) {
    mkdirSync(dirname2(this.jobsPath), { recursive: true });
    const payload = JSON.stringify({ storeRevision: doc.storeRevision, jobs: doc.jobs, nextNum: doc.nextNum }, null, 2) + "\n";
    writeFileSync(this.jobsPath + ".tmp", payload, "utf-8");
    renameSync(this.jobsPath + ".tmp", this.jobsPath);
  }
  /** 读-改-写事务：mutator 必须同步；changed=false 时不落盘不升版本。 */
  mutate(mutator) {
    if (this.mutating) throw new CodedError("cron store \u4E0D\u5141\u8BB8\u91CD\u5165\u5199\u5165", "cron_store_reentrant_write");
    this.mutating = true;
    try {
      const base = this.readState();
      const draft = {
        jobs: base === null ? [] : cloneJson(base.doc.jobs),
        nextNum: base === null ? 1 : validNextNum(base.doc.nextNum, base.doc.jobs)
      };
      const outcome = mutator(draft);
      if (outcome.changed === false) {
        this.load();
        return outcome.value;
      }
      const jobs = draft.jobs.map(normalizeJob);
      const revision = (base?.doc.storeRevision ?? this.storeRevision) + 1;
      this.writeState({ storeRevision: revision, jobs, nextNum: draft.nextNum });
      this.adopt({ storeRevision: revision, jobs, nextNum: draft.nextNum });
      return outcome.value;
    } finally {
      this.mutating = false;
    }
  }
  // ════════════════════════════
  //  Job CRUD
  // ════════════════════════════
  /** 新建任务。at 必须指向未来；every 最小 1 分钟；缺省 label 取 prompt 前 30 字。 */
  addJob(input) {
    assertValidType(input.type);
    const schedule = input.type === "every" ? normalizeEveryMs(input.schedule) : input.schedule;
    if (input.type === "at") assertFutureAt(schedule);
    if (input.enabled !== false && this.calcNextRun(input.type, schedule, (/* @__PURE__ */ new Date()).toISOString()) === null) {
      throw new Error(`\u8FD9\u4E2A\u8BA1\u5212\u7B97\u4E0D\u51FA\u4E0B\u4E00\u6B21\u89E6\u53D1\u65F6\u95F4\uFF1A${String(schedule)}`);
    }
    return this.mutate((draft) => {
      const nowIso2 = (/* @__PURE__ */ new Date()).toISOString();
      const job = normalizeJob({
        id: allocateId(draft),
        schemaVersion: AUTOMATION_SCHEMA_VERSION,
        configRevision: 1,
        type: input.type,
        schedule,
        prompt: typeof input.prompt === "string" ? input.prompt : "",
        label: deriveJobLabel(input),
        model: normalizeModelRef(input.model ?? ""),
        enabled: input.enabled !== false,
        consecutiveErrors: 0,
        createdAt: nowIso2,
        lastRunAt: null,
        nextRunAt: this.calcNextRun(input.type, schedule, nowIso2)
      });
      assertCanEnable(job);
      draft.jobs.push(job);
      return { changed: true, value: job };
    });
  }
  /** 删除任务，并顺带清掉它的运行历史与完整产出目录（避免孤儿文件常驻）。 */
  removeJob(id) {
    const removed = this.mutate((draft) => {
      const index = draft.jobs.findIndex((job) => job.id === id);
      if (index === -1) return { changed: false, value: false };
      draft.jobs.splice(index, 1);
      return { changed: true, value: true };
    });
    if (removed) this.purgeRunArtifacts(id);
    return removed;
  }
  getJob(id) {
    this.load();
    return this.jobs.find((job) => job.id === id) ?? null;
  }
  listJobs() {
    this.load();
    return cloneJson(this.jobs);
  }
  /**
   * 更新任务字段（白名单）。改 type 必须同时给 schedule；任何影响执行的变更
   * 都会重算 nextRunAt 并自增 configRevision。
   */
  updateJob(id, patch) {
    return this.mutate((draft) => {
      const index = draft.jobs.findIndex((job2) => job2.id === id);
      if (index === -1) return { changed: false, value: null };
      const current = normalizeJob(draft.jobs[index]);
      const job = cloneJson(current);
      for (const key of Object.keys(patch)) {
        if (!UPDATE_ALLOWED.has(key)) continue;
        const value = patch[key];
        if (value === void 0) continue;
        if (key === "model") job.model = normalizeModelRef(value);
        else if (key === "type") job.type = String(value);
        else if (key === "label") job.label = String(value);
        else if (key === "prompt") job.prompt = String(value);
        else if (key === "enabled") job.enabled = value === true;
        else if (key === "schedule") job.schedule = value;
      }
      assertValidType(job.type);
      if ("type" in patch && patch.type !== current.type && !("schedule" in patch)) {
        throw new Error("\u4FEE\u6539\u8C03\u5EA6\u7C7B\u578B\u65F6\u5FC5\u987B\u540C\u65F6\u63D0\u4F9B schedule");
      }
      if ("schedule" in patch || "type" in patch) {
        if (job.type === "every") job.schedule = normalizeEveryMs(job.schedule);
        if (job.type === "at") assertFutureAt(job.schedule);
        const next = this.calcNextRun(job.type, job.schedule, (/* @__PURE__ */ new Date()).toISOString());
        if (next === null && job.enabled) {
          throw new Error(`\u8FD9\u4E2A\u8BA1\u5212\u7B97\u4E0D\u51FA\u4E0B\u4E00\u6B21\u89E6\u53D1\u65F6\u95F4\uFF1A${String(job.schedule)}`);
        }
        job.nextRunAt = next;
      }
      if (job.label.trim() === "") job.label = deriveJobLabel({ prompt: job.prompt }) || job.id;
      assertCanEnable(job);
      const configChanged = JSON.stringify(projection(current)) !== JSON.stringify(projection(job));
      job.configRevision = configChanged ? current.configRevision + 1 : current.configRevision;
      draft.jobs[index] = job;
      return { changed: true, value: job };
    });
  }
  /** 启用/停用切换；重新启用时从当前时刻重算下次触发。 */
  toggleJob(id) {
    return this.mutate((draft) => {
      const index = draft.jobs.findIndex((job2) => job2.id === id);
      if (index === -1) return { changed: false, value: null };
      const job = cloneJson(draft.jobs[index]);
      job.enabled = !job.enabled;
      job.configRevision += 1;
      if (!job.enabled) job.nextRunAt = null;
      if (job.enabled) {
        assertCanEnable(job);
        const next = this.calcNextRun(job.type, job.schedule, (/* @__PURE__ */ new Date()).toISOString());
        if (next === null) {
          throw new Error(job.type === "at" ? "\u8FD9\u6761\u4E00\u6B21\u6027\u4EFB\u52A1\u7684\u65F6\u95F4\u5DF2\u8FC7\u53BB\uFF0C\u8BF7\u5148\u628A\u65F6\u95F4\u6539\u5230\u672A\u6765\u518D\u542F\u7528" : "\u5F53\u524D\u8BA1\u5212\u7B97\u4E0D\u51FA\u4E0B\u4E00\u6B21\u89E6\u53D1\u65F6\u95F4\uFF0C\u8BF7\u68C0\u67E5 Cron \u8868\u8FBE\u5F0F");
        }
        job.nextRunAt = next;
      }
      draft.jobs[index] = job;
      return { changed: true, value: job };
    });
  }
  /**
   * 标记一次运行结束：更新 lastRunAt 并推进 nextRunAt。
   * 成功 → 清零连续错误、按计划推进；失败 → 连续错误 +1、按退避表取较晚者；
   * at 类型执行一次后自动停用（一次性任务完成即退役）。
   * expectedConfigRevision 不匹配时拒绝写入（运行期间被编辑过）。
   */
  markRun(id, opts = {}) {
    return this.mutate((draft) => {
      const index = draft.jobs.findIndex((job2) => job2.id === id);
      if (index === -1) return { changed: false, value: false };
      const job = cloneJson(draft.jobs[index]);
      if (opts.expectedConfigRevision != null && job.configRevision !== opts.expectedConfigRevision) {
        return { changed: false, value: false };
      }
      const nowIso2 = (/* @__PURE__ */ new Date()).toISOString();
      job.lastRunAt = nowIso2;
      const success = opts.success !== false;
      if (success) {
        job.consecutiveErrors = 0;
        job.nextRunAt = this.calcNextRun(job.type, job.schedule, nowIso2);
      } else {
        job.consecutiveErrors += 1;
        const normalNext = this.calcNextRun(job.type, job.schedule, nowIso2);
        const backoffNext = new Date(Date.now() + BACKOFF_MS[Math.min(job.consecutiveErrors, BACKOFF_MS.length - 1)]).toISOString();
        job.nextRunAt = normalNext !== null && normalNext > backoffNext ? normalNext : backoffNext;
      }
      if (job.type === "at" && job.enabled !== false) {
        job.enabled = false;
        job.configRevision += 1;
      }
      draft.jobs[index] = normalizeJob(job);
      return { changed: true, value: true };
    });
  }
  // ════════════════════════════
  //  运行历史
  // ════════════════════════════
  /** 追加一条运行记录（jsonl）；超阈值时修剪旧行。 */
  logRun(jobId, run) {
    const filePath = join5(this.runsDir, `${safeFileId(jobId)}.jsonl`);
    mkdirSync(this.runsDir, { recursive: true });
    try {
      const line = JSON.stringify({ ...run, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
      const existing = existsSync(filePath) ? readFileSync2(filePath, "utf-8") : "";
      const lines = existing.trim() === "" ? [] : existing.trim().split("\n");
      lines.push(line);
      const trimmed = lines.length > RUNS_TRIM_OVER ? lines.slice(-RUNS_TRIM_KEEP) : lines;
      const payload = trimmed.join("\n") + "\n";
      writeFileSync(filePath + ".tmp", payload, "utf-8");
      renameSync(filePath + ".tmp", filePath);
    } catch {
    }
  }
  /** 清空某任务的运行历史与完整产出（保留任务本体）。 */
  clearRunHistory(id) {
    this.purgeRunArtifacts(id);
  }
  /** 删除某任务的 jsonl 历史与 runs/<id>/ 产出目录（幂等、失败静默）。 */
  purgeRunArtifacts(id) {
    try {
      rmSync(join5(this.runsDir, `${safeFileId(id)}.jsonl`), { force: true });
    } catch {
    }
    try {
      rmSync(join5(this.outputsDir, safeFileId(id)), { recursive: true, force: true });
    } catch {
    }
  }
  /** 读取某任务的运行记录（最新在后，最多 limit 条）。 */
  getRunHistory(jobId, limit = 20) {
    const filePath = join5(this.runsDir, `${safeFileId(jobId)}.jsonl`);
    try {
      const raw = readFileSync2(filePath, "utf-8");
      const lines = raw.trim().split("\n").filter(Boolean);
      return lines.slice(-limit).map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter((entry) => entry !== null);
    } catch {
      return [];
    }
  }
  // ════════════════════════════
  //  调度计算
  // ════════════════════════════
  /** 计算下次执行时间；返回 ISO 字符串或 null（不再触发）。 */
  calcNextRun(type, schedule, fromIso) {
    const from = new Date(fromIso);
    switch (type) {
      case "at": {
        const target = new Date(String(schedule));
        if (Number.isNaN(target.getTime())) return null;
        return target > from ? target.toISOString() : null;
      }
      case "every": {
        const ms = typeof schedule === "number" ? schedule : Number.parseInt(String(schedule), 10);
        if (!Number.isFinite(ms) || ms <= 0) return null;
        return new Date(from.getTime() + ms).toISOString();
      }
      case "cron":
        return this.parseSimpleCron(String(schedule), from);
      default:
        return null;
    }
  }
  /**
   * 完整 5 字段 cron 解析：分(0-59) 时(0-23) 日(1-31) 月(1-12) 周(0-6,7=周日)。
   * 支持「星号」「星号斜杠步进」「范围 N-M」「范围步进」与逗号列表；
   * 「日」「周」同时受限时按 OR 语义（标准 cron 行为）。
   * 从下一分钟起逐分钟搜索，上限 366 天。
   */
  parseSimpleCron(expr, from) {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return null;
    const ranges = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]];
    const fields = [];
    for (let i = 0; i < 5; i++) {
      const set = parseCronField(parts[i], ranges[i][0], ranges[i][1], i === 4);
      if (set === null) return null;
      fields.push(set);
    }
    const [minutes, hours, days, months, weekdays] = fields;
    const dayOfMonthRestricted = parts[2] !== "*";
    const dayOfWeekRestricted = parts[4] !== "*";
    const start = new Date(from);
    start.setSeconds(0, 0);
    start.setMinutes(start.getMinutes() + 1);
    const limit = 366 * 24 * 60;
    for (let i = 0; i < limit; i++) {
      const t = new Date(start.getTime() + i * 6e4);
      if (!months.has(t.getMonth() + 1)) continue;
      const matchesDayOfMonth = days.has(t.getDate());
      const matchesDayOfWeek = weekdays.has(t.getDay());
      const matchesDay = dayOfMonthRestricted && dayOfWeekRestricted ? matchesDayOfMonth || matchesDayOfWeek : matchesDayOfMonth && matchesDayOfWeek;
      if (!matchesDay) continue;
      if (!hours.has(t.getHours())) continue;
      if (!minutes.has(t.getMinutes())) continue;
      return t.toISOString();
    }
    return null;
  }
};
function projection(job) {
  return {
    type: job.type,
    schedule: job.schedule,
    label: job.label,
    prompt: job.prompt,
    model: job.model,
    enabled: job.enabled
  };
}
function validNextNum(nextNum, jobs) {
  return Number.isSafeInteger(nextNum) && Number(nextNum) > 0 ? Number(nextNum) : jobs.length + 1;
}
function isValidRunAt(value) {
  return typeof value === "string" && value.trim() !== "" && Number.isFinite(new Date(value).getTime());
}
function assertValidType(type) {
  if (!VALID_TYPES.has(type)) {
    throw new Error(`\u65E0\u6548\u7684\u4EFB\u52A1\u7C7B\u578B "${String(type)}"\uFF0C\u5FC5\u987B\u662F at / every / cron`);
  }
}
function normalizeEveryMs(schedule) {
  const ms = typeof schedule === "number" ? schedule : Number.parseInt(String(schedule), 10);
  if (!Number.isFinite(ms) || ms <= 0) {
    throw new Error(`\u65E0\u6548\u7684 every schedule\uFF1A"${String(schedule)}"\uFF0C\u5FC5\u987B\u662F\u6B63\u6574\u6570\u6BEB\u79D2`);
  }
  return Math.max(MIN_EVERY_INTERVAL_MS, ms);
}
function assertFutureAt(schedule) {
  const target = new Date(String(schedule));
  if (Number.isNaN(target.getTime())) {
    throw new Error(`\u65E0\u6548\u7684 at schedule\uFF1A"${String(schedule)}"\uFF0C\u65E0\u6CD5\u89E3\u6790\u4E3A\u65E5\u671F`);
  }
  if (target <= /* @__PURE__ */ new Date()) {
    throw new Error(`at schedule \u5DF2\u8FC7\u671F\uFF1A"${String(schedule)}"\uFF0C\u5FC5\u987B\u662F\u672A\u6765\u65F6\u95F4`);
  }
}
function assertCanEnable(job) {
  if (!job.enabled) return;
  if (typeof job.prompt === "string" && job.prompt.trim() !== "") return;
  throw new Error("\u542F\u7528\u81EA\u52A8\u5316\u524D\u5FC5\u987B\u586B\u5199\u6267\u884C\u5185\u5BB9\uFF08prompt\uFF09");
}
function safeFileId(value) {
  if (typeof value !== "string" || value === "" || value.includes("/") || value.includes("\\") || value.includes("..")) {
    throw new Error(`invalid run file id: ${String(value)}`);
  }
  return value;
}
function allocateId(draft) {
  let id;
  do {
    id = `job_${draft.nextNum++}`;
  } while (draft.jobs.some((job) => job.id === id));
  return id;
}
function parseCronField(field, min, max, isWeekday = false) {
  const values = /* @__PURE__ */ new Set();
  for (const segment of field.split(",")) {
    if (segment.startsWith("*/")) {
      const step = Number.parseInt(segment.slice(2), 10);
      if (Number.isNaN(step) || step <= 0) return null;
      for (let v = min; v <= max; v += step) values.add(v);
      continue;
    }
    if (segment === "*") {
      for (let v = min; v <= max; v++) values.add(v);
      continue;
    }
    const rangeMatch = segment.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
    if (rangeMatch !== null) {
      const lo = Number.parseInt(rangeMatch[1], 10);
      const hi = Number.parseInt(rangeMatch[2], 10);
      const step = rangeMatch[3] !== void 0 ? Number.parseInt(rangeMatch[3], 10) : 1;
      if (Number.isNaN(lo) || Number.isNaN(hi) || Number.isNaN(step) || step <= 0) return null;
      if (lo > hi) return null;
      const effectiveMax2 = isWeekday ? 7 : max;
      if (lo < min || hi > effectiveMax2) return null;
      for (let v = lo; v <= hi; v += step) values.add(isWeekday && v === 7 ? 0 : v);
      continue;
    }
    const num = Number.parseInt(segment, 10);
    if (Number.isNaN(num)) return null;
    const effectiveMax = isWeekday ? 7 : max;
    if (num < min || num > effectiveMax) return null;
    values.add(isWeekday && num === 7 ? 0 : num);
  }
  return values.size > 0 ? values : null;
}

// src/automation/suggestions.ts
var DEFAULT_SUGGESTION_TTL_MS = 15 * 60 * 1e3;
var CONFIRMABLE_FIELDS = /* @__PURE__ */ new Set(["type", "schedule", "prompt", "label", "model"]);
var AutomationSuggestionStore = class {
  entries = /* @__PURE__ */ new Map();
  sequence = 0;
  ttlMs;
  constructor(ttlMs = DEFAULT_SUGGESTION_TTL_MS) {
    if (!Number.isFinite(ttlMs) || ttlMs <= 0) throw new Error("automation suggestion ttlMs must be positive");
    this.ttlMs = ttlMs;
  }
  /**
   * 登记一条建议。apply 闭包在用户确认时执行（把可能被用户编辑过的 jobData
   * 合并进建议并写入 CronStore）。
   */
  create(entry) {
    this.pruneExpired();
    const suggestionId = `automation_${Date.now().toString(36)}_${(++this.sequence).toString(36)}`;
    const createdAt = Date.now();
    const stored = {
      suggestionId,
      shortCode: String(Math.floor(1e3 + Math.random() * 9e3)),
      operation: entry.operation === "update" ? "update" : "create",
      jobId: typeof entry.jobId === "string" && entry.jobId.trim() !== "" ? entry.jobId : null,
      baseConfigRevision: Number.isSafeInteger(entry.baseConfigRevision) && Number(entry.baseConfigRevision) > 0 ? Number(entry.baseConfigRevision) : null,
      jobData: JSON.parse(JSON.stringify(entry.jobData)),
      apply: entry.apply,
      applying: false,
      createdAt,
      expiresAt: createdAt + this.ttlMs
    };
    if (stored.operation === "update" && (stored.jobId === null || stored.baseConfigRevision === null)) {
      throw new Error("update automation suggestion requires jobId and baseConfigRevision");
    }
    this.entries.set(suggestionId, stored);
    return publicEntry(stored);
  }
  get(ref) {
    this.pruneExpired();
    const found = [...this.entries.values()].find((entry) => entry.suggestionId === ref || entry.shortCode === ref);
    return found !== void 0 ? publicEntry(found) : null;
  }
  list() {
    this.pruneExpired();
    return [...this.entries.values()].sort((a, b) => a.createdAt - b.createdAt).map(publicEntry);
  }
  /**
   * 应用建议：合并用户编辑 → 签发 receipt → 执行 apply（写 CronStore）。
   * 不存在 / 过期 / 正在应用分别返回对应失败原因。
   */
  async apply({ ref, value } = {}) {
    this.pruneExpired();
    const candidates = [...this.entries.values()].sort((a, b) => b.createdAt - a.createdAt);
    const entry = ref != null && ref !== "" ? candidates.find((candidate) => candidate.suggestionId === ref || candidate.shortCode === ref) : candidates[0];
    if (entry === void 0) return { ok: false, reason: "not-found" };
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(entry.suggestionId);
      return { ok: false, reason: "expired" };
    }
    if (entry.applying) return { ok: false, reason: "already-applying" };
    entry.applying = true;
    try {
      const merged = mergeConfirmedDraft(entry.jobData, value);
      const receipt = Object.freeze({
        suggestionId: entry.suggestionId,
        confirmedAt: (/* @__PURE__ */ new Date()).toISOString(),
        expiresAt: entry.expiresAt,
        operation: entry.operation,
        jobId: entry.jobId,
        baseConfigRevision: entry.baseConfigRevision
      });
      assertReceiptUsable(receipt);
      const result = await Promise.resolve(entry.apply({ jobData: merged, receipt }));
      this.entries.delete(entry.suggestionId);
      return { ok: true, suggestion: publicEntry(entry), result };
    } finally {
      entry.applying = false;
    }
  }
  /** 用户显式拒绝一条建议：立即移除（不存在返回 false）。 */
  dismiss(ref) {
    this.pruneExpired();
    const entry = [...this.entries.values()].find((candidate) => candidate.suggestionId === ref || candidate.shortCode === ref);
    if (entry === void 0) return false;
    this.entries.delete(entry.suggestionId);
    return true;
  }
  pruneExpired() {
    const now = Date.now();
    for (const [id, entry] of this.entries) {
      if (entry.expiresAt <= now && entry.applying !== true) this.entries.delete(id);
    }
  }
};
function mergeConfirmedDraft(base, value) {
  if (!isPlainObject2(value)) return base;
  const draft = isPlainObject2(value.jobData) ? value.jobData : value;
  const next = JSON.parse(JSON.stringify(base));
  for (const key of Object.keys(draft)) {
    if (!CONFIRMABLE_FIELDS.has(key)) continue;
    if (draft[key] === void 0) continue;
    next[key] = draft[key];
  }
  return next;
}
function assertReceiptUsable(receipt) {
  if (receipt.expiresAt <= Date.now()) {
    throw new CodedError("\u81EA\u52A8\u5316\u5EFA\u8BAE\u5DF2\u8FC7\u671F", "automation_suggestion_receipt_expired", 410);
  }
}
function publicEntry(entry) {
  return {
    suggestionId: entry.suggestionId,
    shortCode: entry.shortCode,
    operation: entry.operation,
    jobId: entry.jobId,
    baseConfigRevision: entry.baseConfigRevision,
    jobData: JSON.parse(JSON.stringify(entry.jobData)),
    createdAt: entry.createdAt,
    expiresAt: entry.expiresAt
  };
}
function isPlainObject2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// src/automation/scheduler.ts
var DEFAULT_CRON_EXECUTION_TIMEOUT_MS = 20 * 60 * 1e3;
var JobBusyError = class extends Error {
  code = "job_busy";
  constructor(id) {
    super(`\u4EFB\u52A1 ${id} \u6B63\u5728\u6267\u884C\u4E2D\uFF0C\u8BF7\u7B49\u5B83\u7ED3\u675F`);
    this.name = "JobBusyError";
  }
};
function formatTimeoutMs(ms) {
  if (ms % 6e4 === 0) return `${ms / 6e4}min`;
  if (ms % 1e3 === 0) return `${ms / 1e3}s`;
  return `${ms}ms`;
}
function createCronScheduler({
  store,
  executeJob: executeJob2,
  abortJob,
  onJobDone,
  executionTimeoutMs = DEFAULT_CRON_EXECUTION_TIMEOUT_MS
}) {
  const CHECK_INTERVAL = 6e4;
  if (!Number.isFinite(executionTimeoutMs) || executionTimeoutMs <= 0) {
    throw new Error("executionTimeoutMs must be a positive finite number");
  }
  let timer = null;
  let checking = false;
  let checkPromise = null;
  let stopped = false;
  const inflight2 = /* @__PURE__ */ new Map();
  async function checkJobs() {
    if (checking) return;
    checking = true;
    const p = doCheck().finally(() => {
      checking = false;
    });
    checkPromise = p;
    await p;
  }
  function dispatch(job, trigger) {
    const existing = inflight2.get(job.id);
    if (existing !== void 0) return existing;
    const startedAt = (/* @__PURE__ */ new Date()).toISOString();
    const run = (async () => {
      let timeoutTimer;
      try {
        let executionResult;
        try {
          executionResult = await Promise.race([
            Promise.resolve(executeJob2(job)),
            new Promise((_, reject) => {
              timeoutTimer = setTimeout(() => {
                abortJob?.(job);
                reject(new Error(`execution timeout (${formatTimeoutMs(executionTimeoutMs)})`));
              }, executionTimeoutMs);
            })
          ]);
        } finally {
          clearTimeout(timeoutTimer);
        }
        const finishedAt = (/* @__PURE__ */ new Date()).toISOString();
        const extra = isRecord(executionResult) ? executionResult : {};
        const cursorAdvanced = trigger === "schedule" ? store.markRun(job.id, { success: true, expectedConfigRevision: job.configRevision }) : true;
        const record = {
          ...extra,
          status: "success",
          startedAt,
          finishedAt,
          trigger,
          ...cursorAdvanced === false ? { staleConfigRevision: true } : {}
        };
        store.logRun(job.id, record);
        const result = { ...record };
        onJobDone?.(job, result);
        return result;
      } catch (error) {
        const finishedAt = (/* @__PURE__ */ new Date()).toISOString();
        const message = error instanceof Error ? error.message : String(error);
        if (isSkippedError(error)) {
          const record2 = { status: "skipped", startedAt, finishedAt, reason: message, trigger };
          store.logRun(job.id, record2);
          const result2 = { ...record2 };
          onJobDone?.(job, result2);
          return result2;
        }
        const cursorAdvanced = trigger === "schedule" ? store.markRun(job.id, { success: false, expectedConfigRevision: job.configRevision }) : true;
        const record = {
          status: "error",
          startedAt,
          finishedAt,
          error: message,
          trigger,
          ...cursorAdvanced === false ? { staleConfigRevision: true } : {}
        };
        store.logRun(job.id, record);
        const result = { ...record };
        onJobDone?.(job, result);
        return result;
      }
    })().finally(() => {
      inflight2.delete(job.id);
    });
    inflight2.set(job.id, run);
    return run;
  }
  async function doCheck() {
    try {
      const jobs = store.listJobs();
      for (const listedJob of jobs) {
        if (stopped) return;
        const job = store.getJob(listedJob.id);
        if (job === null || !job.enabled || job.nextRunAt === null) continue;
        if (inflight2.has(job.id)) continue;
        const nextRunTime = new Date(job.nextRunAt).getTime();
        if (!Number.isFinite(nextRunTime) || Date.now() < nextRunTime) continue;
        if (Number.isInteger(job.schemaVersion) && job.schemaVersion !== AUTOMATION_SCHEMA_VERSION) {
          const skippedAt = (/* @__PURE__ */ new Date()).toISOString();
          store.logRun(job.id, {
            status: "skipped",
            startedAt: skippedAt,
            finishedAt: skippedAt,
            reason: "unsupported_automation_schema",
            schemaVersion: job.schemaVersion,
            trigger: "schedule"
          });
          onJobDone?.(job, { status: "skipped", reason: "unsupported_automation_schema" });
          continue;
        }
        void dispatch(job, "schedule").catch(() => {
        });
      }
    } catch {
    }
  }
  async function runNow(id) {
    const job = store.getJob(id);
    if (job === null) throw new Error(`\u627E\u4E0D\u5230\u4EFB\u52A1 ${id}`);
    if (inflight2.has(id)) throw new JobBusyError(id);
    if (typeof job.prompt !== "string" || job.prompt.trim() === "") {
      throw new Error("\u8FD9\u6761\u81EA\u52A8\u5316\u8FD8\u6CA1\u6709\u6267\u884C\u5185\u5BB9\uFF0C\u5148\u5199\u4E0B\u60F3\u8BA9\u52A9\u624B\u505A\u4EC0\u4E48");
    }
    return dispatch(job, "manual");
  }
  function start() {
    if (timer !== null) return;
    stopped = false;
    timer = setInterval(() => {
      void checkJobs();
    }, CHECK_INTERVAL);
    setTimeout(() => {
      if (!stopped) void checkJobs();
    }, 1e3).unref?.();
  }
  async function stop() {
    stopped = true;
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    if (checkPromise !== null) {
      await checkPromise.catch(() => {
      });
      checkPromise = null;
    }
    await Promise.allSettled([...inflight2.values()]);
  }
  function cancel(id) {
    if (!inflight2.has(id)) return false;
    const job = store.getJob(id);
    if (job === null) return false;
    abortJob?.(job);
    return true;
  }
  return {
    start,
    stop,
    checkJobs,
    runNow,
    isRunning: (id) => inflight2.has(id),
    runningIds: () => [...inflight2.keys()],
    cancel
  };
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isSkippedError(error) {
  return isRecord(error) && error.skipped === true;
}

// src/automation/executor.ts
import { mkdirSync as mkdirSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { join as join6 } from "node:path";
var RUN_MAX_TOKENS = 8192;
var SUMMARY_MAX = 200;
function resolveRunModel(ctx, job) {
  const explicit = typeof job.model === "object" && job.model !== null && job.model.id !== "" ? job.model : null;
  if (explicit !== null) {
    return { provider: explicit.provider ?? "", model: explicit.id };
  }
  const defaultModel = ctx.get("agentDefaultModel");
  if (defaultModel !== void 0) {
    try {
      const selection = defaultModel.currentSelection();
      if (typeof selection.provider === "string" && selection.provider !== "" && typeof selection.model === "string" && selection.model !== "") {
        return { provider: selection.provider, model: selection.model };
      }
    } catch {
    }
  }
  throw new Error("\u672A\u6307\u5B9A\u6A21\u578B\u4E14\u65E0\u6CD5\u89E3\u6790\u9ED8\u8BA4\u6A21\u578B\uFF0C\u8BF7\u5148\u5728\u4EFB\u52A1\u91CC\u7ED1\u5B9A\u6A21\u578B\u6216\u5728\u4F1A\u8BDD\u4E2D\u9009\u62E9\u9ED8\u8BA4\u6A21\u578B");
}
function buildCronPrompt(job) {
  return [
    `[\u5B9A\u65F6\u4EFB\u52A1 ${job.id}: ${job.label}]`,
    "",
    "**\u6CE8\u610F\uFF1A\u8FD9\u662F\u7CFB\u7EDF\u81EA\u52A8\u89E6\u53D1\u7684\u5B9A\u65F6\u4EFB\u52A1\uFF0C\u4E0D\u662F\u7528\u6237\u53D1\u6765\u7684\u3002**",
    "**\u4E0D\u8981\u5728\u6267\u884C\u8FC7\u7A0B\u4E2D\u521B\u5EFA\u65B0\u7684\u5B9A\u65F6\u4EFB\u52A1\u3002**",
    "",
    job.prompt
  ].join("\n");
}
async function executeJob(ctx, llm, job, signal) {
  const { provider, model } = resolveRunModel(ctx, job);
  const prompt = buildCronPrompt(job);
  let output = "";
  const messages = [createUserMessage({
    content: [{ type: "text", text: prompt }],
    source: { kind: "plugin", plugin: "dsh-triad" }
  })];
  for await (const chunk of llm.stream({
    provider,
    model,
    messages,
    system: "You are executing a scheduled automation task for the user. Complete the task described in the message and output ONLY the final result \u2014 no preamble, no meta commentary.",
    maxTokens: RUN_MAX_TOKENS,
    signal
  })) {
    if (chunk.type === "text-delta") {
      output += chunk.text ?? "";
      continue;
    }
    if (chunk.type !== "finish") continue;
    const reason = chunk.reason;
    if (reason === void 0) continue;
    if (reason.kind === "error") {
      throw new Error(reason.failure?.message ?? "\u6A21\u578B\u8C03\u7528\u5931\u8D25");
    }
    if (reason.kind === "aborted") {
      throw new Error("\u4EFB\u52A1\u5DF2\u4E2D\u6B62");
    }
    if (reason.kind !== "stop" && reason.kind !== "max-tokens") {
      throw new Error(`\u6A21\u578B\u672A\u6B63\u5E38\u7ED3\u675F\uFF1A${reason.kind}`);
    }
  }
  if (output.trim() === "") {
    throw new Error(`\u6A21\u578B\u672A\u8FD4\u56DE\u5185\u5BB9\uFF08${provider}/${model}\uFF09`);
  }
  const file = writeRunOutput(job.id, output, provider, model);
  const modelLabel = provider !== "" ? `${provider}/${model}` : model;
  return { summary: summarize2(output), model: modelLabel, ...file !== null ? { file } : {} };
}
function summarize2(output) {
  const flat = output.trim().replace(/\s*\n\s*\n\s*/g, " / ").replace(/\s*\n\s*/g, " ");
  return flat.length > SUMMARY_MAX ? `${flat.slice(0, SUMMARY_MAX)}\u2026` : flat;
}
function renderOutputDocument(output, provider, model) {
  return [
    `> \u81EA\u52A8\u5316\u4EA7\u51FA \xB7 ${(/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false })} \xB7 ${provider}/${model}`,
    "",
    "---",
    "",
    output,
    ""
  ].join("\n");
}
function writeRunOutput(jobId, output, provider, model) {
  try {
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const fileName = `${stamp}.md`;
    const dir = join6(automationDataRoot(), "runs", safeDirId(jobId));
    mkdirSync2(dir, { recursive: true });
    writeFileSync2(join6(dir, fileName), renderOutputDocument(output, provider, model), "utf-8");
    return fileName;
  } catch {
    return null;
  }
}
function safeDirId(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error(`invalid run dir id: ${value}`);
  return value;
}

// src/automation/tool.ts
var TOOL_EVERY_UNIT_MS = 6e4;
function normalizeSchedule(params, existing) {
  const rawType = params.scheduleType ?? void 0;
  const type = validateType(rawType ?? existing?.type);
  let schedule = params.schedule ?? existing?.schedule;
  if (schedule === void 0 || schedule === null || schedule === "") {
    throw new Error("scheduleType \u548C schedule \u90FD\u662F\u5FC5\u586B");
  }
  if (type === "every") {
    const minutes = Number.parseInt(String(schedule), 10);
    if (Number.isNaN(minutes) || minutes <= 0) {
      throw new Error("every \u7C7B\u578B\u7684 schedule \u5FC5\u987B\u662F\u6B63\u6574\u6570\u5206\u949F\u6570");
    }
    schedule = minutes * TOOL_EVERY_UNIT_MS;
  }
  return { type, schedule };
}
function validateType(value) {
  if (value !== "at" && value !== "every" && value !== "cron") {
    throw new Error(`\u65E0\u6548\u7684\u8C03\u5EA6\u7C7B\u578B "${String(value)}"\uFF0C\u5FC5\u987B\u662F at / every / cron`);
  }
  return value;
}
function labelFor(params, prompt) {
  if (typeof params.label === "string" && params.label.trim() !== "") return params.label.trim();
  return prompt.slice(0, 40);
}
function buildJobData(params, type, schedule) {
  const prompt = typeof params.prompt === "string" ? params.prompt : "";
  return {
    type,
    schedule,
    prompt,
    label: labelFor(params, prompt),
    model: normalizeModelRef(params.model)
  };
}
function registerAutomationTool({ ctx, store, suggestions, scheduler, isAutoApprove }) {
  const dispose = ctx.tools.register(defineTool({
    name: "automation",
    description: [
      "\u7BA1\u7406\u5B9A\u65F6\u81EA\u52A8\u5316\u4EFB\u52A1\uFF08\u540E\u53F0\u5B9A\u65F6\u6267\u884C\u4E00\u6BB5\u4F60\u5199\u597D\u7684\u6307\u4EE4\uFF09\u3002\u52A8\u4F5C\uFF1A",
      "list=\u5217\u51FA\u5168\u90E8\u4EFB\u52A1\uFF08\u542B\u662F\u5426\u6B63\u5728\u6267\u884C\uFF09\uFF1Bcreate=\u65B0\u5EFA\uFF08\u9ED8\u8BA4\u751F\u6210\u5F85\u7528\u6237\u786E\u8BA4\u7684\u5EFA\u8BAE\uFF0C\u786E\u8BA4\u540E\u751F\u6548\uFF09\uFF1B",
      "update=\u4FEE\u6539\u73B0\u6709\u4EFB\u52A1\uFF08\u540C\u6837\u9700\u7528\u6237\u786E\u8BA4\uFF09\uFF1Benable/disable=\u542F\u7528\u6216\u505C\u7528\u67D0\u4EFB\u52A1\uFF1B",
      "delete=\u5220\u9664\u67D0\u4EFB\u52A1\uFF1Brun=\u7ACB\u5373\u6267\u884C\u4E00\u6B21\uFF08\u4E0D\u5F71\u54CD\u5B9A\u65F6\u6E38\u6807\uFF09\uFF1Bruns=\u67E5\u770B\u67D0\u4EFB\u52A1\u7684\u8FD0\u884C\u5386\u53F2\u3002",
      "\u8C03\u5EA6\u7C7B\u578B\uFF1Aat=\u4E00\u6B21\u6027(ISO\u65F6\u95F4)\u3001every=\u56FA\u5B9A\u95F4\u9694(\u5206\u949F)\u3001cron=5\u5B57\u6BB5\u8868\u8FBE\u5F0F\u300C\u5206 \u65F6 \u65E5 \u6708 \u5468\u300D\u3002",
      "\u4EFB\u52A1\u5230\u671F\u65F6\u7CFB\u7EDF\u4F1A\u7528\u7ED1\u5B9A\u6A21\u578B\u771F\u5B9E\u6267\u884C prompt \u5E76\u8BB0\u5F55\u8FD0\u884C\u5386\u53F2\u3002"
    ].join(""),
    parameters: {
      action: {
        type: "string",
        enum: ["list", "create", "update", "enable", "disable", "delete", "run", "runs"],
        required: true,
        description: "\u8981\u6267\u884C\u7684\u52A8\u4F5C\u3002create/update \u751F\u6210\u5F85\u786E\u8BA4\u5EFA\u8BAE\u800C\u4E0D\u662F\u76F4\u63A5\u4FDD\u5B58\uFF1Benable/disable/delete/run \u7ACB\u5373\u751F\u6548\u3002"
      },
      id: { type: "string", description: "update / enable / disable / delete / run / runs \u52A8\u4F5C\u7684\u76EE\u6807\u4EFB\u52A1 id\u3002" },
      scheduleType: { type: "string", enum: ["at", "every", "cron"], description: "\u89E6\u53D1\u7C7B\u578B\u3002" },
      schedule: { type: "string", description: "\u89E6\u53D1\u8BA1\u5212\uFF1Aevery \u7528\u5206\u949F\u6570\uFF1Bcron \u7528 5 \u5B57\u6BB5\u8868\u8FBE\u5F0F\uFF1Bat \u7528 ISO \u65F6\u95F4\u5B57\u7B26\u4E32\u3002" },
      label: { type: "string", description: "\u7B80\u77ED\u663E\u793A\u540D\u3002" },
      prompt: { type: "string", description: "\u4EFB\u52A1\u89E6\u53D1\u65F6\u8981\u6267\u884C\u7684\u5185\u5BB9\uFF08\u53D1\u7ED9\u6A21\u578B\u7684\u6307\u4EE4\uFF09\u3002" },
      model: { type: "string", description: "\u53EF\u9009\u6267\u884C\u6A21\u578B\uFF0C\u683C\u5F0F provider/model\uFF1B\u7559\u7A7A\u4F7F\u7528\u9ED8\u8BA4\u6A21\u578B\u3002" },
      limit: { type: "number", description: "runs \u52A8\u4F5C\u8FD4\u56DE\u7684\u8BB0\u5F55\u6761\u6570\uFF08\u9ED8\u8BA4 5\uFF0C\u6700\u5927 20\uFF09\u3002" }
    },
    async execute(args, _exec) {
      const params = args;
      const requireId = () => {
        const id = typeof params.id === "string" ? params.id.trim() : "";
        if (id === "") throw new Error(`${String(params.action)} \u9700\u8981 id \u53C2\u6570\uFF08\u5148\u7528 action:"list" \u67E5 id\uFF09`);
        return id;
      };
      try {
        if (params.action === "list") {
          const jobs = store.listJobs();
          if (jobs.length === 0) return "\u5F53\u524D\u6CA1\u6709\u4EFB\u4F55\u5B9A\u65F6\u81EA\u52A8\u5316\u4EFB\u52A1\u3002";
          const running = new Set(scheduler?.()?.runningIds() ?? []);
          return JSON.stringify(jobs.map((job) => ({ ...presentJob(job), running: running.has(job.id) })), null, 2);
        }
        if (params.action === "enable" || params.action === "disable") {
          const id = requireId();
          const current = store.getJob(id);
          if (current === null) throw new Error(`\u627E\u4E0D\u5230\u81EA\u52A8\u5316\u4EFB\u52A1\uFF1A${id}`);
          const want = params.action === "enable";
          if (current.enabled === want) {
            return `\u4EFB\u52A1\u300C${current.label}\u300D\u5DF2\u7ECF\u662F${want ? "\u542F\u7528" : "\u505C\u7528"}\u72B6\u6001\u3002`;
          }
          const job = store.toggleJob(id);
          const next = job?.enabled === true && job.nextRunAt !== null ? `\uFF0C\u4E0B\u6B21\u89E6\u53D1 ${job.nextRunAt}` : "";
          return `\u5DF2${want ? "\u542F\u7528" : "\u505C\u7528"}\u4EFB\u52A1\u300C${job?.label ?? id}\u300D${next}\u3002`;
        }
        if (params.action === "delete") {
          const id = requireId();
          const current = store.getJob(id);
          if (current === null) throw new Error(`\u627E\u4E0D\u5230\u81EA\u52A8\u5316\u4EFB\u52A1\uFF1A${id}`);
          store.removeJob(id);
          return `\u5DF2\u5220\u9664\u4EFB\u52A1\u300C${current.label}\u300D(${id})\uFF0C\u5176\u8FD0\u884C\u5386\u53F2\u4E0E\u4EA7\u51FA\u4E5F\u4E00\u5E76\u6E05\u7406\u3002`;
        }
        if (params.action === "run") {
          const id = requireId();
          const engine = scheduler?.() ?? null;
          if (engine === null) throw new Error("\u6A21\u578B\u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u5F53\u524D\u65E0\u6CD5\u6267\u884C\u4EFB\u52A1");
          const current = store.getJob(id);
          if (current === null) throw new Error(`\u627E\u4E0D\u5230\u81EA\u52A8\u5316\u4EFB\u52A1\uFF1A${id}`);
          const result = await engine.runNow(id);
          const status2 = String(result.status ?? "unknown");
          if (status2 === "success") {
            return `\u4EFB\u52A1\u300C${current.label}\u300D\u5DF2\u6267\u884C\u5B8C\u6210\u3002\u8F93\u51FA\u6458\u8981\uFF1A${truncate(String(result.summary ?? ""), 300)}`;
          }
          if (status2 === "error") throw new Error(`\u4EFB\u52A1\u6267\u884C\u5931\u8D25\uFF1A${String(result.error ?? "\u672A\u77E5\u9519\u8BEF")}`);
          return `\u4EFB\u52A1\u300C${current.label}\u300D\u672C\u6B21\u672A\u6267\u884C\uFF08${String(result.reason ?? status2)}\uFF09\u3002`;
        }
        if (params.action === "runs") {
          const id = requireId();
          const current = store.getJob(id);
          if (current === null) throw new Error(`\u627E\u4E0D\u5230\u81EA\u52A8\u5316\u4EFB\u52A1\uFF1A${id}`);
          const limit = Math.max(1, Math.min(20, Number.parseInt(String(params.limit ?? 5), 10) || 5));
          const runs = store.getRunHistory(id, limit).reverse();
          if (runs.length === 0) return `\u4EFB\u52A1\u300C${current.label}\u300D\u8FD8\u6CA1\u6709\u8FD0\u884C\u8BB0\u5F55\u3002`;
          return JSON.stringify(runs.map(presentRun), null, 2);
        }
        if (params.action !== "create" && params.action !== "update") {
          throw new Error(`\u672A\u77E5\u52A8\u4F5C\uFF1A${String(params.action)}`);
        }
        const operation = params.action;
        let existing = null;
        if (operation === "update") {
          const id = typeof params.id === "string" ? params.id.trim() : "";
          if (id === "") throw new Error("update \u9700\u8981 id \u53C2\u6570");
          existing = store.getJob(id);
          if (existing === null) throw new Error(`\u627E\u4E0D\u5230\u81EA\u52A8\u5316\u4EFB\u52A1\uFF1A${id}`);
        }
        const { type, schedule } = normalizeSchedule(params, existing);
        const jobData = buildJobData(params, type, schedule);
        const commit = () => {
          if (operation === "update" && existing !== null) {
            const fields = { ...jobData };
            delete fields.id;
            return store.updateJob(existing.id, fields);
          }
          return store.addJob({
            type: jobData.type,
            schedule: jobData.schedule,
            prompt: jobData.prompt ?? "",
            label: jobData.label,
            model: jobData.model,
            enabled: true
          });
        };
        if (isAutoApprove?.() === true) {
          const job = commit();
          return `\u81EA\u52A8\u5316\u4EFB\u52A1\u5DF2${operation === "update" ? "\u66F4\u65B0" : "\u521B\u5EFA"}\uFF1A${job?.label ?? ""} (${job?.id ?? ""})`;
        }
        const suggestion = suggestions.create({
          operation,
          jobId: operation === "update" ? existing?.id ?? null : null,
          baseConfigRevision: operation === "update" ? existing?.configRevision ?? null : null,
          jobData,
          apply: ({ receipt }) => {
            if (operation === "update" && existing !== null) {
              const current = store.getJob(existing.id);
              if (current === null) {
                throw new CodedError("\u81EA\u52A8\u5316\u4EFB\u52A1\u5DF2\u4E0D\u5B58\u5728", "cron_job_revision_conflict", 410);
              }
              if (receipt.baseConfigRevision !== null && current.configRevision !== receipt.baseConfigRevision) {
                throw new CodedError("\u4EFB\u52A1\u5728\u5EFA\u8BAE\u521B\u5EFA\u540E\u5DF2\u88AB\u4FEE\u6539\uFF0C\u8BF7\u91CD\u65B0\u53D1\u8D77", "cron_job_revision_conflict");
              }
              const fields = { ...jobData };
              return store.updateJob(existing.id, fields);
            }
            return store.addJob({
              type: jobData.type,
              schedule: jobData.schedule,
              prompt: jobData.prompt ?? "",
              label: jobData.label,
              model: jobData.model,
              enabled: true
            });
          }
        });
        return [
          `\u6211\u51C6\u5907\u4E86\u4E00\u9879\u81EA\u52A8\u4EFB\u52A1\u5EFA\u8BAE\uFF08\u5EFA\u8BAEID\uFF1A${suggestion.shortCode}\uFF09\uFF0C\u7B49\u4F60\u786E\u8BA4\u540E\u518D\u521B\u5EFA\u3002`,
          `\u5185\u5BB9\u6982\u8981\uFF1A${jobData.label || "(\u65E0\u6807\u9898)"}\uFF5C${describeSchedule(type, schedule)}\uFF5C\u6267\u884C\u5185\u5BB9\uFF1A${truncate(jobData.prompt ?? "", 120)}`,
          "\u8BF7\u5728\u81EA\u52A8\u5316\u9762\u677F\u4E2D\u67E5\u770B\u5E76\u786E\u8BA4\u8FD9\u6761\u5EFA\u8BAE\uFF1B\u786E\u8BA4\u524D\u4EFB\u52A1\u4E0D\u4F1A\u521B\u5EFA\u3002"
        ].join("\n");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw Object.assign(new Error(message), { suppressStackTrace: true });
      }
    },
    output: {
      schema: { type: "string" },
      render: (_args, value) => [{ type: "text", text: value }]
    },
    presentCall: (args) => ({
      card: "generic",
      kind: "other",
      title: TOOL_CALL_TITLES[String(args.action)] ?? "\u5B9A\u65F6\u81EA\u52A8\u5316",
      rawInput: args
    })
  }));
  return dispose;
}
var TOOL_CALL_TITLES = {
  list: "\u67E5\u770B\u5B9A\u65F6\u81EA\u52A8\u5316",
  create: "\u5EFA\u8BAE\u65B0\u5EFA\u5B9A\u65F6\u81EA\u52A8\u5316",
  update: "\u5EFA\u8BAE\u4FEE\u6539\u5B9A\u65F6\u81EA\u52A8\u5316",
  enable: "\u542F\u7528\u5B9A\u65F6\u81EA\u52A8\u5316",
  disable: "\u505C\u7528\u5B9A\u65F6\u81EA\u52A8\u5316",
  delete: "\u5220\u9664\u5B9A\u65F6\u81EA\u52A8\u5316",
  run: "\u7ACB\u5373\u6267\u884C\u5B9A\u65F6\u81EA\u52A8\u5316",
  runs: "\u67E5\u770B\u81EA\u52A8\u5316\u8FD0\u884C\u8BB0\u5F55"
};
function presentRun(run) {
  return {
    status: run.status,
    at: run.timestamp,
    trigger: run.trigger ?? "schedule",
    ...run.model !== void 0 ? { model: run.model } : {},
    ...run.summary !== void 0 ? { summary: truncate(run.summary, 200) } : {},
    ...run.error !== void 0 ? { error: run.error } : {},
    ...run.reason !== void 0 ? { reason: run.reason } : {}
  };
}
function presentJob(job) {
  return {
    id: job.id,
    label: job.label,
    type: job.type,
    schedule: job.schedule,
    prompt: job.prompt,
    model: typeof job.model === "object" ? `${job.model.provider ?? ""}/${job.model.id}`.replace(/^\//, "") : "",
    enabled: job.enabled,
    nextRunAt: job.nextRunAt,
    lastRunAt: job.lastRunAt,
    consecutiveErrors: job.consecutiveErrors
  };
}
function describeSchedule(type, schedule) {
  if (type === "at") return String(schedule);
  if (type === "every") {
    const ms = typeof schedule === "number" ? schedule : Number.parseInt(String(schedule), 10);
    const minutes = Math.round(ms / 6e4);
    return minutes % 60 === 0 && minutes >= 60 ? `\u6BCF ${minutes / 60} \u5C0F\u65F6` : `\u6BCF ${minutes} \u5206\u949F`;
  }
  return `cron(${String(schedule)})`;
}
function truncate(text, max) {
  return text.length > max ? text.slice(0, max) + "\u2026" : text;
}

// src/automation/routes.ts
import { readFileSync as readFileSync3 } from "node:fs";
import { join as join7 } from "node:path";
import { URL as URL4 } from "node:url";
var ROUTE_PREFIX3 = "/api/triad-automation";
var EVENT_BUFFER_MAX = 50;
function createAutomationEventBuffer() {
  let seq = 0;
  const buffer = [];
  return {
    push(job, result) {
      const status2 = result.status === "success" || result.status === "error" || result.status === "skipped" ? result.status : "skipped";
      seq += 1;
      buffer.push({
        seq,
        at: Date.now(),
        jobId: job.id,
        jobLabel: job.label,
        status: status2,
        ...typeof result.summary === "string" ? { summary: result.summary } : {},
        ...typeof result.error === "string" ? { error: result.error } : {}
      });
      if (buffer.length > EVENT_BUFFER_MAX) buffer.splice(0, buffer.length - EVENT_BUFFER_MAX);
    },
    since(sinceSeq) {
      const events = buffer.filter((event) => event.seq > sinceSeq);
      return { events, cursor: seq };
    }
  };
}
function isLoopbackAddress4(address) {
  if (typeof address !== "string") return false;
  const a = address.toLowerCase();
  if (a === "::1") return true;
  const ipv4 = a.startsWith("::ffff:") ? a.slice(7) : a;
  const octets = ipv4.split(".");
  return octets.length === 4 && octets[0] === "127" && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function hostNameOf4(value) {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase();
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    if (close <= 1) return null;
    return host.slice(1, close);
  }
  const firstColon = host.indexOf(":");
  const lastColon = host.lastIndexOf(":");
  if (firstColon !== lastColon) return null;
  return firstColon === -1 ? host : host.slice(0, firstColon);
}
function loopbackAllowed3(req) {
  if (!isLoopbackAddress4(req.socket.remoteAddress)) return false;
  const host = hostNameOf4(req.headers.host);
  if (host === null) return false;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}
function json4(res, status2, value) {
  const body = JSON.stringify(value);
  res.writeHead(status2, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache"
  });
  res.end(body);
}
function readBody3(req) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1024 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) {
        resolvePromise({});
        return;
      }
      try {
        resolvePromise(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}
function errorStatus(error) {
  if (error instanceof CodedError) return error.status;
  return 400;
}
function validateType2(value) {
  if (value !== "at" && value !== "every" && value !== "cron") {
    throw new Error(`\u65E0\u6548\u7684\u8C03\u5EA6\u7C7B\u578B "${String(value)}"\uFF0C\u5FC5\u987B\u662F at / every / cron`);
  }
  return value;
}
function normalizeScheduleForWrite(type, schedule) {
  if (type === "every") {
    const ms = typeof schedule === "number" ? schedule : Number.parseInt(String(schedule), 10);
    if (!Number.isFinite(ms) || ms <= 0) throw new Error(`\u65E0\u6548\u7684 every schedule\uFF1A"${String(schedule)}"`);
    return ms < 6e4 ? ms * 6e4 : ms;
  }
  if (type === "at") return String(schedule);
  return String(schedule).trim();
}
function registerAutomationRoutes({ webServer, store, suggestions, events, scheduler, settings }) {
  function jobsPayload() {
    return { jobs: store.listJobs(), running: scheduler()?.runningIds() ?? [] };
  }
  async function handle4(req, res) {
    if (!loopbackAllowed3(req)) {
      json4(res, 403, { ok: false, error: "loopback-only" });
      return;
    }
    const url = new URL4(req.url ?? "/", "http://localhost");
    const rest = url.pathname.slice(ROUTE_PREFIX3.length);
    const method = req.method ?? "GET";
    try {
      if (method === "GET" && rest === "/cron") {
        json4(res, 200, { ok: true, jobs: store.listJobs(), running: scheduler()?.runningIds() ?? [] });
        return;
      }
      if (method === "POST" && rest === "/cron") {
        const body = await readBody3(req);
        const params = body;
        switch (body.action) {
          case "add": {
            const type = validateType2(params.scheduleType ?? params.type);
            const requiresPrompt = params.enabled !== false;
            if (params.schedule === void 0 || params.schedule === null || params.schedule === "" || requiresPrompt && typeof params.prompt !== "string") {
              json4(res, 400, { ok: false, error: "scheduleType\u3001schedule\u3001prompt \u4E3A\u5FC5\u586B" });
              return;
            }
            const schedule = normalizeScheduleForWrite(type, params.schedule);
            const job = store.addJob({
              type,
              schedule,
              prompt: typeof params.prompt === "string" ? params.prompt : "",
              label: typeof params.label === "string" ? params.label : void 0,
              model: normalizeModelRef(params.model),
              enabled: params.enabled !== false
            });
            json4(res, 200, { ok: true, job, ...jobsPayload() });
            return;
          }
          case "remove": {
            const id = typeof params.id === "string" ? params.id : "";
            const removed = id !== "" && store.removeJob(id);
            if (!removed) {
              json4(res, 404, { ok: false, error: `\u627E\u4E0D\u5230\u4EFB\u52A1 ${id}` });
              return;
            }
            json4(res, 200, { ok: true, ...jobsPayload() });
            return;
          }
          case "toggle": {
            const id = typeof params.id === "string" ? params.id : "";
            const job = id === "" ? null : store.toggleJob(id);
            if (job === null) {
              json4(res, 404, { ok: false, error: `\u627E\u4E0D\u5230\u4EFB\u52A1 ${id}` });
              return;
            }
            json4(res, 200, { ok: true, job, ...jobsPayload() });
            return;
          }
          case "update": {
            const id = typeof params.id === "string" ? params.id : "";
            const existing = id === "" ? null : store.getJob(id);
            if (existing === null) {
              json4(res, 404, { ok: false, error: `\u627E\u4E0D\u5230\u4EFB\u52A1 ${id}` });
              return;
            }
            const patch = {};
            if ("label" in params) patch.label = String(params.label ?? "");
            if ("prompt" in params) patch.prompt = String(params.prompt ?? "");
            if ("model" in params) patch.model = normalizeModelRef(params.model);
            if ("enabled" in params) patch.enabled = params.enabled === true;
            if ("scheduleType" in params || "type" in params || "schedule" in params) {
              const nextType = validateType2(
                ("scheduleType" in params ? params.scheduleType : void 0) ?? params.type ?? existing.type
              );
              if (nextType !== existing.type && !("schedule" in params)) {
                throw new Error("\u4FEE\u6539\u8C03\u5EA6\u7C7B\u578B\u65F6\u5FC5\u987B\u540C\u65F6\u63D0\u4F9B schedule");
              }
              patch.type = nextType;
              if ("schedule" in params) {
                patch.schedule = normalizeScheduleForWrite(nextType, params.schedule);
              }
            }
            const job = store.updateJob(id, patch);
            if (job === null) {
              json4(res, 404, { ok: false, error: `\u627E\u4E0D\u5230\u4EFB\u52A1 ${id}` });
              return;
            }
            json4(res, 200, { ok: true, job, ...jobsPayload() });
            return;
          }
          case "duplicate": {
            const id = typeof params.id === "string" ? params.id : "";
            const source = id === "" ? null : store.getJob(id);
            if (source === null) {
              json4(res, 404, { ok: false, error: `\u627E\u4E0D\u5230\u4EFB\u52A1 ${id}` });
              return;
            }
            const job = store.addJob({
              type: source.type,
              schedule: source.schedule,
              prompt: source.prompt,
              label: `${source.label} (\u526F\u672C)`,
              model: source.model,
              enabled: false
            });
            json4(res, 200, { ok: true, job, ...jobsPayload() });
            return;
          }
          case "run_now": {
            const id = typeof params.id === "string" ? params.id : "";
            const engine = scheduler();
            if (engine === null) {
              json4(res, 503, { ok: false, error: "\u6A21\u578B\u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u6267\u884C\u4EFB\u52A1" });
              return;
            }
            if (id === "" || store.getJob(id) === null) {
              json4(res, 404, { ok: false, error: `\u627E\u4E0D\u5230\u4EFB\u52A1 ${id}` });
              return;
            }
            const started = engine.runNow(id);
            started.catch(() => {
            });
            const immediate = await Promise.race([
              started.then(() => null, (error) => error),
              new Promise((resolve2) => {
                setTimeout(() => resolve2(null), 0);
              })
            ]);
            if (immediate !== null) {
              const message = immediate instanceof Error ? immediate.message : String(immediate);
              const status2 = immediate.code === "job_busy" ? 409 : 400;
              json4(res, status2, { ok: false, error: message });
              return;
            }
            json4(res, 200, { ok: true, ...jobsPayload() });
            return;
          }
          case "cancel": {
            const id = typeof params.id === "string" ? params.id : "";
            const engine = scheduler();
            if (engine === null || id === "" || !engine.cancel(id)) {
              json4(res, 409, { ok: false, error: "\u8BE5\u4EFB\u52A1\u5F53\u524D\u6CA1\u6709\u6B63\u5728\u6267\u884C\u7684\u8FD0\u884C" });
              return;
            }
            json4(res, 200, { ok: true, ...jobsPayload() });
            return;
          }
          case "clear_runs": {
            const id = typeof params.id === "string" ? params.id : "";
            if (id === "" || store.getJob(id) === null) {
              json4(res, 404, { ok: false, error: `\u627E\u4E0D\u5230\u4EFB\u52A1 ${id}` });
              return;
            }
            store.clearRunHistory(id);
            json4(res, 200, { ok: true, runs: [] });
            return;
          }
          case "apply_suggestion": {
            const ref = typeof params.suggestionId === "string" && params.suggestionId.trim() !== "" ? params.suggestionId.trim() : typeof params.ref === "string" ? params.ref : null;
            const applied = await suggestions.apply({
              ref,
              value: isPlainObject3(params.jobData) ? params.jobData : void 0
            });
            if (!applied.ok) {
              const message = applied.reason === "already-applying" ? "\u5EFA\u8BAE\u6B63\u5728\u5E94\u7528\u4E2D" : applied.reason === "expired" ? "\u5EFA\u8BAE\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u8BA9\u52A9\u624B\u91CD\u65B0\u53D1\u8D77" : "\u5EFA\u8BAE\u4E0D\u5B58\u5728\u6216\u5DF2\u5931\u6548";
              json4(res, applied.reason === "already-applying" ? 409 : 410, { ok: false, error: message, reason: applied.reason });
              return;
            }
            json4(res, 200, { ok: true, job: applied.result, jobs: store.listJobs(), suggestions: suggestions.list() });
            return;
          }
          default:
            json4(res, 400, { ok: false, error: `\u672A\u77E5\u52A8\u4F5C\uFF1A${String(body.action)}` });
        }
        return;
      }
      if (method === "GET" && rest === "/runs") {
        const limit = clampLimit(url.searchParams.get("limit"), 20);
        const statusFilter = url.searchParams.get("status");
        const keep = (run) => statusFilter === null || statusFilter === "" || statusFilter === "all" || run.status === statusFilter;
        const jobId = url.searchParams.get("jobId");
        if (jobId !== null && jobId !== "") {
          const runs = store.getRunHistory(jobId, limit).filter(keep).reverse();
          json4(res, 200, { ok: true, runs });
          return;
        }
        const jobs = store.listJobs();
        const labelOf = new Map(jobs.map((job) => [job.id, job.label]));
        const all = [];
        for (const job of jobs) {
          for (const run of store.getRunHistory(job.id, limit)) {
            if (keep(run)) all.push({ ...run, jobId: job.id, jobLabel: labelOf.get(job.id) ?? job.id });
          }
        }
        all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        json4(res, 200, { ok: true, runs: all.slice(0, limit) });
        return;
      }
      if (method === "GET" && rest === "/runs/file") {
        const jobId = url.searchParams.get("jobId") ?? "";
        const name2 = url.searchParams.get("name") ?? "";
        if (!/^[A-Za-z0-9_-]+$/.test(jobId)) {
          json4(res, 400, { ok: false, error: "invalid jobId" });
          return;
        }
        if (!/^[A-Za-z0-9_-]+\.md$/.test(name2)) {
          json4(res, 400, { ok: false, error: "invalid file name" });
          return;
        }
        try {
          const content = readFileSync3(join7(automationDataRoot(), "runs", jobId, name2), "utf-8");
          json4(res, 200, { ok: true, content });
        } catch {
          json4(res, 404, { ok: false, error: "\u4EA7\u51FA\u6587\u4EF6\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u6E05\u7406" });
        }
        return;
      }
      if (method === "GET" && rest === "/suggestions") {
        json4(res, 200, { ok: true, suggestions: suggestions.list() });
        return;
      }
      if (method === "POST" && rest === "/suggestions") {
        const body = await readBody3(req);
        const ref = typeof body.suggestionId === "string" ? body.suggestionId : "";
        const dismissed = ref !== "" && body.action === "dismiss" && suggestions.dismiss(ref);
        if (!dismissed) {
          json4(res, 404, { ok: false, error: "\u5EFA\u8BAE\u4E0D\u5B58\u5728\u6216\u5DF2\u5931\u6548" });
          return;
        }
        json4(res, 200, { ok: true, suggestions: suggestions.list() });
        return;
      }
      if (rest === "/settings") {
        if (method === "POST") {
          const body = await readBody3(req);
          if (typeof body.autoApprove === "boolean") {
            await settings.write({ autoApprove: body.autoApprove });
          }
        } else if (method !== "GET") {
          json4(res, 405, { ok: false, error: "method not allowed" });
          return;
        }
        json4(res, 200, { ok: true, ...settings.read() });
        return;
      }
      if (method === "GET" && rest === "/events") {
        const since = Number.parseInt(url.searchParams.get("since") ?? "0", 10) || 0;
        const { events: pending, cursor } = events.since(since);
        json4(res, 200, { ok: true, events: pending, cursor });
        return;
      }
      json4(res, 404, { ok: false, error: `no route for ${method} ${rest}` });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      json4(res, errorStatus(error), { ok: false, error: message });
    }
  }
  const dispose = webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX3,
    handler: (req, res) => {
      void handle4(req, res);
    }
  });
  return dispose;
}
function clampLimit(raw, fallback) {
  const value = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(100, value);
}
function isPlainObject3(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// src/automation/index.ts
function settingsPath() {
  return join8(automationDataRoot(), "settings.json");
}
function readAutoApprove() {
  try {
    const raw = readFileSync4(settingsPath(), "utf-8");
    const data = JSON.parse(raw);
    return data.autoApprove === true;
  } catch {
    return false;
  }
}
async function writeAutoApprove(patch) {
  let current = {};
  try {
    current = JSON.parse(readFileSync4(settingsPath(), "utf-8"));
  } catch {
    current = {};
  }
  if (patch.autoApprove !== void 0) current.autoApprove = patch.autoApprove === true;
  mkdirSync3(dirname3(settingsPath()), { recursive: true });
  writeFileSync3(settingsPath(), JSON.stringify(current, null, 2) + "\n", "utf-8");
  void existsSync2;
}
function applyAutomationHost(ctx) {
  const webServer = ctx.get("webServer") ?? ctx.webServer;
  if (webServer === void 0) return;
  migrateLegacyAutomationData();
  const store = new CronStore();
  const suggestions = new AutomationSuggestionStore();
  const events = createAutomationEventBuffer();
  const llm = ctx.get("llm") ?? ctx.llm;
  const executing = /* @__PURE__ */ new Map();
  let scheduler = null;
  if (llm !== void 0) {
    scheduler = createCronScheduler({
      store,
      executeJob: (job) => {
        const ac = new AbortController();
        executing.set(job.id, ac);
        return executeJob(ctx, llm, job, ac.signal).finally(() => {
          executing.delete(job.id);
        });
      },
      abortJob: (job) => {
        executing.get(job.id)?.abort();
      },
      onJobDone: (job, result) => {
        events.push(job, result);
        const status2 = typeof result.status === "string" ? result.status : "skipped";
        if (status2 === "error") {
          ctx.logger?.warn?.("[triad-automation] \u4EFB\u52A1\u5931\u8D25 " + job.label + " (" + job.id + "): " + String(result.error ?? ""));
        } else if (status2 === "success") {
          ctx.logger?.info?.("[triad-automation] \u4EFB\u52A1\u5B8C\u6210 " + job.label + " (" + job.id + ")");
        }
      }
    });
    scheduler.start();
  } else {
    ctx.logger?.warn?.("[triad-automation] llm \u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u8C03\u5EA6\u5668\u672A\u542F\u52A8\uFF08CRUD \u4E0E\u5EFA\u8BAE\u4ECD\u53EF\u7528\uFF09");
  }
  const disposeRoutes = registerAutomationRoutes({
    ctx,
    webServer,
    store,
    suggestions,
    events,
    scheduler: () => scheduler,
    settings: {
      read: () => ({ autoApprove: readAutoApprove() }),
      write: async (patch) => {
        await writeAutoApprove(patch);
      }
    }
  });
  let disposeTool = null;
  try {
    disposeTool = registerAutomationTool({
      ctx,
      store,
      suggestions,
      scheduler: () => scheduler,
      isAutoApprove: () => readAutoApprove()
    });
  } catch {
  }
  ctx.effect(() => () => {
    void scheduler?.stop();
    scheduler = null;
    disposeTool?.();
    disposeTool = null;
    disposeRoutes();
  }, "triad: automation host");
}

// src/skill-toggles.ts
import { mkdir as mkdir4, readFile as readFile5, readdir as readdir3, rename as rename4, writeFile as writeFile4 } from "node:fs/promises";
import { homedir as homedir6 } from "node:os";
import { join as join9 } from "node:path";
import { URL as URL5 } from "node:url";
var SKILL_FILE2 = "SKILL.md";
var BUNDLES_FILE2 = ".bundles.json";
var PRESET_FILE = ".preset-skills.json";
var ROUTE_PREFIX4 = "/api/skill-toggles";
var MAX_BODY_BYTES = 256 * 1024;
var MASK_PROVIDER = "webui-preset-mask";
var MAX_PRESET_ENTRIES = 50;
function managedRoot2() {
  const agentsHome = process.env.DSH_AGENTS_HOME ?? join9(homedir6(), ".agents");
  return join9(agentsHome, "skills");
}
function dshRoot2() {
  const dshHome2 = process.env.DSH_HOME ?? join9(homedir6(), ".dsh");
  return join9(dshHome2, "skills");
}
async function readBundles2(root) {
  try {
    const parsed = JSON.parse(await readFile5(join9(root, BUNDLES_FILE2), "utf8"));
    if (typeof parsed === "object" && parsed !== null && parsed.version === 1 && Array.isArray(parsed.bundles)) {
      return parsed;
    }
  } catch {
  }
  return { version: 1, bundles: [] };
}
function isPresetId(value) {
  return /^[a-z0-9][a-z0-9-]*$/.test(value);
}
function isSkillName(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
function presetLedgerPath() {
  return join9(managedRoot2(), PRESET_FILE);
}
function normalizeLedger(input) {
  const presets = {};
  const raw = input !== null && typeof input === "object" ? input.presets : void 0;
  if (raw !== null && typeof raw === "object") {
    for (const [presetId, table] of Object.entries(raw)) {
      if (!isPresetId(presetId)) continue;
      if (table === null || typeof table !== "object") continue;
      if (Object.keys(presets).length >= MAX_PRESET_ENTRIES) break;
      const entries = {};
      for (const [skillName, state] of Object.entries(table)) {
        if (!isSkillName(skillName) || typeof state !== "boolean") continue;
        entries[skillName] = state;
      }
      presets[presetId] = entries;
    }
  }
  return { version: 1, presets };
}
var ledgerCache;
var maskInvalidators = /* @__PURE__ */ new Set();
async function readLedger() {
  if (ledgerCache !== void 0) return ledgerCache;
  let parsed;
  try {
    parsed = JSON.parse(await readFile5(presetLedgerPath(), "utf8"));
  } catch {
    parsed = void 0;
  }
  ledgerCache = normalizeLedger(parsed);
  return ledgerCache;
}
async function writeLedger(next) {
  const target = presetLedgerPath();
  const temp = `${target}.tmp`;
  await mkdir4(managedRoot2(), { recursive: true });
  await writeFile4(temp, `${JSON.stringify(next, null, 2)}
`, "utf8");
  await rename4(temp, target);
  ledgerCache = next;
  for (const invalidate of maskInvalidators) {
    try {
      invalidate();
    } catch {
    }
  }
}
function disabledNames(ledger, presetId) {
  const table = ledger.presets[presetId];
  if (table === void 0) return /* @__PURE__ */ new Set();
  const disabled = /* @__PURE__ */ new Set();
  for (const [skillName, state] of Object.entries(table)) {
    if (state === false) disabled.add(skillName);
  }
  return disabled;
}
async function setPresetSkills(presetId, names, enabled) {
  const current = await readLedger();
  const table = { ...current.presets[presetId] ?? {} };
  let changed = 0;
  for (const skillName of names) {
    if (!isSkillName(skillName)) continue;
    if (enabled) {
      if (table[skillName] !== void 0) {
        delete table[skillName];
        changed += 1;
      }
    } else if (table[skillName] !== false) {
      table[skillName] = false;
      changed += 1;
    }
  }
  if (changed === 0) return 0;
  const presets = { ...current.presets };
  if (Object.keys(table).length === 0) delete presets[presetId];
  else presets[presetId] = table;
  await writeLedger({ version: 1, presets });
  return changed;
}
async function skillDirUnder(root, skillName) {
  try {
    const info = await import("node:fs/promises").then((fs) => fs.stat(join9(root, skillName)));
    if (info.isDirectory()) return join9(root, skillName);
  } catch {
  }
  return void 0;
}
async function locateSkillDir2(skillName) {
  const direct = await skillDirUnder(managedRoot2(), skillName) ?? await skillDirUnder(dshRoot2(), skillName);
  if (direct !== void 0) return direct;
  return await skillDirByFrontmatterName(skillName);
}
async function skillDirByFrontmatterName(skillName) {
  for (const root of [managedRoot2(), dshRoot2()]) {
    let entries = [];
    try {
      entries = (await readdir3(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      continue;
    }
    for (const dir of entries) {
      const name2 = await canonicalNameOf(root, dir);
      if (name2 !== void 0 && name2 === skillName) return join9(root, dir);
    }
  }
  return void 0;
}
async function canonicalNameOf(root, dir) {
  try {
    const raw = await readFile5(join9(root, dir, SKILL_FILE2), "utf8");
    const field = splitFrontmatter(raw).fields.find((item) => item.key === "name")?.value;
    return field !== void 0 && field !== "" ? field : dir;
  } catch {
    return void 0;
  }
}
async function skillNameIndex() {
  const index = /* @__PURE__ */ new Map();
  for (const root of [managedRoot2(), dshRoot2()]) {
    let entries = [];
    try {
      entries = (await readdir3(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      continue;
    }
    for (const dir of entries) {
      const name2 = await canonicalNameOf(root, dir);
      if (name2 === void 0) continue;
      if (!index.has(dir)) index.set(dir, name2);
      if (!index.has(name2)) index.set(name2, name2);
    }
  }
  return index;
}
async function canonicalSkillNames(entries) {
  const index = await skillNameIndex();
  const names = [];
  for (const entry of entries) {
    const name2 = index.get(entry) ?? entry;
    if (!names.includes(name2)) names.push(name2);
  }
  return names;
}
async function readSkillFile2(skillName) {
  const dir = await locateSkillDir2(skillName);
  if (dir === void 0) return void 0;
  try {
    return { dir, raw: await readFile5(join9(dir, SKILL_FILE2), "utf8") };
  } catch {
    return void 0;
  }
}
function splitFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (match === null) {
    return { hasFence: false, fields: [], body: raw };
  }
  const block = match[1];
  const fields = [];
  for (const line of block.split(/\r?\n/)) {
    const pair = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (pair !== null) fields.push({ key: pair[1], value: pair[2].trim() });
  }
  return { hasFence: true, fields, body: raw.slice(match[0].length) };
}
function applyToggle(raw, enabled) {
  const parsed = splitFrontmatter(raw);
  const toggleKeys = /* @__PURE__ */ new Set(["user-invocable", "disable-model-invocation"]);
  const kept = parsed.fields.filter((field) => !toggleKeys.has(field.key));
  const lines = kept.map((field) => `${field.key}: ${field.value}`);
  if (!enabled) {
    lines.push("user-invocable: false");
    lines.push("disable-model-invocation: true");
  }
  const block = lines.join("\n");
  if (parsed.hasFence) {
    return `---
${block}
---
${parsed.body}`;
  }
  const body = parsed.body.startsWith("\n") ? parsed.body.slice(1) : parsed.body;
  return `---
${block}
---
${body}`;
}
function parseEnabled(fields) {
  const userInvocable = fields.find((field) => field.key === "user-invocable")?.value;
  const disableModel = fields.find((field) => field.key === "disable-model-invocation")?.value;
  const userDisabled = userInvocable?.toLowerCase() === "false";
  const modelDisabled = disableModel?.toLowerCase() === "true";
  return !(userDisabled || modelDisabled);
}
async function setSkillEnabled(skillName, enabled) {
  const found = await readSkillFile2(skillName);
  if (found === void 0) return false;
  const updated = applyToggle(found.raw, enabled);
  if (updated === found.raw) return true;
  const target = join9(found.dir, SKILL_FILE2);
  const temp = `${target}.toggle.tmp`;
  await mkdir4(found.dir, { recursive: true });
  await writeFile4(temp, updated, "utf8");
  await rename4(temp, target);
  return true;
}
async function setBundleEnabled(bundleId, enabled) {
  const root = managedRoot2();
  const ledger = await readBundles2(root);
  const record = ledger.bundles.find((bundle) => bundle.id === bundleId);
  if (record === void 0) return -1;
  let handled = 0;
  for (const skillName of record.skills) {
    if (await setSkillEnabled(skillName, enabled)) handled += 1;
  }
  return handled;
}
async function status() {
  const skills = {};
  const seen = /* @__PURE__ */ new Set();
  for (const root of [managedRoot2(), dshRoot2()]) {
    let entries = [];
    try {
      entries = (await readdir3(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      continue;
    }
    for (const dir of entries) {
      if (seen.has(dir)) continue;
      seen.add(dir);
      try {
        const raw = await readFile5(join9(root, dir, SKILL_FILE2), "utf8");
        const fields = splitFrontmatter(raw).fields;
        const nameField = fields.find((field) => field.key === "name")?.value;
        const name2 = nameField !== void 0 && nameField !== "" ? nameField : dir;
        skills[name2] = parseEnabled(fields);
      } catch {
      }
    }
  }
  const bundles = {};
  const ledger = await readBundles2(managedRoot2());
  const alias = await skillNameIndex();
  for (const record of ledger.bundles) {
    const states = record.skills.map((skillName) => skills[alias.get(skillName) ?? skillName]);
    bundles[record.id] = states.length === 0 || states.every((state) => state !== false);
  }
  return { skills, bundles };
}
function installMask(ctx, agent) {
  const presetOf = () => {
    const presets = ctx.get?.("agentPresets");
    if (presets?.composedPreset === void 0) return "";
    try {
      return presets.composedPreset(agent.ctx) ?? "";
    } catch {
      return "";
    }
  };
  return agent.ctx.inject(["skills"], (scope) => {
    scope.skills.registerProvider((control) => {
      maskInvalidators.add(control.invalidate);
      control.signal.addEventListener("abort", () => {
        maskInvalidators.delete(control.invalidate);
      }, { once: true });
      return {
        name: MASK_PROVIDER,
        list: async () => {
          const presetId = presetOf();
          if (presetId === "") return [];
          const disabled = disabledNames(await readLedger(), presetId);
          if (disabled.size === 0) return [];
          return [...disabled].map((skillName) => ({
            name: skillName,
            description: `disabled for agent preset "${presetId}"`,
            invocation: { modelInvocable: false, userInvocable: false },
            source: "custom",
            provider: MASK_PROVIDER,
            rank: 0,
            locator: null
          }));
        },
        // 被遮住的名字没有可加载的正文:调用方拿到 undefined 即等于「不存在」。
        get: async () => void 0
      };
    });
  });
}
async function readRoster(ctx) {
  const presets = ctx.get?.("agentPresets");
  if (presets?.list === void 0) return [];
  try {
    const rows = await presets.list();
    const defaultId = presets.defaultId;
    return (Array.isArray(rows) ? rows : []).map((row) => ({
      id: String(row?.id ?? ""),
      trust: row?.trust === "system" ? "system" : "user",
      isDefault: row?.id === defaultId,
      ...typeof row?.name === "string" ? { name: row.name } : {},
      ...typeof row?.description === "string" ? { description: row.description } : {},
      ...typeof row?.order === "number" ? { order: row.order } : {}
    })).filter((row) => row.id !== "");
  } catch (error) {
    console.log("[skill-toggles] agentPresets.list failed:", error?.message ?? error);
    return [];
  }
}
function isLoopbackAddress5(address) {
  if (typeof address !== "string") return false;
  const a = address.toLowerCase();
  if (a === "::1") return true;
  const ipv4 = a.startsWith("::ffff:") ? a.slice(7) : a;
  const octets = ipv4.split(".");
  return octets.length === 4 && octets[0] === "127" && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function hostNameOf5(value) {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase();
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    if (close <= 1) return null;
    const suffix = host.slice(close + 1);
    if (suffix !== "" && !/^:\d+$/.test(suffix)) return null;
    return host.slice(1, close);
  }
  const firstColon = host.indexOf(":");
  const lastColon = host.lastIndexOf(":");
  if (firstColon !== lastColon) return null;
  return firstColon === -1 ? host : host.slice(0, firstColon);
}
function loopbackAllowed4(req) {
  if (!isLoopbackAddress5(req.socket.remoteAddress)) return false;
  const host = hostNameOf5(req.headers.host);
  if (host === null) return false;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}
function json5(res, status2, value) {
  const body = JSON.stringify(value);
  res.writeHead(status2, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache"
  });
  res.end(body);
}
function readBody4(req) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) {
        resolvePromise({});
        return;
      }
      try {
        resolvePromise(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}
async function handle3(ctx, req, res) {
  if (!loopbackAllowed4(req)) {
    json5(res, 403, { error: "loopback-only" });
    return;
  }
  const url = new URL5(req.url ?? "/", "http://localhost");
  const rest = url.pathname.slice(ROUTE_PREFIX4.length);
  const method = req.method ?? "GET";
  try {
    if (method === "GET" && (rest === "" || rest === "/status")) {
      json5(res, 200, await status());
      return;
    }
    const matchSkill = /^\/skills\/([^/]+)$/.exec(rest);
    if (method === "PUT" && matchSkill !== null) {
      const body = await readBody4(req);
      const enabled = body.enabled;
      if (typeof enabled !== "boolean") throw new Error("enabled must be a boolean");
      const name2 = decodeURIComponent(matchSkill[1]);
      const ok = await setSkillEnabled(name2, enabled);
      if (!ok) throw new Error(`skill ${JSON.stringify(name2)} not found`);
      json5(res, 200, { ok: true, name: name2, enabled });
      return;
    }
    const matchBundle = /^\/bundles\/([^/]+)$/.exec(rest);
    if (method === "PUT" && matchBundle !== null) {
      const body = await readBody4(req);
      const enabled = body.enabled;
      if (typeof enabled !== "boolean") throw new Error("enabled must be a boolean");
      const id = decodeURIComponent(matchBundle[1]);
      const handled = await setBundleEnabled(id, enabled);
      if (handled < 0) throw new Error(`bundle ${JSON.stringify(id)} not found`);
      json5(res, 200, { ok: true, id, enabled, handled });
      return;
    }
    if (method === "GET" && rest === "/presets") {
      const [roster, global, ledger] = await Promise.all([
        readRoster(ctx),
        status(),
        readLedger()
      ]);
      json5(res, 200, {
        presets: roster,
        overrides: ledger.presets,
        skills: global.skills,
        bundles: global.bundles
      });
      return;
    }
    const matchPresetSkill = /^\/presets\/([^/]+)\/skills\/([^/]+)$/.exec(rest);
    if (method === "PUT" && matchPresetSkill !== null) {
      const body = await readBody4(req);
      const enabled = body.enabled;
      if (typeof enabled !== "boolean") throw new Error("enabled must be a boolean");
      const presetId = decodeURIComponent(matchPresetSkill[1]);
      if (!isPresetId(presetId)) throw new Error(`invalid preset id ${JSON.stringify(presetId)}`);
      const skillName = decodeURIComponent(matchPresetSkill[2]);
      if (!isSkillName(skillName)) throw new Error(`invalid skill name ${JSON.stringify(skillName)}`);
      const changed = await setPresetSkills(presetId, [skillName], enabled);
      json5(res, 200, { ok: true, preset: presetId, name: skillName, enabled, changed });
      return;
    }
    const matchPresetBundle = /^\/presets\/([^/]+)\/bundles\/([^/]+)$/.exec(rest);
    if (method === "PUT" && matchPresetBundle !== null) {
      const body = await readBody4(req);
      const enabled = body.enabled;
      if (typeof enabled !== "boolean") throw new Error("enabled must be a boolean");
      const presetId = decodeURIComponent(matchPresetBundle[1]);
      if (!isPresetId(presetId)) throw new Error(`invalid preset id ${JSON.stringify(presetId)}`);
      const bundleId = decodeURIComponent(matchPresetBundle[2]);
      const ledger = await readBundles2(managedRoot2());
      const record = ledger.bundles.find((bundle) => bundle.id === bundleId);
      if (record === void 0) throw new Error(`bundle ${JSON.stringify(bundleId)} not found`);
      const changed = await setPresetSkills(presetId, await canonicalSkillNames(record.skills), enabled);
      json5(res, 200, { ok: true, preset: presetId, id: bundleId, enabled, changed });
      return;
    }
    const matchPresetReset = /^\/presets\/([^/]+)\/reset$/.exec(rest);
    if (method === "POST" && matchPresetReset !== null) {
      const presetId = decodeURIComponent(matchPresetReset[1]);
      if (!isPresetId(presetId)) throw new Error(`invalid preset id ${JSON.stringify(presetId)}`);
      const current = await readLedger();
      if (current.presets[presetId] !== void 0) {
        const presets = { ...current.presets };
        delete presets[presetId];
        await writeLedger({ version: 1, presets });
      }
      json5(res, 200, { ok: true, preset: presetId });
      return;
    }
    json5(res, 404, { error: `no route for ${method} ${rest}` });
  } catch (error) {
    json5(res, 400, { error: error instanceof Error ? error.message : String(error) });
  }
}
async function apply3(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX4,
    handler: (req, res) => {
      void handle3(ctx, req, res);
    }
  }), "webui: skill-toggles routes");
  ctx.effect(() => {
    const fibers = /* @__PURE__ */ new Map();
    const install = (agent) => {
      if (agent === void 0 || fibers.has(agent)) return;
      try {
        fibers.set(agent, installMask(ctx, agent));
      } catch (error) {
        console.log("[skill-toggles] preset mask install failed:", error?.message ?? error);
      }
    };
    const remove = (agent) => {
      const fiber = fibers.get(agent);
      if (fiber === void 0) return;
      fibers.delete(agent);
      void Promise.resolve(fiber.dispose?.()).catch(() => {
      });
    };
    const agents = ctx.get?.("agents");
    if (agents?.list !== void 0) for (const agent of agents.list()) install(agent);
    const offCreated = ctx.on("agent/created", ({ agent }) => {
      install(agent);
    });
    const offDisposed = ctx.on("agent/disposed", ({ agent }) => {
      remove(agent);
    });
    return () => {
      offCreated();
      offDisposed();
      for (const agent of [...fibers.keys()]) remove(agent);
      maskInvalidators.clear();
    };
  }, "webui: skill-toggles preset masks");
}

// src/skill-health.ts
import { readdir as readdir4, readFile as readFile6 } from "node:fs/promises";
import { homedir as homedir7 } from "node:os";
import { join as join10 } from "node:path";
var SKILL_FILE3 = "SKILL.md";
var BUNDLES_FILE3 = ".bundles.json";
var ROUTE_PATH = "/api/skill-health";
function managedRoot3() {
  const agentsHome = process.env.DSH_AGENTS_HOME ?? join10(homedir7(), ".agents");
  return join10(agentsHome, "skills");
}
function dshRoot3() {
  const dshHome2 = process.env.DSH_HOME ?? join10(homedir7(), ".dsh");
  return join10(dshHome2, "skills");
}
function parseFrontmatter2(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  const block = match?.[1];
  if (block === void 0) return {};
  const fields = {};
  for (const line of block.split(/\r?\n/)) {
    const pair = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    const key = pair?.[1];
    const valueText = pair?.[2];
    if (key === void 0 || valueText === void 0) continue;
    const value = valueText.trim();
    if (value === "true") fields[key] = true;
    else if (value === "false") fields[key] = false;
    else fields[key] = value;
  }
  return fields;
}
async function readBundles3(root) {
  try {
    const parsed = JSON.parse(await readFile6(join10(root, BUNDLES_FILE3), "utf8"));
    if (typeof parsed === "object" && parsed !== null && parsed.version === 1 && Array.isArray(parsed.bundles)) {
      return parsed;
    }
  } catch {
  }
  return { version: 1, bundles: [] };
}
async function scanRoot(root, nameSet) {
  const issues = [];
  let entries = [];
  try {
    entries = (await readdir4(root, { withFileTypes: true })).filter((entry) => entry.isDirectory());
  } catch {
    return { healthy: 0, issues };
  }
  let healthy = 0;
  for (const entry of entries) {
    nameSet.add(entry.name);
    let raw;
    try {
      raw = await readFile6(join10(root, entry.name, SKILL_FILE3), "utf8");
    } catch {
      issues.push({
        level: "error",
        code: "missing-skill-md",
        skill: entry.name,
        message: `\u76EE\u5F55\u300C${entry.name}\u300D\u7F3A\u5C11 ${SKILL_FILE3}\uFF0C\u6280\u80FD\u9762\u677F\u4E0D\u4F1A\u663E\u793A\u5B83`
      });
      continue;
    }
    const fields = parseFrontmatter2(raw);
    const fmName = typeof fields.name === "string" && fields.name !== "" ? fields.name : null;
    if (fmName === null || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(fmName)) {
      issues.push({
        level: "error",
        code: "bad-frontmatter",
        skill: entry.name,
        message: `\u300C${entry.name}\u300D\u7684 ${SKILL_FILE3} \u7F3A\u5C11\u6709\u6548\u7684 name \u5B57\u6BB5`
      });
      continue;
    }
    nameSet.add(fmName);
    if (fmName !== entry.name) {
      issues.push({
        level: "warn",
        code: "name-mismatch",
        skill: entry.name,
        message: `\u76EE\u5F55\u300C${entry.name}\u300D\u4E0E frontmatter name\u300C${fmName}\u300D\u4E0D\u4E00\u81F4\uFF0C\u6253\u5F00\u6280\u80FD\u6587\u4EF6\u53EF\u80FD 404`
      });
    }
    healthy += 1;
  }
  return { healthy, issues };
}
async function healthCheck() {
  const issues = [];
  const nameSet = /* @__PURE__ */ new Set();
  const a = await scanRoot(managedRoot3(), nameSet);
  const b = await scanRoot(dshRoot3(), nameSet);
  const healthy = a.healthy + b.healthy;
  issues.push(...a.issues, ...b.issues);
  const ledger = await readBundles3(managedRoot3());
  for (const record of ledger.bundles) {
    for (const skillName of record.skills) {
      if (!nameSet.has(skillName)) {
        issues.push({
          level: "error",
          code: "dangling-bundle",
          skill: skillName,
          bundle: record.name,
          message: `Bundle\u300C${record.name}\u300D\u5F15\u7528\u4E86\u4E0D\u5B58\u5728\u7684\u6280\u80FD\u300C${skillName}\u300D`
        });
      }
    }
  }
  return { ok: issues.every((issue) => issue.level !== "error"), healthy, issues };
}
function isLoopbackAddress6(address) {
  if (typeof address !== "string") return false;
  const a = address.toLowerCase();
  if (a === "::1") return true;
  const ipv4 = a.startsWith("::ffff:") ? a.slice(7) : a;
  const octets = ipv4.split(".");
  return octets.length === 4 && octets[0] === "127" && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function hostNameOf6(value) {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase();
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    if (close <= 1) return null;
    const suffix = host.slice(close + 1);
    if (suffix !== "" && !/^:\d+$/.test(suffix)) return null;
    return host.slice(1, close);
  }
  const firstColon = host.indexOf(":");
  const lastColon = host.lastIndexOf(":");
  if (firstColon !== lastColon) return null;
  return firstColon === -1 ? host : host.slice(0, firstColon);
}
function loopbackAllowed5(req) {
  if (!isLoopbackAddress6(req.socket.remoteAddress)) return false;
  const host = hostNameOf6(req.headers.host);
  if (host === null) return false;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}
function json6(res, status2, value) {
  const body = JSON.stringify(value);
  res.writeHead(status2, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache"
  });
  res.end(body);
}
function applySkillHealth(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: ROUTE_PATH,
    handler: (req, res) => {
      void (async () => {
        if (!loopbackAllowed5(req)) {
          json6(res, 403, { error: "loopback-only" });
          return;
        }
        const url = new URL(req.url ?? "/", "http://localhost");
        if (url.pathname === ROUTE_PATH || url.pathname === `${ROUTE_PATH}/`) {
          json6(res, 200, await healthCheck());
          return;
        }
        json6(res, 404, { error: `no route for ${req.method ?? "GET"} ${url.pathname}` });
      })();
    }
  }), "dsh-skill-health: routes");
}

// src/mcp-recommended.ts
var ROUTE_PATH2 = "/api/mcp-recommended";
var FETCH_TIMEOUT_MS = 8e3;
var CACHE_TTL_MS = 5 * 60 * 1e3;
var FALLBACK = [
  { id: "filesystem", name: "Filesystem MCP", description: "\u63D0\u4F9B\u5B89\u5168\u7684\u6587\u4EF6\u7CFB\u7EDF\u8BBF\u95EE\u80FD\u529B\uFF0C\u652F\u6301\u8BFB\u53D6\u3001\u5199\u5165\u3001\u641C\u7D22\u6587\u4EF6\u3002", url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem", tag: "official", category: "\u6587\u4EF6" },
  { id: "websearch", name: "Web Search MCP", description: "\u96C6\u6210\u7F51\u7EDC\u641C\u7D22\u80FD\u529B\uFF0C\u83B7\u53D6\u5B9E\u65F6\u4FE1\u606F\u548C\u7F51\u9875\u5185\u5BB9\u3002", url: "https://github.com/modelcontextprotocol/servers/tree/main/src/web-search", tag: "official", category: "\u641C\u7D22" },
  { id: "github", name: "GitHub MCP", description: "\u8BBF\u95EE GitHub \u4ED3\u5E93\u3001Issue\u3001\u7BA1\u7406\u4EE3\u7801\u3001Pull Request \u7B49\u3002", url: "https://github.com/github/github-mcp-server", tag: "official", category: "\u5F00\u53D1" },
  { id: "database", name: "Database MCP", description: "\u8FDE\u63A5\u5E76\u67E5\u8BE2\u591A\u79CD\u6570\u636E\u5E93\uFF0C\u652F\u6301 SQL \u6267\u884C\u548C\u6570\u636E\u5206\u6790\u3002", url: "https://github.com/designcomputer/mysql_mcp_server", tag: "community", category: "\u6570\u636E" },
  { id: "slack", name: "Slack MCP", description: "\u4E0E Slack \u5DE5\u4F5C\u533A\u96C6\u6210\uFF0C\u53D1\u9001\u6D88\u606F\u3001\u8BFB\u53D6\u9891\u9053\u548C\u7BA1\u7406\u901A\u77E5\u3002", url: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack", tag: "official", category: "\u534F\u4F5C" }
];
var OFFICIAL_SOURCE = "https://raw.githubusercontent.com/modelcontextprotocol/servers/main/README.md";
var AWESOME_SOURCE = "https://raw.githubusercontent.com/wong2/awesome-mcp-servers/main/README.md";
var REGISTRY_SOURCE = "https://registry.modelcontextprotocol.io/v0/servers?limit=40";
var SEARCH_ROUTE = "/api/mcp-recommended/search";
var RESOLVE_ROUTE = "/api/mcp-recommended/resolve";
async function gitHubSearch(q) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(`"mcp server" ${q}`)}&sort=stars&per_page=10`;
  const raw = await fetchWithTimeout(url);
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  return items.filter((item) => typeof item.full_name === "string" && item.full_name !== "").filter((item) => {
    const text = `${item.full_name} ${typeof item.description === "string" ? item.description : ""}`;
    return /mcp/i.test(text);
  }).map((item) => ({
    source: "github",
    id: `gh-${item.full_name.toLowerCase()}`,
    name: item.full_name,
    description: typeof item.description === "string" ? item.description : "",
    url: typeof item.html_url === "string" ? item.html_url : `https://github.com/${item.full_name}`,
    stars: typeof item.stargazers_count === "number" ? item.stargazers_count : void 0
  }));
}
async function registrySearch(q) {
  const raw = await fetchWithTimeout(`${REGISTRY_SOURCE}&search=${encodeURIComponent(q)}`);
  const parsed = JSON.parse(raw);
  const entries = Array.isArray(parsed.servers) ? parsed.servers : [];
  const rows = [];
  const ql = q.toLowerCase();
  for (const entry of entries) {
    const server = entry.server ?? {};
    const name2 = typeof server.title === "string" && server.title !== "" ? server.title : typeof server.name === "string" ? server.name : "";
    if (name2 === "") continue;
    const description = typeof server.description === "string" ? server.description : "";
    if (ql !== "" && !name2.toLowerCase().includes(ql) && !description.toLowerCase().includes(ql)) continue;
    let url;
    for (const remote of Array.isArray(server.remotes) ? server.remotes : []) {
      if (typeof remote.url === "string" && /^https?:/.test(remote.url)) {
        url = remote.url;
        break;
      }
    }
    rows.push({ source: "registry", id: `registry-${name2.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 48)}`, name: name2, description, url });
    if (rows.length >= 10) break;
  }
  return rows;
}
var SEARCH_CACHE_TTL_MS = 60 * 1e3;
var searchCache = /* @__PURE__ */ new Map();
async function searchServers(qRaw) {
  const q = qRaw.trim();
  if (q.length < 2) return [];
  const key = q.toLowerCase();
  const hit = searchCache.get(key);
  if (hit !== void 0 && Date.now() - hit.at < SEARCH_CACHE_TTL_MS) return hit.value;
  const merged = [];
  const seen = /* @__PURE__ */ new Set();
  for (const results of await Promise.allSettled([gitHubSearch(q), registrySearch(q), awesomeSearch(q)])) {
    if (results.status !== "fulfilled") continue;
    for (const item of results.value) {
      const k = item.name.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      merged.push(item);
      if (merged.length >= 16) break;
    }
  }
  searchCache.set(key, { at: Date.now(), value: merged });
  return merged;
}
function resolveCommand(readme) {
  const jsonCandidates = Array.from(readme.matchAll(/"command"\s*:\s*"([^"]+)"/g)).map((match) => match[1].trim()).filter((command) => command.length > 4 && /^(npx|uvx|uv|python|deno|bunx|node|pipx)/.test(command));
  if (jsonCandidates.length > 0) {
    return jsonCandidates.sort((a, b) => b.length - a.length)[0];
  }
  const bare = /(?:^|\n)\s*(npx\s+-y\s+\S+|uvx\s+\S+|uv\s+run\s+\S+|python\s+-m\s+\S+|deno\s+run\s+\S+|bunx\s+\S+)[^\r\n"<]*/.exec(readme);
  if (bare) return bare[1].trim();
  return void 0;
}
function resolveEndpoint(readme) {
  const badHost = /img\.shields\.io|raw\.githubusercontent|github\.com\/|user-images|badge/i;
  const sse = /https?:\/\/[^\s"'<>()]+(?:\/sse)[^\s"'<>()]*/.exec(readme);
  if (sse && !badHost.test(sse[0])) return { url: sse[0], type: "sse" };
  const http = /https?:\/\/[^\s"'<>()]+(?:\/mcp)[^\s"'<>()]*/.exec(readme);
  if (http && !badHost.test(http[0])) return { url: http[0], type: "http" };
  return void 0;
}
async function resolveServer(repoUrl) {
  const match = /github\.com\/([^/]+)\/([^/#?]+)/.exec(repoUrl);
  if (match === null) return { ok: false };
  const fullName = `${match[1]}/${match[2].replace(/\.git$/, "")}`;
  let readme = "";
  for (const name2 of ["README.md", "README.MD", "readme.md", "README.rst"]) {
    try {
      readme = await fetchWithTimeout(`https://raw.githubusercontent.com/${fullName}/HEAD/${name2}`);
      break;
    } catch {
    }
  }
  if (readme === "") return { ok: false };
  const command = resolveCommand(readme);
  if (command !== void 0) return { ok: true, type: "stdio", command };
  const endpoint = resolveEndpoint(readme);
  if (endpoint !== void 0) return { ok: true, type: endpoint.type, url: endpoint.url };
  return { ok: false };
}
function categorize(description) {
  const text = description.toLowerCase();
  if (/file|filesystem|文件|目录/.test(text)) return "\u6587\u4EF6";
  if (/search|搜索|browser|网页|web\s/.test(text)) return "\u641C\u7D22";
  if (/git|github|code|repo|repo|代码|开发/.test(text)) return "\u5F00\u53D1";
  if (/db|database|sql|postgres|mysql|mongo|数据/.test(text)) return "\u6570\u636E";
  if (/slack|teams|notion|calendar|mail|协作|会议|通知/.test(text)) return "\u534F\u4F5C";
  if (/cloud|aws|gcp|azure|云/.test(text)) return "\u4E91";
  return "\u7CBE\u9009";
}
function plainText(cell) {
  return cell.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/^\s*\*+\s*/, "").trim();
}
function extractUrl(cell) {
  const direct = /(https?:\/\/[^\s)|]+)/.exec(cell);
  if (direct) return direct[1];
  const linkParam = /\(([^)]+)\)/.exec(cell);
  if (linkParam && /^https?:/.test(linkParam[1])) return linkParam[1];
  return void 0;
}
function parseReadme(raw) {
  const out = [];
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "" || /^\|?[\s|:-]+$/.test(trimmed) || /^#{1,6}\s/.test(trimmed)) continue;
    const table = /^\|\s*(.*?)\s*\|\s*$/.exec(trimmed);
    if (table) {
      const cells = table[1].split("|").map(plainText);
      const name2 = cells[0];
      if (name2 === "" || /^(name|名称|server|repository|repo)$/i.test(name2)) continue;
      let description = "";
      let url;
      for (const cell of cells) {
        const u = extractUrl(cell) ?? extractUrl(table[1].split("|")[cells.indexOf(cell)] ?? "");
        if (u !== void 0 && url === void 0) url = u;
        if (cell.length > description.length && !/^https?:/i.test(cell)) description = cell;
      }
      const fallbackUrl = extractUrl(table[1]);
      out.push({ name: name2, description: description === name2 ? "" : description, url: url ?? fallbackUrl });
      continue;
    }
    const bullet = /^\s*[-*]\s+(.*)$/.exec(trimmed);
    if (!bullet) continue;
    const body = bullet[1];
    const boldLink = /^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*\s*[-—:.]*\s*(.*)$/.exec(body);
    if (boldLink) {
      const name2 = plainText(boldLink[1]);
      if (name2 === "" || /^(name|名称)$/i.test(name2)) continue;
      out.push({ name: name2, description: plainText(boldLink[3]), url: /^https?:/.test(boldLink[2]) ? boldLink[2] : void 0 });
      continue;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)\s*[-—:.]*\s*(.*)$/.exec(body);
    if (link) {
      const name2 = plainText(link[1]);
      if (name2 === "" || /^(name|名称)$/i.test(name2)) continue;
      out.push({ name: name2, description: plainText(link[3]), url: /^https?:/.test(link[2]) ? link[2] : void 0 });
      continue;
    }
    const bold = /^\*\*([^*]+)\*\*\s*[-—:.]*\s*(.*)$/.exec(body);
    if (bold) {
      out.push({ name: plainText(bold[1]), description: plainText(bold[2]) });
      continue;
    }
  }
  return out;
}
async function fetchWithTimeout(url) {
  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: "follow",
        // GitHub API 强制要求 User-Agent（缺失返回 403）。
        headers: { "user-agent": "dsh-triad" }
      });
      if (!res.ok) throw new Error(`http ${res.status}`);
      return await res.text();
    } catch (error) {
      lastError = error;
      if (attempt === 0) await new Promise((resolve2) => setTimeout(resolve2, 500));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("fetch failed");
}
async function fetchSource(url, tag) {
  const raw = await fetchWithTimeout(url);
  return parseReadme(raw).filter((item) => item.name !== "" && !/\bSDK\b/i.test(item.name)).map((item, index) => ({
    id: `${tag}-${item.name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 48) || String(index)}`,
    name: item.name,
    description: item.description ?? "",
    url: item.url,
    tag,
    category: categorize(item.description)
  }));
}
var awesomeCache = null;
async function fetchAwesome() {
  if (awesomeCache !== null && Date.now() - awesomeCache.at < CACHE_TTL_MS) return awesomeCache.rows;
  const rows = await fetchSource(AWESOME_SOURCE, "community");
  awesomeCache = { at: Date.now(), rows };
  return rows;
}
async function awesomeSearch(q) {
  const rows = await fetchAwesome();
  const ql = q.toLowerCase();
  return rows.filter((row) => row.name.toLowerCase().includes(ql) || row.description.toLowerCase().includes(ql));
}
async function fetchRegistry() {
  const raw = await fetchWithTimeout(REGISTRY_SOURCE);
  const parsed = JSON.parse(raw);
  const entries = Array.isArray(parsed.servers) ? parsed.servers : [];
  const rows = [];
  for (const entry of entries) {
    const server = entry.server ?? {};
    const name2 = typeof server.title === "string" && server.title !== "" ? server.title : typeof server.name === "string" && server.name !== "" ? server.name : "";
    if (name2 === "") continue;
    const description = typeof server.description === "string" ? server.description : "";
    let url;
    for (const remote of Array.isArray(server.remotes) ? server.remotes : []) {
      if (typeof remote.url === "string" && /^https?:/.test(remote.url)) {
        url = remote.url;
        break;
      }
    }
    rows.push({
      id: `community-${name2.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 48)}`,
      name: name2,
      description,
      url,
      tag: "community",
      category: categorize(description)
    });
  }
  return rows;
}
async function buildRecommended() {
  const [awesome, official, community] = await Promise.allSettled([
    fetchAwesome(),
    fetchSource(OFFICIAL_SOURCE, "official"),
    fetchRegistry()
  ]);
  const awesomeRows = awesome.status === "fulfilled" ? awesome.value : [];
  const officialRows = official.status === "fulfilled" ? official.value : [];
  const communityRows = community.status === "fulfilled" ? community.value : [];
  if (awesomeRows.length === 0 && communityRows.length === 0 && officialRows.length === 0) {
    return { source: "offline", updatedAt: (/* @__PURE__ */ new Date()).toISOString(), servers: FALLBACK };
  }
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const row of [...awesomeRows, ...communityRows, ...officialRows]) {
    const key = row.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(row);
    if (merged.length >= 60) break;
  }
  return { source: "official+community", updatedAt: (/* @__PURE__ */ new Date()).toISOString(), servers: merged };
}
var cache = null;
async function getRecommended() {
  if (cache !== null && Date.now() - cache.at < CACHE_TTL_MS) return cache.value;
  const value = await buildRecommended();
  cache = { at: Date.now(), value };
  return value;
}
function isLoopbackAddress7(address) {
  if (typeof address !== "string") return false;
  const a = address.toLowerCase();
  if (a === "::1") return true;
  const ipv4 = a.startsWith("::ffff:") ? a.slice(7) : a;
  const octets = ipv4.split(".");
  return octets.length === 4 && octets[0] === "127" && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function hostNameOf7(value) {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase();
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    if (close <= 1) return null;
    const suffix = host.slice(close + 1);
    if (suffix !== "" && !/^:\d+$/.test(suffix)) return null;
    return host.slice(1, close);
  }
  const firstColon = host.indexOf(":");
  const lastColon = host.lastIndexOf(":");
  if (firstColon !== lastColon) return null;
  return firstColon === -1 ? host : host.slice(0, firstColon);
}
function loopbackAllowed6(req) {
  if (!isLoopbackAddress7(req.socket.remoteAddress)) return false;
  const host = hostNameOf7(req.headers.host);
  if (host === null) return false;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}
function writeJsonResponse(res, status2, value) {
  res.writeHead(status2, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache"
  });
  res.end(JSON.stringify(value));
}
function applyMcpRecommended(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: ROUTE_PATH2,
    handler: (req, res) => {
      void (async () => {
        if (!loopbackAllowed6(req)) {
          writeJsonResponse(res, 403, { error: "loopback-only" });
          return;
        }
        const url = new URL(req.url ?? "/", "http://localhost");
        if (url.pathname === ROUTE_PATH2 || url.pathname === `${ROUTE_PATH2}/`) {
          writeJsonResponse(res, 200, await getRecommended());
          return;
        }
        if (url.pathname === SEARCH_ROUTE || url.pathname === `${SEARCH_ROUTE}/`) {
          const q = url.searchParams.get("q") ?? "";
          writeJsonResponse(res, 200, { query: q, servers: await searchServers(q) });
          return;
        }
        if (url.pathname === RESOLVE_ROUTE || url.pathname === `${RESOLVE_ROUTE}/`) {
          const repo = url.searchParams.get("repo") ?? "";
          if (!/^https?:\/\//.test(repo)) {
            writeJsonResponse(res, 400, { ok: false, error: "repo required" });
            return;
          }
          writeJsonResponse(res, 200, await resolveServer(repo));
          return;
        }
        writeJsonResponse(res, 404, { error: `no route for ${req.method ?? "GET"} ${url.pathname}` });
      })();
    }
  }), "dsh-mcp-recommended: routes");
}

// src/mcp-status.ts
import { readFileSync as readFileSync5, writeFileSync as writeFileSync4, copyFileSync as copyFileSync2, existsSync as existsSync3 } from "node:fs";
import { homedir as homedir8 } from "node:os";
import { join as join11 } from "node:path";
var STATUS_ROUTE = "/api/triad/mcp-status";
var CONFIG_ROUTE = "/api/triad/mcp-config";
var MCP_CLIENT_NAME = `'@deepseek-ai/dsh-mcp-client'`;
var PROFILE_NAME = "web";
var BACKUP_SUFFIX = ".bak-last-toggle";
function dshHome() {
  const fromEnv = process.env["DSH_HOME"];
  return fromEnv !== void 0 && fromEnv.trim() !== "" ? fromEnv.trim() : join11(homedir8(), ".dsh");
}
function patchFilePath() {
  return join11(dshHome(), "profiles", PROFILE_NAME, "cordis.patch.yml");
}
function scanPatchEntries(content) {
  const lines = content.split(/\r?\n/);
  const entries = [];
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trimStart();
    if (!trimmed.startsWith("- id:")) continue;
    const idMatch = /^- id:\s*([A-Za-z0-9_-]+)/.exec(trimmed);
    if (idMatch === null) continue;
    const idLine = i;
    let nameLine = -1;
    let serverNameLine = -1;
    let serverName = "";
    let entryUrl = "";
    for (let j = i + 1; j < lines.length && j <= i + 10; j += 1) {
      const line = lines[j].trimStart();
      if (line.startsWith("- ")) break;
      if (nameLine === -1 && line.startsWith("name:") && line.includes(MCP_CLIENT_NAME)) nameLine = j;
      if (nameLine !== -1 && serverNameLine === -1 && line.startsWith("serverName:")) {
        const m = /^serverName:\s*([A-Za-z0-9_-]+)/.exec(line);
        if (m !== null) {
          serverNameLine = j;
          serverName = m[1];
        }
      }
      if (nameLine !== -1 && entryUrl === "" && line.startsWith("url:")) {
        const m = /^url:\s*(.+?)\s*$/.exec(line);
        if (m !== null) entryUrl = m[1];
      }
    }
    if (nameLine === -1 || serverNameLine === -1) continue;
    let disabledLine = -1;
    for (let j = i + 1; j < lines.length && j <= i + 10; j += 1) {
      const line = lines[j].trimStart();
      if (line.startsWith("- ")) break;
      if (line.startsWith("disabled:")) {
        disabledLine = j;
        break;
      }
    }
    entries.push({ entryId: idMatch[1], serverName, disabled: disabledLine >= 0, url: entryUrl, idLine, nameLine, serverNameLine, disabledLine });
  }
  return entries;
}
function defaultLineEnding(content) {
  return content.includes("\r\n") ? "\r\n" : "\n";
}
function applyToggle2(content, entry, disabled) {
  const eol = defaultLineEnding(content);
  const lines = content.split(/\r?\n/);
  if (entry.disabled === disabled) return content;
  if (disabled) {
    const indent = /^\s*/.exec(lines[entry.nameLine])?.[0] ?? "      ";
    lines.splice(entry.nameLine + 1, 0, `${indent}disabled: true`);
  } else if (entry.disabledLine >= 0) {
    lines.splice(entry.disabledLine, 1);
  }
  return lines.join(eol);
}
function readPatchContent() {
  const path = patchFilePath();
  if (!existsSync3(path)) return "";
  return readFileSync5(path, "utf8");
}
function collectMcpStatus(ctx) {
  const path = patchFilePath();
  const content = readPatchContent();
  const patchEntries = content === "" ? [] : scanPatchEntries(content);
  const groups = /* @__PURE__ */ new Map();
  for (const schema of ctx.tools.schemas()) {
    if (typeof schema.name !== "string" || !schema.name.startsWith("mcp__")) continue;
    const rest = schema.name.slice("mcp__".length);
    const sep2 = rest.indexOf("__");
    if (sep2 <= 0) continue;
    const serverName = rest.slice(0, sep2);
    const list = groups.get(serverName);
    const tool = { name: schema.name, description: typeof schema.description === "string" ? schema.description : "" };
    if (list === void 0) groups.set(serverName, [tool]);
    else list.push(tool);
  }
  const seen = /* @__PURE__ */ new Set();
  const servers = [];
  for (const entry of patchEntries) {
    seen.add(entry.serverName);
    const tools = groups.get(entry.serverName) ?? [];
    servers.push({
      serverName: entry.serverName,
      toolCount: tools.length,
      tools,
      config: { entryId: entry.entryId, disabled: entry.disabled, editable: true }
    });
  }
  for (const [serverName, tools] of groups) {
    if (seen.has(serverName)) continue;
    servers.push({
      serverName,
      toolCount: tools.length,
      tools,
      config: { entryId: null, disabled: false, editable: false }
    });
  }
  servers.sort((a, b) => String(a.serverName).localeCompare(String(b.serverName)));
  return {
    at: (/* @__PURE__ */ new Date()).toISOString(),
    serverCount: servers.length,
    toolCount: servers.reduce((sum, server) => sum + server.toolCount, 0),
    patchFile: path,
    servers
  };
}
function togglePatchEntry(serverName, disabled) {
  const path = patchFilePath();
  const content = readPatchContent();
  if (content === "") return { ok: false, error: `patch file not found: ${path}` };
  const entries = scanPatchEntries(content);
  const entry = entries.find((item) => item.serverName === serverName);
  if (entry === void 0) return { ok: false, error: `no mcp-client entry for serverName "${serverName}" in ${path}` };
  const next = applyToggle2(content, entry, disabled);
  if (next === content) return { ok: true, entryId: entry.entryId, disabled: entry.disabled };
  try {
    copyFileSync2(path, `${path}${BACKUP_SUFFIX}`);
    writeFileSync4(path, next, "utf8");
  } catch (error) {
    return { ok: false, error: `write failed: ${error instanceof Error ? error.message : String(error)}` };
  }
  return { ok: true, entryId: entry.entryId, disabled };
}
function removePatchEntry(serverName) {
  const path = patchFilePath();
  const content = readPatchContent();
  if (content === "") return { ok: false, error: `patch file not found: ${path}` };
  const entries = scanPatchEntries(content);
  const entry = entries.find((item) => item.serverName === serverName);
  if (entry === void 0) return { ok: false, error: `no mcp-client entry for serverName "${serverName}" in ${path}` };
  const lines = content.split(/\r?\n/);
  const blockEndOf = (line) => {
    for (let j = line + 1; j < lines.length; j += 1) {
      const current = lines[j];
      if (current.length === 0) return j;
      if (!/^[ \t]/.test(current)) return j;
    }
    return lines.length;
  };
  let insertLine = -1;
  for (let k = entry.idLine - 1; k >= 0; k -= 1) {
    const trimmed = lines[k].trimStart();
    if (trimmed.startsWith("- ")) {
      insertLine = k;
      break;
    }
  }
  let removeFrom = entry.idLine;
  let removeTo = blockEndOf(entry.idLine);
  if (insertLine >= 0 && lines[insertLine].trimStart().startsWith("- insert:")) {
    let itemCount = 0;
    for (let k = insertLine + 1; k < removeTo; k += 1) {
      if (lines[k].trimStart().startsWith("- id:")) itemCount += 1;
    }
    if (itemCount === 1) {
      removeFrom = insertLine;
      removeTo = blockEndOf(insertLine);
    }
  }
  const next = lines.slice(0, removeFrom).concat(lines.slice(removeTo)).join(defaultLineEnding(content));
  try {
    copyFileSync2(path, `${path}${BACKUP_SUFFIX}`);
    writeFileSync4(path, next, "utf8");
  } catch (error) {
    return { ok: false, error: `write failed: ${error instanceof Error ? error.message : String(error)}` };
  }
  return { ok: true, entryId: entry.entryId };
}
var WATCHDOG_INTERVAL_MS = 6e4;
var WATCHDOG_GRACE_MS = 15e4;
var WATCHDOG_RETRY_GAP_MS = 9e4;
var WATCHDOG_CLIENT_SLUG = "dsh-mcp-client";
var watchdogStartedAt = 0;
var watchdogLastHealAt = 0;
var watchdogHealing = false;
function sleep(ms) {
  return new Promise((resolve2) => {
    setTimeout(resolve2, ms);
  });
}
async function remoteSessionAlive(entryUrl) {
  const base = /^(https?:\/\/[^/]+)/.exec(entryUrl)?.[1];
  if (base === void 0) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5e3);
    try {
      const response = await fetch(`${base}/api/v1/sessions`, { headers: { accept: "application/json" }, signal: controller.signal });
      if (!response.ok) return null;
      const body = await response.json();
      if (!Array.isArray(body.items)) return null;
      return body.items.some((item) => item.slug === WATCHDOG_CLIENT_SLUG && item.status === "live");
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return null;
  }
}
async function watchdogTick() {
  if (watchdogHealing) return;
  const content = readPatchContent();
  if (content === "") return;
  const entries = scanPatchEntries(content).filter((entry) => entry.url !== "" && !entry.disabled);
  for (const entry of entries) {
    const alive = await remoteSessionAlive(entry.url);
    if (alive !== null && !alive) {
      watchdogHealing = true;
      try {
        const before = Date.now();
        if (before - watchdogLastHealAt < WATCHDOG_RETRY_GAP_MS) continue;
        watchdogLastHealAt = before;
        const disable = togglePatchEntry(entry.serverName, true);
        if (disable.ok) {
          await sleep(2500);
          togglePatchEntry(entry.serverName, false);
          console.log(`[dsh-triad] mcp watchdog: session for ${entry.serverName} reclaimed by server; reconnected (disabled toggle)`);
        }
      } finally {
        watchdogHealing = false;
      }
    }
  }
}
function startWatchdog() {
  watchdogStartedAt = Date.now();
  const timer = setInterval(() => {
    if (Date.now() - watchdogStartedAt < WATCHDOG_GRACE_MS) return;
    void watchdogTick();
  }, WATCHDOG_INTERVAL_MS);
  timer.unref?.();
  return () => clearInterval(timer);
}
function applyMcpStatus(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: STATUS_ROUTE,
    handler: (req, res) => {
      if (!loopbackAllowed6(req)) {
        writeJsonResponse(res, 403, { error: "loopback-only" });
        return;
      }
      writeJsonResponse(res, 200, collectMcpStatus(ctx));
    }
  }), "dsh-mcp-status: routes");
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: CONFIG_ROUTE,
    handler: (req, res) => {
      void (async () => {
        if (!loopbackAllowed6(req)) {
          writeJsonResponse(res, 403, { error: "loopback-only" });
          return;
        }
        let body = "";
        for await (const chunk of req) {
          body += Buffer.from(chunk).toString("utf8");
        }
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          writeJsonResponse(res, 400, { ok: false, error: "invalid json" });
          return;
        }
        const serverName = typeof parsed.serverName === "string" ? parsed.serverName : "";
        if (serverName === "") {
          writeJsonResponse(res, 400, { ok: false, error: "serverName required" });
          return;
        }
        const result = parsed.action === "remove" ? removePatchEntry(serverName) : togglePatchEntry(serverName, parsed.disabled === true);
        writeJsonResponse(res, result.ok ? 200 : 400, result);
      })();
    }
  }), "dsh-mcp-config: routes");
  ctx.effect(() => startWatchdog(), "dsh-mcp-watchdog: interval");
}

// src/host.ts
var name = "dsh-triad";
var inject = [
  "webServer",
  "tools",
  "credentials",
  "sessions",
  "sessionPersistence",
  "settings",
  "llm"
];
async function apply4(ctx, config = {}) {
  try {
    applyMemory(ctx, config.memory);
    ctx.logger?.info?.("[dsh-triad] memory engine mounted");
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] memory engine failed to mount: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
    );
  }
  try {
    applyAutomationHost(ctx);
    ctx.logger?.info?.("[dsh-triad] automation mounted");
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] automation failed to mount: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
    );
  }
  try {
    await apply2(ctx, config.usage ?? {});
    ctx.logger?.info?.("[dsh-triad] usage + skills host mounted");
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] usage host failed to mount: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
    );
  }
  try {
    await apply3(ctx);
    ctx.logger?.info?.("[dsh-triad] skill toggles mounted");
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] skill toggles failed to mount: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
    );
  }
  try {
    applySkillHealth(ctx);
    ctx.logger?.info?.("[dsh-triad] skill health mounted");
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] skill health failed to mount: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
    );
  }
  try {
    applyMcpRecommended(ctx);
    ctx.logger?.info?.("[dsh-triad] mcp recommended mounted");
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] mcp recommended failed to mount: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
    );
  }
  try {
    applyMcpStatus(ctx);
    ctx.logger?.info?.("[dsh-triad] mcp status mounted");
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] mcp status failed to mount: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
    );
  }
}
export {
  apply4 as apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
