// 计算长度
function sumDataLength(token, params) {
	if (params === "") {
		return "04";
	}
	var ll = params.length + token.length;
	if (ll > 15) {
		return "" + Number(ll / 2).toString(16);
	}
	return "0" + Number(ll / 2).toString(16);
}
// 分割字符串
function splitStrs(source, count) {
	let arr = [];
	for (let i = 0, len = source.length / count; i < len; i++) {
		let subStr = source.substr(0, count);
		arr.push(subStr);
		source = source.replace(subStr, "");
	}
	return arr;
}
// 计算命令总长
function sumCkLen(type, len, token, cmd) {
	var str = type + len + token + cmd;
	var numArray = splitStrs(str, 2);
	var totalnum = parseInt(0, 16);
	for (var index = 0; index < numArray.length; index++) {
		// console.log('数字', numArray[index], parseInt(numArray[index], 16));
		totalnum += parseInt(numArray[index], 16);
	}
	return Number(totalnum).toString(16);
}
const doCmd = (type, params, tocken) => {
	var dToken = tocken.toString(16) || '0A0A0505';
	// var dTokenLen=8-dToken.length
	dToken = (Array(8).join('0') + dToken).slice(-8)
	console.log('dToken', dToken)
	var len = sumDataLength(dToken, params);
	var ckLen = sumCkLen(type, len, dToken, params);
	var cmdStr = type + len + dToken + params + ckLen;
	// this.setData({ cmdStr: cmdStr });
	var typedArray = new Uint8Array(cmdStr.match(/[\da-f]{2}/gi).map(function(h) {
		return parseInt(h, 16)
	}))
	console.log('typedArray', cmdStr, typedArray)
	var buffer1 = typedArray.buffer
	// this.write(cmdStr);
	return buffer1
}
export {
	doCmd
}
