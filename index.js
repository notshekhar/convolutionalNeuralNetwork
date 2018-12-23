let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
ctx.beginPath()
ctx.fillStyle = 'black'
ctx.rect(0,0, canvas.width, canvas.height)
ctx.fill()

let model
tf.tidy(()=>{
  tf.loadModel('/convolutionalNeuralNetwork/model.json')
  .then(m => model = m)
  // 'http://127.0.0.1:1906/weights.bin'
  // model = tf.sequential()
  // model.add(tf.layers.conv2d({
  //   inputShape: [28,28,1],
  //   kernelSize: 5,
  //   filters: 8,
  //   strides: 1,
  //   activation: 'relu',
  //   kernelInitializer: 'VarianceScaling'
  // }))
  // model.add(tf.layers.maxPooling2d({
  //   poolSize: [2,2],
  //   strides: [2,2]
  // }))
  // model.add(tf.layers.conv2d({
  //   kernelSize: 5,
  //   filters: 16,
  //   strides: 1,
  //   activation: 'relu',
  //   kernelInitializer: 'VarianceScaling'
  // }))
  // model.add(tf.layers.flatten())
  // model.add(tf.layers.dense({
  //   units: 10,
  //   // kernelInitializer: 'VarianceScaling',
  //   activation: 'softmax'
  // }))
  // model.compile({
  //   optimizer: tf.train.sgd(0.3),
  //   loss: tf.losses.meanSquaredError
  // })
})

let lastX, lastY
let x, y
let draw = false
canvas.onmousemove = e => {
  x = e.layerX
  y = e.layerY
  if(draw){
    ctx.beginPath()
    ctx.strokeStyle = "white"
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = 50
    if(lastX && lastY){
      ctx.moveTo(x, y)
      ctx.lineTo(lastX, lastY)
    }
    ctx.stroke()
  }
  lastX = x
  lastY = y
}
canvas.onmousedown = () => {
  draw = true
}
canvas.onmouseup = () => {
  draw = false
  slasho.pixels(canvas.toDataURL(), 28,28, data=>{
    //tidy is used to prevent from memory leakage of tensors
    tf.tidy(()=>{
      let input = tf.tensor(data.green, [1, 28, 28, 1])
      // input.print()
      let o = model.predict(input)
      o.print()
      //converting tensor to arr
      let values = o.dataSync()
      let output = Array.from(values)
      console.log(output)
      document.querySelector('.output').innerHTML = `Oh I know its, ${math.findmax(output)}`
    })
  })
  //to how many tensors are leaking
  // console.log(tf.memory().numTensors)
}
canvas.onmouseleave = () => {
  draw = false
}




// tf.tidy(()=>{
//   //getting data
//   let r = new XMLHttpRequest()
//   let input = []
//   let output = []
//   let arr = [0,0,0,0,0,0,0,0,0,0]
//   let inputTensor
//   let outputTensor
//   r.open("GET", "mnist_test.csv")
//   r.onloadstart = function(){
//     console.log("loading data")
//   }
//   r.onloadend = function(){
//     console.log("loaded")
//     let text = r.responseText
//     let lines = text.split(/\r\n|\n/)
//     for(let i=0; i<lines.length; i++){
//       let d = lines[i].split(",")
//       for(let i=1; i<d.length; i++){
//         d[i] = d[i]/255
//         input.push(d[i])
//       }
//       arr = [0,0,0,0,0,0,0,0,0,0]
//       arr[d[0]] = 1
//       for(let j=0; j<arr.length; j++){
//         output.push(arr[j])
//       }
//     }
//     let n = 10000
//     output.splice(n*10, 10)
//     console.log('done starting training')
//     inputTensor = tf.tensor(input, [n,28,28,1])
//     outputTensor = tf.tensor(output, [n, 10])
//     train().then(()=>console.log('training completed'))
//
//   }
//   r.send()
//   async function train(){
//     let response = await model.fit(inputTensor, outputTensor)
//     console.log(response.history.loss[0], tf.memory().numTensors)
//   }
// })
document.querySelector('#clear').onclick =()=>{
  ctx.beginPath()
  ctx.fillStyle = 'black'
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fill()
}
