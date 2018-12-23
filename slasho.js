class slasho{
  static download(url, filename){
    let r = new XMLHttpRequest()
    r.open('GET', url)
    r.onload = () => {
      let d = r.responseText
      let arr = d
      let datStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arr));
      let downloadNode = document.createElement("a");
      downloadNode.setAttribute("href", datStr);
      downloadNode.setAttribute("download", filename + ".json");
      downloadNode.click();
      downloadNode.remove();
    }
    r.send()
  }
  static onswip(el, callback){
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}

    touchsurface.addEventListener('touchstart', function(e){
      var touchobj = e.changedTouches[0]
      swipedir = 'none'
      dist = 0
      startX = touchobj.pageX
      startY = touchobj.pageY
      startTime = new Date().getTime() // record time when finger first makes contact with surface
      e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function(e){
      e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function(e){
      var touchobj = e.changedTouches[0]
      distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime // get time elapsed
      if (elapsedTime <= allowedTime){ // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
          swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
        }
        else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
          swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir)
      e.preventDefault()
    }, false)
  }
  static pixels(url, a, b, func){
    let i = new Image(a,b);
    i.src = url;
    let canva = document.createElement("canvas");
    canva.height = i.height;
    canva.width = i.width;
    let ctx = canva.getContext("2d");
    let red=[];
    let green=[];
    let blue=[];
    let alpha=[];
    let all=[];
    i.onload = function(){
      ctx.drawImage(i, 0, 0, i.width, i.height);
      // console.log("url",canva.toDataURL());
      let d = ctx.getImageData(0,0,canva.width,canva.height).data;
      for(let i=0; i<d.length; i+=4){
        red.push(d[i]);
        green.push(d[i+1]);
        blue.push(d[i+2]);
        alpha.push(d[i+3]);
      }
      for(let i=0; i<d.length; i++){
        all.push(d[i])
      }
      // console.log({"red":red, "green": green, "blue": blue, "alpha": alpha});
      func({"all":all, "red":red, "green": green, "blue": blue, "alpha": alpha})
    }
    // document.body.append(canva);
  }

}
class crypto{
  static encrypt(s, k){
    let words = [" ","`","1","2","3","4","5","6","7","8","9","0","-","=","q","w","e","r","t","y","u","i","o","p","[","]","\\","a","s","d","f","g","h","j","k","l",";","'","z","x","c","v","b","n","m",",",".","/","~","!","@","#","$","%","^","&","*","(",")","_","+","Q","W","E","R","T","Y","U","I","O","P","{","}","|","A","S","D","F","G","H","J","K","L",":","\"","Z","X","C","V","B","N","M","<",">","?"]
    // let plaintext = new Matrix(words.length, 1)
    // let key = new Matrix(1, words.length)
    let cipher = new Matrix(words.length, words.length)
    let n = 0
    //putting words in cipher
    for (let i = 0; i < words.length; i++) {
      if(i>0){
        for (let  j = 0; j < n+1; j++) {
          if(j<words.length){
            cipher.data[i][n-1-j] = words[(words.length-1)-j]
          }else{
            console.log("end")
          }
        }
      }
      for (let j = 0; j < words.length-n; j++) {
        cipher.data[i][j+n] = words[j]
      }
      n++
    }
// //putting words in plaintext
//     for(let i=0; i<words.length; i++){
//       plaintext.data[i][0] = words[i]
//     }
//     //putting words in key
//     for(let i=0; i<words.length; i++){
//       key.data[0][i] = words[i]
//     }
    let ky = []
    let ke
    for(let i=0; i<s.length; i++){
      for(let j=0; j<k.length; j++){
        if(ky.length<s.length){
          ky.push(k[j])
        }
      }
    }
    ke = ky.join("")
    // console.log(ky)
    console.log(ke)
    let data = []
    for(let i=0; i<s.length; i++){
      let x = words.indexOf(s[i])
      let y = words.indexOf(ke[i])
      data.push({x:x, y:y})
    }
    // console.log(data)
    let enp = []
    for(let i=0; i<data.length; i++){
      enp.push(cipher.data[data[i].x][data[i].y])
      // console.log(cipher.data[data[i].x][data[i].y])
    }
    enp = enp.join("")
    return enp
  }

  static decrypt(e, k){
    let words = [" ","`","1","2","3","4","5","6","7","8","9","0","-","=","q","w","e","r","t","y","u","i","o","p","[","]","\\","a","s","d","f","g","h","j","k","l",";","'","z","x","c","v","b","n","m",",",".","/","~","!","@","#","$","%","^","&","*","(",")","_","+","Q","W","E","R","T","Y","U","I","O","P","{","}","|","A","S","D","F","G","H","J","K","L",":","\"","Z","X","C","V","B","N","M","<",">","?"]
    let cipher = new Matrix(words.length, words.length)
    let n = 0
    //putting words in cipher
    for (let i = 0; i < words.length; i++) {
      if(i>0){
        for (let  j = 0; j < n+1; j++) {
          if(j<words.length){
            cipher.data[i][n-1-j] = words[(words.length-1)-j]
          }else{
            console.log("end")
          }
        }
      }
      for (let j = 0; j < words.length-n; j++) {
        cipher.data[i][j+n] = words[j]
      }
      n++
    }
    let ky = []
    let ke
    for(let i=0; i<e.length; i++){
      for(let j=0; j<k.length; j++){
        if(ky.length<e.length){
          ky.push(k[j])
        }
      }
    }
    ke = ky.join("")
    console.log(cipher)
    let data = new Array()
    for(let i = 0; i<e.length; i++){
      let y = words.indexOf(ke[i])
      // let x = cipher.data[x]
      // console.log()
    }



  }

}
class cookie{
  static setItem(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  static getItem(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  static checkItem() {
    var user=getCookie("username");
    if (user != "") {
      alert("Welcome again " + user);
    } else {
      user = prompt("Please enter your name:","");
      if (user != "" && user != null) {
        setCookie("username", user, 30);
      }
    }
  }
}
class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }
  static fromArray(arr) {
    return new Matrix(arr.length, 1).map((e, i) => arr[i]);
  }

  static subtract(a, b) {
    if(a.rows!==b.rows || a.cols!==b.cols){
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map(e => Math.random() * 2 - 1);
  }

  add(n) {
    if (n instanceof Matrix) {
      if(this.rows!==n.rows || this.cols!==n.cols){
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
        return this.map((e, i, j) => e + n.data[i][j]);
    } else {
      return this.map(e => e + n);
    }
  }
  static add(a, b){
    if(a.rows!==b.rows || a.cols!==b.cols){
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }
    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
    .map((_, i, j) => a.data[i][j] + b.data[i][j]);
  }
  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.')
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }


  multiply(n) {
    if (n instanceof Matrix) {
      if(this.rows!==n.rows || this.cols!==n.cols){
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map(e => e * n);
    }
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix, func) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => func(matrix.data[i][j], i, j));
  }

  print() {
    console.table(this.data);
    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if(typeof data == 'string')
    {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}

if (typeof module !== 'undefined') {
  module.exports = Matrix;
}

class math {
  constructor() {

  }
  static mouse(r){
    document.onmousemove = function(e){
      r(e.clientX, e.clientY)
    }
  }
  static sort(arr){
    let n = 0
    for (let i = n; i < arr.length; i++) {
      let smallest = arr[n]
      for(let j = n; j<arr.length; j++){
        if(arr[j]<smallest){
          smallest = arr[j]
          arr[j] = arr[n]
          arr[n] = smallest
        }
      }
      n+=1
    }
    // console.log(arr);
    return arr
  }

  static sigma(a){
    let sigma = new Array(a-1);
    if(a>2){
      sigma[0] = 1;
      sigma[1] = 1;
      for(let i = 2; i<sigma.length; i++){
        sigma[i] = sigma[i-1] + sigma[i-2];

      }
      // console.log(sigma[sigma.length-1]);
      return sigma[sigma.length-1];
    }else{
      // console.log(1);
      return 1;
    }
  }
  static rgba(arr){
    let r=[];
    let g=[];
    let b =[];
    let a = [];

    for (let i = 0; i < arr.length; i+=4) {
      r.push(arr[i]);
      g.push(arr[i+1]);
      b.push(arr[i+2]);
      a.push(arr[i+3]);
    }
    return {"red": r, "green": g, "blue": b, "alpha": a};
  }
  static cto(pixels, maxVal){
    let p=[];
    for (let i = 0; i < pixels.length; i++) {
      p.push(pixels[i]/maxVal);
    }
    return p;
  }
  static findmax(arr){
    let n = 0;
    let m;
    for (var i = 0; i < arr.length; i++) {
      if(arr[i]>n){
        m = i;
        n = arr[i];
      }
    }
    return m;
  }

  static add(a,b){
    return a+b;
  }
  static subtract(a,b){
    return a-b;
  }
  static multiply(a,b){
    return a*b;
  }
  static divide(a,b){
    return a/b;
  }

  static sumArray(arr){
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum+=arr[i];
    }
    return sum;
  }
  static turn(arr){
    for(let i=0; i<arr.length; i++){
      if(arr[i]>0.5){
        arr[i]=1;
      }else {
        arr[i]=0;
      }
    }
    return arr;
  }

  static bwp(p, func){
    let bl = new Array()
    for(let i=0; i<p.red.length; i++){
      let al = (p.red[i]+p.green[i]+p.blue[i]+p.alpha[i])/4
      let r = al
      let g = al
      let b = al
      let a = al
      bl.push(r)
      bl.push(g)
      bl.push(b)
      bl.push(a)
    }
    func(bl)
  }

  static toDataURL(url, a, b){
    let i = new Image(a,b);
    i.src = url;
    let canva = document.createElement("canvas");
    canva.height = i.height;
    canva.width = i.width;
    let ctx = canva.getContext("2d");
    i.onload = function(){
      ctx.drawImage(i, 0, 0, i.width, i.height);
      let data = canva.toDataURL();
      console.log(data);
      }
    }
    static encrypt(s, key){

    }
    static decrypt(e, key){


    }
    static encode(s){
      var chrsz  = 8;
      var hexcase = 0;
      function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      }
      function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
      function R (X, n) { return ( X >>> n ); }
      function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
      function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
      function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
      function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
      function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
      function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
      function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for ( var i = 0; i<m.length; i+=16 ) {
          a = HASH[0];
          b = HASH[1];
          c = HASH[2];
          d = HASH[3];
          e = HASH[4];
          f = HASH[5];
          g = HASH[6];
          h = HASH[7];
          for ( var j = 0; j<64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
            T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
            T2 = safe_add(Sigma0256(a), Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
          }
          HASH[0] = safe_add(a, HASH[0]);
          HASH[1] = safe_add(b, HASH[1]);
          HASH[2] = safe_add(c, HASH[2]);
          HASH[3] = safe_add(d, HASH[3]);
          HASH[4] = safe_add(e, HASH[4]);
          HASH[5] = safe_add(f, HASH[5]);
          HASH[6] = safe_add(g, HASH[6]);
          HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
      }
      function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
          bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
      }
      function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      }
      function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
          str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
          hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
        }
        return str;
      }
      s = Utf8Encode(s);
      return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
    }

}


function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  // return sigmoid(x) * (1s - sigmoid(x));
  return y * (1 - y);
}
function tanh(x){
  return Math.tanh(x)
}
function dtanh(y){
  return Math.pow(1/Math.cosh(y), 2)
}
// function tanh(x) {
//   var y = Math.tanh(x);
//   return y;
// }
//
// function dtanh(x) {
//   var y = 1 / (pow(Math.cosh(x), 2));
//   return y;
// }


class fnn {
  constructor(arr, lr) {
    if(arr instanceof fnn){
      let nn = arr
      this.neurons = []
      for(let i=0; i<nn.neurons.length; i++){
        this.neurons.push(nn.neurons[i])
      }
      this.weights = []
      nn.weights.forEach(weight=>{
        this.weights.push(new Matrix(weight.rows, weight.cols))
      })
      for(let k=0; k<nn.weights.length; k++){
        for(let i=0; i<nn.weights[k].rows; i++){
          for(let j=0; j<nn.weights[k].cols; j++){
            this.weights[k].data[i][j] = nn.weights[k].data[i][j]
          }
        }
      }
      this.bias = []
      nn.bias.forEach(b=>{
        this.bias.push(new Matrix(b.rows, b.cols))
      })
      for(let k=0; k<nn.bias.length; k++){
        for(let i=0; i<nn.bias[k].rows; i++){
          for(let j=0; j<nn.bias[k].cols; j++){
            this.bias[k].data[i][j] = nn.bias[k].data[i][j]
          }
        }
      }
      this.lr = nn.lr
    }else{
      this.neurons = [];
      this.weights = [];
      this.lr = lr || 0.01;
      this.bias = [];
      let arrlen = arr.length;
      for(let i=0; i<arrlen; i++){
        this.neurons.push(arr[i]);
      }
      for(let i=1; i<arrlen; i++){
        this.bias.push(new Matrix(this.neurons[i], 1).randomize());

      }
      for(let i=0; i<arrlen-1; i++){
        let weight = new Matrix(this.neurons[i+1], this.neurons[i]);
        weight.randomize();
        this.weights.push(weight);
      }
    }

  }
  predict(inputarr){
    let inputs = Matrix.fromArray(inputarr);
    let outputs = [];
    let weightlen = this.weights.length;
    for(let i=0; i<weightlen; i++){
      inputs = Matrix.multiply(this.weights[i], inputs)
      inputs.add(this.bias[i])
      inputs.map(tanh);
      outputs.push(inputs);
    }
    return outputs;

  }
  query(arr){
  	let outputs = this.predict(arr);
  	let output = outputs[outputs.length-1].toArray();
  	return output;
  }

  learn(input, outputarr){
    let weightlen = this.weights.length;
    let output = this.predict(input);
    output = output[output.length-1];
  	let answer = Matrix.fromArray(outputarr);
  	let err = Matrix.subtract(answer, output);
  	let errors = [];
  	for (var i = this.weights.length - 1; i >= 0; i--) {
  		errors.push(err);
  		err = Matrix.multiply(Matrix.transpose(this.weights[i]), err);
  	}
    console.log(errors)
  	errors.reverse();
  	let outputs = [];
  	let inpout = [];
  	let inp = Matrix.fromArray(input)
    inpout.push(inp)
    for(let i=0; i<weightlen; i++){
      inp = Matrix.multiply(this.weights[i], inp).add(this.bias[i]);
      inp.map(tanh);
      outputs.push(inp);
      inpout.push(inp);
    }

   for (let i = 0; i < errors.length; i++) {
   	  let gradient = errors[i].multiply(Matrix.map(outputs[i], dtanh));
      this.bias[i] = this.bias[i].add(gradient)
   	  let dweight = Matrix.multiply(gradient, Matrix.transpose(inpout[i]));
   	  dweight.multiply(this.lr);
      this.weights[i] = this.weights[i].add(dweight);
   }
  }
copy(){
    let nn = new fnn(this)
    return nn
  }
  mutate(func){
    for(let i=0; i<this.weights.length; i++){
    this.weights[i].map(func)
    }
    for(let i=0; i<this.bias.length; i++){
      this.bias[i].map(func)
    }
  }
  setLearningRate(learn){
  	this.lr = learn;

  }
  download(filename){
    let arr = {
      "lr": this.lr,
      "neurons": this.neurons,
      "weights": this.weights
    }

    let datStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arr));
    let downloadNode = document.createElement("a");
    downloadNode.setAttribute("href", datStr);
    downloadNode.setAttribute("download", filename + ".json");
    downloadNode.click();
    downloadNode.remove();

  }
  upload(weights){
    for(let i=0; i<this.weights.length; i++){
      for (let m = 0; m < this.weights[i].rows; m++) {
        for (let n = 0; n < this.weights[i].cols; n++) {
          this.weights[i].data[m][n] = weights[i].data[m][n];
        }
      }
    }

  }
  accuracy(input, arr){
    let answer = arr;
    let output = this.query(input);
    answer = math.findmax(answer);
    output = math.findmax(output);
    let score = [];
    if(answer == output){
      score.push(1);
    }else{
      score.push(0);
    }
    let accuracy = math.sumArray(score)/score.length*100;
    return accuracy;

  }

}


// Word Vectors
// Based on: https://github.com/turbomaze/word2vecjson
// declare wordVecs globally to store wordVec.json data
class Word2Vec {

  static magnitude(a) {
    let sum = a.reduce((sum, val) => {
      return sum + val*val;
    }, 0);
    return Math.sqrt(sum);
  }

  // Cosine similarity!
  static distance(v1, v2) {
    // Check if v1 or v2 is a string then grab vector?
    // let v1 = wordVecs[word1];
    // let v2 = wordVecs[word2];

    let sum = v1.reduce((sum, a, i) => {
      return sum + a * v2[i];
    }, 0);
    return sum / (this.magnitude(v1) * this.magnitude(v2)); //magnitude is 1 for all feature vectors
  }

  // Add two word vectors
  static add(v1, v2) {
    return v1.map((a, i) => a + v2[i]);
  }

  // Subtract two word vectors
  static subtract(v1, v2) {
    return v1.map((a, i) => a - v2[i]);
  }

  // Average of two word vectors
  static average(v1, v2) {
    return v1.map((a, i) => (a + v2[i]) * 0.5);
  }

  static nearest(wordVecs, word, n=10) {
    let vec;
    if (word instanceof Array) {
      vec = word;
    } else {
      if (!wordVecs[word]) {
        return undefined;
      } else {
        vec = wordVecs[word];
      }
    }
    let words = [];
    let keys = Object.keys(wordVecs);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let d = this.distance(vec, wordVecs[key]);
      words.push({word: key, distance: d});
    }
    words.sort((a, b) => {
      return b.distance - a.distance;
    });
    return words.slice(0, n);
  }
}

//Recurrent Neural Network
class rnn{
  constructor(nIn, nHidden, nOut, lr){
    this.words = {'\n': 0, 'C': 31, '!': 3, ' ': 4, '"': 5, '%': 6, '$': 7, "'": 8, ')': 9, '(': 10, '*': 11, '-': 12, ',': 13, '/': 2, '.': 15, '1': 16, '0': 17, '3': 18, '2': 19, '5': 20, '4': 21, '7': 22, '6': 23, '9': 24, '8': 25, ';': 26, ':': 27, '?': 28, 'A': 29, '@': 30, '\xc3': 1, 'B': 32, 'E': 33, 'D': 34, 'G': 35, 'F': 36, 'I': 37, 'H': 38, 'K': 39, 'J': 40, 'M': 41, 'L': 42, 'O': 43, 'N': 44, 'Q': 45, 'P': 46, 'S': 47, 'R': 48, 'U': 49, 'T': 50, 'W': 51, 'V': 52, 'Y': 53, 'X': 54, 'd': 59, 'a': 55, 'c': 56, 'b': 57, 'e': 58, '\xa7': 14, 'g': 60, 'f': 61, 'i': 62, 'h': 63, 'k': 64, 'j': 65, 'm': 66, 'l': 67, 'o': 68, 'n': 69, 'q': 70, 'p': 71, 's': 72, 'r': 73, 'u': 74, 't': 75, 'w': 76, 'v': 77, 'y': 78, 'x': 79, 'z': 80}
    this.input = nIn
    this.hidden = nHidden
    this.output = nOut
    this.lr = lr
    this.U = new Matrix(nHidden, nIn).randomize() //weights b/w hidden and input
    this.V = new Matrix(nOut, nHidden).randomize() //weights b/w output and hidden
    this.H = new Matrix(nHidden, nHidden) //hidden state weights
    this.biash = new Matrix(nHidden, 1).randomize()
    this.biaso = new Matrix(nHidden, 1).randomize()
  }
  feedforward(input){
    let t = input.length
    let x = new Array()
    if(input instanceof Array){
      for(let i=0; i<t; i++){
        let b = new Array()
        b.push(input[i])
        x.push(Matrix.fromArray(b))
      }
    }else{
      for(let i=0; i<t; i++){
        let b = new Array()
        b.push(this.words[input[i]])
        x.push(Matrix.fromArray(b))
      }
    }
    let h = new Array()
    let y = new Array()
    h.push(new Matrix(this.hidden, 1))
    x.forEach(i => {
      h.push(Matrix.map(Matrix.multiply(this.U, i).add(Matrix.multiply(this.H, h[h.length-1])).add(this.biash), tanh))
      y.push(Matrix.map(Matrix.multiply(this.V, h[h.length-1]), tanh))
    })
    console.log(y);
  }
  query(x){
    return this.feedforward(x)
  }
  learn(input, output){
    let o = this.query(input)
    o = 0[output.length-1]
    let y = Matrix.fromArray(output)
    let oe = Matrix.subtract(y, o)
    let og = Matrix.map(o, dtanh)
    og.multiply(oe)
    og.multiply(lr)
    let dow = Matrix.multiply(og, )
    let he = Matrix.multiply(Matrix.transpose(this.V), oe)

  }
}

// class cnn {
//   constructor() {
//
//   }
// }
