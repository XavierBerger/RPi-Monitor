
/*
 * BinaryFile over XMLHttpRequest
 * Part of the javascriptRRD package
 * Copyright (c) 2009 Frank Wuerthwein, fkw@ucsd.edu
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 * Original repository: http://javascriptrrd.sourceforge.net/
 *
 * Based on:
 *   Binary Ajax 0.1.5
 *   Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 *   MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

// ============================================================
// Exception class
function InvalidBinaryFile(msg) {
  this.message=msg;
  this.name="Invalid BinaryFile";
}

// pretty print
InvalidBinaryFile.prototype.toString = function() {
  return this.name + ': "' + this.message + '"';
}

// =====================================================================
// BinaryFile class
//   Allows access to element inside a binary stream
function BinaryFile(strData, iDataOffset, iDataLength) {
  var data = strData;
  var dataOffset = iDataOffset || 0;
  var dataLength = 0;
  // added 
  var doubleMantExpHi=Math.pow(2,-28);
  var doubleMantExpLo=Math.pow(2,-52);
  var doubleMantExpFast=Math.pow(2,-20);

  this.getRawData = function() {
    return data;
  }

  if (typeof strData == "string") {
    dataLength = iDataLength || data.length;

    this.getByteAt = function(iOffset) {
      return data.charCodeAt(iOffset + dataOffset) & 0xFF;
    }
  } else if (typeof strData == "unknown") {
    dataLength = iDataLength || IEBinary_getLength(data);

    this.getByteAt = function(iOffset) {
      return IEBinary_getByteAt(data, iOffset + dataOffset);
    }
  } else {
    throw new InvalidBinaryFile("Unsupported type " + (typeof strData));
  }

  this.getLength = function() {
    return dataLength;
  }

  this.getSByteAt = function(iOffset) {
    var iByte = this.getByteAt(iOffset);
    if (iByte > 127)
      return iByte - 256;
    else
      return iByte;
  }

  this.getShortAt = function(iOffset) {
    var iShort = (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
    if (iShort < 0) iShort += 65536;
    return iShort;
  }
  this.getSShortAt = function(iOffset) {
    var iUShort = this.getShortAt(iOffset);
    if (iUShort > 32767)
      return iUShort - 65536;
    else
      return iUShort;
  }
  this.getLongAt = function(iOffset) {
    var iByte1 = this.getByteAt(iOffset),
      iByte2 = this.getByteAt(iOffset + 1),
      iByte3 = this.getByteAt(iOffset + 2),
      iByte4 = this.getByteAt(iOffset + 3);

    var iLong = (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
    if (iLong < 0) iLong += 4294967296;
    return iLong;
  }
  this.getSLongAt = function(iOffset) {
    var iULong = this.getLongAt(iOffset);
    if (iULong > 2147483647)
      return iULong - 4294967296;
    else
      return iULong;
  }
  this.getStringAt = function(iOffset, iLength) {
    var aStr = [];
    for (var i=iOffset,j=0;i<iOffset+iLength;i++,j++) {
      aStr[j] = String.fromCharCode(this.getByteAt(i));
    }
    return aStr.join("");
  }

  // Added
  this.getCStringAt = function(iOffset, iMaxLength) {
    var aStr = [];
    for (var i=iOffset,j=0;(i<iOffset+iMaxLength) && (this.getByteAt(i)>0);i++,j++) {
      aStr[j] = String.fromCharCode(this.getByteAt(i));
    }
    return aStr.join("");
  }

  // Added
  this.getDoubleAt = function(iOffset) {
    var iByte1 = this.getByteAt(iOffset),
      iByte2 = this.getByteAt(iOffset + 1),
      iByte3 = this.getByteAt(iOffset + 2),
            iByte4 = this.getByteAt(iOffset + 3),
            iByte5 = this.getByteAt(iOffset + 4),
      iByte6 = this.getByteAt(iOffset + 5),
      iByte7 = this.getByteAt(iOffset + 6),
      iByte8 = this.getByteAt(iOffset + 7);
    var iSign=iByte8 >> 7;
    var iExpRaw=((iByte8 & 0x7F)<< 4) + (iByte7 >> 4);
    var iMantHi=((((((iByte7 & 0x0F) << 8) + iByte6) << 8) + iByte5) << 8) + iByte4;
    var iMantLo=((((iByte3) << 8) + iByte2) << 8) + iByte1;

    if (iExpRaw==0) return 0.0;
    if (iExpRaw==0x7ff) return undefined;

    var iExp=(iExpRaw & 0x7FF)-1023;

    var dDouble = ((iSign==1)?-1:1)*Math.pow(2,iExp)*(1.0 + iMantLo*doubleMantExpLo + iMantHi*doubleMantExpHi);
    return dDouble;
  }
  // added
  // Extracts only 4 bytes out of 8, loosing in precision (20 bit mantissa)
  this.getFastDoubleAt = function(iOffset) {
    var iByte5 = this.getByteAt(iOffset + 4),
      iByte6 = this.getByteAt(iOffset + 5),
      iByte7 = this.getByteAt(iOffset + 6),
      iByte8 = this.getByteAt(iOffset + 7);
    var iSign=iByte8 >> 7;
    var iExpRaw=((iByte8 & 0x7F)<< 4) + (iByte7 >> 4);
    var iMant=((((iByte7 & 0x0F) << 8) + iByte6) << 8) + iByte5;

    if (iExpRaw==0) return 0.0;
    if (iExpRaw==0x7ff) return undefined;

    var iExp=(iExpRaw & 0x7FF)-1023;

    var dDouble = ((iSign==1)?-1:1)*Math.pow(2,iExp)*(1.0 + iMant*doubleMantExpFast);
    return dDouble;
  }

  this.getCharAt = function(iOffset) {
    return String.fromCharCode(this.getByteAt(iOffset));
  }
}


document.write(
  "<script type='text/vbscript'>\r\n"
  + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
  + " IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n"
  + "End Function\r\n"
  + "Function IEBinary_getLength(strBinary)\r\n"
  + " IEBinary_getLength = LenB(strBinary)\r\n"
  + "End Function\r\n"
  + "</script>\r\n"
);



// ===============================================================
// Load a binary file from the specified URL 
// Will return an object of type BinaryFile
function FetchBinaryURL(url) {
  var request =  new XMLHttpRequest();
  request.open("GET", url,false);
  try {
    request.overrideMimeType('text/plain; charset=x-user-defined');
  } catch (err) {
    // ignore any error, just to make both FF and IE work
  }
  request.send(null);

  var response=request.responseBody;
  if (response==undefined){ // responseBody is non standard, but the only way to make it work in IE
    response=request.responseText;
  }
  var bf=new BinaryFile(response);
  return bf;
}


// ===============================================================
// Asyncronously load a binary file from the specified URL 
//
// callback must be a function with one or two arguments:
//  - bf = an object of type BinaryFile
//  - optional argument object (used only if callback_arg not undefined) 
function FetchBinaryURLAsync(url, callback, callback_arg) {
  var callback_wrapper = function() {
    if(this.readyState == 4) {
      var response=this.responseBody;
      if (response==undefined){ // responseBody is non standard, but the only way to make it work in IE
  response=this.responseText;
      }
      var bf=new BinaryFile(response);
      if (callback_arg!=null) {
  callback(bf,callback_arg);
      } else {
  callback(bf);
      }
    }
  }

  var request =  new XMLHttpRequest();
  request.onreadystatechange = callback_wrapper;
  request.open("GET", url,true);
  try {
    request.overrideMimeType('text/plain; charset=x-user-defined');
  } catch (err) {
    // ignore any error, just to make both FF and IE work
  }
  request.send(null);
  return request
}
