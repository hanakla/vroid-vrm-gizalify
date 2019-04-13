!function(t){var r={};function e(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,r){if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var i in t)e.d(n,i,function(r){return t[r]}.bind(null,i));return n},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},e.p="",e(e.s=2)}([function(t,r,e){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var n=e(4),i=e(5),o=e(6);function u(){return s.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function f(t,r){if(u()<r)throw new RangeError("Invalid typed array length");return s.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(r)).__proto__=s.prototype:(null===t&&(t=new s(r)),t.length=r),t}function s(t,r,e){if(!(s.TYPED_ARRAY_SUPPORT||this instanceof s))return new s(t,r,e);if("number"==typeof t){if("string"==typeof r)throw new Error("If encoding is specified then the first argument must be a string");return c(this,t)}return a(this,t,r,e)}function a(t,r,e,n){if("number"==typeof r)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&r instanceof ArrayBuffer?function(t,r,e,n){if(r.byteLength,e<0||r.byteLength<e)throw new RangeError("'offset' is out of bounds");if(r.byteLength<e+(n||0))throw new RangeError("'length' is out of bounds");r=void 0===e&&void 0===n?new Uint8Array(r):void 0===n?new Uint8Array(r,e):new Uint8Array(r,e,n);s.TYPED_ARRAY_SUPPORT?(t=r).__proto__=s.prototype:t=l(t,r);return t}(t,r,e,n):"string"==typeof r?function(t,r,e){"string"==typeof e&&""!==e||(e="utf8");if(!s.isEncoding(e))throw new TypeError('"encoding" must be a valid string encoding');var n=0|g(r,e),i=(t=f(t,n)).write(r,e);i!==n&&(t=t.slice(0,i));return t}(t,r,e):function(t,r){if(s.isBuffer(r)){var e=0|p(r.length);return 0===(t=f(t,e)).length?t:(r.copy(t,0,0,e),t)}if(r){if("undefined"!=typeof ArrayBuffer&&r.buffer instanceof ArrayBuffer||"length"in r)return"number"!=typeof r.length||(n=r.length)!=n?f(t,0):l(t,r);if("Buffer"===r.type&&o(r.data))return l(t,r.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,r)}function h(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function c(t,r){if(h(r),t=f(t,r<0?0:0|p(r)),!s.TYPED_ARRAY_SUPPORT)for(var e=0;e<r;++e)t[e]=0;return t}function l(t,r){var e=r.length<0?0:0|p(r.length);t=f(t,e);for(var n=0;n<e;n+=1)t[n]=255&r[n];return t}function p(t){if(t>=u())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+u().toString(16)+" bytes");return 0|t}function g(t,r){if(s.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var e=t.length;if(0===e)return 0;for(var n=!1;;)switch(r){case"ascii":case"latin1":case"binary":return e;case"utf8":case"utf-8":case void 0:return F(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*e;case"hex":return e>>>1;case"base64":return N(t).length;default:if(n)return F(t).length;r=(""+r).toLowerCase(),n=!0}}function y(t,r,e){var n=t[r];t[r]=t[e],t[e]=n}function d(t,r,e,n,i){if(0===t.length)return-1;if("string"==typeof e?(n=e,e=0):e>2147483647?e=2147483647:e<-2147483648&&(e=-2147483648),e=+e,isNaN(e)&&(e=i?0:t.length-1),e<0&&(e=t.length+e),e>=t.length){if(i)return-1;e=t.length-1}else if(e<0){if(!i)return-1;e=0}if("string"==typeof r&&(r=s.from(r,n)),s.isBuffer(r))return 0===r.length?-1:w(t,r,e,n,i);if("number"==typeof r)return r&=255,s.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,r,e):Uint8Array.prototype.lastIndexOf.call(t,r,e):w(t,[r],e,n,i);throw new TypeError("val must be string, number or Buffer")}function w(t,r,e,n,i){var o,u=1,f=t.length,s=r.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||r.length<2)return-1;u=2,f/=2,s/=2,e/=2}function a(t,r){return 1===u?t[r]:t.readUInt16BE(r*u)}if(i){var h=-1;for(o=e;o<f;o++)if(a(t,o)===a(r,-1===h?0:o-h)){if(-1===h&&(h=o),o-h+1===s)return h*u}else-1!==h&&(o-=o-h),h=-1}else for(e+s>f&&(e=f-s),o=e;o>=0;o--){for(var c=!0,l=0;l<s;l++)if(a(t,o+l)!==a(r,l)){c=!1;break}if(c)return o}return-1}function v(t,r,e,n){e=Number(e)||0;var i=t.length-e;n?(n=Number(n))>i&&(n=i):n=i;var o=r.length;if(o%2!=0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var u=0;u<n;++u){var f=parseInt(r.substr(2*u,2),16);if(isNaN(f))return u;t[e+u]=f}return u}function b(t,r,e,n){return V(F(r,t.length-e),t,e,n)}function m(t,r,e,n){return V(function(t){for(var r=[],e=0;e<t.length;++e)r.push(255&t.charCodeAt(e));return r}(r),t,e,n)}function E(t,r,e,n){return m(t,r,e,n)}function A(t,r,e,n){return V(N(r),t,e,n)}function _(t,r,e,n){return V(function(t,r){for(var e,n,i,o=[],u=0;u<t.length&&!((r-=2)<0);++u)e=t.charCodeAt(u),n=e>>8,i=e%256,o.push(i),o.push(n);return o}(r,t.length-e),t,e,n)}function R(t,r,e){return 0===r&&e===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(r,e))}function T(t,r,e){e=Math.min(t.length,e);for(var n=[],i=r;i<e;){var o,u,f,s,a=t[i],h=null,c=a>239?4:a>223?3:a>191?2:1;if(i+c<=e)switch(c){case 1:a<128&&(h=a);break;case 2:128==(192&(o=t[i+1]))&&(s=(31&a)<<6|63&o)>127&&(h=s);break;case 3:o=t[i+1],u=t[i+2],128==(192&o)&&128==(192&u)&&(s=(15&a)<<12|(63&o)<<6|63&u)>2047&&(s<55296||s>57343)&&(h=s);break;case 4:o=t[i+1],u=t[i+2],f=t[i+3],128==(192&o)&&128==(192&u)&&128==(192&f)&&(s=(15&a)<<18|(63&o)<<12|(63&u)<<6|63&f)>65535&&s<1114112&&(h=s)}null===h?(h=65533,c=1):h>65535&&(h-=65536,n.push(h>>>10&1023|55296),h=56320|1023&h),n.push(h),i+=c}return function(t){var r=t.length;if(r<=P)return String.fromCharCode.apply(String,t);var e="",n=0;for(;n<r;)e+=String.fromCharCode.apply(String,t.slice(n,n+=P));return e}(n)}r.Buffer=s,r.SlowBuffer=function(t){+t!=t&&(t=0);return s.alloc(+t)},r.INSPECT_MAX_BYTES=50,s.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),r.kMaxLength=u(),s.poolSize=8192,s._augment=function(t){return t.__proto__=s.prototype,t},s.from=function(t,r,e){return a(null,t,r,e)},s.TYPED_ARRAY_SUPPORT&&(s.prototype.__proto__=Uint8Array.prototype,s.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&s[Symbol.species]===s&&Object.defineProperty(s,Symbol.species,{value:null,configurable:!0})),s.alloc=function(t,r,e){return function(t,r,e,n){return h(r),r<=0?f(t,r):void 0!==e?"string"==typeof n?f(t,r).fill(e,n):f(t,r).fill(e):f(t,r)}(null,t,r,e)},s.allocUnsafe=function(t){return c(null,t)},s.allocUnsafeSlow=function(t){return c(null,t)},s.isBuffer=function(t){return!(null==t||!t._isBuffer)},s.compare=function(t,r){if(!s.isBuffer(t)||!s.isBuffer(r))throw new TypeError("Arguments must be Buffers");if(t===r)return 0;for(var e=t.length,n=r.length,i=0,o=Math.min(e,n);i<o;++i)if(t[i]!==r[i]){e=t[i],n=r[i];break}return e<n?-1:n<e?1:0},s.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(t,r){if(!o(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return s.alloc(0);var e;if(void 0===r)for(r=0,e=0;e<t.length;++e)r+=t[e].length;var n=s.allocUnsafe(r),i=0;for(e=0;e<t.length;++e){var u=t[e];if(!s.isBuffer(u))throw new TypeError('"list" argument must be an Array of Buffers');u.copy(n,i),i+=u.length}return n},s.byteLength=g,s.prototype._isBuffer=!0,s.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var r=0;r<t;r+=2)y(this,r,r+1);return this},s.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var r=0;r<t;r+=4)y(this,r,r+3),y(this,r+1,r+2);return this},s.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var r=0;r<t;r+=8)y(this,r,r+7),y(this,r+1,r+6),y(this,r+2,r+5),y(this,r+3,r+4);return this},s.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?T(this,0,t):function(t,r,e){var n=!1;if((void 0===r||r<0)&&(r=0),r>this.length)return"";if((void 0===e||e>this.length)&&(e=this.length),e<=0)return"";if((e>>>=0)<=(r>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return U(this,r,e);case"utf8":case"utf-8":return T(this,r,e);case"ascii":return S(this,r,e);case"latin1":case"binary":return B(this,r,e);case"base64":return R(this,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return M(this,r,e);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}.apply(this,arguments)},s.prototype.equals=function(t){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===s.compare(this,t)},s.prototype.inspect=function(){var t="",e=r.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},s.prototype.compare=function(t,r,e,n,i){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===r&&(r=0),void 0===e&&(e=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),r<0||e>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&r>=e)return 0;if(n>=i)return-1;if(r>=e)return 1;if(this===t)return 0;for(var o=(i>>>=0)-(n>>>=0),u=(e>>>=0)-(r>>>=0),f=Math.min(o,u),a=this.slice(n,i),h=t.slice(r,e),c=0;c<f;++c)if(a[c]!==h[c]){o=a[c],u=h[c];break}return o<u?-1:u<o?1:0},s.prototype.includes=function(t,r,e){return-1!==this.indexOf(t,r,e)},s.prototype.indexOf=function(t,r,e){return d(this,t,r,e,!0)},s.prototype.lastIndexOf=function(t,r,e){return d(this,t,r,e,!1)},s.prototype.write=function(t,r,e,n){if(void 0===r)n="utf8",e=this.length,r=0;else if(void 0===e&&"string"==typeof r)n=r,e=this.length,r=0;else{if(!isFinite(r))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");r|=0,isFinite(e)?(e|=0,void 0===n&&(n="utf8")):(n=e,e=void 0)}var i=this.length-r;if((void 0===e||e>i)&&(e=i),t.length>0&&(e<0||r<0)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return v(this,t,r,e);case"utf8":case"utf-8":return b(this,t,r,e);case"ascii":return m(this,t,r,e);case"latin1":case"binary":return E(this,t,r,e);case"base64":return A(this,t,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return _(this,t,r,e);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var P=4096;function S(t,r,e){var n="";e=Math.min(t.length,e);for(var i=r;i<e;++i)n+=String.fromCharCode(127&t[i]);return n}function B(t,r,e){var n="";e=Math.min(t.length,e);for(var i=r;i<e;++i)n+=String.fromCharCode(t[i]);return n}function U(t,r,e){var n=t.length;(!r||r<0)&&(r=0),(!e||e<0||e>n)&&(e=n);for(var i="",o=r;o<e;++o)i+=D(t[o]);return i}function M(t,r,e){for(var n=t.slice(r,e),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}function O(t,r,e){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+r>e)throw new RangeError("Trying to access beyond buffer length")}function x(t,r,e,n,i,o){if(!s.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>i||r<o)throw new RangeError('"value" argument is out of bounds');if(e+n>t.length)throw new RangeError("Index out of range")}function I(t,r,e,n){r<0&&(r=65535+r+1);for(var i=0,o=Math.min(t.length-e,2);i<o;++i)t[e+i]=(r&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function L(t,r,e,n){r<0&&(r=4294967295+r+1);for(var i=0,o=Math.min(t.length-e,4);i<o;++i)t[e+i]=r>>>8*(n?i:3-i)&255}function Y(t,r,e,n,i,o){if(e+n>t.length)throw new RangeError("Index out of range");if(e<0)throw new RangeError("Index out of range")}function C(t,r,e,n,o){return o||Y(t,0,e,4),i.write(t,r,e,n,23,4),e+4}function k(t,r,e,n,o){return o||Y(t,0,e,8),i.write(t,r,e,n,52,8),e+8}s.prototype.slice=function(t,r){var e,n=this.length;if((t=~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),(r=void 0===r?n:~~r)<0?(r+=n)<0&&(r=0):r>n&&(r=n),r<t&&(r=t),s.TYPED_ARRAY_SUPPORT)(e=this.subarray(t,r)).__proto__=s.prototype;else{var i=r-t;e=new s(i,void 0);for(var o=0;o<i;++o)e[o]=this[o+t]}return e},s.prototype.readUIntLE=function(t,r,e){t|=0,r|=0,e||O(t,r,this.length);for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i;return n},s.prototype.readUIntBE=function(t,r,e){t|=0,r|=0,e||O(t,r,this.length);for(var n=this[t+--r],i=1;r>0&&(i*=256);)n+=this[t+--r]*i;return n},s.prototype.readUInt8=function(t,r){return r||O(t,1,this.length),this[t]},s.prototype.readUInt16LE=function(t,r){return r||O(t,2,this.length),this[t]|this[t+1]<<8},s.prototype.readUInt16BE=function(t,r){return r||O(t,2,this.length),this[t]<<8|this[t+1]},s.prototype.readUInt32LE=function(t,r){return r||O(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},s.prototype.readUInt32BE=function(t,r){return r||O(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},s.prototype.readIntLE=function(t,r,e){t|=0,r|=0,e||O(t,r,this.length);for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*r)),n},s.prototype.readIntBE=function(t,r,e){t|=0,r|=0,e||O(t,r,this.length);for(var n=r,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i;return o>=(i*=128)&&(o-=Math.pow(2,8*r)),o},s.prototype.readInt8=function(t,r){return r||O(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},s.prototype.readInt16LE=function(t,r){r||O(t,2,this.length);var e=this[t]|this[t+1]<<8;return 32768&e?4294901760|e:e},s.prototype.readInt16BE=function(t,r){r||O(t,2,this.length);var e=this[t+1]|this[t]<<8;return 32768&e?4294901760|e:e},s.prototype.readInt32LE=function(t,r){return r||O(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},s.prototype.readInt32BE=function(t,r){return r||O(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},s.prototype.readFloatLE=function(t,r){return r||O(t,4,this.length),i.read(this,t,!0,23,4)},s.prototype.readFloatBE=function(t,r){return r||O(t,4,this.length),i.read(this,t,!1,23,4)},s.prototype.readDoubleLE=function(t,r){return r||O(t,8,this.length),i.read(this,t,!0,52,8)},s.prototype.readDoubleBE=function(t,r){return r||O(t,8,this.length),i.read(this,t,!1,52,8)},s.prototype.writeUIntLE=function(t,r,e,n){(t=+t,r|=0,e|=0,n)||x(this,t,r,e,Math.pow(2,8*e)-1,0);var i=1,o=0;for(this[r]=255&t;++o<e&&(i*=256);)this[r+o]=t/i&255;return r+e},s.prototype.writeUIntBE=function(t,r,e,n){(t=+t,r|=0,e|=0,n)||x(this,t,r,e,Math.pow(2,8*e)-1,0);var i=e-1,o=1;for(this[r+i]=255&t;--i>=0&&(o*=256);)this[r+i]=t/o&255;return r+e},s.prototype.writeUInt8=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,1,255,0),s.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[r]=255&t,r+1},s.prototype.writeUInt16LE=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):I(this,t,r,!0),r+2},s.prototype.writeUInt16BE=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):I(this,t,r,!1),r+2},s.prototype.writeUInt32LE=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=255&t):L(this,t,r,!0),r+4},s.prototype.writeUInt32BE=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):L(this,t,r,!1),r+4},s.prototype.writeIntLE=function(t,r,e,n){if(t=+t,r|=0,!n){var i=Math.pow(2,8*e-1);x(this,t,r,e,i-1,-i)}var o=0,u=1,f=0;for(this[r]=255&t;++o<e&&(u*=256);)t<0&&0===f&&0!==this[r+o-1]&&(f=1),this[r+o]=(t/u>>0)-f&255;return r+e},s.prototype.writeIntBE=function(t,r,e,n){if(t=+t,r|=0,!n){var i=Math.pow(2,8*e-1);x(this,t,r,e,i-1,-i)}var o=e-1,u=1,f=0;for(this[r+o]=255&t;--o>=0&&(u*=256);)t<0&&0===f&&0!==this[r+o+1]&&(f=1),this[r+o]=(t/u>>0)-f&255;return r+e},s.prototype.writeInt8=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,1,127,-128),s.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[r]=255&t,r+1},s.prototype.writeInt16LE=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):I(this,t,r,!0),r+2},s.prototype.writeInt16BE=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):I(this,t,r,!1),r+2},s.prototype.writeInt32LE=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,4,2147483647,-2147483648),s.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24):L(this,t,r,!0),r+4},s.prototype.writeInt32BE=function(t,r,e){return t=+t,r|=0,e||x(this,t,r,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),s.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):L(this,t,r,!1),r+4},s.prototype.writeFloatLE=function(t,r,e){return C(this,t,r,!0,e)},s.prototype.writeFloatBE=function(t,r,e){return C(this,t,r,!1,e)},s.prototype.writeDoubleLE=function(t,r,e){return k(this,t,r,!0,e)},s.prototype.writeDoubleBE=function(t,r,e){return k(this,t,r,!1,e)},s.prototype.copy=function(t,r,e,n){if(e||(e=0),n||0===n||(n=this.length),r>=t.length&&(r=t.length),r||(r=0),n>0&&n<e&&(n=e),n===e)return 0;if(0===t.length||0===this.length)return 0;if(r<0)throw new RangeError("targetStart out of bounds");if(e<0||e>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-r<n-e&&(n=t.length-r+e);var i,o=n-e;if(this===t&&e<r&&r<n)for(i=o-1;i>=0;--i)t[i+r]=this[i+e];else if(o<1e3||!s.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)t[i+r]=this[i+e];else Uint8Array.prototype.set.call(t,this.subarray(e,e+o),r);return o},s.prototype.fill=function(t,r,e,n){if("string"==typeof t){if("string"==typeof r?(n=r,r=0,e=this.length):"string"==typeof e&&(n=e,e=this.length),1===t.length){var i=t.charCodeAt(0);i<256&&(t=i)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!s.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(r<0||this.length<r||this.length<e)throw new RangeError("Out of range index");if(e<=r)return this;var o;if(r>>>=0,e=void 0===e?this.length:e>>>0,t||(t=0),"number"==typeof t)for(o=r;o<e;++o)this[o]=t;else{var u=s.isBuffer(t)?t:F(new s(t,n).toString()),f=u.length;for(o=0;o<e-r;++o)this[o+r]=u[o%f]}return this};var j=/[^+\/0-9A-Za-z-_]/g;function D(t){return t<16?"0"+t.toString(16):t.toString(16)}function F(t,r){var e;r=r||1/0;for(var n=t.length,i=null,o=[],u=0;u<n;++u){if((e=t.charCodeAt(u))>55295&&e<57344){if(!i){if(e>56319){(r-=3)>-1&&o.push(239,191,189);continue}if(u+1===n){(r-=3)>-1&&o.push(239,191,189);continue}i=e;continue}if(e<56320){(r-=3)>-1&&o.push(239,191,189),i=e;continue}e=65536+(i-55296<<10|e-56320)}else i&&(r-=3)>-1&&o.push(239,191,189);if(i=null,e<128){if((r-=1)<0)break;o.push(e)}else if(e<2048){if((r-=2)<0)break;o.push(e>>6|192,63&e|128)}else if(e<65536){if((r-=3)<0)break;o.push(e>>12|224,e>>6&63|128,63&e|128)}else{if(!(e<1114112))throw new Error("Invalid code point");if((r-=4)<0)break;o.push(e>>18|240,e>>12&63|128,e>>6&63|128,63&e|128)}}return o}function N(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(j,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function V(t,r,e,n){for(var i=0;i<n&&!(i+e>=r.length||i>=t.length);++i)r[i+e]=t[i];return i}}).call(this,e(3))},function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){return function(t){this.message=t}}();r.HandledError=n},function(t,r,e){"use strict";var n=this&&this.__awaiter||function(t,r,e,n){return new(e||(e=Promise))(function(i,o){function u(t){try{s(n.next(t))}catch(t){o(t)}}function f(t){try{s(n.throw(t))}catch(t){o(t)}}function s(t){t.done?i(t.value):new e(function(r){r(t.value)}).then(u,f)}s((n=n.apply(t,r||[])).next())})},i=this&&this.__generator||function(t,r){var e,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:f(0),throw:f(1),return:f(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function f(o){return function(f){return function(o){if(e)throw new TypeError("Generator is already executing.");for(;u;)try{if(e=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=(i=u.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=r.call(t,u)}catch(t){o=[6,t],n=0}finally{e=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,f])}}},o=this;Object.defineProperty(r,"__esModule",{value:!0});var u,f=e(0),s=e(7),a=e(8),h=e(10),c=e(11),l=e(1);window.addEventListener("dragover",function(t){t.preventDefault()}),window.addEventListener("drop",function(t){return n(o,void 0,void 0,function(){var r,e,n,o,p,g,y,d,w,v,b,m,E,A;return i(this,function(i){switch(i.label){case 0:return t.preventDefault(),(r=document.querySelector("#download")).removeAttribute("href"),r.textContent="Gizabalify... 🕐",e=t.dataTransfer.files[0],u&&URL.revokeObjectURL(u),[4,new Promise(function(t){return setTimeout(t,500)})];case 1:i.sent(),i.label=2;case 2:return i.trys.push([2,4,,5]),n=e.name,o=new FileReader,[4,new Promise(function(t){o.onload=function(){return t(new f.Buffer(o.result))},o.readAsArrayBuffer(e)})];case 3:return p=i.sent(),function(t,r){return".vrm"===a.extname(t.name)&&"glTF"===r.slice(0,4).toString("utf-8")}(e,p)?(g=p.readUInt32LE(12),y=p.slice(g+28),d=p.toString("utf8",20,g+20),w=JSON.parse(d),v=new s.GltfVRM(w),c.gizabalifyVRM(v),b=h.buildVRMBuffer(v,y),m=new Blob([b],{type:"application/octet-stream"}),E=URL.createObjectURL(m),r.textContent="Complete! click here to download.",u=r.href=E,r.download=a.basename(n,".vrm")+"-gizabalify.vrm",[3,5]):(r.textContent="Invalid VRM🙅",[2]);case 4:return A=i.sent(),console.error(A),A instanceof l.HandledError?r.textContent=A.message:r.textContent="Oops, process failed 🙄",[3,5];case 5:return[2]}})})})},function(t,r){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(t){"object"==typeof window&&(e=window)}t.exports=e},function(t,r,e){"use strict";r.byteLength=function(t){var r=a(t),e=r[0],n=r[1];return 3*(e+n)/4-n},r.toByteArray=function(t){for(var r,e=a(t),n=e[0],u=e[1],f=new o(function(t,r,e){return 3*(r+e)/4-e}(0,n,u)),s=0,h=u>0?n-4:n,c=0;c<h;c+=4)r=i[t.charCodeAt(c)]<<18|i[t.charCodeAt(c+1)]<<12|i[t.charCodeAt(c+2)]<<6|i[t.charCodeAt(c+3)],f[s++]=r>>16&255,f[s++]=r>>8&255,f[s++]=255&r;2===u&&(r=i[t.charCodeAt(c)]<<2|i[t.charCodeAt(c+1)]>>4,f[s++]=255&r);1===u&&(r=i[t.charCodeAt(c)]<<10|i[t.charCodeAt(c+1)]<<4|i[t.charCodeAt(c+2)]>>2,f[s++]=r>>8&255,f[s++]=255&r);return f},r.fromByteArray=function(t){for(var r,e=t.length,i=e%3,o=[],u=0,f=e-i;u<f;u+=16383)o.push(h(t,u,u+16383>f?f:u+16383));1===i?(r=t[e-1],o.push(n[r>>2]+n[r<<4&63]+"==")):2===i&&(r=(t[e-2]<<8)+t[e-1],o.push(n[r>>10]+n[r>>4&63]+n[r<<2&63]+"="));return o.join("")};for(var n=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0,s=u.length;f<s;++f)n[f]=u[f],i[u.charCodeAt(f)]=f;function a(t){var r=t.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var e=t.indexOf("=");return-1===e&&(e=r),[e,e===r?0:4-e%4]}function h(t,r,e){for(var i,o,u=[],f=r;f<e;f+=3)i=(t[f]<<16&16711680)+(t[f+1]<<8&65280)+(255&t[f+2]),u.push(n[(o=i)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return u.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},function(t,r){r.read=function(t,r,e,n,i){var o,u,f=8*i-n-1,s=(1<<f)-1,a=s>>1,h=-7,c=e?i-1:0,l=e?-1:1,p=t[r+c];for(c+=l,o=p&(1<<-h)-1,p>>=-h,h+=f;h>0;o=256*o+t[r+c],c+=l,h-=8);for(u=o&(1<<-h)-1,o>>=-h,h+=n;h>0;u=256*u+t[r+c],c+=l,h-=8);if(0===o)o=1-a;else{if(o===s)return u?NaN:1/0*(p?-1:1);u+=Math.pow(2,n),o-=a}return(p?-1:1)*u*Math.pow(2,o-n)},r.write=function(t,r,e,n,i,o){var u,f,s,a=8*o-i-1,h=(1<<a)-1,c=h>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,g=n?1:-1,y=r<0||0===r&&1/r<0?1:0;for(r=Math.abs(r),isNaN(r)||r===1/0?(f=isNaN(r)?1:0,u=h):(u=Math.floor(Math.log(r)/Math.LN2),r*(s=Math.pow(2,-u))<1&&(u--,s*=2),(r+=u+c>=1?l/s:l*Math.pow(2,1-c))*s>=2&&(u++,s/=2),u+c>=h?(f=0,u=h):u+c>=1?(f=(r*s-1)*Math.pow(2,i),u+=c):(f=r*Math.pow(2,c-1)*Math.pow(2,i),u=0));i>=8;t[e+p]=255&f,p+=g,f/=256,i-=8);for(u=u<<i|f,a+=i;a>0;t[e+p]=255&u,p+=g,u/=256,a-=8);t[e+p-g]|=128*y}},function(t,r){var e={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==e.call(t)}},function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),function(t){t.A="A",t.I="I",t.U="U",t.E="E",t.O="O"}(r.VRMBlendShapeName||(r.VRMBlendShapeName={}));var n=function(){function t(t){this.gltf=t,this.vrm=this.gltf.extensions.VRM}return t.prototype.getFaceMesh=function(){var t=this.gltf.meshes.findIndex(function(t){return"Face.baked"===t.name});return{index:t,mesh:this.gltf.meshes[t]}},t.prototype.getFaceMeshes=function(){var t=this.getFaceMesh().mesh.primitives[0],r=t.targets,e=t.extras.targetNames;return r.map(function(t,r){return{index:r,name:e[r],target:t}})},Object.defineProperty(t.prototype,"blendShapeGroups",{get:function(){return this.vrm.blendShapeMaster.blendShapeGroups},enumerable:!0,configurable:!0}),t.prototype.toString=function(){return console.log("VRM serialized",this.gltf),JSON.stringify(this.gltf)},t}();r.GltfVRM=n},function(t,r,e){(function(t){function e(t,r){for(var e=0,n=t.length-1;n>=0;n--){var i=t[n];"."===i?t.splice(n,1):".."===i?(t.splice(n,1),e++):e&&(t.splice(n,1),e--)}if(r)for(;e--;e)t.unshift("..");return t}var n=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,i=function(t){return n.exec(t).slice(1)};function o(t,r){if(t.filter)return t.filter(r);for(var e=[],n=0;n<t.length;n++)r(t[n],n,t)&&e.push(t[n]);return e}r.resolve=function(){for(var r="",n=!1,i=arguments.length-1;i>=-1&&!n;i--){var u=i>=0?arguments[i]:t.cwd();if("string"!=typeof u)throw new TypeError("Arguments to path.resolve must be strings");u&&(r=u+"/"+r,n="/"===u.charAt(0))}return(n?"/":"")+(r=e(o(r.split("/"),function(t){return!!t}),!n).join("/"))||"."},r.normalize=function(t){var n=r.isAbsolute(t),i="/"===u(t,-1);return(t=e(o(t.split("/"),function(t){return!!t}),!n).join("/"))||n||(t="."),t&&i&&(t+="/"),(n?"/":"")+t},r.isAbsolute=function(t){return"/"===t.charAt(0)},r.join=function(){var t=Array.prototype.slice.call(arguments,0);return r.normalize(o(t,function(t,r){if("string"!=typeof t)throw new TypeError("Arguments to path.join must be strings");return t}).join("/"))},r.relative=function(t,e){function n(t){for(var r=0;r<t.length&&""===t[r];r++);for(var e=t.length-1;e>=0&&""===t[e];e--);return r>e?[]:t.slice(r,e-r+1)}t=r.resolve(t).substr(1),e=r.resolve(e).substr(1);for(var i=n(t.split("/")),o=n(e.split("/")),u=Math.min(i.length,o.length),f=u,s=0;s<u;s++)if(i[s]!==o[s]){f=s;break}var a=[];for(s=f;s<i.length;s++)a.push("..");return(a=a.concat(o.slice(f))).join("/")},r.sep="/",r.delimiter=":",r.dirname=function(t){var r=i(t),e=r[0],n=r[1];return e||n?(n&&(n=n.substr(0,n.length-1)),e+n):"."},r.basename=function(t,r){var e=i(t)[2];return r&&e.substr(-1*r.length)===r&&(e=e.substr(0,e.length-r.length)),e},r.extname=function(t){return i(t)[3]};var u="b"==="ab".substr(-1)?function(t,r,e){return t.substr(r,e)}:function(t,r,e){return r<0&&(r=t.length+r),t.substr(r,e)}}).call(this,e(9))},function(t,r){var e,n,i=t.exports={};function o(){throw new Error("setTimeout has not been defined")}function u(){throw new Error("clearTimeout has not been defined")}function f(t){if(e===setTimeout)return setTimeout(t,0);if((e===o||!e)&&setTimeout)return e=setTimeout,setTimeout(t,0);try{return e(t,0)}catch(r){try{return e.call(null,t,0)}catch(r){return e.call(this,t,0)}}}!function(){try{e="function"==typeof setTimeout?setTimeout:o}catch(t){e=o}try{n="function"==typeof clearTimeout?clearTimeout:u}catch(t){n=u}}();var s,a=[],h=!1,c=-1;function l(){h&&s&&(h=!1,s.length?a=s.concat(a):c=-1,a.length&&p())}function p(){if(!h){var t=f(l);h=!0;for(var r=a.length;r;){for(s=a,a=[];++c<r;)s&&s[c].run();c=-1,r=a.length}s=null,h=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===u||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t)}catch(r){try{return n.call(null,t)}catch(r){return n.call(this,t)}}}(t)}}function g(t,r){this.fun=t,this.array=r}function y(){}i.nextTick=function(t){var r=new Array(arguments.length-1);if(arguments.length>1)for(var e=1;e<arguments.length;e++)r[e-1]=arguments[e];a.push(new g(t,r)),1!==a.length||h||f(p)},g.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=y,i.addListener=y,i.once=y,i.off=y,i.removeListener=y,i.removeAllListeners=y,i.emit=y,i.prependListener=y,i.prependOnceListener=y,i.listeners=function(t){return[]},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},function(t,r,e){"use strict";(function(t){Object.defineProperty(r,"__esModule",{value:!0}),r.buildVRMBuffer=function(r,e){var n=new t(r.toString(),"utf-8"),i=new t(4);i.writeUInt32LE(1313821514,0);var o=new t(4);o.writeUInt32LE(5130562,0);var u=t.alloc(4);u.writeUInt32LE(n.byteLength,0);var f=t.alloc(4);f.writeUInt32LE(e.byteLength,0);var s=t.concat([new t([103,108,84,70]),new t([2,0,0,0]),new t([0,0,0,0]),u,i,n,f,o,e]);return s.writeUInt32LE(s.byteLength,8),s}}).call(this,e(0).Buffer)},function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=e(1);r.gizabalifyVRM=function(t){var r=t.getFaceMeshes().find(function(t){var r=t.name;return"Face.M_F00_000_00_Fcl_HA_Fung2"===r||"Face.M_F00_000_Fcl_HA_Fung2"===r});if(!r)throw new n.HandledError("Oops, it VRM looks like not exported from VRoid Studio. (Missing fung2 mesh)");var e=function(r){return t.blendShapeGroups.find(function(t){return t.name===r})};[[e("A"),70],[e("I"),30],[e("U"),30],[e("E"),50],[e("O"),60],[e("Angry"),0],[e("Fun"),0],[e("Joy"),80],[e("Sorrow"),80],[e("Surprised"),90]].forEach(function(e){var i=e[0],o=e[1];if(!i)throw new n.HandledError("Oops, it VRM looks like not exported from VRoid Studio. (Missing blendshape)");i.binds.push({mesh:t.getFaceMesh().index,index:r.index,weight:o})})}}]);